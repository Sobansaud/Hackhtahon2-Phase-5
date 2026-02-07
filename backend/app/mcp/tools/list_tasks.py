from typing import Dict, Any, List
from sqlmodel import Session, select
from uuid import UUID


async def list_tasks(user_id: str, status: str = None, search: str = None, db = None) -> List[Dict[str, Any]]:
    """
    MCP tool to list tasks for the user with optional filtering and search.

    Args:
        user_id: The ID of the user whose tasks to list
        status: Optional status filter ("pending", "completed", "all")
        search: Optional search term to filter by title or description
        db: Async database session (passed by the caller)
    """
    from app.models.task import Task
    from sqlmodel import select, or_

    try:
        # Build query with user isolation
        query = select(Task).where(Task.user_id == user_id)

        # Apply status filter if provided and not "all"
        if status and status.lower() != "all":
            query = query.where(Task.status == status)
            
        # Apply search if provided
        if search:
            search_term = f"%{search}%"
            query = query.where(or_(
                Task.title.ilike(search_term),
                Task.description.ilike(search_term)
            ))

        # Execute query
        result = await db.execute(query)
        tasks = result.scalars().all()

        # Convert to dictionaries
        task_list = []
        for task in tasks:
            task_list.append({
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "status": task.status,
                "user_id": task.user_id,
                "created_at": task.created_at.isoformat() if task.created_at else None,
                "updated_at": task.updated_at.isoformat() if task.updated_at else None
            })

        return task_list
    except Exception as e:
        raise e