import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { useLang } from '../i18n/LangContext'
import { useAuth } from '../lib/AuthContext'
import { useSettings } from '../lib/SettingsContext'
import { useCategories } from '../lib/useCategories'
import { supabase } from '../lib/supabase'

interface Props {
  defaultType?: string
  onDark?: boolean
}

export default function InquiryForm({ defaultType = '', onDark }: Props) {
  const { lang, t, to } = useLang()
  const { profile } = useAuth()
  const { waLink } = useSettings()
  const { items } = useCategories()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [type, setType] = useState(defaultType)
  const [description, setDescription] = useState('')
  const [trap, setTrap] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [showWa, setShowWa] = useState(false)

  useEffect(() => {
    if (!profile) return
    setName(n => n || profile.display_name || '')
    setPhone(p => p || profile.phone || '')
  }, [profile])

  useEffect(() => setType(defaultType), [defaultType])

  const waText = () =>
    [
      'Заявка с сайта SuperMebelWeb',
      `Имя: ${name.trim()}`,
      `Телефон: ${phone.trim()}`,
      type ? `Тип: ${type}` : '',
      description.trim() ? `Задача: ${description.trim()}` : ''
    ]
      .filter(Boolean)
      .join('\n')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (busy) return
    const digits = phone.replace(/\D/g, '')
    if (!name.trim()) return setError(t.form.errName)
    if (digits.length < 10 || digits.length > 15) return setError(t.form.errPhone)

    setBusy(true)
    setError('')
    setShowWa(false)
    try {
      const token = supabase ? (await supabase.auth.getSession()).data.session?.access_token : undefined
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          furnitureType: type,
          description: description.trim(),
          locale: lang,
          website: trap
        })
      })
      if (res.ok) {
        navigate(to('/thanks'))
        return
      }
      setError(res.status === 429 ? t.form.errRate : t.form.errGeneric)
      setShowWa(true)
    } catch {
      setError(t.form.errGeneric)
      setShowWa(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className={onDark ? 'form on-dark' : 'form'} onSubmit={submit} noValidate>
      <label>
        <span>{t.form.name}</span>
        <input value={name} onChange={e => setName(e.target.value)} maxLength={100} autoComplete="name" required />
      </label>
      <label>
        <span>{t.form.phone}</span>
        <input value={phone} onChange={e => setPhone(e.target.value)} maxLength={32} inputMode="tel" autoComplete="tel" placeholder="+7 777 123 4567" required />
      </label>
      <label>
        <span>{t.form.type}</span>
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="">{t.form.typeAny}</option>
          {items.map(c => (
            <option key={c.slug} value={c.slug}>{lang === 'kk' ? c.name_kk : c.name_ru}</option>
          ))}
        </select>
      </label>
      <label>
        <span>{t.form.description}</span>
        <textarea value={description} onChange={e => setDescription(e.target.value)} maxLength={2000} rows={4} />
      </label>
      <div className="trap" aria-hidden="true">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={trap} onChange={e => setTrap(e.target.value)} />
        </label>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="form-actions">
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? t.form.sending : t.form.submit}
          {!busy && <ArrowRight size={18} />}
        </button>
        {showWa && (
          <a className="btn btn-ghost" href={waLink(waText())} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={18} />
            {t.whatsapp}
          </a>
        )}
      </div>
      <p className="form-note">
        {t.form.consentBefore}
        <Link to={to('/privacy')}>{t.form.consentLink}</Link>
        {t.form.consentAfter}
      </p>
    </form>
  )
}
