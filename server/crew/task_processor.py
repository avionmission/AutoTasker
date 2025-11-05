from agents.task_agents import task_categorizer, summary_generator
from crewai import Task, Crew
import json

def categorize_single_task(task_text, existing_tasks=None):
    """Categorize a single task with context of existing categories"""
    if existing_tasks is None:
        existing_tasks = []
    
    # Get existing categories to encourage reuse
    existing_categories = list(set([task.get("category", "") for task in existing_tasks if task.get("category") and task.get("category") != "Processing..."]))
    
    try:
        # Build context about existing categories
        category_context = ""
        if existing_categories:
            category_context = f"\nEXISTING CATEGORIES (try to reuse these when appropriate): {', '.join(existing_categories)}"
        
        categorize_task = Task(
            description=f"""Categorize this task: "{task_text}"
{category_context}

CATEGORIZATION RULES:
1. Use broad, general categories that can group similar tasks together
2. Prefer reusing existing categories when the task fits
3. Common categories: Personal, Work, Health, Household, Shopping, Learning, Entertainment, Finance, Travel
4. For work tasks: Development, Testing, Documentation, Meeting, Planning, Bug Fix, Feature, Research
5. For personal tasks: Personal, Household, Health, Shopping, Entertainment, Learning
6. Avoid overly specific categories - group similar tasks together

Assign:
- category: Choose from existing categories if appropriate, or use a broad general category
- priority: high (urgent/important), medium (normal), low (can wait)
- owner: "unassigned" or suggest a role if work-related

Return ONLY a valid JSON object with this exact format:
{{"task": "{task_text}", "category": "category name", "priority": "priority level", "owner": "owner name"}}""",
            agent=task_categorizer,
            expected_output="Valid JSON object with categorized task"
        )
        
        categorize_crew = Crew(
            agents=[task_categorizer],
            tasks=[categorize_task],
            verbose=False
        )
        
        result = categorize_crew.kickoff()
        result_str = str(result)
        
        # Try to extract JSON from the result
        if '{' in result_str and '}' in result_str:
            json_start = result_str.find('{')
            json_end = result_str.rfind('}') + 1
            json_str = result_str[json_start:json_end]
            categorized_task = json.loads(json_str)
            
            # Post-process to ensure consistent categorization
            category = categorized_task.get("category", "General")
            
            # Apply some consistency rules
            if any(word in task_text.lower() for word in ["clean", "wash", "organize", "tidy"]):
                if any(word in task_text.lower() for word in ["room", "house", "home", "kitchen", "bathroom"]):
                    category = "Household"
                elif any(word in task_text.lower() for word in ["shoe", "clothes", "personal"]):
                    category = "Personal"
            elif any(word in task_text.lower() for word in ["walk", "exercise", "run", "gym", "health"]):
                category = "Health"
            elif any(word in task_text.lower() for word in ["buy", "shop", "purchase", "get"]):
                category = "Shopping"
            elif any(word in task_text.lower() for word in ["code", "develop", "program", "debug", "test"]):
                category = "Development"
            elif any(word in task_text.lower() for word in ["meeting", "call", "discuss"]):
                category = "Meeting"
            
            categorized_task["category"] = category
            return categorized_task
        else:
            raise json.JSONDecodeError("No JSON found", "", 0)
            
    except Exception as e:
        print(f"Single task categorization failed: {e}")
        # Fallback categorization with smart defaults
        category = "General"
        if any(word in task_text.lower() for word in ["clean", "wash", "organize", "tidy"]):
            category = "Household" if any(word in task_text.lower() for word in ["room", "house", "home"]) else "Personal"
        elif any(word in task_text.lower() for word in ["walk", "exercise", "health", "doctor"]):
            category = "Health"
        elif any(word in task_text.lower() for word in ["buy", "shop", "purchase"]):
            category = "Shopping"
        elif any(word in task_text.lower() for word in ["code", "develop", "program", "work"]):
            category = "Work"
            
        return {
            "task": task_text,
            "category": category,
            "priority": "medium",
            "owner": "unassigned",
            "completed": False
        }

def process_tasks(tasks):
    if not tasks:
        return {"categorized_tasks": [], "daily_summary": "No tasks to summarize."}
    
    # tasks is list like [{ "task": "Write unit tests" }, ...]
    task_texts = [t["task"] for t in tasks]
    task_list_str = "\n".join([f"- {task}" for task in task_texts])
    
    # Create categorization task
    categorize_task = Task(
        description=f"""Categorize these tasks into logical groups:
{task_list_str}

For each task, assign:
- category (e.g., "Development", "Testing", "Documentation", "Bug Fix", "Feature")  
- priority (high, medium, low)
- owner (can be "unassigned" or suggest a role like "developer", "tester")

Return ONLY a valid JSON array with this exact format:
[{{"task": "task name", "category": "category name", "priority": "priority level", "owner": "owner name"}}]""",
        agent=task_categorizer,
        expected_output="Valid JSON array with categorized tasks"
    )
    
    # Create crew and execute categorization
    categorize_crew = Crew(
        agents=[task_categorizer],
        tasks=[categorize_task],
        verbose=False
    )
    
    try:
        categorized_result = categorize_crew.kickoff()
        # Try to extract JSON from the result
        result_str = str(categorized_result)
        if '[' in result_str and ']' in result_str:
            json_start = result_str.find('[')
            json_end = result_str.rfind(']') + 1
            json_str = result_str[json_start:json_end]
            categorized_tasks = json.loads(json_str)
        else:
            raise json.JSONDecodeError("No JSON found", "", 0)
    except (json.JSONDecodeError, Exception) as e:
        print(f"Categorization failed: {e}")
        # Fallback categorization
        categorized_tasks = []
        for task in tasks:
            categorized_tasks.append({
                "task": task["task"], 
                "priority": "medium", 
                "category": "General", 
                "owner": "unassigned"
            })
    
    # Create summary task
    summary_task = Task(
        description=f"""Write a brief daily summary based on these tasks:
{categorized_tasks}

Create a short paragraph (2-3 sentences) summarizing the work planned for today, mentioning key categories and priorities.""",
        agent=summary_generator,
        expected_output="A concise daily summary paragraph"
    )
    
    # Create crew and execute summary generation
    summary_crew = Crew(
        agents=[summary_generator],
        tasks=[summary_task],
        verbose=False
    )
    
    try:
        summary_text = str(summary_crew.kickoff())
    except Exception as e:
        print(f"Summary generation failed: {e}")
        summary_text = f"Daily summary: {len(tasks)} tasks planned across various categories."

    return {
        "categorized_tasks": categorized_tasks,
        "daily_summary": summary_text
    }
