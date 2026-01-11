import React, { useState } from 'react'

/**
 * MCQQuestion component displays multiple choice questions.
 * Shows 4 options and handles answer selection.
 */
function MCQQuestion({ question, onSubmit }) {
  const [selectedOption, setSelectedOption] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (selectedOption === null) return

    setSubmitted(true)
    onSubmit(selectedOption)
  }

  const options = question.options || []

  return (
    <div className="question-container">
      <div className="question-header">
        <span className="badge badge-blue">Multiple Choice</span>
        <span className="badge badge-${question.difficulty || 'medium'}">{question.difficulty || 'Medium'}</span>
      </div>

      <h2 className="question-text">{question.question_text}</h2>

      <div className="mcq-options">
        {options.map((option, index) => (
          <div
            key={index}
            className={`mcq-option ${selectedOption === option ? 'selected' : ''} ${submitted ? 'disabled' : ''}`}
            onClick={() => !submitted && setSelectedOption(option)}
          >
            <div className="option-indicator">
              {String.fromCharCode(65 + index)}
            </div>
            <div className="option-text">{option}</div>
          </div>
        ))}
      </div>

      <div className="question-actions">
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={selectedOption === null || submitted}
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

        .mcq-options {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .mcq-option {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .mcq-option:hover:not(.disabled) {
          border-color: #2563eb;
          background-color: #eff6ff;
        }

        .mcq-option.selected {
          border-color: #2563eb;
          background-color: #dbeafe;
        }

        .mcq-option.disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .option-indicator {
          flex-shrink: 0;
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #e5e7eb;
          color: #374151;
          border-radius: 50%;
          font-weight: 600;
        }

        .mcq-option.selected .option-indicator {
          background-color: #2563eb;
          color: white;
        }

        .option-text {
          flex: 1;
          color: #374151;
          font-size: 1rem;
        }

        .question-actions {
          display: flex;
          justify-content: flex-end;
        }
      `}</style>
    </div>
  )
}

export default MCQQuestion
