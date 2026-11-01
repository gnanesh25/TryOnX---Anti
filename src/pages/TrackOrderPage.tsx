import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Package, Search } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { Order } from '@/types'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Order Received', color: 'text-amber-600 bg-amber-50' },
  confirmed: { label: 'Confirmed', color: 'text-blue-600 bg-blue-50' },
  processing: { label: 'Processing', color: 'text-purple-600 bg-purple-50' },
  packed: { label: 'Packed', color: 'text-indigo-600 bg-indigo-50' },
  shipped: { label: 'Shipped', color: 'text-cyan-600 bg-cyan-50' },
  out_for_delivery: { label: 'Out for Delivery', color: 'text-orange-600 bg-orange-50' },
  delivered: { label: 'Delivered', color: 'text-green-600 bg-green-50' },
  cancelled: { label: 'Cancelled', color: 'text-red-600 bg-red-50' },
}

export default function TrackOrderPage() {
  const [searchParams] = useSearchParams()
  const tokenFromUrl = searchParams.get('token') ?? ''

  const [token, setToken] = useState(tokenFromUrl)
  const [inputToken, setInputToken] = useState(tokenFromUrl)
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault()
    if (!inputToken.trim()) return
    setLoading(true)
    setError(null)
    setOrder(null)

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`*, items:order_items(*)`)
        .eq('tracking_token', inputToken.trim())
        .single()

      if (error || !data) {
        setError('Order not found. Please check your tracking token.')
        return
      }

      setOrder(data as Order)
      setToken(inputToken.trim())
    } catch {
      setError('Failed to fetch order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const statusInfo = order ? (STATUS_LABELS[order.status] ?? { label: order.status, color: 'text-ink bg-ink/10' }) : null

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-ink py-12">
        <div className="container max-w-screen-xl mx-auto px-4 text-center">
          <h1 className="font-display font-bold text-4xl text-cream mb-3">Track Your Order</h1>
          <p className="text-cream/60">Enter your tracking token to see your order status</p>
        </div>
      </div>

      <div className="container max-w-2xl mx-auto px-4 py-12">
        <form onSubmit={handleTrack} className="flex gap-3 mb-8">
          <input
            value={inputToken}
            onChange={e => setInputToken(e.target.value)}
            placeholder="Enter your order tracking token"
            className="flex-1 border border-ink/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-ink/50 transition-colors bg-white"
          />
          <button type="submit" disabled={loading} className="btn-lime flex items-center gap-2 px-6">
            <Search size={16} />
            Track
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600 mb-6">
            {error}
          </div>
        )}

        {order && statusInfo && (
          <div className="bg-white rounded-2xl border border-ink/10 overflow-hidden">
            <div className="p-6 border-b border-ink/10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-ink/40 mb-1">Order Number</p>
                  <p className="font-display font-bold text-xl">{order.order_number}</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                <div>
                  <p className="text-ink/40 text-xs">Payment</p>
                  <p className="font-medium capitalize">{order.payment_method.replace('_', ' ')} · {order.payment_status}</p>
                </div>
                <div>
                  <p className="text-ink/40 text-xs">Total</p>
                  <p className="font-bold">{formatPrice(order.total_paise)}</p>
                </div>
              </div>
            </div>

            {order.items && order.items.length > 0 && (
              <div className="p-6">
                <p className="font-semibold text-sm mb-4">Items Ordered</p>
                <div className="space-y-3">
                  {order.items.map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-14 bg-ink/5 rounded-lg overflow-hidden">
                        {item.image_url && <img src={item.image_url} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.product_name}</p>
                        <p className="text-xs text-ink/40">{item.size && `Size: ${item.size}`} {item.color && `· ${item.color}`}</p>
                        <p className="text-xs text-ink/60">Qty: {item.quantity} × {formatPrice(item.unit_price_paise)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
