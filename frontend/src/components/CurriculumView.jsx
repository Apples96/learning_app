import React from 'react'
import { Link } from 'react-router-dom'
import ProgressBar from './ProgressBar'

/**
 * CurriculumView component displays the curriculum sections for a topic.
 * Shows sections in order with progress indicators and study buttons.
 */
function CurriculumView({ sections, topicId, progress }) {
  if (!sections || sections.length === 0) {
    return (
      <div className="card">
        <p style={{ textAlign: 'center', color: '#6b7280' }}>
          No curriculum sections found.
        </p>
      </div>
    )
  }

  // Get progress for a section
  const getSectionProgress = (sectionId) => {
    if (!progress || !progress.sections_progress) return null
    return progress.sections_progress.find(p => p.section_id === sectionId)
  }

  return (
    <div className="curriculum-list">
      {sections.map((section, index) => {
        const sectionProgress = getSectionProgress(section.id)
        const masteryPercentage = sectionProgress?.mastery_percentage || 0

        return (
          <div key={section.id} className="card section-card">
            <div className="section-header">
              <div className="section-number">{index + 1}</div>
              <div className="section-info">
                <h3 className="section-title">{section.title}</h3>
                <span className={`badge badge-${getDifficultyColor(section.difficulty_level)}`}>
                  {section.difficulty_level}
                </span>
              </div>
            </div>

            <p className="section-description">{section.description}</p>

            {section.key_concepts && (
              <div className="key-concepts">
                <strong>Key Concepts:</strong>
                <ul>
                  {(typeof section.key_concepts === 'string'
                    ? JSON.parse(section.key_concepts)
                    : section.key_concepts
                  ).map((concept, idx) => (
                    <li key={idx}>{concept}</li>
                  ))}
                </ul>
              </div>
            )}

            <ProgressBar percentage={masteryPercentage} />

            <div className="section-stats">
              {sectionProgress && (
                <>
                  <span>{sectionProgress.questions_correct} / {sectionProgress.total_questions} questions mastered</span>
                  <span>{sectionProgress.total_attempts} total attempts</span>
                </>
              )}
              {!sectionProgress && (
                <span>Not started yet</span>
              )}
            </div>

            <Link to={`/study/${section.id}`} className="btn btn-primary">
              Study This Section
            </Link>
          </div>
        )
      })}

      <style>{`
        .curriculum-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .section-card {
          position: relative;
        }

        .section-header {
          display: flex;
          align-items: start;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .section-number {
          flex-shrink: 0;
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #2563eb;
          color: white;
          border-radius: 50%;
          font-weight: 600;
          font-size: 1.125rem;
        }

        .section-info {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: start;
          gap: 1rem;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .section-description {
          color: #4b5563;
          font-size: 0.875rem;
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .key-concepts {
          background-color: #f9fafb;
          padding: 1rem;
          border-radius: 0.375rem;
          margin-bottom: 1rem;
          font-size: 0.875rem;
        }

        .key-concepts strong {
          color: #374151;
          display: block;
          margin-bottom: 0.5rem;
        }

        .key-concepts ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .key-concepts li {
          padding: 0.25rem 0;
          padding-left: 1rem;
          position: relative;
          color: #4b5563;
        }

        .key-concepts li:before {
          content: "•";
          position: absolute;
          left: 0;
          color: #2563eb;
          font-weight: bold;
        }

        .section-stats {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          margin: 0.75rem 0;
          border-top: 1px solid #e5e7eb;
          font-size: 0.875rem;
          color: #6b7280;
        }
      `}</style>
    </div>
  )
}

// Helper function to get difficulty color
function getDifficultyColor(difficulty) {
  switch (difficulty) {
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

export default CurriculumView
