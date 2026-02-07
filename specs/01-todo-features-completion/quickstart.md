# Quickstart Guide: Intermediate & Advanced Features Implementation

**Date**: 2026-02-05
**Feature**: todo-features-completion
**Version**: v1.0

## Overview

This guide provides essential information for implementing the intermediate and advanced features in the Todo application. Follow this in conjunction with the implementation plan for successful feature completion.

## Prerequisites

- Node.js 18+ for frontend development
- Python 3.11+ for backend development
- PostgreSQL or Neon DB connection
- SQLModel and FastAPI dependencies installed
- Next.js development environment set up

## Database Setup

### 1. Alembic Migration for New Fields

Create a new migration file to add the required columns:

```bash
# In backend directory
alembic revision --autogenerate -m "Add priority, tags, due_date, recurrence to tasks"
alembic upgrade head
```

The migration should add:
- `priority` column (VARCHAR, default "Medium")
- `tags` column (JSONB, default [])
- `due_date` column (DATE, nullable)
- `recurrence` column (VARCHAR, nullable)

### 2. Updated Task Model

Update your SQLModel Task class to include the new fields:

```python
from sqlalchemy import Column, JSON
from sqlmodel import Field
from typing import List, Optional
import datetime

class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: Optional[str] = None
    is_completed: bool = False
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)

    # New fields for advanced features
    priority: str = Field(default="Medium", description="Priority level: High/Medium/Low")
    tags: List[str] = Field(default=[], sa_column=Column(JSON))  # JSONB for tags array
    due_date: Optional[str] = Field(default=None, description="Due date in YYYY-MM-DD format")
    recurrence: Optional[str] = Field(default=None, description="Recurrence pattern: daily/weekly/monthly/none")
```

## Backend API Implementation

### 1. Enhanced Task Schemas

Create Pydantic schemas for the new fields:

```python
from pydantic import BaseModel, validator
from typing import List, Optional
from datetime import datetime

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    priority: str = "Medium"
    tags: List[str] = []
    due_date: Optional[str] = None  # Format: YYYY-MM-DD
    recurrence: Optional[str] = None  # Values: daily, weekly, monthly, none

    @validator('priority')
    def validate_priority(cls, v):
        if v not in ["High", "Medium", "Low"]:
            raise ValueError('Priority must be High, Medium, or Low')
        return v

    @validator('due_date')
    def validate_date_format(cls, v):
        if v is None:
            return v
        try:
            datetime.strptime(v, '%Y-%m-%d')
            return v
        except ValueError:
            raise ValueError('Date must be in YYYY-MM-DD format')

    @validator('recurrence')
    def validate_recurrence(cls, v):
        if v is None:
            return v
        if v not in ["daily", "weekly", "monthly", "none"]:
            raise ValueError('Recurrence must be daily, weekly, monthly, or none')
        return v

class TaskCreate(TaskBase):
    pass

class TaskUpdate(TaskBase):
    title: Optional[str] = None
    is_completed: Optional[bool] = None
```

### 2. Enhanced GET Endpoint with Filters

```python
from fastapi import Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_

@app.get("/api/tasks")
async def get_tasks(
    db: Session = Depends(get_db),
    search: Optional[str] = Query(None, description="Keyword search in title/description"),
    filter_status: Optional[str] = Query("all", description="Filter by status: all, pending, completed"),
    filter_priority: Optional[str] = Query("all", description="Filter by priority: all, High, Medium, Low"),
    filter_tag: Optional[str] = Query(None, description="Filter by tag"),
    sort: Optional[str] = Query("created_at_desc", description="Sort order"),
    page: int = Query(1, ge=1),
    limit: int = Query(50, le=100)
):
    query = select(Task)

    # Apply search filter
    if search:
        query = query.where(
            or_(
                Task.title.contains(search),
                Task.description.contains(search) if Task.description else False
            )
        )

    # Apply status filter
    if filter_status == "pending":
        query = query.where(Task.is_completed == False)
    elif filter_status == "completed":
        query = query.where(Task.is_completed == True)

    # Apply priority filter
    if filter_priority != "all":
        query = query.where(Task.priority == filter_priority)

    # Apply tag filter
    if filter_tag:
        query = query.where(cast(Task.tags, String).contains(filter_tag))

    # Apply sorting
    if sort == "due_date_asc":
        query = query.order_by(Task.due_date.asc(), Task.created_at.desc())
    elif sort == "due_date_desc":
        query = query.order_by(Task.due_date.desc(), Task.created_at.desc())
    elif sort == "priority_asc":
        priority_order = case(
            [(Task.priority == "High", 1), (Task.priority == "Medium", 2), (Task.priority == "Low", 3)],
            else_=4
        )
        query = query.order_by(priority_order, Task.created_at.desc())
    # ... add other sort options

    # Apply pagination
    offset = (page - 1) * limit
    query = query.offset(offset).limit(limit)

    tasks = db.exec(query).all()

    # Add calculated fields like is_overdue
    for task in tasks:
        if task.due_date:
            due = datetime.strptime(task.due_date, '%Y-%m-%d').date()
            task.is_overdue = not task.is_completed and due < datetime.now().date()
        else:
            task.is_overdue = False

    return {"tasks": tasks, "total": len(tasks), "page": page, "has_more": len(tasks) == limit}
```

### 3. Recurring Task Logic

Implement the recurring task creation in the complete endpoint:

