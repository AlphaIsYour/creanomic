/* eslint-disable react-hooks/exhaustive-deps */
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
  const lastMessageCountRef = useRef(0);

  // Load chat history saat component mount
  useEffect(() => {
    loadChatHistory();

    // Setup polling untuk cek pesan baru setiap 5 detik (lebih hemat resource)
    pollingRef.current = setInterval(() => {
      loadChatHistory(true); // Silent refresh
    }, 5000);

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

  const loadChatHistory = async (silent = false) => {
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
            text: `Halo ${userName}! 👋 Anda terhubung dengan Customer Service Daurin. Ada yang bisa kami bantu?`,
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

        // Notif jika ada pesan baru dari CS (saat polling)
        if (silent && formattedMessages.length > lastMessageCountRef.current) {
          const newMessages =
            formattedMessages.length - lastMessageCountRef.current;
          if (newMessages > 0) {
            toast.success(`${newMessages} pesan baru dari CS!`, {
              icon: "💬",
            });
          }
        }

        lastMessageCountRef.current = formattedMessages.length;
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
      if (!silent) {
        setMessages([
          {
            id: "cs-initial",
            text: `Halo ${userName}! 👋 Anda terhubung dengan Customer Service Daurin. Ada yang bisa kami bantu?`,
            sender: "bot",
          },
        ]);
      }
    } finally {
      if (!silent) {
        setFetchLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const messageText = inputValue.trim();
    setInputValue(""); // Clear input immediately
    setIsLoading(true);

    const userMessage: MessageData = {
      id: Date.now().toString() + "-user",
      text: messageText,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch("/api/cs-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail,
          userName,
          message: messageText,
        }),
      });

      if (response.ok) {
        const confirmMessage: MessageData = {
          id: Date.now().toString() + "-confirm",
          text: "✅ Pesan terkirim! CS kami akan segera merespon.",
          sender: "bot",
        };

        setMessages((prev) => [...prev, confirmMessage]);

        // Refresh chat history setelah 1 detik
        setTimeout(() => {
          loadChatHistory(true);
        }, 1000);
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending CS message:", error);
      const errorMessage: MessageData = {
        id: Date.now().toString() + "-error",
        text: "❌ Gagal mengirim pesan. Silakan coba lagi.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast.error("Gagal mengirim pesan!");
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
            text: `Halo ${userName}! 👋 Anda terhubung dengan Customer Service Daurin. Ada yang bisa kami bantu?`,
            sender: "bot",
          },
        ]);
        lastMessageCountRef.current = 1;
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
            Yakin ingin menghapus semua riwayat chat?
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
          <h3>Customer Service Daurin</h3>
        </div>
        <div className="loading">Memuat riwayat chat...</div>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
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
        <button onClick={onBack} className="back-btn" title="Kembali">
          ←
        </button>
        <h3>Customer Service Daurin</h3>
        <button
          onClick={handleDeleteChat}
          className="delete-chat-btn"
          title="Hapus Semua Chat"
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
          placeholder="Ketik pesan untuk Customer Service..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !inputValue.trim()}>
          <SendIcon />
        </button>
      </form>

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
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
