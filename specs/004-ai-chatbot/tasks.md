# Tasks: AI Todo Chatbot Integration

**Input**: Design documents from `specs/004-ai-chatbot/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`


- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/src/`
- **Frontend**: `frontend/src/`
- **Tests**: `backend/tests/` or `frontend/tests/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Install cohere Python library in backend/requirements.txt
- [ ] T002 [P] Add COHERE_API_KEY to backend/.env.example
- [ ] T003 [P] Add ChatbotConfig to backend/.env.example with all environment variables

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [ ] T010 Create Conversation SQLModel in backend/src/models/conversation.py
- [ ] T011 [P] Create Message SQLModel in backend/src/models/message.py
- [ ] T012 Create async ConversationRepository class in backend/src/models/conversation.py
- [ ] T013 [P] Create async MessageRepository class in backend/src/models/message.py
- [ ] T014 Create database migration script for conversations and messages tables
- [ ] T015 [P] Implement JWT validation helper in backend/src/api/middleware/auth.py
- [ ] T016 Create ChatRequest Pydantic model in backend/src/api/models/chat.py
- [ ] T017 [P] Create ChatResponse Pydantic model in backend/src/api/models/chat.py
- [ ] T018 Define ChatMessageTypeScript interface in frontend/src/components/chatbot/types.ts
- [ ] T019 [P] Define ChatStateTypeScript interface in frontend/src/components/chatbot/types.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Natural Language Task Management (Priority: P1) 🎯 MVP

**Goal**: Users can add, list, complete, update, and delete tasks via natural language

**Independent Test**: User sends "Add weekly meeting for Friday" and receives confirmation. Task appears in subsequent task lists.

### MCP Tools Implementation (US1)

- [ ] T020 [P] [US1] Implement add_task MCP tool in backend/src/mcp/tools/add_task.py
- [ ] T021 [P] [US1] Implement list_tasks MCP tool in backend/src/mcp/tools/list_tasks.py
- [ ] T022 [P] [US1] Implement complete_task MCP tool in backend/src/mcp/tools/complete_task.py
- [ ] T023 [US1] Implement delete_task MCP tool in backend/src/mcp/tools/delete_task.py
- [ ] T024 [US1] Implement update_task MCP tool in backend/src/mcp/tools/update_task.py
- [ ] T025 [P] [US1] Create tools index module in backend/src/mcp/tools/__init__.py

### Backend Service (US1)

- [ ] T026 [US1] Create ChatbotService class in backend/src/services/chatbot.py
- [ ] T027 [P] [US1] Implement Cohere client initialization in backend/src/services/chatbot.py
- [ ] T028 [US1] Implement system prompt configuration in backend/src/services/chatbot.py
- [ ] T029 [P] [US1] Implement strict JSON parsing for tool calls in backend/src/services/chatbot.py
- [ ] T030 [US1] Implement tool execution loop in backend/src/services/chatbot.py

### Backend Endpoint (US1)

- [ ] T031 [US1] Create /api/{user_id}/chat endpoint in backend/src/api/routes/chat.py
- [ ] T032 [P] [US1] Implement conversation creation logic in backend/src/api/routes/chat.py
- [ ] T033 [US1] Implement message persistence in backend/src/api/routes/chat.py

**Checkpoint**: User Story 1 complete - natural language task management working

---

## Phase 4: User Story 2 - User Identity Queries (Priority: P1)

**Goal**: Users can ask "Who am I?" and get their email/user ID

**Independent Test**: User sends "Who am I?" and receives response with their email address.

### MCP Tool (US2)

- [ ] T040 [US2] Implement get_current_user MCP tool in backend/src/mcp/tools/get_current_user.py

### Backend Service (US2)

- [ ] T041 [P] [US2] Integrate get_current_user tool into chatbot tool registry
- [ ] T042 [US2] Implement JWT user extraction in ChatbotService

**Checkpoint**: User Story 2 complete - identity queries working

---

## Phase 5: User Story 3 - Complex Multi-Step Operations (Priority: P2)

**Goal**: Users can chain multiple operations in a single message

**Independent Test**: User sends "Add meeting and list all tasks" and both operations complete successfully.

### Backend Service (US3)

- [ ] T050 [US3] Implement multi-step tool chaining loop in backend/src/services/chatbot.py
- [ ] T051 [P] [US3] Implement conversation history accumulation during tool execution
- [ ] T052 [US3] Implement max iterations protection (10 iterations) in ChatbotService

**Checkpoint**: User Story 3 complete - multi-step operations working

---

## Phase 6: User Story 4 - Frontend Chatbot Interface (Priority: P1)

**Goal**: Beautiful floating button and glassmorphic chat panel

**Independent Test**: User sees floating emerald button, clicks to open glassmorphic panel with styled message bubbles.

### Frontend Components (US4)

