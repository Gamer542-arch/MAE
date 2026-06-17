@echo off
cd /d "%~dp0"

echo ==========================================
echo   ⚡ MAE - Make Anything Editor
echo ==========================================
echo.

where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python not found in PATH!
    echo Install Python 3.10+ and try again.
    pause
    exit /b 1
)

echo [OK] Python found
echo Starting MAE server on http://localhost:8000 ...
echo.

start "MAE-Server" python -m uvicorn app.main:app --host localhost --port 8000 --reload

timeout /t 3 /nobreak >nul

echo ==========================================
echo   🌐 Open: http://localhost:8000
echo   📚 Docs: http://localhost:8000/docs
echo ==========================================
echo.

start http://localhost:8000

echo Server running. Close this window to STOP.
echo.
pause
taskkill /FI "WINDOWTITLE eq MAE-Server*" /T /F 2>nul >nul
echo Server stopped.
