import { createClient } from '@supabase/supabase-js'

const DEFAULT_SUPABASE_URL = 'https://cvnjolehwzubdusrmawm.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2bmpvbGVod3p1YmR1c3JtYXdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwOTAzNzIsImV4cCI6MjEwODY2NjM3Mn0.Us3z3VYEPGDRgcEE4HHh-iFDZ_0MeUkR5K7vHxd-QnY'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

export type { User } from '@supabase/supabase-js'
