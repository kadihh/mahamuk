import { useEffect, useState, type DragEvent } from 'react'
import { Pencil, Trash2, Check, X } from 'lucide-react'
import type { Priority, Todo } from '../store/useStore'
import { useStore, PRIORITIES, STATUS_META } from '../store/useStore'
import { useLanguage } from '../i18n/LanguageProvider'

const PRIO_CLASS: Record<Priority, string> = {
  high: 'bg-prio-high/15 text-prio-high',
  medium: 'bg-prio-medium/15 text-prio-medium',
  low: 'bg-prio-low/15 text-prio-low',
}

export function TodoCard({ projectId, todo }: { projectId: string; todo: Todo }) {
  const { t } = useLanguage()
  const updateTodo = useStore((s) => s.updateTodo)
  const deleteTodo = useStore((s) => s.deleteTodo)
  const moveTodo = useStore((s) => s.moveTodo)

  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(todo.text)
  const [priority, setPriority] = useState<Priority>(todo.priority)

  useEffect(() => {
    setText(todo.text)
    setPriority(todo.priority)
  }, [todo.text, todo.priority])

  const save = () => {
    updateTodo(projectId, todo.id, { text: text.trim() || todo.text, priority })
    setEditing(false)
  }

  const onDragStart = (e: DragEvent) => {
    e.dataTransfer.setData('text/plain', todo.id)
    e.dataTransfer.effectAllowed = 'move'
  }

  if (editing) {
    return (
      <div className="rounded-xl border border-border bg-surface p-3">
        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full resize-none rounded-lg border border-border bg-canvas p-2 text-sm"
          rows={2}
        />
        <div className="mt-2 flex flex-wrap items-center gap-1">
          {PRIORITIES.map((p) => (
            <button
              key={p}
              onClick={() => setPriority(p)}
              className={`rounded px-2 py-1 text-xs ${PRIO_CLASS[p]} ${
                priority === p ? 'ring-2 ring-brand-500' : ''
              }`}
            >
              {t(`prio.${p}`)}
            </button>
          ))}
        </div>
        <div className="mt-2 flex justify-end gap-2">
          <button onClick={() => setEditing(false)} className="text-ink-soft hover:text-ink" aria-label={t('todo.cancel')}>
            <X size={16} />
          </button>
          <button onClick={save} className="text-brand-600 hover:text-brand-500" aria-label={t('todo.save')}>
            <Check size={16} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="group cursor-grab animate-slide-up rounded-xl border border-border bg-surface p-3 active:cursor-grabbing"
    >
      <p className="break-words text-sm text-ink">{todo.text}</p>
      <div className="mt-2 flex items-center justify-between">
        <span className={`rounded px-2 py-0.5 text-xs ${PRIO_CLASS[todo.priority]}`}>
          {t(`prio.${todo.priority}`)}
        </span>
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
          <button
            onClick={() => moveTodo(projectId, todo.id, STATUS_META[todo.status].next)}
            className="text-xs text-brand-600 hover:text-brand-500"
            aria-label={t('todo.move')}
          >
            →
          </button>
          <button onClick={() => setEditing(true)} className="text-ink-soft hover:text-ink" aria-label={t('todo.edit')}>
            <Pencil size={14} />
          </button>
          <button
            onClick={() => deleteTodo(projectId, todo.id)}
            className="text-ink-soft hover:text-prio-high"
            aria-label={t('todo.delete')}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
