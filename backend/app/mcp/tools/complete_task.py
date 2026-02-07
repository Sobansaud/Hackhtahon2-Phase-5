from typing import Dict, Any
from sqlmodel import Session, select
from uuid import UUID


async def complete_task(user_id: str, task_id: int, db = None) -> Dict[str, Any]:
    """
    MCP tool to mark a task as completed.

    Args:
        user_id: The ID of the user who owns the task
        task_id: The ID of the task to complete
        db: Async database session (passed by the caller)

    Returns:
        Dict containing the updated task information
    """
    from app.models.task import Task
    from sqlmodel import select

    try:
        # Find the specific task for this user (enforce isolation)
        query = select(Task).where(Task.id == task_id, Task.user_id == user_id)
        result = await db.execute(query)
        task = result.scalar_one_or_none()

        if not task:
            raise ValueError(f"Task with ID {task_id} not found for user {user_id}")

        # Update task status to completed
        task.status = "completed"
        task.completed = True
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