import React from 'react'
import TaskItem from './TaskItem.jsx'

export default function TaskList({ tasks = [], onToggle, onDelete, onUpdate }) {
  if (!tasks || tasks.length === 0) {
    return <div className="empty">אין משימות להצגה</div>
  }

  return (
    <ul className="task-list" aria-live="polite">
      {tasks.map((t) => (
        <TaskItem
          key={t.id}
          task={t}
          onToggle={() => onToggle(t.id)}
          onDelete={() => onDelete(t.id)}
          onUpdate={(payload) => onUpdate(t.id, payload)}
        />
      ))}
    </ul>
  )
}