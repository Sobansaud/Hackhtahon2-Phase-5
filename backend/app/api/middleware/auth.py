from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional
import jwt
from app.core.config import settings
from datetime import datetime


class JWTData(BaseModel):
    """Data extracted from JWT token."""
    user_id: str
    email: str
    exp: Optional[int] = None


class JWTValidator:
    """JWT validation helper for chatbot endpoints."""

    def __init__(self):
        self.secret = settings.BETTER_AUTH_SECRET
        if not self.secret:
            raise ValueError("BETTER_AUTH_SECRET environment variable is required")
        self.algorithm = "HS256"

    async def validate_token(self, token: str) -> JWTData:
        """Validate JWT token and extract user data."""
        try:
            payload = jwt.decode(token, self.secret, algorithms=[self.algorithm])

            # Verify token hasn't expired
            exp = payload.get("exp")
            if exp and datetime.fromtimestamp(exp) < datetime.utcnow():
                raise HTTPException(status_code=401, detail="Token has expired")

            user_id = payload.get("userId") or payload.get("sub")
            email = payload.get("email")

            if not user_id or not email:
                raise HTTPException(status_code=401, detail="Invalid token: missing user data")

            return JWTData(user_id=user_id, email=email, exp=exp)
        except jwt.PyJWTError:
            raise HTTPException(status_code=401, detail="Invalid token")

    def extract_user_id_from_token(self, token: str) -> str:
        """Extract user ID from JWT token for validation."""
        try:
            payload = jwt.decode(token, self.secret, algorithms=[self.algorithm])
            return payload.get("userId") or payload.get("sub")
        except jwt.PyJWTError:
            raise HTTPException(status_code=401, detail="Invalid token")


# FastAPI security dependency
security = HTTPBearer()


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> JWTData:
    """Dependency to get current user from JWT token."""
    validator = JWTValidator()
    return await validator.validate_token(credentials.credentials)


def validate_user_id_match(token_user_id: str, path_user_id: str) -> bool:
    """Validate that the user ID in the token matches the path parameter."""
    return token_user_id == path_user_id