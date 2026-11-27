import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import { useLang } from '../i18n/LangContext'

export default function NotFound() {
  const { t, to } = useLang()
  return (
    <>
      <Seo title={t.notFound.title} noindex />
      <section className="section page-top">
        <div className="wrap narrow">
          <h1>{t.notFound.title}</h1>
          <p className="lead">{t.notFound.text}</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to={to('/')}>{t.thanks.home}</Link>
            <Link className="btn btn-ghost" to={to('/catalog')}>{t.seeCatalog}</Link>
          </div>
        </div>
      </section>
    </>
  )
}