- [ ] T060 [P] [US4] Create ChatButton component in frontend/src/components/chatbot/ChatButton.tsx
- [ ] T061 [US4] Create ChatPanel component in frontend/src/components/chatbot/ChatPanel.tsx
- [ ] T062 [P] [US4] Create MessageBubble component in frontend/src/components/chatbot/MessageBubble.tsx
- [ ] T063 [US4] Create MessageInput component in frontend/src/components/chatbot/MessageInput.tsx
- [ ] T064 [P] [US4] Create TypingIndicator component in frontend/src/components/chatbot/TypingIndicator.tsx

### Frontend Integration (US4)

- [ ] T065 [US4] Create useChat custom hook in frontend/src/components/chatbot/useChat.ts
- [ ] T066 [P] [US4] Implement ChatProvider context in frontend/src/components/chatbot/ChatProvider.tsx
- [ ] T067 [US4] Create chat API client in frontend/src/lib/chat-api.ts
- [ ] T068 [US4] Add ChatButton to main layout in frontend/src/app/layout.tsx

### Styling (US4)

- [ ] T069 [P] [US4] Create glassmorphic styles in frontend/src/components/chatbot/ChatPanel.module.css
- [ ] T070 [US4] Implement pulse animation for floating button in ChatButton.tsx
- [ ] T071 [P] [US4] Implement slide-in animation for ChatPanel.tsx

**Checkpoint**: User Story 4 complete - beautiful chat UI working

---

## Phase 7: User Story 5 - Conversation Persistence (Priority: P2)

**Goal**: Conversation history loads and persists across sessions

**Independent Test**: User sends messages, closes chat, returns later, and sees previous messages.

### Backend Service (US5)

- [ ] T080 [US5] Implement conversation history loading in ChatbotService
- [ ] T081 [P] [US5] Implement message history formatting for Cohere API
- [ ] T082 [US5] Implement conversation list endpoint in backend/src/api/routes/chat.py

### Frontend (US5)

- [ ] T083 [US5] Implement conversation history loading in useChat hook
- [ ] T084 [P] [US5] Implement scroll position preservation in ChatPanel.tsx
- [ ] T085 [US5] Implement conversation switching UI in ChatPanel.tsx

**Checkpoint**: User Story 5 complete - conversation persistence working

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T090 [P] Implement input sanitization before sending to Cohere
- [ ] T091 [P] Add error handling for empty/whitespace messages
- [ ] T092 [US1] Add friendly error messages for task not found
- [ ] T093 [US2] Add friendly error messages for identity queries
- [ ] T094 [US4] Implement auto-scroll to bottom on new message
- [ ] T095 [P] [US4] Add dark/light theme support to chat components
- [ ] T096 [P] [US4] Implement scroll-to-bottom button when not at latest
- [ ] T097 Create IMPLEMENTATION_LOG.md documenting phase completions
- [ ] T098 [P] Update README.md with Cohere setup and AI Magic Highlights

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-7)**: All depend on Foundational phase completion
  - US1, US2, US4 can proceed in parallel after Foundational
  - US3 depends on US1 completion (uses tool chaining)
  - US5 depends on US4 completion (frontend integration)
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (Natural Language Task Management)**: Can start after Foundational
- **US2 (User Identity Queries)**: Can start after Foundational (independent)
- **US3 (Multi-Step Operations)**: Depends on US1 completion
- **US4 (Frontend Chatbot Interface)**: Can start after Foundational (independent)
- **US5 (Conversation Persistence)**: Depends on US4 completion

### Within Each User Story

- Tools before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel
- US1, US2, US4 can start in parallel after Foundational
- All frontend components marked [P] can run in parallel

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test natural language task management
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 4 → Test independently → Deploy/Demo
5. Add User Story 3 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Polish phase → Final demo-ready version

### Parallel Team Strategy

With multiple agents:

1. Agent A: Complete Setup + Foundational
2. Agent B: User Story 1 (Backend tools + service)
3. Agent C: User Story 4 (Frontend components)
4. Agent D: User Story 2 (Identity queries)
5. Once Foundational is done:
   - Agent A: User Story 5 (Conversation persistence)
   - Agent B: User Story 3 (Multi-step operations)
6. Polish together

---

## Summary

| Metric | Value |
|--------|-------|
| Total Tasks | 98 |
| Setup Tasks | 3 |
| Foundational Tasks | 10 |
| US1 Tasks | 14 |
| US2 Tasks | 3 |
| US3 Tasks | 3 |
| US4 Tasks | 12 |
| US5 Tasks | 5 |
| Polish Tasks | 9 |
| Parallelizable Tasks | ~40 |

**Suggested MVP**: Phases 1-3 (Setup, Foundational, US1)
- **Task Count**: 27 tasks
- **Deliverable**: Working chatbot backend with natural language task management

**Next Steps After MVP**:
1. US2 (Identity queries) - 3 tasks
2. US4 (Frontend UI) - 12 tasks
3. US3 (Multi-step) - 3 tasks
4. US5 (Persistence) - 5 tasks
5. Polish - 9 tasks
