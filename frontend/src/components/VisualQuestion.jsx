import React, { useState } from 'react'

/**
 * VisualQuestion component displays practical/visual questions.
 * Similar to open-ended but designed for scenarios and practical problems.
 */
function VisualQuestion({ question, onSubmit }) {
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!answer.trim()) return

    setSubmitted(true)
    onSubmit(answer)
  }

  return (
    <div className="question-container">
      <div className="question-header">
        <span className="badge badge-yellow">Visual/Practical</span>
        <span className="badge badge-${question.difficulty || 'medium'}">{question.difficulty || 'Medium'}</span>
      </div>

      <div className="question-text-container">
        <pre className="question-text">{question.question_text}</pre>
      </div>

      <div className="scenario-box">
        <p className="scenario-hint">
          This is a practical scenario question. Describe your approach, solution, or analysis.
        </p>
      </div>

      <div className="answer-area">
        <textarea
          className="form-textarea"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Describe your solution or approach..."
          disabled={submitted}
          rows="10"
        />
        <div className="character-count">
          {answer.length} characters
        </div>
      </div>

      <div className="question-actions">
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={!answer.trim() || submitted}
        >
          Submit Answer
        </button>
      </div>

      <style>{`
        .question-container {
          background: white;
          padding: 2rem;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .question-header {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .question-text-container {
          margin-bottom: 1.5rem;
        }

        .question-text {
          font-family: 'Courier New', Courier, monospace;
          font-size: 1rem;
          font-weight: 500;
          color: #1f2937;
          line-height: 1.6;
          white-space: pre-wrap;
          word-wrap: break-word;
          background-color: #f9fafb;
          padding: 1.5rem;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
          overflow-x: auto;
        }

        .scenario-box {
          background-color: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 1rem;
          margin-bottom: 1.5rem;
          border-radius: 0.25rem;
        }

        .scenario-hint {
          color: #92400e;
          font-size: 0.875rem;
          margin: 0;
        }

        .answer-area {
          margin-bottom: 2rem;
        }

        .answer-area textarea {
          min-height: 250px;
          font-size: 1rem;
          line-height: 1.6;
        }

        .character-count {
          text-align: right;
          font-size: 0.75rem;
          color: #6b7280;
          margin-top: 0.25rem;
        }

        .question-actions {
          display: flex;
          justify-content: flex-end;
        }
      `}</style>
    </div>
  )
}

export default VisualQuestion
