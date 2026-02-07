"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useChat } from '../../hooks/useChat';
import { ChatState } from '@/lib/types';

interface ChatContextType {
  chatState: ChatState;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  sendMessage: (message: string) => Promise<void>;
  clearChat: () => void;
  loadConversationHistory: (conversationId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const chatHook = useChat();

  return (
    <ChatContext.Provider value={chatHook}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};