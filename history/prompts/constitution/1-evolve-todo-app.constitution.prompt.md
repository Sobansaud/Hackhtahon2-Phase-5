---
id: 1
title: "Evolve Todo App"
stage: constitution
date_iso: "2025-12-30"
surface: "agent"
model: "claude-opus-4-5-20251101"
feature: "none"
branch: "master"
user: "user"
command: "/sp.constitution"
labels: ["constitution", "todo-app", "fullstack", "phase-ii"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - ".specify/memory/constitution.md"
tests_yaml: []
---

# Prompt

```
Full-Stack Web Application for The Evolution of Todo - Phase II
Target audience: Hackathon judges evaluating advanced agentic full-stack development, developers building secure multi-user todo apps, and AI agents (Claude Code) implementing via Spec-Kit Plus in a monorepo.
Focus: Create a comprehensive, authoritative constitution that officially transitions the project from Phase I (in-memory console app) to Phase II (modern multi-user full-stack web application with persistent storage). This document serves as the foundational governance for the entire Phase II, defining high-level goals, requirements, security model, technology stack, monorepo structure, and strict agentic development rules.
Success criteria:

Clearly articulates the evolution: from single-user console to multi-user web with authentication and Neon PostgreSQL persistence.
Details the 5 core task features in web context, RESTful API endpoints, and mandatory user isolation.
Thoroughly explains JWT-based authentication bridge between Better Auth (Next.js frontend)fly as completed foundation without repeating console details.
Timeline: Generate immediately to officially launch Phase II agentic development.

Specific Sections Required:

Project Overview – Summarize evolution to multi-user web app, MVP focus on core features + auth + persistence.
Core Requirements – Describe the 5 basic features (Add, Delete, Update, View, Mark Complete) in web/multi-user context; list exact REST API endpoints with methods, paths, descriptions, and authentication requirements.
Authentication & Security – Detail JWT solutio and FastAPI backend using shared BETTER_AUTH_SECRET.
Defines monorepo organization with Spec-Kit Plus folder structure and layered CLAUDE.md files.
Establishes no-manual-coding rule: all implementation via Claude Code agents and skills only.
Generates a complete Markdown file (constitution.md) version v2.0 placed at repository root – ready to guide all subsequent specs, plans, and agent actions.
Reader/agent can fully understand project vision, constraints, and workflow solely from this document.

Constraints:

Format: Markdown with deeply structured sections (Project Overview, Core Requirements, Authentication & Security, Non-Functional Requirements, Technology Stack and Tools, Development Workflow, Monorepo Structure, Guiding Principles, Deliverables and Success Criteria).
Version: v2.0, include current date (December 30, 2025).
Strictly monorepo structure with separate frontend/ and backend/ folders.
Dependencies limited to: Next.js 16+ (App Router), TypeScript, Tailwind CSS, Better Auth (with JWT plugin: Better Auth issues tokens → frontend attaches to headers → FastAPI middleware verifies and extracts user_id → enforces user isolation on all operations; include shared secret usage and security benefits.
Non-Functional Requirements – Clean code (TypeScript standards, PEP 8), modularity, type safety, responsive UI, error handling (HTTP codes, user-friendly messages), performance, accessibility basics.
Technology Stack and Tools – List layers with exact technologies; include Claude Code, Spec-Kit Plus, Docker Compose for local dev.
Development Workflow – Outline agentic dev stack: constitution → specs → plan → agents/skills → implementation → testing → iteration; emphasize no manual coding.
Monorepo Structure – Provide complete folder layout including .spec-kit/config.yaml, specs/ subfolders (features/, api/, database/, ui/), layered CLAUDE.md files (root, frontend, backend), frontend/ and backend/ code locations, docker-compose.yml.
Guiding Principles – Spec-first development, security by design (user isolation), simplicity, maintainability, preparation for Phase III (chatbot), full process transparency for hackathon judging.
Deliverables and Success Criteria – Working full-stack app runnable via docker-compose; all features functional via responsive UI and API; secure multi-user isolation; clean, agent-generated code; comprehensive specs history; demo-ready with sample users/tasks.

Ensure language is formal, precise, and actionable. Use bullet points, tables (e.g., for API endpoints, tech stack), and code snippets where helpful. The constitution must be self-contained and serve as the primary reference for all Phase II agents.
```

# Response

Constitution file updated at `.specify/memory/constitution.md` with the following changes:

- Updated version to 2.0
- Added comprehensive Project Overview section
- Defined 6 core principles specific to Phase II development
- Included detailed Authentication & Security section with JWT implementation details
- Listed complete Non-Functional Requirements
- Documented Technology Stack and Tools for both frontend and backend
- Outlined Development Workflow with agentic development compliance
- Provided complete Monorepo Structure with folder layout
- Established Guiding Principles for the project
- Defined Deliverables and Success Criteria
- Added proper Governance section
- Set current date (2025-12-30) as ratification and amendment date