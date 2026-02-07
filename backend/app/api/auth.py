from fastapi import APIRouter, HTTPException, status, Depends
import jwt
from datetime import datetime, timedelta, timezone
from pydantic import BaseModel, EmailStr
from sqlmodel import select
from passlib.context import CryptContext
from ..core.config import settings
from ..models.user import User
from ..api.deps import SessionDep

router = APIRouter(prefix="/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

class AuthResponse(BaseModel):
    token: str
    user: dict

class SignUpRequest(BaseModel):
    email: EmailStr
    name: str
    password: str

class SignInRequest(BaseModel):
    email: EmailStr
    password: str

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_token(user_id: str, email: str) -> str:
    # Use unix timestamps for exp/iat for better cross-platform compatibility
    now_ts = int(datetime.now(timezone.utc).timestamp())
    exp_ts = now_ts + 7 * 24 * 60 * 60
    payload = {
        "sub": user_id,
        "email": email,
        "exp": exp_ts,
        "iat": now_ts,
    }
    secret = settings.BETTER_AUTH_SECRET or "dev-secret"
    return jwt.encode(payload, secret, algorithm="HS256")

@router.post("/sign-up", response_model=AuthResponse)
async def sign_up(request: SignUpRequest, session: SessionDep):
    statement = select(User).where(User.email == request.email)
    existing_user = (await session.execute(statement)).scalars().first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    try:
        user = User(
            email=request.email,
            name=request.name,
            hashed_password=get_password_hash(request.password)
        )
        session.add(user)
        await session.commit()
        await session.refresh(user)
    except Exception as exc:
        import traceback
        traceback.print_exception(type(exc), exc, exc.__traceback__)
        raise HTTPException(status_code=500, detail="Failed to create user")

    token = create_token(user.id, user.email)
    return {"token": token, "user": {"id": user.id, "email": user.email, "name": user.name}}

@router.post("/sign-in", response_model=AuthResponse)
async def sign_in(request: SignInRequest, session: SessionDep):
    statement = select(User).where(User.email == request.email)
    user = (await session.execute(statement)).scalars().first()

    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_token(user.id, user.email)
    return {"token": token, "user": {"id": user.id, "email": user.email, "name": user.name}}


@router.post('/logout', status_code=204)
async def logout():
    # Stateless JWT logout - client should remove token. Provide 204 for client convenience.
    return None
