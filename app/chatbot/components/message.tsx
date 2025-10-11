/* eslint-disable prefer-const */
// app/chatbot/components/Message.tsx
"use client";

import React from "react";
import "../chatbot.css";

export interface MessageData {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp?: string;
}

interface MessageProps {
  message: MessageData;
}

// Enhanced markdown parsing for farming content
const parseMarkdown = (text: string) => {
  // Split by double newlines untuk paragraphs
  const paragraphs = text.split(/\n\s*\n/);

  return paragraphs.map((paragraph, paragraphIndex) => {
    if (!paragraph.trim()) {
      return <br key={paragraphIndex} />;
    }

    // Split paragraph ke lines untuk handle lists dan formatting
    const lines = paragraph.split("\n");
    const processedLines = lines
      .map((line, lineIndex) => {
        if (!line.trim()) return null;

        // Enhanced processing untuk farming terms dan formatting
        let processedText = line
          .replace(/\*{3,}/g, "**") // Replace triple+ asterisks dengan double
          .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>") // Convert **text** to bold
          .replace(/\*([^*]+)\*/g, "<em>$1</em>") // Convert *text* to italic
          // Highlight prices
          .replace(
            /(Rp\s?[\d.,]+)/g,
            "<strong style='color: #059669;'>$1</strong>"
          )
          // Highlight quantities
          .replace(/([0-9]+)\s?(kg|gram|ton|liter)/gi, "<strong>$1 $2</strong>")
          // Status badges
          .replace(
            /(TERSEDIA|HABIS|PREORDER|VERY_GOOD|GOOD|FAIR)/gi,
            "<span style='background: #dcfce7; padding: 2px 6px; border-radius: 4px; font-size: 0.85em; color: #065f46;'>$1</span>"
          )
          // Handle numbered lists (1. 2. 3.)
          .replace(/^(\d+\.\s)(.+)/, "<strong>$1</strong>$2")
          // Handle bullet points with dashes
          .replace(
            /^(\s*-\s)(.+)/,
            "<span style='color: #6b7280;'>$1</span>$2"
          );

        // Check if this is a list item
        const isListItem = /^\s*[\d]+\./.test(line) || /^\s*-/.test(line);

        if (isListItem) {
          return (
            <div
              key={`${paragraphIndex}-${lineIndex}`}
              style={{
                marginLeft: "1rem",
                marginBottom: "0.25rem",
                lineHeight: "1.5",
              }}
              dangerouslySetInnerHTML={{ __html: processedText }}
            />
          );
        } else {
          return (
            <div
              key={`${paragraphIndex}-${lineIndex}`}
              style={{
                marginBottom: lineIndex === lines.length - 1 ? "0" : "0.25rem",
                lineHeight: "1.6",
              }}
              dangerouslySetInnerHTML={{ __html: processedText }}
            />
          );
        }
      })
      .filter(Boolean); // Remove null items

    return (
      <div
        key={paragraphIndex}
        style={{
          marginBottom: paragraphIndex === paragraphs.length - 1 ? "0" : "1rem",
        }}
      >
        {processedLines}
      </div>
    );
  });
};

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.sender === "user";

  return (
    <div className={`message-container ${isUser ? "user" : "bot"}`}>
      <div className={`message-bubble ${isUser ? "user" : "bot"}`}>
        {parseMarkdown(message.text)}
      </div>
      {message.timestamp && (
        <div className="message-timestamp">{message.timestamp}</div>
      )}
    </div>
  );
};

export default Message;
