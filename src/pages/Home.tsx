import { useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Seo from '../components/Seo'
import PanelArt, { kindFor } from '../components/PanelArt'
import InquiryForm from '../components/InquiryForm'
import { useLang } from '../i18n/LangContext'
import { FINISH_COLORS } from '../i18n/dict'
import { useCategories } from '../lib/useCategories'

export default function Home() {
  const { lang, t, to } = useLang()
  const { items } = useCategories()
  const [finish, setFinish] = useState(0)

  return (
    <>
      <Seo home />
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <h1>{t.hero.title}</h1>
            <p className="lead">{t.hero.text}</p>
            <div className="hero-actions">
              <Link className="btn btn-primary" to={to('/#request')}>{t.cta}<ArrowRight size={18} /></Link>
              <Link className="btn btn-ghost" to={to('/catalog')}>{t.seeCatalog}</Link>
            </div>
            <fieldset className="finishes">
              <legend>{t.hero.pick}: <b>{t.finishes[finish]}</b></legend>
              <div className="swatches">
                {FINISH_COLORS.map((color, i) => (
                  <label key={color} className="swatch" style={{ '--sw': color } as CSSProperties} title={t.finishes[i]}>
                    <input type="radio" name="finish" checked={finish === i} onChange={() => setFinish(i)} aria-label={t.finishes[i]} />
                    <span />
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
          <figure className="stage">
            <PanelArt kind="kitchen" color={FINISH_COLORS[finish]} label={t.hero.art} className="stage-art" />
            <figcaption>{t.hero.caption}</figcaption>
          </figure>
        </div>
      </section>

      <section className="section" id="catalog">
        <div className="wrap">
          <div className="section-head">
            <h2>{t.catalog.title}</h2>
            <p>{t.catalog.text}</p>
          </div>
          <ul className="index-list">
            {items.map((c, i) => (
              <li key={c.slug}>
                <Link to={to(`/catalog/${c.slug}`)}>
                  <PanelArt kind={kindFor(c.slug)} color={FINISH_COLORS[i % FINISH_COLORS.length]} className="index-thumb" />
                  <span className="index-name">{lang === 'kk' ? c.name_kk : c.name_ru}</span>
                  <span className="index-desc">{lang === 'kk' ? c.description_kk : c.description_ru}</span>
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section-alt" id="process">
        <div className="wrap">
          <div className="section-head">
            <h2>{t.process.title}</h2>
          </div>
          <ol className="steps">
            {t.process.steps.map(([title, text]) => (
              <li key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="wrap about-split">
          <h2>{t.about.homeTitle}</h2>
          <div>
            <p className="lead">{t.about.text}</p>
            <Link className="text-link" to={to('/about')}>{t.nav.about}<ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      <section className="section band" id="request">
        <div className="wrap request-grid">
          <div>
            <h2>{t.contacts.formTitle}</h2>
            <p className="lead">{t.contacts.formText}</p>
          </div>
          <InquiryForm onDark />
        </div>
      </section>
    </>
  )
}
