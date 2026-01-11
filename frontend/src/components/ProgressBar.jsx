import React from 'react'

/**
 * ProgressBar component displays visual progress indicator.
 * Shows percentage and colored bar.
 */
function ProgressBar({ percentage, showLabel = true }) {
  const safePercentage = Math.min(Math.max(percentage || 0, 0), 100)

  return (
    <div className="progress-container">
      {showLabel && (
        <div className="progress-label">
          <span>Progress</span>
          <span className="progress-percentage">{Math.round(safePercentage)}%</span>
        </div>
      )}
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${safePercentage}%` }}
        />
      </div>

      <style>{`
        .progress-container {
          margin: 0.5rem 0;
        }

        .progress-label {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
          color: #4b5563;
        }

        .progress-percentage {
          font-weight: 600;
          color: #10b981;
        }
      `}</style>
    </div>
  )
}

export default ProgressBar
