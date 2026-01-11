import React, { useState, useEffect } from 'react'
import TopicList from '../components/TopicList'
import TopicForm from '../components/TopicForm'
import { topicsAPI } from '../services/api'

/**
 * Dashboard page - main view for managing topics.
 * Shows all topics and allows creating/deleting topics.
 */
function Dashboard() {
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [creating, setCreating] = useState(false)

  // Load topics on mount
  useEffect(() => {
    loadTopics()
  }, [])

  const loadTopics = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await topicsAPI.getAll()
      setTopics(response.topics || [])
    } catch (err) {
      setError('Failed to load topics: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTopic = async (topicData) => {
    try {
      setCreating(true)
      const response = await topicsAPI.create(topicData)

      if (response.success) {
        // Add new topic to list
        setTopics(prev => [response.topic, ...prev])
        setShowForm(false)
      } else {
        throw new Error(response.error || 'Failed to create topic')
      }
    } catch (err) {
      throw new Error(err.response?.data?.error || err.message || 'Failed to create topic')
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteTopic = async (topicId) => {
    if (!window.confirm('Are you sure you want to delete this topic? This will remove all curriculum and progress.')) {
      return
    }

    try {
      await topicsAPI.delete(topicId)
      // Remove from list
      setTopics(prev => prev.filter(t => t.id !== topicId))
    } catch (err) {
      alert('Failed to delete topic: ' + err.message)
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading your topics...</div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <div>
          <h1>My Learning Topics</h1>
          <p className="dashboard-subtitle">
            Create topics and study through AI-generated curricula
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
          disabled={creating}
        >
          {showForm ? 'Hide Form' : '+ New Topic'}
        </button>
      </div>

      {error && (
        <div className="error">{error}</div>
      )}

      {showForm && (
        <TopicForm
          onSubmit={handleCreateTopic}
          onCancel={() => setShowForm(false)}
        />
      )}

      {creating && (
        <div className="success">
          Creating topic and generating curriculum... This may take a minute.
        </div>
      )}

      <TopicList topics={topics} onDelete={handleDeleteTopic} />

      <style>{`
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .dashboard-subtitle {
          color: #6b7280;
          margin-top: 0.5rem;
        }

        h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
        }
      `}</style>
    </div>
  )
}

export default Dashboard
