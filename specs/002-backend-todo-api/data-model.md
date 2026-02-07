# Data Model: Todo Backend API

## Entities

### User
Represents an authenticated user from Better Auth.
- `id`: `String` (Primary Key, matching Better Auth `sub` claim)
- `email`: `String` (User email)
- `name`: `String` (User name)

### Task
Represents a todo item belonging to a user.
- `id`: `Integer` (Primary Key, Auto-increment)
- `user_id`: `String` (Foreign Key -> User.id, Indexed)
- `title`: `String` (Required, non-empty)
- `description`: `String` (Optional)
- `completed`: `Boolean` (Default: `False`, Indexed)
- `created_at`: `DateTime` (Automatic timestamp)
- `updated_at`: `DateTime` (Automatic update timestamp)

## Relationships
- **User -> Tasks**: One-to-Many.
- Deleting a User should (ideally) cascade delete their Tasks.

## Constraints
- `Task.title` must have a length between 1 and 255 characters.
- `Task.user_id` is mandatory to ensure every task is owned.
