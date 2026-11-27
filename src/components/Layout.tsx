import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Menu, MessageCircle, Moon, Sun, User, X } from 'lucide-react'
import { LangProvider, useLang } from '../i18n/LangContext'
import type { Lang } from '../i18n/dict'
import { SettingsProvider, useSettings } from '../lib/SettingsContext'
import { AuthProvider, useAuth } from '../lib/AuthContext'
import { localPath, stripLang } from '../lib/paths'

function Brand() {
  const { to } = useLang()
  return (
    <Link className="brand" to={to('/')} aria-label="SuperMebelWeb">
      <span className="brand-mark" aria-hidden="true">
        <i /><i />
      </span>
      <span className="brand-name">SuperMebel<span>Web</span></span>
    </Link>
  )
}

function ThemeToggle() {
  const { t } = useLang()
  const [dark, setDark] = useState(() => document.documentElement.dataset.theme === 'dark')
  const toggle = () => {
    const next = !dark
    setDark(next)
    document.documentElement.dataset.theme = next ? 'dark' : 'light'
    try {
      localStorage.setItem('smw-theme', next ? 'dark' : 'light')
    } catch {
      /* хранилище недоступно: тема просто не запомнится */
    }
  }
  const label = dark ? t.theme.light : t.theme.dark
  return (
    <button type="button" className="icon-btn" onClick={toggle} aria-label={label} title={label}>
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}

function LangSwitch() {
  const { lang, t } = useLang()
  const { pathname, search, hash } = useLocation()
  const base = stripLang(pathname)
  return (
    <div className="lang-switch" role="group" aria-label={t.lang.switchLabel}>
      {(['ru', 'kk'] as const).map(l => (
        <Link
          key={l}
          to={localPath(l, base) + search + hash}
          className={l === lang ? 'is-active' : undefined}
          aria-current={l === lang ? 'true' : undefined}
          hrefLang={l}
          lang={l}
        >
          {l === 'ru' ? 'RU' : 'KK'}
        </Link>
      ))}
    </div>
  )
}

function Header() {
  const { t, to } = useLang()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])

  const links: [string, string][] = [
    ['/catalog', t.nav.catalog],
    ['/#process', t.nav.process],
    ['/about', t.nav.about],
    ['/contacts', t.nav.contacts]
  ]

  return (
    <header className="header">
      <div className="header-inner">
        <Brand />
        <nav className={open ? 'nav is-open' : 'nav'} aria-label="Основная навигация">
          {links.map(([path, label]) =>
            path.includes('#') ? (
              <Link key={path} to={to(path)}>{label}</Link>
            ) : (
              <NavLink key={path} to={to(path)}>{label}</NavLink>
            )
          )}
        </nav>
        <div className="header-tools">
          <LangSwitch />
          <ThemeToggle />
          <Link className="icon-btn" to={to(user ? '/account' : '/login')} aria-label={user ? t.account : t.login} title={user ? t.account : t.login}>
            <User size={18} />
          </Link>
          <button type="button" className="icon-btn menu-btn" onClick={() => setOpen(o => !o)} aria-expanded={open} aria-label={t.menu}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  )
}

function Footer() {
  const { t, to } = useLang()
  const { phoneDisplay, waLink } = useSettings()
  return (
    <footer className="footer">
      <div className="footer-inner">
        <Brand />
        <p>{t.footer.text}</p>
        <a href={waLink()} target="_blank" rel="noopener noreferrer">{phoneDisplay}</a>
        <Link to={to('/privacy')}>{t.footer.privacy}</Link>
        <small>© {new Date().getFullYear()} SuperMebelWeb. {t.footer.rights}</small>
      </div>
    </footer>
  )
}

function FloatingActions() {
  const { t } = useLang()
  const { waLink } = useSettings()
  return (
    <div className="floating">
      <a className="fab glass" href={waLink()} target="_blank" rel="noopener noreferrer" aria-label={t.whatsapp} title={t.whatsapp}>
        <MessageCircle size={22} />
      </a>
    </div>
  )
}

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView()
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function Layout({ lang }: { lang: Lang }) {
  return (
    <LangProvider lang={lang}>
      <SettingsProvider>
        <AuthProvider>
          <LayoutBody />
        </AuthProvider>
      </SettingsProvider>
    </LangProvider>
  )
}

function LayoutBody() {
  const { t } = useLang()
  return (
    <>
      <a className="skip-link" href="#main">{t.skip}</a>
      <ScrollManager />
      <Header />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <FloatingActions />
    </>
  )
}
