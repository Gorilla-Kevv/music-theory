@echo off
setlocal
cd /d "%~dp0"
title TONIC - Live Audio Setup

echo.
echo   TONIC / WASAPI live capture setup
echo   ---------------------------------
echo.

where python >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Python was not found on PATH.
  echo         Install Python 3.10+ and run this file again.
  pause
  exit /b 1
)

if not exist ".venv-audio\Scripts\python.exe" (
  echo [SETUP] Creating .venv-audio...
  python -m venv .venv-audio
  if errorlevel 1 (
    echo [ERROR] Could not create the virtual environment.
    pause
    exit /b 1
  )
)

echo [SETUP] Installing PyAudioWPatch...
".venv-audio\Scripts\python.exe" -m pip install --disable-pip-version-check -r "scripts\live-capture-requirements.txt"
if errorlevel 1 (
  echo [ERROR] Dependency installation failed.
  pause
  exit /b 1
)

echo.
echo [OK] Live capture is ready.
echo      Start TONIC FL, open the FL tab, and click "Start live analysis".
echo      It captures the Windows default output; no audio is written to disk.
echo.
pause
endlocal
