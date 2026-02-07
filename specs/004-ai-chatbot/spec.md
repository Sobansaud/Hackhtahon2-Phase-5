# Feature Specification: AI Todo Chatbot Integration

**Feature Branch**: `004-ai-chatbot`
**Created**: 2026-01-06
**Status**: Draft
**Input**: User description: "AI Todo Chatbot Integration for The Evolution of Todo - Phase III"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Natural Language Task Management (Priority: P1)

As a user, I want to add, list, complete, update, and delete tasks using natural language messages so that I can manage my todo list without navigating through forms or menus.

**Why this priority**: This is the core value proposition of the chatbot - enabling hands-free, conversational task management that feels intuitive and efficient.

**Independent Test**: User sends "Add weekly meeting for Friday" and receives confirmation that the task was created. Task appears in subsequent task lists.

**Acceptance Scenarios**:

1. **Given** the user has an authenticated session, **When** they send "Add buy groceries", **Then** a task titled "buy groceries" is created with default status "pending".
2. **Given** the user has tasks in their list, **When** they send "List all pending tasks", **Then** the chatbot returns a formatted list of pending tasks.
3. **Given** a task exists in the user's list, **When** they send "Complete task #3", **Then** task #3 is marked as complete and the user receives confirmation.
4. **Given** a task exists in the user's list, **When** they send "Delete task Buy Groceries", **Then** the task is removed and the user receives confirmation.

---

### User Story 2 - User Identity Queries (Priority: P1)

As a user, I want to ask the chatbot about my identity so that I can verify which account I'm logged in with.

**Why this priority**: Enables users to confirm their authenticated identity through natural conversation, building trust and clarity.

**Independent Test**: User sends "Who am I?" and receives a response showing their email address and user ID.

**Acceptance Scenarios**:

1. **Given** the user is authenticated with email "user@example.com", **When** they send "Who am I?" or "What's my email?", **Then** the chatbot responds with "You are logged in as user@example.com".
2. **Given** the user is authenticated, **When** they send "What is my user ID?", **Then** the chatbot returns the user's UUID.

---

### User Story 3 - Complex Multi-Step Operations (Priority: P2)

As a user, I want to perform multiple operations in a single message so that I can efficiently manage my tasks in natural conversation flow.

**Why this priority**: Enables power users to chain operations (e.g., "Add meeting and list all tasks") without back-and-forth, showcasing the AI's capability.

**Independent Test**: User sends "Add weekly planning meeting and list all pending tasks" and both operations complete successfully with results shown.

**Acceptance Scenarios**:

1. **Given** the user has pending tasks, **When** they send "Add submit report and list all tasks", **Then** a new task "submit report" is created AND the complete task list is displayed.
2. **Given** the user has tasks, **When** they send "Complete all pending tasks", **Then** the system marks all pending tasks as complete and confirms the action.

---

### User Story 4 - Frontend Chatbot Interface (Priority: P1)

As a user, I want to access the chatbot from any screen via a floating button so that I can manage tasks conveniently without leaving my current context.

**Why this priority**: Provides immediate, always-available access to conversational task management with a premium, visually appealing interface.

**Independent Test**: User sees a floating emerald button in the bottom-right corner. Clicking opens a glassmorphic chat panel. Messages display with appropriate styling and timestamps.

**Acceptance Scenarios**:

1. **Given** the user is on any page of the application, **When** they scroll to the bottom-right corner, **Then** they see a floating chatbot button with a subtle pulse animation.
2. **Given** the chatbot button is visible, **When** the user clicks it, **Then** a slide-in chat panel appears with a glassmorphic effect, maintaining theme consistency.
3. **Given** the chat panel is open, **When** the user sends a message, **Then** it appears in an indigo bubble on the right side with timestamp.
4. **Given** the assistant is processing, **When** a response is being generated, **Then** a typing indicator is displayed.

---

### User Story 5 - Conversation Persistence (Priority: P2)

As a returning user, I want my conversation history to persist so that I can continue natural conversations across sessions.

**Why this priority**: Enables context-aware conversations and provides chat history for reference, improving user experience and productivity.

**Independent Test**: User sends messages, closes chat, returns later, and sees previous messages in the conversation.

**Acceptance Scenarios**:

