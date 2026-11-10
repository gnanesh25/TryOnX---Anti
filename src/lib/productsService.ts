import { supabase } from './supabase'
import { FALLBACK_PRODUCTS, FALLBACK_CATEGORIES } from '@/data/fallbackProducts'
import type { Product, Category } from '@/types'

export type ProductWithCategory = Product & {
  category?: { id: string; name: string; slug: string }
}

/**
 * Fetches all active products for the storefront.
 * Seamlessly falls back to the verified catalog if Supabase is offline or paused.
 */
export async function fetchAllProducts(): Promise<ProductWithCategory[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name, slug),
        images:product_images(*),
        variants:product_variants(*)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: true })

    if (!error && data && data.length > 0) {
      return data as ProductWithCategory[]
    }
  } catch (err) {
    console.warn('[ProductsService] Supabase offline/unreachable, using verified catalog:', err)
  }
  return FALLBACK_PRODUCTS as ProductWithCategory[]
}

/**
 * Fetches products enabled for AI virtual try-on.
 */
export async function fetchTryOnProducts(): Promise<ProductWithCategory[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name, slug),
        images:product_images(*),
        variants:product_variants(*)
      `)
      .eq('is_active', true)
      .eq('supports_tryon', true)
      .order('created_at', { ascending: true })

    if (!error && data && data.length > 0) {
      return data as ProductWithCategory[]
    }
  } catch (err) {
    console.warn('[ProductsService] Supabase offline/unreachable, using verified try-on catalog:', err)
  }
  return FALLBACK_PRODUCTS.filter(p => p.supports_tryon) as ProductWithCategory[]
}

/**
 * Fetches a single product by its unique ID.
 */
export async function fetchProductById(id: string): Promise<Product | null> {
  if (!id) return null
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name, slug),
        images:product_images(*),
        variants:product_variants(*)
      `)
      .eq('id', id)
      .single()

    if (!error && data) {
      return data as Product
    }
  } catch (err) {
    console.warn('[ProductsService] Supabase query error for ID:', id, err)
  }
  return (FALLBACK_PRODUCTS.find(p => p.id === id) as Product) || null
}

/**
 * Fetches a single product by its URL slug.
 */
export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  if (!slug) return null
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name, slug),
        images:product_images(*),
        variants:product_variants(*)
      `)
      .eq('slug', slug)
      .single()

    if (!error && data) {
      return data as Product
    }
  } catch (err) {
    console.warn('[ProductsService] Supabase query error for slug:', slug, err)
  }
  return (FALLBACK_PRODUCTS.find(p => p.slug === slug) as Product) || null
}

/**
 * Fetches all categories.
 */
export async function fetchCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })

    if (!error && data && data.length > 0) {
      return data as Category[]
    }
  } catch (err) {
    console.warn('[ProductsService] Supabase categories offline, using verified categories:', err)
  }
  return FALLBACK_CATEGORIES
}

/**
 * Fetches category by slug.
 */
export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  if (!slug) return null
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single()

    if (!error && data) {
      return data as Category
    }
  } catch (err) {
    console.warn('[ProductsService] Supabase category query error for slug:', slug, err)
  }
  return FALLBACK_CATEGORIES.find(c => c.slug === slug) || null
}

/**
 * Fetches products in a specific collection/category.
 */
export async function fetchProductsByCategorySlug(slug: string): Promise<Product[]> {
  const cat = await fetchCategoryBySlug(slug)
  const catId = cat?.id

  if (catId) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name, slug),
          images:product_images(*),
          variants:product_variants(*)
        `)
        .eq('is_active', true)
        .eq('category_id', catId)
        .order('created_at', { ascending: false })

      if (!error && data && data.length > 0) {
        return data as Product[]
      }
    } catch (err) {
      console.warn('[ProductsService] Supabase collection query error:', err)
    }
  }

  // Fallback matching
  return FALLBACK_PRODUCTS.filter(p => {
    const s = (p.category?.slug || '').toLowerCase()
    const tags = (p.tags || []).map(t => t.toLowerCase())
    const q = slug.toLowerCase()
    return s.includes(q) || tags.includes(q)
  }) as Product[]
}

/**
 * Search products by query term.
 */
export async function searchProducts(searchTerm: string): Promise<Product[]> {
  const term = searchTerm.trim().toLowerCase()
  if (!term) return []

  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name, slug),
        images:product_images(*),
        variants:product_variants(*)
      `)
      .eq('is_active', true)
      .or(`name.ilike.%${term}%,brand.ilike.%${term}%,description.ilike.%${term}%`)
      .limit(24)

    if (!error && data && data.length > 0) {
      return data as Product[]
    }
  } catch (err) {
    console.warn('[ProductsService] Supabase search error:', err)
  }

  // Fallback search
  return FALLBACK_PRODUCTS.filter(p => {
    const name = p.name.toLowerCase()
    const brand = (p.brand || '').toLowerCase()
    const desc = (p.description || '').toLowerCase()
    const tags = (p.tags || []).join(' ').toLowerCase()
    return name.includes(term) || brand.includes(term) || desc.includes(term) || tags.includes(term)
  }) as Product[]
}
