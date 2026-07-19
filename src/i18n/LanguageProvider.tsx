import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import ar from './ar.json'
import en from './en.json'
import { dirFor, type Dict, type Direction, type Language } from './types'

const dictionaries: Record<Language, Dict> = { ar, en }
const STORAGE_KEY = 'mahamok.lang'

interface LanguageContextValue {
  language: Language
  dir: Direction
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ar')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'ar' || stored === 'en') setLanguageState(stored)
  }, [])

  useEffect(() => {
    const dir = dirFor(language)
    document.documentElement.lang = language
    document.documentElement.dir = dir
    localStorage.setItem(STORAGE_KEY, language)
  }, [language])

  const setLanguage = useCallback((lang: Language) => setLanguageState(lang), [])
  const toggleLanguage = useCallback(
    () => setLanguageState((prev) => (prev === 'ar' ? 'en' : 'ar')),
    [],
  )

  const t = useCallback(
    (key: string) => dictionaries[language][key] ?? key,
    [language],
  )

  const value = useMemo<LanguageContextValue>(
    () => ({ language, dir: dirFor(language), setLanguage, toggleLanguage, t }),
    [language, setLanguage, toggleLanguage, t],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
