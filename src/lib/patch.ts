import type { Lang } from '../i18n/dict'

export function localPath(lang: Lang, path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  if (lang === 'ru') return p
  return p === '/' ? '/kk' : `/kk${p}`
}

/** Убирает языковой префикс: /kk/catalog -> /catalog */
export function stripLang(pathname: string): string {
  if (pathname === '/kk') return '/'
  if (pathname.startsWith('/kk/')) return pathname.slice(3)
  return pathname
}

/** Допускает только внутренние пути, чтобы не получить открытый редирект. */
export function safeNext(next: string | null): string | null {
  if (!next) return null
  if (!next.startsWith('/') || next.startsWith('//') || next.includes('\\')) return null
  return next
}
