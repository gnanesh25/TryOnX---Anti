import { useSearchParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { searchProducts } from '@/lib/productsService'
import { Search } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import { ProductGridSkeleton } from '@/components/ui/Skeletons'
import type { Product } from '@/types'

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''

  const { data, isLoading } = useQuery({
    queryKey: ['search', q],
    queryFn: () => searchProducts(q),
    enabled: !!q.trim(),
  })

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-white border-b border-ink/10 py-8">
        <div className="container max-w-screen-xl mx-auto px-4">
          <form
            onSubmit={e => {
              e.preventDefault()
              const fd = new FormData(e.currentTarget)
              const val = fd.get('q')?.toString().trim()
              if (val) setSearchParams({ q: val })
            }}
            className="flex items-center gap-3 max-w-xl"
          >
            <div className="flex-1 flex items-center gap-3 bg-ink/5 border border-ink/15 rounded-xl px-4 py-3 focus-within:border-ink/40 transition-colors">
              <Search size={18} className="text-ink/40" />
              <input
                name="q"
                defaultValue={q}
                placeholder="Search products, brands…"
                className="flex-1 bg-transparent text-ink placeholder:text-ink/40 outline-none text-base"
                autoFocus
              />
            </div>
            <button type="submit" className="btn-ink px-6 py-3">Search</button>
          </form>
          {q && <p className="text-ink/50 text-sm mt-3">{isLoading ? 'Searching…' : `${data?.length ?? 0} results for "${q}"`}</p>}
        </div>
      </div>

      <div className="container max-w-screen-xl mx-auto px-4 py-10">
        {!q.trim() ? (
          <div className="text-center py-20">
            <Search size={48} className="text-ink/20 mx-auto mb-4" />
            <p className="text-ink/40">Start typing to search for products</p>
          </div>
        ) : isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : data && data.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <h2 className="font-display font-bold text-2xl mb-2">No results for "{q}"</h2>
            <p className="text-ink/50 text-sm mb-6">Try different keywords or browse our categories.</p>
            <Link to="/shop" className="btn-lime inline-flex">Browse All</Link>
          </div>
        )}
      </div>
    </div>
  )
}
