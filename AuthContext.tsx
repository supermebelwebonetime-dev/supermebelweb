import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from './supabase'

export interface Profile {
  id: string
  display_name: string | null
  phone: string | null
  preferred_locale: 'ru' | 'kk'
  email: string | null
  created_at: string
}

interface AuthValue {
  configured: boolean
  loading: boolean
  session: Session | null
  user: User | null
  profile: Profile | null
  isAdmin: boolean
  refreshProfile: () => Promise<void>
  signOut: () => Promise<void>
}

const Ctx = createContext<AuthValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(Boolean(supabase))
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const userId = session?.user.id ?? null

  useEffect(() => {
    if (!supabase) return
    let alive = true
    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return
      setSession(data.session)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })
    return () => {
      alive = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const load = useCallback(async () => {
    if (!supabase || !userId) {
      setProfile(null)
      setIsAdmin(false)
      return
    }
    const [p, a] = await Promise.all([
      supabase.from('profiles').select('id, display_name, phone, preferred_locale, email, created_at').eq('id', userId).maybeSingle(),
      supabase.from('admin_members').select('user_id').eq('user_id', userId).maybeSingle()
    ])
    setProfile((p.data as Profile | null) ?? null)
    setIsAdmin(Boolean(a.data))
  }, [userId])

  useEffect(() => {
    void load()
  }, [load])

  const value = useMemo<AuthValue>(
    () => ({
      configured: Boolean(supabase),
      loading,
      session,
      user: session?.user ?? null,
      profile,
      isAdmin,
      refreshProfile: load,
      signOut: async () => {
        if (supabase) await supabase.auth.signOut()
      }
    }),
    [loading, session, profile, isAdmin, load]
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAuth(): AuthValue {
  const v = useContext(Ctx)
  if (!v) throw new Error('useAuth вне AuthProvider')
  return v
}
