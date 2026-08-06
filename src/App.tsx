import { LanguageProvider, useLanguage } from './i18n/LanguageProvider'
import { ProjectTabs } from './components/ProjectTabs'
import { Board } from './components/Board'
import { Toolbar } from './components/Toolbar'
import { ErrorBoundary } from './components/ErrorBoundary'
import { useStore } from './store/useStore'
import { useTheme } from './theme/useTheme'
import { Mail } from 'lucide-react'

const CONTACT_EMAIL = 'send.zine@gmail.com'

function Shell() {
  const { t } = useLanguage()
  const projectCount = useStore((s) => s.projects.length)

  return (
    <div className="mx-auto flex h-dvh max-w-7xl flex-col gap-3 p-4">
      <header className="flex items-baseline gap-3">
        <h1 className="text-xl font-bold text-ink">{t('app.title')}</h1>
        <span className="text-xs text-ink-soft">{t('app.tagline')}</span>
      </header>

      <ProjectTabs />

      <Toolbar />

      {projectCount === 0 ? (
        <p className="py-10 text-center text-sm text-ink-soft">{t('project.empty')}</p>
      ) : (
        <Board />
      )}

      <footer className="mt-auto flex justify-center gap-4 pb-1">
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="inline-flex items-center gap-1 text-xs text-ink-soft transition-colors hover:text-ink"
        >
          <Mail size={12} />
          {t('app.contact')}
        </a>
        <a
          href="https://zinedev.pages.dev"
          className="inline-flex items-center gap-1 text-xs text-ink-soft transition-colors hover:text-ink"
        >
          {t('app.more')}
        </a>
      </footer>
    </div>
  )
}

export default function App() {
  useTheme()
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <Shell />
      </LanguageProvider>
    </ErrorBoundary>
  )
}
