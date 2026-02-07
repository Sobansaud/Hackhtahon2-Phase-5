from fastapi import APIRouter, HTTPException, Query, status
from sqlmodel import select, func
from typing import List, Optional
from ..models.task import Task, TaskCreate, TaskUpdate
from .deps import SessionDep, CurrentUserDep
from sqlalchemy import and_, or_, case
import re
from datetime import datetime
from dateutil.relativedelta import relativedelta
from pydantic import BaseModel
from dapr.clients import DaprClient
import json
from ..utils.task_utils import enrich_task_response

# Response model for paginated tasks
class PaginatedTasksResponse(BaseModel):
    tasks: List[Task]
    total: int
    page: int
    limit: int
    has_more: bool

router = APIRouter()

@router.get("/", response_model=PaginatedTasksResponse)
async def list_tasks(
    current_user: CurrentUserDep,
    session: SessionDep,
    status: Optional[str] = Query(None, regex="^(all|pending|completed)$"),
    filter_status: Optional[str] = Query(None, regex="^(all|pending|completed)$"),
    filter_priority: Optional[str] = Query(None, regex="^(all|High|Medium|Low)$"),
    filter_tag: Optional[str] = Query(None),
    filter_due_date_start: Optional[str] = Query(None, description="Start date for due date range (YYYY-MM-DD)"),
    filter_due_date_end: Optional[str] = Query(None, description="End date for due date range (YYYY-MM-DD)"),
    search: Optional[str] = Query(None),
    sort: Optional[str] = Query("created_at_desc", regex="^(due_date_asc|due_date_desc|priority_asc|priority_desc|title_asc|title_desc|created_at_asc|created_at_desc)$"),
    page: int = Query(1, ge=1, description="Page number for pagination"),
    limit: int = Query(50, ge=1, le=100, description="Number of items per page")
):
    # Base query
    query = select(Task).where(Task.user_id == current_user)

    # Apply filters for counting
    count_query = select(func.count()).select_from(select(Task).where(Task.user_id == current_user).subquery())

    # Apply status filter
    effective_status = filter_status or status
    if effective_status and effective_status != "all":
        if effective_status == "pending":
            query = query.where(Task.completed == False)
            count_query = count_query.where(Task.completed == False)
        elif effective_status == "completed":
            query = query.where(Task.completed == True)
            count_query = count_query.where(Task.completed == True)

    # Apply priority filter
    if filter_priority and filter_priority != "all":
        query = query.where(Task.priority == filter_priority)
        count_query = count_query.where(Task.priority == filter_priority)

    # Apply tag filter
    if filter_tag:
        # For JSONB array, check if tag exists in the array
        query = query.where(Task.tags.op('?')(filter_tag))
        count_query = count_query.where(Task.tags.op('?')(filter_tag))

    # Apply due date range filter
    if filter_due_date_start:
        try:
            query = query.where(Task.due_date >= filter_due_date_start)
            count_query = count_query.where(Task.due_date >= filter_due_date_start)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid start date format. Use YYYY-MM-DD")

    if filter_due_date_end:
        try:
            query = query.where(Task.due_date <= filter_due_date_end)
            count_query = count_query.where(Task.due_date <= filter_due_date_end)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid end date format. Use YYYY-MM-DD")

    # Apply search filter (keyword search in title/description)
    if search:
        # Search in title and in description if it's not None
        search_condition = (
            Task.title.ilike(f"%{search}%") |
            (Task.description.is_not(None) & Task.description.ilike(f"%{search}%"))
        )
        query = query.where(search_condition)
        count_query = count_query.where(search_condition)

    # Apply sorting
    if sort == "due_date_asc":
        query = query.order_by(Task.due_date.asc().nullslast(), Task.created_at.desc())
    elif sort == "due_date_desc":
        query = query.order_by(Task.due_date.desc().nullslast(), Task.created_at.desc())
    elif sort == "priority_asc":
        # Define priority order: High -> Medium -> Low
        priority_order = case(
            (Task.priority == "High", 1),
            (Task.priority == "Medium", 2),
            (Task.priority == "Low", 3),
            else_=4
        )
        query = query.order_by(priority_order, Task.created_at.desc())
    elif sort == "priority_desc":
        priority_order = case(
            (Task.priority == "High", 1),
            (Task.priority == "Medium", 2),
            (Task.priority == "Low", 3),
            else_=4
        )
        query = query.order_by(priority_order.desc(), Task.created_at.desc())
    elif sort == "title_asc":
        query = query.order_by(Task.title.asc())
    elif sort == "title_desc":
        query = query.order_by(Task.title.desc())
    elif sort == "created_at_asc":
        query = query.order_by(Task.created_at.asc())
    else:  # default: created_at_desc
        query = query.order_by(Task.created_at.desc())

    # Apply complex sorting with multiple criteria support
    # Additional complex sorting can be implemented here if needed

    # Get total count
    total_result = await session.execute(count_query)
    total = total_result.scalar_one()

    # Apply pagination
    offset = (page - 1) * limit
    query = query.offset(offset).limit(limit)

    results = await session.execute(query)
    tasks = results.scalars().all()

    # Calculate if there are more pages
    has_more = (page * limit) < total

    # Return paginated response
    return PaginatedTasksResponse(
        tasks=tasks,
        total=total,
        page=page,
        limit=limit,
        has_more=has_more
    )

