import { useState } from 'react'
import { ArrowUpRight, Menu, X, MessageCircle, Check, MoveUpRight, Sofa, PanelsTopLeft, Ruler, Sparkles } from 'lucide-react'

type Lang = 'ru' | 'kz'

const copy = {
  ru: {
    nav: ['Каталог', 'Как работаем', 'О компании', 'Контакты'],
    eyebrow: 'МЕБЕЛЬ НА ЗАКАЗ · ШЫМКЕНТ',
    heroTitle: <>Пространство,<br /><em>которое</em> ваше.</>,
    heroText: 'Создаём мебель под ваш интерьер, привычки и ритм жизни. От первого замера до аккуратной установки.',
    cta: 'Обсудить проект',
    explore: 'Смотреть каталог',
    note: 'Индивидуальный подход. Продуманные детали. Точный результат.',
    catalogEyebrow: 'НАШИ РЕШЕНИЯ',
    catalogTitle: 'Мебель, созданная для вас',
    catalogText: 'Каждый проект начинается с вашего пространства и ваших пожеланий.',
    items: [
      ['01', 'Кухни на заказ', 'Эргономика и эстетика в каждой детали.', 'КУХНИ'],
      ['02', 'Шкафы и гардеробные', 'Удобное хранение без лишнего визуального шума.', 'ХРАНЕНИЕ'],
      ['03', 'Мебель для гостиной', 'Цельный образ и комфорт для каждого дня.', 'ГОСТИНАЯ'],
      ['04', 'Мебель для спальни', 'Спокойная атмосфера и функциональность.', 'СПАЛЬНЯ']
    ],
    processEyebrow: 'ПОНЯТНЫЙ ПРОЦЕСС',
    processTitle: 'От идеи до готовой мебели',
    steps: [
      ['Заявка', 'Расскажите, какую мебель хотите и что важно учесть.'],
      ['Консультация', 'Свяжемся с вами, уточним детали и договоримся о замере.'],
      ['Расчёт и договор', 'Подготовим предложение и согласуем условия проекта.'],
      ['Изготовление и установка', 'После согласования приступим к работе и установим мебель.']
    ],
    aboutEyebrow: 'SUPER MEBEL WEB',
    aboutTitle: 'Ваш дом. Ваш стиль. Ваше решение.',
    aboutText: 'Мы верим, что хорошая мебель начинается не с шаблона, а с понимания человека. Поэтому учитываем размеры помещения, ваши сценарии жизни и пожелания к каждой детали.',
    aboutPoints: ['Индивидуальные размеры и конфигурации', 'Подбор материалов и фурнитуры', 'Внимание к деталям на каждом этапе'],
    contactEyebrow: 'ДАВАЙТЕ ОБСУДИМ',
    contactTitle: 'Расскажите о своей идее',
    contactText: 'Оставьте контакты и коротко опишите задачу. Мы свяжемся с вами для первичной консультации.',
    name: 'Ваше имя', phone: 'Номер телефона', message: 'Что планируете заказать?', send: 'Отправить заявку в WhatsApp',
    consent: 'Нажимая кнопку, вы соглашаетесь на обработку предоставленных данных для связи с вами.',
    footer: 'Мебель на заказ в Шымкенте.', rights: 'Все права защищены.',
    required: 'Укажите имя и номер телефона.'
  },
  kz: {
    nav: ['Каталог', 'Жұмыс тәртібі', 'Компания туралы', 'Байланыс'],
    eyebrow: 'ТАПСЫРЫСПЕН ЖАСАЛАТЫН ЖИҺАЗ · ШЫМКЕНТ',
    heroTitle: <>Өзіңізге сай<br /><em>кеңістік.</em></>,
    heroText: 'Интерьеріңізге, әдеттеріңізге және өмір салтыңызға сай жиһаз жасаймыз. Алғашқы өлшемнен бастап орнатуға дейін.',
    cta: 'Жобаны талқылау',
    explore: 'Каталогты көру',
    note: 'Жеке тәсіл. Ойластырылған бөлшектер. Нақты нәтиже.',
    catalogEyebrow: 'БІЗДІҢ ШЕШІМДЕР',
    catalogTitle: 'Сізге арнап жасалған жиһаз',
    catalogText: 'Әр жоба сіздің кеңістігіңіз бен қалауыңыздан басталады.',
    items: [
      ['01', 'Тапсырыспен асүй', 'Әр бөлшектегі жайлылық пен әсемдік.', 'АСҮЙ'],
      ['02', 'Шкафтар мен гардероб', 'Артық көрнекі жүктемесіз ыңғайлы сақтау.', 'САҚТАУ'],
      ['03', 'Қонақ бөлме жиһазы', 'Біртұтас стиль мен күнделікті жайлылық.', 'ҚОНАҚ БӨЛМЕ'],
      ['04', 'Жатын бөлме жиһазы', 'Жайлы атмосфера мен функционалдылық.', 'ЖАТЫН БӨЛМЕ']
    ],
    processEyebrow: 'ТҮСІНІКТІ ҮДЕРІС',
    processTitle: 'Идеядан дайын жиһазға дейін',
    steps: [
      ['Өтінім', 'Қандай жиһаз қажет екенін және тілектеріңізді айтыңыз.'],
      ['Кеңес', 'Сізбен байланысып, мәліметтерді нақтылап, өлшеу уақытын келісеміз.'],
      ['Есеп және келісім', 'Ұсыныс дайындап, жоба шарттарын келісеміз.'],
      ['Дайындау және орнату', 'Келісілгеннен кейін жұмысты бастап, жиһазды орнатамыз.']
    ],
    aboutEyebrow: 'SUPER MEBEL WEB',
    aboutTitle: 'Сіздің үйіңіз. Сіздің стиліңіз. Сіздің таңдауыңыз.',
    aboutText: 'Сапалы жиһаз дайын үлгіден емес, адамды түсінуден басталады деп сенеміз. Сондықтан бөлме өлшемін, күнделікті өмір салтыңызды және әр бөлшекке қатысты қалауыңызды ескереміз.',
    aboutPoints: ['Жеке өлшемдер мен конфигурациялар', 'Материалдар мен фурнитураны таңдау', 'Әр кезеңде бөлшектерге назар аудару'],
    contactEyebrow: 'ЖОБАНЫ ТАЛҚЫЛАЙЫҚ',
    contactTitle: 'Идеяңыз туралы айтып беріңіз',
    contactText: 'Байланыс деректерін қалдырып, тапсырысыңызды қысқаша сипаттаңыз. Алғашқы кеңес үшін хабарласамыз.',
    name: 'Атыңыз', phone: 'Телефон нөмірі', message: 'Қандай жиһазға тапсырыс бергіңіз келеді?', send: 'WhatsApp арқылы өтінім жіберу',
    consent: 'Түймені басу арқылы сіз байланысу үшін берілген деректерді өңдеуге келісесіз.',
    footer: 'Шымкентте тапсырыспен жиһаз жасау.', rights: 'Барлық құқықтар қорғалған.',
    required: 'Атыңыз бен телефон нөміріңізді енгізіңіз.'
  }
}

