# Data Model: Frontend for The Evolution of Todo - Phase II

## Entity: User
**Fields**:
- id: string (unique identifier from authentication system)
- email: string (user's email address, validated format)
- name: string (optional, user's display name)
- createdAt: string (ISO date string)
- updatedAt: string (ISO date string)

**Validation rules**:
- Email must be in valid email format
- Email must be unique across all users
- Name, if provided, must be between 1-50 characters

**State transitions**: N/A (managed by authentication system)

## Entity: Todo
**Fields**:
- id: string (unique identifier from backend)
- title: string (the todo task description)
- description: string (optional detailed description)
- completed: boolean (completion status)
- createdAt: string (ISO date string)
- updatedAt: string (ISO date string)
- userId: string (foreign key to User.id for data isolation)

**Validation rules**:
- Title must be between 1-200 characters
- Description, if provided, must be between 1-1000 characters
- Completed defaults to false
- userId must match the authenticated user's ID

**State transitions**:
- New Todo: {completed: false}
- Mark Complete: {completed: true}
- Mark Incomplete: {completed: false}
- Update: Any field except id and userId can be modified
- Delete: Record removed from frontend state (confirmed by backend)

## Entity: AuthSession
**Fields**:
- token: string (JWT token from Better Auth)
- userId: string (user ID from token payload)
- expiresAt: string (ISO date string for token expiration)
- createdAt: string (ISO date string)

**Validation rules**:
- Token must be valid JWT format
- Token must not be expired at time of use
- userId must match user record in system

**State transitions**:
- New Session: Token obtained from authentication
- Active: Token validated and stored
- Expired: Token has passed expiration time
- Revoked: Token invalidated by logout

## Entity: UIState
**Fields**:
- currentView: string (current page/route: 'signin', 'signup', 'dashboard')
- loading: boolean (indicates API request in progress)
- error: string (error message for user display)
- success: string (success message for user display)

**Validation rules**:
- currentView must be one of allowed values
- loading, error, and success should be mutually exclusive where appropriate

**State transitions**:
- View Change: currentView updated based on navigation
- Loading Start: loading = true, error/success cleared
- Loading End: loading = false
- Error: error message set, loading = false
- Success: success message set, loading = false