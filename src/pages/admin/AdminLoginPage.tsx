import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Zap, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: Location })?.from?.pathname ?? '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (authError) {
        setError('Invalid email or password.')
        return
      }

      if (!data.user) {
        setError('Authentication failed.')
        return
      }

      // Verify admin status by ID or email
      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('id, email, is_active')
        .or(`id.eq.${data.user.id},email.eq.${data.user.email}`)
        .single()

      if (adminError || !adminUser?.is_active) {
        await supabase.auth.signOut()
        setError('Access denied. You do not have admin privileges.')
        return
      }

      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-lime rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Zap size={28} className="text-ink" />
          </div>
          <h1 className="font-display font-bold text-2xl text-cream">Admin Login</h1>
          <p className="text-cream/40 text-sm mt-1">TryOnX Administration Portal</p>
        </div>

        {/* Form */}
        <div className="bg-cream/5 border border-cream/10 rounded-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-cream/70 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@tryonx.in"
                className="w-full bg-cream/10 border border-cream/20 rounded-xl px-4 py-3 text-cream placeholder:text-cream/30 outline-none focus:border-lime transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-cream/70 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full bg-cream/10 border border-cream/20 rounded-xl px-4 py-3 pr-11 text-cream placeholder:text-cream/30 outline-none focus:border-lime transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/40 hover:text-cream transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-coral/10 border border-coral/20 rounded-xl p-3">
                <AlertCircle size={15} className="text-coral flex-shrink-0 mt-0.5" />
                <p className="text-xs text-coral">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-lime w-full flex items-center justify-center gap-2"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-cream/30 text-xs mt-6">
          This portal is restricted to authorized TryOnX administrators only.
        </p>
      </div>
    </div>
  )
}
