@echo off
setlocal
cd /d "%~dp0"
title TONIC x FL Studio 2026

echo.
echo   TONIC x FL Studio 2026
echo   ----------------------
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js was not found on PATH.
  echo         Install Node.js 20+ and run this file again.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo [ERROR] npm was not found on PATH.
  pause
  exit /b 1
)

set "npm_config_cache=%~dp0.npm-cache"

if not exist "node_modules\.bin\tsx.cmd" (
  echo [SETUP] First run: installing local dependencies...
  call npm install --no-audit --no-fund
  if errorlevel 1 (
    echo.
    echo [ERROR] npm install failed. Check the messages above.
    pause
    exit /b 1
  )
)

if not exist ".venv-audio\Scripts\python.exe" (
  echo [INFO] Live capture is optional. Run setup-live-audio.bat to enable WASAPI loopback.
  echo.
)

powershell -NoProfile -Command "try{$r=Invoke-WebRequest -UseBasicParsing 'http://127.0.0.1:5127/api/status' -TimeoutSec 2; if($r.StatusCode -eq 200 -and $r.Content -match 'panelUrl'){exit 0}else{exit 2}}catch{if($_.Exception.Response){exit 2}else{exit 1}}"
if errorlevel 2 (
  echo [ERROR] Port 5127 is used by another application.
  echo         Close it and run this file again.
  pause
  exit /b 1
)
if errorlevel 1 goto start_bridge

echo [READY] TONIC FL bridge is already running.
powershell -NoProfile -Command "try{Invoke-WebRequest -UseBasicParsing -Method POST 'http://127.0.0.1:5127/api/panel' -TimeoutSec 5 | Out-Null}catch{}"
echo         Panel: http://127.0.0.1:5127/panel
echo         Open Gopher in FL Studio (Gopher / Alt+F1) to see the TONIC panel.
echo.
exit /b 0

:start_bridge
echo [START] Bridge plus FL Studio 2026.
echo         Keep this window open while you use the TONIC panel.
echo         If FL is already running without the debug port, save your
echo         project, close FL, then run this file again.
echo.
call npm run fl:start
echo.
echo [STOP] Bridge stopped.
pause
endlocal
