import React from 'react'

export default function FooterStats({ activeCount = 0, clearCompleted, hasCompleted = false, statusCounts = {} }) {
  return (
    <footer className="footer-stats">
      <div>
        <div className="count">{activeCount} משימות פעילות</div>
        <div className="status-summary">
          <span className="summary-item">חדש: {statusCounts['חדש'] || 0}</span>
          <span className="summary-item">בתהליך: {statusCounts['בתהליך'] || 0}</span>
          <span className="summary-item">תקוע: {statusCounts['תקוע'] || 0}</span>
          <span className="summary-item">הושלם: {statusCounts['הושלם'] || 0}</span>
        </div>
      </div>
      <button
        type="button"
        className="btn"
        onClick={clearCompleted}
        disabled={!hasCompleted}
        aria-label="נקה משימות שהושלמו"
      >
        נקה משימות שהושלמו
      </button>
    </footer>
  )
}