import { useEffect, useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import Seo from '../components/Seo'
import { useLang } from '../i18n/LangContext'
import { useAuth } from '../lib/AuthContext'
import { useCategories } from '../lib/useCategories'
import { supabase } from '../lib/supabase'

interface Inquiry {
  id: string
  furniture_type: string | null
  description: string
  status: string
  created_at: string
}

export default function Account() {
  const { lang, t, to } = useLang()
  const { configured, loading, user, profile, refreshProfile, signOut } = useAuth()
  const { items } = useCategories()
  const { pathname } = useLocation()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [locale, setLocale] = useState<'ru' | 'kk'>(lang)
  const [msg, setMsg] = useState('')
  const [pwd, setPwd] = useState('')
  const [pwdMsg, setPwdMsg] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [emailMsg, setEmailMsg] = useState('')
  const [inquiries, setInquiries] = useState<Inquiry[]>([])

  useEffect(() => {
    if (!profile) return
    setName(profile.display_name ?? '')
    setPhone(profile.phone ?? '')
    setLocale(profile.preferred_locale)
  }, [profile])

  const uid = user?.id
  useEffect(() => {
    if (!supabase || !uid) return
    let alive = true
    supabase
      .from('inquiries')
      .select('id, furniture_type, description, status, created_at')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (alive && data) setInquiries(data as Inquiry[])
      })
    return () => {
      alive = false
    }
  }, [uid])

  if (!configured) return <p className="wrap section page-top notice">{t.auth.notConfigured}</p>
  if (loading) return <p className="wrap section page-top">{t.auth.loading}</p>
  if (!user) return <Navigate to={`${to('/login')}?next=${encodeURIComponent(pathname)}`} replace />

  const saveProfile = async (e: FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    setMsg('')
    const { error } = await supabase
      .from('profiles')
      .update({ display_name: name.trim().slice(0, 100), phone: phone.trim().slice(0, 32) || null, preferred_locale: locale })
      .eq('id', user.id)
    if (error) setMsg(t.auth.errGeneric)
    else {
      setMsg(t.acc.saved)
      await refreshProfile()
    }
  }

  const changePassword = async (e: FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    if (pwd.length < 8) return setPwdMsg(t.auth.errShortPassword)
    const { error } = await supabase.auth.updateUser({ password: pwd })
    setPwdMsg(error ? t.auth.errGeneric : t.auth.resetDone)
    if (!error) setPwd('')
  }

  const changeEmail = async (e: FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(newEmail.trim())) return setEmailMsg(t.auth.errEmail)
    const { error } = await supabase.auth.updateUser({ email: newEmail.trim() }, { emailRedirectTo: `${window.location.origin}${to('/account')}` })
    setEmailMsg(error ? t.auth.errGeneric : t.acc.emailSent)
  }

  const typeName = (slug: string | null) => {
    const c = items.find(i => i.slug === slug)
    return c ? (lang === 'kk' ? c.name_kk : c.name_ru) : ''
  }
  const date = (iso: string) => new Date(iso).toLocaleDateString(lang === 'kk' ? 'kk-KZ' : 'ru-RU')

  return (
    <>
      <Seo title={t.acc.title} noindex />
      <section className="section page-top">
        <div className="wrap account-grid">
          <div className="account-head">
            <h1>{t.acc.title}</h1>
            <button className="btn btn-ghost" type="button" onClick={() => void signOut()}>{t.acc.logout}</button>
          </div>

          <form className="form" onSubmit={saveProfile}>
            <h2 className="subhead">{t.acc.profile}</h2>
            <label><span>{t.auth.email}</span><input value={user.email ?? ''} readOnly /></label>
            <label><span>{t.auth.name}</span><input value={name} onChange={e => setName(e.target.value)} maxLength={100} /></label>
            <label><span>{t.acc.phone}</span><input value={phone} onChange={e => setPhone(e.target.value)} maxLength={32} inputMode="tel" /></label>
            <label>
              <span>{t.acc.language}</span>
              <select value={locale} onChange={e => setLocale(e.target.value === 'kk' ? 'kk' : 'ru')}>
                <option value="ru">{t.lang.ru}</option>
                <option value="kk">{t.lang.kk}</option>
              </select>
            </label>
            <p className="form-note">{t.acc.registered}: {date(profile?.created_at ?? user.created_at)}</p>
            {msg && <p className="form-note" role="status">{msg}</p>}
            <button className="btn btn-primary" type="submit">{t.acc.save}</button>
          </form>

          <div className="stack">
            <form className="form" onSubmit={changePassword}>
              <h2 className="subhead">{t.acc.security}</h2>
              <label><span>{t.auth.passwordNew}</span><input type="password" value={pwd} onChange={e => setPwd(e.target.value)} autoComplete="new-password" minLength={8} /></label>
              {pwdMsg && <p className="form-note" role="status">{pwdMsg}</p>}
              <button className="btn btn-ghost" type="submit">{t.acc.changePassword}</button>
            </form>
            <form className="form" onSubmit={changeEmail}>
              <label><span>{t.acc.newEmail}</span><input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} autoComplete="email" /></label>
              {emailMsg && <p className="form-note" role="status">{emailMsg}</p>}
              <button className="btn btn-ghost" type="submit">{t.acc.changeEmail}</button>
            </form>
          </div>

          <div className="inq">
            <h2 className="subhead">{t.acc.inquiries}</h2>
            {inquiries.length === 0 ? (
              <p className="notice">{t.acc.noInquiries} <Link to={to('/#request')}>{t.cta}</Link></p>
            ) : (
              <ul className="inq-list">
                {inquiries.map(q => (
                  <li key={q.id}>
                    <div>
                      <b>{typeName(q.furniture_type) || t.form.typeAny}</b>
                      <span>{date(q.created_at)}</span>
                    </div>
                    <p>{q.description}</p>
                    <em>{t.acc.status[q.status] ?? q.status}</em>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