1. **Given** the user has sent messages in a previous session, **When** they open the chat panel, **Then** previous conversation history is loaded and displayed.
2. **Given** the user has multiple conversations, **When** they continue a specific conversation, **Then** only messages from that conversation thread are shown.

---

### Edge Cases

- **Empty conversation history**: When no messages exist, the chatbot should show a welcome message and example prompts.
- **Ambiguous task references**: When user says "complete the task" without specifying which, the chatbot should ask for clarification.
- **Non-existent task IDs**: When user references task #999 that doesn't exist, the chatbot should return a friendly error.
- **Rate limiting**: When too many requests are made, the chatbot should gracefully inform the user and suggest waiting.
- **Network failures**: If Cohere API is unavailable, the chatbot should fallback to a friendly error message.
- **Invalid message content**: Empty or whitespace-only messages should be rejected with a helpful prompt.
- **Concurrent sessions**: User should only see their own conversations, not other users' messages.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST enable users to add tasks via natural language messages (e.g., "Add weekly meeting", "Create task buy groceries").
- **FR-002**: System MUST enable users to list tasks with optional filters (all, pending, completed) via natural language.
- **FR-003**: System MUST enable users to complete tasks by ID or title via natural language.
- **FR-004**: System MUST enable users to delete tasks by ID or title via natural language.
- **FR-005**: System MUST enable users to update task properties (title, description, status) via natural language.
- **FR-006**: System MUST respond to identity queries ("Who am I?") with the user's email and user ID from JWT.
- **FR-007**: System MUST parse Cohere API responses to detect and execute JSON-formatted tool calls.
- **FR-008**: System MUST persist all messages to the database with conversation threading.
- **FR-009**: System MUST maintain user isolation - users can only access their own tasks, conversations, and messages.
- **FR-010**: System MUST provide action confirmations for all task modifications (e.g., "Task 'weekly meeting' added successfully").
- **FR-011**: System MUST provide friendly error messages for failures without exposing technical details.
- **FR-012**: System MUST display a floating chatbot button on all frontend pages.
- **FR-013**: System MUST render chat messages in styled bubbles with timestamps.
- **FR-014**: System MUST support dark and light themes for the chat interface.
- **FR-015**: System MUST auto-scroll to the latest message when new content arrives.

### Key Entities *(include if feature involves data)*

- **Conversation**: Represents a chat session belonging to a user. Contains a unique ID, foreign key to user, and timestamps for creation and last update.
- **Message**: Represents an individual chat message within a conversation. Contains role (user/assistant), content, and creation timestamp.
- **Task**: Existing entity extended by chatbot operations. No schema changes required for chatbot functionality.
- **User**: Existing entity. Chatbot queries user info via JWT extraction.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can successfully complete all 5 core task operations (add, delete, update, list, complete) via natural language within 3 attempts maximum.
- **SC-002**: Chatbot responds to user messages within 5 seconds for simple queries, 10 seconds for tool-execution queries.
- **SC-003**: 95% of identity queries ("Who am I?") return the correct user email from JWT.
- **SC-004**: All chatbot interactions maintain user isolation - no user can access another user's tasks or conversations.
- **SC-005**: Chat interface loads and renders within 2 seconds on standard connections.
- **SC-006**: 90% of user messages are correctly understood and result in appropriate tool calls or responses.
- **SC-007**: Conversation history persists correctly across browser sessions.
- **SC-008**: Chatbot UI maintains visual harmony with existing premium frontend design.

## Additional Sections

### Cohere API Adaptation

The chatbot integrates with Cohere's chat/completions endpoint instead of OpenAI Agents SDK. The adaptation approach:

**System Prompt Configuration**: Cohere receives a structured system prompt defining its role as a task management assistant with access to specific tools. The prompt instructs the model to:
- Think step-by-step before responding
- Identify when a tool call is needed
- Output tool calls as JSON blocks
- Respond directly when no tool call is needed

**Tool Call Detection**: The backend parses Cohere responses for JSON blocks in the format:
```json
{
  "tool": "tool_name",
  "params": {
    "param1": "value1",
    "param2": "value2"
  }
}
```

**Multi-Step Execution**: For complex requests requiring multiple tools:
1. Initial message sent to Cohere with full conversation history
2. Response parsed for tool calls
3. Tools executed sequentially, results collected
4. Results fed back to Cohere for next reasoning step
5. Final natural language response generated

