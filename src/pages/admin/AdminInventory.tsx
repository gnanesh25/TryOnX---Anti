import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Search, AlertTriangle, Check, RefreshCw } from 'lucide-react'
import type { ProductVariant } from '@/types'
import { toast } from 'sonner'

interface ExtendedVariant extends ProductVariant {
  product?: {
    name: string
    slug: string
  }
}

export default function AdminInventory() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [filterLowStock, setFilterLowStock] = useState(false)
  const [editingStock, setEditingStock] = useState<Record<string, number>>({})

  const { data: variants = [], isLoading } = useQuery<ExtendedVariant[]>({
    queryKey: ['admin-inventory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_variants')
        .select(`
          *,
          product:products(name, slug)
        `)
        .order('stock_quantity', { ascending: true })
      if (error) throw error
      return (data || []) as ExtendedVariant[]
    },
  })

  const updateStockMutation = useMutation({
    mutationFn: async ({ id, stock_quantity }: { id: string; stock_quantity: number }) => {
      const { error } = await supabase
        .from('product_variants')
        .update({ stock_quantity })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-inventory'] })
      setEditingStock(prev => {
        const next = { ...prev }
        delete next[variables.id]
        return next
      })
      toast.success('Stock updated!')
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update stock')
    },
  })

  const filteredVariants = variants.filter(v => {
    const productName = v.product?.name || ''
    const matchesSearch = 
      v.sku.toLowerCase().includes(search.toLowerCase()) ||
      productName.toLowerCase().includes(search.toLowerCase()) ||
      (v.color && v.color.toLowerCase().includes(search.toLowerCase())) ||
      (v.size && v.size.toLowerCase().includes(search.toLowerCase()))
    const matchesLowStock = !filterLowStock || v.stock_quantity < 5
    return matchesSearch && matchesLowStock
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-sm text-gray-500">Monitor warehouse SKUs, manage low stock, and update levels in real-time</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by product, SKU, size, or color..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime"
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700 whitespace-nowrap self-start sm:self-auto">
          <input
            type="checkbox"
            checked={filterLowStock}
            onChange={e => setFilterLowStock(e.target.checked)}
            className="w-4 h-4 accent-lime"
          />
          Low Stock Only (&lt; 5 units)
        </label>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500 text-sm">Loading inventory SKUs...</div>
        ) : filteredVariants.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">No inventory items found matching your filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Product Title</th>
                  <th className="px-6 py-3.5">SKU</th>
                  <th className="px-6 py-3.5">Color & Size</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Available Stock</th>
                  <th className="px-6 py-3.5 text-right">Quick Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredVariants.map(variant => {
                  const isModified = editingStock[variant.id] !== undefined && editingStock[variant.id] !== variant.stock_quantity
                  const currentVal = editingStock[variant.id] !== undefined ? editingStock[variant.id] : variant.stock_quantity

                  return (
                    <tr key={variant.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {variant.product?.name || 'Unknown Product'}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-gray-600">
                        {variant.sku}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {variant.color_hex && (
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-gray-300"
                              style={{ backgroundColor: variant.color_hex }}
                            />
                          )}
                          <span className="text-xs font-medium text-gray-700">
                            {variant.color || 'Default'} / {variant.size || 'Standard'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {variant.stock_quantity <= 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700">
                            Out of stock
                          </span>
                        ) : variant.stock_quantity < 5 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
                            <AlertTriangle size={12} />
                            Low stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                            In stock
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          min="0"
                          value={currentVal}
                          onChange={e => {
                            const val = parseInt(e.target.value) || 0
                            setEditingStock(prev => ({ ...prev, [variant.id]: val }))
                          }}
                          className="w-20 px-2.5 py-1 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime"
                        />
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isModified ? (
                          <button
                            onClick={() => updateStockMutation.mutate({ id: variant.id, stock_quantity: currentVal })}
                            disabled={updateStockMutation.isPending}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-lime hover:bg-lime/90 text-ink font-semibold rounded-lg text-xs shadow-sm"
                          >
                            <Check size={14} />
                            Save
                          </button>
                        ) : (
                          <span className="text-xs text-gray-300">Saved</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
