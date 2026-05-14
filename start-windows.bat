@echo off
setlocal
cd /d "%~dp0"

echo CET-6 Pop Culture Vocabulary Card Viewer
echo Windows one-click launcher
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-windows.ps1"

echo.
echo Launcher finished. If the browser did not open, check the messages above.
echo You can also open http://127.0.0.1:5173 manually while the dev server is running.
pause
