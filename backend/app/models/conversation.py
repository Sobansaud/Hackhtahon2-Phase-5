from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, List
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, update


class Conversation(SQLModel, table=True):
    """
    Represents a chat conversation belonging to a user.
    Supports threading of messages and conversation resumption.
    """
    id: str = Field(
        primary_key=True,
        default_factory=lambda: str(uuid.uuid4()),
        description="Unique conversation identifier (UUID)"
    )
    user_id: str = Field(
        foreign_key="user.id",
        ondelete="CASCADE",
        description="Owner user ID for isolation"
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Conversation creation timestamp"
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Last message timestamp for ordering"
    )

    # Relationships
    messages: List["Message"] = Relationship(
        back_populates="conversation",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
    # Note: User relationship would be defined in the User model


class ConversationRepository:
    """Async repository for Conversation CRUD operations."""

    async def create(self, db: AsyncSession, user_id: str) -> Conversation:
        """Create new conversation for user."""
        conversation = Conversation(user_id=user_id)
        db.add(conversation)
        await db.commit()
        await db.refresh(conversation)
        return conversation

    async def get_by_id(self, db: AsyncSession, conversation_id: str, user_id: str) -> Optional[Conversation]:
        """Get conversation by ID, enforcing user isolation."""
        statement = select(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.user_id == user_id
        )
        result = await db.execute(statement)
        return result.scalar_one_or_none()

    async def get_user_conversations(
        self,
        db: AsyncSession,
        user_id: str,
        limit: int = 50,
        offset: int = 0
    ) -> List[Conversation]:
        """List user's conversations, ordered by recent activity."""
        statement = select(Conversation).where(
            Conversation.user_id == user_id
        ).order_by(
            desc(Conversation.updated_at)
        ).offset(offset).limit(limit)
        result = await db.execute(statement)
        return result.scalars().all()

    async def update_timestamp(self, db: AsyncSession, conversation_id: str) -> None:
        """Update updated_at when new message added."""
        statement = update(Conversation).where(
            Conversation.id == conversation_id
        ).values(updated_at=datetime.utcnow())
        await db.execute(statement)
        await db.commit()