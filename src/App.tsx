import { LanguageProvider, useLanguage } from './i18n/LanguageProvider'
import { ProjectTabs } from './components/ProjectTabs'
import { Board } from './components/Board'
import { Toolbar } from './components/Toolbar'
import { useStore } from './store/useStore'
import { useTheme } from './theme/useTheme'

function Shell() {
  const { t } = useLanguage()
  const projects = useStore((s) => s.projects)

  return (
    <div className="mx-auto flex h-screen max-w-7xl flex-col gap-3 p-4">
      <header className="flex items-baseline gap-3">
        <h1 className="text-xl font-bold text-ink">{t('app.title')}</h1>
        <span className="text-xs text-ink-soft">{t('app.tagline')}</span>
      </header>

      <ProjectTabs />

      {projects.length === 0 ? (
        <p className="py-10 text-center text-sm text-ink-soft">{t('project.empty')}</p>
      ) : (
        <>
          <Toolbar />
          <Board />
        </>
      )}
    </div>
  )
}

export default function App() {
  useTheme()
  return (
    <LanguageProvider>
      <Shell />
    </LanguageProvider>
  )
}
