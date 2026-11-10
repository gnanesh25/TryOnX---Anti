import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { fetchProductBySlug, fetchAllProducts } from '@/lib/productsService'
import { ShoppingBag, Heart, Zap, ChevronLeft, ChevronRight, Star, Truck, RefreshCcw, Shield } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'motion/react'
import { cn, formatPrice, discountPercent } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { ProductDetailSkeleton } from '@/components/ui/Skeletons'
import ProductCard from '@/components/product/ProductCard'
import type { Product, ProductVariant } from '@/types'

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const addItem = useCartStore(s => s.addItem)
  const { toggle, isWishlisted } = useWishlistStore()

  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => fetchProductBySlug(slug as string),
    enabled: !!slug,
  })

  const { data: relatedProducts } = useQuery({
    queryKey: ['products', 'related', product?.category_id],
    queryFn: async () => {
      const all = await fetchAllProducts()
      return all
        .filter(p => p.category_id === product?.category_id && p.id !== product?.id)
        .slice(0, 4) as Product[]
    },
    enabled: !!product?.category_id,
  })

  if (isLoading) return <ProductDetailSkeleton />
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <p className="text-5xl mb-4">😢</p>
          <h2 className="font-display font-bold text-2xl mb-2">Product not found</h2>
          <Link to="/shop" className="btn-lime mt-4 inline-flex">Browse All Products</Link>
        </div>
      </div>
    )
  }

  const images = product.images ?? []
  const variants = product.variants ?? []
  const colors = [...new Map(variants.filter(v => v.color).map(v => [v.color, v])).values()]
  const sizes = [...new Set(variants.filter(v => v.size).map(v => v.size))]

  const selectedVariant = variants.find(v =>
    (!selectedColor || v.color === selectedColor) &&
    (!selectedSize || v.size === selectedSize) &&
    v.is_active
  )

  const inStock = selectedVariant ? selectedVariant.stock_quantity > 0 : variants.some(v => v.stock_quantity > 0)
  const price = selectedVariant?.selling_price_paise ?? product.selling_price_paise
  const comparePrice = selectedVariant?.compare_price_paise ?? product.compare_price_paise
  const discount = comparePrice ? discountPercent(comparePrice, price) : 0
  const wishlisted = isWishlisted(product.id)
  const primaryImage = images[0]

  function handleAddToCart() {
    if (!product) return
    if (sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size')
      return
    }
    if (!selectedVariant) {
      toast.error('Selected combination is unavailable')
      return
    }
    if (selectedVariant.stock_quantity < quantity) {
      toast.error(`Only ${selectedVariant.stock_quantity} left in stock`)
      return
    }

    addItem({
      id: selectedVariant.id,
      product_id: product.id,
      product_name: product.name,
      product_slug: product.slug,
      variant_sku: selectedVariant.sku,
      color: selectedVariant.color,
      color_hex: selectedVariant.color_hex,
      size: selectedVariant.size,
      image_url: primaryImage?.url ?? null,
      selling_price_paise: price,
      quantity,
    })
    toast.success('Added to cart!', { icon: '🛍️' })
  }

  function handleBuyNow() {
    handleAddToCart()
    navigate('/cart')
  }

  function handleWishlist() {
    if (!product) return
    toggle({
      product_id: product.id,
      product_name: product.name,
      product_slug: product.slug,
      image_url: primaryImage?.url ?? null,
      selling_price_paise: price,
      added_at: new Date().toISOString(),
    })
    toast.success(wishlisted ? 'Removed from wishlist' : 'Saved to wishlist!', {
      icon: wishlisted ? '💔' : '❤️',
    })
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="container max-w-screen-xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-ink/40 mb-8">
          <Link to="/" className="hover:text-ink transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-ink transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Image gallery */}
          <div className="space-y-3">
            {/* Main image */}
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  src={images[selectedImageIndex]?.url ?? '/placeholder.png'}
                  alt={images[selectedImageIndex]?.alt_text ?? product.name}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Nav arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex(i => Math.max(0, i - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                    disabled={selectedImageIndex === 0}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex(i => Math.min(images.length - 1, i + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                    disabled={selectedImageIndex === images.length - 1}
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {discount > 0 && <span className="badge-coral">{discount}% OFF</span>}
                {product.supports_tryon && (
                  <span className="tryon-badge"><Zap size={12} />AI Try-On</span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImageIndex(i)}
                    className={cn(
                      'flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all',
                      i === selectedImageIndex ? 'border-ink' : 'border-transparent opacity-60 hover:opacity-100'
                    )}
                  >
                    <img src={img.url} alt={img.alt_text ?? ''} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product info */}
          <div className="space-y-6">
            {/* Brand & Title */}
            {product.brand && (
              <p className="text-xs text-ink/50 font-semibold uppercase tracking-widest">{product.brand}</p>
            )}
            <h1 className="font-display font-bold text-3xl text-ink leading-tight">{product.name}</h1>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-display font-bold text-3xl text-ink">{formatPrice(price)}</span>
              {comparePrice && (
                <span className="text-lg text-ink/40 line-through">{formatPrice(comparePrice)}</span>
              )}
              {discount > 0 && (
                <span className="badge-coral">{discount}% OFF</span>
              )}
            </div>

            {/* Colors */}
            {colors.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-ink mb-2">
                  Color: <span className="text-ink/60 font-normal">{selectedColor ?? 'Select a color'}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {colors.map(v => (
                    <button
                      key={v.color}
                      onClick={() => setSelectedColor(v.color)}
                      title={v.color ?? undefined}
                      className={cn(
                        'w-8 h-8 rounded-full border-2 transition-all hover:scale-110',
                        selectedColor === v.color ? 'border-ink scale-110' : 'border-ink/20'
                      )}
                      style={{ backgroundColor: v.color_hex ?? '#ccc' }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-ink">
                    Size: <span className="text-ink/60 font-normal">{selectedSize ?? 'Select a size'}</span>
                  </p>
                  <button className="text-xs text-ink/40 underline hover:text-ink transition-colors">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(size => {
                    const variant = variants.find(v =>
                      v.size === size &&
                      (!selectedColor || v.color === selectedColor) &&
                      v.is_active
                    )
                    const available = variant && variant.stock_quantity > 0
                    return (
                      <button
                        key={size}
                        onClick={() => available && setSelectedSize(size)}
                        disabled={!available}
                        className={cn(
                          'min-w-[44px] h-11 px-3 rounded-lg border-2 text-sm font-semibold transition-all',
                          selectedSize === size
                            ? 'border-ink bg-ink text-cream'
                            : available
                            ? 'border-ink/20 hover:border-ink/60 text-ink'
                            : 'border-ink/10 text-ink/25 cursor-not-allowed line-through'
                        )}
                      >
                        {size}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="text-sm font-semibold text-ink mb-2">Quantity</p>
              <div className="inline-flex items-center border border-ink/20 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-11 h-11 flex items-center justify-center hover:bg-ink/5 transition-colors text-lg"
                >
                  −
                </button>
                <span className="w-12 text-center font-semibold text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(selectedVariant?.stock_quantity ?? 10, q + 1))}
                  className="w-11 h-11 flex items-center justify-center hover:bg-ink/5 transition-colors text-lg"
                >
                  +
                </button>
              </div>
              {selectedVariant && selectedVariant.stock_quantity <= 5 && selectedVariant.stock_quantity > 0 && (
                <p className="text-coral text-xs mt-2 font-medium">
                  Only {selectedVariant.stock_quantity} left in stock!
                </p>
              )}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="btn-ink flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={18} />
                {inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!inStock}
                className="btn-lime flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
              <button
                onClick={handleWishlist}
                className={cn(
                  'w-12 h-12 flex-shrink-0 rounded-xl border-2 flex items-center justify-center transition-all',
                  wishlisted ? 'border-coral bg-coral/5' : 'border-ink/20 hover:border-coral/60'
                )}
                aria-label="Wishlist"
              >
                <Heart size={18} className={wishlisted ? 'fill-coral text-coral' : 'text-ink/60'} />
              </button>
            </div>

            {/* Try-On */}
            {product.supports_tryon && (
              <Link
                to={`/try-on?product=${product.id}`}
                className="flex items-center gap-3 p-4 bg-lime/10 border border-lime/30 rounded-xl hover:bg-lime/20 transition-colors group"
              >
                <div className="w-10 h-10 bg-lime rounded-xl flex items-center justify-center flex-shrink-0">
                  <Zap size={18} className="text-ink" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-ink">Try It On Virtually</p>
                  <p className="text-xs text-ink/50">See how this looks on you with AI</p>
                </div>
                <ChevronRight size={16} className="ml-auto text-ink/40 group-hover:text-ink transition-colors" />
              </Link>
            )}

            {/* Delivery info */}
            <div className="space-y-3 pt-4 border-t border-ink/10">
              {[
                { icon: Truck, text: 'Free delivery on orders above ₹999' },
                { icon: RefreshCcw, text: '30-day easy returns & exchanges' },
                { icon: Shield, text: '100% secure checkout via Razorpay' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm text-ink/60">
                  <Icon size={16} className="text-ink/40 flex-shrink-0" />
                  {text}
                </div>
              ))}
            </div>

            {/* Description */}
            {product.description && (
              <div className="pt-4 border-t border-ink/10">
                <h3 className="font-semibold text-sm mb-2">About this product</h3>
                <p className="text-sm text-ink/60 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Material */}
            {product.material && (
              <div className="pt-2">
                <h3 className="font-semibold text-sm mb-1">Material</h3>
                <p className="text-sm text-ink/60">{product.material}</p>
              </div>
            )}

            {/* Care */}
            {product.care_instructions && (
              <div className="pt-2">
                <h3 className="font-semibold text-sm mb-1">Care Instructions</h3>
                <p className="text-sm text-ink/60">{product.care_instructions}</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section className="mt-20">
            <h2 className="section-heading mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
