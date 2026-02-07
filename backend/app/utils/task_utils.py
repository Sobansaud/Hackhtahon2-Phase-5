from datetime import datetime
from typing import Dict, Any
from app.models.task import Task

def get_priority_color(priority: str) -> str:
    """
    Maps priority level to color for UI display
    """
    priority_colors = {
        "High": "red",
        "Medium": "yellow",
        "Low": "green"
    }
    return priority_colors.get(priority, "gray")

def is_task_overdue(task: Task) -> bool:
    """
    Determines if a task is overdue based on due_date and completion status
    """
    if not task.due_date or task.completed:
        return False

    try:
        due_date = datetime.strptime(task.due_date, "%Y-%m-%d").date()
        today = datetime.now().date()
        return due_date < today
    except ValueError:
        # If due date is invalid, it's not overdue
        return False

def enrich_task_response(task: Task) -> Dict[str, Any]:
    """
    Adds computed properties to task for API response
    """
    task_dict = task.dict()
    task_dict['is_overdue'] = is_task_overdue(task)
    return task_dict