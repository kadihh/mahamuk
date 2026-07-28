# Mahamuk (مهموك)

A fully local, bilingual (Arabic-first / English) Kanban task manager. No backend — all data lives in your browser's `localStorage`.

## Features

- **4-column Kanban board** — Todo, In Progress, Blocked, Done
- **Multi-project support** — switch between projects via tabs
- **Priority system** — High / Medium / Low with color-coded badges
- **Drag & drop** — move tasks between columns
- **Arabic-first RTL** — full right-to-left layout, toggle to English anytime
- **Dark / Light / System theme** — follows your OS preference
- **Import / Export** — backup and restore all projects as a single JSON file
- **100% local** — no server, no accounts, no data leaves your browser

## Tech Stack

| Layer | Technology |
|---|---|
| UI | React 19 |
| Language | TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 (CSS-first) |
| State | Zustand (persisted to localStorage) |
| Icons | Lucide React |
| Linting | oxlint |
| Testing | Vitest + jsdom |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server (HMR) |
| `npm run build` | Type-check + production build |
| `npm run preview` | Serve the production build |
| `npm run test` | Run tests with Vitest |
| `npm run lint` | Lint with oxlint |

## Project Structure

```
src/
  App.tsx              — Root component (Shell + providers)
  bootstrap.ts         — Pre-React DOM setup (prevents flash of wrong theme/dir)
  main.tsx             — React entry point
  index.css            — Tailwind v4 theme config (OKLCH colors, dark mode)
  components/
    AddTodo.tsx         — New task form (text + priority)
    Board.tsx           — 4-column Kanban grid with drag-and-drop
    ErrorBoundary.tsx   — Crash fallback UI
    ProjectTabs.tsx     — Project switcher tabs
    TodoCard.tsx        — Draggable task card (view/edit modes)
    Toolbar.tsx         — Top bar (sort, import/export, theme, language)
  i18n/
    ar.json             — Arabic translations
    en.json             — English translations
    LanguageProvider.tsx — React Context for i18n
    types.ts            — Language/Direction/Dict types
  store/
    useStore.ts         — Zustand store (state + actions + persistence)
  test/
    setup.ts            — Vitest setup (jest-dom matchers, localStorage polyfill)
  theme/
    useTheme.ts         — Dark/light/system theme hook
```

## Data Model

- **Project** — `{ id, name, todos[] }`
- **Todo** — `{ id, text, status, priority, createdAt }`
- **Status** — `todo | inprogress | blocked | done`
- **Priority** — `high | medium | low`

All data is persisted to `localStorage` under the key `mahamok-store`.

## License

Private — not published to npm.
