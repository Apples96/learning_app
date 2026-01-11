import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import CurriculumView from '../components/CurriculumView'
import ProgressBar from '../components/ProgressBar'
import { topicsAPI, progressAPI } from '../services/api'

/**
 * TopicDetail page shows a topic's curriculum with progress.
 * Users can navigate to study specific sections.
 */
function TopicDetail() {
  const { topicId } = useParams()
  const [topic, setTopic] = useState(null)
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadTopicData()
  }, [topicId])

  const loadTopicData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load topic and progress in parallel
      const [topicResponse, progressResponse] = await Promise.all([
        topicsAPI.getById(topicId),
        progressAPI.getTopicProgress(topicId)
      ])

      setTopic(topicResponse.topic)
      setProgress(progressResponse.progress)
    } catch (err) {
      setError('Failed to load topic: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading topic...</div>
      </div>
    )
  }

  if (error || !topic) {
    return (
      <div className="container">
        <div className="error">{error || 'Topic not found'}</div>
        <Link to="/" className="btn btn-secondary">Back to Dashboard</Link>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="topic-detail-header">
        <Link to="/" className="back-link">← Back to Dashboard</Link>

        <div className="topic-info">
          <div className="topic-title-row">
            <h1>{topic.name}</h1>
            <span className={`badge badge-${getLevelColor(topic.level)}`}>
              {topic.level}
            </span>
          </div>

          <p className="topic-description">{topic.description}</p>

          {topic.focus_areas && (
            <p className="topic-focus">
              <strong>Focus Areas:</strong> {topic.focus_areas}
            </p>
          )}
        </div>

        {progress && (
          <div className="card progress-summary">
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#374151' }}>
              Overall Progress
            </h3>
            <ProgressBar percentage={progress.overall_mastery} />
            <div className="progress-stats">
              <div className="stat">
                <span className="stat-value">{progress.sections_completed}</span>
                <span className="stat-label">Sections Completed</span>
              </div>
              <div className="stat">
                <span className="stat-value">{progress.total_sections}</span>
                <span className="stat-label">Total Sections</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="curriculum-section">
        <h2>Curriculum</h2>
        <CurriculumView
          sections={topic.sections}
          topicId={topic.id}
          progress={progress}
        />
      </div>

      <style>{`
        .topic-detail-header {
          margin-bottom: 2rem;
        }

        .back-link {
          display: inline-block;
          color: #2563eb;
          text-decoration: none;
          margin-bottom: 1rem;
          font-size: 0.875rem;
        }

        .back-link:hover {
          text-decoration: underline;
        }

        .topic-info {
          background: white;
          padding: 2rem;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          margin-bottom: 1.5rem;
        }

        .topic-title-row {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 1rem;
        }

        h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .topic-description {
          color: #4b5563;
          line-height: 1.6;
          margin-bottom: 0.75rem;
        }

        .topic-focus {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .progress-summary {
          margin-bottom: 1.5rem;
        }

        .progress-stats {
          display: flex;
          gap: 2rem;
          margin-top: 1rem;
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: #2563eb;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #6b7280;
          margin-top: 0.25rem;
        }

        .curriculum-section h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1.5rem;
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

export default TopicDetail
