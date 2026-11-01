import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle2, Package, MapPin, Clock } from 'lucide-react'

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('order')
  const token = searchParams.get('token')

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="max-w-lg w-full mx-4 text-center">
        <div className="bg-white rounded-3xl p-10 border border-ink/5 shadow-xl">
          <div className="w-20 h-20 bg-lime/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-lime" />
          </div>
          <h1 className="font-display font-bold text-3xl mb-3">Order Placed! 🎉</h1>
          <p className="text-ink/60 mb-8">
            Thank you for shopping with TryOnX! Your order has been received and is being processed.
          </p>

          <div className="bg-cream rounded-2xl p-4 mb-8 text-left space-y-3">
            {[
              { icon: Package, label: 'Order Placed', done: true },
              { icon: Clock, label: 'Processing', done: false },
              { icon: MapPin, label: 'Out for Delivery', done: false },
              { icon: CheckCircle2, label: 'Delivered', done: false },
            ].map(({ icon: Icon, label, done }) => (
              <div key={label} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-lime text-ink' : 'bg-ink/10 text-ink/30'}`}>
                  <Icon size={16} />
                </div>
                <span className={`text-sm font-medium ${done ? 'text-ink' : 'text-ink/40'}`}>{label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {token && (
              <Link
                to={`/track-order?token=${token}`}
                className="btn-ink flex items-center justify-center gap-2"
              >
                <Package size={18} />
                Track Your Order
              </Link>
            )}
            <Link to="/shop" className="btn-ghost flex items-center justify-center gap-2">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
