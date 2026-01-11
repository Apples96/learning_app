.PHONY: help install setup run start stop backend frontend clean

# Default target
help:
	@echo "Learning App - Available Commands:"
	@echo ""
	@echo "  make install    - Install all dependencies (backend + frontend)"
	@echo "  make setup      - First-time setup (install + create .env if needed)"
	@echo "  make run        - Start both backend and frontend"
	@echo "  make start      - Alias for 'make run'"
	@echo "  make backend    - Start only the backend server"
	@echo "  make frontend   - Start only the frontend server"
	@echo "  make stop       - Stop all running servers"
	@echo "  make clean      - Clean up generated files and caches"
	@echo ""

# Install all dependencies
install:
	@echo "📦 Installing backend dependencies..."
	cd backend && python -m venv venv 2>/dev/null || true
	cd backend && . venv/bin/activate && pip install -r requirements.txt
	@echo "📦 Installing frontend dependencies..."
	cd frontend && npm install
	@echo "✅ All dependencies installed!"

# First-time setup
setup: install
	@echo "🔧 Setting up environment..."
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "⚠️  Created .env file - Please add your ANTHROPIC_API_KEY"; \
		echo "⚠️  Edit .env and add: ANTHROPIC_API_KEY=sk-ant-your-key-here"; \
	else \
		echo "✅ .env file already exists"; \
	fi
	@echo ""
	@echo "🎉 Setup complete!"
	@echo ""
	@echo "Next steps:"
	@echo "1. Add your Anthropic API key to .env file"
	@echo "2. Run 'make run' to start the app"

# Start both backend and frontend
run: start

start:
	@echo "🚀 Starting Learning App..."
	@if [ ! -f .env ]; then \
		echo "❌ No .env file found. Run 'make setup' first."; \
		exit 1; \
	fi
	@chmod +x start.sh
	@./start.sh

# Start only backend
backend:
	@echo "🐍 Starting backend server..."
	@if [ ! -f .env ]; then \
		echo "❌ No .env file found. Run 'make setup' first."; \
		exit 1; \
	fi
	cd backend && . venv/bin/activate && python app.py

# Start only frontend
frontend:
	@echo "⚛️  Starting frontend server..."
	cd frontend && npm run dev

# Stop all servers
stop:
	@echo "🛑 Stopping all servers..."
	@chmod +x stop.sh
	@./stop.sh
	@echo "✅ All servers stopped"

# Clean up
clean:
	@echo "🧹 Cleaning up..."
	rm -rf backend/__pycache__
	rm -rf backend/models/__pycache__
	rm -rf backend/routes/__pycache__
	rm -rf backend/services/__pycache__
	rm -f backend/*.db
	rm -rf frontend/node_modules
	rm -rf frontend/dist
	rm -rf backend/venv
	@echo "✅ Cleanup complete!"
