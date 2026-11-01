import { Mail, MapPin, Clock, MessageSquare } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-ink py-16 text-center">
        <h1 className="font-display font-bold text-4xl text-cream mb-3">Contact Us</h1>
        <p className="text-cream/60">We're here to help. Reach out any time.</p>
      </div>

      <div className="container max-w-screen-lg mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact info */}
          <div className="space-y-8">
            <div>
              <h2 className="font-display font-bold text-2xl mb-6">Get in Touch</h2>
              {[
                { icon: Mail, label: 'Email', value: 'support@tryonx.in' },
                { icon: MessageSquare, label: 'WhatsApp', value: '+91 98765 43210' },
                { icon: MapPin, label: 'Address', value: 'Hyderabad, Telangana, India' },
                { icon: Clock, label: 'Support Hours', value: 'Mon–Sat, 9am–6pm IST' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 bg-lime/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-ink" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink/50 uppercase tracking-wider mb-0.5">{label}</p>
                    <p className="text-sm font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact form */}
          <div className="bg-white rounded-2xl p-8 border border-ink/5">
            <h3 className="font-display font-semibold text-xl mb-6">Send a Message</h3>
            <form className="space-y-4" onSubmit={e => e.preventDefault()}>
              <div>
                <label className="block text-xs font-semibold mb-1.5">Your Name</label>
                <input type="text" placeholder="Riya Sharma" className="w-full border border-ink/20 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-ink/50" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5">Email Address</label>
                <input type="email" placeholder="riya@example.com" className="w-full border border-ink/20 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-ink/50" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5">Subject</label>
                <input type="text" placeholder="Order issue, return request…" className="w-full border border-ink/20 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-ink/50" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5">Message</label>
                <textarea rows={4} placeholder="Tell us how we can help…" className="w-full border border-ink/20 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-ink/50 resize-none" />
              </div>
              <button type="submit" className="btn-lime w-full">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
