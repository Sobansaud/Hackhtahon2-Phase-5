from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import traceback
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .api import tasks, auth
from .api.routes import chat, events, reminders

from contextlib import asynccontextmanager
from .db import create_db_and_tables, get_async_session
from fastapi import Depends
from sqlmodel.ext.asyncio.session import AsyncSession
from .models import user, task # Import models to register them with SQLModel

@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_db_and_tables()
    yield

app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http?://(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    origin = request.headers.get("origin")
    method = request.method
    path = request.url.path
    print(f"Incoming Request: {method} {path} | Origin: {origin}")
    response = await call_next(request)
    return response

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # Log full traceback to server stdout for debugging
    traceback.print_exception(type(exc), exc, exc.__traceback__)
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal error: {str(exc)}"},
    )

app.include_router(auth.router, prefix="/api")
app.include_router(tasks.router, prefix="/api/tasks")
app.include_router(chat.router, prefix="/api")  # Chat router now includes /api prefix
app.include_router(events.router, prefix="/api") # Dapr Subscriber
app.include_router(reminders.router, prefix="/api") # Dapr Cron Binding

@app.get("/api/ping")
async def ping():
    return {"message": "pong"}

@app.get("/health")
async def health_check():
    return {"status": "ok", "project": settings.PROJECT_NAME}

@app.get("/test-db")
async def test_db(db: AsyncSession = Depends(get_async_session)):
    try:
        from sqlalchemy import text
        await db.exec(text("SELECT 1"))
        return {"status": "ok", "db": "connected"}
    except Exception as e:
        return {"status": "error", "db": str(e)}
