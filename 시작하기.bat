@echo off
cd /d "%~dp0"
title PlayLab - Web Game Server
echo ===========================================
echo   PlayLab web game server is starting...
echo.
echo   Keep this window OPEN while playing.
echo   Close this window to STOP the site.
echo ===========================================
echo.

rem Open the browser after a short delay
start "" cmd /c "timeout /t 2 >nul & start http://localhost:8000/index.html"

rem Start local server (try py first, then python)
where py >nul 2>nul
if %errorlevel%==0 (
  py -m http.server 8000
) else (
  python -m http.server 8000
)

echo.
echo Server stopped. Press any key to close.
pause >nul
