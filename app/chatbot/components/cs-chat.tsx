"use client";

import React, { useState, useRef, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import Message, { MessageData } from "./message";
import "../chatbot.css";

interface CsChatProps {
  userEmail: string;
  userName: string;
  onBack: () => void;
}

interface CsMessage {
  id: string;
  message: string;
  adminReply?: string;
  createdAt: string;
  repliedAt?: string;
  status: string;
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

const CsChat: React.FC<CsChatProps> = ({ userEmail, userName, onBack }) => {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Load chat history saat component mount
  useEffect(() => {
    loadChatHistory();

    // Setup polling untuk cek pesan baru setiap 3 detik
    pollingRef.current = setInterval(() => {
      loadChatHistory();
    }, 3000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [userEmail]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (!fetchLoading) {
      inputRef.current?.focus();
    }
  }, [messages, fetchLoading]);

  const loadChatHistory = async () => {
    try {
      const response = await fetch(
        `/api/cs-chat/history?email=${encodeURIComponent(userEmail)}`
      );
      const data = await response.json();

      if (data.success) {
        const formattedMessages: MessageData[] = [];

        // Tambah pesan welcome jika belum ada chat
        if (data.messages.length === 0) {
          formattedMessages.push({
            id: "cs-initial",
            text: "Halo! Anda terhubung dengan Customer Service. Ada yang bisa kami bantu?",
            sender: "bot",
          });
        }

        // Format chat history
        data.messages.forEach((msg: CsMessage) => {
          // User message
          formattedMessages.push({
            id: `user-${msg.id}`,
            text: msg.message,
            sender: "user",
          });

          // Admin reply jika ada
          if (msg.adminReply) {
            formattedMessages.push({
              id: `admin-${msg.id}`,
              text: msg.adminReply,
              sender: "bot",
            });
          }
        });

        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
      // Set default message jika error
      setMessages([
        {
          id: "cs-initial",
          text: "Halo! Anda terhubung dengan Customer Service. Ada yang bisa kami bantu?",
          sender: "bot",
        },
      ]);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: MessageData = {
      id: Date.now().toString() + "-user",
      text: inputValue,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/cs-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail,
          userName,
          message: inputValue,
        }),
      });

      if (response.ok) {
        const confirmMessage: MessageData = {
          id: Date.now().toString() + "-confirm",
          text: "Pesan Anda telah diterima. CS kami akan segera merespon.",
          sender: "bot",
        };

        setMessages((prev) => [...prev, confirmMessage]);
        setInputValue("");

        // Refresh chat history setelah 1 detik
        setTimeout(() => {
          loadChatHistory();
        }, 1000);
      }
    } catch (error) {
      console.error("Error sending CS message:", error);
      const errorMessage: MessageData = {
        id: Date.now().toString() + "-error",
        text: "Gagal mengirim pesan. Silakan coba lagi.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteChat = async () => {
    try {
      const response = await fetch("/api/cs-chat/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail }),
      });

      if (response.ok) {
        setMessages([
          {
            id: "cs-initial",
            text: "Halo! Anda terhubung dengan Customer Service. Ada yang bisa kami bantu?",
            sender: "bot",
          },
        ]);
        toast.success("Chat berhasil dihapus!");
      } else {
        toast.error("Gagal menghapus chat!");
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast.error("Gagal menghapus chat!");
    }
  };

  const handleDeleteChat = () => {
    toast(
      (t) => (
        <div style={{ padding: "8px" }}>
          <p style={{ margin: "0 0 12px 0", fontWeight: "500" }}>
            Yakin ingin menghapus semua chat?
          </p>
          <div
            style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}
          >
            <button
              onClick={() => {
                toast.dismiss(t.id);
                deleteChat();
              }}
              style={{
                padding: "6px 12px",
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Ya, Hapus
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              style={{
                padding: "6px 12px",
                backgroundColor: "#6b7280",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Batal
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        style: {
          minWidth: "300px",
        },
      }
    );
  };

  if (fetchLoading) {
    return (
      <div className="cs-chat-container">
        <div className="chat-popup-header">
          <button onClick={onBack} className="back-btn">
            ←
          </button>
          <h3>Customer Service</h3>
        </div>
        <div className="loading">Loading chat history...</div>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
          }}
        />
      </div>
    );
  }

  return (
    <div className="cs-chat-container">
      <div className="chat-popup-header">
        <button onClick={onBack} className="back-btn">
          ←
        </button>
        <h3>Customer Service</h3>
        <button
          onClick={handleDeleteChat}
          className="delete-chat-btn"
          title="Hapus Chat"
        >
          🗑️
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
      <form
        onSubmit={handleSubmit}
        className="chat-popup-input-area items-end flex"
      >
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ketik pesan untuk CS..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !inputValue.trim()}>
          <SendIcon />
        </button>
      </form>

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
    </div>
  );
};

export default CsChat;
