import React from 'react';
import styles from './MessageBubble.module.css';

interface MessageBubbleProps {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ role, content, timestamp }) => {
  const isUser = role === 'user';
  const isAssistant = role === 'assistant';

  // Format timestamp
  const formattedTime = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`${styles.messageBubble} ${isUser ? styles.user : isAssistant ? styles.assistant : styles.system}`}>
      <div className={styles.content}>
        <div className={styles.text}>{content}</div>
        <div className={styles.timestamp}>{formattedTime}</div>
      </div>
    </div>
  );
};

export default MessageBubble;