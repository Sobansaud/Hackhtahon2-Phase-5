# Implementation Plan: AI Todo Chatbot Integration

**Branch**: `004-ai-chatbot` | **Date**: 2026-01-06 | **Spec**: [spec.md](spec.md)

## Summary

This plan governs the implementation of an intelligent AI Todo Chatbot for Phase III. The chatbot integrates Cohere's command-r-plus model for natural language understanding and tool calling, exposing 6 MCP-style tools for task CRUD operations and user identity queries. The backend provides a stateless `/api/{user_id}/chat` endpoint with conversation persistence. The frontend features a stunning glassmorphic chat panel with floating trigger button, maintaining visual harmony with the existing premium design.

## Technical Context

**Language/Version**: Python 3.11+ (FastAPI backend) | TypeScript 5+ (Next.js frontend)
**Primary Dependencies**: cohere (Python), SQLModel, PyJWT, Better Auth
**Storage**: Neon PostgreSQL with SQLModel (async)
**Testing**: pytest (backend) | Jest (frontend)
**Target Platform**: Web application (responsive)
**Performance Goals**: <5s response for simple queries, <10s for tool execution
**Constraints**: Stateless backend, strict user isolation, JWT auth required
**Scale/Scope**: Single-user conversations, multi-tenant data isolation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Compliance | Evidence |
|-----------|------------|----------|
| Spec-First Development | ✅ PASS | Feature specification exists at `specs/004-ai-chatbot/spec.md` |
| Security by Design | ✅ PASS | JWT validation, user isolation enforced on all operations |
| Test-First Implementation | ⚠️ DEFER | Tests will be written during implementation via `/sp.implement` |
| Full-Stack Integration | ✅ PASS | Both frontend and backend components specified |
| Agentic Development | ✅ PASS | All implementation via Claude Code agents |
| API-First Design | ✅ PASS | Chat endpoint contract defined in spec |
| AI-First Design | ✅ PASS | Cohere integration central to feature |
| Stateless Operation | ✅ PASS | No server state - all data persisted in PostgreSQL |

## Architectural Decisions

### ADR-001: Cohere Model Selection

**Decision**: Use `command-r-plus` model for all chat completions

**Rationale**:
- Superior reasoning capabilities compared to command-r
- Enhanced tool-use accuracy for structured JSON output
- Better handling of multi-turn conversations
- Supports longer context windows for conversation history

**Alternatives Considered**:
- `command-r`: Lower cost but reduced reasoning accuracy
- `command`: Basic chat model without advanced reasoning

---

### ADR-002: Tool Call Parsing Strategy

**Decision**: Strict JSON block extraction from Cohere responses

**Implementation**:
- Cohere responses must contain valid JSON in ```json code blocks
- Response format: ```json\n{"tool": "...", "params": {...}}\n```
- Strict parsing using Python's json.loads on extracted content
- Fallback to regex only if JSON block parsing fails (logging warning)

**Rationale**:
- Ensures reliable tool invocation with predictable structure
- Prevents parsing errors from malformed responses
- Explicit format simplifies debugging and validation

**Alternatives Considered**:
- Regex fallback as primary: Less reliable, prone to edge cases
- LLM-based parsing: Adds latency and complexity

---

### ADR-003: Multi-Step Chaining Strategy

**Decision**: Loop-based execution until no tool calls remain

**Implementation**:
```python
while tool_calls_detected:
    response = cohere.chat(message_history)
    tool_calls = parse_tool_calls(response)
    for tool_call in tool_calls:
        result = execute_tool(tool_call)
        message_history.append(tool_call_result)
    max_iterations = 10  # Prevent infinite loops
