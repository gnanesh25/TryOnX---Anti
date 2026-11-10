import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchCategoryBySlug, fetchProductsByCategorySlug } from '@/lib/productsService'
import ProductCard from '@/components/product/ProductCard'
import { ProductGridSkeleton } from '@/components/ui/Skeletons'
import type { Product, Category } from '@/types'
import { ArrowRight } from 'lucide-react'

export default function CollectionPage() {
  const { slug } = useParams<{ slug: string }>()

  const { data: category } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => fetchCategoryBySlug(slug as string),
    enabled: !!slug,
  })

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', 'collection', slug],
    queryFn: () => fetchProductsByCategorySlug(slug as string),
    enabled: !!slug,
  })

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div
        className="bg-ink text-cream py-16 relative overflow-hidden"
      >
        <div className="container max-w-screen-xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-xs text-cream/40 mb-4">
            <Link to="/" className="hover:text-cream transition-colors">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-cream transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-cream">{category?.name ?? slug}</span>
          </nav>
          <h1 className="font-display font-bold text-4xl md:text-5xl">
            {category?.name ?? (slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : 'Collection')}
          </h1>
          {category?.description && (
            <p className="text-cream/60 mt-3 max-w-lg">{category.description}</p>
          )}
        </div>
      </div>

      {/* Products */}
      <div className="container max-w-screen-xl mx-auto px-4 py-12">
        {isLoading ? (
          <ProductGridSkeleton count={12} />
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">👗</p>
            <h2 className="font-display font-bold text-2xl mb-2">Coming Soon</h2>
            <p className="text-ink/50 mb-6">Products in this category will be added soon.</p>
            <Link to="/shop" className="btn-lime inline-flex items-center gap-2">
              Browse All Products <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
