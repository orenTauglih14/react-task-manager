import React, { useEffect, useMemo, useState } from 'react'
import './App.css'
import TaskInput from './components/TaskInput.jsx'
import FilterBar from './components/FilterBar.jsx'
import TaskList from './components/TaskList.jsx'
import FooterStats from './components/FooterStats.jsx'

const STORAGE_KEY = 'tasks_v1'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('all')

  // normalize older tasks and load
  const normalizeTask = (t) => {
    const now = new Date().toISOString()
    return {
      id: t.id || (typeof crypto !== 'undefined' ? crypto.randomUUID() : String(Date.now())),
      text: typeof t.text === 'string' ? t.text : '',
      completed: !!t.completed,
      deleted: !!t.deleted,
      createdAt: t.createdAt || now,
      dueDate: t.dueDate || '',
      assignee: t.assignee || '',
      status: t.status || (t.completed ? 'הושלם' : 'חדש'),
      completedAt: t.completedAt || '',
    }
  }

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) setTasks(parsed.map(normalizeTask))
      }
    } catch (e) {
      console.warn('failed to load tasks', e)
      setTasks([])
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch (e) {
      console.warn('failed to save tasks', e)
    }
  }, [tasks])

  const addTask = (payload) => {
    // payload can be string or object
    const text = typeof payload === 'string' ? payload : (payload.text || '')
    const trimmed = text.trim()
    if (!trimmed) return false
    const now = new Date().toISOString()
    const status = (payload && payload.status) || 'חדש'
    const completed = status === 'הושלם' || !!(payload && payload.completed)
    const t = {
      id: typeof crypto !== 'undefined' ? crypto.randomUUID() : String(Date.now()),
      text: trimmed,
      completed,
      deleted: false,
      createdAt: now,
      dueDate: (payload && payload.dueDate) || '',
      assignee: (payload && payload.assignee) || '',
      status,
      completedAt: completed ? now : '',
    }
    setTasks((s) => [t, ...s])
    return true
  }

  const updateTask = (id, payload) => {
    setTasks((s) =>
      s.map((t) => {
        if (t.id !== id) return t
        const next = typeof payload === 'string' ? { ...t, text: payload } : { ...t, ...payload }
        // ensure status/completed consistency
        const now = new Date().toISOString()
        if ('completed' in next) {
          if (next.completed) {
            next.status = 'הושלם'
            if (!t.completedAt) next.completedAt = now
          } else {
            if (t.status === 'הושלם') next.status = 'בתהליך'
            next.completedAt = ''
          }
        } else if ('status' in next) {
          next.completed = next.status === 'הושלם'
          if (next.completed && !t.completedAt) next.completedAt = now
          if (!next.completed) next.completedAt = ''
        }
        return next
      })
    )
  }

  const toggleTask = (id) => {
    setTasks((s) =>
      s.map((t) => {
        if (t.id !== id) return t
        const completed = !t.completed
        const status = completed ? 'הושלם' : t.status === 'הושלם' ? 'בתהליך' : t.status || 'בתהליך'
        return { ...t, completed, status, completedAt: completed ? new Date().toISOString() : '' }
      })
    )
  }

  // soft-delete: keep in storage but mark as deleted
  const deleteTask = (id) => {
    setTasks((s) => s.map((t) => (t.id === id ? { ...t, deleted: true } : t)))
  }

  // soft-delete completed tasks (only those not already deleted)
  const clearCompleted = () => {
    setTasks((s) => s.map((t) => (t.completed && !t.deleted ? { ...t, deleted: true } : t)))
  }

  // exclude soft-deleted items from UI
  const filtered = useMemo(() => {
    const visible = tasks.filter((t) => !t.deleted)
    if (filter === 'active') return visible.filter((t) => !t.completed)
    if (filter === 'completed') return visible.filter((t) => t.completed)
    return visible
  }, [tasks, filter])

  const activeCount = tasks.filter((t) => !t.completed && !t.deleted).length
  const hasCompleted = tasks.some((t) => t.completed && !t.deleted)

  const statusCounts = useMemo(() => {
    const counts = { חדש: 0, 'בתהליך': 0, תקוע: 0, הושלם: 0 }
    for (const t of tasks) {
      if (t.deleted) continue
      const s = t.status || (t.completed ? 'הושלם' : 'חדש')
      counts[s] = (counts[s] || 0) + 1
    }
    return counts
  }, [tasks])

  return (
    <div className="app-root" dir="rtl">
      <main className="card">
        <h1 className="title">יומן המשימות שלי</h1>
        <div className="top-controls">
          <TaskInput onAdd={addTask} />
        </div>
        <div className="filters-row">
          <FilterBar filter={filter} setFilter={setFilter} />
        </div>
        <TaskList
          tasks={filtered}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onUpdate={(id, payload) => updateTask(id, payload)}
        />
        <FooterStats
          activeCount={activeCount}
          clearCompleted={clearCompleted}
          hasCompleted={hasCompleted}
          statusCounts={statusCounts}
        />
      </main>
    </div>
  )
}