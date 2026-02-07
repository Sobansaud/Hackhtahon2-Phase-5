from typing import Dict, Any
from sqlmodel import Session
from uuid import UUID


async def add_task(user_id: str, title: str, description: str = None, status: str = "pending", db = None) -> Dict[str, Any]:
    """
    MCP tool to add a new task for the user.

    Args:
        user_id: The ID of the user creating the task
        title: The title of the task
        description: Optional description of the task
        status: Status of the task (default: "pending")
        db: Async database session (passed by the caller)

    Returns:
        Dict containing the created task information
    """
    from app.models.task import Task
    from sqlmodel import select

    # Create new task with user_id for isolation
    task = Task(
        title=title,
        description=description,
        status=status,
        completed=(status.lower() == "completed"),
        user_id=user_id  # Ensure user isolation
    )

    try:
        # Add task to database
        db.add(task)
        await db.commit()
        await db.refresh(task)

        return {
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "status": task.status,
            "user_id": task.user_id,
            "created_at": task.created_at.isoformat() if task.created_at else None,
            "updated_at": task.updated_at.isoformat() if task.updated_at else None
        }
    except Exception as e:
        await db.rollback()
        raise e