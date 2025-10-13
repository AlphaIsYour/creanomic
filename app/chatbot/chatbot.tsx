// app/chatbot/Chatbot.tsx
"use client";

import React, { useState } from "react";
import ChatFab from "@/app/chatbot/components/chatfab";
import ChatPopup from "@/app/chatbot/components/chatpopup";
import { MessageData } from "@/app/chatbot/components/message";

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<MessageData[]>([
    {
      id: "initial-1",
      text: "Halo! Saya Eco Assistant dari Creanomic! 🌱 Ada yang bisa aku bantu terkait limbah, pengepul, kerajinan daur ulang, atau hal lainnya?",
      sender: "bot",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Improved streaming response parser
  const parseStreamingResponse = async (
    response: Response
  ): Promise<string> => {
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("No reader available");
    }

    let result = "";
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        console.log("📦 Raw chunk:", chunk.substring(0, 200)); // DEBUG

        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.trim()) continue;

          console.log("📝 Processing line:", line.substring(0, 100)); // DEBUG

          // Handle SSE format: data: ...
          if (line.startsWith("data: ")) {
            const content = line.substring(6).trim();
            if (content && content !== "[DONE]") {
              result += content;
              console.log("✅ Added from SSE:", content.substring(0, 50)); // DEBUG
            }
          }
          // Handle AI SDK format: 0:"text"
          else if (line.startsWith("0:")) {
            const content = line.substring(2).trim();
            if (content.startsWith('"') && content.endsWith('"')) {
              const text = content
                .slice(1, -1)
                .replace(/\\"/g, '"')
                .replace(/\\n/g, "\n")
                .replace(/\\\\/g, "\\");
              result += text;
              console.log("✅ Added from AI SDK:", text.substring(0, 50)); // DEBUG
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    console.log("🎯 Final result:", result.substring(0, 200)); // DEBUG
    return result.trim();
  };

  const handleSendMessage = async (messageText: string) => {
    const userMessage: MessageData = {
      id: Date.now().toString() + "-user",
      text: messageText,
      sender: "user",
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      // Format chat history for API (exclude initial message)
      const chatHistory = messages
        .filter((msg) => msg.id !== "initial-1")
        .slice(-6); // Keep last 6 messages for context

      const formattedMessages = [
        ...chatHistory.map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text,
        })),
        {
          role: "user",
          content: messageText,
        },
      ];

      console.log("📤 Sending to API:", formattedMessages);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: formattedMessages,
        }),
      });

      console.log("📥 Response status:", response.status);
      console.log("📥 Content-Type:", response.headers.get("content-type"));

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      let botText = "";
      const contentType = response.headers.get("content-type");

      // Check if it's an error JSON response
      if (contentType?.includes("application/json")) {
        try {
          const jsonData = await response.json();
          if (jsonData.error) {
            botText = jsonData.message || "Terjadi kesalahan pada server";
          } else {
            botText = jsonData.text || jsonData.message || "";
          }
        } catch (e) {
          console.error("JSON parse error:", e);
        }
      } else if (
        contentType?.includes("text/plain") ||
        contentType?.includes("text/event-stream")
      ) {
        // Handle streaming response
        try {
          botText = await parseStreamingResponse(response);
          console.log("✅ Parsed streaming text:", botText.substring(0, 100));
        } catch (streamError) {
          console.error("❌ Streaming parse error:", streamError);
          // Fallback to regular text parsing
          botText = await response.text();
        }
      } else {
        // Fallback: try to get text directly
        botText = await response.text();
      }

      // Clean up response
      botText = botText
        .replace(/^f:\{[^}]*\}\s*/g, "") // Remove metadata
        .replace(/e:\{[^}]*\}\s*$/g, "") // Remove end metadata
        .replace(/d:\{[^}]*\}\s*$/g, "") // Remove done metadata
        .trim();

      console.log("🤖 Final bot text:", botText.substring(0, 100));

      // Better fallback message
      if (!botText || botText.length < 3) {
        console.warn("⚠️ Empty response detected");
        botText =
          "Hmm, aku kesulitan memproses pertanyaan ini. Bisa diulang dengan kata-kata berbeda? 🤔";
      }

      const botMessage: MessageData = {
        id: Date.now().toString() + "-bot",
        text: botText,
        sender: "bot",
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("❌ Error sending message:", error);
      const errorMessage: MessageData = {
        id: Date.now().toString() + "-error",
        text: "Waduh, sepertinya ada kendala teknis. Coba lagi dalam beberapa saat ya! 😅",
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ChatFab onClick={toggleChat} isOpen={isOpen} />
      <ChatPopup
        isOpen={isOpen}
        onClose={toggleChat}
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        botName="Eco Assistant"
      />
    </>
  );
};

export default Chatbot;
