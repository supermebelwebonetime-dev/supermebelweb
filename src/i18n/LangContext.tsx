import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { dict, type Dict, type Lang } from './dict'
import { localPath } from '../lib/paths'

interface LangValue {
  lang: Lang
  t: Dict
  to: (path: string) => string
}

const Ctx = createContext<LangValue | null>(null)

export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const value = useMemo<LangValue>(() => ({ lang, t: dict[lang], to: (p: string) => localPath(lang, p) }), [lang])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useLang(): LangValue {
  const v = useContext(Ctx)
  if (!v) throw new Error('useLang вне LangProvider')
  return v
}
