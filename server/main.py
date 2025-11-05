from fastapi import FastAPI
from pydantic import BaseModel
from crew.task_processor import process_tasks, categorize_single_task
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
tasks_db = []

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

class TaskInput(BaseModel):
    text: str

@app.post("/add_task")
def add_task(data: TaskInput):
    # Add task immediately with temporary category
    temp_task = {
        "task": data.text,
        "category": "Processing...",
        "priority": "medium",
        "owner": "unassigned"
    }
    tasks_db.append(temp_task)
    
    # Start background categorization
    import threading
    def categorize_in_background():
        try:
            # Pass existing tasks for context
            existing_tasks = [task for task in tasks_db if task["category"] != "Processing..."]
            categorized_task = categorize_single_task(data.text, existing_tasks)
            # Find and update the task in the database
            for i, task in enumerate(tasks_db):
                if task["task"] == data.text and task["category"] == "Processing...":
                    tasks_db[i] = categorized_task
                    break
        except Exception as e:
            print(f"Background categorization failed: {e}")
            # Update with fallback category
            for i, task in enumerate(tasks_db):
                if task["task"] == data.text and task["category"] == "Processing...":
                    tasks_db[i] = {
                        "task": data.text,
                        "category": "General",
                        "priority": "medium",
                        "owner": "unassigned"
                    }
                    break
    
    thread = threading.Thread(target=categorize_in_background)
    thread.daemon = True
    thread.start()
    
    return {"message": "Task added", "tasks": tasks_db}

@app.get("/tasks")
def get_tasks():
    return {"tasks": tasks_db}

@app.get("/tasks/refresh")
def refresh_tasks():
    """Endpoint to get fresh task data - useful for polling updates"""
    return {"tasks": tasks_db}

@app.post("/summary")
def generate_summary():
    result = process_tasks(tasks_db)
    return {"summary": result["daily_summary"]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
