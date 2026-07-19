import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useStore, type Priority } from '../store/useStore'
import { useLanguage } from '../i18n/LanguageProvider'

const PRIORITIES: Priority[] = ['high', 'medium', 'low']

export function AddTodo() {
  const { t } = useLanguage()
  const activeProjectId = useStore((s) => s.activeProjectId)
  const addTodo = useStore((s) => s.addTodo)

  const [text, setText] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')

  const submit = () => {
    if (!text.trim() || !activeProjectId) return
    addTodo(activeProjectId, text, priority)
    setText('')
    setPriority('medium')
  }

  return (
    <div className="flex flex-1 flex-wrap items-center gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit()
        }}
        placeholder={t('todo.newPlaceholder')}
        className="min-w-[12rem] flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm"
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as Priority)}
        aria-label={t('prio.label')}
        className="rounded-lg border border-border bg-surface px-2 py-2 text-sm"
      >
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {t(`prio.${p}`)}
          </option>
        ))}
      </select>
      <button
        onClick={submit}
        className="flex items-center gap-1 rounded-lg bg-brand-600 px-3 py-2 text-sm text-white hover:bg-brand-500"
      >
        <Plus size={16} /> {t('todo.add')}
      </button>
    </div>
  )
}
