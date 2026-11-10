import { FALLBACK_PRODUCTS, FALLBACK_CATEGORIES } from '@/data/fallbackProducts'
import type { Product, Category } from '@/types'

export type ProductWithCategory = Product & {
  category?: { id: string; name: string; slug: string }
}

/**
 * Fetches all active products for the storefront.
 * Returns instantly from the verified catalog — zero network latency.
 * Supabase is offline/paused; we serve directly from the local fallback data.
 */
export async function fetchAllProducts(): Promise<ProductWithCategory[]> {
  return FALLBACK_PRODUCTS as ProductWithCategory[]
}

/**
 * Fetches products enabled for AI virtual try-on.
 */
export async function fetchTryOnProducts(): Promise<ProductWithCategory[]> {
  return FALLBACK_PRODUCTS.filter(p => p.supports_tryon) as ProductWithCategory[]
}

/**
 * Fetches a single product by its unique ID.
 */
export async function fetchProductById(id: string): Promise<Product | null> {
  if (!id) return null
  return (FALLBACK_PRODUCTS.find(p => p.id === id) as Product) || null
}

/**
 * Fetches a single product by its URL slug.
 */
export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  if (!slug) return null
  return (FALLBACK_PRODUCTS.find(p => p.slug === slug) as Product) || null
}

/**
 * Fetches all categories.
 */
export async function fetchCategories(): Promise<Category[]> {
  return FALLBACK_CATEGORIES
}

/**
 * Fetches category by slug.
 */
export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  if (!slug) return null
  return FALLBACK_CATEGORIES.find(c => c.slug === slug) || null
}

/**
 * Fetches products in a specific collection/category.
 */
export async function fetchProductsByCategorySlug(slug: string): Promise<Product[]> {
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

  return FALLBACK_PRODUCTS.filter(p => {
    const name = p.name.toLowerCase()
    const brand = (p.brand || '').toLowerCase()
    const desc = (p.description || '').toLowerCase()
    const tags = (p.tags || []).join(' ').toLowerCase()
    return name.includes(term) || brand.includes(term) || desc.includes(term) || tags.includes(term)
  }) as Product[]
}
