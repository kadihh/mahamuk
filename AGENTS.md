# AGENTS.md

Local-only bilingual (Arabic-first) todo/kanban app. React 19 + TypeScript + Vite 8 + Tailwind CSS v4 + Zustand. No backend — all state lives in `localStorage`.

## Commands
- `npm run dev` — Vite dev server (HMR)
- `npm run build` — `tsc -b` (typecheck, noEmit) then `vite build`
- `npm run lint` — **oxlint** (not eslint; config in `.oxlintrc.json`)
- `npm run test` — **Vitest** (`vitest run`, jsdom env, setup `src/test/setup.ts`)
- `npm run preview` — serve the production build

There is no separate typecheck/lint ordering requirement; `build` already typechecks.

## Architecture (non-obvious)
- **State**: single Zustand store `src/store/useStore.ts`, persisted to `localStorage` under key `mahamok-store` via the `persist` middleware. Shape persisted = `{ projects, activeProjectId, sortByPriority }`. Do NOT add non-serializable values to state; only `partialize`'d fields are saved.
- **Data model**: `Project { id, name, todos[] }`; `Todo { id, text, status, priority, createdAt }`. `status` is one of `todo | inprogress | blocked | done` (drives the four board columns). `priority` is `high | medium | low` (`PRIORITY_RANK` orders them).
- **i18n**: `src/i18n/`. Default language is **`ar`** (RTL). `LanguageProvider` sets `document.documentElement.lang` + `.dir` on change and persists choice to `mahamok.lang`. Translations are plain JSON (`ar.json`/`en.json`) keyed by dotted strings; use `t('key')` from `useLanguage()`. Types/helpers live in `src/i18n/types.ts` (kept separate so the provider file exports only components — avoids oxlint fast-refresh warnings).

## Conventions to follow
- **RTL/layout**: use Tailwind **logical properties** (`ms-*`, `me-*`, `ps-*`, `pe-*`, `border-s`, `text-start`) so layout mirrors automatically when `dir` flips. Do not hardcode `left/right`/`ml/mr`.
- **Styling**: Tailwind v4 is CSS-first — config lives in `@theme` inside `src/index.css` (no `tailwind.config.js`). Import order: `vite.config.ts` has the `@tailwindcss/vite` plugin; `src/index.css` starts with `@import "tailwindcss";`. Do not add PostCSS/autoprefixer.
- **Adding a UI string**: add the key to BOTH `ar.json` and `en.json`, then reference via `t()`. Missing keys render the raw key.
- **IDs**: use `crypto.randomUUID()` (helper `uid()` in the store).

## Tests
- Place unit tests next to source as `*.test.ts(x)`. Store logic (actions, `sortTodos`, import/export round-trip) is covered in `src/store/useStore.test.ts`. Tests run in jsdom; `localStorage` is available there.
- Import/export is **one JSON file = all projects** (`AppData { version: 1, projects[] }`); `importData` replaces the whole state and selects the first project.

## Gotchas
- `oxlint` emits a `react(only-export-components)` warning for `useLanguage` exported alongside `LanguageProvider` — this is HMR-only noise, not an error. Keep hooks in the provider file for simplicity.
- The active project tab cannot be closed (close button only shows when `projects.length > 1`).
