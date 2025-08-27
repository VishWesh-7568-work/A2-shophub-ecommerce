#!/bin/bash

echo "🚀 Starting ShopHub Backend Server..."

# Check if config.env exists
if [ ! -f "config.env" ]; then
    echo "⚠️  config.env not found. Creating from template..."
    cp config.env config.env.backup 2>/dev/null || echo "# Backend Configuration" > config.env
    echo "📝 Please edit config.env with your database credentials"
    echo "🔧 Example config.env contents:"
    echo "DB_HOST=localhost"
    echo "DB_USER=root"
    echo "DB_PASSWORD=your_password"
    echo "DB_NAME=shophub_db"
    echo "JWT_SECRET=your_secret_key"
    echo "PORT=5000"
    echo ""
    echo "Press Enter to continue with default settings..."
    read
fi

# Check if MySQL is running
echo "🔍 Checking MySQL connection..."
if ! mysqladmin ping -h localhost -u root --silent 2>/dev/null; then
    echo "❌ MySQL is not running or not accessible"
    echo "💡 Please start MySQL service and ensure root access"
    exit 1
fi

echo "✅ MySQL connection successful"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the server
echo "🌟 Starting server on port 5000..."
echo "📱 API will be available at: http://localhost:5000/api"
echo "🔗 Health check: http://localhost:5000/api/health"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start
