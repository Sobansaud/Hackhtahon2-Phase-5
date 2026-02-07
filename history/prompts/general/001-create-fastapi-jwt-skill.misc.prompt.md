---
id: 1
title: Create FastAPI JWT Middleware Skill
stage: misc
date: 2025-12-31
surface: agent
model: claude-opus-4-5-20251101
feature: none
branch: 001-frontend-todo-ui
user: dell
command: none
labels: [skill, fastapi, jwt, auth]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .claude/skills/fastapi-jwt/skill.md
tests:
  - none
---

## Prompt

Create a skill named FastAPI JWT Middleware with these instructions:
Implement secure JWT verification middleware for FastAPI.

Extract Bearer token from header.
Verify signature using BETTER_AUTH_SECRET env var.
Decode to get user_id and email.
Validate user_id matches route path.
Raise HTTPException 401/403 on failure.
Dependency injectable for routes.

## Response snapshot

I have created the FastAPI JWT Middleware skill. I first checked the existing skills to understand the project's structure and template, then created a new directory `.claude/skills/fastapi-jwt/` and wrote the `skill.md` file with the requested instructions and implementation details.

## Outcome

- ✅ Impact: Established a reusable skill for implementing secure JWT authentication in FastAPI.
- 🧪 Tests: None run.
- 📁 Files: Created `.claude/skills/fastapi-jwt/skill.md`.
- 🔁 Next prompts: None.
- 🧠 Reflection: Followed project standards for skill creation and PHR recording.

## Evaluation notes (flywheel)

- Failure modes observed: Initial attempt to read a non-existent template failed, but navigated using `ls`.
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
