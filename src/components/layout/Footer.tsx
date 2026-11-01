import { Link } from 'react-router-dom'
import { Zap, Mail } from 'lucide-react'

const SHOP_LINKS = [
  { label: 'New Arrivals', href: '/shop?sort=newest' },
  { label: 'Women', href: '/collections/women' },
  { label: 'Men', href: '/collections/men' },
  { label: 'Kids', href: '/collections/kids' },
  { label: 'Sale', href: '/shop?sale=true' },
]

const SUPPORT_LINKS = [
  { label: 'Track Order', href: '/track-order' },
  { label: 'Returns & Exchanges', href: '/returns-policy' },
  { label: 'Shipping Policy', href: '/shipping-policy' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'About TryOnX', href: '/about' },
]

const POLICY_LINKS = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Shipping Policy', href: '/shipping-policy' },
  { label: 'Returns Policy', href: '/returns-policy' },
]

export default function Footer() {
  return (
    <footer className="bg-ink text-cream mt-20">
      <div className="container max-w-screen-xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-lime rounded-lg flex items-center justify-center">
                <Zap size={18} className="text-ink" />
              </div>
              <span className="font-display font-bold text-xl text-cream">
                TryOn<span className="text-coral">X</span>
              </span>
            </Link>
            <p className="text-cream/60 text-sm leading-relaxed mb-6">
              Try It Virtually. Own Your Style.
              <br />
              India's AI-powered fashion store.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-lg bg-cream/10 flex items-center justify-center hover:bg-lime hover:text-ink transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter / X"
                className="w-9 h-9 rounded-lg bg-cream/10 flex items-center justify-center hover:bg-lime hover:text-ink transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-lg bg-cream/10 flex items-center justify-center hover:bg-lime hover:text-ink transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-display font-semibold text-cream mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {SHOP_LINKS.map(link => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-cream/60 text-sm hover:text-lime transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-semibold text-cream mb-4">Support</h4>
            <ul className="space-y-2.5">
              {SUPPORT_LINKS.map(link => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-cream/60 text-sm hover:text-lime transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display font-semibold text-cream mb-4">Stay in Style</h4>
            <p className="text-cream/60 text-sm mb-4">
              Get new arrivals, exclusive offers, and style tips delivered to your inbox.
            </p>
            <form
              onSubmit={e => e.preventDefault()}
              className="flex flex-col gap-2"
            >
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-cream/10 border border-cream/20 rounded-lg px-3 py-2 text-sm text-cream placeholder:text-cream/40 outline-none focus:border-lime transition-colors"
                />
                <button
                  type="submit"
                  className="bg-lime text-ink font-semibold text-sm px-4 py-2 rounded-lg hover:bg-lime/90 transition-colors"
                >
                  <Mail size={16} />
                </button>
              </div>
              <p className="text-cream/40 text-xs">
                No spam. Unsubscribe anytime.
              </p>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-cream/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-cream/40 text-xs">
            © {new Date().getFullYear()} TryOnX. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {POLICY_LINKS.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className="text-cream/40 text-xs hover:text-cream/80 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          {/* Payment icons */}
          <div className="flex items-center gap-2">
            <span className="text-cream/40 text-xs">Secure payments via</span>
            <span className="bg-cream/10 text-cream text-xs font-bold px-2 py-1 rounded">Razorpay</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
