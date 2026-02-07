"use client";

import React, { useState } from 'react';
import { useChatContext } from './ChatProvider';
import styles from './ChatButton.module.css';

const ChatButton: React.FC = () => {
  const { toggleChat } = useChatContext();
  const [isPulsing, setIsPulsing] = useState(true);

  // Stop pulsing animation after initial render
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsPulsing(false);
    }, 3000); // Stop pulsing after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <button
      className={`${styles.chatButton} ${isPulsing ? styles.pulse : ''}`}
      onClick={toggleChat}
      aria-label="Open chatbot"
    >
      <div className={styles.icon}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>
    </button>
  );
};

export default ChatButton;