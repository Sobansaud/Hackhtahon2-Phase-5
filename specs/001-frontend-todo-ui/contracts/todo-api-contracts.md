# API Contracts: Frontend for The Evolution of Todo - Phase II

## Authentication API Contracts

### POST /api/auth/sign-up
**Description**: Create a new user account
**Request**:
- Headers: Content-Type: application/json
- Body:
  ```json
  {
    "email": "string (valid email format)",
    "password": "string (min 8 characters)"
  }
  ```

**Response**:
- 200: Success
  ```json
  {
    "user": {
      "id": "string",
      "email": "string"
    },
    "token": "string (JWT)"
  }
  ```
- 400: Validation error
- 409: User already exists

### POST /api/auth/sign-in
**Description**: Authenticate user and return JWT token
**Request**:
- Headers: Content-Type: application/json
- Body:
  ```json
  {
    "email": "string (valid email format)",
    "password": "string"
  }
  ```

**Response**:
- 200: Success
  ```json
  {
    "user": {
      "id": "string",
      "email": "string"
    },
    "token": "string (JWT)"
  }
  ```
- 400: Validation error
- 401: Invalid credentials

### POST /api/auth/logout
**Description**: Invalidate user session
**Request**:
- Headers:
  - Content-Type: application/json
  - Authorization: Bearer {token}

**Response**:
- 200: Success
- 401: Invalid or expired token

## Todo API Contracts

### GET /api/todos
**Description**: Get all todos for authenticated user
**Request**:
- Headers:
  - Authorization: Bearer {token}

**Response**:
- 200: Success
  ```json
  {
    "todos": [
      {
        "id": "string",
        "title": "string",
        "description": "string (optional)",
        "completed": "boolean",
        "createdAt": "string (ISO date)",
        "updatedAt": "string (ISO date)",
        "userId": "string"
      }
    ]
  }
  ```
- 401: Invalid or expired token

### POST /api/todos
**Description**: Create a new todo
**Request**:
- Headers:
  - Content-Type: application/json
  - Authorization: Bearer {token}
- Body:
  ```json
  {
    "title": "string (1-200 chars)",
    "description": "string (optional, 0-1000 chars)",
    "completed": "boolean (default: false)"
  }
  ```

**Response**:
- 201: Created
  ```json
  {
    "id": "string",
    "title": "string",
    "description": "string (optional)",
    "completed": "boolean",
    "createdAt": "string (ISO date)",
    "updatedAt": "string (ISO date)",
    "userId": "string"
  }
  ```
- 400: Validation error
- 401: Invalid or expired token

### PUT /api/todos/{id}
**Description**: Update an existing todo
**Request**:
- Headers:
  - Content-Type: application/json
  - Authorization: Bearer {token}
- Path: id (todo ID)
- Body (all fields optional):
  ```json
  {
    "title": "string (1-200 chars)",
    "description": "string (0-1000 chars)",
    "completed": "boolean"
  }
  ```

**Response**:
- 200: Success
  ```json
  {
    "id": "string",
    "title": "string",
    "description": "string (optional)",
    "completed": "boolean",
    "createdAt": "string (ISO date)",
    "updatedAt": "string (ISO date)",
    "userId": "string"
  }
  ```
- 400: Validation error
- 401: Invalid or expired token
- 404: Todo not found

### DELETE /api/todos/{id}
**Description**: Delete a todo
**Request**:
- Headers:
  - Authorization: Bearer {token}
- Path: id (todo ID)

**Response**:
- 204: Success (no content)
- 401: Invalid or expired token
- 404: Todo not found

### PATCH /api/todos/{id}/complete
**Description**: Mark a todo as complete/incomplete
**Request**:
- Headers:
  - Content-Type: application/json
  - Authorization: Bearer {token}
- Path: id (todo ID)
- Body:
  ```json
  {
    "completed": "boolean"
  }
  ```

**Response**:
- 200: Success
  ```json
  {
    "id": "string",
    "title": "string",
    "description": "string (optional)",
    "completed": "boolean",
    "createdAt": "string (ISO date)",
    "updatedAt": "string (ISO date)",
    "userId": "string"
  }
  ```
- 400: Validation error
- 401: Invalid or expired token
- 404: Todo not found