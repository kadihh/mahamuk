import { useState, type DragEvent } from 'react'
import type { Project, Status, Todo } from '../store/useStore'
import { sortTodos, useStore } from '../store/useStore'
import { useLanguage } from '../i18n/LanguageProvider'
import { TodoCard } from './TodoCard'

const COL_KEY: Record<Status, string> = {
  todo: 'col.todo',
  inprogress: 'col.inprogress',
  blocked: 'col.blocked',
  done: 'col.done',
}

const COL_ACCENT: Record<Status, string> = {
  todo: 'border-t-brand-500',
  inprogress: 'border-t-prio-medium',
  blocked: 'border-t-prio-high',
  done: 'border-t-prio-low',
}

export function Column({
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

  const todos = sortTodos(
    project.todos.filter((todo: Todo) => todo.status === status),
    sortByPriority,
  )

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const id = e.dataTransfer.getData('text/plain')
    if (id) moveTodo(project.id, id, status)
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      className={`flex min-w-0 flex-1 flex-col rounded-xl border border-border bg-muted border-t-4 ${COL_ACCENT[status]} ${
        dragOver ? 'ring-2 ring-brand-500' : ''
      }`}
    >
      <div className="flex items-center justify-between px-3 py-2">
        <h2 className="text-sm font-semibold text-ink">{t(COL_KEY[status])}</h2>
        <span className="text-xs text-ink-soft">{todos.length}</span>
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
}

export function Board() {
  const projects = useStore((s) => s.projects)
  const activeProjectId = useStore((s) => s.activeProjectId)
  const sortByPriority = useStore((s) => s.sortByPriority)

  const project = projects.find((p) => p.id === activeProjectId)
  if (!project) return null

  return (
    <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Column project={project} status="todo" sortByPriority={sortByPriority} />
      <Column project={project} status="inprogress" sortByPriority={sortByPriority} />
      <Column project={project} status="blocked" sortByPriority={sortByPriority} />
      <Column project={project} status="done" sortByPriority={sortByPriority} />
    </div>
  )
}
