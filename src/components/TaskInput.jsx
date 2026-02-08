import React, { useState, useRef } from 'react'

export default function TaskInput({ onAdd }) {
  const [value, setValue] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [assignee, setAssignee] = useState('')
  const [status, setStatus] = useState('חדש')
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  const submit = (e) => {
    if (e) e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) {
      setError('נא להזין משימה')
      inputRef.current?.focus()
      return
    }
    if (!dueDate) {
      setError('יש לבחור דדליין')
      return
    }
    if (!assignee.trim()) {
      setError('יש להזין אחראי')
      return
    }
    const payload = { text: trimmed, dueDate: dueDate || '', assignee: assignee || '', status }
    const ok = onAdd ? onAdd(payload) : false
    if (ok) {
      setValue('')
      setDueDate('')
      setAssignee('')
      setStatus('חדש')
      setError('')
    }
  }

  return (
    <form className="task-input" onSubmit={submit} aria-label="הוספת משימה">
      <div className="input-group">
        <input
          ref={inputRef}
          className="input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="מה צריך לעשות?"
          aria-label="הזן משימה"
        />
        <div className="date-wrap">
          <input
          type="date"
          className="input date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          aria-label="תאריך יעד"
          title="תאריך יעד"
        />
          <div className="hint">בחר דדליין</div>
        </div>
        <input
          className="input"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          placeholder="אחראי"
          aria-label="אחראי"
        />
        <select className="input select" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="סטטוס">
          <option value="חדש">חדש</option>
          <option value="בתהליך">בתהליך</option>
          <option value="תקוע">תקוע</option>
          <option value="הושלם">הושלם</option>
        </select>
        <button type="submit" className="btn primary" aria-label="הוסף משימה">
          הוסף
        </button>
      </div>
      {error && <div className="error">{error}</div>}
    </form>
  )
}