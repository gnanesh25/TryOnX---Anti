import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, Tags, ShoppingCart, Settings,
  Warehouse, LogOut, Zap, Menu, X
} from 'lucide-react'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Package, label: 'Products', href: '/admin/products' },
  { icon: Tags, label: 'Categories', href: '/admin/categories' },
  { icon: ShoppingCart, label: 'Orders', href: '/admin/orders' },
  { icon: Warehouse, label: 'Inventory', href: '/admin/inventory' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  async function handleLogout() {
    await supabase.auth.signOut()
    toast.success('Logged out')
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 bg-ink text-cream flex flex-col transition-all duration-300',
        sidebarOpen ? 'w-56' : 'w-16'
      )}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-cream/10">
          <div className="w-8 h-8 bg-lime rounded-lg flex items-center justify-center flex-shrink-0">
            <Zap size={16} className="text-ink" />
          </div>
          {sidebarOpen && (
            <span className="font-display font-bold text-base">TryOnX Admin</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {NAV_ITEMS.map(({ icon: Icon, label, href }) => (
            <NavLink
              key={href}
              to={href}
              end={href === '/admin'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-lime text-ink'
                    : 'text-cream/70 hover:text-cream hover:bg-cream/10'
                )
              }
            >
              <Icon size={18} className="flex-shrink-0" />
              {sidebarOpen && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-2 pb-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-cream/60 hover:text-cream hover:bg-cream/10 transition-colors w-full"
          >
            <LogOut size={18} className="flex-shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className={cn(
        'flex-1 flex flex-col transition-all duration-300',
        sidebarOpen ? 'ml-56' : 'ml-16'
      )}>
        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200 h-16 flex items-center px-6 gap-4">
          <button
            onClick={() => setSidebarOpen(o => !o)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div className="flex-1" />
          <a
            href="/"
            target="_blank"
            className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            View Store ↗
          </a>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