```

**Rationale**:
- Handles complex queries like "List pending then delete the first"
- Allows sequential operations in single user message
- Maintains conversation context throughout execution
- Clear termination condition prevents infinite loops

**Alternatives Considered**:
- Single Cohere call: Cannot handle multi-step operations
- Fixed 2-turn only: Limits query complexity

---

### ADR-004: Conversation Persistence Model

**Decision**: Optional conversation_id - create new if not provided

**Behavior**:
- If `conversation_id` provided: continue existing conversation
- If `conversation_id` missing: create new conversation, return new ID
- All messages persisted with conversation threading
- User can resume any previous conversation

**Rationale**:
- Flexible UX - new users don't need to manage IDs
- Persistence enables context-aware follow-ups
- Supports conversation history browsing in future

**Alternatives Considered**:
- Always new conversation: Loses context across sessions
- Single conversation per user: Limits parallel conversations

---

### ADR-005: Frontend Chat Panel Layout

**Decision**: Slide-in glassmorphic panel from bottom-right

**Design Specifications**:
- **Position**: Fixed bottom-right corner (16px margins)
- **Dimensions**: 400px width, 600px height on desktop
- **Mobile**: Full-width bottom sheet (<640px viewport)
- **Visual**: Glassmorphic card with `backdrop-filter: blur(12px)`
- **Animation**: Slide-in from right (300ms ease-out)
- **Trigger**: Floating circular button (56px diameter, emerald accent)

**Rationale**:
- Premium, immersive feel matching flagship UI
- Non-intrusive - doesn't block main content
- Accessible from any screen via fixed position
- Dark/light theme aware with appropriate contrast

**Alternatives Considered**:
- Full bottom sheet: Too intrusive, blocks too much content
- Centered modal: Disrupts user workflow
- Sidebar: Requires more screen real estate

---

### ADR-006: Message Rendering Strategy

**Decision**: Support markdown rendering for assistant messages

**Implementation**:
- Assistant messages rendered with basic markdown support
- Support: **bold**, *italic*, `code`, lists, line breaks
- User messages: Plain text (prevents injection risks)
- Sanitize all content before rendering

**Rationale**:
- Enhances AI response readability
- Supports structured task lists in responses
- Maintains security through input sanitization

**Alternatives Considered**:
- Plain text only: Limits response expressiveness
- Full HTML rendering: Security risk

---

## Project Structure

### Documentation (this feature)

```
specs/004-ai-chatbot/
├── plan.md              # This file (/sp.plan command output)
├── spec.md              # Feature specification (approved)
├── research.md          # Phase 0 output (if needed)
├── data-model.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── chat-openapi.yaml
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```
backend/
├── src/
│   ├── models/
│   │   ├── conversation.py    # NEW: Conversation SQLModel
│   │   └── message.py         # NEW: Message SQLModel
│   ├── services/
│   │   └── chatbot.py         # NEW: Cohere integration, tool execution
│   ├── api/
│   │   └── routes/
│   │       └── chat.py        # NEW: /api/{user_id}/chat endpoint
│   └── mcp/
│       └── tools/             # NEW: 6 MCP-style tool implementations
└── tests/
    └── chatbot/               # NEW: Chatbot tests

frontend/
├── src/
│   ├── components/
│   │   └── chatbot/           # NEW: Chatbot UI components
│   │       ├── ChatButton.tsx
│   │       ├── ChatPanel.tsx
│   │       ├── MessageBubble.tsx
│   │       └── MessageInput.tsx
│   └── lib/
│       └── api.ts             # Updated: Chat API client
└── tests/
    └── chatbot/               # NEW: Frontend tests
```

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | All principles satisfied | N/A |

## Implementation Phases

### Phase 1: Database Models (Database Engineer)

- [ ] Create Conversation SQLModel with user_id FK
- [ ] Create Message SQLModel with conversation_id FK
- [ ] Add indexes for efficient queries
- [ ] Create async database operations
- [ ] Write unit tests for models

### Phase 2: MCP Tools Implementation (MCP Tools Engineer)

- [ ] Implement add_task tool with user_id isolation
- [ ] Implement list_tasks tool with filtering
- [ ] Implement complete_task tool
- [ ] Implement delete_task tool
- [ ] Implement update_task tool
- [ ] Implement get_current_user tool
- [ ] Write unit tests for all tools

### Phase 3: Backend Chat Service (Chatbot Backend Engineer)

- [ ] Create ChatbotService class with Cohere integration
- [ ] Implement strict JSON parsing for tool calls
- [ ] Implement multi-step tool chaining loop
- [ ] Handle conversation history loading/saving
- [ ] Implement JWT validation and user extraction
- [ ] Create /api/{user_id}/chat endpoint
- [ ] Write integration tests for endpoint

### Phase 4: Frontend Chat UI (Frontend Chatbot Engineer)

- [ ] Create floating ChatButton component with animation
- [ ] Create slide-in ChatPanel with glassmorphic design
- [ ] Implement MessageBubble components (user/assistant)
- [ ] Create MessageInput with send functionality
- [ ] Implement typing indicator animation
- [ ] Add auto-scroll behavior
- [ ] Integrate with existing auth context
- [ ] Write component tests

### Phase 5: Integration & Polish

- [ ] End-to-end testing of chat flows
- [ ] Verify user isolation across sessions
- [ ] Performance testing (response times)
- [ ] Accessibility review
- [ ] Demo preparation

## Quick Links

- **Feature Spec**: [spec.md](spec.md)
- **Constitution**: [.specify/memory/constitution.md](../../.specify/memory/constitution.md)
- **Backend Code**: [backend/src/](../../backend/src/)
- **Frontend Code**: [frontend/src/](../../frontend/src/)

## Notes

- All code generated via Claude Code agents - no manual coding
- PHR records created for all significant decisions
- IMPLEMENTATION_LOG.md tracks phase completions
- README.md to be updated with Cohere setup and AI Magic Highlights