const visualClasses = ['visual-kitchen', 'visual-wardrobe', 'visual-living', 'visual-bedroom']

function App() {
  const [lang, setLang] = useState<Lang>('ru')
  const [menuOpen, setMenuOpen] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const t = copy[lang]
  const waPhone = (import.meta.env.VITE_WHATSAPP_PHONE || '777777777777').replace(/\D/g, '')

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) {
      setError(t.required)
      return
    }
    setError('')
    const text = [
      'Заявка с сайта SuperMebelWeb',
      `Имя: ${name.trim()}`,
      `Телефон: ${phone.trim()}`,
      `Язык: ${lang === 'ru' ? 'Русский' : 'Қазақша'}`,
      `Запрос: ${message.trim() || 'Нужна консультация'}`
    ].join('\n')
    window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="site-shell">
      <header className="header">
        <a className="brand" href="#top" onClick={() => goTo('top')} aria-label="SuperMebelWeb">
          <span className="brand-mark"><span /></span>
          <span>SUPER<span className="brand-light">MEBEL</span><small>WEB · SHYMKENT</small></span>
        </a>
        <nav className={menuOpen ? 'nav nav-open' : 'nav'}>
          {t.nav.map((item, i) => <button key={item} onClick={() => goTo(['catalog', 'process', 'about', 'contact'][i])}>{item}</button>)}
        </nav>
        <div className="header-actions">
          <div className="lang-switch">
            <button className={lang === 'ru' ? 'active' : ''} onClick={() => setLang('ru')}>RU</button>
            <span>/</span>
            <button className={lang === 'kz' ? 'active' : ''} onClick={() => setLang('kz')}>KZ</button>
          </div>
          <button className="header-cta" onClick={() => goTo('contact')}>{t.cta}<ArrowUpRight size={15}/></button>
          <button className="menu-toggle" aria-label="Открыть меню" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
        </div>
      </header>

      <main>
        <section className="hero" id="top">
          <div className="hero-orb orb-one" /><div className="hero-orb orb-two" />
          <div className="hero-copy">
            <div className="eyebrow"><span />{t.eyebrow}</div>
            <h1>{t.heroTitle}</h1>
            <p className="hero-description">{t.heroText}</p>
            <div className="hero-buttons">
              <button className="button button-light" onClick={() => goTo('contact')}>{t.cta}<MoveUpRight size={17}/></button>
              <button className="text-link" onClick={() => goTo('catalog')}>{t.explore}<ArrowUpRight size={16}/></button>
            </div>
            <div className="hero-note"><span className="note-line" />{t.note}</div>
          </div>
          <div className="hero-art" aria-label="Современная мебель в интерьере">
            <div className="art-frame">
              <div className="art-window"><div className="window-light" /></div>
              <div className="art-wall" />
              <div className="art-panel panel-a" /><div className="art-panel panel-b" />
              <div className="art-cabinet"><div/><div/><div/></div>
              <div className="art-counter" />
              <div className="art-vase"><i/><b/></div>
              <div className="art-plant"><i/><i/><i/><span/></div>
              <div className="art-floor" />
            </div>
            <div className="art-caption"><span>01 / 04</span><span>DESIGNED AROUND YOU</span></div>
          </div>
          <div className="hero-bottom"><span>SCROLL TO EXPLORE</span><span className="scroll-line" /><span>EST. SHYMKENT</span></div>
        </section>

        <section className="catalog section-pad" id="catalog">
          <div className="section-heading">
            <div><div className="eyebrow dark"><span />{t.catalogEyebrow}</div><h2>{t.catalogTitle}</h2></div>
            <p>{t.catalogText}</p>
          </div>
          <div className="product-grid">
            {t.items.map((item, i) => <article className="product-card" key={item[0]}>
              <div className={`product-visual ${visualClasses[i]}`}>
                <div className="visual-label">{item[3]}</div>
                <div className="placeholder-scene"><div className="scene-back" /><div className="scene-object" /><div className="scene-detail" /></div>
                <span className="visual-number">{item[0]}</span>
              </div>
              <div className="product-info"><div><h3>{item[1]}</h3><p>{item[2]}</p></div><button aria-label={item[1]} onClick={() => goTo('contact')}><ArrowUpRight size={20}/></button></div>
            </article>)}
          </div>
          <div className="catalog-foot"><span>MADE TO MEASURE</span><span>01 — 04</span></div>
        </section>

        <section className="process section-pad" id="process">
          <div className="process-top"><div className="eyebrow"><span />{t.processEyebrow}</div><h2>{t.processTitle}</h2></div>
          <div className="steps-grid">
            {t.steps.map((step, i) => <div className="step" key={step[0]}><div className="step-top"><span>0{i + 1}</span><span className="step-icon">{[<MessageCircle/>, <Sofa/>, <Ruler/>, <Check/>][i]}</span></div><h3>{step[0]}</h3><p>{step[1]}</p></div>)}
          </div>
        </section>

        <section className="about section-pad" id="about">
          <div className="about-image"><div className="about-image-inner"><div className="about-sun" /><div className="about-shelf shelf-one" /><div className="about-shelf shelf-two" /><div className="about-vase" /><div className="about-chair" /></div><span className="about-stamp"><Sparkles size={15}/> MADE FOR YOUR SPACE</span></div>
          <div className="about-copy"><div className="eyebrow dark"><span />{t.aboutEyebrow}</div><h2>{t.aboutTitle}</h2><p>{t.aboutText}</p><ul>{t.aboutPoints.map(point => <li key={point}><Check size={16}/>{point}</li>)}</ul><button className="text-link dark-link" onClick={() => goTo('contact')}>{t.cta}<ArrowUpRight size={16}/></button></div>
        </section>

        <section className="contact section-pad" id="contact">
          <div className="contact-glow" />
          <div className="contact-copy"><div className="eyebrow"><span />{t.contactEyebrow}</div><h2>{t.contactTitle}</h2><p>{t.contactText}</p><div className="contact-direct"><MessageCircle size={19}/><span>WhatsApp</span><b>+7 777 777 7777</b></div></div>
          <form className="contact-form" onSubmit={submit}>
            <label>{t.name}<input value={name} onChange={e => setName(e.target.value)} placeholder={t.name} /></label>
            <label>{t.phone}<input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+7 (___) ___-__-__" inputMode="tel" /></label>
            <label>{t.message}<textarea value={message} onChange={e => setMessage(e.target.value)} placeholder={t.message} rows={3}/></label>
            {error && <p className="form-error">{error}</p>}
            <button className="button button-light submit-button" type="submit">{t.send}<ArrowUpRight size={17}/></button>
            <small>{t.consent}</small>
          </form>
        </section>
      </main>

      <footer className="footer"><a className="brand footer-brand" href="#top"><span className="brand-mark"><span /></span><span>SUPER<span className="brand-light">MEBEL</span><small>WEB · SHYMKENT</small></span></a><p>{t.footer}</p><span>© {new Date().getFullYear()} SUPERMEBELWEB. {t.rights}</span></footer>
      <a className="floating-wa" href={`https://wa.me/${waPhone}`} target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle size={22}/></a>
    </div>
  )
}

export default App
