import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, Zap, Star } from 'lucide-react'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { cn, formatPrice, discountPercent } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  className?: string
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const addItem = useCartStore(s => s.addItem)
  const { toggle, isWishlisted } = useWishlistStore()
  const wishlisted = isWishlisted(product.id)

  const primaryImage = product.images?.find(img => img.is_primary) ?? product.images?.[0]
  const secondaryImage = product.images?.[1]

  const discount = product.compare_price_paise
    ? discountPercent(product.compare_price_paise, product.selling_price_paise)
    : 0

  const defaultVariant = product.variants?.find(v => v.is_active && v.stock_quantity > 0)

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    toggle({
      product_id: product.id,
      product_name: product.name,
      product_slug: product.slug,
      image_url: primaryImage?.url ?? null,
      selling_price_paise: product.selling_price_paise,
      added_at: new Date().toISOString(),
    })
    toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist', {
      icon: wishlisted ? '💔' : '❤️',
      duration: 2000,
    })
  }

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!defaultVariant) {
      toast.error('Please select a size on the product page')
      return
    }
    addItem({
      id: defaultVariant.id,
      product_id: product.id,
      product_name: product.name,
      product_slug: product.slug,
      variant_sku: defaultVariant.sku,
      color: defaultVariant.color,
      color_hex: defaultVariant.color_hex,
      size: defaultVariant.size,
      image_url: primaryImage?.url ?? null,
      selling_price_paise: defaultVariant.selling_price_paise ?? product.selling_price_paise,
      quantity: 1,
    })
    toast.success('Added to cart!', { icon: '🛍️', duration: 2000 })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('product-card group', className)}
    >
      <Link to={`/product/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-ink/5">
          {primaryImage && (
            <>
              <img
                src={primaryImage.url}
                alt={primaryImage.alt_text ?? product.name}
                onLoad={() => setImageLoaded(true)}
                className={cn(
                  'product-image w-full h-full object-cover transition-all duration-500',
                  !imageLoaded && 'opacity-0',
                  imageLoaded && 'opacity-100',
                  secondaryImage && 'group-hover:opacity-0 absolute inset-0'
                )}
              />
              {secondaryImage && (
                <img
                  src={secondaryImage.url}
                  alt={secondaryImage.alt_text ?? product.name}
                  className="w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
              )}
            </>
          )}

          {/* No image placeholder */}
          {!primaryImage && (
            <div className="w-full h-full flex items-center justify-center bg-ink/5">
              <ShoppingBag size={40} className="text-ink/20" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discount > 0 && (
              <span className="badge-coral">{discount}% OFF</span>
            )}
            {product.is_featured && (
              <span className="badge-lime">Featured</span>
            )}
            {product.supports_tryon && (
              <span className="tryon-badge">
                <Zap size={10} />
                Try On
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className={cn(
              'absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm transition-all duration-200 opacity-0 group-hover:opacity-100',
              wishlisted && 'opacity-100 bg-coral/10'
            )}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              size={15}
              className={cn('transition-colors', wishlisted ? 'fill-coral text-coral' : 'text-ink/60')}
            />
          </button>

          {/* Quick add */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleQuickAdd}
              className="btn-lime w-full text-sm py-2.5 flex items-center justify-center gap-2"
            >
              <ShoppingBag size={15} />
              Quick Add
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          {product.brand && (
            <p className="text-xs text-ink/50 font-medium uppercase tracking-wider mb-0.5">
              {product.brand}
            </p>
          )}
          <h3 className="text-sm font-semibold text-ink line-clamp-2 mb-2">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-ink">
              {formatPrice(product.selling_price_paise)}
            </span>
            {product.compare_price_paise && (
              <span className="text-xs text-ink/40 line-through">
                {formatPrice(product.compare_price_paise)}
              </span>
            )}
          </div>

          {/* Colors */}
          {product.variants && product.variants.length > 0 && (
            <div className="flex items-center gap-1 mt-2">
              {[...new Set(product.variants.filter(v => v.color_hex).map(v => v.color_hex))]
                .slice(0, 5)
                .map(hex => (
                  <span
                    key={hex}
                    className="w-3.5 h-3.5 rounded-full border border-ink/20 flex-shrink-0"
                    style={{ backgroundColor: hex ?? undefined }}
                  />
                ))}
              {(new Set(product.variants.filter(v => v.color_hex).map(v => v.color_hex))).size > 5 && (
                <span className="text-2xs text-ink/40">+more</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
