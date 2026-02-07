# SQLModel Models & Sessions Skill

## Purpose
This skill provides expert implementation of SQLModel definitions and asynchronous session management for Neon PostgreSQL.

## Capabilities
- Definition of `Task` and `User` models with `SQLModel(table=True)`
- Establishment of one-to-many relationships (User has many Tasks)
- Configuration of Foreign Keys (e.g., `user_id`)
- Setup of async database engines using `create_async_engine` from `DATABASE_URL`
- Implementation of async session dependencies (`get_session`) for FastAPI routes
- Performance optimization through targeted indexing

## Implementation Details

### Models
Define models that inherit from `SQLModel` and specify `table=True`.
- **User**: ID, Email (unique), Hashed Password, relationship to Tasks.
- **Task**: ID, Title, Description, Created At, Completed Status, User ID (FK).

### Async Connection
Use `sqlalchemy.ext.asyncio` for building the engine and sessionmaker. Ensure the `DATABASE_URL` uses the appropriate driver (e.g., `postgresql+asyncpg://`).

### Dependency Injection
Create a `get_session` function to yield an async session within a route's context.

### Performance
Add `index=True` to frequently queried fields like `user_id` and `email`.

## Usage
Provide the session to routes via dependency injection:

```python
@app.post("/tasks/")
async def create_task(task: TaskCreate, session: AsyncSession = Depends(get_session)):
    db_task = Task.from_orm(task)
    session.add(db_task)
    await session.commit()
    await session.refresh(db_task)
    return db_task
```
