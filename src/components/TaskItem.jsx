import React, { useEffect, useRef, useState } from 'react'

function fmtDate(iso) {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('he-IL')
  } catch {
    return iso
  }
}

export default function TaskItem({ task, onToggle, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(task.text)
  const [dueDate, setDueDate] = useState(task.dueDate || '')
  const [assignee, setAssignee] = useState(task.assignee || '')
  const [status, setStatus] = useState(task.status || (task.completed ? 'הושלם' : 'חדש'))
  const [showStatusMenu, setShowStatusMenu] = useState(false)
  const [editError, setEditError] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    setText(task.text)
    setDueDate(task.dueDate || '')
    setAssignee(task.assignee || '')
    setStatus(task.status || (task.completed ? 'הושלם' : 'חדש'))
    setEditError('')
  }, [task])

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const startEdit = () => setEditing(true)
  const cancelEdit = () => {
    setText(task.text)
    setDueDate(task.dueDate || '')
    setAssignee(task.assignee || '')
    setStatus(task.status || (task.completed ? 'הושלם' : 'חדש'))
    setEditing(false)
  }

  const saveEdit = () => {
    const trimmed = text.trim()
    if (!trimmed) {
      // don't allow empty, revert
      cancelEdit()
      return
    }
    if (!dueDate) {
      setEditError('יש לבחור דדליין')
      return
    }
    if (!assignee.trim()) {
      setEditError('יש להזין אחראי')
      return
    }
    setEditError('')
    const payload = { text: trimmed, dueDate: dueDate || '', assignee: assignee || '', status }
    // if status says completed, ensure completed flag
    if (status === 'הושלם') payload.completed = true
    else if (task.completed && status !== 'הושלם') payload.completed = false
    onUpdate(payload)
    setEditing(false)
  }

  const onKey = (e) => {
    if (e.key === 'Enter') saveEdit()
    if (e.key === 'Escape') cancelEdit()
  }

  const todayISO = new Date().toISOString().slice(0, 10)
  const overdue = task.dueDate && task.dueDate < todayISO && !task.completed
  const endISO = task.completedAt || new Date().toISOString()
  const created = new Date(task.createdAt)
  const end = new Date(endISO)
  const diffMs = Math.max(0, end - created)
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const timeInAir = diffDays > 0 ? `${diffDays} ימים` : `${diffHours} שעות`
  const isPastDue = task.dueDate && ((task.completedAt && task.completedAt > task.dueDate) || (!task.completed && new Date().toISOString().slice(0,10) > task.dueDate))

  return (
    <li className={`task-item ${task.completed ? 'completed' : ''} ${isPastDue ? 'overdue-row' : ''}`}>
      <div className="task-row">
        <div className="checkbox-wrap">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={onToggle}
            aria-label={task.completed ? 'סמן כלא הושלם' : 'סמן כהושלם'}
          />
        </div>
        <div className="task-main">
          {!editing ? (
            <>
              <div className="task-text" onDoubleClick={startEdit} tabIndex={0}>
                {task.text}
              </div>
              <div className="meta-row">
                <span className="meta">נוצר: {fmtDate(task.createdAt)}</span>
                {task.dueDate ? <span className="meta">דדליין: {fmtDate(task.dueDate)}</span> : null}
                <span className="meta">זמן באוויר: {timeInAir}</span>
                {overdue && <span className="badge overdue">באיחור</span>}
                {task.assignee ? <span className="badge assignee">{task.assignee}</span> : null}
                <div className="status-wrap">
                  <button type="button" className={`badge status big ${task.status ? task.status.replace(/\s+/g, '-') : ''}`} onClick={() => setShowStatusMenu((s)=>!s)} aria-haspopup="menu" aria-expanded={showStatusMenu}>
                    {task.status} ▾
                  </button>
                  {showStatusMenu && (
                    <div className="status-menu" role="menu">
                      <div className="menu-group">
                        <div className="menu-title">אקטיב</div>
                        <button type="button" className="menu-btn" onClick={() => { onUpdate({ status: 'חדש' }); setShowStatusMenu(false) }}>חדש</button>
                        <button type="button" className="menu-btn" onClick={() => { onUpdate({ status: 'בתהליך' }); setShowStatusMenu(false) }}>בתהליך</button>
                        <button type="button" className="menu-btn" onClick={() => { onUpdate({ status: 'תקוע' }); setShowStatusMenu(false) }}>תקוע</button>
                      </div>
                      <div className="menu-group">
                        <div className="menu-title">סיום</div>
                        <button type="button" className="menu-btn finish" onClick={() => { onUpdate({ status: 'הושלם', completed: true }); setShowStatusMenu(false) }}>הושלם</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="edit-panel">
              <input
                ref={inputRef}
                className="edit-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={onKey}
                aria-label="עריכת טקסט"
              />
              <div className="edit-row">
                <input type="date" className="input" value={dueDate} onChange={(e) => setDueDate(e.target.value)} aria-label="תאריך יעד" />
                <input className="input" value={assignee} onChange={(e) => setAssignee(e.target.value)} placeholder="אחראי" aria-label="אחראי" />
                <select className="input" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="סטטוס">
                  <option value="חדש">חדש</option>
                  <option value="בתהליך">בתהליך</option>
                  <option value="תקוע">תקוע</option>
                  <option value="הושלם">הושלם</option>
                </select>
              </div>
              {editError && <div className="error">{editError}</div>}
            </div>
          )}
        </div>
      </div>
      <div className="task-actions">
        {!editing && (
          <button type="button" className="btn" onClick={startEdit} aria-label="ערוך משימה">
            ערוך
          </button>
        )}
        {editing && (
          <>
            <button type="button" className="btn" onClick={saveEdit} aria-label="שמור">שמור</button>
            <button type="button" className="btn" onClick={cancelEdit} aria-label="בטל">ביטול</button>
          </>
        )}
        <button type="button" className="btn danger" onClick={onDelete} aria-label="מחק משימה">
          מחק
        </button>
      </div>
    </li>
  )
}