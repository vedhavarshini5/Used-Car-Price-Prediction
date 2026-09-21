@echo off
echo ========================================================
echo Starting AutoPrice AI - FastAPI Backend Server (Port 8000)
echo ========================================================
cd /d "%~dp0"
python -m uvicorn backend.main:app --reload --port 8000
pause
