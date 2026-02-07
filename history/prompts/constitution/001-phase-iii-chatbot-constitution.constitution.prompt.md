---
id: "001"
title: "Phase III Chatbot Constitution"
stage: "constitution"
date: "2026-01-06"
surface: "agent"
model: "claude-opus-4-5-20251101"
feature: "none"
branch: "main"
user: "user"
command: "/sp.constitution"
labels: [constitution,phase3,chatbot]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - ".specify/memory/constitution.md"
tests:
  - "none"
---

## Prompt

AI Todo Chatbot Integration for The Evolution of Todo - Phase III: Full-Stack Web Application

Target audience: Hackathon judges evaluating cutting-edge agentic AI integrations, developers building intelligent productivity tools, and AI agents (Claude Code) implementing via Spec-Kit Plus in a (e.g., "Who am I?" → "Logged in as example@email.com"), confirmations, error handling, and graceful responses.

Integrates seamlessly into existing backend: single stateless /api/{user_id}/chat endpoint, MCP tools exposed, Cohere API for AI reasoning/tool invocation.

Adapts OpenAI-style agent behavior to Cohere API: use Cohere's chat endpoint for multi-turn conversations with tool calls.

Ensures multi-user security: JWT auth for user_id, task isolation, conversation persistence per user.

Generates a complete Markdown file (constitution.md) version v3.0 placed at repository root — ready to guide all Phase III specs, plans, agents, and implementations.

Resulting chatbot feels intelligent, helpful, and production-ready: handles complex queries (e.g., "Add weekly meeting and list pending tasks") by chaining tools.

Constraints:

Format: Markdown with deeply structured sections (Project Overview, Core Requirements, Chatbot Functionality & Natural Language Handling, Authentication & Security, Non-Functional Requirements, Technology Stack and Tools, Development Workflow, Monorepo Updates, Database Extensions, MCP Tools Specification, Cohere API Adaptation, Guiding Principles, Deliverables and Success Criteria).

Version: v3.0 (Phase III), include current date (January 06, 2026).

Strictly integrate into existing monorepo: extend /backend with MCP server and chat endpoint; add ChatKit to /frontend if needed.

Dependencies limited to: Existing stack (FastAPI, SQLModel, Neon PostgreSQL, Better Auth) + Cohere API (for AI chat/completions), Official MCP SDK (for tools), no additional frameworks.

Cohere Adaptation: Use Cohere's API key for all AI calls; simulate agent/tool-calling by structuring prompts to reason step-by-step and output tool invocation JSON.

Stateless: No server state — persist conversations/messages in DB.

No manual coding: All via Claude Code agents/skills.

Keep concise yet exhaustive (under 3000 words).

Reference Phase I/II briefly as completed foundation.

Specific Sections Required:

Project Overview – Summarize evolution to AI chatbot, objective: natural language task management with full functionality.

Core Requirements – Conversational interface for 5 basic features, user email queries, stateless endpoint.

Chatbot Functionality & Natural Language Handling – Detail flows, examples (e.g., "Add task" → add_task tool), confirmations, errors.

Authentication & Security – JWT for user_id/email extraction, isolation in tools/conversations.

Non-Functional Requirements – Clean code, async ops, scalability, graceful errors.

Technology Stack and Tools – Extend Phase II: Cohere API for AI, MCP SDK for tools, ChatKit frontend.

Development Workflow – Agentic: spec → plan → tasks → Claude Code; Cohere API key usage.

Monorepo Updates – Extend structure: add chatbot routes, DB models (Conversation, Message).

Database Extensions – New models: Conversation (user_id, id), Message (conversation_id, role, content).

MCP Tools Specification – Exact 5 tools with params/returns, stateless DB interaction.

Cohere API Adaptation – Detail how to adapt agent logic: prompt Cohere for reasoning/tool calls, parse JSON output.

Guiding Principles – AI-first, stateless, security, no manual code, hackathon transparency.

Deliverables and Success Criteria – Working chatbot, repo updates, demo: natural queries handle full features.

Environment Variables:

COHERE_API_KEY=ZCpzCoO6NkF4Ed9TYZjbYKH3Stom3P1d1yNSdgCt (for AI calls)

Use existing BETTER_AUTH_SECRET, DATABASE_URL.

Generate immediately — this constitution must guarantee a seamless, intelligent, error-free chatbot integration that elevates the full-stack app to flagship AI status. Perfection in every detail.

## Response snapshot

Phase III constitution created at `.specify/memory/constitution.md` with version 3.0.0. Includes: Project Overview (Phase III chatbot integration), Core Requirements (5 features, stateless endpoint), Chatbot Functionality (message flow, tool mapping, confirmations/errors), Authentication & Security (JWT, user isolation), Non-Functional Requirements, Technology Stack (Cohere API, MCP SDK added), Development Workflow, Monorepo Updates (chat.py, chatbot.py, mcp/tools), Database Extensions (Conversation, Message models), MCP Tools Specification (5 tools with params), Cohere API Adaptation (step-by-step reasoning approach), Guiding Principles, Deliverables. Sync Impact Report added at top. Templates verified compatible.

## Outcome

- ✅ Impact: Constitution updated to v3.0.0 with complete Phase III chatbot governance
- 🧪 Tests: None required for constitution updates
- 📁 Files: .specify/memory/constitution.md (218 lines)
- 🔁 Next prompts: /sp.specify for chatbot feature, /sp.plan for implementation architecture
- 🧠 Reflection: Templates remain compatible with Phase III - Constitution Check in plan-template.md valid as-is

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
