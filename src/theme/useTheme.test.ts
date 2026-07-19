import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useTheme } from './useTheme'

function mockMatchMedia(dark: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes('dark') ? dark : false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
    mockMatchMedia(true)
  })
  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('defaults to system and applies dark when OS prefers dark', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.mode).toBe('system')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(result.current.isDark).toBe(true)
  })

  it('applies light when OS prefers light', () => {
    mockMatchMedia(false)
    const { result } = renderHook(() => useTheme())
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(result.current.isDark).toBe(false)
  })

  it('toggles to light and persists the choice', () => {
    const { result } = renderHook(() => useTheme())
    act(() => result.current.toggle())
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(localStorage.getItem('mahamok.theme')).toBe('light')
  })

  it('setMode stores the explicit mode', () => {
    const { result } = renderHook(() => useTheme())
    act(() => result.current.setMode('dark'))
    expect(localStorage.getItem('mahamok.theme')).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})