**Prompt Engineering Strategy**:
- Clear tool descriptions with parameter types and examples
- Reasoning instructions: "Think step by step"
- Output format constraints: JSON for tool calls, natural language for responses
- Error handling guidance: "If unsure, ask for clarification"

### MCP-Style Tool Specifications

| Tool Name | Parameters | Returns | Description |
|-----------|------------|---------|-------------|
| `add_task` | `title: string`, `description?: string`, `status?: string` | Task object | Creates a new task with given title, optional description, default status "pending" |
| `list_tasks` | `status?: string` ("all", "pending", "completed"), `limit?: number` | Task array | Retrieves user's tasks, optionally filtered by status |
| `complete_task` | `task_id: number` | Success boolean | Marks specified task as complete |
| `delete_task` | `task_id: number` | Success boolean | Deletes specified task from user's list |
| `update_task` | `task_id: number`, `title?: string`, `description?: string`, `status?: string` | Updated task | Modifies task properties |
| `get_current_user` | (none) | `{"email": string, "user_id": string}` | Returns authenticated user's identity from JWT |

All tools enforce user_id isolation - only tasks/conversations belonging to the authenticated user are accessed.

### Backend Endpoint Specification

**Endpoint**: `POST /api/{user_id}/chat`

**Request Body**:
```typescript
{
  conversation_id?: string,  // Optional: continue existing conversation
  message: string            // User's natural language message
}
```

**Response**:
```typescript
{
  conversation_id: string,   // Conversation identifier for threading
  response: string,          // Chatbot's natural language response
  tool_calls?: Array<{       // Optional: for debugging/transparency
    tool: string,
    params: Record<string, unknown>,
    result: unknown
  }>
}
```

**Authentication**: JWT token required in Authorization header. user_id extracted from token and validated against path parameter.

**Error Responses**:
- 400: Invalid request (missing message, invalid conversation_id)
- 401: Missing or invalid JWT token
- 403: user_id mismatch (token user != path user_id)
- 500: Internal error (Cohere API failure, database error)

### Database Extensions

**Conversation Model**:
- `id`: UUID primary key
- `user_id`: Foreign key to users table, CASCADE delete
- `created_at`: Timestamp of conversation creation
- `updated_at`: Timestamp of last message

**Message Model**:
- `id`: UUID primary key
- `conversation_id`: Foreign key to conversations, CASCADE delete
- `role`: Enum ("user", "assistant", "system")
- `content`: Text content of the message
- `created_at`: Timestamp of message creation

**Indexes**:
- conversations(user_id) for user conversation lookup
- messages(conversation_id) for conversation message loading

### Frontend Chatbot UI Specifications

