from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID


class ToolCallInfo(BaseModel):
    """Information about an executed tool call."""
    tool: str
    params: dict
    result: dict


class ChatRequest(BaseModel):
    """Request model for chat endpoint."""
    conversation_id: Optional[str] = Field(
        None,
        description="Optional conversation ID to continue existing conversation"
    )
    message: str = Field(
        ...,
        min_length=1,
        max_length=10000,
        description="User's natural language message"
    )


class ChatResponse(BaseModel):
    """Response model for chat endpoint."""
    conversation_id: str
    response: str
    tool_calls: Optional[List[ToolCallInfo]] = None