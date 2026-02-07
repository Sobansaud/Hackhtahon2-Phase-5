import { useState, useCallback } from 'react';
import { ChatMessage as ChatMessageType, ChatState as ChatStateType, ChatResponse } from '../lib/types';
import { sendChatMessage } from '../lib/chat-api';

export const useChat = () => {
  const [chatState, setChatState] = useState<ChatStateType>({
    isOpen: false,
    messages: [],
    isLoading: false,
    conversationId: null,
    refreshTrigger: 0,
    lastToolCalls: [],
  });

  const openChat = useCallback(() => {
    setChatState(prev => ({ ...prev, isOpen: true }));
  }, []);

  const closeChat = useCallback(() => {
    setChatState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const toggleChat = useCallback(() => {
    setChatState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    // Get user ID from token or storage
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('User not authenticated');
    }

    // Extract user ID from JWT token
    let userId = '';
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      userId = tokenPayload.userId || tokenPayload.sub;
      if (!userId) {
        throw new Error('User ID not found in token');
      }
    } catch (error) {
      throw new Error('Invalid token format');
    }

    // Add user message to chat
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      conversationId: chatState.conversationId || 'new',
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
    }));

    try {
      // Send message to backend
      const response: ChatResponse = await sendChatMessage(
        userId,
        message,
        chatState.conversationId || undefined
      );

      // Update conversation ID if it's new
      if (!chatState.conversationId) {
        setChatState(prev => ({ ...prev, conversationId: response.conversation_id }));
      }

      // Add assistant response to chat
      const assistantMessage: ChatMessageType = {
        id: `assistant-${Date.now()}`,
        conversationId: response.conversation_id,
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
        refreshTrigger: prev.refreshTrigger + 1,
        lastToolCalls: response.tool_calls || [],
      }));
    } catch (error) {
      console.error('Error sending message:', error);

      // Add error message to chat
      const errorMessage: ChatMessageType = {
        id: `error-${Date.now()}`,
        conversationId: chatState.conversationId || 'new',
        role: 'assistant',
        content: error instanceof Error ? error.message : 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isLoading: false,
      }));
    }
  }, [chatState.conversationId]);

  const clearChat = useCallback(() => {
    setChatState(prev => ({
      ...prev,
      messages: [],
      conversationId: null,
    }));
  }, []);

  const loadConversationHistory = useCallback(async (conversationId: string) => {
    // Get user ID from token or storage
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('User not authenticated');
    }

    try {
      // Extract user ID from JWT token
      let userId = '';
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        userId = tokenPayload.userId || tokenPayload.sub;
        if (!userId) {
          throw new Error('User ID not found in token');
        }
      } catch (error) {
        throw new Error('Invalid token format');
      }

      // In a real implementation, we would call the API to get conversation history
      // For now, we'll just update the conversation ID
      setChatState(prev => ({
        ...prev,
        conversationId: conversationId,
        // We would populate messages from the API response here
      }));
    } catch (error) {
      console.error('Error loading conversation history:', error);
      throw error;
    }
  }, []);

  return {
    chatState,
    openChat,
    closeChat,
    toggleChat,
    sendMessage,
    clearChat,
    loadConversationHistory,
  };
};