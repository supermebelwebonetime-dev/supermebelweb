import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Seo from '../components/Seo'
import { useLang } from '../i18n/LangContext'
import { useAuth } from '../lib/AuthContext'
import { safeNext } from '../lib/paths'
import { supabase } from '../lib/supabase'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function Shell({ title, children }: { title: string; children: ReactNode }) {
  const { t } = useLang()
  const { configured } = useAuth()
  return (
    <>
      <Seo title={title} noindex />
      <section className="section page-top">
        <div className="wrap auth-wrap">
          <h1>{title}</h1>
          {configured ? children : <p className="notice">{t.auth.notConfigured}</p>}
        </div>
      </section>
    </>
  )
}

export function Login() {
  const { t, to } = useLang()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = safeNext(params.get('next'))
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) navigate(next ?? to('/account'), { replace: true })
  }, [user, next, navigate, to])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!supabase || busy) return
    setBusy(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setBusy(false)
    if (err) setError(t.auth.loginError)
  }

  return (
    <Shell title={t.auth.loginTitle}>
      <form className="form" onSubmit={submit} noValidate>
        <label><span>{t.auth.email}</span><input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required /></label>
        <label><span>{t.auth.password}</span><input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required /></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? t.auth.loginBusy : t.auth.loginSubmit}</button>
        <p className="form-note"><Link to={to('/forgot')}>{t.auth.forgot}</Link></p>
        <p className="form-note">{t.auth.noAccount} <Link to={to('/register')}>{t.auth.registerLink}</Link></p>
      </form>
    </Shell>
  )
}

export function Register() {
  const { lang, t, to } = useLang()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!supabase || busy) return
    if (!EMAIL_RE.test(email.trim())) return setError(t.auth.errEmail)
    if (password.length < 8) return setError(t.auth.errShortPassword)
    setBusy(true)
    setError('')
    const { error: err } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { display_name: name.trim().slice(0, 100), locale: lang },
        emailRedirectTo: `${window.location.origin}${to('/login')}`
      }
    })
    setBusy(false)
    if (err) setError(t.auth.registerError)
    else setDone(true)
  }

  return (
    <Shell title={t.auth.registerTitle}>
      {done ? (
        <p className="notice" role="status">{t.auth.registerDone}</p>
      ) : (
        <form className="form" onSubmit={submit} noValidate>
          <label><span>{t.auth.name}</span><input value={name} onChange={e => setName(e.target.value)} maxLength={100} autoComplete="name" /></label>
          <label><span>{t.auth.email}</span><input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required /></label>
          <label><span>{t.auth.password}</span><input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" minLength={8} required /><small>{t.auth.passwordHint}</small></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? t.auth.registerBusy : t.auth.registerSubmit}</button>
          <p className="form-note">{t.auth.haveAccount} <Link to={to('/login')}>{t.auth.loginSubmit}</Link></p>
        </form>
      )}
    </Shell>
  )
}

export function Forgot() {
  const { t, to } = useLang()
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!supabase || busy) return
    if (!EMAIL_RE.test(email.trim())) return setError(t.auth.errEmail)
    setBusy(true)
    setError('')
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}${to('/reset')}`
    })
    setBusy(false)
    // Ответ одинаков для существующих и несуществующих адресов, чтобы нельзя было перебирать почты.
    if (err && err.status !== 400 && err.status !== 422) setError(t.auth.errGeneric)
    else setDone(true)
  }

  return (
    <Shell title={t.auth.forgotTitle}>
      {done ? (
        <p className="notice" role="status">{t.auth.forgotDone}</p>
      ) : (
        <form className="form" onSubmit={submit} noValidate>
          <p>{t.auth.forgotText}</p>
          <label><span>{t.auth.email}</span><input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required /></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="btn btn-primary" type="submit" disabled={busy}>{t.auth.forgotSubmit}</button>
        </form>
      )}
    </Shell>
  )
}

export function Reset() {
  const { t, to } = useLang()
  const { session, loading } = useAuth()
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!supabase || busy) return
    if (password.length < 8) return setError(t.auth.errShortPassword)
    setBusy(true)
    setError('')
    const { error: err } = await supabase.auth.updateUser({ password })
    setBusy(false)
    if (err) setError(t.auth.errGeneric)
    else setDone(true)
  }

  let body: ReactNode
  if (loading) body = <p>{t.auth.loading}</p>
  else if (done)
    body = (
      <>
        <p className="notice" role="status">{t.auth.resetDone}</p>
        <Link className="btn btn-primary" to={to('/account')}>{t.account}</Link>
      </>
    )
  else if (!session)
    body = (
      <>
        <p className="notice">{t.auth.resetNoSession}</p>
        <Link className="btn btn-primary" to={to('/forgot')}>{t.auth.forgotSubmit}</Link>
      </>
    )
  else
    body = (
      <form className="form" onSubmit={submit} noValidate>
        <label><span>{t.auth.passwordNew}</span><input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" minLength={8} required /><small>{t.auth.passwordHint}</small></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="btn btn-primary" type="submit" disabled={busy}>{t.auth.resetSubmit}</button>
      </form>
    )

  return <Shell title={t.auth.resetTitle}>{body}</Shell>
}
