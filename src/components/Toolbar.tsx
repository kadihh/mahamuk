import { useRef, useState } from 'react'
import { Download, Upload, ArrowDownAZ, Languages, Moon, Sun, Monitor } from 'lucide-react'
import { useStore, validateAppData } from '../store/useStore'
import { useLanguage } from '../i18n/LanguageProvider'
import { useTheme, type ThemeMode } from '../theme/useTheme'
import { AddTodo } from './AddTodo'

const THEME_ICON: Record<ThemeMode, typeof Moon> = {
  system: Monitor,
  dark: Moon,
  light: Sun,
}

export function Toolbar() {
  const { t, toggleLanguage } = useLanguage()
  const { mode, setMode } = useTheme()
  const sortByPriority = useStore((s) => s.sortByPriority)
  const setSortByPriority = useStore((s) => s.setSortByPriority)
  const exportData = useStore((s) => s.exportData)
  const importData = useStore((s) => s.importData)

  const fileRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState(false)

  const ThemeIcon = THEME_ICON[mode]

  const cycleTheme = () => {
    const next: ThemeMode = mode === 'system' ? 'light' : mode === 'light' ? 'dark' : 'system'
    setMode(next)
  }

  const handleExport = () => {
    const data = exportData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mahamok-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportFile = async (file: File) => {
    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      const data = validateAppData(parsed)
      if (data.projects.length === 0) throw new Error('empty')
      importData(data)
      setError(false)
    } catch {
      setError(true)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
      <AddTodo />
      <button
        onClick={() => setSortByPriority(!sortByPriority)}
        className={`flex items-center gap-1 rounded-lg border px-3 py-2 text-sm ${
          sortByPriority ? 'border-brand-500 bg-brand-500/10 text-brand-600' : 'border-border text-ink-soft'
        }`}
        aria-pressed={sortByPriority}
      >
        <ArrowDownAZ size={16} /> {t('toolbar.sortPriority')}
        <span className="text-xs">({sortByPriority ? t('toolbar.sortOn') : t('toolbar.sortOff')})</span>
      </button>

      <div className="ms-auto flex items-center gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) void handleImportFile(f)
            e.target.value = ''
          }}
        />
        <button
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm text-ink-soft hover:text-ink"
        >
          <Upload size={16} /> {t('toolbar.import')}
        </button>
        <button
          onClick={handleExport}
          className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm text-ink-soft hover:text-ink"
        >
          <Download size={16} /> {t('toolbar.export')}
        </button>
        <button
          onClick={cycleTheme}
          aria-label="theme"
          className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm text-ink-soft hover:text-ink"
        >
          <ThemeIcon size={16} />
        </button>
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1 rounded-lg bg-brand-600 px-3 py-2 text-sm text-white hover:bg-brand-500"
        >
          <Languages size={16} /> {t('lang.toggle')}
        </button>
      </div>
      {error && <p className="w-full text-xs text-prio-high">{t('dialog.importError')}</p>}
    </div>
  )
}
