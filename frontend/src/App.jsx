import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import TopicDetail from './pages/TopicDetail'
import StudySession from './pages/StudySession'
import './App.css'

/**
 * Main application component.
 * Sets up routing and navigation for the learning app.
 */
function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <div className="container">
            <h1>
              <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                Learning App
              </Link>
            </h1>
            <nav>
              <Link to="/" className="nav-link">Dashboard</Link>
            </nav>
          </div>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/topics/:topicId" element={<TopicDetail />} />
            <Route path="/study/:sectionId" element={<StudySession />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <div className="container">
            <p>Learning App - Master topics through AI-generated curricula</p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
