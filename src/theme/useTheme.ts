import { useCallback, useEffect, useState } from 'react'

export type ThemeMode = 'system' | 'dark' | 'light'

const STORAGE_KEY = 'mahamok.theme'

function systemPrefersDark(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return true
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyMode(mode: ThemeMode) {
  const dark = mode === 'dark' || (mode === 'system' && systemPrefersDark())
  document.documentElement.classList.toggle('dark', dark)
}

export function useTheme() {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'system'
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'dark' || stored === 'light' || stored === 'system' ? stored : 'system'
  })

  useEffect(() => {
    applyMode(mode)
    localStorage.setItem(STORAGE_KEY, mode)
  }, [mode])

  useEffect(() => {
    if (!window.matchMedia) return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      if (localStorage.getItem(STORAGE_KEY) === 'system') applyMode('system')
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const setMode = useCallback((m: ThemeMode) => setModeState(m), [])
  const toggle = useCallback(
    () => setModeState((prev) => (prev === 'light' ? 'dark' : 'light')),
    [],
  )

  return { mode, setMode, toggle, isDark: mode === 'dark' || (mode === 'system' && systemPrefersDark()) }
}
