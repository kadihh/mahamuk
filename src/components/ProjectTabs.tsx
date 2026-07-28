import { Plus, X } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'
import { useStore } from '../store/useStore'
import { useLanguage } from '../i18n/LanguageProvider'

export function ProjectTabs() {
  const { t } = useLanguage()
  const { projects, activeProjectId, setActiveProject, addProject, closeProject } =
    useStore(useShallow((s) => ({
      projects: s.projects,
      activeProjectId: s.activeProjectId,
      setActiveProject: s.setActiveProject,
      addProject: s.addProject,
      closeProject: s.closeProject,
    })))

  return (
    <div className="flex items-end gap-1 border-b border-border overflow-x-auto">
      {projects.map((p) => {
        const active = p.id === activeProjectId
        return (
          <div
            key={p.id}
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => setActiveProject(p.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setActiveProject(p.id)
              }
            }}
            className={`group flex cursor-pointer items-center gap-2 rounded-t-lg border border-b-0 px-4 py-2 text-sm transition-colors duration-200 ${
              active
                ? 'border-border bg-surface text-ink'
                : 'bg-muted text-ink-soft hover:bg-surface'
            }`}
          >
            <span className="max-w-[12rem] truncate">{p.name}</span>
            {projects.length > 1 && !active && (
              <button
                aria-label={t('project.close')}
                onClick={(e) => {
                  e.stopPropagation()
                  closeProject(p.id)
                }}
                className="text-ink-soft opacity-0 hover:text-ink group-hover:opacity-100"
              >
                <X size={14} />
              </button>
            )}
          </div>
        )
      })}
      <button
        onClick={() => addProject('')}
        aria-label={t('project.new')}
        className="flex items-center gap-1 px-3 py-2 text-sm text-brand-600 hover:text-brand-500"
      >
        <Plus size={16} /> {t('project.new')}
      </button>
    </div>
  )
}
