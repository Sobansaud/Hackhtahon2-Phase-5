---
id: "007"
title: "Create 5 Chatbot Phase Skills"
stage: "misc"
date: "2026-01-06"
surface: "agent"
model: "sonnet"
feature: "none"
branch: "main"
user: "Claude User"
command: "/agents (create 5 skills)"
labels: ["skill","chatbot","phase3","mcp","chatkit"]
links:
  spec: "null"
  ticket: "null"
  adr: "null"
  pr: "null"
files:
  - ".claude/skills/integrate-openai-agents/SKILL.md"
  - ".claude/skills/manage-conversation-db/SKILL.md"
  - ".claude/skills/configure-chatkit/SKILL.md"
  - ".claude/skills/nl-to-tools-mapper/SKILL.md"
  - ".claude/skills/errors-confirmations/SKILL.md"
tests: []
---

## Prompt

Create This All Skills In skills folder sabka alagalag folder ho skills folder kai ander

1. **Name: Integrate OpenAI Agents**
   - Setup Agents SDK in FastAPI endpoint
   - Build message array from DB history
   - Run agent with MCP tools
   - Parse tool calls, execute, return response
   - Save full conversation to DB

2. **Name: Manage Conversation DB**
   - Handle stateless conversation persistence
   - Create/load conversation by ID
   - Save user/assistant messages with role/content
   - Fetch history for agent input
   - Async queries

3. **Name: Configure ChatKit**
   - Setup OpenAI ChatKit in Next.js
   - Add domain allowlist key to env
   - Build chat UI component
   - POST to /api/chat endpoint with conversation_id
   - Display history, tool calls visually
   - Integrate Better Auth session

4. **Name: Map NL to Tools**
   - Guide agent to map user input to tools
   - "Add task" → add_task
   - "List pending" → list_tasks(status="pending")
   - Handle chains (list then delete)
   - User email: Extract from JWT, respond in natural language

5. **Name: Handle Errors & Confirmations**
   - Implement graceful errors in backend/frontend
   - Tool not found → "Task not found, try again"
   - Always confirm actions in response (e.g., "Task added!")
   - Frontend: Show error toasts, loading indicators

## Response snapshot

Created 5 comprehensive skills for Phase 3 Chatbot implementation:

1. **integrate-openai-agents** - FastAPI endpoint with OpenAI Agents SDK, message history, tool execution
2. **manage-conversation-db** - Conversation/message schema, async CRUD operations
3. **configure-chatkit** - Next.js chat UI with ChatKit, Better Auth integration
4. **nl-to-tools-mapper** - Intent detection, parameter extraction, tool chaining
5. **errors-confirmations** - Toast notifications, loading states, error boundaries

## Outcome

- ✅ Impact: Complete skill set for Phase 3 chatbot development
- 🧪 Tests: Not applicable (skill creation)
- 📁 Files: 5 skill files created
- 🔁 Next prompts: Use individual skills during implementation
- 🧠 Reflection: Skills cover full chatbot stack - backend, database, frontend, error handling

## Evaluation notes (flywheel)

- Failure modes observed: "null"
- Graders run and results (PASS/FAIL): "N/A"
- Prompt variant (if applicable): "null"
- Next experiment (smallest change to try): "null"
