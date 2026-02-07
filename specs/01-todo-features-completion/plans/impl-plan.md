# Implementation Plan: Intermediate & Advanced Features Completion for The Evolution of Todo - Phase V Preparation

**Date**: 2026-02-05
**Feature**: todo-features-completion
**Version**: v1.0
**Branch**: 01-todo-features-completion
**Plan Owner**: Claude Code

## Executive Summary

This plan transforms the approved v1_intermediate_advanced.spec.md into a fully feature-complete, production-polished Todo application — with every Intermediate and Advanced feature flawlessly integrated into the existing frontend (Next.js + Tailwind) and backend (FastAPI + SQLModel + Neon DB). The plan drives the Backend Engineer, Frontend Engineer, and Database Engineer agents to deliver premium, bug-free, backward-compatible enhancements with ruthless precision, instant visual delight, and zero regressions — setting the perfect foundation for future cloud-native phases.

## Technical Context

### Architecture Overview
- **Frontend**: Next.js 16+, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python 3.11+
- **Database**: SQLModel with Neon PostgreSQL
- **Deployment**: Local development environment
- **API**: RESTful endpoints with JSON responses

### Feature Requirements
- **Intermediate Features**: Priorities (High/Medium/Low), Tags/Categories (multiple), Search (keyword in title/desc), Filter (status, priority, tag), Sort (due date, priority, title, created)
- **Advanced Features**: Recurring Tasks (daily/weekly/monthly with auto-reschedule on complete), Due Dates (YYYY-MM-DD format + overdue indicators), Reminders (visual + future notification prep)
- **Data Model Extensions**: priority (str), tags (list[str]), due_date (str), recurrence (str)
- **API Updates**: Extended GET/POST/PUT/PATCH endpoints with query parameters for search, filter, sort
- **UI/UX Changes**: Enhanced forms, list displays, filter controls, sort options

### Known Unknowns
- **Database Migration Strategy**: NEEDS CLARIFICATION - Alembic migration approach and column defaults
- **API Validation Approach**: NEEDS CLARIFICATION - Pydantic validation patterns for new fields
- **UI Component Library**: NEEDS CLARIFICATION - Which UI library components to use for multi-select, date pickers
- **Tag Storage Format**: NEEDS CLARIFICATION - JSON array vs delimited string vs separate table

## Constitution Check

This plan aligns with the Phase V Constitution regarding:
- ✅ Agentic Automation: All implementation tasks will be AI-generated with zero manual coding
- ✅ Production Resilience: All systems will include comprehensive error handling and validation
- ✅ Security-First: Proper validation and sanitization of all user inputs
- ✅ Event-First Architecture: Preparing for future event-driven architecture with proper data modeling
- ✅ Infrastructure-as-Code: Though not deploying yet, following patterns for future deployment
- ✅ Cloud-Native Excellence: Writing code that will work well in distributed systems

## Gates

### Gate 1: Technical Feasibility ✅
- All required technologies are available in the existing stack
- No new external dependencies required beyond existing ones
- All features can be implemented within the current architecture

### Gate 2: Resource Availability ✅
- All required libraries and frameworks are already in use
- No additional licenses or accounts needed
- Sufficient development environment capabilities

### Gate 3: Risk Assessment ✅
- Low risk due to backward compatibility requirements
- Phased approach minimizes integration risks
- Comprehensive testing planned for each phase

## Phase 0: Research & Discovery

### Research Task 0.1: Database Migration Strategy
**Objective**: Determine the best approach for adding nullable columns with defaults to existing Task table

**Findings**:
- Alembic migration to add nullable columns: priority, tags (JSONB/array), due_date, recurrence
- Default values: priority="Medium", tags=[], due_date=None, recurrence=None
- Neon PostgreSQL supports JSONB for tags array
- Migration approach: ALTER TABLE with defaults

### Research Task 0.2: API Validation Patterns
**Objective**: Identify Pydantic validation patterns for new fields