@router.post("/", response_model=Task, status_code=status.HTTP_201_CREATED)
async def create_task(
    current_user: CurrentUserDep,
    task_in: TaskCreate,
    session: SessionDep,
):
    task = Task(**task_in.model_dump(), user_id=current_user)
    session.add(task)
    await session.commit()
    await session.refresh(task)

    # Publish Dapr Event asynchronously
    def _publish_task_event(event_data: dict, current_user: int):
        try:
            with DaprClient() as client:
                # 1. Pub/Sub Event
                client.publish_event(
                    pubsub_name="pubsub",
                    topic_name="task.created",
                    data=json.dumps(event_data),
                    data_content_type="application/json",
                )
                print(f"Published task.created event for Task {event_data.get('id')}")

                # 2. State Store Persistence (Redis)
                state_key = f"user_{current_user}_last_task"
                client.save_state(
                    store_name="statestore",
                    key=state_key,
                    value=json.dumps({"task_id": event_data.get('id'), "created_at": str(datetime.now())})
                )
                print(f"Saved state for {state_key}")
        except Exception as e:
            print(f"Failed to interact with Dapr: {e}")

    event_data = {"id": task.id, "title": task.title, "status": task.status}

    try:
        import threading
        t = threading.Thread(target=_publish_task_event, args=(event_data, current_user), daemon=True)
        t.start()
    except Exception:
        pass

    return task

    return task

@router.get("/{id}", response_model=Task)
async def get_task(
    id: int,
    current_user: CurrentUserDep,
    session: SessionDep
):
    task = await session.get(Task, id)
    if not task or task.user_id != current_user:
        raise HTTPException(status_code=404, detail="Task not found")

    return task

@router.put("/{id}", response_model=Task)
async def update_task(
    id: int,
    current_user: CurrentUserDep,
    task_in: TaskUpdate,
    session: SessionDep
):
    task = await session.get(Task, id)
    if not task or task.user_id != current_user:
        raise HTTPException(status_code=404, detail="Task not found")

    update_data = task_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(task, key, value)

    session.add(task)
    await session.commit()
    await session.refresh(task)
    return task

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    id: int,
    current_user: CurrentUserDep,
    session: SessionDep
):
    task = await session.get(Task, id)
    if not task or task.user_id != current_user:
        raise HTTPException(status_code=404, detail="Task not found")

    await session.delete(task)
    await session.commit()
    return None

@router.patch("/{id}/complete", response_model=Task)
async def toggle_complete(
    id: int,
    current_user: CurrentUserDep,
    session: SessionDep
):
    task = await session.get(Task, id)
    if not task or task.user_id != current_user:
        raise HTTPException(status_code=404, detail="Task not found")

    task.completed = not task.completed

    # Handle recurring task logic
    if task.completed and task.recurrence and task.recurrence != "none":
        # Create a new recurring task
        from dateutil.relativedelta import relativedelta

        new_due_date = None
        if task.due_date:
            due_date_obj = datetime.strptime(task.due_date, "%Y-%m-%d").date()

            if task.recurrence == "daily":
                new_due_date = due_date_obj + relativedelta(days=1)
            elif task.recurrence == "weekly":
                new_due_date = due_date_obj + relativedelta(weeks=1)
            elif task.recurrence == "monthly":
                new_due_date = due_date_obj + relativedelta(months=1)

        new_task = Task(
            title=task.title,
            description=task.description,
            status="pending",
            completed=False,
            user_id=task.user_id,
            priority=task.priority,
            tags=task.tags,
            due_date=new_due_date.strftime("%Y-%m-%d") if new_due_date else None,
            recurrence=task.recurrence
        )

        session.add(new_task)

    session.add(task)
    await session.commit()
    await session.refresh(task)
    return task
