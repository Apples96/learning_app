import React, { useState } from 'react'

/**
 * OpenEndedQuestion component displays questions requiring text answers.
 * Provides textarea for user to type their response.
 */
function OpenEndedQuestion({ question, onSubmit }) {
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
        <span className="badge badge-green">Open-Ended</span>
        <span className="badge badge-${question.difficulty || 'medium'}">{question.difficulty || 'Medium'}</span>
      </div>

      <h2 className="question-text">{question.question_text}</h2>

      <div className="answer-area">
        <textarea
          className="form-textarea"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          disabled={submitted}
          rows="8"
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

        .question-text {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 2rem;
          line-height: 1.5;
        }

        .answer-area {
          margin-bottom: 2rem;
        }

        .answer-area textarea {
          min-height: 200px;
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

export default OpenEndedQuestion
