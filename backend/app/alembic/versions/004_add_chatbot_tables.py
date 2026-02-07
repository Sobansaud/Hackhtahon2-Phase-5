"""Add chatbot conversation and message tables

Revision ID: 004
Revises: 003
Create Date: 2026-01-06

"""
from alembic import op
import sqlalchemy as sa
from sqlmodel import SQLModel

# revision identifiers, used by Alembic.
revision = '004'
down_revision = '003'
branch_labels = None
depends_on = None


def upgrade():
    # Create conversations table
    op.create_table(
        "conversations",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("user_id", sa.String(36), sa.ForeignKey("users.id", ondelete="CASCADE")),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )

    # Create messages table
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


def downgrade():
    # Drop indexes first
    op.drop_index("idx_messages_conversation_id", table_name="messages")
    op.drop_index("idx_conversations_user_id", table_name="conversations")

    # Drop tables
    op.drop_table("messages")
    op.drop_table("conversations")