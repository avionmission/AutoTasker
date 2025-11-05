# Auto Tasker

An intelligent task management system that combines conversational AI with automated project organization. Auto Tasker uses CrewAI to intelligently categorize and manage your development tasks through a modern web interface.

## Core Features

### 💬 Chat UI
Add or query tasks conversationally with natural language processing. Simply type commands like "Add 'Fix login bug' to backend tasks" and let the AI handle the rest.

### 🗂️ Kanban Board
Visual task management with automatic categorization powered by CrewAI. Tasks are intelligently sorted into relevant categories such as:
- Backend
- Frontend  
- Documentation
- Testing
- DevOps

### 🧠 Daily Summary Modal
Get AI-generated summaries of your project progress. Track what's been accomplished, identify bottlenecks, and plan next steps with intelligent insights.

### ⚙️ FastAPI Backend
Robust API backend built with FastAPI that handles:
- Task processing and CRUD operations
- CrewAI orchestration and integration
- Real-time updates and notifications
- Data persistence and retrieval

### 🐳 Dockerized Deployment
Fully containerized application for seamless deployment across environments. Easy setup and portability with Docker containers.

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Python 3.8+ (for local development)

### Quick Start with Docker
```bash
# Clone the repository
git clone <repository-url>
cd auto-tasker

# Start the application
docker-compose up -d

# Access the application
open http://localhost:3000
```

### Local Development
```bash
# Install dependencies
pip install -r requirements.txt

# Start the FastAPI backend
uvicorn main:app --reload

# Start the frontend (in separate terminal)
npm install
npm run dev
```

## Usage

1. **Adding Tasks**: Use the chat interface to add tasks naturally
   - "Create a task to implement user authentication"
   - "Add debugging the payment flow to frontend tasks"

2. **Managing Tasks**: Drag and drop tasks between categories on the Kanban board

3. **Daily Reviews**: Check the daily summary modal for AI-generated progress reports

## Architecture

- **Frontend**: Modern web interface with real-time updates
- **Backend**: FastAPI with CrewAI integration
- **AI Engine**: CrewAI for intelligent task categorization and insights
- **Deployment**: Docker containers for consistent environments

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

[Add your license information here]