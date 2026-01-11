@echo off
echo.
echo Starting Learning App...
echo.

REM Check if .env exists
if not exist .env (
    echo Error: .env file not found
    echo Run setup first: python setup.py
    exit /b 1
)

REM Start backend in new window
echo Starting backend server...
start "Backend Server" cmd /k "cd backend && venv\Scripts\activate && python app.py"

REM Wait a moment
timeout /t 3 /nobreak >nul

REM Start frontend in new window
echo Starting frontend server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo Learning App is starting!
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Close the command windows to stop the servers.
echo.
