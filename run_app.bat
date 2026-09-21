@echo off
echo ========================================================
echo Starting AutoPrice AI Full-Stack Application
echo ========================================================
cd /d "%~dp0"
set "PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%"

echo 1. Launching Backend (FastAPI on Port 8000)...
start "AutoPrice AI - Backend" cmd /c "run_backend.bat"

echo 2. Launching Frontend (Vite on Port 5173)...
start "AutoPrice AI - Frontend" cmd /c "run_frontend.bat"

echo Waiting for servers to initialize...
timeout /t 3 /nobreak >nul

echo Opening browser at http://localhost:5173 ...
start http://localhost:5173
echo Application running!
