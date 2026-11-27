// Создаёт sitemap.xml и robots.txt после сборки. Адрес берётся из SITE_URL или из URL, который задаёт Netlify.
import { writeFileSync, mkdirSync } from 'node:fs'

const site = (process.env.SITE_URL || process.env.URL || 'http://localhost:4173').replace(/\/$/, '')
const pages = ['/', '/catalog', '/about', '/contacts', '/privacy']
const categories = ['kitchens', 'wardrobes', 'dressing-rooms', 'bedrooms', 'kids', 'living-rooms', 'hallways', 'office', 'other']
const all = [...pages, ...categories.map(c => `/catalog/${c}`)]

const loc = (lang, p) => site + (lang === 'ru' ? p : p === '/' ? '/kk' : `/kk${p}`)

const urls = all
  .flatMap(p =>
    ['ru', 'kk'].map(lang => {
      const links = [
        `<xhtml:link rel="alternate" hreflang="ru" href="${loc('ru', p)}"/>`,
        `<xhtml:link rel="alternate" hreflang="kk" href="${loc('kk', p)}"/>`,
        `<xhtml:link rel="alternate" hreflang="x-default" href="${loc('ru', p)}"/>`
      ].join('')
      return `<url><loc>${loc(lang, p)}</loc>${links}</url>`
    })
  )
  .join('\n')

mkdirSync('dist', { recursive: true })
writeFileSync(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`
)
writeFileSync(
  'dist/robots.txt',
  `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /account\nDisallow: /api/\n\nSitemap: ${site}/sitemap.xml\n`
)
console.log(`sitemap.xml и robots.txt созданы для ${site}`)
