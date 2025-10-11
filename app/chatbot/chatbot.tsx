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
      text: "Halo! Saya Eco Helper, asisten AI untuk platform BekasinAja! Ada yang bisa saya bantu terkait produk bekas, mitra reparasi, atau informasi lainnya? 🌱",
      sender: "bot",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Function to parse streaming response from AI SDK
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
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith('0:"') && line.endsWith('"')) {
            // Extract text from streaming format: 0:"text content"
            const text = line.slice(3, -1); // Remove '0:"' and closing '"'
            // Unescape common characters
            const unescapedText = text
              .replace(/\\"/g, '"')
              .replace(/\\n/g, "\n")
              .replace(/\\t/g, "\t");
            result += unescapedText;
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

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

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: formattedMessages,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      let botText = "";

      // Check if response is streaming or regular
      const contentType = response.headers.get("content-type");

      if (contentType?.includes("text/plain")) {
        // Handle streaming response
        try {
          botText = await parseStreamingResponse(response);
        } catch (streamError) {
          console.error("Streaming parse error:", streamError);
          // Fallback to regular text parsing
          botText = await response.text();
        }
      } else {
        // Handle regular JSON response
        try {
          const responseText = await response.text();
          const data = JSON.parse(responseText);
          botText = data.text || data.message || responseText;
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          botText = await response.text();
        }
      }

      // Clean up any remaining streaming artifacts
      botText = botText
        .replace(/^f:\{[^}]*\}\s*/, "") // Remove metadata
        .replace(/e:\{[^}]*\}\s*$/, "") // Remove end metadata
        .replace(/d:\{[^}]*\}\s*$/, "") // Remove done metadata
        .replace(/^\d+:"/, "") // Remove leading streaming markers
        .replace(/"$/, "") // Remove trailing quotes
        .trim();

      if (!botText) {
        botText = "Maaf, saya tidak dapat memproses permintaan Anda saat ini.";
      }

      const botMessage: MessageData = {
        id: Date.now().toString() + "-bot",
        text: botText,
        sender: "bot",
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
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
        botName="Eco Helper AI" // Update bot name
      />
    </>
  );
};

export default Chatbot;
