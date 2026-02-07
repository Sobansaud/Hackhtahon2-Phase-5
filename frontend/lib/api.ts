import { Todo, CreateTodoRequest, UpdateTodoRequest } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001/api';

// Base API client with JWT handling
class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
    console.log('API Client initialized with URL:', this.baseUrl);
  }

  // Get JWT token from storage
  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  // Check if token is expired
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  // Prepare headers with JWT token
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = this.getToken();
    if (token && !this.isTokenExpired(token)) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Generic request method
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      // Handle token expiration
      if (response.status === 401) {
        this.handleTokenExpiration();
        throw new Error('Authentication required');
      }

      // No Content (204) responses have no body
      if (response.status === 204) {
        return {} as unknown as T;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API request failed: ${response.status}`);
      }

      // Some responses may have empty bodies; guard against invalid JSON
      const text = await response.text();
      if (!text) return {} as unknown as T;
      return JSON.parse(text) as T;
    } catch (error) {
      console.error(`API request error for ${url}:`, error);
      throw error;
    }
  }

  // Handle token expiration
  private handleTokenExpiration(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user_name');
      window.location.href = '/auth/sign-in';
    }
  }

  // Auth methods
  async signIn(email: string, password: string): Promise<{ user: any; token: string }> {
    const response = await fetch(`${this.baseUrl}/auth/sign-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || 'Sign in failed');
    }

    const data = await response.json();

    // Store token and user name in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', data.token);
      if (data.user?.full_name) {
        localStorage.setItem('user_name', data.user.full_name);
      } else if (data.user?.name) {
        localStorage.setItem('user_name', data.user.name);
      }
    }

    return data;
  }

  async signUp(email: string, password: string, name: string): Promise<{ user: any; token: string }> {
    const response = await fetch(`${this.baseUrl}/auth/sign-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || 'Sign up failed');
    }

    const data = await response.json();

    // Store token and user name in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', data.token);
      if (data.user?.full_name) {
        localStorage.setItem('user_name', data.user.full_name);
      } else if (data.user?.name) {
        localStorage.setItem('user_name', data.user.name);
      } else if (name) {
        localStorage.setItem('user_name', name);
      }
    }

    return data;
  }

  async signOut(): Promise<void> {
    // Remove token from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user_name');
    }

    // Call the backend logout endpoint if needed
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      // Even if the backend call fails, we still clear the local token
      console.error('Sign out error:', error);
    }
  }

  // Todo methods
  async getTodos(
    status?: string,
    filterStatus?: string,
    filterPriority?: string,
    filterTag?: string,
    filterDueDateStart?: string,
    filterDueDateEnd?: string,
    search?: string,
    sort?: string,
    page: number = 1,
    limit: number = 50
  ): Promise<Todo[]> {
    // Build query parameters
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (filterStatus) params.append('filter_status', filterStatus);
    if (filterPriority) params.append('filter_priority', filterPriority);
    if (filterTag) params.append('filter_tag', filterTag);
    if (filterDueDateStart) params.append('filter_due_date_start', filterDueDateStart);
    if (filterDueDateEnd) params.append('filter_due_date_end', filterDueDateEnd);
    if (search) params.append('search', search);
    if (sort) params.append('sort', sort);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const queryString = params.toString();
    const endpoint = `/tasks/${queryString ? '?' + queryString : ''}`;

    const response = await this.request<any>(endpoint);

    // Handle both array response (for backward compatibility) and object response (with pagination)
    if (Array.isArray(response)) {
      // Legacy response format
      return response.map(this.mapTaskToTodo);
    } else {
      // New response format with pagination
      return response.tasks.map(this.mapTaskToTodo);
    }
  }

  async createTodo(todoData: CreateTodoRequest): Promise<Todo> {
    const task = await this.request<any>('/tasks/', {
      method: 'POST',
      body: JSON.stringify({
        ...todoData,
        dueDate: todoData.dueDate || undefined, // Send as undefined if empty to use backend defaults
        tags: todoData.tags || []
      }),
    });
    return this.mapTaskToTodo(task);
  }

  async updateTodo(id: number, todoData: UpdateTodoRequest): Promise<Todo> {
    const task = await this.request<any>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...todoData,
        dueDate: todoData.dueDate || undefined, // Send as undefined if empty to use backend defaults
        tags: todoData.tags || []
      }),
    });
    return this.mapTaskToTodo(task);
  }

  async deleteTodo(id: number): Promise<void> {
    await this.request(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleTodoComplete(id: number, completed: boolean): Promise<Todo> {
    const task = await this.request<any>(`/tasks/${id}/complete`, {
      method: 'PATCH',
      body: JSON.stringify({ completed }),
    });
    return this.mapTaskToTodo(task);
  }

  private mapTaskToTodo(task: any): Todo {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.completed,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
      userId: task.user_id,
      // New fields for intermediate/advanced features
      priority: task.priority,
      tags: task.tags,
      dueDate: task.due_date,
      recurrence: task.recurrence,
      isOverdue: task.is_overdue,
    };
  }
}

// Create a singleton instance
export const apiClient = new ApiClient();

// Export individual methods for convenience
export const signIn = apiClient.signIn.bind(apiClient);
export const signUp = apiClient.signUp.bind(apiClient);
export const signOut = apiClient.signOut.bind(apiClient);
export const getTodos = apiClient.getTodos.bind(apiClient);
export const createTodo = apiClient.createTodo.bind(apiClient);
export const updateTodo = apiClient.updateTodo.bind(apiClient);
export const deleteTodo = apiClient.deleteTodo.bind(apiClient);
export const toggleTodoComplete = apiClient.toggleTodoComplete.bind(apiClient);
