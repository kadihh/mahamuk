export type Language = 'ar' | 'en'
export type Direction = 'rtl' | 'ltr'

export type Dict = Record<string, string>

export function dirFor(lang: Language): Direction {
  return lang === 'ar' ? 'rtl' : 'ltr'
}
