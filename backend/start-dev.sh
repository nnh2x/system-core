# #!/bin/bash

# # IAM License System - Development Start Script

# echo "🚀 Starting IAM & License Management System..."
# echo ""

# # Check if backend is ready
# if [ ! -d "node_modules" ]; then
#   echo "📦 Installing backend dependencies..."
#   npm install
# fi

# # Check if frontend is ready
# if [ ! -d "frontend/node_modules" ]; then
#   echo "📦 Installing frontend dependencies..."
#   cd frontend && npm install && cd ..
# fi

# echo ""
# echo "✅ Starting services..."
# echo "   Backend:  http://localhost:3000"
# echo "   Frontend: http://localhost:3001"
# echo "   Swagger:  http://localhost:3000/api"
# echo ""

# # Start backend and frontend concurrently
# npm run start:dev &
# BACKEND_PID=$!

# cd frontend && npm run dev &
# FRONTEND_PID=$!

# # Handle Ctrl+C
# trap "echo 'Stopping services...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT

# # Wait for both processes
# wait
