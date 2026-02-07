"use client";

import React, { useEffect, useRef } from 'react';
import { useChatContext } from './ChatProvider';
import { ChatMessage } from './types';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import styles from './ChatPanel.module.css';

const ChatPanel: React.FC = () => {
  const { chatState, closeChat, sendMessage } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages, chatState.isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!chatState.isOpen) return null;

  return (
    <div className={styles.chatPanelContainer}>
      <div className={styles.chatPanel}>
        {/* Header */}
        <div className={styles.header}>
          <h3>AI Todo Assistant</h3>
          <button className={styles.closeButton} onClick={closeChat} aria-label="Close chat">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Messages Container */}
        <div className={styles.messagesContainer}>
          {chatState.messages.map((message: any) => (
            <MessageBubble
              key={message.id}
              role={message.role}
              content={message.content}
              timestamp={new Date(message.timestamp)}
            />
          ))}
          {chatState.isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <MessageInput onSendMessage={sendMessage} disabled={chatState.isLoading} />
      </div>
    </div>
  );
};

export default ChatPanel;