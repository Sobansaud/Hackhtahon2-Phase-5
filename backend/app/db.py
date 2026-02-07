from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel.ext.asyncio.session import AsyncSession
from .core.config import settings

from urllib.parse import urlparse, parse_qs, urlencode, urlunparse

# Database URL conversion for async drivers
database_url = settings.DATABASE_URL
if database_url.startswith("postgresql://"):
    database_url = database_url.replace("postgresql://", "postgresql+asyncpg://", 1)
elif database_url.startswith("sqlite://"):
    database_url = database_url.replace("sqlite://", "sqlite+aiosqlite://", 1)

# Clean up query params for asyncpg (only for PostgreSQL)
if database_url.startswith("postgresql+asyncpg://"):
    parsed = urlparse(database_url)
    qs = parse_qs(parsed.query)

    # Remove unsupported keys
    for key in ["sslmode", "channel_binding", "options"]:
        qs.pop(key, None)

    # Rebuild URL without forcing ssl query params; we'll pass SSL via connect_args
    new_query = urlencode(qs, doseq=True)
    database_url = urlunparse(parsed._replace(query=new_query))
    parsed = urlparse(database_url)  # Update parsed
else:
    parsed = urlparse(database_url)

# Determine connect args: enable SSL for non-local PostgreSQL hosts (e.g., Neon)
connect_args = {}
if database_url.startswith("postgresql+asyncpg://"):
    hostname = parsed.hostname or ""
    if hostname not in ("localhost", "127.0.0.1", ""):
        # asyncpg expects `ssl` argument (True or SSLContext) instead of sslmode
        connect_args = {"ssl": True}

# Determine engine arguments
engine_kwargs = {
    "echo": True,
    "future": True,
    "connect_args": connect_args,
}

# SQLite and NullPool don't support pool_size or max_overflow
if not database_url.startswith("sqlite"):
    engine_kwargs.update({
        "pool_pre_ping": True,  # Check connection liveness before using
        "pool_recycle": 300,    # Recycle connections every 5 minutes
        "pool_size": 10,        # Set pool size
        "max_overflow": 20      # Allow overflow
    })

engine = create_async_engine(database_url, **engine_kwargs)

from sqlmodel import SQLModel

async def get_async_session() -> AsyncSession:
    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    async with async_session() as session:
        yield session

async def create_db_and_tables():
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)