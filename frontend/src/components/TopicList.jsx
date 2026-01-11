import React from 'react'
import { Link } from 'react-router-dom'
import ProgressBar from './ProgressBar'

/**
 * TopicList component displays all user topics with progress indicators.
 * Each topic is clickable to view details and curriculum.
 */
function TopicList({ topics, onDelete }) {
  if (topics.length === 0) {
    return (
      <div className="card">
        <p style={{ textAlign: 'center', color: '#6b7280' }}>
          No topics yet. Create your first topic to start learning!
        </p>
      </div>
    )
  }

  return (
    <div className="topics-grid">
      {topics.map((topic) => (
        <div key={topic.id} className="card topic-card">
          <div className="topic-header">
            <Link to={`/topics/${topic.id}`} style={{ textDecoration: 'none' }}>
              <h3 className="card-title">{topic.name}</h3>
            </Link>
            <span className={`badge badge-${getLevelColor(topic.level)}`}>
              {topic.level}
            </span>
          </div>

          <p className="topic-description">{topic.description}</p>

          {topic.focus_areas && (
            <p className="topic-focus">
              <strong>Focus:</strong> {topic.focus_areas}
            </p>
          )}

          <div className="topic-stats">
            <span>{topic.sections_count} sections</span>
          </div>

          <div className="topic-actions">
            <Link to={`/topics/${topic.id}`} className="btn btn-primary">
              View Curriculum
            </Link>
            <button
              onClick={() => onDelete(topic.id)}
              className="btn btn-danger"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      <style>{`
        .topics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .topic-card {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .topic-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 0.75rem;
        }

        .topic-description {
          color: #4b5563;
          font-size: 0.875rem;
          margin-bottom: 0.75rem;
          flex: 1;
        }

        .topic-focus {
          color: #6b7280;
          font-size: 0.8rem;
          margin-bottom: 0.75rem;
        }

        .topic-stats {
          padding: 0.75rem 0;
          border-top: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 1rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .topic-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: auto;
        }

        .topic-actions .btn {
          flex: 1;
        }
      `}</style>
    </div>
  )
}

// Helper function to get badge color based on level
function getLevelColor(level) {
  switch (level) {
    case 'beginner':
      return 'green'
    case 'intermediate':
      return 'yellow'
    case 'advanced':
      return 'red'
    default:
      return 'blue'
  }
}

export default TopicList
