# API Contract: Tasks

## Base URL
`/api`

## Security
All endpoints require `Authorization: Bearer <JWT>` header.
The JWT must be signed by `BETTER_AUTH_SECRET`.

---

### List Tasks
- **URL**: `/{user_id}/tasks`
- **Method**: `GET`
- **Query Params**:
  - `status`: `all | pending | completed` (Default: `all`)
- **Success Response**: `200 OK`
  - Body: `Array<Task>`
- **Error Responses**:
  - `401 Unauthorized`: Missing/invalid token
  - `403 Forbidden`: `user_id` mismatch with token

---

### Create Task
- **URL**: `/{user_id}/tasks`
- **Method**: `POST`
- **Request Body**:
  - `title`: `string` (Required)
  - `description`: `string` (Optional)
- **Success Response**: `201 Created`
  - Body: `Task`
- **Error Responses**:
  - `422 Unprocessable Entity`: Validation error

---

### Get Task
- **URL**: `/{user_id}/tasks/{id}`
- **Method**: `GET`
- **Success Response**: `200 OK`
  - Body: `Task`
- **Error Responses**:
  - `404 Not Found`: Task does not exist or belongs to another user

---

### Update Task
- **URL**: `/{user_id}/tasks/{id}`
- **Method**: `PUT`
- **Request Body**:
  - `title`: `string`
  - `description`: `string`
  - `completed`: `boolean`
- **Success Response**: `200 OK`
  - Body: `Task`

---

### Toggle Complete
- **URL**: `/{user_id}/tasks/{id}/complete`
- **Method**: `PATCH`
- **Success Response**: `200 OK`
  - Body: `Task` (with toggled `completed` status)

---

### Delete Task
- **URL**: `/{user_id}/tasks/{id}`
- **Method**: `DELETE`
- **Success Response**: `204 No Content`
