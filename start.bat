@echo off
setlocal
cd /d "%~dp0"
title TONIC - Local Theory Workbench

echo.
echo   TONIC / Main Tone - Local First Theory Workbench
echo   ------------------------------------------------
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

if not exist "node_modules\.bin\vite.cmd" (
  echo [SETUP] First run: installing local dependencies...
  call npm install --no-audit --no-fund
  if errorlevel 1 (
    echo.
    echo [ERROR] npm install failed. Check the messages above.
    pause
    exit /b 1
  )
)

powershell -NoProfile -Command "try{$r=Invoke-WebRequest -UseBasicParsing 'http://127.0.0.1:5173' -TimeoutSec 3; if($r.Content -match 'TONIC'){exit 0}else{exit 2}}catch{exit 1}"
if errorlevel 2 (
  echo [ERROR] Port 5173 is already used by another application.
  echo         Close it and run this file again.
  pause
  exit /b 1
)
if errorlevel 1 goto start_server

echo [READY] TONIC is already running at http://127.0.0.1:5173
if not "%TONIC_NO_OPEN%"=="1" start "" "http://127.0.0.1:5173"
exit /b 0

:start_server
if not "%TONIC_NO_OPEN%"=="1" (
  start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 3; Start-Process 'http://127.0.0.1:5173'"
)

echo [START] Launching local Vite server...
echo         http://127.0.0.1:5173
echo         Press Ctrl+C or close this window to stop.
echo.

call npm run dev -- --host 127.0.0.1 --port 5173 --strictPort

echo.
echo [STOP] Server stopped.
pause
endlocal
