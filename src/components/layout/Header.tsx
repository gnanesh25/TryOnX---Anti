import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Search, ShoppingBag, Heart, Menu, X, Zap, ChevronDown, User
} from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'All Items', href: '/shop' },
  { label: 'Shirts', href: '/collections/shirts' },
  { label: 'T-Shirts', href: '/collections/t-shirts' },
  { label: 'Women', href: '/collections/women' },
  { label: 'Kids', href: '/collections/kids' },
  { label: '✨ AI Try-On', href: '/try-on', highlight: true },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const cartCount = useCartStore(s => s.totalItems())
  const wishlistCount = useWishlistStore(s => s.items.length)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 bg-cream/95 backdrop-blur-md transition-shadow duration-300',
        scrolled && 'shadow-sm border-b border-ink/8'
      )}
    >
      <div className="container max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
            <div className="w-8 h-8 bg-ink rounded-lg flex items-center justify-center group-hover:bg-lime transition-colors duration-200">
              <Zap size={18} className="text-lime group-hover:text-ink transition-colors duration-200" />
            </div>
            <span className="font-display font-bold text-xl text-ink tracking-tight">
              TryOn<span className="text-coral">X</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map(link => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  cn(
                    'nav-link',
                    link.highlight && 'font-semibold text-ink',
                    isActive && 'active'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Search + Actions */}
          <div className="flex items-center gap-3">
            {/* Search bar */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex items-center bg-ink/5 border border-ink/10 rounded-xl px-4 py-2 gap-2 w-56 focus-within:border-ink/30 focus-within:bg-white transition-all duration-200"
            >
              <Search size={15} className="text-ink/40 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search products…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm text-ink placeholder:text-ink/40 outline-none w-full"
              />
            </form>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-lg hover:bg-ink/5 transition-colors"
              aria-label="Wishlist"
            >
              <Heart size={20} className="text-ink" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-coral text-white text-2xs font-bold rounded-full flex items-center justify-center">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-lg hover:bg-ink/5 transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag size={20} className="text-ink" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-lime text-ink text-2xs font-bold rounded-full flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-ink/5 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-ink/10 py-4 animate-fade-in">
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="flex items-center bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 gap-2 mb-4">
              <Search size={15} className="text-ink/40" />
              <input
                type="text"
                placeholder="Search products…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm text-ink placeholder:text-ink/40 outline-none w-full"
              />
            </form>

            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map(link => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive ? 'bg-ink text-cream' : 'text-ink hover:bg-ink/5',
                      link.highlight && 'font-semibold'
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
