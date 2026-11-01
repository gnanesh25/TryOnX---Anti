import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Plus, Edit2, Trash2, Eye, EyeOff, X, Image as ImageIcon } from 'lucide-react'
import { slugify } from '@/lib/utils'
import type { Category } from '@/types'
import { toast } from 'sonner'

export default function AdminCategories() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  // Form states
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [sortOrder, setSortOrder] = useState('0')
  const [isActive, setIsActive] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true })
      if (error) throw error
      return data || []
    },
  })

  function openCreateModal() {
    setEditingCategory(null)
    setName('')
    setSlug('')
    setDescription('')
    setImageUrl('')
    setSortOrder('0')
    setIsActive(true)
    setIsModalOpen(true)
  }

  function openEditModal(category: Category) {
    setEditingCategory(category)
    setName(category.name)
    setSlug(category.slug)
    setDescription(category.description || '')
    setImageUrl(category.image_url || '')
    setSortOrder(category.sort_order.toString())
    setIsActive(category.is_active)
    setIsModalOpen(true)
  }

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('categories').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      toast.success('Category deleted')
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete category')
    },
  })

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !slug) {
      toast.error('Name and slug are required')
      return
    }

    setIsSubmitting(true)
    try {
      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update({
            name,
            slug,
            description: description || null,
            image_url: imageUrl || null,
            sort_order: parseInt(sortOrder) || 0,
            is_active: isActive,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingCategory.id)
        if (error) throw error
        toast.success('Category updated')
      } else {
        const { error } = await supabase.from('categories').insert({
          name,
          slug,
          description: description || null,
          image_url: imageUrl || null,
          sort_order: parseInt(sortOrder) || 0,
          is_active: isActive,
        })
        if (error) throw error
        toast.success('Category created')
      }

      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      setIsModalOpen(false)
    } catch (err: any) {
      toast.error(err.message || 'Failed to save category')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500">Organize store collections, navigation filters & banners</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-lime hover:bg-lime/90 text-ink font-semibold rounded-xl text-sm transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500 text-sm">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No categories found. Create your first category above.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Slug</th>
                  <th className="px-6 py-3.5">Description</th>
                  <th className="px-6 py-3.5">Order</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map(cat => (
                  <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                          {cat.image_url ? (
                            <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                              <ImageIcon size={16} />
                            </div>
                          )}
                        </div>
                        <span className="font-semibold text-gray-900">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{cat.slug}</td>
                    <td className="px-6 py-4 text-xs text-gray-500 max-w-xs truncate">
                      {cat.description || '—'}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-gray-700">{cat.sort_order}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        cat.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {cat.is_active ? <Eye size={12} /> : <EyeOff size={12} />}
                        {cat.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-1.5 text-gray-400 hover:text-lime-700 hover:bg-lime/10 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete category "${cat.name}"? Products in this category will become unassigned.`)) {
                              deleteCategoryMutation.mutate(cat.id)
                            }
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal / Dialog for Add & Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 p-1 text-gray-400 hover:text-gray-700 rounded-lg"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingCategory ? 'Edit Category' : 'Create Category'}
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => {
                    setName(e.target.value)
                    if (!editingCategory) setSlug(slugify(e.target.value))
                  }}
                  placeholder="e.g. Streetwear Tops"
                  className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Slug (URL Key) *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  placeholder="e.g. streetwear-tops"
                  className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Brief summary of items in this category..."
                  className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Hero Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={e => setSortOrder(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={e => setIsActive(e.target.checked)}
                      className="w-4 h-4 accent-lime"
                    />
                    Category is Visible
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-lime hover:bg-lime/90 text-ink font-semibold rounded-lg text-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
