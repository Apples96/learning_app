import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import MCQQuestion from '../components/MCQQuestion'
import OpenEndedQuestion from '../components/OpenEndedQuestion'
import VisualQuestion from '../components/VisualQuestion'
import AnswerFeedback from '../components/AnswerFeedback'
import ProgressBar from '../components/ProgressBar'
import { curriculumAPI, questionsAPI, progressAPI } from '../services/api'

/**
 * StudySession page handles the learning session for a curriculum section.
 * Allows users to select question type, answer questions, and see feedback.
 */
function StudySession() {
  const { sectionId } = useParams()
  const navigate = useNavigate()

  const [section, setSection] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [questionType, setQuestionType] = useState('mcq')
  const [feedback, setFeedback] = useState(null)
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [regenerating, setRegenerating] = useState(false)

  useEffect(() => {
    loadSectionData()
  }, [sectionId, questionType])

  const loadSectionData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load section with questions and progress
      const [sectionResponse, progressResponse] = await Promise.all([
        curriculumAPI.getSection(sectionId, { question_type: questionType }),
        progressAPI.getSectionProgress(sectionId)
      ])

      setSection(sectionResponse.section)
      setQuestions(sectionResponse.section.questions || [])
      setProgress(progressResponse.progress)
      setCurrentQuestionIndex(0)
      setFeedback(null)
    } catch (err) {
      setError('Failed to load section: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSubmit = async (userAnswer) => {
    const currentQuestion = questions[currentQuestionIndex]

    try {
      const response = await questionsAPI.submitAnswer(currentQuestion.id, userAnswer)
      setFeedback(response.feedback)

      // Reload progress
      const progressResponse = await progressAPI.getSectionProgress(sectionId)
      setProgress(progressResponse.progress)
    } catch (err) {
      alert('Failed to submit answer: ' + err.message)
    }
  }

  const handleNextQuestion = () => {
    setFeedback(null)

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // All questions completed
      alert('You\'ve completed all questions in this section!')
      setCurrentQuestionIndex(0)
    }
  }

  const handleRegenerateQuestions = async () => {
    if (!window.confirm('Generate new questions for this section? Previous questions will still be available.')) {
      return
    }

    try {
      setRegenerating(true)
      await curriculumAPI.regenerateQuestions(sectionId, {
        question_type: questionType,
        count: 10
      })

      // Reload section data
      await loadSectionData()
      alert('New questions generated successfully!')
    } catch (err) {
      alert('Failed to regenerate questions: ' + err.message)
    } finally {
      setRegenerating(false)
    }
  }

  const handleQuestionTypeChange = (newType) => {
    if (questions.length > 0 && !window.confirm('Changing question type will reload the session. Continue?')) {
      return
    }
    setQuestionType(newType)
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading study session...</div>
      </div>
    )
  }

  if (error || !section) {
    return (
      <div className="container">
        <div className="error">{error || 'Section not found'}</div>
        <button onClick={() => navigate(-1)} className="btn btn-secondary">
          Go Back
        </button>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="container">
      <div className="study-header">
        <button onClick={() => navigate(-1)} className="back-link">
          ← Back to Curriculum
        </button>

        <div className="section-info-card">
          <div className="section-title-row">
            <h1>{section.title}</h1>
            <span className={`badge badge-${getDifficultyColor(section.difficulty_level)}`}>
              {section.difficulty_level}
            </span>
          </div>
          <p className="section-desc">{section.description}</p>
        </div>

        {progress && (
          <div className="card progress-card">
            <h3>Your Progress</h3>
            <ProgressBar percentage={progress.mastery_percentage} />
            <div className="progress-details">
              <span>{progress.questions_correct} / {progress.total_questions} mastered</span>
              <span>{progress.total_attempts} attempts</span>
            </div>
          </div>
        )}
      </div>

      <div className="study-controls">
        <div className="question-type-selector">
          <label>Question Type:</label>
          <div className="type-buttons">
            <button
              className={`btn ${questionType === 'mcq' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handleQuestionTypeChange('mcq')}
              disabled={regenerating}
            >
              Multiple Choice
            </button>
            <button
              className={`btn ${questionType === 'open_ended' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handleQuestionTypeChange('open_ended')}
              disabled={regenerating}
            >
              Open-Ended
            </button>
            <button
              className={`btn ${questionType === 'visual' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handleQuestionTypeChange('visual')}
              disabled={regenerating}
            >
              Visual/Practical
            </button>
          </div>
        </div>

        <button
          className="btn btn-secondary"
          onClick={handleRegenerateQuestions}
          disabled={regenerating}
        >
          {regenerating ? 'Generating...' : 'Regenerate Questions'}
        </button>
      </div>

      {questions.length === 0 ? (
        <div className="card">
          <p style={{ textAlign: 'center', color: '#6b7280' }}>
            No {questionType} questions available. Try regenerating questions or select a different type.
          </p>
        </div>
      ) : (
        <>
          <div className="question-progress">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>

          {!feedback && currentQuestion && (
            <>
              {questionType === 'mcq' && (
                <MCQQuestion
                  question={currentQuestion}
                  onSubmit={handleAnswerSubmit}
                />
              )}
              {questionType === 'open_ended' && (
                <OpenEndedQuestion
                  question={currentQuestion}
                  onSubmit={handleAnswerSubmit}
                />
              )}
              {questionType === 'visual' && (
                <VisualQuestion
                  question={currentQuestion}
                  onSubmit={handleAnswerSubmit}
                />
              )}
            </>
          )}

          {feedback && (
            <AnswerFeedback
              feedback={feedback}
              onNext={handleNextQuestion}
            />
          )}
        </>
      )}

      <style>{`
        .study-header {
          margin-bottom: 2rem;
        }

        .back-link {
          display: inline-block;
          color: #2563eb;
          text-decoration: none;
          margin-bottom: 1rem;
          font-size: 0.875rem;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        .back-link:hover {
          text-decoration: underline;
        }

        .section-info-card {
          background: white;
          padding: 1.5rem;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          margin-bottom: 1rem;
        }

        .section-title-row {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 0.75rem;
        }

        h1 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .section-desc {
          color: #4b5563;
          font-size: 0.875rem;
          margin: 0;
        }

        .progress-card {
          margin-bottom: 1.5rem;
        }

        .progress-card h3 {
          font-size: 1rem;
          margin-bottom: 0.75rem;
          color: #374151;
        }

        .progress-details {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          color: #6b7280;
          margin-top: 0.5rem;
        }

        .study-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .question-type-selector {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .question-type-selector label {
          font-weight: 500;
          color: #374151;
        }

        .type-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .type-buttons .btn {
          font-size: 0.875rem;
        }

        .question-progress {
          text-align: center;
          font-size: 0.875rem;
          font-weight: 500;
          color: #6b7280;
          margin-bottom: 1.5rem;
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

export default StudySession
