import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Seo from '../components/Seo'
import PanelArt, { kindFor } from '../components/PanelArt'
import InquiryForm from '../components/InquiryForm'
import { useLang } from '../i18n/LangContext'
import { FINISH_COLORS } from '../i18n/dict'
import { useCategories } from '../lib/useCategories'
import { supabase } from '../lib/supabase'
import NotFound from './NotFound'

export function Catalog() {
  const { lang, t, to } = useLang()
  const { items, failed } = useCategories()
  return (
    <>
      <Seo title={t.catalog.pageTitle} description={t.seo.catalogDesc} />
      <section className="section page-top">
        <div className="wrap">
          <h1>{t.catalog.pageTitle}</h1>
          <p className="lead">{t.catalog.text}</p>
          {failed && <p className="notice">{t.catalog.loadError}</p>}
          <ul className="tiles">
            {items.map((c, i) => (
              <li key={c.slug}>
                <Link to={to(`/catalog/${c.slug}`)}>
                  <PanelArt kind={kindFor(c.slug)} color={FINISH_COLORS[i % FINISH_COLORS.length]} className="tile-art" />
                  <h2>{lang === 'kk' ? c.name_kk : c.name_ru}</h2>
                  <p>{lang === 'kk' ? c.description_kk : c.description_ru}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

interface Project {
  id: string
  title_ru: string
  title_kk: string
  description_ru: string
  description_kk: string
  images: string[]
}

export function CategoryPage() {
  const { slug } = useParams()
  const { lang, t, to } = useLang()
  const { items } = useCategories()
  const [projects, setProjects] = useState<Project[]>([])
  const cat = items.find(c => c.slug === slug)

  useEffect(() => {
    if (!supabase || !cat || cat.id === cat.slug) return
    let alive = true
    supabase
      .from('projects')
      .select('id, title_ru, title_kk, description_ru, description_kk, images')
      .eq('category_id', cat.id)
      .eq('is_published', true)
      .order('sort_order')
      .then(({ data }) => {
        if (alive && data) setProjects(data as Project[])
      })
    return () => {
      alive = false
    }
  }, [cat])

  if (!cat) return <NotFound />
  const name = lang === 'kk' ? cat.name_kk : cat.name_ru
  const desc = lang === 'kk' ? cat.description_kk : cat.description_ru
  const idx = items.findIndex(c => c.slug === cat.slug)
  const imageUrl = (path: string) => supabase?.storage.from('catalog').getPublicUrl(path).data.publicUrl ?? ''

  return (
    <>
      <Seo title={name} description={desc} />
      <section className="section page-top">
        <div className="wrap">
          <Link className="text-link back" to={to('/catalog')}><ArrowLeft size={16} />{t.catalog.back}</Link>
          <div className="category-head">
            <div>
              <h1>{name}</h1>
              <p className="lead">{desc}</p>
              <a className="btn btn-primary" href="#order">{t.catalog.order}<ArrowRight size={18} /></a>
            </div>
            <PanelArt kind={kindFor(cat.slug)} color={FINISH_COLORS[idx % FINISH_COLORS.length]} className="category-art" />
          </div>

          <h2 className="subhead">{t.catalog.projects}</h2>
          {projects.length === 0 ? (
            <p className="notice">{t.catalog.empty}</p>
          ) : (
            <div className="gallery">
              {projects.map(p =>
                p.images.map((img, i) => (
                  <img key={`${p.id}-${i}`} src={imageUrl(img)} alt={lang === 'kk' ? p.title_kk : p.title_ru} loading="lazy" decoding="async" />
                ))
              )}
            </div>
          )}
        </div>
      </section>
      <section className="section band" id="order">
        <div className="wrap request-grid">
          <div>
            <h2>{t.contacts.formTitle}</h2>
            <p className="lead">{t.contacts.formText}</p>
          </div>
          <InquiryForm onDark defaultType={cat.slug} />
        </div>
      </section>
    </>
  )
}
