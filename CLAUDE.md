# Learning App - Project Plan

## Project Overview

A personalized learning application that helps users master topics through AI-generated curricula and adaptive question sets. Users can add topics, study through structured curricula, and track their progress with multiple question types.

## Core Features

### 1. Topic Management
- **Add Topics**: Users describe what they want to learn, including:
  - Topic name
  - Description of specific learning goals
  - Desired knowledge level (beginner, intermediate, advanced)
  - Any specific focus areas or constraints
- **Remove Topics**: Delete topics the user no longer wants to study
- **View Topics**: List all topics with progress indicators

### 2. AI-Generated Curriculum
When a topic is added, automatically generate a structured curriculum:
- **Progressive Structure**:
  - Foundation/Basics section (core concepts, terminology)
  - Intermediate section (practical applications, deeper understanding)
  - Advanced section (complex scenarios, edge cases, specialized knowledge)
- **Sections**: Each curriculum divided into 5-8 logical sections
- **Question Bank**: Each section contains 20-30 questions across different types

### 3. Question Types
- **Multiple Choice Questions (MCQ)**: 4 options, single correct answer
- **Open-Ended Questions**: Text-based answers requiring explanations
- **Visual/Practical Puzzles**: Scenario-based, code challenges, or diagram interpretation

### 4. Progress Tracking
- **Per-Section Progress**: Track mastery level (0-100%) for each curriculum section
- **Question History**: Record which questions answered correctly/incorrectly
- **Mastery Calculation**:
  - 100% = All questions in section answered correctly at least once
  - <100% = Still has incorrect or unattempted questions
- **Overall Topic Progress**: Aggregate progress across all sections

### 5. Study Session Features
- **Topic Selection**: Choose which topic to study
- **Section Selection**: Pick specific curriculum section within topic
- **Question Type Filter**: Select MCQ, open-ended, or visual/practical
- **Question Regeneration**: Generate new questions for a section when user wants fresh content
- **Answer Feedback**:
  - Immediate indication of correctness
  - Detailed explanation of correct answer
  - For MCQ: explain why wrong answers are incorrect
  - For open-ended: AI evaluation with guidance

### 6. Question Regeneration
- Keep existing questions in database for review
- Generate new batch of questions for same section/topic
- User can choose to study old questions or new ones
- Maintains progress tracking across old and new question sets

## Technical Architecture

### Tech Stack Recommendation

**Backend:**
- **Python/Flask** or **FastAPI** - RESTful API server
- **PostgreSQL** - Database for topics, curricula, questions, progress
- **SQLAlchemy** - ORM for database operations

**Frontend:**
- **React** - Interactive UI components
- **Tailwind CSS** or **Material-UI** - Styling
- **Axios** - API calls

**AI Integration:**
- **Anthropic Claude API** - For curriculum and question generation
- Use Claude Opus 4.5 or Sonnet 4.5 for high-quality educational content

### Database Schema

```
topics
├── id (PK)
├── name
├── description
├── level (beginner/intermediate/advanced)
├── focus_areas
├── created_at
└── updated_at

curriculum_sections
├── id (PK)
├── topic_id (FK)
├── title
├── description
├── order (1, 2, 3... for progression)
├── difficulty_level
└── created_at

questions
├── id (PK)
├── section_id (FK)
├── question_text
├── question_type (mcq/open_ended/visual)
├── correct_answer
├── options (JSON, for MCQ)
├── explanation
├── difficulty
├── generation_batch (for tracking regenerated questions)
└── created_at

user_progress
├── id (PK)
├── section_id (FK)
├── question_id (FK)
├── answered_correctly (boolean)
├── user_answer
├── attempted_at
└── attempt_number

section_mastery
├── id (PK)
├── section_id (FK)
├── questions_correct
├── total_questions
├── mastery_percentage
└── last_updated
```

### API Endpoints

**Topics:**
- `POST /api/topics` - Create new topic (triggers curriculum generation)
- `GET /api/topics` - List all topics with progress
- `GET /api/topics/:id` - Get topic details
- `DELETE /api/topics/:id` - Remove topic

**Curriculum:**
- `GET /api/topics/:id/curriculum` - Get full curriculum for topic
- `GET /api/sections/:id` - Get section details
- `POST /api/sections/:id/regenerate` - Generate new questions for section

**Questions:**
- `GET /api/sections/:id/questions` - Get questions for section (filtered by type)
- `POST /api/questions/:id/answer` - Submit answer, get feedback
- `GET /api/questions/:id/explanation` - Get detailed explanation

**Progress:**
- `GET /api/topics/:id/progress` - Overall topic progress
- `GET /api/sections/:id/progress` - Section-specific progress
- `PUT /api/progress/reset/:section_id` - Reset progress for section

## AI Prompt Strategy

### 1. Curriculum Generation Prompt
```
Given a topic: {topic_name}
Description: {description}
Level: {level}
Focus areas: {focus_areas}

Generate a structured learning curriculum with 5-8 sections that progress from foundational concepts to advanced topics. For each section provide:
1. Section title
2. Brief description (what the learner will master)
3. Key concepts covered
4. Difficulty level

Format as JSON.
```

