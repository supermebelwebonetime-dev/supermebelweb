import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { FALLBACK_WA_DIGITS, formatPhone } from './config'
import { supabase } from './supabase'

interface SettingsValue {
  waDigits: string
  phoneDisplay: string
  waLink: (text?: string) => string
}

const Ctx = createContext<SettingsValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [digits, setDigits] = useState(FALLBACK_WA_DIGITS)

  useEffect(() => {
    if (!supabase) return
    let alive = true
    supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'whatsapp_phone')
      .maybeSingle()
      .then(({ data }) => {
        const v = typeof data?.value === 'string' ? data.value.replace(/\D/g, '') : ''
        if (alive && v.length >= 10) setDigits(v)
      })
    return () => {
      alive = false
    }
  }, [])

  const value = useMemo<SettingsValue>(
    () => ({
      waDigits: digits,
      phoneDisplay: formatPhone(digits),
      waLink: (text?: string) => `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ''}`
    }),
    [digits]
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useSettings(): SettingsValue {
  const v = useContext(Ctx)
  if (!v) throw new Error('useSettings вне SettingsProvider')
  return v
}
