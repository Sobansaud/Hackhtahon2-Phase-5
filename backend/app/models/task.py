from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from sqlalchemy import Column, JSON
from .base import TimestampMixin

class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = None
    status: str = Field(default="pending", index=True)
    completed: bool = Field(default=False, index=True)

class Task(TimestampMixin, TaskBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True, foreign_key="user.id")

    # New fields for intermediate/advanced features
    priority: str = Field(default="Medium", description="Priority level: High/Medium/Low")
    tags: List[str] = Field(default=[], sa_column=Column(JSON))  # JSONB for tags array
    due_date: Optional[str] = Field(default=None, description="Due date in YYYY-MM-DD format")
    recurrence: Optional[str] = Field(default=None, description="Recurrence pattern: daily/weekly/monthly/none")

class TaskCreate(TaskBase):
    priority: Optional[str] = "Medium"
    tags: List[str] = []
    due_date: Optional[str] = None
    recurrence: Optional[str] = None

class TaskUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    completed: Optional[bool] = None
    priority: Optional[str] = None
    tags: Optional[List[str]] = None
    due_date: Optional[str] = None
    recurrence: Optional[str] = None
