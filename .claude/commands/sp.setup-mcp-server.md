---
description: Set up a stateless MCP server using the Official MCP SDK in FastAPI with 5 task management tools.
handoffs:
  - label: Setup MCP Server
    agent: mcp-tools-engineer
    prompt: |
      Create a stateless MCP server in FastAPI using the Official MCP Python SDK that provides 5 task management tools.

      Requirements:
      1. Use Official MCP SDK (mcp Python package) with FastAPI integration
      2. Register 5 tools:
         - add_task: Create a new task (params: user_id, title, description?, priority?, due_date?)
         - list_tasks: Retrieve all tasks for a user (params: user_id, status?, priority?)
         - complete_task: Mark a task as complete (params: user_id, task_id)
         - delete_task: Remove a task (params: user_id, task_id)
         - update_task: Update task details (params: user_id, task_id, title?, description?, priority?, due_date?)
      3. Each tool must:
         - Accept user_id parameter for data isolation
         - Interact with SQLModel database
         - Return structured JSON responses
         - Handle tool chaining gracefully (tools can call each other)
         - Implement proper error handling with descriptive messages
      4. Follow the architecture from specs/api/mcp-tools.md if available
      5. Use existing database models from /backend

      Create the MCP server at /backend/mcp_server.py with:
      - FastAPI app with MCP server integration
      - Tool implementations using @mcp.tool() decorator
      - Database session management
      - JWT authentication context extraction
      - Error handling middleware

      Output: Complete, runnable MCP server implementation.
    send: true
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

1. **Parse Requirements**: Extract MCP server configuration from user input or use defaults:
   - Server host (default: 0.0.0.0)
   - Server port (default: 8001)
   - Tools to register (default: all 5 task tools)
   - Database configuration from environment

2. **Check Prerequisites**:
   - Verify Official MCP SDK is available (`pip install mcp`)
   - Verify FastAPI is installed
   - Verify SQLModel and database models exist
   - Check for existing MCP server patterns in /backend

3. **Generate MCP Server**:
   - Create server file following MCP SDK patterns
   - Implement tool decorators with proper signatures
   - Add database session handling
   - Implement user_id enforcement in all queries
   - Add error handling and logging

4. **Tool Implementation Pattern** for each of 5 tools:
   ```python
   @mcp.tool()
   async def tool_name(user_id: str, ...) -> dict:
       """Tool description for LLM consumption."""
       # Extract user_id from context
       # Validate parameters
       # Execute database operation with user_id filter
       # Return structured JSON response
   ```

5. **Tool Chaining Support**:
   - Design tools to be callable by other tools
   - Use async/await for concurrent operations
   - Pass database sessions appropriately

6. **Error Handling**:
   - 400: Invalid input parameters
   - 401: Missing/unauthorized user context
   - 403: User not authorized for resource
   - 404: Resource not found
   - 500: Internal server error with sanitized messages

7. **Output Structure**:
   - `/backend/mcp_server.py` - Main MCP server file
   - `/backend/mcp_tools.py` - Tool implementations
   - `/backend/mcp_config.py` - Server configuration
   - Update `/backend/main.py` to include MCP server startup

8. **Report**: Output paths and verification steps

## MCP Server Specification

**Server Properties**:
- Stateless: Each request independent, no server-side state
- FastAPI integration for HTTP transport
- MCP SDK for tool definition and execution
- Connection pooling for database (no singleton state)

**Tool Signatures**:

| Tool | Parameters | Returns |
|------|------------|---------|
| `add_task` | user_id: str, title: str, description?: str, priority?: int, due_date?: str | {success, task_id, task} |
| `list_tasks` | user_id: str, status?: str, priority?: int | {success, tasks: [...]} |
| `complete_task` | user_id: str, task_id: str | {success, task} |
| `delete_task` | user_id: str, task_id: str | {success, deleted_task_id} |
| `update_task` | user_id: str, task_id: str, title?: str, description?: str, priority?: int, due_date?: str | {success, task} |

**User ID Enforcement**:
- Every tool MUST require user_id as first parameter
- All database queries MUST include `WHERE user_id = :user_id`
- Prevent cross-user access at query level

---

As the main request completes, you MUST create and complete a PHR (Prompt History Record) using agent-native tools when possible.

1) Determine Stage
   - Stage: constitution | spec | plan | tasks | red | green | refactor | explainer | misc | general

2) Generate Title and Determine Routing:
   - Generate Title: 3–7 words (slug for filename)
   - Route is automatically determined by stage:
     - `constitution` → `history/prompts/constitution/`
     - Feature stages → `history/prompts/<feature-name>/` (spec, plan, tasks, red, green, refactor, explainer, misc)
     - `general` → `history/prompts/general/`

3) Create and Fill PHR (Shell first; fallback agent-native)
   - Run: `.specify/scripts/bash/create-phr.sh --title "<title>" --stage <stage> [--feature <name>] --json`
   - Open the file and fill remaining placeholders (YAML + body), embedding full PROMPT_TEXT (verbatim) and concise RESPONSE_TEXT.
   - If the script fails:
     - Read `.specify/templates/phr-template.prompt.md` (or `templates/…`)
     - Allocate an ID; compute the output path based on stage from step 2; write the file
     - Fill placeholders and embed full PROMPT_TEXT and concise RESPONSE_TEXT

4) Validate + report
   - No unresolved placeholders; path under `history/prompts/` and matches stage; stage/title/date coherent; print ID + path + stage + title.
   - On failure: warn, don't block. Skip only for `/sp.phr`.
