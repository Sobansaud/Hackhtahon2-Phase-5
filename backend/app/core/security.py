import jwt
from typing import Any, Dict, Optional
from .config import settings


def verify_jwt(token: str) -> Optional[Dict[str, Any]]:
    try:
        secret = settings.BETTER_AUTH_SECRET or "dev-secret"
        payload = jwt.decode(
            token,
            secret,
            algorithms=["HS256"],
            options={"require_sub": True, "verify_exp": True},
        )
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.PyJWTError:
        return None
