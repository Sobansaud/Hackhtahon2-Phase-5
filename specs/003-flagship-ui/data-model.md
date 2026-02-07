# Data Model: Flagship UI Transformation

**Feature**: 003-flagship-ui
**Date**: 2026-01-02
**Status**: No New Entities

---

## Overview

This feature is a **visual and experiential transformation** of the existing frontend. It does not introduce new data entities, API endpoints, or backend functionality. All existing data models from the frontend (001) and backend (002) specifications remain unchanged.

## Existing Entities (Reference)

### User Entity

From specification 001-frontend-todo-ui:

| Property | Type | Description | Visual Notes |
|----------|------|-------------|--------------|
| id | UUID | Unique identifier | Not displayed to user |
| email | string | User's email address | Displayed in user menu/avatar |
| created_at | timestamp | Account creation date | Not displayed |
| session_token | JWT | Authentication token | Stored in secure cookie, never displayed |

### Todo Entity

From specification 001-frontend-todo-ui:

| Property | Type | Description | Visual Notes |
|----------|------|-------------|--------------|
| id | UUID | Unique identifier | Not displayed to user |
| title | string | Todo title | Primary text, supports truncation on overflow |
| description | string | Optional details | Secondary text, multi-line, supports line-clamp |
| completed | boolean | Completion status | Drives visual state (checkmark, strikethrough, opacity) |
| created_at | timestamp | Creation date | Formatted display, optional |
| updated_at | timestamp | Last modification | Formatted display, optional |
| user_id | UUID | Owner reference | For isolation only, never displayed |

## UI State Entities

While no persistent data entities are introduced, the following **client-side state** will be managed:

### Theme State

```typescript
type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  current: Theme;
  resolved: 'light' | 'dark';  // Final applied theme
  source: 'preference' | 'system';
}
```

| Property | Type | Description | Persistence |
|----------|------|-------------|-------------|
| current | Theme | User's explicit preference | localStorage: `theme` |
| resolved | 'light' \| 'dark' | Final theme for rendering | Computed |
| source | 'preference' \| 'system' | How theme was determined | Computed |

### UI State

```typescript
interface UIState {
  isLoading: boolean;
  isEmpty: boolean;
  error: string | null;
  toastMessage: Toast | null;
  activeModal: Modal | null;
}

type Modal = 'add-todo' | 'edit-todo' | 'delete-confirm';
```

### Toast Notification

```typescript
interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;  // Default 3000ms
}
```

---

## Visual State Transitions

### Todo Completion State

| State | Visual Treatment | Animation |
|-------|-----------------|-----------|
| Active | Full opacity, normal typography | N/A |
| Hovered | Subtle lift, shadow increase | Micro-lift (200-300ms) |
| Completing | Checkmark draws in | Stroke animation (400-500ms) |
| Completed | Reduced opacity, strikethrough, dimmed | Fade (300ms) |

### Loading States

| Context | Visual Treatment | Animation |
|---------|-----------------|-----------|
| Page load | Skeleton cards with shimmer | Shimmer wave (infinite) |
| API fetch | Inline spinner on button | Rotate (linear, 1s) |
| Form submit | Button content replaced with spinner | Scale/fade (200ms) |

### Empty State

| Context | Visual Treatment |
|---------|-----------------|
| No todos | Centered illustration, guidance text, primary CTA |
| No results | Centered icon, "No matches found" text |
| No filters active | "All todos completed" celebration state |

### Error State

| Context | Visual Treatment |
|---------|-----------------|
| Network error | Centered icon, "Unable to connect" message, retry button |
| Validation error | Inline below field with red text, red border glow |
| Unauthorized error | Redirect to login, toast notification |

---

## Visual Design Tokens

### Color Tokens

| Token | Light Value | Dark Value | Usage |
|-------|-------------|------------|-------|
| --bg-primary | #f8fafc | #0f172a | Page background |
| --bg-surface | #ffffff | #1e293b | Card/element backgrounds |
| --bg-surface-2 | #f1f5f9 | #334155 | Nested backgrounds |
| --text-primary | #0f172a | #f8fafc | Primary text |
| --text-secondary | #64748b | #94a3b8 | Secondary text |
| --text-tertiary | #94a3b8 | #64748b | Tertiary text |
| --primary | #6366f1 | #818cf8 | Primary actions, accents |
| --primary-hover | #4f46e5 | #6366f1 | Hover state |
| --success | #0d9488 | #14b8a6 | Success states |
| --error | #f43f5e | #f43f5e | Error states |
| --accent | #10b981 | #86efac | Accent elements |

### Spacing Tokens

| Token | Value | Usage |
|-------|-------|-------|
| --space-micro | 4px | Icon padding, tight margins |
| --space-small | 8px | Label spacing, element grouping |
| --space-medium | 16px | Standard spacing |
| --space-large | 24px | Section internal spacing |
| --space-major | 48px | Section separation |
| --space-hero | 64px+ | Hero sections |

### Border Radius Tokens

| Token | Value | Usage |
|-------|-------|-------|
| --radius-sm | 0.375rem (6px) | Small elements, tags |
| --radius-md | 0.5rem (8px) | Standard elements |
| --radius-lg | 0.75rem (12px) | Large elements |
| --radius-xl | 1rem (16px) | Cards, modals (primary) |
| --radius-2xl | 1.5rem (24px) | Large cards, hero elements |

### Shadow Tokens

| Token | Value (Light) | Value (Dark) | Usage |
|-------|---------------|--------------|-------|
| --shadow-resting | 0 1px 2px 0 rgb(0 0 0 / 0.05) | 0 1px 2px 0 rgb(0 0 0 / 0.3) | Default state |
| --shadow-raised | 0 4px 6px -1px rgb(0 0 0 / 0.1) | 0 4px 6px -1px rgb(0 0 0 / 0.4) | Hover state |
| --shadow-elevated | 0 10px 15px -3px rgb(0 0 0 / 0.1) | 0 10px 15px -3px rgb(0 0 0 / 0.4) | Modals, dropdowns |
| --shadow-floating | 0 20px 25px -5px rgb(0 0 0 / 0.1) | 0 20px 25px -5px rgb(0 0 0 / 0.4) | Toasts, tooltips |

---

## Schema Changes

**No schema changes required.** This feature modifies only visual presentation layer.

---

## Dependencies

- Frontend specification (001-frontend-todo-ui) for entity definitions
- Backend specification (002-backend-todo-api) for data contracts