```python
from datetime import timedelta, datetime
from dateutil.relativedelta import relativedelta

def calculate_next_due_date(current_due_date: str, recurrence_pattern: str) -> str:
    """Calculate the next due date based on recurrence pattern"""
    current_date = datetime.strptime(current_due_date, '%Y-%m-%d').date()

    if recurrence_pattern == "daily":
        next_date = current_date + timedelta(days=1)
    elif recurrence_pattern == "weekly":
        next_date = current_date + timedelta(weeks=1)
    elif recurrence_pattern == "monthly":
        next_date = current_date + relativedelta(months=1)
    else:
        return current_due_date  # Should not happen if validated

    return next_date.strftime('%Y-%m-%d')

@app.patch("/api/tasks/{task_id}/complete")
async def complete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Mark current task as completed
    task.is_completed = True

    # If task has recurrence, create a new instance
    if task.recurrence and task.recurrence != "none":
        new_task = Task(
            title=task.title,
            description=task.description,
            priority=task.priority,
            tags=task.tags,
            due_date=calculate_next_due_date(task.due_date, task.recurrence) if task.due_date else None,
            recurrence=task.recurrence,
            is_completed=False
        )
        db.add(new_task)

    db.commit()
    db.refresh(task)
    return task
```

## Frontend Implementation

### 1. Updated Task Interface

```typescript
// types/task.ts
export interface Task {
  id: number;
  title: string;
  description?: string;
  is_completed: boolean;
  created_at: string; // ISO date string
  priority: 'High' | 'Medium' | 'Low';
  tags: string[];
  due_date?: string; // YYYY-MM-DD format
  recurrence?: 'daily' | 'weekly' | 'monthly' | 'none';
  is_overdue?: boolean;
}
```

### 2. API Client Updates

```typescript
// lib/api.ts
import { Task } from '../types/task';

interface GetTasksParams {
  search?: string;
  filter_status?: 'all' | 'pending' | 'completed';
  filter_priority?: 'all' | 'High' | 'Medium' | 'Low';
  filter_tag?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export const getTasks = async (params?: GetTasksParams): Promise<{ tasks: Task[], total: number, page: number, has_more: boolean }> => {
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.append('search', params.search);
  if (params?.filter_status) queryParams.append('filter_status', params.filter_status);
  if (params?.filter_priority) queryParams.append('filter_priority', params.filter_priority);
  if (params?.filter_tag) queryParams.append('filter_tag', params.filter_tag);
  if (params?.sort) queryParams.append('sort', params.sort);
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  const response = await fetch(`/api/tasks?${queryParams}`);
  return response.json();
};

export const createTask = async (taskData: Partial<Task>): Promise<Task> => {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData),
  });
  return response.json();
};
```

### 3. Enhanced Task Form Component

```tsx
// components/TaskForm.tsx
import { useState } from 'react';
import { Task } from '../types/task';

interface TaskFormProps {
  onSubmit: (task: Partial<Task>) => void;
  onCancel: () => void;
  initialData?: Partial<Task>;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    priority: 'Medium',
    tags: [],
    due_date: '',
    recurrence: 'none',
    ...initialData,
  });

  const [newTag, setNewTag] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), newTag.trim()]
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(tag => tag !== tagToRemove) || []
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium">Title *</label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium">Description</label>
        <textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="w-full px-3 py-2 border rounded-md"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="priority" className="block text-sm font-medium">Priority</label>
          <select
            id="priority"
            value={formData.priority}
            onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label htmlFor="recurrence" className="block text-sm font-medium">Recurrence</label>
          <select
            id="recurrence"
            value={formData.recurrence || 'none'}
            onChange={(e) => setFormData({...formData, recurrence: e.target.value as any})}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="none">None</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="due_date" className="block text-sm font-medium">Due Date</label>
        <input
          type="date"
          id="due_date"
          value={formData.due_date || ''}
          onChange={(e) => setFormData({...formData, due_date: e.target.value})}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Tags</label>
        <div className="flex mb-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            placeholder="Add a tag..."
            className="flex-1 px-3 py-2 border rounded-l-md"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-4 py-2 bg-blue-500 text-white rounded-r-md"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(formData.tags || []).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          {initialData ? 'Update' : 'Create'} Task
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
```

## Testing Checklist

### Database Layer
- [ ] Migration runs successfully without errors
- [ ] New columns exist in the database
- [ ] Default values are applied correctly to existing records
- [ ] New Task model works with database operations

### API Layer
- [ ] GET /api/tasks accepts new query parameters
- [ ] Search functionality works with title and description
- [ ] Filter functionality works for status, priority, and tags
- [ ] Sort functionality works for all specified options
- [ ] POST/PUT endpoints accept new fields with validation
- [ ] Complete endpoint creates new recurring tasks correctly

### Frontend Layer
- [ ] Task form includes all new fields with proper validation
- [ ] Task list displays priority badges and tags correctly
- [ ] Overdue tasks are visually distinguished
- [ ] Filter and sort controls work as expected
- [ ] Search functionality works across the UI

## Common Issues and Solutions

### Issue: Date format validation
**Solution**: Ensure all date inputs follow YYYY-MM-DD format consistently across frontend and backend

### Issue: Tags not saving properly
**Solution**: Verify JSONB column handling in your database and ORM mapping

### Issue: Recurring tasks not creating
**Solution**: Check recurrence logic and ensure proper date calculations

### Issue: Performance with large datasets
**Solution**: Add appropriate database indexes for filtered/sorted fields