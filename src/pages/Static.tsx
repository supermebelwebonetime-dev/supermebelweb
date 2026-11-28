import { Link } from 'react-router-dom'
import { MapPin, MessageCircle, Phone } from 'lucide-react'
import Seo from '../components/Seo'
import InquiryForm from '../components/InquiryForm'
import { useLang } from '../i18n/LangContext'
import { useSettings } from '../lib/SettingsContext'

export function About() {
  const { t, to } = useLang()
  return (
    <>
      <Seo title={t.about.title} description={t.seo.aboutDesc} />
      <section className="section page-top">
        <div className="wrap narrow">
          <h1>{t.about.title}</h1>
          <p className="lead">{t.about.lead}</p>
          <p>{t.about.text}</p>
          <Link className="btn btn-primary" to={to('/#request')}>{t.cta}</Link>
        </div>
      </section>
    </>
  )
}

export function Contacts() {
  const { t } = useLang()
  const { phoneDisplay, waDigits, waLink, address } = useSettings()
  return (
    <>
      <Seo title={t.contacts.title} description={t.seo.contactsDesc} />
      <section className="section page-top">
        <div className="wrap request-grid light">
          <div>
            <h1>{t.contacts.title}</h1>
            <p className="lead">{t.contacts.city}</p>
            <ul className="contact-list">
              <li>
                <MapPin size={18} aria-hidden="true" />
                <span>{address || t.contacts.addressPending}</span>
              </li>
              <li>
                <Phone size={18} aria-hidden="true" />
                <a href={`tel:+${waDigits}`}>{phoneDisplay}</a>
              </li>
              <li>
                <MessageCircle size={18} aria-hidden="true" />
                <a href={waLink()} target="_blank" rel="noopener noreferrer">{t.whatsapp}</a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="subhead">{t.contacts.formTitle}</h2>
            <InquiryForm />
          </div>
        </div>
      </section>
    </>
  )
}

export function Privacy() {
  const { t } = useLang()
  return (
    <>
      <Seo title={t.privacy.title} description={t.seo.privacyDesc} />
      <section className="section page-top">
        <div className="wrap narrow prose">
          <h1>{t.privacy.title}</h1>
          <p className="notice">{t.privacy.updated}</p>
          {t.privacy.sections.map(([h, p]) => (
            <div key={h}>
              <h2>{h}</h2>
              <p>{p}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export function Thanks() {
  const { t, to } = useLang()
  const { waLink } = useSettings()
  return (
    <>
      <Seo title={t.thanks.title} noindex />
      <section className="section page-top">
        <div className="wrap narrow">
          <h1>{t.thanks.title}</h1>
          <p className="lead">{t.thanks.text}</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href={waLink(t.thanks.waText)} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={18} />
              {t.whatsapp}
            </a>
            <Link className="btn btn-ghost" to={to('/')}>{t.thanks.home}</Link>
          </div>
        </div>
      </section>
    </>
  )
}
