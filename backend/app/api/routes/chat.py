from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.models.chat import ChatRequest, ChatResponse
from app.services.chatbot import ChatbotService
from app.db import get_async_session
from app.api.middleware.auth import get_current_user, validate_user_id_match, JWTData


router = APIRouter(prefix="/{user_id}", tags=["chat"])


@router.post("/chat", response_model=ChatResponse)
async def chat(
    user_id: str,
    request: ChatRequest,
    current_user: JWTData = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):
    """
    Send a message to the AI chatbot.

    The chatbot will parse intent, execute tools if needed,
    and return a conversational response.
    """
    # Validate that the user_id in the path matches the user_id in the JWT token
    if not validate_user_id_match(current_user.user_id, user_id):
        raise HTTPException(status_code=403, detail="User ID mismatch")

    # Initialize the chatbot service
    chatbot_service = ChatbotService()

    # Process the message with database access
    result = await chatbot_service.process_message_with_db(
        db=db,
        user_id=user_id,
        message=request.message,
        conversation_id=request.conversation_id
    )

    return ChatResponse(
        conversation_id=result["conversation_id"],
        response=result["response"],
        tool_calls=result.get("tool_calls")
    )