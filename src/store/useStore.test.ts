import { beforeEach, describe, expect, it } from 'vitest'
import { useStore, sortTodos, validateAppData, type AppData } from './useStore'

function freshStore() {
  useStore.setState({
    projects: [],
    activeProjectId: null,
    sortByPriority: false,
  })
}

describe('store actions', () => {
  beforeEach(freshStore)

  it('adds a project and selects it as active', () => {
    useStore.getState().addProject('Work')
    const { projects, activeProjectId } = useStore.getState()
    expect(projects).toHaveLength(1)
    expect(projects[0].name).toBe('Work')
    expect(activeProjectId).toBe(projects[0].id)
  })

  it('adds a todo to the active project with default status', () => {
    const { addProject, addTodo } = useStore.getState()
    addProject('P')
    const pid = useStore.getState().projects[0].id
    addTodo(pid, 'Write tests', 'high')
    const todo = useStore.getState().projects[0].todos[0]
    expect(todo.text).toBe('Write tests')
    expect(todo.status).toBe('todo')
    expect(todo.priority).toBe('high')
  })

  it('moves a todo across statuses', () => {
    const { addProject, addTodo, moveTodo } = useStore.getState()
    addProject('P')
    const pid = useStore.getState().projects[0].id
    addTodo(pid, 'T', 'low')
    const tid = useStore.getState().projects[0].todos[0].id
    moveTodo(pid, tid, 'done')
    expect(useStore.getState().projects[0].todos[0].status).toBe('done')
  })

  it('deletes a todo and closes a project', () => {
    const { addProject, addTodo, deleteTodo, closeProject } = useStore.getState()
    addProject('P')
    const pid = useStore.getState().projects[0].id
    addTodo(pid, 'T', 'low')
    const tid = useStore.getState().projects[0].todos[0].id
    deleteTodo(pid, tid)
    expect(useStore.getState().projects[0].todos).toHaveLength(0)
    closeProject(pid)
    expect(useStore.getState().projects).toHaveLength(0)
    expect(useStore.getState().activeProjectId).toBeNull()
  })
})

describe('sortTodos', () => {
  it('orders by priority high -> medium -> low when enabled', () => {
    const todos = [
      { id: '1', text: 'a', status: 'todo' as const, priority: 'low' as const, createdAt: 1 },
      { id: '2', text: 'b', status: 'todo' as const, priority: 'high' as const, createdAt: 2 },
      { id: '3', text: 'c', status: 'todo' as const, priority: 'medium' as const, createdAt: 3 },
    ]
    const sorted = sortTodos(todos, true).map((t) => t.priority)
    expect(sorted).toEqual(['high', 'medium', 'low'])
  })

  it('keeps insertion order when priority sort is off', () => {
    const todos = [
      { id: '1', text: 'a', status: 'todo' as const, priority: 'low' as const, createdAt: 1 },
      { id: '2', text: 'b', status: 'todo' as const, priority: 'high' as const, createdAt: 2 },
    ]
    expect(sortTodos(todos, false).map((t) => t.id)).toEqual(['1', '2'])
  })
})

describe('import / export round-trip', () => {
  beforeEach(freshStore)

  it('exportData produces importable AppData', () => {
    const { addProject, addTodo, exportData, importData } = useStore.getState()
    addProject('P1')
    const pid = useStore.getState().projects[0].id
    addTodo(pid, 'Task', 'high')

    const data: AppData = exportData()
    expect(data.version).toBe(1)
    expect(data.projects).toHaveLength(1)

    freshStore()
    importData(data)
    const restored = useStore.getState().projects[0]
    expect(    restored.name).toBe('P1')
    expect(restored.todos[0].text).toBe('Task')
  })
})

describe('validateAppData', () => {
  it('rejects non-object input into an empty project list', () => {
    expect(validateAppData(null).projects).toEqual([])
    expect(validateAppData('nope').projects).toEqual([])
    expect(validateAppData({ foo: 1 }).projects).toEqual([])
  })

  it('sanitizes bad status/priority values and drops malformed todos', () => {
    const data = validateAppData({
      version: 1,
      projects: [
        {
          id: 'p1',
          name: 'P',
          todos: [
            { id: 't1', text: 'ok', status: 'bogus', priority: 'weird' },
            { id: 5, text: 'fixed id', status: 'done', priority: 'high' },
            { text: 'missing id', status: 'todo', priority: 'low' },
            { id: 'bad', name: 'no text' },
          ],
        },
      ],
    })
    expect(data.projects).toHaveLength(1)
    const todos = data.projects[0].todos
    expect(todos).toHaveLength(3)
    expect(todos[0].status).toBe('todo')
    expect(todos[0].priority).toBe('medium')
    expect(typeof todos[1].id).toBe('string')
  })
})
