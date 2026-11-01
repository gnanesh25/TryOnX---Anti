import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Shield, Truck, RefreshCw, CreditCard, Banknote } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { useCartStore } from '@/store/cartStore'
import { formatPrice, isValidIndianPhone, isValidPinCode } from '@/lib/utils'
import { cn } from '@/lib/utils'

const checkoutSchema = z.object({
  first_name: z.string().min(2, 'First name required'),
  last_name: z.string().min(2, 'Last name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().refine(isValidIndianPhone, 'Valid 10-digit mobile number required'),
  address_line1: z.string().min(5, 'Address required'),
  address_line2: z.string().optional(),
  city: z.string().min(2, 'City required'),
  state: z.string().min(2, 'State required'),
  postal_code: z.string().refine(isValidPinCode, 'Valid 6-digit PIN code required'),
  delivery_instructions: z.string().optional(),
  payment_method: z.enum(['online', 'cod']),
  coupon_code: z.string().optional(),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal',
]

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, subtotalPaise, clearCart } = useCartStore()
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { payment_method: 'cod' },
  })

  const paymentMethod = watch('payment_method')
  const subtotal = subtotalPaise()
  const shippingPaise = subtotal >= 99900 ? 0 : 9900
  const total = subtotal + shippingPaise

  if (items.length === 0) {
    navigate('/cart', { replace: true })
    return null
  }

  async function onSubmit(data: CheckoutFormData) {
    setSubmitting(true)
    try {
      // Server-side order creation
      const orderPayload = {
        customer_name: `${data.first_name} ${data.last_name}`,
        customer_email: data.email,
        customer_phone: data.phone,
        shipping_address: {
          first_name: data.first_name,
          last_name: data.last_name,
          address_line1: data.address_line1,
          address_line2: data.address_line2,
          city: data.city,
          state: data.state,
          postal_code: data.postal_code,
        },
        payment_method: data.payment_method,
        coupon_code: data.coupon_code || null,
        notes: data.delivery_instructions || null,
        items: items.map(item => ({
          variant_id: item.id,
          product_id: item.product_id,
          quantity: item.quantity,
        })),
      }

      if (data.payment_method === 'cod') {
        const { data: result, error } = await supabase
          .from('orders')
          .insert({
            customer_name: orderPayload.customer_name,
            customer_email: orderPayload.customer_email,
            customer_phone: orderPayload.customer_phone,
            shipping_address: orderPayload.shipping_address,
            payment_method: 'cod',
            payment_status: 'pending',
            status: 'pending',
            subtotal_paise: subtotal,
            shipping_paise: shippingPaise,
            tax_paise: 0,
            discount_paise: 0,
            total_paise: total,
            notes: orderPayload.notes,
            tracking_token: crypto.randomUUID(),
          })
          .select()
          .single()

        if (error) throw error

        clearCart()
        navigate(`/order/success?order=${result.id}&token=${result.tracking_token}`)
      } else {
        // Razorpay — to be implemented in Phase 5
        toast.info('Online payment will be available soon. Please select Cash on Delivery.', {
          duration: 4000,
        })
      }
    } catch (err) {
      console.error('Order creation failed:', err)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="container max-w-screen-xl mx-auto px-4 py-8">
        <h1 className="section-heading mb-8">Checkout</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery details */}
              <div className="bg-white rounded-2xl p-6 border border-ink/5">
                <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                  <Truck size={18} className="text-ink/40" />
                  Delivery Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="First Name" error={errors.first_name?.message}>
                    <input {...register('first_name')} placeholder="Riya" className={inputClass(!!errors.first_name)} />
                  </FormField>
                  <FormField label="Last Name" error={errors.last_name?.message}>
                    <input {...register('last_name')} placeholder="Sharma" className={inputClass(!!errors.last_name)} />
                  </FormField>
                  <FormField label="Email Address" error={errors.email?.message}>
                    <input {...register('email')} type="email" placeholder="riya@example.com" className={inputClass(!!errors.email)} />
                  </FormField>
                  <FormField label="Phone Number" error={errors.phone?.message}>
                    <input {...register('phone')} placeholder="9876543210" maxLength={10} className={inputClass(!!errors.phone)} />
                  </FormField>
                  <div className="sm:col-span-2">
                    <FormField label="Address Line 1" error={errors.address_line1?.message}>
                      <input {...register('address_line1')} placeholder="Flat 4B, Green Heights Apartment" className={inputClass(!!errors.address_line1)} />
                    </FormField>
                  </div>
                  <div className="sm:col-span-2">
                    <FormField label="Address Line 2 (optional)">
                      <input {...register('address_line2')} placeholder="Near City Mall" className={inputClass(false)} />
                    </FormField>
                  </div>
                  <FormField label="City" error={errors.city?.message}>
                    <input {...register('city')} placeholder="Mumbai" className={inputClass(!!errors.city)} />
                  </FormField>
                  <FormField label="State" error={errors.state?.message}>
                    <select {...register('state')} className={inputClass(!!errors.state)}>
                      <option value="">Select state</option>
                      {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </FormField>
                  <FormField label="PIN Code" error={errors.postal_code?.message}>
                    <input {...register('postal_code')} placeholder="400001" maxLength={6} className={inputClass(!!errors.postal_code)} />
                  </FormField>
                  <div className="sm:col-span-2">
                    <FormField label="Delivery Instructions (optional)">
                      <textarea
                        {...register('delivery_instructions')}
                        placeholder="Leave at door, ring bell twice…"
                        rows={2}
                        className={inputClass(false) + ' resize-none'}
                      />
                    </FormField>
                  </div>
                </div>
              </div>

              {/* Payment method */}
              <div className="bg-white rounded-2xl p-6 border border-ink/5">
                <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                  <CreditCard size={18} className="text-ink/40" />
                  Payment Method
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { value: 'cod', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay when your order arrives' },
                    { value: 'online', label: 'Pay Online', icon: CreditCard, desc: 'UPI, Cards, Net Banking (Coming soon)' },
                  ].map(opt => (
                    <label
                      key={opt.value}
                      className={cn(
                        'flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all',
                        paymentMethod === opt.value
                          ? 'border-ink bg-ink/3'
                          : 'border-ink/15 hover:border-ink/30'
                      )}
                    >
                      <input
                        type="radio"
                        value={opt.value}
                        {...register('payment_method')}
                        className="mt-0.5"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <opt.icon size={16} className="text-ink/60" />
                          <span className="font-semibold text-sm">{opt.label}</span>
                        </div>
                        <p className="text-xs text-ink/40 mt-0.5">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Order summary */}
            <div>
              <div className="bg-white rounded-2xl p-6 border border-ink/5 sticky top-24">
                <h2 className="font-display font-semibold text-lg mb-4">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto scrollbar-hide">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-14 bg-ink/5 rounded-lg overflow-hidden flex-shrink-0">
                        {item.image_url && <img src={item.image_url} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{item.product_name}</p>
                        {item.size && <p className="text-2xs text-ink/40">Size: {item.size}</p>}
                        <p className="text-xs font-bold mt-0.5">{formatPrice(item.selling_price_paise)} × {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon */}
                <div className="border-t border-ink/10 pt-4 mb-4">
                  <FormField label="Coupon Code (optional)">
                    <div className="flex gap-2">
                      <input
                        {...register('coupon_code')}
                        placeholder="WELCOME10"
                        className={inputClass(false) + ' flex-1'}
                      />
                      <button type="button" className="btn-ghost text-sm px-3 py-2">Apply</button>
                    </div>
                  </FormField>
                </div>

                {/* Totals */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-ink/60">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-ink/60">Shipping</span>
                    <span className={shippingPaise === 0 ? 'text-green-600 font-semibold' : ''}>
                      {shippingPaise === 0 ? 'FREE' : formatPrice(shippingPaise)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-ink/10 pt-3 mb-6">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-lime w-full flex items-center justify-center gap-2 text-base disabled:opacity-60"
                >
                  {submitting ? (
                    <RefreshCw size={18} className="animate-spin" />
                  ) : (
                    <>
                      <Shield size={18} />
                      {paymentMethod === 'cod' ? 'Place Order (COD)' : 'Pay Now'}
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2 mt-4 text-xs text-ink/40 justify-center">
                  <Shield size={12} />
                  Secured by 256-bit SSL encryption
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-ink mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-coral mt-1">{error}</p>}
    </div>
  )
}

function inputClass(hasError: boolean) {
  return cn(
    'w-full border rounded-xl px-3 py-2.5 text-sm text-ink outline-none transition-colors bg-cream/50',
    hasError
      ? 'border-coral focus:border-coral'
      : 'border-ink/20 focus:border-ink/50'
  )
}
