from fastapi import APIRouter, Depends
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from ...db import get_async_session
from ...models.task import Task
import logging
from datetime import datetime

router = APIRouter()
logger = logging.getLogger("uvicorn")

@router.post("/reminders/check-tasks")
async def check_tasks_reminder(session: AsyncSession = Depends(get_async_session)):
    """
    Called by Dapr Cron Binding every minute to check for upcoming/overdue tasks.
    """
    logger.info("Dapr Cron Trigger: Checking for task reminders...")
    
    # Simple logic: Find pending tasks that were created more than a day ago or are just pending
    # In a real app, you'd check a 'due_date'
    statement = select(Task).where(Task.completed == False)
    results = await session.execute(statement)
    tasks = results.scalars().all()
    
    count = len(tasks)
    logger.info(f"Cron Reminder: You have {count} pending tasks.")
    
    return {"status": "success", "tasks_count": count}
