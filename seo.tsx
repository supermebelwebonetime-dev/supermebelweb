import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLang } from '../i18n/LangContext'
import { localPath, stripLang } from '../lib/paths'

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLinks(items: { rel: string; href: string; hreflang?: string }[]) {
  document.head.querySelectorAll('link[data-seo]').forEach(n => n.remove())
  for (const it of items) {
    const el = document.createElement('link')
    el.rel = it.rel
    el.href = it.href
    if (it.hreflang) el.hreflang = it.hreflang
    el.setAttribute('data-seo', '1')
    document.head.appendChild(el)
  }
}

interface Props {
  title?: string
  description?: string
  noindex?: boolean
  home?: boolean
}

export default function Seo({ title, description, noindex, home }: Props) {
  const { lang, t } = useLang()
  const { pathname } = useLocation()

  useEffect(() => {
    const origin = window.location.origin
    const base = stripLang(pathname).replace(/\/+$/, '') || '/'
    const fullTitle = title ? `${title} — SuperMebelWeb` : t.seo.homeTitle
    const desc = description ?? t.seo.homeDesc

    document.documentElement.lang = lang
    document.title = fullTitle
    setMeta('name', 'description', desc)
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', desc)
    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:site_name', 'SuperMebelWeb')
    setMeta('property', 'og:locale', lang === 'kk' ? 'kk_KZ' : 'ru_RU')
    setMeta('property', 'og:url', origin + localPath(lang, base))

    setLinks([
      { rel: 'canonical', href: origin + localPath(lang, base) },
      { rel: 'alternate', hreflang: 'ru', href: origin + localPath('ru', base) },
      { rel: 'alternate', hreflang: 'kk', href: origin + localPath('kk', base) },
      { rel: 'alternate', hreflang: 'x-default', href: origin + localPath('ru', base) }
    ])

    document.getElementById('ld-business')?.remove()
    if (home) {
      const s = document.createElement('script')
      s.type = 'application/ld+json'
      s.id = 'ld-business'
      s.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'SuperMebelWeb',
        description: t.seo.homeDesc,
        url: origin + localPath(lang, '/'),
        areaServed: 'Шымкент',
        address: { '@type': 'PostalAddress', addressLocality: 'Шымкент', addressCountry: 'KZ' }
      })
      document.head.appendChild(s)
    }
  }, [lang, t, pathname, title, description, noindex, home])

  return null
}
