#!/bin/bash

echo "=========================================="
echo "  ⚡ MAE - Make Anything Editor"
echo "=========================================="
echo

if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python3 not found!"
    echo "Install Python 3.10+ and try again."
    exit 1
fi

echo "[OK] Python3 found"
echo "Starting MAE server on http://localhost:8000 ..."
echo

python3 -m uvicorn app.main:app --host localhost --port 8000 --reload &
SERVER_PID=$!

sleep 3

echo "=========================================="
echo "  🌐 Open: http://localhost:8000"
echo "  📚 Docs: http://localhost:8000/docs"
echo "=========================================="
echo

if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:8000
elif command -v open &> /dev/null; then
    open http://localhost:8000
fi

echo "Server running (PID: $SERVER_PID). Press Ctrl+C to STOP."
echo

cleanup() {
    echo
    echo "Stopping server..."
    kill $SERVER_PID 2> /dev/null
    wait $SERVER_PID 2> /dev/null
    echo "Server stopped."
}

trap cleanup SIGINT SIGTERM

wait $SERVER_PID