**Findings**:
- Use Pydantic v2 validation decorators for custom validation
- Enum for priority field with allowed values: "High", "Medium", "Low"
- Regex validation for date format: YYYY-MM-DD
- Enum for recurrence with values: "daily", "weekly", "monthly", "none"
- Max length validation for tags array

### Research Task 0.3: UI Component Strategy
**Objective**: Determine which UI components to use for enhanced functionality

**Findings**:
- Use Headless UI or Radix UI primitives for accessibility
- Multi-select component for tags using combobox pattern
- Native date input for due date (YYYY-MM-DD format)
- Select dropdown for priority and recurrence
- Badges for priority and tags display

### Research Task 0.4: Tag Storage Format
**Objective**: Choose the optimal format for storing tags in the database

**Findings**:
- JSONB column type in PostgreSQL for flexible tag storage
- Allows for efficient querying and indexing
- Maintains array structure for easy manipulation
- Alternative: delimited string if JSONB causes complexity

**Decision**: Use JSONB array for tags storage

## Phase 1: Data Model & API Contracts

### Data Model: Task Entity

```python
# Updated Task model with new fields
class Task(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str
    description: str | None = None
    is_completed: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # New fields for intermediate/advanced features
    priority: str = Field(default="Medium", description="Priority level: High/Medium/Low")
    tags: list[str] = Field(default=[], sa_column=Column(JSON))  # JSONB for tags array
    due_date: str | None = Field(default=None, description="Due date in YYYY-MM-DD format")
    recurrence: str | None = Field(default=None, description="Recurrence pattern: daily/weekly/monthly/none")
```

### API Contract: Task Endpoints

#### GET /api/tasks
Query Parameters:
- `search` (string): Keyword search in title/description
- `filter_status` (string): "all", "pending", "completed"
- `filter_priority` (string): "all", "High", "Medium", "Low"
- `filter_tag` (string): Tag to filter by (can be multiple)
- `sort` (string): "due_date_asc", "due_date_desc", "priority_asc", "priority_desc", "title_asc", "title_desc", "created_at_asc", "created_at_desc"

Response:
```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Sample task",
      "description": "Sample description",
      "is_completed": false,
      "created_at": "2026-02-05T10:00:00",
      "priority": "High",
      "tags": ["work", "urgent"],
      "due_date": "2026-02-10",
      "recurrence": null,
      "is_overdue": false
    }
  ],
  "total": 1,
  "page": 1,
  "has_more": false
}
```

#### POST /api/tasks
Request:
```json
{
  "title": "New task",
  "description": "Task description",
  "priority": "High",
  "tags": ["work", "important"],
  "due_date": "2026-02-15",
  "recurrence": "weekly"
}
```

Response: Created task with 201 status

#### PATCH /api/tasks/{id}/complete
Response: Updated task with 200 status
Special handling: If recurrence is set, creates new task instance

## Phase 2: Implementation Strategy

### Phase 2.1: Database & Model Foundation (Database Engineer Agent)
**Duration**: Day 1
**Dependencies**: None

Tasks:
1. Generate Alembic migration to add nullable columns: priority, tags (JSONB/array), due_date, recurrence
2. Update SQLModel Task with defaults (priority="Medium", tags=[], due_date=None, recurrence=None)
3. Run migration locally, verify old tasks still load
4. Test backward compatibility with existing tasks

### Phase 2.2: Backend API Expansion (Backend Engineer Agent)
**Duration**: Day 1-2
**Dependencies**: Phase 2.1

Tasks:
1. Extend POST/PUT tasks to accept new fields with validation
2. Add query params to GET tasks: ?search=...&filter_status=...&filter_priority=...&filter_tag=...&sort=...
3. Implement server-side filtering/sorting logic
4. PATCH /complete: if recurrence set → create next instance (due_date += interval)
5. Return enriched responses (overdue flag, formatted dates)

