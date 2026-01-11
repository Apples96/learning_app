# 🚀 START HERE

## One-Time Setup (5 minutes)

```bash
# 1. Install everything
python3 setup.py         # Mac/Linux
python setup.py          # Windows

# 2. Add your API key
# Edit .env and add: ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Get your API key from: https://console.anthropic.com/

## Start the App

### Option 1: Easiest (Recommended)

**Mac/Linux:**
```bash
make run
```

**Windows:**
```bash
start.bat
```

### Option 2: Using Scripts

**Mac/Linux:**
```bash
./start.sh
```

**Windows:**
Double-click `start.bat` or run it from command prompt

### Option 3: Manual

**Terminal 1 (Backend):**
```bash
cd backend
source venv/bin/activate  # Mac/Linux
# OR venv\Scripts\activate  # Windows
python app.py
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

## Stop the App

**Mac/Linux:**
```bash
make stop
```

**Windows:**
Close the command windows that opened

## All Available Commands

```bash
make help       # Show all commands
make setup      # First-time setup
make run        # Start app
make stop       # Stop app
make backend    # Backend only
make frontend   # Frontend only
make clean      # Clean caches
```

## Access the App

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Troubleshooting

**"Failed to create topic"**
→ Check your API key in .env

**Port already in use**
→ Run `make stop` or restart your computer

**Need help?**
→ Check QUICKSTART.md for detailed guide

---

**Ready? Run this now:**
```bash
make run
```
