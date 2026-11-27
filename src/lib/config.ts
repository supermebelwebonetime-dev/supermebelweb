const clean = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

export const SUPABASE_URL = clean(import.meta.env.VITE_SUPABASE_URL)
export const SUPABASE_KEY = clean(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)

/** Запасной номер на случай, если настройки сайта в базе недоступны. */
export const FALLBACK_WA_DIGITS = clean(import.meta.env.VITE_WHATSAPP_PHONE).replace(/\D/g, '') || '77777777777'

export function formatPhone(digits: string): string {
  const d = digits.replace(/\D/g, '')
  if (d.length !== 11) return `+${d}`
  return `+${d[0]} ${d.slice(1, 4)} ${d.slice(4, 7)} ${d.slice(7)}`
}
