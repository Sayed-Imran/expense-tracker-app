#!/bin/bash

# Build script for local production testing

echo "🏗️  Building Expense Tracker Application..."

# Build frontend
echo ""
echo "📦 Building frontend..."
cd frontend
npm install
npm run build
cd ..

if [ ! -d "frontend/dist" ]; then
    echo "❌ Frontend build failed!"
    exit 1
fi

echo "✅ Frontend built successfully!"

# Check backend dependencies
echo ""
echo "📦 Checking backend dependencies..."
cd backend
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
pip install -q -r requirements.txt
cd ..

echo "✅ Backend dependencies installed!"

echo ""
echo "🎉 Build complete!"
echo ""
echo "To run the application:"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  uvicorn app.main:app --host 0.0.0.0 --port 8000"
echo ""
echo "Or use Docker:"
echo "  docker-compose up"
echo ""
echo "Then visit: http://localhost:8000"
