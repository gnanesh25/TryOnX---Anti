import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Plus, Trash2, Sparkles, Image as ImageIcon } from 'lucide-react'
import type { Category, Product } from '@/types'
import { toast } from 'sonner'

interface VariantRow {
  id?: string
  sku: string
  color: string
  color_hex: string
  size: string
  stock_quantity: number
  selling_price_paise?: number | null
}

interface ImageRow {
  id?: string
  url: string
  alt_text: string
  is_primary: boolean
}

export default function AdminProductEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Basic info
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [brand, setBrand] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [description, setDescription] = useState('')
  const [sellingPrice, setSellingPrice] = useState('')
  const [comparePrice, setComparePrice] = useState('')
  const [material, setMaterial] = useState('')
  const [careInstructions, setCareInstructions] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)
  const [supportsTryon, setSupportsTryon] = useState(true)
  const [tryonGarmentUrl, setTryonGarmentUrl] = useState('')

  // Images
  const [images, setImages] = useState<ImageRow[]>([])

  // Variants
  const [variants, setVariants] = useState<VariantRow[]>([])

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*').order('name')
      if (error) throw error
      return data || []
    },
  })

  const { data: product, isLoading } = useQuery<Product | null>({
    queryKey: ['admin-product', id],
    queryFn: async () => {
      if (!id) return null
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          images:product_images(*),
          variants:product_variants(*)
        `)
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!id,
  })

  useEffect(() => {
    if (product) {
      setName(product.name)
      setSlug(product.slug)
      setBrand(product.brand || '')
      setCategoryId(product.category_id || '')
      setDescription(product.description || '')
      setSellingPrice((product.selling_price_paise / 100).toString())
      setComparePrice(product.compare_price_paise ? (product.compare_price_paise / 100).toString() : '')
      setMaterial(product.material || '')
      setCareInstructions(product.care_instructions || '')
      setTagsInput(product.tags ? product.tags.join(', ') : '')
      setIsActive(product.is_active)
      setIsFeatured(product.is_featured)
      setSupportsTryon(product.supports_tryon)
      setTryonGarmentUrl(product.tryon_garment_image_url || '')

      if (product.images && product.images.length > 0) {
        setImages(product.images.map(img => ({
          id: img.id,
          url: img.url,
          alt_text: img.alt_text || '',
          is_primary: img.is_primary,
        })))
      } else {
        setImages([{ url: '', alt_text: '', is_primary: true }])
      }

      if (product.variants && product.variants.length > 0) {
        setVariants(product.variants.map(v => ({
          id: v.id,
          sku: v.sku,
          color: v.color || '',
          color_hex: v.color_hex || '#000000',
          size: v.size || 'M',
          stock_quantity: v.stock_quantity,
          selling_price_paise: v.selling_price_paise,
        })))
      }
    }
  }, [product])

  function addImageRow() {
    setImages(prev => [...prev, { url: '', alt_text: '', is_primary: prev.length === 0 }])
  }

  function removeImageRow(idx: number) {
    setImages(prev => prev.filter((_, i) => i !== idx))
  }

  function setPrimaryImage(idx: number) {
    setImages(prev => prev.map((img, i) => ({ ...img, is_primary: i === idx })))
  }

  function addVariantRow() {
    setVariants(prev => [
      ...prev,
      { sku: `${(slug || 'ITEM').toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`, color: 'Black', color_hex: '#000000', size: 'M', stock_quantity: 10 },
    ])
  }

  function removeVariantRow(idx: number) {
    setVariants(prev => prev.filter((_, i) => i !== idx))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!id || !name || !slug) return

    const pricePaise = Math.round(parseFloat(sellingPrice || '0') * 100)
    if (isNaN(pricePaise) || pricePaise <= 0) {
      toast.error('Please enter a valid price in INR')
      return
    }

    const comparePricePaise = comparePrice ? Math.round(parseFloat(comparePrice) * 100) : null
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean)

    setIsSubmitting(true)

    try {
      // 1. Update product
      const { error: prodErr } = await supabase
        .from('products')
        .update({
          name,
          slug,
          brand: brand || null,
          category_id: categoryId || null,
          description: description || null,
          selling_price_paise: pricePaise,
          compare_price_paise: comparePricePaise,
          material: material || null,
          care_instructions: careInstructions || null,
          tags,
          is_active: isActive,
          is_featured: isFeatured,
          supports_tryon: supportsTryon,
          tryon_garment_image_url: tryonGarmentUrl || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (prodErr) throw prodErr

      // 2. Refresh images (delete and re-insert for sync)
      await supabase.from('product_images').delete().eq('product_id', id)
      const validImages = images
        .filter(img => img.url.trim() !== '')
        .map((img, index) => ({
          product_id: id,
          url: img.url.trim(),
          alt_text: img.alt_text || name,
          is_primary: img.is_primary,
          sort_order: index,
        }))

      if (validImages.length > 0) {
        await supabase.from('product_images').insert(validImages)
      }

      // 3. Update variants (upsert or refresh)
      await supabase.from('product_variants').delete().eq('product_id', id)
      const validVariants = variants.map(v => ({
        product_id: id,
        sku: v.sku.trim() || `${slug.toUpperCase()}-${v.size}-${v.color}`,
        color: v.color || null,
        color_hex: v.color_hex || null,
        size: v.size || null,
        stock_quantity: Number(v.stock_quantity) || 0,
        selling_price_paise: v.selling_price_paise || null,
        is_active: true,
      }))

      if (validVariants.length > 0) {
        await supabase.from('product_variants').insert(validVariants)
      }

      toast.success('Product updated successfully!')
      navigate('/admin/products')
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Failed to update product')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading product details...</div>
  }

  if (!product) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 mb-4">Product not found</p>
        <Link to="/admin/products" className="text-lime font-medium underline">Back to products</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <div className="flex items-center gap-4">
        <Link
          to="/admin/products"
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Product: {product.name}</h1>
          <p className="text-sm text-gray-500">Modify details, variants, and AI try-on images</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Product Title *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
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
                className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Brand / Collection
              </label>
              <input
                type="text"
                value={brand}
                onChange={e => setBrand(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime"
              >
                <option value="">Select Category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Selling Price (₹ INR) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={sellingPrice}
                onChange={e => setSellingPrice(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Compare At Price (₹ INR MRP)
              </label>
              <input
                type="number"
                step="0.01"
                value={comparePrice}
                onChange={e => setComparePrice(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime"
              />
            </div>
          </div>
        </div>

        {/* Media & TryOn Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-base font-semibold text-gray-900">Product Images & AI Try-On</h2>
            <button
              type="button"
              onClick={addImageRow}
              className="inline-flex items-center gap-1.5 text-xs text-lime font-semibold hover:underline"
            >
              <Plus size={14} /> Add Image URL
            </button>
          </div>

          <div className="space-y-3">
            {images.map((img, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200/60">
                <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {img.url ? (
                    <img src={img.url} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={18} className="text-gray-400" />
                  )}
                </div>
                <input
                  type="url"
                  placeholder="Image URL (https://...)"
                  value={img.url}
                  onChange={e => {
                    const newImages = [...images]
                    newImages[idx].url = e.target.value
                    setImages(newImages)
                  }}
                  className="flex-1 px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-lime"
                />
                <button
                  type="button"
                  onClick={() => setPrimaryImage(idx)}
                  className={`px-2.5 py-1 text-xs font-medium rounded ${
                    img.is_primary ? 'bg-lime text-ink font-bold' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {img.is_primary ? 'Primary' : 'Set Primary'}
                </button>
                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageRow(idx)}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* AI Virtual Try-On configuration */}
          <div className="p-4 bg-lime/10 rounded-xl border border-lime/20 space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-lime-700" />
                <span className="font-semibold text-sm text-gray-900">Virtual Try-On Enabled</span>
              </div>
              <input
                type="checkbox"
                checked={supportsTryon}
                onChange={e => setSupportsTryon(e.target.checked)}
                className="w-4 h-4 accent-lime"
              />
            </div>
            {supportsTryon && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Isolated Garment Cutout Image (Transparent background PNG or flat lay)
                </label>
                <input
                  type="url"
                  value={tryonGarmentUrl}
                  onChange={e => setTryonGarmentUrl(e.target.value)}
                  placeholder="https://... garment image"
                  className="w-full px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-lime"
                />
              </div>
            )}
          </div>
        </div>

        {/* Variants Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-base font-semibold text-gray-900">SKUs & Inventory Variants</h2>
              <p className="text-xs text-gray-500">Sizes, colors, and stock count</p>
            </div>
            <button
              type="button"
              onClick={addVariantRow}
              className="inline-flex items-center gap-1.5 text-xs text-lime font-semibold hover:underline"
            >
              <Plus size={14} /> Add Variant
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-gray-400 uppercase border-b border-gray-100">
                <tr>
                  <th className="pb-2">SKU</th>
                  <th className="pb-2">Color</th>
                  <th className="pb-2">Color Hex</th>
                  <th className="pb-2">Size</th>
                  <th className="pb-2">Stock Qty</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {variants.map((v, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="py-2 pr-2">
                      <input
                        type="text"
                        value={v.sku}
                        onChange={e => {
                          const next = [...variants]
                          next[idx].sku = e.target.value
                          setVariants(next)
                        }}
                        className="w-28 px-2 py-1 text-xs border border-gray-200 rounded"
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <input
                        type="text"
                        value={v.color}
                        onChange={e => {
                          const next = [...variants]
                          next[idx].color = e.target.value
                          setVariants(next)
                        }}
                        className="w-24 px-2 py-1 text-xs border border-gray-200 rounded"
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <div className="flex items-center gap-1">
                        <input
                          type="color"
                          value={v.color_hex}
                          onChange={e => {
                            const next = [...variants]
                            next[idx].color_hex = e.target.value
                            setVariants(next)
                          }}
                          className="w-6 h-6 rounded border cursor-pointer p-0"
                        />
                        <input
                          type="text"
                          value={v.color_hex}
                          onChange={e => {
                            const next = [...variants]
                            next[idx].color_hex = e.target.value
                            setVariants(next)
                          }}
                          className="w-16 px-1.5 py-1 text-xs border border-gray-200 rounded"
                        />
                      </div>
                    </td>
                    <td className="py-2 pr-2">
                      <select
                        value={v.size}
                        onChange={e => {
                          const next = [...variants]
                          next[idx].size = e.target.value
                          setVariants(next)
                        }}
                        className="px-2 py-1 text-xs border border-gray-200 rounded"
                      >
                        {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 pr-2">
                      <input
                        type="number"
                        min="0"
                        value={v.stock_quantity}
                        onChange={e => {
                          const next = [...variants]
                          next[idx].stock_quantity = parseInt(e.target.value) || 0
                          setVariants(next)
                        }}
                        className="w-20 px-2 py-1 text-xs border border-gray-200 rounded"
                      />
                    </td>
                    <td className="py-2 text-right">
                      {variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVariantRow(idx)}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Extra Specs */}
        <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">Fabric & Visibility</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Material & Composition
              </label>
              <input
                type="text"
                value={material}
                onChange={e => setMaterial(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Care Instructions
              </label>
              <input
                type="text"
                value={careInstructions}
                onChange={e => setCareInstructions(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Search Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime"
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={isActive}
                onChange={e => setIsActive(e.target.checked)}
                className="w-4 h-4 accent-lime"
              />
              Published (Active)
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={e => setIsFeatured(e.target.checked)}
                className="w-4 h-4 accent-lime"
              />
              Feature on Homepage
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            to="/admin/products"
            className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-lime hover:bg-lime/90 text-ink font-semibold rounded-xl text-sm transition-colors shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