**Floating Trigger Button**:
- Position: Fixed bottom-right, 16px margin from edges
- Size: 56px diameter circle
- Color: Emerald green (#10b981) with subtle shadow
- Animation: Gentle pulse animation when idle (scale 1.0 to 1.05, repeat)
- Icon: Chat bubble or robot icon using SVG

**Slide-In Chat Panel**:
- Position: Fixed right edge, full height minus header offset
- Width: 400px on desktop, 100% on mobile (< 640px)
- Appearance: Glassmorphic card with backdrop blur, rounded corners
- Theme: Dark/light mode aware with appropriate contrast
- Animation: Slide in from right over 300ms ease-out

**Message Bubbles**:
- User messages: Right-aligned, indigo background (#6366f1), white text
- Assistant messages: Left-aligned, slate background (#f1f5f9), dark text
- Timestamps: Small text below bubble, visible on hover or always if space permits
- Maximum width: 80% of panel width
- Spacing: 8px between bubbles

**Input Area**:
- Position: Fixed at bottom of chat panel
- Components: Text input field + send button
- Input: Rounded corners, focus ring, placeholder text
- Send button: SVG paper plane icon, disabled when input empty
- Height: 60px total, auto-resize on multi-line if needed

**Loading States**:
- Typing indicator: Three animated dots in assistant bubble color
- Button state: Disabled with spinner during API call
- Initial load: Skeleton or spinner while fetching history

**Scroll Behavior**:
- Auto-scroll to bottom on new message
- Scroll position preserved when panel closed/reopened
- Scroll to bottom button appears when not at latest

### Natural Language Examples

| User Input | Interpreted Action | Example Response |
|------------|-------------------|------------------|
| "Add weekly meeting" | add_task(title="weekly meeting") | "I've added 'weekly meeting' to your tasks." |
| "Add buy groceries with milk and bread" | add_task(title="buy groceries", description="milk and bread") | "Added 'buy groceries' with description 'milk and bread'." |
| "List all pending tasks" | list_tasks(status="pending") | "Here are your pending tasks:\n1. Weekly meeting\n2. Buy groceries" |
| "List completed tasks" | list_tasks(status="completed") | "You have no completed tasks yet." |
| "Complete task #1" | complete_task(task_id=1) | "Task #1 'weekly meeting' is now complete." |
| "Mark the groceries task done" | complete_task by title match | "Task 'buy groceries' is now complete." |
| "Delete task #2" | delete_task(task_id=2) | "Task #2 has been deleted." |
| "Remove buy groceries" | delete_task by title match | "Task 'buy groceries' has been deleted." |
| "Update task #1 to high priority" | update_task(task_id=1, priority="high") | "Updated task #1 priority to high." |
| "Who am I?" | get_current_user | "You are logged in as user@example.com." |
| "What's my email?" | get_current_user | "Your email is user@example.com." |
| "Add meeting and list all tasks" | add_task + list_tasks | (See multi-step scenario above) |

### Security & User Isolation

- **JWT Validation**: All chat requests require valid JWT token via Authorization header
- **user_id Extraction**: user_id extracted from JWT claims, validated against path parameter
- **Query Filtering**: All database queries include user_id WHERE clause
- **Conversation Ownership**: Users can only access conversations with matching user_id
- **No Cross-Tenant Access**: API design prevents任何 user from accessing another user's data
- **Input Sanitization**: User messages sanitized before sending to Cohere to prevent prompt injection
- **Rate Limiting**: Implemented at API gateway level to prevent abuse

### Error Handling & Confirmations

**Successful Operations**:
- Task creation: "I've added '[task title]' to your tasks."
- Task completion: "Task '[title]' is now complete."
- Task deletion: "Task '[title]' has been deleted."
- Task update: "Updated '[title]' - [changes applied]."

**Error Scenarios**:
- Task not found: "I couldn't find task #[id]. It may have already been deleted."
- Ambiguous task: "I see multiple tasks matching '[phrase]'. Which one? [list options]"
- Empty message: "Please enter a message."
- API failure: "Sorry, I'm having trouble connecting. Please try again."
- Rate limit: "Too many requests. Please wait a moment before sending another message."

### TypeScript/Frontend Types

```typescript
// Chat message type
interface ChatMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Chat state
interface ChatState {
  isOpen: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  conversationId: string | null;
}

// API request/response
interface ChatRequest {
  conversation_id?: string;
  message: string;
}

interface ChatResponse {
  conversation_id: string;
  response: string;
  tool_calls?: ToolCallInfo[];
}

interface ToolCallInfo {
  tool: string;
  params: Record<string, unknown>;
  result: unknown;
}

// User identity (from JWT)
interface CurrentUser {
  email: string;
  user_id: string;
}
```

### Assumptions

- Cohere API key (COHERE_API_KEY) is available in environment variables
- Better Auth JWT secret (BETTER_AUTH_SECRET) is available for token validation
- Existing Task and User models remain unchanged
- Frontend already has theme context (dark/light mode) that chatbot can consume
- Database migrations can be applied without data loss
- Users have stable internet connections for API calls
- Cohere's chat completions endpoint supports conversation history context
- Mobile view (< 640px) will show full-width chat panel

### Dependencies

- **Backend**: cohere Python library for API calls
- **Frontend**: No additional dependencies beyond existing stack
- **Database**: PostgreSQL with existing SQLModel setup
- **External**: Cohere API with valid API key

### Out of Scope (Not Building)

- Voice input or speech-to-text
- File attachments or image uploads
- Real-time streaming beyond basic response delivery
- Custom Cohere model fine-tuning
- Multi-language support beyond English
- Chatbot training or learning from conversations
- Webhook integrations
- Email/SMS notifications from chatbot
