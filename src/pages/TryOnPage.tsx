import { useState, useRef, useEffect, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { 
  Upload, Zap, X, RefreshCw, Info, Camera, ChevronRight, ChevronLeft,
  Download, Eye, ShoppingBag, Sparkles, CheckCircle2, Filter, RotateCw, ArrowRight
} from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import { generateVirtualTryOn, SAMPLE_MODELS } from '@/lib/tryonEngine'
import { normalizeImage, rotateImageDataUrl } from '@/lib/imageUtils'
import { fetchProductById, fetchTryOnProducts } from '@/lib/productsService'
import type { Product } from '@/types'
import { toast } from 'sonner'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_MB = 10

interface TryOnState {
  personImage: File | null
  personPreviewUrl: string | null
  status: 'idle' | 'uploading' | 'processing' | 'done' | 'error'
  processingStep: string
  resultUrl: string | null
  errorMessage: string | null
  showOriginal: boolean
  provider: string | null
}

export default function TryOnPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const productId = searchParams.get('product')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const addItem = useCartStore(s => s.addItem)
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all')
  const [mobileStep, setMobileStep] = useState<1 | 2 | 3>(1)
  const [hfToken, setHfToken] = useState(() => {
    return (import.meta as any).env?.VITE_HF_TOKEN || localStorage.getItem('tryonx_hf_token') || ''
  })
  const [showHfModal, setShowHfModal] = useState(false)
  const [hfInputVal, setHfInputVal] = useState('')

  const [state, setState] = useState<TryOnState>({
    personImage: null,
    personPreviewUrl: SAMPLE_MODELS[0].url, // Default to full body model
    status: 'idle',
    processingStep: '',
    resultUrl: null,
    errorMessage: null,
    showOriginal: false,
    provider: null,
  })

  // Fetch selected product
  const { data: product } = useQuery({
    queryKey: ['product-tryon', productId],
    queryFn: () => fetchProductById(productId as string),
    enabled: !!productId,
  })

  // Fetch all try-on products
  const { data: tryonProducts } = useQuery({
    queryKey: ['products-tryon-all'],
    queryFn: () => fetchTryOnProducts(),
  })

  // Auto-select first product if none selected
  useEffect(() => {
    if (!productId && tryonProducts && tryonProducts.length > 0) {
      setSearchParams({ product: tryonProducts[0].id })
    }
  }, [productId, tryonProducts, setSearchParams])

  // Filter outfits by category
  const filteredProducts = useMemo(() => {
    if (!tryonProducts) return []
    if (activeCategoryFilter === 'all') return tryonProducts
    return tryonProducts.filter(p => {
      const slug = p.category?.slug?.toLowerCase() || ''
      const tags = (p.tags || []).map(t => t.toLowerCase())
      const name = p.name.toLowerCase()
      if (activeCategoryFilter === 'shirts') {
        return (slug.includes('shirt') && !slug.includes('t-shirt')) || tags.includes('shirts') || (name.includes('shirt') && !name.includes('t-shirt') && !name.includes('polo'))
      }
      if (activeCategoryFilter === 't-shirts') {
        return slug.includes('t-shirt') || tags.includes('t-shirts') || name.includes('t-shirt') || name.includes('polo')
      }
      if (activeCategoryFilter === 'women') {
        return slug.includes('women') || tags.includes('women') || name.includes('dress') || name.includes('kurti') || name.includes('anarkali')
      }
      if (activeCategoryFilter === 'kids') {
        return slug.includes('kids') || tags.includes('kids') || name.includes('kid') || name.includes('frock') || name.includes('mickey') || name.includes('pavadai')
      }
      return true
    })
  }, [tryonProducts, activeCategoryFilter])

  async function handleFileSelect(file: File) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      setState(s => ({ ...s, errorMessage: 'Please upload a JPG, PNG, or WebP image.' }))
      return
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setState(s => ({ ...s, errorMessage: `Image must be under ${MAX_SIZE_MB}MB.` }))
      return
    }

    try {
      // Normalize image on canvas: bakes true physical orientation into pixels so it is never sideways
      const normalized = await normalizeImage(file, 0)
      setState(s => ({ 
        ...s, 
        personImage: file, 
        personPreviewUrl: normalized.dataUrl, 
        errorMessage: null, 
        resultUrl: null, 
        status: 'idle' 
      }))
      // On mobile, automatically advance to Step 2 so user can immediately choose garment
      setMobileStep(2)
      toast.success('Photo uploaded! Now pick an outfit.', { icon: '📸', duration: 2500 })
    } catch {
      const reader = new FileReader()
      reader.onload = () => {
        setState(s => ({ 
          ...s, 
          personImage: file, 
          personPreviewUrl: reader.result as string, 
          errorMessage: null, 
          resultUrl: null, 
          status: 'idle' 
        }))
        setMobileStep(2)
      }
      reader.readAsDataURL(file)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  function handleSelectSampleModel(modelUrl: string) {
    setState(s => ({
      ...s,
      personImage: null,
      personPreviewUrl: modelUrl,
      errorMessage: null,
      resultUrl: null,
      status: 'idle',
    }))
    setMobileStep(2)
  }

  function clearPhoto() {
    setState(s => ({ 
      ...s, 
      personImage: null, 
      personPreviewUrl: null, 
      status: 'idle', 
      resultUrl: null, 
      errorMessage: null 
    }))
    setMobileStep(1)
  }

  // Rotate user photo by 90 degrees
  async function handleRotateModel() {
    if (!state.personPreviewUrl) return
    try {
      const rotated = await rotateImageDataUrl(state.personPreviewUrl, 90)
      setState(s => ({ ...s, personPreviewUrl: rotated }))
      toast.success('Photo rotated 90°', { duration: 1500 })
    } catch (err) {
      console.warn('Rotation failed:', err)
    }
  }

  // Rotate virtual try-on result by 90 degrees
  async function handleRotateResult() {
    if (!state.resultUrl) return
    try {
      const rotated = await rotateImageDataUrl(state.resultUrl, 90)
      setState(s => ({ ...s, resultUrl: rotated }))
      toast.success('Result rotated 90°', { duration: 1500 })
    } catch (err) {
      console.warn('Rotation failed:', err)
    }
  }

  async function handleTryOn() {
    if (!state.personPreviewUrl || !product) {
      toast.error('Please upload or select a photo and pick a garment')
      return
    }

    // Switch to step 3 on mobile immediately so user sees the progress and result
    setMobileStep(3)

    setState(s => ({ 
      ...s, 
      status: 'processing', 
      processingStep: '🔮 Connecting to Gemini AI model...', 
      errorMessage: null 
    }))

    const timer1 = setTimeout(() => {
      setState(s => s.status === 'processing' ? { ...s, processingStep: '🧠 Analyzing person pose & garment details...' } : s)
    }, 2500)

    const timer2 = setTimeout(() => {
      setState(s => s.status === 'processing' ? { ...s, processingStep: '👗 Transferring garment texture & fit...' } : s)
    }, 7000)

    const timer3 = setTimeout(() => {
      setState(s => s.status === 'processing' ? { ...s, processingStep: '✨ Synthesizing fabric folds & lighting...' } : s)
    }, 14000)

    try {
      const garmentUrl = product.tryon_garment_image_url || product.images?.[0]?.url || ''

      const { resultUrl, provider } = await generateVirtualTryOn({
        personImageUrl: state.personPreviewUrl,
        garmentImageUrl: garmentUrl,
        productName: product.name,
        hfToken: hfToken || undefined,
      })

      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)

      setState(s => ({
        ...s,
        status: 'done',
        processingStep: 'Complete',
        resultUrl,
        provider,
        errorMessage: null,
      }))
      toast.success('AI Try-on render generated!', { icon: '✨' })
    } catch (err: any) {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      console.error(err)
      setState(s => ({ 
        ...s, 
        status: 'error', 
        errorMessage: err?.message || 'Unable to render try-on. Please try a different photo or outfit.' 
      }))
    }
  }

  function handleAddToCart() {
    if (!product) return
    const variant = product.variants?.[0]
    addItem({
      id: variant?.id || product.id,
      product_id: product.id,
      product_name: product.name,
      product_slug: product.slug,
      variant_sku: variant?.sku || `${product.slug.toUpperCase()}-STD`,
      color: variant?.color || 'Standard',
      color_hex: variant?.color_hex || '#000000',
      size: variant?.size || 'M',
      image_url: product.images?.[0]?.url || null,
      selling_price_paise: product.selling_price_paise,
      quantity: 1,
    })
    toast.success(`Added ${product.name} to your bag!`, { icon: '🛍️' })
  }

  function handleDownloadResult() {
    if (!state.resultUrl) return
    const a = document.createElement('a')
    a.href = state.resultUrl
    a.download = `tryonx-${product?.slug || 'outfit'}-ai-look.png`
    a.click()
  }

  return (
    <div className="min-h-screen bg-cream pb-24 lg:pb-12">
      {/* Header (Compact on mobile) */}
      <div className="bg-ink py-6 md:py-10">
        <div className="container max-w-screen-xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-lime/10 border border-lime/20 rounded-full px-3 py-1 mb-2 md:mb-3">
            <Sparkles size={14} className="text-lime" />
            <span className="text-lime text-[11px] md:text-xs font-semibold uppercase tracking-wider">TryOnX Generative Studio</span>
          </div>
          <h1 className="font-display font-bold text-2xl md:text-4xl text-cream mb-1 md:mb-2">
            AI Virtual Fitting Room
          </h1>
          <p className="text-cream/60 text-xs md:text-sm max-w-md mx-auto">
            Upload your photo, select any outfit, and preview authentic clothing transformation in seconds.
          </p>
        </div>
      </div>

      <div className="container max-w-screen-xl mx-auto px-3 sm:px-4 py-4 md:py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Link to="/" className="hover:text-ink">Home</Link>
          <ChevronRight size={12} />
          <span className="text-ink font-semibold">Virtual Try-On</span>
        </div>

        {/* ─── MOBILE STEP SWITCHER BAR (< lg screens only) ─── */}
        <div className="lg:hidden flex items-center justify-between bg-white rounded-2xl p-1.5 border border-gray-200/90 shadow-sm mb-4 sticky top-16 z-20">
          <button
            type="button"
            onClick={() => setMobileStep(1)}
            className={cn(
              'flex-1 py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all',
              mobileStep === 1
                ? 'bg-ink text-lime shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            <span className={cn('w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-extrabold', mobileStep === 1 ? 'bg-lime text-ink' : 'bg-gray-200 text-gray-700')}>1</span>
            <span>Photo</span>
            {state.personPreviewUrl && <CheckCircle2 size={12} className={mobileStep === 1 ? 'text-lime' : 'text-green-600'} />}
          </button>

          <button
            type="button"
            onClick={() => setMobileStep(2)}
            className={cn(
              'flex-1 py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all',
              mobileStep === 2
                ? 'bg-ink text-lime shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            <span className={cn('w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-extrabold', mobileStep === 2 ? 'bg-lime text-ink' : 'bg-gray-200 text-gray-700')}>2</span>
            <span>Outfit</span>
            {product && <CheckCircle2 size={12} className={mobileStep === 2 ? 'text-lime' : 'text-green-600'} />}
          </button>

          <button
            type="button"
            onClick={() => setMobileStep(3)}
            className={cn(
              'flex-1 py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all',
              mobileStep === 3
                ? 'bg-ink text-lime shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            <span className={cn('w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-extrabold', mobileStep === 3 ? 'bg-lime text-ink' : 'bg-gray-200 text-gray-700')}>3</span>
            <span>Result</span>
            {state.resultUrl && <Sparkles size={12} className={mobileStep === 3 ? 'text-lime' : 'text-yellow-500'} />}
          </button>
        </div>

        {/* ─── 3-COLUMN WORKSPACE (Responsive on mobile, 3-column on lg) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6 items-start">
          
          {/* STEP 1: Upload or Choose Model */}
          <div className={cn(
            'bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-sm space-y-4',
            mobileStep !== 1 && 'hidden lg:block'
          )}>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-ink text-lime text-xs font-bold rounded-full flex items-center justify-center">1</span>
                <h2 className="font-display font-bold text-base text-gray-900">Your Model / Photo</h2>
              </div>
              {state.personPreviewUrl && (
                <button
                  onClick={clearPhoto}
                  className="text-xs text-red-500 hover:underline font-medium"
                >
                  Clear
                </button>
              )}
            </div>

            {state.personPreviewUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-gray-200 aspect-[3/4] bg-gray-50">
                <img
                  src={state.personPreviewUrl}
                  alt="Selected Model or Photo"
                  className="w-full h-full object-cover object-top"
                />
                <button
                  type="button"
                  onClick={clearPhoto}
                  title="Remove photo"
                  className="absolute top-3 right-3 w-7 h-7 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors shadow-md z-10"
                >
                  <X size={13} />
                </button>
                {/* Dedicated Rotate Button for uploaded photo */}
                <button
                  type="button"
                  onClick={handleRotateModel}
                  title="Rotate photo 90° clockwise"
                  className="absolute bottom-3 right-3 bg-ink/80 hover:bg-ink text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg backdrop-blur-sm border border-white/20 flex items-center gap-1.5 transition-all shadow-md z-10 hover:scale-105 active:scale-95"
                >
                  <RotateCw size={13} className="text-lime" />
                  <span>Rotate 90°</span>
                </button>
              </div>
            ) : (
              <div
                onDragOver={e => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl aspect-[3/4] flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-lime hover:bg-lime/5 transition-all text-center p-6 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-lime/20 flex items-center justify-center transition-colors">
                  <Camera size={24} className="text-gray-500 group-hover:text-lime-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Upload full or half-body photo</p>
                  <p className="text-xs text-gray-500 mt-1">or drag & drop here</p>
                </div>
                <p className="text-[11px] text-gray-400">JPG, PNG, WebP up to 10MB</p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept={ALLOWED_TYPES.join(',')}
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0]
                if (file) handleFileSelect(file)
              }}
            />

            {/* Mobile Next Button */}
            {state.personPreviewUrl && (
              <button
                type="button"
                onClick={() => setMobileStep(2)}
                className="lg:hidden w-full py-2.5 px-3 rounded-xl bg-ink text-lime text-xs font-bold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-sm"
              >
                <span>Next: Choose Outfit</span>
                <ArrowRight size={14} />
              </button>
            )}

            {/* AI Preset Models (2 Full Body, 2 Half Body) */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Or Pick an AI Model:
                </p>
                <span className="text-[11px] text-gray-400 font-medium">2 Full + 2 Half Body</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {SAMPLE_MODELS.map(m => {
                  const isSelected = state.personPreviewUrl === m.url
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleSelectSampleModel(m.url)}
                      className={cn(
                        'rounded-xl overflow-hidden border-2 transition-all relative group text-left flex flex-col bg-gray-50',
                        isSelected
                          ? 'border-ink ring-2 ring-lime scale-[0.98]'
                          : 'border-gray-200 hover:border-gray-400'
                      )}
                    >
                      <div className="aspect-[3/4] w-full overflow-hidden bg-gray-100 relative">
                        <img 
                          src={m.url} 
                          alt={m.label} 
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" 
                        />
                        <span className={cn(
                          'absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm',
                          m.type === 'Full Body' ? 'bg-ink text-lime' : 'bg-white/90 text-gray-900 backdrop-blur-sm'
                        )}>
                          {m.type}
                        </span>
                      </div>
                      <div className="p-1.5 bg-white border-t border-gray-100">
                        <p className="text-[11px] font-semibold text-gray-800 truncate">{m.label}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* STEP 2: Select Outfit */}
          <div className={cn(
            'bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-sm space-y-4',
            mobileStep !== 2 && 'hidden lg:block'
          )}>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-ink text-lime text-xs font-bold rounded-full flex items-center justify-center">2</span>
                <h2 className="font-display font-bold text-base text-gray-900">Select Outfit</h2>
              </div>
              <span className="text-xs font-medium text-gray-500">
                {filteredProducts.length} items
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'all', label: 'All (26)' },
                { id: 'shirts', label: 'Shirts (6)' },
                { id: 't-shirts', label: 'T-Shirts (6)' },
                { id: 'women', label: 'Women (6)' },
                { id: 'kids', label: 'Kids (8)' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryFilter(cat.id)}
                  className={cn(
                    'text-xs font-medium px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap',
                    activeCategoryFilter === cat.id
                      ? 'bg-ink text-lime font-bold'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {product && (
              <div className="p-3 bg-lime/10 border border-lime/30 rounded-xl flex items-center gap-3">
                <div className="w-14 h-16 rounded-lg overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                  <img
                    src={product.images?.[0]?.url || ''}
                    alt={product.name}
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">{product.name}</p>
                  <p className="text-xs text-lime-800 font-semibold mt-0.5">
                    {formatPrice(product.selling_price_paise)}
                  </p>
                  <span className="inline-block mt-1 text-[10px] bg-lime text-ink font-bold px-2 py-0.5 rounded">
                    Selected for Try-On
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Click to Change Garment:
                </p>
                <span className="text-[11px] text-gray-400">Tap to select</span>
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-[380px] lg:max-h-[390px] overflow-y-auto pr-1">
                {filteredProducts.map(p => {
                  const isSelected = p.id === productId
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSearchParams({ product: p.id })}
                      className={cn(
                        'text-left rounded-xl overflow-hidden border p-2 transition-all flex flex-col',
                        isSelected 
                          ? 'border-ink bg-lime/10 ring-2 ring-lime/40' 
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      )}
                    >
                      <div className="aspect-[3/4] w-full rounded-lg overflow-hidden bg-gray-50 mb-1.5 flex items-center justify-center">
                        <img
                          src={p.images?.[0]?.url || ''}
                          alt={p.name}
                          className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <p className="text-xs font-medium text-gray-900 truncate">{p.name}</p>
                      <p className="text-xs text-gray-600 font-bold mt-0.5">{formatPrice(p.selling_price_paise)}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Mobile navigation buttons in Step 2 */}
            <div className="lg:hidden flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setMobileStep(1)}
                className="py-2.5 px-3 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 flex items-center justify-center gap-1"
              >
                <ChevronLeft size={14} />
                <span>Photo</span>
              </button>
              <button
                type="button"
                onClick={handleTryOn}
                disabled={state.status === 'processing' || !state.personPreviewUrl || !product}
                className="flex-1 py-2.5 px-3 rounded-xl bg-ink text-lime text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-black transition-all shadow-sm"
              >
                <Zap size={14} className="text-lime" />
                <span>Generate AI Look ✨</span>
              </button>
            </div>
          </div>

          {/* STEP 3: Preview Result & Actions */}
          <div className={cn(
            'bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-sm space-y-4',
            mobileStep !== 3 && 'hidden lg:block'
          )}>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-ink text-lime text-xs font-bold rounded-full flex items-center justify-center">3</span>
                <h2 className="font-display font-bold text-base text-gray-900">Virtual Try-On Result</h2>
              </div>
              {state.resultUrl && (
                <div className="flex items-center gap-1.5">
                  {/* Rotate Button for Result */}
                  <button
                    type="button"
                    onClick={handleRotateResult}
                    title="Rotate AI result 90° clockwise"
                    className="inline-flex items-center gap-1 text-xs text-gray-700 hover:text-ink font-semibold bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-md transition-colors"
                  >
                    <RotateCw size={12} className="text-gray-600" />
                    <span>Rotate 90°</span>
                  </button>
                  <button
                    onClick={() => setState(s => ({ ...s, showOriginal: !s.showOriginal }))}
                    className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-ink font-semibold bg-gray-100 px-2.5 py-1 rounded-md"
                  >
                    <Eye size={12} />
                    {state.showOriginal ? 'Show AI Try-On' : 'Compare Original'}
                  </button>
                </div>
              )}
            </div>

            {/* Display Area */}
            <div className="relative rounded-xl overflow-hidden border border-gray-200 aspect-[3/4] bg-gray-100 flex items-center justify-center">
              {state.status === 'processing' ? (
                <div className="absolute inset-0 bg-ink/90 text-white flex flex-col items-center justify-center p-6 text-center space-y-4 z-20">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-lime/30 border-t-lime animate-spin" />
                    <Sparkles className="absolute inset-0 m-auto text-lime animate-pulse" size={24} />
                  </div>
                  <div>
                    <p className="font-display font-bold text-base text-lime">Generating Try-On...</p>
                    <p className="text-xs text-cream/70 mt-1 max-w-xs">{state.processingStep}</p>
                  </div>
                  <div className="w-48 bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-lime h-full rounded-full animate-pulse w-3/4" />
                  </div>
                </div>
              ) : null}

              {state.resultUrl ? (
                <img
                  src={state.showOriginal ? (state.personPreviewUrl || '') : state.resultUrl}
                  alt="AI Virtual Try-On Result"
                  className="w-full h-full object-cover object-top"
                />
              ) : state.personPreviewUrl ? (
                <div className="w-full h-full relative">
                  <img
                    src={state.personPreviewUrl}
                    alt="Ready for Try-On"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                    <p className="text-xs text-white/90 font-medium">
                      Ready! Click <strong>"Generate AI Try-On"</strong> below.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6 text-gray-400">
                  <div className="w-12 h-12 rounded-xl bg-gray-200 mx-auto flex items-center justify-center mb-2">
                    <Sparkles size={20} className="text-gray-400" />
                  </div>
                  <p className="text-sm font-medium">Select a model/photo and garment</p>
                  <p className="text-xs text-gray-400 mt-1">Your photorealistic AI look will appear here</p>
                </div>
              )}

              {state.resultUrl && !state.showOriginal && (
                <div className="absolute top-3 left-3 bg-ink/80 backdrop-blur-md text-lime text-[11px] font-bold px-2.5 py-1 rounded-full border border-lime/30 flex items-center gap-1.5 shadow-lg">
                  <Sparkles size={12} />
                  {state.provider === 'idm_vton_neural' ? '🚀 Neural IDM-VTON' : '✨ TryOnX AI Studio'}
                </div>
              )}
            </div>

            {/* Hugging Face Token Settings Banner */}
            <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-[14px]">⚡</span>
                <span className="text-gray-700 font-medium truncate">
                  {hfToken ? 'HF Token Active' : 'Neural GPU (ZeroGPU)'}
                </span>
                {hfToken && (
                  <span className="text-[10px] bg-green-100 text-green-700 font-bold px-1.5 py-0.5 rounded">
                    Connected
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setHfInputVal(hfToken)
                  setShowHfModal(true)
                }}
                className="text-[11px] font-bold text-ink underline hover:text-lime-700 flex-shrink-0"
              >
                {hfToken ? 'Change' : 'Add Free Token'}
              </button>
            </div>

            {/* HF Token Modal */}
            {showHfModal && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-xl border border-gray-200">
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="font-display font-bold text-base text-gray-900">
                      ⚡ Hugging Face Access Token
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowHfModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    A free Hugging Face Read Token unlocks high ZeroGPU priority for IDM-VTON neural diffusion try-on directly on your personal quota.
                  </p>
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                      Token (hf_...)
                    </label>
                    <input
                      type="password"
                      value={hfInputVal}
                      onChange={e => setHfInputVal(e.target.value)}
                      placeholder="hf_xxxxxxxxxxxxxxxxxxxxxxxxx"
                      className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-ink font-mono"
                    />
                    <a
                      href="https://huggingface.co/settings/tokens"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-blue-600 hover:underline mt-1 inline-block"
                    >
                      Get your free token from Hugging Face →
                    </a>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2">
                    {hfToken && (
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.removeItem('tryonx_hf_token')
                          setHfToken('')
                          setHfInputVal('')
                          setShowHfModal(false)
                          toast.success('HF Token removed')
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        Remove Token
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        const trimmed = hfInputVal.trim()
                        if (trimmed) {
                          localStorage.setItem('tryonx_hf_token', trimmed)
                          setHfToken(trimmed)
                          toast.success('Hugging Face Token saved!')
                        } else {
                          localStorage.removeItem('tryonx_hf_token')
                          setHfToken('')
                        }
                        setShowHfModal(false)
                      }}
                      className="px-4 py-2 rounded-lg text-xs font-bold bg-ink text-lime hover:bg-black"
                    >
                      Save Token
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message with Inline Token Unlock */}
            {state.errorMessage && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl space-y-2.5">
                <div className="flex items-start gap-2">
                  <span className="text-base flex-shrink-0">⚠️</span>
                  <div className="space-y-1">
                    <p className="font-bold text-amber-950">AI GPU Model Quota Notice</p>
                    <p className="text-amber-800 leading-relaxed">{state.errorMessage}</p>
                  </div>
                </div>

                <div className="pt-1 border-t border-amber-200/60">
                  <p className="font-semibold text-[11px] text-amber-900 mb-1.5">
                    👉 Paste your free Hugging Face Read Token to unlock instant GPU try-on:
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={hfInputVal}
                      onChange={e => setHfInputVal(e.target.value)}
                      placeholder="hf_xxxxxxxxxxxxxxxxxxxxxxxxx"
                      className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-amber-300 bg-white font-mono focus:outline-none focus:border-ink"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const trimmed = hfInputVal.trim()
                        if (trimmed) {
                          localStorage.setItem('tryonx_hf_token', trimmed)
                          setHfToken(trimmed)
                          toast.success('Hugging Face Token connected!')
                          handleTryOn()
                        } else {
                          toast.error('Please enter a valid token')
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-ink text-lime font-bold text-xs hover:bg-black flex-shrink-0"
                    >
                      Save & Run
                    </button>
                  </div>
                  <a
                    href="https://huggingface.co/settings/tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-blue-700 hover:underline mt-1.5 inline-block font-medium"
                  >
                    Get your free token from Hugging Face (100% free, takes 10 seconds) →
                  </a>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleTryOn}
                disabled={state.status === 'processing' || !state.personPreviewUrl || !product}
                className={cn(
                  'w-full py-3.5 px-4 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all',
                  state.status === 'processing' || !state.personPreviewUrl || !product
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-ink text-lime hover:bg-black hover:shadow-md'
                )}
              >
                {state.status === 'processing' ? (
                  <>
                    <RefreshCw size={16} className="animate-spin text-lime" />
                    Synthesizing Look...
                  </>
                ) : state.resultUrl ? (
                  <>
                    <RefreshCw size={16} />
                    Regenerate AI Look
                  </>
                ) : (
                  <>
                    <Zap size={16} className="text-lime" />
                    Generate AI Try-On
                  </>
                )}
              </button>

              {state.resultUrl && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadResult}
                    className="py-2.5 px-3 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download size={14} />
                    Save Photo
                  </button>
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="py-2.5 px-3 rounded-xl bg-lime text-ink text-xs font-bold hover:bg-lime/90 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <ShoppingBag size={14} />
                    Add to Bag
                  </button>
                </div>
              )}

              {/* Mobile Back to Outfit button */}
              <div className="lg:hidden pt-1">
                <button
                  type="button"
                  onClick={() => setMobileStep(2)}
                  className="w-full py-2 text-center text-xs text-gray-500 hover:text-ink font-semibold flex items-center justify-center gap-1"
                >
                  <ChevronLeft size={14} />
                  <span>Change Outfit</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── STICKY MOBILE BOTTOM BAR (< lg screens only) ─── */}
      {product && mobileStep !== 3 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-2.5 z-40 shadow-lg flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50 border border-gray-200 flex-shrink-0">
              <img
                src={product.images?.[0]?.url || ''}
                alt={product.name}
                className="w-full h-full object-contain p-0.5"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-900 truncate">{product.name}</p>
              <p className="text-[11px] text-lime-800 font-bold">{formatPrice(product.selling_price_paise)}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleTryOn}
            disabled={state.status === 'processing' || !state.personPreviewUrl}
            className="flex-shrink-0 py-2.5 px-4 rounded-xl bg-ink text-lime text-xs font-bold flex items-center gap-1.5 shadow-md hover:bg-black active:scale-95 transition-all"
          >
            <Zap size={14} className="text-lime" />
            <span>Try On ✨</span>
          </button>
        </div>
      )}
    </div>
  )
}
