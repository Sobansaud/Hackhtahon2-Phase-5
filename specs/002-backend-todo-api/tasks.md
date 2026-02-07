# Tasks: Todo Backend API

**Input**: Design documents from `/specs/002-backend-todo-api/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure `backend/app/`, `backend/app/api/`, `backend/app/core/`, `backend/app/models/` per implementation plan
- [x] T002 Initialize Python project in `backend/` with `pyproject.toml` or `requirements.txt` containing `fastapi`, `uvicorn`, `sqlmodel`, `pyjwt`, `asyncpg`, `pydantic-settings`
- [x] T003 [P] Configure `.env.example` in `backend/.env.example` with fallback values for `BETTER_AUTH_SECRET` and `DATABASE_URL`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Setup async database engine and session factory in `backend/app/db.py`
- [x] T005 [P] Create configuration loader using Pydantic Settings in `backend/app/core/config.py`
- [x] T006 [P] Implement JWT verification logic using `pyjwt` in `backend/app/core/security.py`
- [x] T007 Implement authentication and DB session dependency injection in `backend/app/api/deps.py`
- [x] T008 Initialize main FastAPI application in `backend/app/main.py` with base router and health check
- [x] T009 [P] Create base `SQLModel` definition and common mixins (timestamps) in `backend/app/models/base.py`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Secure Task Management (Priority: P1) 🎯 MVP

**Goal**: Full CRUD lifecycle for tasks with strict JWT-based ownership enforcement

**Independent Test**: Use a valid JWT to Create, Read, Update, and Delete a task. Verify that another user's token receives 403 when trying to access the same task.

- [x] T010 [P] [US1] Create `User` model in `backend/app/models/user.py`
- [x] T011 [P] [US1] Create `Task` model with `user_id` FK and indexes in `backend/app/models/task.py`
- [x] T012 [US1] Implement Pydantic schemas for Task Create/Update in `backend/app/models/task.py`
- [x] T013 [US1] Implement CRUD utility functions for Tasks in `backend/app/api/tasks.py`
- [x] T014 [US1] Create protected REST endpoints for Tasks (POST, GET, PUT, DELETE) in `backend/app/api/tasks.py`
- [x] T015 [US1] Register `tasks` router in `backend/app/main.py`
- [x] T016 [US1] Add ownership validation check (token sub == path user_id) in `backend/app/api/deps.py` or middleware

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Task Filtering by Status (Priority: P2)

**Goal**: Filter task list by completion status (pending/completed)

**Independent Test**: Call `GET /api/{user_id}/tasks?status=pending` and verify only incomplete tasks are returned.

- [ ] T017 [US2] Update `GET /api/{user_id}/tasks` endpoint in `backend/app/api/tasks.py` to accept and apply `status` query parameter
- [ ] T018 [US2] Ensure `Task.completed` index is properly used in filtering queries

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Instant Feedback & Performance (Priority: P3)

**Goal**: Toggle completion status via PATCH and ensure optimal response times

**Independent Test**: Call `PATCH /api/{user_id}/tasks/{id}/complete` and verify status flips instantly in the DB.

- [ ] T019 [US3] Implement `PATCH /api/{user_id}/tasks/{id}/complete` endpoint in `backend/app/api/tasks.py`
- [ ] T020 [US3] Optimization review: Ensure no N+1 queries in list endpoints and efficient index usage for multi-user scenarios

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T021 [P] Standardize error response format (JSON `{ "detail": "message" }`) in `backend/app/main.py` exception handlers
- [ ] T022 [P] Implement CORS middleware to allow connections from local Next.js frontend (localhost:3000)
- [ ] T023 Update `backend/README.md` with run instructions and API documentation links
- [ ] T024 Create `IMPLEMENTATION_LOG.md` documenting security audit and phase completions
- [ ] T025 Run final full-stack integration verification (simulated)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Foundation ready - No other story dependencies
- **User Story 2 (P2)**: Depends on US1 endpoints existing (List specifically)
- **User Story 3 (P3)**: Depends on US1 endpoints existing (Update/Patch context)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Verify CRUD + Security isolation works independently

### Parallel Example: Foundation Setup
```bash
# Sequential
Task: "T004 Setup async database engine in backend/app/db.py"
# Parallelable
Task: "T005 [P] Create config loader in backend/app/core/config.py"
Task: "T006 [P] Implement JWT logic in backend/app/core/security.py"
```
