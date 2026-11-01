import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { PageSkeleton } from '@/components/ui/Skeletons'

export function AdminRoute() {
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const location = useLocation()

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          setIsAdmin(false)
          setLoading(false)
          return
        }

        // Check admin_users table by auth ID or email
        const { data, error } = await supabase
          .from('admin_users')
          .select('id, email, is_active')
          .or(`id.eq.${session.user.id},email.eq.${session.user.email}`)
          .single()

        setIsAdmin(!error && data?.is_active === true)
      } catch {
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      checkAuth()
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  if (loading) return <PageSkeleton />

  if (!isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
