import { useState } from 'react'
import { Save, Store, Shield, Sparkles, CreditCard, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminSettings() {
  const [storeName, setStoreName] = useState('TryOnX')
  const [tagline, setTagline] = useState('Try It Virtually. Own Your Style.')
  const [supportEmail, setSupportEmail] = useState('support@tryonx.in')
  const [supportPhone, setSupportPhone] = useState('+91 98765 43210')
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('999')
  const [tryonProvider, setTryonProvider] = useState('mock')
  const [razorpayKeyId, setRazorpayKeyId] = useState(import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_sample')
  const [isSaving, setIsSaving] = useState(false)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast.success('Settings saved successfully!')
    }, 600)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Store Settings</h1>
        <p className="text-sm text-gray-500">Configure store metadata, delivery thresholds, payments, and AI services</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Store Profile */}
        <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3 text-gray-900 font-semibold text-base">
            <Store size={18} className="text-lime-700" />
            Store Profile & Branding
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Store Name
              </label>
              <input
                type="text"
                value={storeName}
                onChange={e => setStoreName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Brand Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Customer Support Email
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={e => setSupportEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Support Helpline / WhatsApp
              </label>
              <input
                type="text"
                value={supportPhone}
                onChange={e => setSupportPhone(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Commerce */}
        <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3 text-gray-900 font-semibold text-base">
            <Shield size={18} className="text-lime-700" />
            Shipping & Thresholds
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Free Shipping Minimum (₹ INR)
              </label>
              <input
                type="number"
                value={freeShippingThreshold}
                onChange={e => setFreeShippingThreshold(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime"
              />
              <p className="text-xs text-gray-400 mt-1">Orders above this value receive free standard delivery</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Standard Shipping Fee (₹ INR)
              </label>
              <input
                type="text"
                disabled
                value="₹99"
                className="w-full px-3.5 py-2 text-sm bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">Applied automatically when below the free shipping threshold</p>
            </div>
          </div>
        </div>

        {/* AI Virtual Try-On Provider */}
        <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3 text-gray-900 font-semibold text-base">
            <Sparkles size={18} className="text-lime-700" />
            AI Virtual Try-On Engine
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Try-On Provider Mode
              </label>
              <select
                value={tryonProvider}
                onChange={e => setTryonProvider(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime"
              >
                <option value="mock">Simulated / High-Speed Mock Engine (Dev & Demo)</option>
                <option value="fashn">FASHN AI Production API</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Max Daily Tries Per User Session
              </label>
              <input
                type="number"
                defaultValue="10"
                className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime"
              />
            </div>
          </div>
        </div>

        {/* Payment Gateways */}
        <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3 text-gray-900 font-semibold text-base">
            <CreditCard size={18} className="text-lime-700" />
            Payments & Razorpay
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Razorpay Key ID
              </label>
              <input
                type="text"
                value={razorpayKeyId}
                onChange={e => setRazorpayKeyId(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime font-mono text-xs"
              />
            </div>

            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-600 space-y-1">
              <div className="flex items-center gap-1.5 font-medium text-gray-800">
                <CheckCircle size={14} className="text-green-600" />
                Cash On Delivery (COD) Enabled
              </div>
              <p>Customers can place orders and pay in cash upon doorstep delivery anywhere in India.</p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-lime hover:bg-lime/90 text-ink font-semibold rounded-xl text-sm transition-colors shadow-sm disabled:opacity-50"
          >
            <Save size={16} />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}
