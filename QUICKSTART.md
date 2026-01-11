# Quick Start Guide

## Super Easy Setup (3 Commands!)

### Mac/Linux

```bash
# 1. Run setup (installs everything)
python3 setup.py

# 2. Add your API key to .env file
nano .env  # or use any text editor

# 3. Start the app!
make run
```

That's it! The app will start automatically at http://localhost:3000

### Windows

```bash
# 1. Run setup
python setup.py

# 2. Add your API key to .env file
notepad .env

# 3. Start the app!
start.bat
```

## Available Commands

### Using Makefile (Mac/Linux)

```bash
make help       # Show all available commands
make setup      # First-time setup (install dependencies)
make run        # Start both backend and frontend
make stop       # Stop all servers
make backend    # Start only backend
make frontend   # Start only frontend
make clean      # Clean up caches and build files
```

### Manual Commands

**Backend:**
```bash
cd backend
source venv/bin/activate  # Mac/Linux
# OR
venv\Scripts\activate     # Windows

python app.py
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## Getting Your API Key

1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Navigate to API Keys
4. Create a new key
5. Copy it and add to `.env`:
   ```
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```

## Using the App

### 1. Create Your First Topic (30 seconds)

- Click "New Topic"
- Fill in:
  - **Name**: e.g., "Python Basics"
  - **Description**: What you want to learn
  - **Level**: Beginner/Intermediate/Advanced
- Click "Create Topic"
- Wait ~30 seconds for AI to generate curriculum

### 2. Study (Start Learning!)

- Click "View Curriculum"
- Choose a section
- Pick question type (MCQ/Open-Ended/Visual)
- Answer questions
- Get instant feedback!

### 3. Track Progress

- View mastery percentage (0-100%)
- See which sections you've completed
- 100% = All questions answered correctly at least once

## Troubleshooting

**"Failed to create topic"**
- Check your API key in `.env` file
- Make sure backend is running

**Port already in use**
- Run `make stop` to kill old processes
- Or manually: `lsof -ti:5000 | xargs kill -9`

**Dependencies missing**
- Run `make setup` again
- Or `python setup.py`

**Backend won't start**
- Make sure virtual environment is activated
- Check `backend.log` for errors

**Frontend won't load**
- Make sure backend is running first
- Check `frontend.log` for errors

## What Each File Does

- `Makefile` - One-command shortcuts for everything
- `start.sh` - Launches both servers (Mac/Linux)
- `start.bat` - Launches both servers (Windows)
- `setup.py` - Automated first-time setup
- `.env` - Your API key and configuration

## Tips

- **Start with MCQ** questions - quickest to complete
- **Read explanations** even when correct
- **Regenerate questions** to get new challenges
- **Open-ended questions** use AI evaluation (takes a few seconds)
- Use `Ctrl+C` in terminal to stop servers

## Next Steps

Check out:
- `README.md` - Full documentation
- `CLAUDE.md` - Project architecture
- Backend API at http://localhost:5000
- Frontend at http://localhost:3000

Happy learning! 🎓
