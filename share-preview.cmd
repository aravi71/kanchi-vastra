@echo off
REM ---------------------------------------------------------------------------
REM  Sri Kanchi Silks - share a temporary public preview link
REM ---------------------------------------------------------------------------
REM  Builds the site, serves it, and opens a free Cloudflare quick tunnel so
REM  anyone can view it in a browser.
REM
REM  IMPORTANT: this only works while this PC is on and this window stays open.
REM  The URL is different every time. For permanent hosting, deploy to Vercel -
REM  see the "Deployment" section of README.md.
REM
REM  Requires: Node.js, and cloudflared.exe (already at %USERPROFILE%\tools\).
REM ---------------------------------------------------------------------------

setlocal

REM Prefer a system Node install; fall back to the portable copy in tools\.
where node >nul 2>&1
if errorlevel 1 set "PATH=%USERPROFILE%\tools\node;%PATH%"

where node >nul 2>&1
if errorlevel 1 (
  echo [!] Node.js not found. Install it from https://nodejs.org/ and re-run.
  pause
  exit /b 1
)

set "CFD=%USERPROFILE%\tools\cloudflared.exe"
if not exist "%CFD%" (
  echo [!] cloudflared.exe not found at "%CFD%".
  echo     Download it from:
  echo     https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe
  echo     and save it to that path.
  pause
  exit /b 1
)

cd /d "%~dp0"

echo.
echo === Installing dependencies (skipped if already present) ===
call npm install --no-fund --no-audit || goto :fail

echo.
echo === Building ===
call npm run build || goto :fail

echo.
echo === Starting the site on http://localhost:3000 ===
start "sri-kanchi-silks server" /min cmd /c "npm run start"

echo Waiting for the server to come up...
timeout /t 8 /nobreak >nul

echo.
echo ============================================================
echo  Opening the public link. Look for the https://....trycloudflare.com
echo  address below and share that.
echo  Press Ctrl+C in this window to take the preview offline.
echo ============================================================
echo.
"%CFD%" tunnel --url http://localhost:3000 --no-autoupdate --edge-ip-version 4 --protocol http2

goto :eof

:fail
echo.
echo [!] Something failed above. Fix the error and re-run.
pause
exit /b 1
