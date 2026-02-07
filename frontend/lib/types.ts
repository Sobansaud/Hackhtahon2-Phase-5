// User type based on data-model.md
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// Todo type based on data-model.md
export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  userId: string;
  // New fields for intermediate/advanced features
  priority?: string; // "High" | "Medium" | "Low", default: "Medium"
  tags?: string[]; // Array of tag strings, default: []
  dueDate?: string; // "YYYY-MM-DD" format
  recurrence?: string; // "daily" | "weekly" | "monthly" | "none"
  isOverdue?: boolean; // Calculated property for UI
}

// AuthSession type based on data-model.md
export interface AuthSession {
  token: string;
  userId: string;
  expiresAt: string; // ISO date string
  createdAt: string; // ISO date string
}

// UIState type based on data-model.md
export interface UIState {
  currentView: 'signin' | 'signup' | 'dashboard';
  loading: boolean;
  error?: string;
  success?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// API Request types
export interface CreateTodoRequest {
  title: string;
  description?: string;
  completed?: boolean;
  // New fields for intermediate/advanced features
  priority?: string; // "High" | "Medium" | "Low", default: "Medium"
  tags?: string[]; // Array of tag strings, default: []
  dueDate?: string; // "YYYY-MM-DD" format
  recurrence?: string; // "daily" | "weekly" | "monthly" | "none"
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  completed?: boolean;
  // New fields for intermediate/advanced features
  priority?: string; // "High" | "Medium" | "Low"
  tags?: string[]; // Array of tag strings
  dueDate?: string; // "YYYY-MM-DD" format
  recurrence?: string; // "daily" | "weekly" | "monthly" | "none"
}

export interface SignUpRequest {
  email: string;
  name: string;
  password: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

// Form validation types
export interface TodoFormValues {
  title: string;
  description?: string;
  priority?: string; // "High" | "Medium" | "Low", default: "Medium"
  tags?: string[]; // Array of tag strings, default: []
  dueDate?: string; // "YYYY-MM-DD" format
  recurrence?: string; // "daily" | "weekly" | "monthly" | "none"
}

export interface AuthFormValues {
  email: string;
  password: string;
}

// Chat types
export interface ChatMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatState {
  isOpen: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  conversationId: string | null;
  refreshTrigger: number;
  lastToolCalls?: ToolCallInfo[];
}

export interface ToolCallInfo {
  tool: string;
  params: Record<string, unknown>;
  result: unknown;
}

export interface ChatRequest {
  conversation_id?: string;
  message: string;
}

export interface ChatResponse {
  conversation_id: string;
  response: string;
  tool_calls?: ToolCallInfo[];
}
