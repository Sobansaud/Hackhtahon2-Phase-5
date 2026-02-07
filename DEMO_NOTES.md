# Demo Notes: Intermediate & Advanced Features

## Demo Flow

### 1. Priority Management
- Show the priority dropdown in the task creation form
- Create a task with "High" priority
- Demonstrate filtering by priority (show only High priority tasks)
- Show priority sorting (High → Medium → Low)

### 2. Tag Management
- Add multiple tags to a task (e.g., "work", "urgent", "project")
- Show tags displayed as colorful chips in the task list
- Demonstrate tag filtering (show only tasks with specific tags)
- Show multi-tag filtering capability

### 3. Search & Filter Enhancement
- Demonstrate full-text search across title and description
- Show combined filtering (status + priority + tags)
- Search for "meeting" and filter by "High" priority
- Clear filters to return to full view

### 4. Due Date Management
- Add a due date to a task using the date picker
- Show overdue tasks with red "[OVERDUE]" indicator
- Demonstrate due date sorting (soonest first)
- Show tasks due today with special highlighting

### 5. Recurring Tasks
- Create a recurring task (e.g., "Daily standup", weekly recurrence)
- Complete the task and show that a new instance is automatically created
- Verify that the new task preserves title, description, priority, and tags
- Show the new due date calculated based on the recurrence pattern

### 6. Advanced Sorting
- Demonstrate various sorting options:
  - Sort by due date (soonest first)
  - Sort by priority (High → Low)
  - Sort by title (A-Z)
  - Sort by creation date (newest first)

### 7. Visual Feedback
- Show toast notifications when creating/updating tasks
- Demonstrate loading skeletons during filtering/sorting operations
- Show optimistic UI updates when completing tasks

## Demo Commands

### Show priority filter → recurring complete → new task auto-created
1. Create a task with High priority
2. Filter by High priority to see the task
3. Create a recurring task (e.g., "Weekly review", recurrence: weekly)
4. Complete the recurring task
5. Observe that a new instance is automatically created with the same properties

## Key Features to Highlight

- **Intuitive UI**: All new features integrated seamlessly with existing UI
- **Performance**: Fast filtering and sorting even with large datasets
- **Backward Compatibility**: All existing tasks continue to work without changes
- **Visual Clarity**: Clear indicators for priority, tags, due dates, overdue status
- **Smart Defaults**: Proper defaults for new fields (Medium priority, empty tags)
- **Responsive Design**: Works well on desktop and mobile devices

## Expected Behavior

- All new features work with existing tasks without any changes
- New tasks have appropriate defaults applied
- Filtering and sorting operations return results quickly
- Recurring tasks generate new instances correctly
- UI provides clear feedback for all user actions
- Error handling is user-friendly and informative

## Potential Questions & Answers

Q: What happens to existing tasks without priority/tags/due dates?
A: They continue to work as before. New fields have sensible defaults applied.

Q: How do I search across multiple fields?
A: The search function searches both title and description fields simultaneously.

Q: Can I combine multiple filters?
A: Yes, you can combine status, priority, and tag filters simultaneously.

Q: What recurrence patterns are supported?
A: Daily, weekly, monthly, and none (for non-recurring tasks).

Q: Are there any performance considerations with large datasets?
A: The implementation uses optimized database queries and pagination to ensure good performance.