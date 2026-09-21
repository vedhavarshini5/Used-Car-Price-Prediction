@echo off
echo ========================================================
echo Starting AutoPrice AI - React/Vite Frontend (Port 5173)
echo ========================================================
set "PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%"
cd /d "%~dp0\frontend"
npm run dev
pause
