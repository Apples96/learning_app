import React from 'react'

/**
 * AnswerFeedback component displays feedback after answering a question.
 * Shows whether answer was correct and provides explanation.
 */
function AnswerFeedback({ feedback, onNext }) {
  if (!feedback) return null

  const isCorrect = feedback.is_correct
  const score = feedback.score || 0

  return (
    <div className="feedback-container">
      <div className={`feedback-header ${isCorrect ? 'correct' : 'incorrect'}`}>
        <div className="feedback-icon">
          {isCorrect ? '✓' : '✗'}
        </div>
        <div className="feedback-status">
          <h3>{isCorrect ? 'Correct!' : 'Incorrect'}</h3>
          {score !== undefined && (
            <p className="feedback-score">Score: {Math.round(score)}%</p>
          )}
        </div>
      </div>

      {feedback.correct_answer && (
        <div className="feedback-section">
          <h4>Correct Answer:</h4>
          <p>{feedback.correct_answer}</p>
        </div>
      )}

      <div className="feedback-section">
        <h4>Explanation:</h4>
        <p>{feedback.explanation || feedback.feedback}</p>
      </div>

      <div className="feedback-actions">
        <button className="btn btn-primary" onClick={onNext}>
          Next Question
        </button>
      </div>

      <style>{`
        .feedback-container {
          background: white;
          padding: 2rem;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          margin-top: 1.5rem;
        }

        .feedback-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          border-radius: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .feedback-header.correct {
          background-color: #d1fae5;
          border: 2px solid #10b981;
        }

        .feedback-header.incorrect {
          background-color: #fee2e2;
          border: 2px solid #ef4444;
        }

        .feedback-icon {
          flex-shrink: 0;
          width: 3rem;
          height: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 1.5rem;
          font-weight: bold;
        }

        .feedback-header.correct .feedback-icon {
          background-color: #10b981;
          color: white;
        }

        .feedback-header.incorrect .feedback-icon {
          background-color: #ef4444;
          color: white;
        }

        .feedback-status h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .feedback-header.correct .feedback-status h3 {
          color: #065f46;
        }

        .feedback-header.incorrect .feedback-status h3 {
          color: #991b1b;
        }

        .feedback-score {
          margin: 0.25rem 0 0 0;
          font-size: 0.875rem;
          color: #4b5563;
        }

        .feedback-section {
          margin-bottom: 1.5rem;
        }

        .feedback-section h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .feedback-section p {
          color: #4b5563;
          line-height: 1.6;
          margin: 0;
        }

        .feedback-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e5e7eb;
        }
      `}</style>
    </div>
  )
}

export default AnswerFeedback
