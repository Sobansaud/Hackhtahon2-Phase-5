import { ChatRequest, ChatResponse } from './types';

// Point to backend server
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001/api';

class ChatApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async sendMessage(userId: string, message: string, conversationId?: string): Promise<ChatResponse> {
    const url = `${this.baseUrl}/${userId}/chat`;
    const headers = this.getHeaders();
    console.log('Chat API Request:', { url, userId, conversationId, headers }); // Enhanced debug log

    const requestBody: ChatRequest = {
      message,
      conversation_id: conversationId,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody),
        cache: 'no-store',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Chat API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { detail: errorText };
        }
        throw new Error(errorData.detail || errorData.message || `Chat API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Chat API Fetch Error:', error);

      if (error instanceof TypeError) {
        if (error.message.includes('fetch')) {
          throw new Error(`Failed to connect to ${url}. Is the backend running?`);
        }
      }
      throw error;
    }
  }

  async getConversationHistory(userId: string, conversationId: string): Promise<ChatResponse[]> {
    // For now, we'll simulate getting conversation history
    // In a real implementation, this would be a GET request to fetch conversation history
    return [];
  }

  async getConversations(userId: string): Promise<any[]> {
    // For now, we'll simulate getting user's conversations
    // In a real implementation, this would be a GET request to fetch user's conversations
    return [];
  }
}

// Create a singleton instance
export const chatApiClient = new ChatApiClient();

// Export individual methods for convenience
export const sendChatMessage = chatApiClient.sendMessage.bind(chatApiClient);