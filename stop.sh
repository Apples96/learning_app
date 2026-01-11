#!/bin/bash

# Stop all Python Flask processes running app.py
echo "Stopping backend servers..."
pkill -f "python app.py" 2>/dev/null || true

# Stop all Node/Vite processes on port 3000
echo "Stopping frontend servers..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Stop processes on port 5001 (backend)
lsof -ti:5001 | xargs kill -9 2>/dev/null || true

# Clean up log files
rm -f backend.log frontend.log 2>/dev/null || true

echo "All servers stopped and cleaned up."
