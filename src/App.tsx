import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

const Catalog = lazy(() => import('./pages/Catalog').then(m => ({ default: m.Catalog })))
const CategoryPage = lazy(() => import('./pages/Catalog').then(m => ({ default: m.CategoryPage })))
const About = lazy(() => import('./pages/Static').then(m => ({ default: m.About })))
const Contacts = lazy(() => import('./pages/Static').then(m => ({ default: m.Contacts })))
const Privacy = lazy(() => import('./pages/Static').then(m => ({ default: m.Privacy })))
const Thanks = lazy(() => import('./pages/Static').then(m => ({ default: m.Thanks })))
const Login = lazy(() => import('./pages/Auth').then(m => ({ default: m.Login })))
const Register = lazy(() => import('./pages/Auth').then(m => ({ default: m.Register })))
const Forgot = lazy(() => import('./pages/Auth').then(m => ({ default: m.Forgot })))
const Reset = lazy(() => import('./pages/Auth').then(m => ({ default: m.Reset })))
const Account = lazy(() => import('./pages/Account'))

const pages = (
  <>
    <Route index element={<Home />} />
    <Route path="catalog" element={<Catalog />} />
    <Route path="catalog/:slug" element={<CategoryPage />} />
    <Route path="about" element={<About />} />
    <Route path="contacts" element={<Contacts />} />
    <Route path="privacy" element={<Privacy />} />
    <Route path="thanks" element={<Thanks />} />
    <Route path="login" element={<Login />} />
    <Route path="register" element={<Register />} />
    <Route path="forgot" element={<Forgot />} />
    <Route path="reset" element={<Reset />} />
    <Route path="account" element={<Account />} />
    <Route path="*" element={<NotFound />} />
  </>
)

export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Layout lang="ru" />}>{pages}</Route>
        <Route path="/kk" element={<Layout lang="kk" />}>{pages}</Route>
      </Routes>
    </Suspense>
  )
}
