from fastapi import APIRouter
from pydantic import BaseModel
from dapr.ext.fastapi import DaprApp
import logging

router = APIRouter()
logger = logging.getLogger("uvicorn")

class TaskEvent(BaseModel):
    id: int
    title: str
    status: str

@router.post("/events/task_created")
async def task_created_subscriber(event: TaskEvent):
    """
    Dapr Subscriber for task.created topic.
    """
    logger.info(f"Received Cloud Event: Task Created - ID: {event.id}, Title: {event.title}")
    return {"status": "success", "message": f"Processed task {event.id}"}
