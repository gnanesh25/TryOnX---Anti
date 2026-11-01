import { Link } from 'react-router-dom'
import { Home, Search } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="font-display font-black text-[10rem] leading-none text-ink/10">404</h1>
        <h2 className="font-display font-bold text-3xl text-ink -mt-6 mb-3">Page Not Found</h2>
        <p className="text-ink/50 mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-lime flex items-center justify-center gap-2">
            <Home size={18} />
            Go Home
          </Link>
          <Link to="/shop" className="btn-ghost flex items-center justify-center gap-2">
            <Search size={18} />
            Browse Shop
          </Link>
        </div>
      </div>
    </div>
  )
}
