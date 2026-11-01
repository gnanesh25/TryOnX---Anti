import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, Trash2 } from 'lucide-react'
import { useWishlistStore } from '@/store/wishlistStore'
import { formatPrice } from '@/lib/utils'

export default function WishlistPage() {
  const { items, remove } = useWishlistStore()

  return (
    <div className="min-h-screen bg-cream">
      <div className="container max-w-screen-xl mx-auto px-4 py-8">
        <h1 className="section-heading mb-2">My Wishlist</h1>
        <p className="text-ink/50 text-sm mb-8">
          {items.length} {items.length === 1 ? 'item' : 'items'} saved
          <span className="ml-2 text-ink/30">· Saved locally on this device</span>
        </p>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <Heart size={64} className="text-ink/20 mx-auto mb-6" />
            <h2 className="font-display font-bold text-2xl mb-3">Your wishlist is empty</h2>
            <p className="text-ink/50 mb-8">Save items you love and come back to them anytime.</p>
            <Link to="/shop" className="btn-lime inline-flex items-center gap-2">
              <ShoppingBag size={18} />
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map(item => (
              <div key={item.product_id} className="bg-white rounded-2xl overflow-hidden border border-ink/5 group">
                <Link to={`/product/${item.product_slug}`}>
                  <div className="aspect-[3/4] bg-ink/5 overflow-hidden">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.product_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag size={32} className="text-ink/20" />
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-3">
                  <Link to={`/product/${item.product_slug}`}>
                    <h3 className="text-sm font-semibold line-clamp-2 hover:text-coral transition-colors">
                      {item.product_name}
                    </h3>
                  </Link>
                  <p className="font-bold text-sm mt-1">{formatPrice(item.selling_price_paise)}</p>

                  <div className="flex gap-2 mt-3">
                    <Link
                      to={`/product/${item.product_slug}`}
                      className="flex-1 btn-lime text-xs py-2 text-center"
                    >
                      View Product
                    </Link>
                    <button
                      onClick={() => remove(item.product_id)}
                      className="p-2 rounded-lg border border-ink/20 hover:bg-red-50 hover:border-coral hover:text-coral transition-all"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
