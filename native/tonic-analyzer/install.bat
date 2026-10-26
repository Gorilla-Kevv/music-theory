@echo off
setlocal
cd /d "%~dp0"
title TONIC - Install Analyzer CLAP

net session >nul 2>&1
if errorlevel 1 (
  echo [ELEVATE] Requesting administrator privileges...
  powershell -NoProfile -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
  exit /b 0
)

if not exist "TONIC-Analyzer.clap" (
  echo [ERROR] TONIC-Analyzer.clap not found.
  echo         Run build.bat first.
  pause
  exit /b 1
)

set "DEST=C:\Program Files\Common Files\CLAP\TONIC"
if not exist "%DEST%" mkdir "%DEST%"
copy /Y "TONIC-Analyzer.clap" "%DEST%\TONIC-Analyzer.clap" >nul
if errorlevel 1 (
  echo [ERROR] Copy failed. Check administrator rights.
  pause
  exit /b 1
)

echo.
echo [OK] Installed to:
echo      %DEST%\TONIC-Analyzer.clap
echo.
echo      In FL Studio 2026:
echo      1. Options ^> Manage plugins
echo      2. Click Verify plugins / Scan (Ctrl+click Scan for full scan)
echo      3. Enable TONIC Analyzer if it appears unchecked
echo      4. Insert it on Master or any Mixer Insert effect slot
echo.
pause
endlocal
