@echo off
setlocal
cd /d "%~dp0"

echo CET-6 Pop Culture Vocabulary Card Viewer
echo Windows one-click launcher
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-windows.ps1"

if errorlevel 1 (
  echo.
  echo Launch failed. Please check the message above.
  pause
)
