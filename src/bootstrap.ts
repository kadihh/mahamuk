export function bootstrap() {
  if (typeof window === 'undefined') return

  const lang = localStorage.getItem('mahamok.lang')
  const language = lang === 'ar' || lang === 'en' ? lang : 'ar'
  document.documentElement.lang = language
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'

  const theme = localStorage.getItem('mahamok.theme')
  const prefersDark =
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  const dark = theme === 'dark' || (theme !== 'light' && prefersDark)
  document.documentElement.classList.toggle('dark', dark)
}
