import React, { useMemo, useState, type DragEvent } from 'react'
import type { Project, Status, Todo } from '../store/useStore'
import { sortTodos, useStore, STATUSES, STATUS_META } from '../store/useStore'
import { useLanguage } from '../i18n/LanguageProvider'
import { useShallow } from 'zustand/react/shallow'
import { TodoCard } from './TodoCard'

export const Column = React.memo(function Column({
  project,
  status,
  sortByPriority,
}: {
  project: Project
  status: Status
  sortByPriority: boolean
}) {
  const { t } = useLanguage()
  const moveTodo = useStore((s) => s.moveTodo)
  const [dragOver, setDragOver] = useState(false)

  const todos = useMemo(
    () => sortTodos(
      project.todos.filter((todo: Todo) => todo.status === status),
      sortByPriority,
    ),
    [project.todos, status, sortByPriority],
  )

  const onDragOver = (e: DragEvent) => {
    e.preventDefault()
    if (!dragOver) setDragOver(true)
  }

  const onDragLeave = (e: DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOver(false)
    }
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const id = e.dataTransfer.getData('text/plain')
    if (id) moveTodo(project.id, id, status)
  }

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`flex min-w-0 flex-1 flex-col rounded-xl border border-border bg-muted border-t-4 transition-all duration-200 ${STATUS_META[status].accent} ${
        dragOver ? 'ring-2 ring-brand-500 scale-[1.02]' : ''
      }`}
    >
      <div className="flex items-center justify-between px-3 py-2">
        <h2 className="text-sm font-semibold text-ink">{t(STATUS_META[status].i18nKey)}</h2>
        <span className="text-xs text-ink-soft" aria-live="polite">{todos.length}</span>
      </div>
      <div className="flex flex-col gap-2 px-2 pb-3">
        {todos.length === 0 ? (
          <p className="px-1 py-6 text-center text-xs text-ink-soft">{t('empty.col')}</p>
        ) : (
          todos.map((todo) => <TodoCard key={todo.id} projectId={project.id} todo={todo} />)
        )}
      </div>
    </div>
  )
})

export function Board() {
  const { project, sortByPriority } = useStore(useShallow((s) => ({
    project: s.projects.find((p) => s.activeProjectId && p.id === s.activeProjectId),
    sortByPriority: s.sortByPriority,
  })))
  if (!project) return null

  return (
    <div
      id="board"
      role="tabpanel"
      aria-labelledby={`tab-${project.id}`}
      className="grid flex-1 grid-cols-1 gap-3 animate-fade-in sm:grid-cols-2 lg:grid-cols-4"
    >
      {STATUSES.map((status) => (
        <Column key={status} project={project} status={status} sortByPriority={sortByPriority} />
      ))}
    </div>
  )
}
