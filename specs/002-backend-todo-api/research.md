# Research: Backend Implementation for Todo API

**Date**: 2026-01-01
**Feature**: 002-backend-todo-api

## Decision: JWT Implementation (pyjwt)
- **Choice**: `pyjwt`
- **Rationale**: User requested `pyjwt` for simplicity and speed. It is a mature library that perfectly supports the HS256 algorithm required for verifying Better Auth tokens.
- **Alternatives Considered**: `python-jose` (more features but slower/heavier), `authlib` (more complex).

## Decision: Database URL Handling
- **Choice**: Environment variable `DATABASE_URL`
- **Rationale**: Aligning with industry standards and SQLModel's expected connection pattern. The provided Neon Postgres URL will be stored in this variable.
- **Alternatives Considered**: Hardcoding URL (rejected for security), using multiple variables (rejected for complexity).

## Decision: User Model Strategy
- **Choice**: Lightweight `User` model with `id: str` as PK.
- **Rationale**: Essential for SQLModel foreign key relationships and future-proofing (e.g., storing user preferences). Compatible with Better Auth's string-based IDs.
- **Alternatives Considered**: Relying purely on JWT payload (rejected because tasks need a foreign key target in the DB schema for referential integrity).

## Decision: Error Response Format
- **Choice**: Standardized `{ "detail": "message" }`
- **Rationale**: Matches FastAPI default but ensures consistency across custom exceptions. Uses appropriate status codes (401, 403, 404, 422).
- **Alternatives Considered**: Custom nested JSON (rejected to stay close to framework defaults).

## Decision: Route Organization
- **Choice**: Single tasks router (`backend/app/api/tasks.py`)
- **Rationale**: For the current scope (5-6 endpoints), a single modular router is the most maintainable and simple approach.
- **Alternatives Considered**: Multiple files per endpoint (rejected as over-engineering).

## Decision: Session Management
- **Choice**: Async session per-request via Dependency Injection.
- **Rationale**: Best practice for FastAPI/SQLModel to manage database connections efficiently and ensure clean rollback on failure.
- **Alternatives Considered**: Global session (rejected due to thread-safety/async issues).
