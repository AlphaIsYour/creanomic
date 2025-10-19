/* eslint-disable prefer-const */
// app/chatbot/components/Message.tsx
"use client";

import React from "react";
import "../chatbot.css";
import PengepulCard, { PengepulData } from "./PengepulCard";
import PengrajinCard, { PengrajinData } from "./PengrajinCard";
import WasteOfferCard, { WasteOfferData } from "./WasteOfferCard";
import ProductCard, { ProductData } from "./ProductCard";
import { CardData } from "../chatbot";

export interface MessageData {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp?: string;
  cardData?: CardData;
}

interface MessageProps {
  message: MessageData;
}

// Enhanced markdown parsing
const parseMarkdown = (text: string) => {
  const paragraphs = text.split(/\n\s*\n/);

  return paragraphs.map((paragraph, paragraphIndex) => {
    if (!paragraph.trim()) {
      return <br key={paragraphIndex} />;
    }

    const lines = paragraph.split("\n");
    const processedLines = lines
      .map((line, lineIndex) => {
        if (!line.trim()) return null;

        let processedText = line
          .replace(/\*{3,}/g, "**")
          .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
          .replace(/\*([^*]+)\*/g, "<em>$1</em>")
          .replace(
            /(Rp\s?[\d.,]+)/g,
            "<strong style='color: #059669;'>$1</strong>"
          )
          .replace(/([0-9]+)\s?(kg|gram|ton|liter)/gi, "<strong>$1 $2</strong>")
          .replace(
            /(TERSEDIA|HABIS|PREORDER|VERY_GOOD|GOOD|FAIR)/gi,
            "<span style='background: #dcfce7; padding: 2px 6px; border-radius: 4px; font-size: 0.85em; color: #065f46;'>$1</span>"
          )
          .replace(/^(\d+\.\s)(.+)/, "<strong>$1</strong>$2")
          .replace(
            /^(\s*-\s)(.+)/,
            "<span style='color: #6b7280;'>$1</span>$2"
          );

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
      .filter(Boolean);

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
      {/* Render cards jika ada */}
      {!isUser && message.cardData && (
        <div className="cards-container">
          {message.cardData.type === "PENGEPUL" &&
            (message.cardData.data as PengepulData[]).map((pengepul) => (
              <PengepulCard key={pengepul.id} data={pengepul} />
            ))}

          {message.cardData.type === "PENGRAJIN" &&
            (message.cardData.data as PengrajinData[]).map((pengrajin) => (
              <PengrajinCard key={pengrajin.id} data={pengrajin} />
            ))}

          {message.cardData.type === "WASTE_OFFERS" &&
            (message.cardData.data as WasteOfferData[]).map((waste) => (
              <WasteOfferCard key={waste.id} data={waste} />
            ))}

          {message.cardData.type === "PRODUCTS" &&
            (message.cardData.data as ProductData[]).map((product) => (
              <ProductCard key={product.id} data={product} />
            ))}
        </div>
      )}

      {/* Render text message */}
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
