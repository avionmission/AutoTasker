import google.generativeai as genai
from crewai import Agent
from dotenv import load_dotenv
import os

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

task_categorizer = Agent(
    role="Task Categorizer",
    goal="Categorize tasks into broad, consistent categories that group similar activities together.",
    backstory="You are an expert organizer who believes in keeping things simple and consistent. You group similar tasks together using broad categories rather than creating many specific ones. You always try to reuse existing categories when tasks are similar.",
    llm="gemini/gemini-2.5-flash",
)
summary_generator = Agent(
    role="Summary Writer",
    goal="Write concise daily summaries based on tasks.",
    backstory="You are an AI analyst writing short summaries for daily project progress.",
    llm="gemini/gemini-2.5-flash",
)
