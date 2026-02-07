from sqlmodel import SQLModel, Field
from typing import List, Optional
from .base import TimestampMixin

import uuid

class User(TimestampMixin, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    email: str = Field(unique=True, index=True)
    name: Optional[str] = None
    hashed_password: str
