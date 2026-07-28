import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

const messages: Record<string, { error: string; reload: string }> = {
  ar: { error: 'حدث خطأ ما', 'reload': 'إعادة تحميل' },
  en: { error: 'Something went wrong', reload: 'Reload' },
}

function getLang(): string {
  try {
    const lang = localStorage.getItem('mahamok.lang')
    return lang === 'ar' || lang === 'en' ? lang : 'ar'
  } catch {
    return 'ar'
  }
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      const msg = messages[getLang()]
      return (
        <div className="flex h-screen items-center justify-center animate-shake">
          <div className="text-center">
            <p className="text-lg font-semibold text-ink">{msg.error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 rounded-lg bg-brand-600 px-4 py-2 text-sm text-white hover:bg-brand-500"
            >
              {msg.reload}
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
