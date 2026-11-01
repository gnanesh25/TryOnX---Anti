import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Plus, Trash2, Sparkles, Image as ImageIcon } from 'lucide-react'
import { slugify } from '@/lib/utils'
import type { Category } from '@/types'
import { toast } from 'sonner'

interface VariantRow {
  sku: string
  color: string
  color_hex: string
  size: string
  stock_quantity: number
  selling_price_paise?: number
}

interface ImageRow {
  url: string
  alt_text: string
  is_primary: boolean
}

export default function AdminProductNew() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Basic info
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [autoSlug, setAutoSlug] = useState(true)
  const [brand, setBrand] = useState('TryOnX')
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
  const [images, setImages] = useState<ImageRow[]>([
    { url: '', alt_text: '', is_primary: true },
  ])

  // Variants
  const [variants, setVariants] = useState<VariantRow[]>([
    { sku: '', color: 'Black', color_hex: '#000000', size: 'M', stock_quantity: 10 },
  ])

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*').order('name')
      if (error) throw error
      return data || []
    },
  })

  function handleNameChange(val: string) {
    setName(val)
    if (autoSlug) {
      setSlug(slugify(val))
    }
  }

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
    const baseSku = (slug || 'ITEM').toUpperCase().slice(0, 6)
    const randomSuffix = Math.floor(100 + Math.random() * 900)
    setVariants(prev => [
      ...prev,
      { sku: `${baseSku}-${randomSuffix}`, color: 'Black', color_hex: '#000000', size: 'L', stock_quantity: 10 },
    ])
  }

  function removeVariantRow(idx: number) {
    setVariants(prev => prev.filter((_, i) => i !== idx))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !slug) {
      toast.error('Product title and slug are required')
      return
    }

    const pricePaise = Math.round(parseFloat(sellingPrice || '0') * 100)
    if (isNaN(pricePaise) || pricePaise <= 0) {
      toast.error('Please enter a valid price in INR')
      return
    }

    const comparePricePaise = comparePrice ? Math.round(parseFloat(comparePrice) * 100) : null
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean)

    setIsSubmitting(true)

    try {
      // 1. Insert product
      const { data: product, error: prodErr } = await supabase
        .from('products')
        .insert({
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
        })
        .select()
        .single()

      if (prodErr) throw prodErr

      // 2. Insert Images
      const validImages = images
        .filter(img => img.url.trim() !== '')
        .map((img, index) => ({
          product_id: product.id,
          url: img.url.trim(),
          alt_text: img.alt_text || name,
          is_primary: img.is_primary,
          sort_order: index,
        }))

      if (validImages.length > 0) {
        const { error: imgErr } = await supabase.from('product_images').insert(validImages)
        if (imgErr) console.error('Error inserting images:', imgErr)
      }

      // 3. Insert Variants
      const validVariants = variants.map(v => ({
        product_id: product.id,
        sku: v.sku.trim() || `${slug.toUpperCase()}-${v.size}-${v.color}`,
        color: v.color || null,
        color_hex: v.color_hex || null,
        size: v.size || null,
        stock_quantity: Number(v.stock_quantity) || 0,
        selling_price_paise: v.selling_price_paise || null,
        is_active: true,
      }))

      if (validVariants.length > 0) {
        const { error: varErr } = await supabase.from('product_variants').insert(validVariants)
        if (varErr) console.error('Error inserting variants:', varErr)
      }

      toast.success('Product created successfully!')
      navigate('/admin/products')
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Failed to create product')
    } finally {
      setIsSubmitting(false)
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-sm text-gray-500">Create a fashion product, assign variants & try-on models</p>
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
                onChange={e => handleNameChange(e.target.value)}
                placeholder="e.g. Oversized Acid Wash Graphic Tee"
                className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Slug (URL Key) *
                </label>
                <button
                  type="button"
                  onClick={() => setAutoSlug(!autoSlug)}
                  className="text-xs text-lime font-medium hover:underline"
                >
                  {autoSlug ? 'Edit manually' : 'Auto generate'}
                </button>
              </div>
              <input
                type="text"
                required
                value={slug}
                disabled={autoSlug}
                onChange={e => setSlug(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime disabled:opacity-75"
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
                placeholder="e.g. TryOnX Studio"
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
              placeholder="Describe the fabric, fit, styling suggestions..."
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
                placeholder="e.g. 1499"
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
                placeholder="e.g. 2499"
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
                  Isolated Garment Cutout Image (Transparent background PNG or high-res flat lay)
                </label>
                <input
                  type="url"
                  value={tryonGarmentUrl}
                  onChange={e => setTryonGarmentUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... (Garment flat-lay)"
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
              <p className="text-xs text-gray-500">Sizes, colors, and stock count for each combination</p>
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
                        placeholder="SKU-001"
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
                        placeholder="Color"
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
                placeholder="e.g. 100% Combed Cotton, 240 GSM"
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
                placeholder="e.g. Machine wash cold, tumble dry low"
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
              placeholder="streetwear, oversized, summer, vintage"
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
              Publish Immediately (Active)
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
            {isSubmitting ? 'Saving Product...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  )
}
