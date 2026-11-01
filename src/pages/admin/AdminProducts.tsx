import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { 
  Plus, Search, Edit2, Trash2, Eye, EyeOff, 
  ExternalLink, Sparkles 
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { Product, Category } from '@/types'
import { toast } from 'sonner'

export default function AdminProducts() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*').order('name')
      if (error) throw error
      return data || []
    },
  })

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          images:product_images(*),
          variants:product_variants(*)
        `)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data || []
    },
  })

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('products')
        .update({ is_active })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      toast.success('Product status updated')
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update status')
    },
  })

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      toast.success('Product deleted')
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete product')
    },
  })

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || p.category_id === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">Manage your catalog, variants, and AI try-on assets</p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-lime hover:bg-lime/90 text-ink font-semibold rounded-xl text-sm transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, brand, or slug..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime text-gray-700"
        >
          <option value="all">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500 text-sm">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 text-sm">No products found</p>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="text-xs text-lime font-medium underline mt-2"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Product</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Price</th>
                  <th className="px-6 py-3.5">Variants & Stock</th>
                  <th className="px-6 py-3.5">Try-On</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map(product => {
                  const primaryImg = product.images?.find(i => i.is_primary)?.url || product.images?.[0]?.url
                  const totalStock = product.variants?.reduce((acc, v) => acc + (v.stock_quantity || 0), 0) ?? 0

                  return (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-14 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                            {primaryImg ? (
                              <img src={primaryImg} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No img</div>
                            )}
                          </div>
                          <div>
                            <span className="font-medium text-gray-900 line-clamp-1">{product.name}</span>
                            <span className="text-xs text-gray-400 block">{product.brand || 'TryOnX Original'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-gray-100 rounded-md text-xs font-medium text-gray-700">
                          {product.category?.name || 'Unassigned'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {formatPrice(product.selling_price_paise)}
                        {product.compare_price_paise && (
                          <span className="text-xs text-gray-400 line-through block">
                            {formatPrice(product.compare_price_paise)}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <span className="text-xs font-semibold text-gray-800">
                            {product.variants?.length || 0} variants
                          </span>
                          <span className={`text-xs block ${totalStock > 0 ? 'text-green-600' : 'text-red-500 font-medium'}`}>
                            {totalStock > 0 ? `${totalStock} in stock` : 'Out of stock'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {product.supports_tryon ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-lime/15 text-ink font-semibold rounded-md text-xs">
                            <Sparkles size={12} className="text-lime-600" />
                            Active
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">Disabled</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleActiveMutation.mutate({ id: product.id, is_active: !product.is_active })}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                            product.is_active 
                              ? 'bg-green-50 text-green-700 hover:bg-green-100' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {product.is_active ? <Eye size={12} /> : <EyeOff size={12} />}
                          {product.is_active ? 'Live' : 'Draft'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/product/${product.slug}`}
                            target="_blank"
                            title="View on store"
                            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <ExternalLink size={16} />
                          </Link>
                          <Link
                            to={`/admin/products/${product.id}/edit`}
                            title="Edit"
                            className="p-1.5 text-gray-400 hover:text-lime-700 hover:bg-lime/10 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} />
                          </Link>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
                                deleteProductMutation.mutate(product.id)
                              }
                            }}
                            title="Delete"
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
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
