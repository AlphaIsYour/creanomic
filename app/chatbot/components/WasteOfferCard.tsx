// app/chatbot/components/WasteOfferCard.tsx
"use client";

import React from "react";

export interface WasteOfferData {
  id: string;
  title: string;
  materialType: string;
  weight: number;
  offerType: "SELL" | "DONATE";
  price?: number;
  address: string;
  userName: string;
  userPhone: string;
  description: string;
}

interface WasteOfferCardProps {
  data: WasteOfferData;
}

const WasteOfferCard: React.FC<WasteOfferCardProps> = ({ data }) => {
  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString("id-ID")}`;
  };

  return (
    <div className="waste-offer-card">
      <div className="card-header">
        <h3 className="card-title">{data.title}</h3>
        <div
          className={`card-badge ${
            data.offerType === "SELL" ? "sell" : "donate"
          }`}
        >
          {data.offerType === "SELL" ? "💰 Dijual" : "💝 Donasi"}
        </div>
      </div>

      <div className="card-info">
        <div className="info-row">
          <span className="info-icon">🏷️</span>
          <span className="info-text">{data.materialType}</span>
        </div>
        <div className="info-row">
          <span className="info-icon">⚖️</span>
          <span className="info-text">{data.weight} kg</span>
        </div>
        {data.price && data.offerType === "SELL" && (
          <div className="info-row">
            <span className="info-icon">💵</span>
            <span className="info-text price-highlight">
              {formatPrice(data.price)}
            </span>
          </div>
        )}
        <div className="info-row">
          <span className="info-icon">📍</span>
          <span className="info-text">{data.address}</span>
        </div>
        <div className="info-row">
          <span className="info-icon">👤</span>
          <span className="info-text">{data.userName}</span>
        </div>
      </div>

      {data.description && (
        <div className="card-description">
          {data.description.length > 100
            ? `${data.description.substring(0, 100)}...`
            : data.description}
        </div>
      )}

      <div className="card-actions">
        <a
          href={`/waste-offers/${data.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          Lihat Detail
        </a>
        {data.userPhone && (
          <a
            href={`https://wa.me/${data.userPhone.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            💬 Hubungi
          </a>
        )}
      </div>
    </div>
  );
};

export default WasteOfferCard;
