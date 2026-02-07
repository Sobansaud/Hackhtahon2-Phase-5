"""Add priority, tags, due_date, recurrence columns to tasks table

Revision ID: 001_add_task_columns
Revises:
Create Date: 2026-02-05 20:30:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001_add_task_columns'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add priority column with default "Medium"
    op.add_column('task', sa.Column('priority', sa.String(), server_default='Medium', nullable=False))

    # Add tags column as JSONB array with default empty array
    op.add_column('task', sa.Column('tags', postgresql.JSONB(astext_type=sa.Text()), server_default='[]', nullable=False))

    # Add due_date column as string (will store YYYY-MM-DD format)
    op.add_column('task', sa.Column('due_date', sa.String(), nullable=True))

    # Add recurrence column with default NULL
    op.add_column('task', sa.Column('recurrence', sa.String(), nullable=True))


def downgrade() -> None:
    # Remove columns in reverse order
    op.drop_column('task', 'recurrence')
    op.drop_column('task', 'due_date')
    op.drop_column('task', 'tags')
    op.drop_column('task', 'priority')