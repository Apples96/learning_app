import axios from 'axios'

/**
 * API service for communicating with the backend.
 * Centralized API calls with error handling.
 */

const API_BASE_URL = 'http://localhost:5001/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Topics API
export const topicsAPI = {
  // Get all topics
  getAll: async () => {
    const response = await api.get('/topics')
    return response.data
  },

  // Get a specific topic with curriculum
  getById: async (topicId) => {
    const response = await api.get(`/topics/${topicId}`)
    return response.data
  },

  // Create a new topic
  create: async (topicData) => {
    const response = await api.post('/topics', topicData)
    return response.data
  },

  // Delete a topic
  delete: async (topicId) => {
    const response = await api.delete(`/topics/${topicId}`)
    return response.data
  }
}

// Curriculum API
export const curriculumAPI = {
  // Get a section with questions
  getSection: async (sectionId, params = {}) => {
    const response = await api.get(`/curriculum/sections/${sectionId}`, { params })
    return response.data
  },

  // Regenerate questions for a section
  regenerateQuestions: async (sectionId, data) => {
    const response = await api.post(`/curriculum/sections/${sectionId}/regenerate`, data)
    return response.data
  }
}

// Questions API
export const questionsAPI = {
  // Get a specific question
  getById: async (questionId) => {
    const response = await api.get(`/questions/${questionId}`)
    return response.data
  },

  // Submit an answer
  submitAnswer: async (questionId, userAnswer) => {
    const response = await api.post(`/questions/${questionId}/answer`, { user_answer: userAnswer })
    return response.data
  },

  // Get explanation for a question
  getExplanation: async (questionId) => {
    const response = await api.get(`/questions/${questionId}/explanation`)
    return response.data
  }
}

// Progress API
export const progressAPI = {
  // Get progress for a topic
  getTopicProgress: async (topicId) => {
    const response = await api.get(`/progress/topics/${topicId}`)
    return response.data
  },

  // Get progress for a section
  getSectionProgress: async (sectionId) => {
    const response = await api.get(`/progress/sections/${sectionId}`)
    return response.data
  }
}

export default api
