# 🧠 AutoTasker

For people with long, unmanageable todo lists. AI-powered task management with intelligent categorization and modern UI.

## Features

- **Conversational Input**: Add tasks using natural language
- **Smart Kanban Board**: Drag & drop with AI categorization
- **Dark/Light Mode**: Persistent theme switching
- **AI Summaries**: Daily progress reports
- **Auto-cleanup**: Empty categories removed automatically

## Quick Start

```bash
# Docker (recommended)
docker-compose up -d
open http://localhost:3000

# Local development
pip install -r server/requirements.txt
uvicorn main:app --reload  # Backend
npm install && npm run dev  # Frontend (separate terminal)
```

**Setup**: Add `GEMINI_API_KEY=your_key` to `server/.env`

## Usage

1. **Add tasks**: Type naturally - "Fix login bug" or "Walk the dog"
2. **Manage**: Drag tasks between categories, mark complete, or delete
3. **Themes**: Toggle dark/light mode with the theme button
4. **Summaries**: Generate AI progress reports

**Categories**: Development, Testing, Personal, Health, Household, Shopping, etc.

## Tech Stack

- **Frontend**: React 18, CSS custom properties
- **Backend**: FastAPI, CrewAI
- **AI**: Google Gemini for categorization and summaries
- **Deployment**: Docker

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request