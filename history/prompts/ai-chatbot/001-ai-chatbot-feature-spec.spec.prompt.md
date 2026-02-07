---
id: "001"
title: "AI Chatbot Feature Specification"
stage: "spec"
date: "2026-01-06"
surface: "agent"
model: "claude-opus-4-5-20251101"
feature: "ai-chatbot"
branch: "004-ai-chatbot"
user: "user"
command: "/sp.specify"
labels: [specification,phase3,chatbot,cohere]
links:
  spec: "specs/004-ai-chatbot/spec.md"
  ticket: null
  adr: null
  pr: null
files:
  - "specs/004-ai-chatbot/spec.md"
  - "specs/004-ai-chatbot/checklists/requirements.md"
tests:
  - "none"
---

## Prompt

AI Todo Chatbot Integration for The Evolution of Todo - Phase III: Full-Stack Web Application
Target audience: Hackathon judges seeking groundbreaking, production-grade AI integrations; developers building flagship intelligent productivity apps; and AI agents delivering flawless execution via Claude Code.
Focus: Define exhaustive, zero-ambiguity, flagship-level specifications for integrating a powerful, natural-language AI Todo Chatbot into the existing full-stack application (Next.js frontend + FastAPI backend + Neon DB + Better Auth). The chatbot must have full control over all core task operations (add, delete, update, mark complete, list) and user information (e.g., "Who am I?" -> reply with logged-in email), using Cohere API (not OpenAI/Gemini) for all AI reasoning and tool calling. Adapt agent-style logic from the provided OpenAI Agents SDK example to Cohere's chat/completions endpoint. The chatbot UI must be beautifully integrated into the existing premium frontend with a floating chatbot icon/button that opens a stunning, responsive chat panel -- maintaining visual harmony with the flagship UI.
Success criteria: Deliverase Extensions for Conversations, Backend Chat Endpoint, Frontend Chatbot UI Integration, Natural Language Examples & Flows, Security & User Isolation, Error Handling & Confirmations, TypeScript/Frontend Types, Acceptance Criteria, Detailed Wireframes & Interaction Flows).
Version: v1.0, include current date (January 06, 2026).
AI Provider: Cohere API only (via COHERE_API_KEY) -- no OpenAI, Gemini, or other models.
Tools: Adapt agent logic using Cohere chat completions: prompt model to reason step-by-step, output structured JSON for tool calls, parse and execute.
Dependencies: Existing stack + cohere python library, no OpenAI Agents SDK.
Frontend Integration: Add chatbot trigger button (floating action, premium design), beautiful chat panel (glassmorphic, themed bubbles, scrollable history), real-time message streaming if possible.
Stateless backend: No server-held conversation state -- persist everything in DB (Conversation + Message models).
Use async operations throughout backend.
Keep specs visionary yet surgically implementable (under 4000 words).

Specific Requirements:

Cohere API Adaptation
Replace OpenAI Agents SDK with direct Cohere chat calls.
Prompt engineering: Instruct Cohere to think step-by-step, identify intent, output JSON tool call if needed, or respond directly.
Parse Cohere response for tool invocation (JSON block), execute tool, feed result back if multi-step needed.

MCP-Style Tools (6 total)
add_task, delete_task, update_task, complete_task, list_tasks (as before)
get_current_user -> returns {"email": str, "user_id": str}

Database Extensions
Conversation: id, user_id, created_at
Message: id, conversation_id, role ("user"/"assistant"), content, created_at

Backend Endpoint
POST /api/{user_id}/chat
Body: {conversation_id (optional), message: str}
Response: {conversation_id, response: str, tool_calls: array (optional)}

Frontend UI
Floating chatbot button (bottom-right, emerald accent, subtle pulse animation)
Slide-in chat panel (glassmorphic card, dark/light theme aware)
Message bubbles: user (right, indigo), assistant (left, slate), with timestamps
Input bar with send button (SVG paper plane)
Typing indicator, scroll to bottom, loading states

Natural Language Handling
Full coverage: adding tasks with/without description, listing with filters, completing/deleting by title or ID, updating, asking about self.

Not building:
Actual code (reserved for agents).
Voice input, file attachments, real-time streaming beyond basic.
Custom Cohere fine-tuning.

Generate immediately -- this specification must guarantee the creation of the most intelligent, beautiful, and seamlessly integrated AI Todo chatbot in hackathon history. Absolute flagship quality. No compromises.

## Response snapshot

Created comprehensive spec at `specs/004-ai-chatbot/spec.md` with:
- 5 user stories (Natural Language Task Management, User Identity Queries, Multi-Step Operations, Frontend Chatbot Interface, Conversation Persistence)
- 15 functional requirements covering all core operations
- 8 measurable success criteria
- Cohere API adaptation strategy documented
- 6 MCP-style tool specifications
- Full backend endpoint contract
- Database schema extensions (Conversation, Message)
- Detailed frontend UI wireframes (floating button, glassmorphic panel, bubbles)
- Natural language examples table
- Security and error handling specifications
- TypeScript type definitions
- Checklist validated with all items passing

## Outcome

- ✅ Impact: Complete Phase III chatbot specification ready for planning
- 🧪 Tests: None required - spec validation via checklist
- 📁 Files: specs/004-ai-chatbot/spec.md (400+ lines), checklists/requirements.md
- 🔁 Next prompts: /sp.plan for implementation architecture
- 🧠 Reflection: Specification covers all required sections without [NEEDS CLARIFICATION] markers. Cohere adaptation documented at strategy level without implementation details. Frontend UI requirements detailed enough for implementation.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A - checklist validation used
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
