/* eslint-disable @next/next/no-img-element */
// app/chatbot/components/ChatPopup.tsx
"use client";

import React, { useState, useRef, useEffect, FormEvent } from "react";
import Message, { MessageData } from "./message";
import LoginCard from "./login-card";
import ChatModeSelector from "./chat-mode-selector";
import CsChat from "./cs-chat";
import "../chatbot.css";

interface ChatPopupProps {
  isOpen: boolean;
  onClose: () => void;
  messages: MessageData[];
  onSendMessage: (messageText: string) => Promise<void>;
  isLoading: boolean;
  botName?: string;
  botAvatarUrl?: string;
}

interface UserData {
  name: string;
  email: string;
}

const SendIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="20"
    height="20"
  >
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);

const ChatPopup: React.FC<ChatPopupProps> = ({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  isLoading,
  botName = "Eco Helper",
  botAvatarUrl,
}) => {
  // All useState hooks at the top
  const [inputValue, setInputValue] = useState("");
  const [user, setUser] = useState<UserData | null>(null);
  const [currentView, setCurrentView] = useState<
    "login" | "selector" | "chatbot" | "cs"
  >("login");
  const [mounted, setMounted] = useState(false);

  // All useRef hooks
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load session when component mounts
  useEffect(() => {
    setMounted(true);
    const savedUser = localStorage.getItem("chatbot_user");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setCurrentView("selector");
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("chatbot_user");
      }
    }
  }, []);

  // Scroll to bottom effect
  useEffect(() => {
    if (isOpen && currentView === "chatbot") {
      scrollToBottom();
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen, messages, currentView]);

  // Early return for hydration mismatch prevention
  if (!mounted) {
    return (
      <div
        className={`chat-popup ${isOpen ? "open" : ""}`}
        suppressHydrationWarning
      ></div>
    );
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogin = (userData: UserData) => {
    setUser(userData);
    setCurrentView("selector");
    // Save to localStorage
    localStorage.setItem("chatbot_user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView("login");
    // Remove from localStorage
    localStorage.removeItem("chatbot_user");
    localStorage.removeItem("chatbot_cs_messages"); // also remove chat history
  };

  const handleModeSelect = (mode: "chatbot" | "cs") => {
    setCurrentView(mode);
  };

  const handleBackToSelector = () => {
    setCurrentView("selector");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      await onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  const renderContent = () => {
    if (!user || currentView === "login") {
      return <LoginCard onLogin={handleLogin} onClose={onClose} />;
    }

    if (currentView === "selector") {
      return (
        <ChatModeSelector
          onSelectMode={handleModeSelect}
          onLogout={handleLogout}
          userName={user.name}
        />
      );
    }

    if (currentView === "cs") {
      return (
        <CsChat
          userEmail={user.email}
          userName={user.name}
          onBack={handleBackToSelector}
        />
      );
    }

    // chatbot view
    return (
      <>
        <div className="chat-popup-header">
          <button onClick={handleBackToSelector} className="back-btn">
            ←
          </button>
          {botAvatarUrl && (
            <img src={botAvatarUrl} alt={botName} className="header-icon" />
          )}
          <h3>{botName}</h3>
          <button
            onClick={onClose}
            className="chat-close-btn"
            aria-label="Close chat"
          >
            ×
          </button>
        </div>
        <div className="chat-popup-messages">
          {messages.map((msg) => (
            <Message key={msg.id} message={msg} />
          ))}
          {isLoading && (
            <div className="message-container bot">
              <div className="message-bubble bot loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="chat-popup-input-area">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ketik pesanmu..."
            disabled={isLoading}
            aria-label="Chat input"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </form>
      </>
    );
  };

  return (
    <div className={`chat-popup ${isOpen ? "open" : ""}`}>
      {renderContent()}
    </div>
  );
};

export default ChatPopup;
