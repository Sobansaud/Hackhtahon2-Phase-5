# Advanced Features Updater

## Overview
Safely implement Intermediate & Advanced features in backend/frontend:
- Add priorities, tags, search/filter/sort to Task model & API
- Implement recurring tasks logic (auto-reschedule on complete)
- Add due dates + reminders (publish event on due date)
- Extend UI forms, list views, filter UI
- Use Dapr Pub/Sub for event publishing (no direct Kafka code)
- Always reference constitution.md v5.0 & task ID

## Pre-execution
Before making changes, ask: "Confirm feature spec approved?"

## Post-execution
After changes: Run basic tests (add task, filter, recurring create)

## Implementation Guidelines

### 1. Task Model Extensions
- Extend the existing SQLModel Task model with:
  - priority field (enum: low, medium, high, urgent)
  - tags field (JSON/array field for categorization)
  - due_date field (datetime for deadlines)
  - recurrence_pattern field (JSON for recurring tasks)
  - notification_settings field (JSON for reminder preferences)

### 2. API Endpoints
- Add new endpoints for advanced filtering and sorting
- Implement recurrence handling endpoints
- Add notification/reminders API
- Maintain backward compatibility with existing endpoints
- Ensure proper validation for all new fields

### 3. Recurring Tasks Logic
- Implement auto-rescheduling when recurring tasks are completed
- Handle different recurrence patterns (daily, weekly, monthly)
- Preserve task properties in recurring instances
- Manage recurrence termination conditions

### 4. Due Dates & Reminders
- Add due date functionality with proper datetime handling
- Implement reminder system that publishes events on due dates
- Create notification settings for customizing reminders
- Handle timezone considerations for due dates

### 5. Frontend Implementation
- Enhance UI forms to support new task properties
- Add filter UI for searching and sorting tasks
- Implement priority and tag selection interfaces
- Create recurrence pattern selection UI
- Add due date picker and reminder settings panel

### 6. Dapr Pub/Sub Integration
- Use Dapr Pub/Sub for all event publishing
- Publish reminder-due events when tasks reach due date
- Ensure proper event schemas and versioning
- Handle event publishing failures gracefully

### 7. Testing Protocol
- Run basic tests after implementing changes:
  - Add task with all new properties
  - Test filtering and sorting functionality
  - Create and complete recurring tasks
  - Verify reminder event publishing
- Validate that existing functionality remains intact

### 8. Documentation & Compliance
- Reference constitution.md v5.0 for implementation standards
- Ensure all changes align with task specifications
- Maintain proper code documentation
- Follow security best practices for all new features