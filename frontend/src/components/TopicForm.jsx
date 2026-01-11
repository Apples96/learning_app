import React, { useState } from 'react'

/**
 * TopicForm component for creating new learning topics.
 * Collects topic name, description, level, and focus areas.
 */
function TopicForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    level: 'beginner',
    focus_areas: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!formData.name.trim()) {
      setError('Topic name is required')
      return
    }

    if (!formData.description.trim()) {
      setError('Description is required')
      return
    }

    setLoading(true)

    try {
      await onSubmit(formData)
      // Reset form
      setFormData({
        name: '',
        description: '',
        level: 'beginner',
        focus_areas: ''
      })
    } catch (err) {
      setError(err.message || 'Failed to create topic')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 className="card-title">Create New Topic</h2>

      {error && (
        <div className="error">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="name">
            Topic Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-input"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Python Programming, Machine Learning"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="description">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            className="form-textarea"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe what you want to learn about this topic..."
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="level">
            Target Level *
          </label>
          <select
            id="level"
            name="level"
            className="form-select"
            value={formData.level}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="focus_areas">
            Focus Areas (Optional)
          </label>
          <textarea
            id="focus_areas"
            name="focus_areas"
            className="form-textarea"
            value={formData.focus_areas}
            onChange={handleChange}
            placeholder="Any specific areas you want to focus on..."
            disabled={loading}
            style={{ minHeight: '80px' }}
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Topic & Generate Curriculum'}
          </button>
          {onCancel && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <style>{`
        .form-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }

        .form-actions .btn {
          flex: 1;
        }
      `}</style>
    </div>
  )
}

export default TopicForm
