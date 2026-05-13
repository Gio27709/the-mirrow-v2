# dev.ps1 - The Mirrow 2 - Single-Command Dev Server Launcher
# Usage: .\dev.ps1
# Stops: Ctrl+C kills both servers automatically

# -- Paths --
$ROOT         = $PSScriptRoot
$BACKEND_DIR  = Join-Path $ROOT "backend"
$FRONTEND_DIR = Join-Path $ROOT "frontend"
$UVICORN_EXE  = Join-Path $BACKEND_DIR "venv\Scripts\uvicorn.exe"

# -- Validations --
if (-not (Test-Path $UVICORN_EXE)) {
    Write-Host ''
    Write-Host '  [ERROR] uvicorn.exe not found.' -ForegroundColor Red
    Write-Host ('          Path: ' + $UVICORN_EXE) -ForegroundColor Red
    Write-Host '  Fix: cd backend && .\venv\Scripts\pip.exe install -r requirements.txt' -ForegroundColor Yellow
    Write-Host ''
    exit 1
}

if (-not (Test-Path (Join-Path $FRONTEND_DIR "node_modules"))) {
    Write-Host ''
    Write-Host '  [ERROR] Frontend dependencies not installed.' -ForegroundColor Red
    Write-Host '  Fix: cd frontend && npm install' -ForegroundColor Yellow
    Write-Host ''
    exit 1
}

# -- Banner --
Write-Host ''
Write-Host '  =================================================' -ForegroundColor DarkCyan
Write-Host '        The Mirrow 2  -  Dev Environment            ' -ForegroundColor Cyan
Write-Host '  =================================================' -ForegroundColor DarkCyan
Write-Host ''

# -- Launch Backend as background process --
Write-Host '  [BACKEND]  Starting FastAPI + Uvicorn...' -ForegroundColor Green

$backendProcess = Start-Process `
    -FilePath $UVICORN_EXE `
    -ArgumentList "app.main:app","--reload","--host","127.0.0.1","--port","8000" `
    -WorkingDirectory $BACKEND_DIR `
    -NoNewWindow `
    -PassThru

Start-Sleep -Seconds 2

if ($backendProcess.HasExited) {
    $code = $backendProcess.ExitCode
    Write-Host ('  [BACKEND]  FAILED to start. Exit code: ' + $code) -ForegroundColor Red
    Write-Host '             Check your backend/.env and database connection.' -ForegroundColor Yellow
    return
}

$pid1 = $backendProcess.Id
Write-Host ('  [BACKEND]  Running -> http://localhost:8000  PID: ' + $pid1) -ForegroundColor Green
Write-Host ''

# -- Launch Frontend in foreground --
try {
    Write-Host '  [FRONTEND] Starting Next.js...' -ForegroundColor Yellow
    Write-Host '  [FRONTEND] Running -> http://localhost:3000' -ForegroundColor Yellow
    Write-Host ''
    Write-Host '  Press Ctrl+C to stop all servers.' -ForegroundColor DarkGray
    Write-Host '  -------------------------------------------------' -ForegroundColor DarkGray
    Write-Host ''

    # Run npm from within the frontend directory using --prefix
    & npm run dev --prefix $FRONTEND_DIR
}
finally {
    Write-Host ''
    Write-Host '  -------------------------------------------------' -ForegroundColor DarkGray
    Write-Host '  Shutting down...' -ForegroundColor Red

    if ($backendProcess -and -not $backendProcess.HasExited) {
        Stop-Process -Id $backendProcess.Id -Force -ErrorAction SilentlyContinue
        Write-Host ('  [BACKEND]  Stopped. PID: ' + $backendProcess.Id) -ForegroundColor Red
    }

    Write-Host '  [DONE]     All servers stopped cleanly.' -ForegroundColor Cyan
    Write-Host ''
}
