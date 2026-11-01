import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, ExternalLink, CheckCircle, Package, Truck, User, MapPin } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { Order, OrderItem, OrderStatus, PaymentStatus } from '@/types'
import { toast } from 'sonner'

const ALL_STATUSES: OrderStatus[] = [
  'pending',
  'confirmed',
  'processing',
  'packed',
  'shipped',
  'out_for_delivery',
  'delivered',
  'cancelled',
  'return_requested',
  'returned',
  'refunded',
]

export default function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('pending')
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending')

  const { data: order, isLoading } = useQuery<Order | null>({
    queryKey: ['admin-order', id],
    queryFn: async () => {
      if (!id) return null
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!id,
  })

  useEffect(() => {
    if (order) {
      setSelectedStatus(order.status)
      setPaymentStatus(order.payment_status)
    }
  }, [order])

  const updateStatusMutation = useMutation({
    mutationFn: async ({ status, payStatus }: { status: OrderStatus; payStatus: PaymentStatus }) => {
      if (!id) return
      const { error } = await supabase
        .from('orders')
        .update({
          status,
          payment_status: payStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-order', id] })
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
      toast.success('Order status updated!')
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update order status')
    },
  })

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading order details...</div>
  }

  if (!order) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 mb-4">Order not found</p>
        <Link to="/admin/orders" className="text-lime font-medium underline">Back to orders</Link>
      </div>
    )
  }

  const addr = order.shipping_address

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/orders"
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order #{order.order_number}</h1>
            <p className="text-xs text-gray-400">
              Placed on {new Date(order.created_at).toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        <Link
          to={`/track-order?token=${order.tracking_token}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors self-start sm:self-auto"
        >
          <ExternalLink size={14} />
          Customer Tracking Link
        </Link>
      </div>

      {/* Status Controls Card */}
      <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Fulfillment Status
            </label>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value as OrderStatus)}
              className="px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg font-medium text-gray-800"
            >
              {ALL_STATUSES.map(s => (
                <option key={s} value={s}>{s.replace(/_/g, ' ').toUpperCase()}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Payment Status
            </label>
            <select
              value={paymentStatus}
              onChange={e => setPaymentStatus(e.target.value as PaymentStatus)}
              className="px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg font-medium text-gray-800"
            >
              {['pending', 'paid', 'failed', 'refunded'].map(s => (
                <option key={s} value={s}>{s.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={() => updateStatusMutation.mutate({ status: selectedStatus, payStatus: paymentStatus })}
          disabled={updateStatusMutation.isPending}
          className="w-full sm:w-auto px-5 py-2 bg-lime hover:bg-lime/90 text-ink font-semibold rounded-xl text-sm transition-colors shadow-sm disabled:opacity-50"
        >
          {updateStatusMutation.isPending ? 'Updating...' : 'Save Order Status'}
        </button>
      </div>

      {/* Customer and Shipping Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-gray-900 font-semibold text-sm border-b border-gray-100 pb-2">
            <User size={16} className="text-gray-400" />
            Customer Information
          </div>
          <div className="space-y-1 text-sm text-gray-600">
            <p className="font-semibold text-gray-900">{order.customer_name}</p>
            <p>{order.customer_email}</p>
            <p>{order.customer_phone}</p>
            {order.notes && (
              <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded mt-2">
                Note: {order.notes}
              </p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-gray-900 font-semibold text-sm border-b border-gray-100 pb-2">
            <MapPin size={16} className="text-gray-400" />
            Shipping Destination
          </div>
          <div className="text-sm text-gray-600 leading-relaxed">
            {addr ? (
              <>
                <p className="font-medium text-gray-900">{addr.first_name} {addr.last_name}</p>
                <p>{addr.address_line1}</p>
                {addr.address_line2 && <p>{addr.address_line2}</p>}
                <p>{addr.city}, {addr.state} - {addr.postal_code}</p>
              </>
            ) : (
              <p className="text-gray-400">Address not provided</p>
            )}
          </div>
        </div>
      </div>

      {/* Items in this Order */}
      <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100 font-semibold text-sm text-gray-800">
          Order Items ({order.items?.length || 0})
        </div>
        <div className="divide-y divide-gray-100">
          {order.items?.map((item: OrderItem) => (
            <div key={item.id} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.product_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No img</div>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">{item.product_name}</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    {item.size && <span>Size: {item.size}</span>}
                    {item.color && <span>• Color: {item.color}</span>}
                    <span>• SKU: {item.variant_sku}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatPrice(item.unit_price_paise)} × {item.quantity}
                  </div>
                </div>
              </div>
              <div className="font-semibold text-sm text-gray-900">
                {formatPrice(item.total_price_paise)}
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Summary Footer */}
        <div className="p-6 bg-gray-50/50 border-t border-gray-100 space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal_paise)}</span>
          </div>
          {order.discount_paise > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount {order.coupon_code ? `(${order.coupon_code})` : ''}</span>
              <span>- {formatPrice(order.discount_paise)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{order.shipping_paise === 0 ? 'FREE' : formatPrice(order.shipping_paise)}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-200">
            <span>Total Amount</span>
            <span>{formatPrice(order.total_paise)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
