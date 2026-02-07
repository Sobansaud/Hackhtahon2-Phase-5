export interface ChatMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ChatState {
  messages: ChatMessage[];
  currentConversationId: string | null;
  isLoading: boolean;
  error: string | null;
  isOpen: boolean;
}