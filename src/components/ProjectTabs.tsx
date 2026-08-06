import { useRef } from 'react'
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

  const tabsRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent, id: string, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setActiveProject(id)
      return
    }
    const isArrow = e.key === 'ArrowRight' || e.key === 'ArrowLeft'
    const isEdge = e.key === 'Home' || e.key === 'End'
    if (!isArrow && !isEdge) return
    e.preventDefault()

    const tabs = Array.from(
      tabsRef.current?.querySelectorAll<HTMLElement>('[role="tab"]') ?? [],
    )
    if (tabs.length === 0) return

    let target = index
    if (e.key === 'Home') target = 0
    else if (e.key === 'End') target = tabs.length - 1
    else if (e.key === 'ArrowRight') target = (index + 1) % tabs.length
    else if (e.key === 'ArrowLeft') target = (index - 1 + tabs.length) % tabs.length

    for (const tab of tabs) tab.tabIndex = -1
    const next = projects[target]
    tabs[target].tabIndex = 0
    tabs[target].focus()
    if (next) setActiveProject(next.id)
  }

  return (
    <div
      ref={tabsRef}
      role="tablist"
      aria-label={t('project.tabs')}
      className="flex items-end gap-1 border-b border-border overflow-x-auto"
    >
      {projects.map((p, i) => {
        const active = p.id === activeProjectId
        return (
          <div
            key={p.id}
            id={`tab-${p.id}`}
            role="tab"
            aria-selected={active}
            aria-controls="board"
            tabIndex={active ? 0 : -1}
            onClick={() => setActiveProject(p.id)}
            onKeyDown={(e) => handleKeyDown(e, p.id, i)}
            className={`group flex cursor-pointer items-center gap-2 rounded-t-lg border border-b-0 px-4 py-2 text-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-500 ${
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
                className="text-ink-soft opacity-40 transition-opacity duration-150 hover:text-ink hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100"
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
