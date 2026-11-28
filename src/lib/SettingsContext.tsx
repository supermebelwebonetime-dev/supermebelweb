import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { FALLBACK_WA_DIGITS, formatPhone } from './config'
import { supabase } from './supabase'

interface SettingsValue {
  waDigits: string
  phoneDisplay: string
  address: string
  waLink: (text?: string) => string
}

const Ctx = createContext<SettingsValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [digits, setDigits] = useState(FALLBACK_WA_DIGITS)
  const [address, setAddress] = useState('')

  useEffect(() => {
    if (!supabase) return
    let alive = true
    supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['whatsapp_phone', 'address'])
      .then(({ data }) => {
        if (!alive || !data) return
        for (const row of data) {
          if (typeof row.value !== 'string') continue
          if (row.key === 'whatsapp_phone') {
            const v = row.value.replace(/\D/g, '')
            if (v.length >= 10) setDigits(v)
          } else if (row.key === 'address') {
            setAddress(row.value.trim().slice(0, 200))
          }
        }
      })
    return () => {
      alive = false
    }
  }, [])

  const value = useMemo<SettingsValue>(
    () => ({
      waDigits: digits,
      phoneDisplay: formatPhone(digits),
      address,
      waLink: (text?: string) => `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ''}`
    }),
    [digits, address]
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useSettings(): SettingsValue {
  const v = useContext(Ctx)
  if (!v) throw new Error('useSettings вне SettingsProvider')
  return v
}
