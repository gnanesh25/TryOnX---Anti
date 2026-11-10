import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Sparkles, ShoppingBag, Star, ChevronRight, Filter } from 'lucide-react'
import { motion } from 'motion/react'
import { useQuery } from '@tanstack/react-query'
import { fetchAllProducts } from '@/lib/productsService'
import ProductCard from '@/components/product/ProductCard'
import { ProductGridSkeleton } from '@/components/ui/Skeletons'
import { cn } from '@/lib/utils'
import type { Product } from '@/types'

// Category data (backed by DB but with fallback display)
const CATEGORIES = [
  { label: 'Shirts', slug: 'shirts', emoji: '👔', color: 'bg-blue-50 border-blue-200' },
  { label: 'T-Shirts', slug: 't-shirts', emoji: '👕', color: 'bg-green-50 border-green-200' },
  { label: "Women's Collection", slug: 'women', emoji: '👗', color: 'bg-rose-50 border-rose-200' },
  { label: "Kids' Collection", slug: 'kids', emoji: '🧒', color: 'bg-yellow-50 border-yellow-200' },
]

function useAllProducts() {
  return useQuery({
    queryKey: ['products-home-all'],
    queryFn: () => fetchAllProducts(),
  })
}

export default function HomePage() {
  const { data: allProducts, isLoading } = useAllProducts()
  const [activeTab, setActiveTab] = useState<string>('all')

  // Helper to categorize product
  function matchCategory(p: Product & { category?: { slug: string; name: string } }, cat: string) {
    const slug = p.category?.slug?.toLowerCase() || ''
    const tags = (p.tags || []).map(t => t.toLowerCase())
    const name = p.name.toLowerCase()

    if (cat === 'shirts') {
      return (slug.includes('shirt') && !slug.includes('t-shirt')) ||
        (tags.includes('shirts') && !tags.includes('t-shirts')) ||
        (name.includes('shirt') && !name.includes('t-shirt') && !name.includes('polo'))
    }
    if (cat === 't-shirts') {
      return slug.includes('t-shirt') || tags.includes('t-shirts') || name.includes('t-shirt') || name.includes('polo')
    }
    if (cat === 'women') {
      return slug.includes('women') || tags.includes('women') || name.includes('dress') || name.includes('kurti') || name.includes('anarkali')
    }
    if (cat === 'kids') {
      return slug.includes('kids') || tags.includes('kids') || name.includes('kid') || name.includes('frock') || name.includes('mickey') || name.includes('pavadai')
    }
    return true
  }

  // Filtered products for active tab
  const displayProducts = useMemo(() => {
    if (!allProducts) return []
    if (activeTab === 'all') return allProducts
    return allProducts.filter(p => matchCategory(p, activeTab))
  }, [allProducts, activeTab])

  // Balanced featured items across all 4 categories (Shirts, T-shirts, Women, Kids)
  const balancedFeatured = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return []
    const shirts = allProducts.filter(p => matchCategory(p, 'shirts')).slice(0, 2)
    const tshirts = allProducts.filter(p => matchCategory(p, 't-shirts')).slice(0, 2)
    const women = allProducts.filter(p => matchCategory(p, 'women')).slice(0, 2)
    const kids = allProducts.filter(p => matchCategory(p, 'kids')).slice(0, 2)
    return [...shirts, ...tshirts, ...women, ...kids]
  }, [allProducts])

  // Category counts
  const counts = useMemo(() => {
    if (!allProducts) return { all: 0, shirts: 0, 't-shirts': 0, women: 0, kids: 0 }
    return {
      all: allProducts.length,
      shirts: allProducts.filter(p => matchCategory(p, 'shirts')).length,
      't-shirts': allProducts.filter(p => matchCategory(p, 't-shirts')).length,
      women: allProducts.filter(p => matchCategory(p, 'women')).length,
      kids: allProducts.filter(p => matchCategory(p, 'kids')).length,
    }
  }, [allProducts])

  return (
    <div className="overflow-x-hidden">
      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="relative bg-ink min-h-[90vh] flex items-center overflow-hidden">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(#C5F24A 1px, transparent 1px), linear-gradient(90deg, #C5F24A 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Glow blobs */}
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-lime/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-coral/20 rounded-full blur-[80px] pointer-events-none" />

        <div className="container max-w-screen-xl mx-auto px-4 py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <div className="inline-flex items-center gap-2 bg-lime/10 border border-lime/20 rounded-full px-4 py-2 mb-6">
                <Zap size={14} className="text-lime" />
                <span className="text-lime text-sm font-semibold">AI-Powered Virtual Try-On</span>
              </div>

              <h1 className="font-display text-display text-cream leading-none mb-6">
                Try It
                <br />
                <span className="text-lime">Virtually.</span>
                <br />
                Own Your{' '}
                <span className="relative">
                  Style.
                  <span className="absolute -bottom-2 left-0 right-0 h-1 bg-coral rounded-full" />
                </span>
              </h1>

              <p className="text-cream/60 text-lg leading-relaxed mb-10 max-w-md">
                Shop the latest fashion and see how it looks on{' '}
                <em>you</em> before buying — powered by AI.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/shop" className="btn-lime flex items-center justify-center gap-2 text-base">
                  <ShoppingBag size={18} />
                  Shop All Clothes
                </Link>
                <Link to="/try-on" className="btn-ghost border-cream/30 text-cream hover:bg-cream/10 hover:border-cream/60 flex items-center justify-center gap-2 text-base">
                  <Zap size={18} />
                  Try AI Feature
                </Link>
              </div>

              {/* Trust signals */}
              <div className="flex items-center gap-6 mt-12 pt-8 border-t border-cream/10">
                {[
                  { label: '50,000+', sub: 'Happy shoppers' },
                  { label: '1,000+', sub: 'Products' },
                  { label: '4.8★', sub: 'Average rating' },
                ].map(({ label, sub }) => (
                  <div key={label}>
                    <p className="font-display font-bold text-2xl text-lime">{label}</p>
                    <p className="text-cream/50 text-xs">{sub}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Hero visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Main fashion image placeholder */}
                <div className="aspect-[3/4] max-w-sm mx-auto bg-gradient-to-br from-cream/10 to-lime/10 rounded-3xl border border-cream/10 overflow-hidden flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="w-24 h-24 bg-lime/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles size={40} className="text-lime" />
                    </div>
                    <p className="font-display font-bold text-white text-lg mb-1">Virtual AI Fitting Room</p>
                    <p className="text-cream/60 text-xs max-w-xs">Instant photorealistic try-on across Shirts, T-Shirts, Women & Kids wear</p>
                  </div>
                </div>

                {/* Floating try-on card */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -left-12 top-1/3 glass-card bg-white/10 border-white/20 p-4 rounded-2xl max-w-[180px]"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-lime rounded-full flex items-center justify-center">
                      <Zap size={12} className="text-ink" />
                    </div>
                    <span className="text-cream text-xs font-semibold">AI Try-On</span>
                  </div>
                  <p className="text-cream/60 text-xs">See it on you before buying</p>
                </motion.div>

                {/* Floating price card */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute -right-8 bottom-1/4 bg-lime rounded-2xl p-4 max-w-[160px]"
                >
                  <Star size={14} className="text-ink mb-1 fill-ink" />
                  <p className="text-ink font-bold text-sm">Free Returns</p>
                  <p className="text-ink/60 text-xs">30-day easy returns</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── CATEGORY PILLS ───────────────────────────────── */}
      <section className="py-12 bg-cream">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-heading">Shop by Category</h2>
            <Link to="/shop" className="text-sm font-semibold text-ink/60 hover:text-ink flex items-center gap-1 transition-colors">
              View all <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <button
                  type="button"
                  onClick={() => setActiveTab(cat.slug)}
                  className={`w-full flex flex-col items-center gap-2 p-4 rounded-2xl border ${cat.color} hover:scale-105 transition-transform duration-200 group text-left`}
                >
                  <span className="text-3xl">{cat.emoji}</span>
                  <span className="text-xs font-semibold text-center text-ink leading-tight">
                    {cat.label}
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium">
                    {counts[cat.slug as keyof typeof counts] || 0} styles
                  </span>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COMPLETE COLLECTION SHOWCASE (ALL CLOTHES) ────── */}
      <section className="py-16 bg-white border-t border-b border-gray-100">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-lime/20 text-lime-900 text-xs font-bold px-2.5 py-1 rounded-full mb-2">
                <Sparkles size={13} className="text-lime-800" />
                <span>Featured Catalog</span>
              </div>
              <h2 className="section-heading">Explore All Outfits</h2>
              <p className="text-ink/60 text-sm mt-1">
                Browse our complete collection: Shirts, T-Shirts, Women & Kids wear — all AI Try-On ready!
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              {[
                { id: 'all', label: `All Outfits (${counts.all})` },
                { id: 'shirts', label: `👔 Shirts (${counts.shirts})` },
                { id: 't-shirts', label: `👕 T-Shirts (${counts['t-shirts']})` },
                { id: 'women', label: `👗 Women (${counts.women})` },
                { id: 'kids', label: `🧒 Kids (${counts.kids})` },
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'text-xs font-bold px-3.5 py-2 rounded-xl transition-all whitespace-nowrap border',
                    activeTab === tab.id
                      ? 'bg-ink text-lime border-ink shadow-sm'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : displayProducts && displayProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyProducts />
          )}
        </div>
      </section>

      {/* ─── AI TRY-ON PROMO ──────────────────────────────── */}
      <section className="py-20 bg-ink relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle at 30% 50%, #C5F24A 0%, transparent 60%), radial-gradient(circle at 70% 50%, #FF5B45 0%, transparent 60%)',
          }}
        />
        <div className="container max-w-screen-xl mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-lime/10 border border-lime/20 rounded-full px-4 py-2 mb-6">
                <Sparkles size={14} className="text-lime" />
                <span className="text-lime text-sm font-semibold">Powered by AI</span>
              </div>
              <h2 className="font-display font-bold text-4xl md:text-5xl text-cream mb-6">
                See It On You
                <br />
                <span className="text-lime">Before You Buy</span>
              </h2>
              <p className="text-cream/60 text-lg mb-10 leading-relaxed">
                Upload your photo. Pick any outfit from our store.
                Our AI generates a realistic preview — so you can shop with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/try-on" className="btn-lime flex items-center justify-center gap-2 text-base">
                  <Zap size={18} />
                  Try It Now — It's Free
                </Link>
                <Link to="/shop?supports_tryon=true" className="btn-ghost border-cream/30 text-cream hover:bg-cream/10 hover:border-cream/60 flex items-center justify-center gap-2 text-base">
                  Browse Try-On Products
                </Link>
              </div>
              {/* Step indicators */}
              <div className="grid grid-cols-3 gap-6 mt-16">
                {[
                  { step: '01', title: 'Pick an outfit', desc: 'Browse supported products' },
                  { step: '02', title: 'Upload your photo', desc: 'A clear front-facing photo works best' },
                  { step: '03', title: 'See the magic', desc: 'AI generates your preview instantly' },
                ].map(item => (
                  <div key={item.step} className="text-center">
                    <div className="w-10 h-10 bg-lime/10 border border-lime/30 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-lime text-xs font-bold">{item.step}</span>
                    </div>
                    <p className="text-cream font-semibold text-sm mb-1">{item.title}</p>
                    <p className="text-cream/40 text-xs">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── BALANCED FEATURED PICKS ACROSS ALL COLLECTIONS ── */}
      {balancedFeatured && balancedFeatured.length > 0 && (
        <section className="py-16 bg-cream">
          <div className="container max-w-screen-xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="section-heading">Featured Across Collections</h2>
                <p className="text-ink/50 text-sm mt-1">Hand-picked styles from Shirts, T-Shirts, Women & Kids wear</p>
              </div>
              <Link to="/shop" className="btn-ghost text-sm py-2 px-4 flex items-center gap-1">
                See All <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {balancedFeatured.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── VALUE PROPS ──────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🚚', title: 'Free Shipping', desc: 'On orders above ₹999 across India' },
              { icon: '🔁', title: 'Easy Returns', desc: '30-day hassle-free return policy' },
              { icon: '🔒', title: 'Secure Payments', desc: 'Razorpay-powered, 100% safe' },
              { icon: '🤖', title: 'AI Try-On', desc: 'See it on you before you buy' },
            ].map(item => (
              <div key={item.title} className="flex items-start gap-4 p-6 rounded-2xl bg-cream border border-ink/5">
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <h3 className="font-display font-semibold text-sm mb-1">{item.title}</h3>
                  <p className="text-ink/50 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function EmptyProducts() {
  return (
    <div className="text-center py-20">
      <ShoppingBag size={48} className="text-ink/20 mx-auto mb-4" />
      <h3 className="font-display font-semibold text-xl text-ink mb-2">No products found</h3>
      <p className="text-ink/50 text-sm mb-6">
        Try selecting a different category tab above.
      </p>
    </div>
  )
}
