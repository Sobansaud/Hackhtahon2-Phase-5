from typing import Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from app.models.user import User


async def get_current_user(user_id: str, db: AsyncSession) -> Dict[str, Any]:
    """
    MCP tool to get the current user's information.

    Args:
        user_id: The ID of the user to retrieve
        db: Async database session

    Returns:
        Dict containing the user's information
    """
    try:
        # Find the user by ID
        query = select(User).where(User.id == user_id)
        result = await db.execute(query)
        user = result.scalar_one_or_none()

        if not user:
            raise ValueError(f"User with ID {user_id} not found")

        return {
            "user_id": user.id,
            "email": user.email,
            "name": getattr(user, 'name', None),
            "created_at": user.created_at.isoformat() if getattr(user, 'created_at', None) else None
        }
    except Exception as e:
        raise e