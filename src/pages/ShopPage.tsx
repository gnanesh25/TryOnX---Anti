import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Filter, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { fetchAllProducts } from '@/lib/productsService'
import ProductCard from '@/components/product/ProductCard'
import { ProductGridSkeleton } from '@/components/ui/Skeletons'
import type { Product, ProductFilter } from '@/types'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
]

async function fetchProducts(filters: ProductFilter) {
  try {
    const selectStr = filters.category ? `
      *,
      category:categories!inner(slug, name),
      images:product_images(*),
      variants:product_variants(*)
    ` : `
      *,
      category:categories(slug, name),
      images:product_images(*),
      variants:product_variants(*)
    `

    let query = supabase
      .from('products')
      .select(selectStr, { count: 'exact' })
      .eq('is_active', true)

    if (filters.category) {
      query = query.eq('category.slug', filters.category)
    }
    if (filters.q) {
      query = query.or(`name.ilike.%${filters.q}%,brand.ilike.%${filters.q}%,tags.cs.{${filters.q}}`)
    }
    if (filters.supports_tryon) {
      query = query.eq('supports_tryon', true)
    }
    if (filters.min_price) {
      query = query.gte('selling_price_paise', filters.min_price * 100)
    }
    if (filters.max_price) {
      query = query.lte('selling_price_paise', filters.max_price * 100)
    }

    // Sorting
    switch (filters.sort) {
      case 'price_asc':
        query = query.order('selling_price_paise', { ascending: true })
        break
      case 'price_desc':
        query = query.order('selling_price_paise', { ascending: false })
        break
      default:
        query = query.order('created_at', { ascending: false })
    }

    const page = filters.page ?? 1
    const pageSize = filters.page_size ?? 28
    query = query.range((page - 1) * pageSize, page * pageSize - 1)

    const { data, count, error } = await query
    if (!error && data && data.length > 0) {
      return { products: data as Product[], total: count ?? data.length }
    }
  } catch (err) {
    console.warn('[ShopPage] Supabase offline, using local catalog filter:', err)
  }

  // Fallback to verified catalog
  let list = (await fetchAllProducts()) as Product[]
  if (filters.category) {
    const cat = filters.category.toLowerCase()
    list = list.filter(p => {
      const s = (p.category?.slug || '').toLowerCase()
      const tags = (p.tags || []).map(t => t.toLowerCase())
      return s.includes(cat) || tags.includes(cat)
    })
  }
  if (filters.q) {
    const q = filters.q.toLowerCase()
    list = list.filter(p => p.name.toLowerCase().includes(q) || (p.brand || '').toLowerCase().includes(q))
  }
  if (filters.supports_tryon) {
    list = list.filter(p => p.supports_tryon)
  }
  if (filters.min_price) {
    list = list.filter(p => p.selling_price_paise >= filters.min_price! * 100)
  }
  if (filters.max_price) {
    list = list.filter(p => p.selling_price_paise <= filters.max_price! * 100)
  }

  if (filters.sort === 'price_asc') {
    list.sort((a, b) => a.selling_price_paise - b.selling_price_paise)
  } else if (filters.sort === 'price_desc') {
    list.sort((a, b) => b.selling_price_paise - a.selling_price_paise)
  }

  const page = filters.page ?? 1
  const pageSize = filters.page_size ?? 28
  const pagedList = list.slice((page - 1) * pageSize, page * pageSize)

  return { products: pagedList, total: list.length }
}

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filterOpen, setFilterOpen] = useState(false)

  const filters: ProductFilter = {
    category: searchParams.get('category') ?? undefined,
    q: searchParams.get('q') ?? undefined,
    sort: (searchParams.get('sort') as ProductFilter['sort']) ?? 'newest',
    min_price: searchParams.get('min_price') ? Number(searchParams.get('min_price')) : undefined,
    max_price: searchParams.get('max_price') ? Number(searchParams.get('max_price')) : undefined,
    supports_tryon: searchParams.get('supports_tryon') === 'true',
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    page_size: 28,
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', 'shop', filters],
    queryFn: () => fetchProducts(filters),
  })

  function updateFilter(key: string, value: string | null) {
    const newParams = new URLSearchParams(searchParams)
    if (value === null) {
      newParams.delete(key)
    } else {
      newParams.set(key, value)
    }
    newParams.delete('page')
    setSearchParams(newParams)
  }

  const totalPages = data ? Math.ceil(data.total / (filters.page_size ?? 12)) : 0

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-white border-b border-ink/10 py-6">
        <div className="container max-w-screen-xl mx-auto px-4">
          <h1 className="section-heading">Shop All</h1>
          <p className="text-ink/50 text-sm mt-1">
            {data ? `${data.total} products` : 'Loading…'}
          </p>
        </div>
      </div>

      <div className="container max-w-screen-xl mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Category tabs */}
            {[
              { id: null, label: 'All' },
              { id: 'shirts', label: 'Shirts' },
              { id: 't-shirts', label: 'T-Shirts' },
              { id: 'women', label: 'Women' },
              { id: 'kids', label: 'Kids' },
            ].map(cat => {
              const active = (!filters.category && !cat.id) || filters.category === cat.id
              return (
                <button
                  key={cat.label}
                  onClick={() => updateFilter('category', cat.id)}
                  className={`filter-chip ${active ? 'active' : ''}`}
                >
                  {cat.label}
                </button>
              )
            })}

            {/* Try-on filter */}
            <button
              onClick={() => updateFilter('supports_tryon', filters.supports_tryon ? null : 'true')}
              className={`filter-chip ${filters.supports_tryon ? 'active' : ''}`}
            >
              ✨ AI Try-On
            </button>

            {/* Active q filter */}
            {filters.q && (
              <span className="filter-chip active flex items-center gap-1">
                "{filters.q}"
                <button onClick={() => updateFilter('q', null)}>
                  <X size={12} />
                </button>
              </span>
            )}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-3">
            <select
              value={filters.sort}
              onChange={e => updateFilter('sort', e.target.value)}
              className="text-sm border border-ink/20 rounded-lg px-3 py-2 bg-white text-ink outline-none focus:border-ink/50"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <ProductGridSkeleton count={12} />
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-coral font-semibold">Failed to load products.</p>
            <p className="text-ink/50 text-sm mt-2">Check your connection and try again.</p>
          </div>
        ) : data?.products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl mb-2">🔍</p>
            <h3 className="font-display font-semibold text-xl mb-2">No products found</h3>
            <p className="text-ink/50 text-sm">Try adjusting your filters or search terms.</p>
            <button
              onClick={() => setSearchParams({})}
              className="btn-lime mt-6 inline-flex items-center gap-2"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data?.products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => updateFilter('page', String(i + 1))}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      (filters.page ?? 1) === i + 1
                        ? 'bg-ink text-cream'
                        : 'bg-white border border-ink/20 text-ink hover:border-ink/50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