### 2. Question Generation Prompt
```
For curriculum section: {section_title}
Description: {section_description}
Key concepts: {concepts}

Generate {n} questions of type {question_type}:
- Questions should test understanding of the key concepts
- Difficulty: {difficulty_level}
- Include correct answers and detailed explanations
- For MCQ: provide 4 options with explanations for each

Format as JSON array.
```

### 3. Answer Evaluation Prompt (for open-ended)
```
Question: {question_text}
Correct answer: {correct_answer}
User's answer: {user_answer}

Evaluate the user's answer:
1. Is it correct/partially correct/incorrect?
2. What aspects are right/wrong?
3. Provide constructive feedback and explanation
4. Suggest what to focus on for improvement

Format as JSON.
```

## Implementation Phases

### Phase 1: Core Backend Setup
1. Initialize Flask/FastAPI project
2. Set up PostgreSQL database
3. Create database models and migrations
4. Implement basic CRUD for topics

### Phase 2: AI Integration
1. Set up Anthropic API client
2. Implement curriculum generation endpoint
3. Implement question generation for each type
4. Implement answer evaluation for open-ended questions

### Phase 3: Frontend Foundation
1. Create React app structure
2. Build topic management UI (add/remove/list)
3. Create curriculum view component
4. Build section selection interface

### Phase 4: Study Session Features
1. Implement question display components (MCQ, open-ended, visual)
2. Build answer submission and feedback UI
3. Create progress tracking visualizations
4. Add question type filters

### Phase 5: Progress Tracking
1. Implement progress calculation logic
2. Create mastery percentage tracking
3. Build progress dashboard
4. Add section completion indicators

### Phase 6: Question Regeneration
1. Implement question regeneration endpoint
2. Add UI controls for regeneration
3. Maintain historical question tracking
4. Update progress tracking for new questions

## File Structure

```
learning-app/
├── backend/
│   ├── app.py                 # Main Flask/FastAPI app
│   ├── config.py              # Configuration
│   ├── models/
│   │   ├── topic.py
│   │   ├── curriculum.py
│   │   ├── question.py
│   │   └── progress.py
│   ├── routes/
│   │   ├── topics.py
│   │   ├── curriculum.py
│   │   ├── questions.py
│   │   └── progress.py
│   ├── services/
│   │   ├── ai_service.py      # Anthropic API integration
│   │   ├── curriculum_generator.py
│   │   ├── question_generator.py
│   │   └── progress_tracker.py
│   ├── database.py            # Database connection
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TopicList.jsx
│   │   │   ├── TopicForm.jsx
│   │   │   ├── CurriculumView.jsx
│   │   │   ├── QuestionCard.jsx
│   │   │   ├── MCQQuestion.jsx
│   │   │   ├── OpenEndedQuestion.jsx
│   │   │   ├── VisualQuestion.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   └── AnswerFeedback.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── StudySession.jsx
│   │   │   └── TopicDetail.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   └── App.jsx
│   └── package.json
├── .env                       # Environment variables (API keys)
├── docker-compose.yml         # Local development setup
└── README.md
```

## Environment Variables

```
# Anthropic API
ANTHROPIC_API_KEY=your_api_key_here

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/learning_app

# Flask/FastAPI
SECRET_KEY=your_secret_key
DEBUG=True
```

## Key Considerations

### AI Generation Quality
- Use detailed prompts with examples for consistent output
- Implement retry logic for failed generations
- Store generated content in database for cost optimization
- Cache common curriculum patterns

### Progress Tracking Algorithm
```python
def calculate_mastery(section_id):
    questions = get_questions_for_section(section_id)
    total = len(questions)

    # Get unique questions answered correctly
    correct = len([q for q in questions if user_answered_correctly(q.id)])

    mastery = (correct / total) * 100
    return mastery
```

### Question Regeneration Strategy
- Mark questions with generation_batch number
- Allow users to choose which batch to study from
- Don't delete old questions (keep for reference)
- Limit regeneration to avoid excessive API costs (e.g., max 3 batches per section)

### Visual/Practical Questions
- For code-related topics: generate coding challenges
- For diagram topics: provide ASCII art or descriptions
- For practical scenarios: create real-world problem descriptions
- Consider future integration with image generation APIs

## Next Steps

1. Set up development environment
2. Initialize backend framework
3. Create database schema and models
4. Implement first endpoint: POST /api/topics with curriculum generation
5. Build basic frontend for topic creation
6. Iterate and expand features according to phases

## Future Enhancements (Out of Scope for MVP)

- Spaced repetition algorithm (resurface questions user got wrong)
- Multi-user support with authentication
- Topic sharing between users
- Community-generated questions
- Mobile app version
- Offline mode
- Export progress reports
- Integration with external learning resources
- AI tutor chat for asking follow-up questions
- Collaborative learning (study with friends)
