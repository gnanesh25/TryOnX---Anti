import { Link } from 'react-router-dom'
import { ShoppingBag, Trash2, Plus, Minus } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'

const FREE_SHIPPING_THRESHOLD = 99900 // ₹999 in paise

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotalPaise } = useCartStore()
  const subtotal = subtotalPaise()
  const shippingPaise = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 9900
  const total = subtotal + shippingPaise

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={64} className="text-ink/20 mx-auto mb-6" />
          <h1 className="font-display font-bold text-3xl mb-3">Your cart is empty</h1>
          <p className="text-ink/50 mb-8">Add some amazing fashion pieces to get started!</p>
          <Link to="/shop" className="btn-lime inline-flex items-center gap-2">
            <ShoppingBag size={18} />
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="container max-w-screen-xl mx-auto px-4 py-8">
        <h1 className="section-heading mb-8">Shopping Cart ({items.length} items)</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.id} className="bg-white rounded-2xl p-4 flex gap-4 border border-ink/5">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.product_name}
                    className="w-20 h-24 object-cover rounded-xl flex-shrink-0"
                  />
                ) : (
                  <div className="w-20 h-24 bg-ink/5 rounded-xl flex-shrink-0 flex items-center justify-center">
                    <ShoppingBag size={24} className="text-ink/20" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <Link
                    to={`/product/${item.product_slug}`}
                    className="font-semibold text-sm hover:text-coral transition-colors line-clamp-2"
                  >
                    {item.product_name}
                  </Link>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {item.color && (
                      <span className="text-xs text-ink/40 flex items-center gap-1">
                        <span
                          className="w-3 h-3 rounded-full border border-ink/20"
                          style={{ backgroundColor: item.color_hex ?? '#ccc' }}
                        />
                        {item.color}
                      </span>
                    )}
                    {item.size && (
                      <span className="text-xs text-ink/40 bg-ink/5 px-2 py-0.5 rounded">Size: {item.size}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity */}
                    <div className="flex items-center border border-ink/20 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-ink/5 transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-ink/5 transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm">
                        {formatPrice(item.selling_price_paise * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 hover:text-coral transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-ink/5 sticky top-24">
              <h2 className="font-display font-semibold text-lg mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-ink/60">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink/60">Shipping</span>
                  <span className={shippingPaise === 0 ? 'text-green-600 font-semibold' : 'font-medium'}>
                    {shippingPaise === 0 ? 'FREE' : formatPrice(shippingPaise)}
                  </span>
                </div>
                {shippingPaise > 0 && (
                  <p className="text-xs text-ink/40">
                    Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping
                  </p>
                )}
              </div>

              <div className="border-t border-ink/10 pt-4 mb-6">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <p className="text-xs text-ink/40 mt-1">Inclusive of all taxes</p>
              </div>

              <Link
                to="/checkout"
                className="btn-lime w-full flex items-center justify-center gap-2 text-base"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/shop"
                className="text-center block mt-4 text-sm text-ink/50 hover:text-ink transition-colors"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
