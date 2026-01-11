# Learning App

A personalized learning application that helps users master topics through AI-generated curricula and adaptive question sets.

## 🚀 Quick Start

**Mac/Linux:**
```bash
python3 setup.py    # One-time setup
make run            # Start the app!
```

**Windows:**
```bash
python setup.py     # One-time setup
start.bat           # Start the app!
```

See [QUICKSTART.md](QUICKSTART.md) for details.

## Features

- **Topic Management**: Create and manage learning topics with customizable descriptions and levels
- **AI-Generated Curricula**: Automatic curriculum generation with progressive sections from basics to advanced
- **Multiple Question Types**: MCQ, open-ended, and visual/practical questions
- **Progress Tracking**: Track mastery level for each curriculum section (0-100%)
- **Question Regeneration**: Generate new question batches when needed
- **Answer Feedback**: Immediate feedback with detailed explanations
- **AI Answer Evaluation**: Smart evaluation of open-ended responses

## Tech Stack

### Backend
- **Flask** - Python web framework
- **SQLite** - Database (PostgreSQL optional)
- **SQLAlchemy** - ORM
- **Anthropic Claude API** - AI for curriculum and question generation

### Frontend
- **React** - UI framework
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - API calls

## Setup Instructions

### Easy Setup (Recommended)

**First-time setup:**
```bash
# Mac/Linux
python3 setup.py

# Windows
python setup.py
```

This will:
- Install all backend dependencies
- Install all frontend dependencies
- Create your `.env` file

**Add your API key:**
Edit the `.env` file and add your Anthropic API key:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

**Start the app:**
```bash
# Mac/Linux
make run

# Windows
start.bat
```

### Manual Setup

If you prefer to set things up manually, see the detailed instructions below.

<details>
<summary>Click to expand manual setup instructions</summary>

#### Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL (optional, SQLite works for development)
- Anthropic API key

#### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment and activate it:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

5. Edit `.env` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=your_api_key_here
DATABASE_URL=sqlite:///learning_app.db  # Or PostgreSQL URL
SECRET_KEY=your_secret_key_here
DEBUG=True
```

6. Run the Flask application:
```bash
python app.py
```

The backend will start on `http://localhost:5000`

#### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

</details>

## Available Commands

### Makefile Commands (Mac/Linux)

```bash
make help       # Show all commands
make setup      # First-time setup
make run        # Start both servers
make stop       # Stop all servers
make backend    # Start backend only
make frontend   # Start frontend only
make clean      # Clean up caches
```

## Usage

1. **Create a Topic**:
   - Click "New Topic" on the dashboard
   - Enter topic name, description, target level, and optional focus areas
   - AI generates a curriculum with 5-8 sections

2. **Study a Section**:
   - Click "View Curriculum" on any topic
   - Select a section to study
   - Choose question type (MCQ, Open-Ended, or Visual/Practical)
   - Answer questions and receive immediate feedback

3. **Track Progress**:
   - View overall topic progress on the topic detail page
   - See mastery percentage for each section
   - 100% mastery means all questions answered correctly at least once

4. **Regenerate Questions**:
   - Click "Regenerate Questions" in a study session
   - New questions are generated while old ones are preserved
   - Useful when you've saturated the current question set

## API Endpoints

### Topics
- `GET /api/topics` - Get all topics
- `POST /api/topics` - Create new topic (triggers curriculum generation)
- `GET /api/topics/:id` - Get topic with curriculum
- `DELETE /api/topics/:id` - Delete topic

### Curriculum
- `GET /api/curriculum/sections/:id` - Get section with questions
- `POST /api/curriculum/sections/:id/regenerate` - Regenerate questions

### Questions
- `GET /api/questions/:id` - Get question
- `POST /api/questions/:id/answer` - Submit answer
- `GET /api/questions/:id/explanation` - Get explanation

### Progress
- `GET /api/progress/topics/:id` - Get topic progress
- `GET /api/progress/sections/:id` - Get section progress

## Database Schema

- **topics**: Learning topics created by user
- **curriculum_sections**: Sections within each topic
- **questions**: Questions for each section
- **user_progress**: Record of answers and attempts
- **section_mastery**: Calculated mastery levels

**Note**: The app uses SQLite by default (no setup required). If you want to use PostgreSQL:
1. Install PostgreSQL on your system
2. Install the Python driver: `pip install psycopg2-binary` (requires Python 3.12 or earlier)
3. Update `DATABASE_URL` in `.env` to your PostgreSQL connection string

## Development Notes

- The app uses Claude Sonnet 4.5 for high-quality educational content
- Questions are generated in batches and stored in the database
- Progress tracking uses a simple mastery algorithm (correct answers / total questions)
- The frontend uses inline JSX styles for simplicity (can be refactored to CSS modules)

## Future Enhancements

- Spaced repetition algorithm
- Multi-user support with authentication
- Topic sharing between users
- Export progress reports
- Mobile app version
- AI tutor chat for follow-up questions

## License

MIT License
# learning_app
