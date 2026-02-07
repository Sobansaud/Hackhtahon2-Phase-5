# Data Model: Task Entity for Intermediate & Advanced Features

**Date**: 2026-02-05
**Feature**: todo-features-completion
**Version**: v1.0

## Entity: Task

### Fields

| Field | Type | Default | Constraints | Description |
|-------|------|---------|-------------|-------------|
| id | int | Auto-increment | Primary Key, Not Null | Unique identifier for the task |
| title | str | None | Not Null, Max Length 255 | Task title/description |
| description | str | None | Nullable | Detailed task description |
| is_completed | bool | False | Not Null | Completion status |
| created_at | datetime | datetime.utcnow() | Not Null | Timestamp of task creation |
| priority | str | "Medium" | Not Null, Enum: "High", "Medium", "Low" | Task priority level |
| tags | list[str] | [] | Not Null | Array of tags associated with the task |
| due_date | str | None | Nullable, Format: "YYYY-MM-DD" | Due date in ISO format |
| recurrence | str | None | Nullable, Enum: "daily", "weekly", "monthly", "none" | Recurrence pattern |

### Relationships
- None currently defined (single table design)

### Validation Rules

1. **Priority**: Must be one of "High", "Medium", "Low"
2. **Due Date**: If provided, must be in "YYYY-MM-DD" format
3. **Recurrence**: If provided, must be one of "daily", "weekly", "monthly", "none"
4. **Tags**: Array of strings with max 10 tags, each tag max 50 characters
5. **Title**: Required, max 255 characters
6. **Description**: Optional, max 1000 characters

### State Transitions

#### Task Completion
- When `is_completed` changes from False to True:
  - If `recurrence` is set, create a new task with the same properties
  - New task's due date = original due date + recurrence interval
  - New task's status = incomplete

#### Priority Changes
- Priority can be updated at any time
- Higher priority tasks appear first in priority-based sorting

### Indexes for Performance

1. **idx_tasks_priority**: Index on priority field for fast filtering
2. **idx_tasks_due_date**: Index on due_date for fast sorting/filtering
3. **idx_tasks_completion**: Index on is_completed for status filtering
4. **idx_tasks_created_at**: Index on created_at for chronological sorting

### Backward Compatibility

- Existing tasks without new fields will have default values applied
- Queries for old tasks will work unchanged
- New fields are nullable with sensible defaults
- No breaking changes to existing API endpoints

### Sample Data

```json
{
  "id": 1,
  "title": "Complete project proposal",
  "description": "Draft and submit the project proposal to stakeholders",
  "is_completed": false,
  "created_at": "2026-02-05T10:00:00",
  "priority": "High",
  "tags": ["work", "urgent", "proposal"],
  "due_date": "2026-02-10",
  "recurrence": null,
  "is_overdue": true
}
```

### Future Considerations

- Add full-text search index on title/description for improved search performance
- Consider separate table for tags if complex tag relationships are needed
- Add indexes on frequently queried combinations of fields