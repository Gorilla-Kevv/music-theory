@echo off
setlocal
cd /d "%~dp0\..\.."
title TONIC - Build Analyzer CLAP

if not exist "native\clap\include\clap\clap.h" (
  echo [SETUP] CLAP headers not found; fetching...
  where git >nul 2>nul
  if errorlevel 1 (
    echo [ERROR] git is required to fetch CLAP headers.
    pause
    exit /b 1
  )
  if exist "native\clap-temp" rmdir /S /Q "native\clap-temp"
  git clone --depth 1 https://github.com/free-audio/clap.git "native\clap-temp"
  if errorlevel 1 (
    echo [ERROR] Could not clone CLAP headers.
    pause
    exit /b 1
  )
  if not exist "native\clap" mkdir "native\clap"
  xcopy /E /I /Y "native\clap-temp\include" "native\clap\include" >nul
  copy /Y "native\clap-temp\LICENSE" "native\clap\LICENSE" >nul
  rmdir /S /Q "native\clap-temp"
)

set "GXX="
where g++ >nul 2>nul
if not errorlevel 1 set "GXX=g++"
if not defined GXX if exist "F:\mingw64\bin\g++.exe" set "GXX=F:\mingw64\bin\g++.exe"

if defined GXX (
  echo [BUILD] MinGW: %GXX%
  "%GXX%" -std=c++17 -O2 -shared -static-libgcc -static-libstdc++ -D_WIN32_WINNT=0x0601 -I "native\clap\include" "native\tonic-analyzer\tonic-analyzer.cpp" -o "native\tonic-analyzer\TONIC-Analyzer.clap" -lws2_32
  if errorlevel 1 goto failed
  goto done
)

set "VSWHERE=%ProgramFiles(x86)%\Microsoft Visual Studio\Installer\vswhere.exe"
if not exist "%VSWHERE%" (
  echo [ERROR] No MinGW g++ or Visual Studio Installer found.
  pause
  exit /b 1
)
for /f "usebackq tokens=*" %%i in (`"%VSWHERE%" -latest -products * -requires Microsoft.VisualStudio.Component.VC.Tools.x86.x64 -property installationPath`) do set "VSPATH=%%i"
if not defined VSPATH (
  echo [ERROR] Visual Studio C++ toolchain not found.
  pause
  exit /b 1
)
call "%VSPATH%\VC\Auxiliary\Build\vcvars64.bat" >nul
if errorlevel 1 goto failed
echo [BUILD] MSVC: cl
cl /nologo /LD /std:c++17 /EHsc /O2 /D_WIN32_WINNT=0x0601 /I "native\clap\include" "native\tonic-analyzer\tonic-analyzer.cpp" ws2_32.lib /link /OUT:"native\tonic-analyzer\TONIC-Analyzer.clap"
if errorlevel 1 goto failed

:done
echo.
echo [OK] native\tonic-analyzer\TONIC-Analyzer.clap
echo      Run native\tonic-analyzer\install.bat as administrator.
pause
exit /b 0

:failed
echo [ERROR] Build failed.
pause
exit /b 1