### Phase 2.3: Frontend Model & Types Update (Frontend Engineer Agent)
**Duration**: Day 2
**Dependencies**: Phase 2.2

Tasks:
1. Extend Task TypeScript interface with new fields
2. Update API client (lib/api.ts) with new params & responses
3. Update API service functions to handle new query parameters

### Phase 2.4: Task Form & Creation UI (Frontend Engineer Agent)
**Duration**: Day 2-3
**Dependencies**: Phase 2.3

Tasks:
1. Priority dropdown (High/Medium/Low, color-coded)
2. Tags multi-select input (chips UI)
3. Due date text input (YYYY-MM-DD) with validation
4. Recurrence select (None/Daily/Weekly/Monthly)
5. Form validation and error handling

### Phase 2.5: Task List Enhancements (Frontend Engineer Agent)
**Duration**: Day 3
**Dependencies**: Phase 2.4

Tasks:
1. Display badges (priority color, tag pills)
2. Overdue styling ([OVERDUE] red + bold)
3. Filter controls (status, priority, tag multi-select)
4. Sort dropdown (due date, priority, title, created)
5. Search input with debounce

### Phase 2.6: Visual Feedback & Polish (Frontend Engineer Agent)
**Duration**: Day 3-4
**Dependencies**: Phase 2.5

Tasks:
1. Success/error toasts on create/update/complete
2. Loading skeletons during filter/sort
3. Optimistic UI for complete (instant checkmark, rollback on error)
4. Responsive grid/list layout
5. Performance optimizations

### Phase 2.7: Full Regression & Feature Testing (All Agents)
**Duration**: Day 4
**Dependencies**: All previous phases

Tasks:
1. Test old tasks: CRUD works without new fields
2. Test new features: create with priority/tags/due/recurrence → list/filter/sort → complete recurring → new task appears
3. Test edge cases: invalid date, no results, large tag list
4. Performance testing: API response times, list rendering
5. Cross-browser compatibility testing

### Phase 2.8: Final Validation & Readiness (K8s Validation Agent style)
**Duration**: Day 5
**Dependencies**: Phase 2.7

Tasks:
1. Confirm no regressions in existing flows
2. Verify backward compatibility
3. Prepare demo notes: "Show priority filter → recurring complete → new task auto-created"
4. Update README with new features usage
5. Document any known issues or limitations

## Risk Mitigation

### Technical Risks
- **Database Migration**: Test migration on backup copy first, have rollback plan
- **Performance**: Monitor query performance during filtering/sorting, add indexes as needed
- **Complexity**: Implement features incrementally, test at each step

### Schedule Risks
- **Dependency Delays**: Parallelize where possible, have contingency plans
- **Integration Issues**: Frequent testing and validation throughout process

## Success Criteria

### Functional Completion
- [ ] All intermediate features implemented (priorities, tags, search, filter, sort)
- [ ] All advanced features implemented (due dates, recurring tasks, reminders)
- [ ] API endpoints extended with all required functionality
- [ ] Frontend updated with new UI components
- [ ] Backward compatibility maintained

### Quality Measures
- [ ] Zero regressions in existing functionality
- [ ] All new features properly validated
- [ ] Performance targets met (responses <200ms)
- [ ] Code quality standards maintained
- [ ] Proper error handling implemented

## Deliverables

- Updated Task model & Alembic migration
- Extended API endpoints & validation
- Enhanced frontend forms, list, filters
- TypeScript types & API client updates
- IMPLEMENTATION_LOG.md with phase-by-phase progress
- README section: "Intermediate & Advanced Features Guide"
- Fully functional, locally-testable application

## Timeline

**Total Duration**: 5 days
- Days 1-2: Backend foundation (database + API)
- Days 2-3: Frontend model updates and forms
- Days 3-4: Frontend list enhancements and polish
- Days 4-5: Testing, validation, and final readiness