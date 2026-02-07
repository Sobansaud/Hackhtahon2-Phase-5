# Data Model: AI Todo Chatbot

## Overview

This document defines the SQLModel entities for chatbot conversation and message persistence. All models use async SQLAlchemy with Neon PostgreSQL.

## Entity Relationship

```
User (existing)
    |
    1:N
    |
Conversation
    |
    1:N
    |
Message
```

## Conversation Model

```python
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, List
import uuid

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
        foreign_key="users.id",
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
    user: "User" = Relationship(back_populates="conversations")
```

### Validation Rules

- `id`: Must be valid UUID format
- `user_id`: Must reference existing user (FK constraint)
- `created_at`: Auto-set on creation, immutable
- `updated_at`: Auto-updated on each new message

### Indexes

```sql
-- Primary lookup by user
CREATE INDEX idx_conversations_user_id ON conversations(user_id);

-- Order by recent activity
CREATE INDEX idx_conversations_updated_at ON conversations(user_id, updated_at DESC);
```

## Message Model

```python
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
        foreign_key="conversations.id",
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
    conversation: Conversation = Relationship(back_populates="messages")
```

### Role Enum Values

| Value | Description |
|-------|-------------|
| `user` | User's natural language message |
| `assistant` | AI response from Cohere |
| `system` | System prompts (hidden from UI) |

### Validation Rules

- `id`: Must be valid UUID format
- `conversation_id`: Must reference existing conversation (FK constraint)
- `role`: Must be one of: "user", "assistant", "system"
- `content`: Maximum 10,000 characters, non-empty after strip
- `created_at`: Auto-set on creation, immutable

### Indexes

```sql
-- Load conversation history in order
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id, created_at ASC);
```

## Existing Models (No Changes Required)

### Task Model

The existing Task model requires no changes for chatbot functionality. Tools operate on the existing schema.

**Tool Operations**:
- `add_task`: Creates new Task with title, optional description
- `list_tasks`: Queries Task by user_id, optional status filter
- `complete_task`: Updates Task status to "completed"
- `delete_task`: Deletes Task by id and user_id
- `update_task`: Updates Task fields by id and user_id

### User Model

The existing User model requires no changes. Chatbot extracts identity from JWT, not database queries.

## Async Database Operations

### Conversation Operations

```python
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

class ConversationRepository:
    """Async repository for Conversation CRUD operations."""

    async def create(self, user_id: str) -> Conversation:
        """Create new conversation for user."""

    async def get_by_id(self, conversation_id: str, user_id: str) -> Optional[Conversation]:
        """Get conversation by ID, enforcing user isolation."""

    async def get_user_conversations(
        self,
        user_id: str,
        limit: int = 50,
        offset: int = 0
    ) -> List[Conversation]:
        """List user's conversations, ordered by recent activity."""

    async def update_timestamp(self, conversation_id: str) -> None:
        """Update updated_at when new message added."""
```

### Message Operations

```python
class MessageRepository:
    """Async repository for Message CRUD operations."""

    async def create(
        self,
        conversation_id: str,
        role: str,
        content: str
    ) -> Message:
        """Create new message in conversation."""

    async def get_conversation_messages(
        self,
        conversation_id: str,
        limit: int = 100
    ) -> List[Message]:
        """Load conversation history, most recent first."""

    async def delete_by_conversation(self, conversation_id: str) -> int:
        """Delete all messages in conversation (cascade from Conversation)."""
```

## Database Migrations

### Migration Strategy

Using SQLModel with Alembic for migrations:

```python
# alembic/versions/004_add_chatbot_tables.py
"""Add chatbot conversation and message tables

Revision ID: 004
Revises: 003
Create Date: 2026-01-06

"""
from alembic import op
import sqlalchemy as sa
from sqlmodel import SQLModel

# Create tables
op.create_table(
    "conversations",
    sa.Column("id", sa.String(36), primary_key=True),
    sa.Column("user_id", sa.String(36), sa.ForeignKey("users.id", ondelete="CASCADE")),
    sa.Column("created_at", sa.DateTime(), nullable=False),
    sa.Column("updated_at", sa.DateTime(), nullable=False),
)

op.create_table(
    "messages",
    sa.Column("id", sa.String(36), primary_key=True),
    sa.Column("conversation_id", sa.String(36), sa.ForeignKey("conversations.id", ondelete="CASCADE")),
    sa.Column("role", sa.String(20), nullable=False),
    sa.Column("content", sa.Text(), nullable=False),
    sa.Column("created_at", sa.DateTime(), nullable=False),
)

# Create indexes
op.create_index("idx_conversations_user_id", "conversations", ["user_id"])
op.create_index("idx_messages_conversation_id", "messages", ["conversation_id", "created_at"])
```
