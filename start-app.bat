@echo off
echo Starting Gowings Backend...
start cmd /k "cd backend && npm run dev"

echo Starting Gowings Frontend...
start cmd /k "cd frontend && npm run dev"

echo Both servers are starting up in separate windows!
echo Backend will be at http://localhost:5000
echo Frontend will be at http://localhost:3000
