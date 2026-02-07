import os
import json
import re
from typing import Dict, Any, List, Optional
try:
    import cohere
except Exception:
    cohere = None
from app.mcp.tools import add_task, list_tasks, complete_task, delete_task, update_task, get_current_user
from app.models.conversation import ConversationRepository
from app.models.message import MessageRepository
from app.api.models.chat import ToolCallInfo


class ChatbotService:
    """Service class for handling AI chatbot interactions with Cohere and MCP tools."""

    def __init__(self):
        """Initialize the chatbot service with Cohere client and tools."""
        """Initialize the chatbot service with Cohere client and tools."""
        from app.core.config import settings
        api_key = settings.COHERE_API_KEY
        
        # Initialize Cohere client if key exists
        if api_key:
            try:
                self.co = cohere.Client(api_key)
                print("Cohere client initialized successfully")
            except Exception as e:
                print(f"Error initializing Cohere client: {e}")
                self.co = None
        else:
            self.co = None
            print("WARNING: COHERE_API_KEY not found in settings. Chatbot will not function.")
        self.conversation_repo = ConversationRepository()
        self.message_repo = MessageRepository()

        # Register available tools
        self.tools = {
            "add_task": add_task,
            "list_tasks": list_tasks,
            "complete_task": complete_task,
            "delete_task": delete_task,
            "update_task": update_task,
            "get_current_user": get_current_user
        }

        # System prompt for the chatbot
        self.system_prompt = """
        You are "The Evolution AI", a versatile and clever task management assistant.
        Your goal is to help {user_name} ({user_email}) manage their todo list with high efficiency.
        
        ### MULTILINGUAL CAPABILITIES:
        - You understand and can respond in **English**, **Roman Urdu/Hindi** (e.g., "Mera task add kardo"), and **Urdu** (e.g., "میرا کام شامل کریں").
        - If the user talks in Roman Urdu, you should respond in Roman Urdu.
        - If the user asks you to talk in Urdu ("Urdu mein baat karo"), switch to Urdu script.
        
        ### CORE TOOLS:
        - add_task: Create a new task (params: title, description)
        - list_tasks: Search and show tasks (params: status, search). 
          *When listing, show them in a clean numbered or bullet list with their IDs if available.*
        - complete_task: Mark a task as done (params: task_id)
        - delete_task: Permanently remove a task (params: task_id)
        - update_task: Modify an existing task (params: task_id, title, description, status)
        - get_current_user: Retrieve detailed profile info
        
        ### OPERATIONAL RULES:
        1. When {user_name} asks to perform an action (add, mark complete, delete, etc.), call the tool IMMEDIATELY.
        2. Format tool calls as a single JSON block:
           ```json
           {{"tool": "tool_name", "params": {{"key": "value"}}}}
           ```
        3. For "delete kardo" or "baqi tasks khatam kardo", use `delete_task` with the correct ID.
        4. If you don't have the task ID, ask the user for it or list the tasks first.
        5. After tool execution, a confirmation will be shown.
        6. For "marks bhi lagado" or "complete kardo", use `complete_task`.
        7. For "list dikhao" or "show my tasks", use `list_tasks`.
        """

    async def _get_user_info(self, db, user_id: str) -> Dict[str, str]:
        """Fetch user info for personification."""
        try:
            from app.models.user import User
            from sqlmodel import select
            statement = select(User).where(User.id == user_id)
            result = await db.execute(statement)
            user = result.scalars().first()
            if user:
                return {"name": user.name, "email": user.email}
        except Exception:
            pass
        return {"name": "User", "email": "Unknown"}

    async def process_message_with_db(
        self,
        db,
        user_id: str,
        message: str,
        conversation_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Process a user message with database access and return an appropriate response.
        """
        # Get user info for personification
        user_info = await self._get_user_info(db, user_id)
        
        # Format system prompt with user data
        personalized_prompt = self.system_prompt.format(
            user_name=user_info["name"],
            user_email=user_info["email"]
        )

        # Get or create conversation
        if conversation_id:
            conversation = await self.conversation_repo.get_by_id(
                db=db,
                conversation_id=conversation_id,
                user_id=user_id
            )
            if not conversation:
                conversation = await self.conversation_repo.create(db=db, user_id=user_id)
                conversation_id = conversation.id
        else:
            conversation = await self.conversation_repo.create(db=db, user_id=user_id)
            conversation_id = conversation.id

        # Add user message to conversation
        await self.message_repo.create(
            db=db,
            conversation_id=conversation_id,
            role="user",
            content=message
        )

        # Process the request
        result = await self.process_multi_step_request(
            db=db,
            user_id=user_id,
            message=message,
            conversation_id=conversation_id,
            personalized_prompt=personalized_prompt
        )

        # Update conversation timestamp
        await self.conversation_repo.update_timestamp(db=db, conversation_id=conversation_id)

        return result

    def _generate_tool_response(self, tool_calls_executed: List[Dict[str, Any]], user_language: str = "ur") -> str:
        """Generate a natural confirmation message based on tool results."""
        if not tool_calls_executed:
            return "Main samajh nahi paya, kya aap phir se bol sakte hain?" if user_language == "ur" else "I couldn't understand that. Could you repeat?"

        # Templates for responses
        templates = {
            "ur": { # Roman Urdu
                "add_task": "✓ Task add ho gaya hai!",
                "complete_task": "✓ Task complete ho gaya hai!",
                "delete_task": "✓ Task delete kar diya gaya hai!",
                "update_task": "✓ Task update ho gaya hai!",
                "list_tasks": "Yeh rahe aapke tasks:",
                "get_current_user": "Aapki profile information yeh hai:"
            },
            "en": {
                "add_task": "✓ Task added successfully!",
                "complete_task": "✓ Task marked as complete!",
                "delete_task": "✓ Task deleted successfully!",
                "update_task": "✓ Task updated successfully!",
                "list_tasks": "Here are your tasks:",
                "get_current_user": "Here is your profile information:"
            }
        }

        lang = "ur" if user_language == "ur" else "en"
        msgs = []

        for call in tool_calls_executed:
            tool = call["tool"]
            result = call["result"]
            
            if "error" in result:
                error_msg = result["error"]
                if lang == "ur":
                    msgs.append(f"❌ Error: {error_msg}")
                else:
                    msgs.append(f"❌ Error: {error_msg}")
                continue

            # Special handling for list_tasks
            if tool == "list_tasks":
                tasks = result.get("tasks", [])
                if not tasks:
                    msgs.append("Aapki list abhi khali hai." if lang == "ur" else "Your list is empty.")
                else:
                    msgs.append(templates[lang]["list_tasks"])
                    for i, t in enumerate(tasks):
                        status_char = "✅" if t.get("completed") else "⏳"
                        msgs.append(f"{i+1}. [{t.get('id')}] {status_char} {t.get('title')}")
            
            # Special handling for get_current_user
            elif tool == "get_current_user":
                msgs.append(templates[lang]["get_current_user"])
                msgs.append(f"Name: {result.get('name')}\nEmail: {result.get('email')}")
            
            # Default templates
            else:
                msgs.append(templates[lang].get(tool, "Done!"))

        return "\n".join(msgs)

    async def _process_tool_calls(
        self,
        db,
        user_id: str,
        response_text: str,
        conversation_id: str
    ) -> List[Dict[str, Any]]:
        """Extract and execute tool calls from text."""
        tool_calls_executed = []
        
        # Robust extraction: first look for ```json code fences, then try brace-matching to find JSON
        matches = []
        pattern = r'```json\s*\n?({.*?})\s*\n?```'
        matches = re.findall(pattern, response_text, re.DOTALL)

        # Fallback: find JSON objects by balancing braces
        def _find_json_objects(text: str):
            objs = []
            stack = 0
            start = None
            for i, ch in enumerate(text):
                if ch == '{':
                    if stack == 0:
                        start = i
                    stack += 1
                elif ch == '}':
                    if stack > 0:
                        stack -= 1
                        if stack == 0 and start is not None:
                            objs.append(text[start:i+1])
                            start = None
            return objs

        if not matches:
            matches = _find_json_objects(response_text)

        for match in matches:
            try:
                data = json.loads(match)
                tool_name = data.get("tool")
                params = data.get("params", {})

                if tool_name in self.tools:
                    tool_func = self.tools[tool_name]
                    
                    try:
                        # Clean params
                        params.pop("user_id", None)
                        
                        # IMPORTANT: Convert task_id to int if present, as tools expect int
                        if "task_id" in params:
                            try:
                                params["task_id"] = int(params["task_id"])
                            except (ValueError, TypeError):
                                pass

                        # Tool execution
                        if tool_name == "get_current_user":
                            result = await tool_func(user_id, db)
                        else:
                            result = await tool_func(user_id=user_id, db=db, **params)
                    except Exception as e:
                        error_detail = f"Error: {str(e)}"
                        print(f"Tool Execution Error: {error_detail}")
                        result = {"error": error_detail}

                    tool_calls_executed.append({
                        "tool": tool_name,
                        "params": params,
                        "result": result
                    })

                    # Log execution as a system message
                    await self.message_repo.create(
                        db=db,
                        conversation_id=conversation_id,
                        role="assistant",
                        content=f"[System: Executed {tool_name}. Result: {result}]"
                    )
            except Exception as e:
                print(f"JSON Parsing/Unexpected Error: {e}")
                continue
                
        return tool_calls_executed

    async def process_multi_step_request(
        self,
        db,
        user_id: str,
        message: str,
        conversation_id: str,
        personalized_prompt: str,
        max_iterations: int = 5
    ) -> Dict[str, Any]:
        """
        Handle multi-step tool execution.
        """
        if not self.co:
            # Fallback: simple intent parser so basic commands work without Cohere
            text = current_input.strip().lower()

            async def _handle_add():
                # Try several extraction strategies for title and description
                title = None
                desc = None

                # 1) quoted strings: "title" 'desc'
                quotes = re.findall(r'"([^"]+)"|\'([^\']+)\'', current_input)
                if quotes:
                    # quotes is list of tuples from alternation; pick non-empty
                    vals = [q[0] or q[1] for q in quotes if q[0] or q[1]]
                    if vals:
                        title = vals[0]
                        if len(vals) > 1:
                            desc = vals[1]

                # 2) title: ... title: XYZ, description: ABC
                if not title:
                    m = re.search(r'title[:\s]+([^,;]+)', current_input, re.IGNORECASE)
                    if m:
                        title = m.group(1).strip()
                if not desc:
                    m = re.search(r'desc(?:ription)?[:\s]+([^,;]+)', current_input, re.IGNORECASE)
                    if m:
                        desc = m.group(1).strip()

                # 3) patterns like 'add task name X and desc Y' or 'add task X desc Y'
                if not title:
                    m = re.search(r'add .*task(?: name| title)?\s+([^,;]+?)(?:\s+and\s+desc(?:ription)?\s+(.+))?$', current_input, re.IGNORECASE)
                    if m:
                        title = m.group(1).strip()
                        if m.group(2):
                            desc = m.group(2).strip()

                # 4) fallback: take first two words after 'add' as title
                if not title:
                    m = re.search(r'add(?: me| kardo)?(?: a)?(?: new)? task\s+(.+)', current_input, re.IGNORECASE)
                    if m:
                        remainder = m.group(1).strip()
                        parts = re.split(r'\s+desc(?:ription)?\s+', remainder, flags=re.IGNORECASE)
                        title = parts[0].strip()
                        if len(parts) > 1:
                            desc = parts[1].strip()

                if not title:
                    return {"response": "I couldn't find a title for the task. Please say: add task title: <title> description: <desc>", "tool_calls": []}

                try:
                    result = await add_task(user_id=user_id, title=title, description=desc, db=db)
                    # Log and return confirmation
                    await self.message_repo.create(db=db, conversation_id=conversation_id, role="assistant", content=f"[System: Executed add_task. Result: {result}]")
                    resp_text = f"✓ Task added: {result.get('title')}"
                    return {"response": resp_text, "tool_calls": [{"tool": "add_task", "params": {"title": title, "description": desc}, "result": result}], "conversation_id": conversation_id}
                except Exception as e:
                    err = str(e)
                    return {"response": f"Failed to add task: {err}", "tool_calls": []}

            async def _handle_list():
                try:
                    res = await list_tasks(user_id=user_id, db=db)
                    await self.message_repo.create(db=db, conversation_id=conversation_id, role="assistant", content=f"[System: Executed list_tasks. Result count: {len(res.get('tasks', []))}]")
                    tasks = res.get('tasks', [])
                    if not tasks:
                        return {"response": "Your task list is empty.", "tool_calls": [{"tool": "list_tasks", "params": {}, "result": res}], "conversation_id": conversation_id}
                    lines = [f"{i+1}. [{t.get('id')}] {t.get('title')}" for i, t in enumerate(tasks)]
                    return {"response": "\n".join(lines), "tool_calls": [{"tool": "list_tasks", "params": {}, "result": res}], "conversation_id": conversation_id}
                except Exception as e:
                    return {"response": f"Failed to list tasks: {e}", "tool_calls": []}

            async def _handle_complete(task_id_text: str = None):
                if not task_id_text:
                    return {"response": "Please provide the task ID to complete (e.g., 'complete task 123').", "tool_calls": []}
                try:
                    tid = int(re.search(r'\d+', task_id_text).group(0))
                except Exception:
                    return {"response": "I couldn't parse the task ID. Provide a numeric ID.", "tool_calls": []}
                try:
                    res = await complete_task(user_id=user_id, task_id=tid, db=db)
                    await self.message_repo.create(db=db, conversation_id=conversation_id, role="assistant", content=f"[System: Executed complete_task. Result: {res}]")
                    return {"response": f"✓ Task {tid} marked complete.", "tool_calls": [{"tool": "complete_task", "params": {"task_id": tid}, "result": res}], "conversation_id": conversation_id}
                except Exception as e:
                    return {"response": f"Failed to complete task {tid}: {e}", "tool_calls": []}

            async def _handle_delete(task_id_text: str = None):
                if not task_id_text:
                    return {"response": "Please provide the task ID to delete (e.g., 'delete task 123').", "tool_calls": []}
                try:
                    tid = int(re.search(r'\d+', task_id_text).group(0))
                except Exception:
                    return {"response": "I couldn't parse the task ID. Provide a numeric ID.", "tool_calls": []}
                try:
                    res = await delete_task(user_id=user_id, task_id=tid, db=db)
                    await self.message_repo.create(db=db, conversation_id=conversation_id, role="assistant", content=f"[System: Executed delete_task. Result: {res}]")
                    return {"response": f"✓ Task {tid} deleted.", "tool_calls": [{"tool": "delete_task", "params": {"task_id": tid}, "result": res}], "conversation_id": conversation_id}
                except Exception as e:
                    return {"response": f"Failed to delete task {tid}: {e}", "tool_calls": []}

            # Simple intent detection
            if re.search(r'\b(add|create)\b.*\btask\b', current_input, re.IGNORECASE) or re.search(r'\bmera task add\b', current_input, re.IGNORECASE):
                return await _handle_add()

            if re.search(r'\b(list|show)\b.*\btask', current_input, re.IGNORECASE) or re.search(r'\bdikhao\b', current_input, re.IGNORECASE):
                return await _handle_list()

            m = re.search(r'\bcomplete\b.*(?:task)?\s*(\d+)?', current_input, re.IGNORECASE)
            if m:
                return await _handle_complete(m.group(1))

            m = re.search(r'\bdelete\b.*(?:task)?\s*(\d+)?', current_input, re.IGNORECASE)
            if m:
                return await _handle_delete(m.group(1))

            # Default message when no simple intent matched
            return {"conversation_id": conversation_id, "response": "Cohere API key missing and I couldn't infer a simple command. Please provide a clear command like: 'add task title: Buy milk description: 2 liters'", "tool_calls": []}

        iteration = 0
        all_tool_calls = []
        current_input = message

        while iteration < max_iterations:
            iteration += 1
            
            # Fetch history for context
            db_messages = await self.message_repo.get_conversation_messages(
                db=db,
                conversation_id=conversation_id
            )
            chat_history = [
                {"role": "USER" if m.role == "user" else "CHATBOT", "message": m.content}
                for m in db_messages
            ]

            # Call AI (run in thread so we don't block the event loop)
            import asyncio

            def _cohere_chat_call():
                return self.co.chat(
                    message=current_input,
                    chat_history=chat_history[:-1],  # Keep context but exclude current
                    preamble=personalized_prompt
                )

            try:
                response = await asyncio.to_thread(_cohere_chat_call)
            except Exception as e:
                print(f"Cohere call failed: {e}")
                # Persist an error assistant message and return an error response
                await self.message_repo.create(
                    db=db,
                    conversation_id=conversation_id,
                    role="assistant",
                    content="Sorry, I'm having trouble contacting the AI service. Please try again later."
                )
                return {
                    "conversation_id": conversation_id,
                    "response": "Sorry, I'm having trouble contacting the AI service. Please try again later.",
                    "tool_calls": all_tool_calls
                }

            # Check for tool calls
            executed = await self._process_tool_calls(db, user_id, response.text, conversation_id)
            
            if executed:
                all_tool_calls.extend(executed)
                
                # OPTIMIZATION: Instead of calling AI again, generate an immediate confirmation
                # This makes the response ~2x faster.
                final_text = self._generate_tool_response(executed, user_language="ur")
                
                # Save final response to DB
                await self.message_repo.create(
                    db=db,
                    conversation_id=conversation_id,
                    role="assistant",
                    content=final_text
                )
                
                return {
                    "conversation_id": conversation_id,
                    "response": final_text,
                    "tool_calls": all_tool_calls
                }
            else:
                # No more tools, this is the final natural response
                # Save it to DB
                await self.message_repo.create(
                    db=db,
                    conversation_id=conversation_id,
                    role="assistant",
                    content=response.text
                )
                return {
                    "conversation_id": conversation_id,
                    "response": response.text,
                    "tool_calls": all_tool_calls
                }

        return {
            "conversation_id": conversation_id,
            "response": "I'm sorry, that took too many steps. Can we try something simpler?",
            "tool_calls": all_tool_calls
        }