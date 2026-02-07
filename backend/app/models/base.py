from datetime import datetime
from sqlmodel import SQLModel, Field
from typing import Optional

class TimestampMixin(SQLModel):
    created_at: datetime = Field(
        default_factory=lambda: datetime.utcnow(),
        nullable=False
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.utcnow(),
        nullable=False,
        sa_column_kwargs={"onupdate": lambda: datetime.utcnow()}
    )
