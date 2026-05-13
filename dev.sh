#!/bin/bash
# dev.sh - The Mirrow 2 - Single-Command Dev Server Launcher (Bash)
# Usage: bash dev.sh
# Stops: Ctrl+C kills both servers automatically

# -- Resolve paths relative to this script --
ROOT="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$ROOT/backend"
FRONTEND_DIR="$ROOT/frontend"
UVICORN_EXE="$BACKEND_DIR/venv/Scripts/uvicorn.exe"

# -- Validations --
if [ ! -f "$UVICORN_EXE" ]; then
    echo ""
    echo "  [ERROR] uvicorn.exe not found."
    echo "          Path: $UVICORN_EXE"
    echo "  Fix: cd backend && ./venv/Scripts/pip.exe install -r requirements.txt"
    echo ""
    exit 1
fi

if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    echo ""
    echo "  [ERROR] Frontend dependencies not installed."
    echo "  Fix: cd frontend && npm install"
    echo ""
    exit 1
fi

# -- Cleanup function (runs on Ctrl+C or exit) --
BACKEND_PID=""

cleanup() {
    echo ""
    echo "  -------------------------------------------------"
    echo "  Shutting down..."
    if [ -n "$BACKEND_PID" ] && kill -0 "$BACKEND_PID" 2>/dev/null; then
        kill "$BACKEND_PID" 2>/dev/null
        wait "$BACKEND_PID" 2>/dev/null
        echo "  [BACKEND]  Stopped. PID: $BACKEND_PID"
    fi
    echo "  [DONE]     All servers stopped cleanly."
    echo ""
    exit 0
}

# Register cleanup BEFORE launching anything
trap cleanup SIGINT SIGTERM EXIT

# -- Banner --
echo ""
echo "  ================================================="
echo "        The Mirrow 2  -  Dev Environment            "
echo "  ================================================="
echo ""

# -- Launch Backend in background --
echo "  [BACKEND]  Starting FastAPI + Uvicorn..."

cd "$BACKEND_DIR"
"$UVICORN_EXE" app.main:app --reload --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!
cd "$ROOT"

sleep 2

if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
    echo "  [BACKEND]  FAILED to start."
    echo "             Check your backend/.env and database connection."
    exit 1
fi

echo "  [BACKEND]  Running -> http://localhost:8000  PID: $BACKEND_PID"
echo ""

# -- Launch Frontend in foreground --
echo "  [FRONTEND] Starting Next.js..."
echo "  [FRONTEND] Running -> http://localhost:3000"
echo ""
echo "  Press Ctrl+C to stop all servers."
echo "  -------------------------------------------------"
echo ""

cd "$FRONTEND_DIR"
npm run dev
