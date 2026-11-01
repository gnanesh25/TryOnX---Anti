import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Package, ShoppingCart, AlertTriangle, TrendingUp } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [ordersRes, productsRes] = await Promise.all([
        supabase.from('orders').select('id, total_paise, status, payment_status, created_at'),
        supabase.from('products').select('id, is_active'),
      ])

      const orders = ordersRes.data ?? []
      const products = productsRes.data ?? []

      const totalOrders = orders.length
      const pendingOrders = orders.filter(o => o.status === 'pending').length
      const confirmedRevenue = orders
        .filter(o => o.payment_status === 'paid')
        .reduce((sum, o) => sum + (o.total_paise ?? 0), 0)
      const codRevenue = orders
        .filter(o => o.payment_status === 'pending' && o.status === 'delivered')
        .reduce((sum, o) => sum + (o.total_paise ?? 0), 0)
      const totalProducts = products.filter(p => p.is_active).length

      return { totalOrders, pendingOrders, confirmedRevenue, codRevenue, totalProducts, recentOrders: orders.slice(0, 5) }
    },
  })

  const metricCards = [
    { label: 'Total Orders', value: stats?.totalOrders ?? 0, icon: ShoppingCart, color: 'bg-blue-50 text-blue-700' },
    { label: 'Pending Orders', value: stats?.pendingOrders ?? 0, icon: AlertTriangle, color: 'bg-amber-50 text-amber-700' },
    { label: 'Confirmed Revenue', value: formatPrice(stats?.confirmedRevenue ?? 0), icon: TrendingUp, color: 'bg-green-50 text-green-700' },
    { label: 'Active Products', value: stats?.totalProducts ?? 0, icon: Package, color: 'bg-purple-50 text-purple-700' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {metricCards.map(card => (
          <div key={card.label} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${card.color}`}>
              <card.icon size={20} />
            </div>
            <p className="text-sm text-gray-500 mb-1">{card.label}</p>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      {/* COD notice */}
      {(stats?.codRevenue ?? 0) > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-700">
          <strong>COD Collection Pending:</strong> {formatPrice(stats?.codRevenue ?? 0)} — collected on delivery, not yet confirmed as paid.
        </div>
      )}

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="font-semibold text-lg mb-4">Recent Orders</h2>
        {!stats?.recentOrders?.length ? (
          <p className="text-gray-400 text-sm">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-gray-400 font-medium">Order</th>
                  <th className="text-left py-2 text-gray-400 font-medium">Status</th>
                  <th className="text-left py-2 text-gray-400 font-medium">Payment</th>
                  <th className="text-right py-2 text-gray-400 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order: any) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 font-mono text-xs">{order.id.slice(0, 8).toUpperCase()}</td>
                    <td className="py-3">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded capitalize">{order.status}</span>
                    </td>
                    <td className="py-3">
                      <span className="text-xs capitalize">{order.payment_status}</span>
                    </td>
                    <td className="py-3 text-right font-semibold">{formatPrice(order.total_paise)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
