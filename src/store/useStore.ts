import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Status = 'todo' | 'inprogress' | 'blocked' | 'done'
export type Priority = 'high' | 'medium' | 'low'

export const PRIORITY_RANK: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
}

const STATUSES: Status[] = ['todo', 'inprogress', 'blocked', 'done']
const PRIORITIES: Priority[] = ['high', 'medium', 'low']

function sanitizeStatus(value: unknown): Status {
  return STATUSES.includes(value as Status) ? (value as Status) : 'todo'
}

function sanitizePriority(value: unknown): Priority {
  return PRIORITIES.includes(value as Priority) ? (value as Priority) : 'medium'
}

export interface Todo {
  id: string
  text: string
  status: Status
  priority: Priority
  createdAt: number
}

export interface Project {
  id: string
  name: string
  todos: Todo[]
}

export interface AppData {
  version: 1
  projects: Project[]
}

interface StoreState {
  projects: Project[]
  activeProjectId: string | null
  sortByPriority: boolean

  addProject: (name: string) => void
  closeProject: (id: string) => void
  setActiveProject: (id: string) => void

  addTodo: (projectId: string, text: string, priority: Priority) => void
  updateTodo: (projectId: string, todoId: string, patch: Partial<Pick<Todo, 'text' | 'priority' | 'status'>>) => void
  deleteTodo: (projectId: string, todoId: string) => void
  moveTodo: (projectId: string, todoId: string, status: Status) => void

  setSortByPriority: (on: boolean) => void
  importData: (data: AppData) => void
  exportData: () => AppData
}

function uid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function newProject(name: string): Project {
  return { id: uid(), name, todos: [] }
}

const initialProject = newProject('مشروع 1')

interface PersistedShape {
  projects: Project[]
  activeProjectId: string | null
  sortByPriority: boolean
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      projects: [initialProject],
      activeProjectId: initialProject.id,
      sortByPriority: false,

      addProject: (name) =>
        set((state) => {
          const project = newProject(name.trim() || 'مشروع جديد')
          return { projects: [...state.projects, project], activeProjectId: project.id }
        }),

      closeProject: (id) =>
        set((state) => {
          const projects = state.projects.filter((p) => p.id !== id)
          const activeProjectId =
            state.activeProjectId === id
              ? (projects[0]?.id ?? null)
              : state.activeProjectId
          return { projects, activeProjectId }
        }),

      setActiveProject: (id) => set({ activeProjectId: id }),

      addTodo: (projectId, text, priority) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  todos: [
                    ...p.todos,
                    { id: uid(), text: text.trim(), status: 'todo', priority, createdAt: Date.now() },
                  ],
                }
              : p,
          ),
        })),

      updateTodo: (projectId, todoId, patch) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  todos: p.todos.map((t) => (t.id === todoId ? { ...t, ...patch } : t)),
                }
              : p,
          ),
        })),

      deleteTodo: (projectId, todoId) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? { ...p, todos: p.todos.filter((t) => t.id !== todoId) }
              : p,
          ),
        })),

      moveTodo: (projectId, todoId, status) =>
        get().updateTodo(projectId, todoId, { status }),

      setSortByPriority: (on) => set({ sortByPriority: on }),

      importData: (data) => {
        const safe = validateAppData(data)
        set({
          projects: safe.projects,
          activeProjectId: safe.projects[0]?.id ?? null,
        })
      },

      exportData: () => ({
        version: 1,
        projects: get().projects,
      }),
    }),
    {
      name: 'mahamok-store',
      partialize: (state): PersistedShape => ({
        projects: state.projects,
        activeProjectId: state.activeProjectId,
        sortByPriority: state.sortByPriority,
      }),
    },
  ),
)

export function validateAppData(data: unknown): AppData {
  const projects: Project[] = []
  if (data && typeof data === 'object' && Array.isArray((data as AppData).projects)) {
    for (const raw of (data as AppData).projects) {
      if (!raw || typeof raw !== 'object' || typeof raw.name !== 'string') continue
      const todos: Todo[] = []
      if (Array.isArray(raw.todos)) {
        for (const t of raw.todos) {
          if (!t || typeof t !== 'object' || typeof t.text !== 'string') continue
          todos.push({
            id: typeof t.id === 'string' ? t.id : uid(),
            text: t.text,
            status: sanitizeStatus(t.status),
            priority: sanitizePriority(t.priority),
            createdAt: typeof t.createdAt === 'number' ? t.createdAt : Date.now(),
          })
        }
      }
      projects.push({ id: typeof raw.id === 'string' ? raw.id : uid(), name: raw.name, todos })
    }
  }
  return { version: 1, projects }
}

export function sortTodos(todos: Todo[], byPriority: boolean): Todo[] {
  const copy = [...todos]
  if (byPriority) {
    copy.sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority])
  }
  return copy
}
