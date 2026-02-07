from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, List
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from .conversation import Conversation


class Message(SQLModel, table=True):
    """
    Represents an individual chat message within a conversation.
    Messages are immutable once created.
    """
    id: str = Field(
        primary_key=True,
        default_factory=lambda: str(uuid.uuid4()),
        description="Unique message identifier (UUID)"
    )
    conversation_id: str = Field(
        foreign_key="conversation.id",
        ondelete="CASCADE",
        description="Parent conversation ID"
    )
    role: str = Field(
        default="user",
        description="Message role: 'user', 'assistant', or 'system'"
    )
    content: str = Field(
        description="Message text content"
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Message creation timestamp"
    )

    # Relationships
    conversation: "Conversation" = Relationship(back_populates="messages")


class MessageRepository:
    """Async repository for Message CRUD operations."""

    async def create(
        self,
        db: AsyncSession,
        conversation_id: str,
        role: str,
        content: str
    ) -> Message:
        """Create new message in conversation."""
        message = Message(
            conversation_id=conversation_id,
            role=role,
            content=content
        )
        db.add(message)
        await db.commit()
        await db.refresh(message)
        return message

    async def get_conversation_messages(
        self,
        db: AsyncSession,
        conversation_id: str,
        limit: int = 100
    ) -> List[Message]:
        """Load conversation history, most recent first."""
        statement = select(Message).where(
            Message.conversation_id == conversation_id
        ).order_by(Message.created_at.asc())
        result = await db.execute(statement)
        return result.scalars().all()

    async def delete_by_conversation(self, db: AsyncSession, conversation_id: str) -> int:
        """Delete all messages in conversation (cascade from Conversation)."""
        from sqlalchemy import delete
        statement = delete(Message).where(
            Message.conversation_id == conversation_id
        )
        result = await db.execute(statement)
        await db.commit()
        return result.rowcount