import React from 'react'

export default function FilterBar({ filter = 'all', setFilter = () => {} }) {
  return (
    <div className="filter-bar" role="tablist" aria-label="סינון משימות">
      <button
        type="button"
        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
        onClick={() => setFilter('all')}
        aria-pressed={filter === 'all'}
      >
        הכל
      </button>
      <button
        type="button"
        className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
        onClick={() => setFilter('active')}
        aria-pressed={filter === 'active'}
      >
        פעיל
      </button>
      <button
        type="button"
        className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
        onClick={() => setFilter('completed')}
        aria-pressed={filter === 'completed'}
      >
        הושלמו
      </button>
    </div>
  )
}