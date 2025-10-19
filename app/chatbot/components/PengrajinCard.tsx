// app/chatbot/components/PengrajinCard.tsx
"use client";

import React from "react";

export interface PengrajinData {
  id: string;
  name: string;
  rating: number;
  craftTypes: string[];
  materials: string[];
  experience: number;
  bookings: number;
  phone: string;
  instagram?: string;
  workshopAddress?: string;
}

interface PengrajinCardProps {
  data: PengrajinData;
}

const PengrajinCard: React.FC<PengrajinCardProps> = ({ data }) => {
  return (
    <div className="pengrajin-card">
      <div className="card-header">
        <h3 className="card-title">{data.name}</h3>
        <div className="card-rating">⭐ {data.rating.toFixed(1)}/5.0</div>
      </div>

      <div className="card-info">
        <div className="info-row">
          <span className="info-icon">🎨</span>
          <span className="info-text">{data.craftTypes.join(", ")}</span>
        </div>
        <div className="info-row">
          <span className="info-icon">📦</span>
          <span className="info-text">{data.materials.join(", ")}</span>
        </div>
        <div className="info-row">
          <span className="info-icon">💼</span>
          <span className="info-text">
            {data.experience} tahun pengalaman • {data.bookings} booking
          </span>
        </div>
        {data.workshopAddress && (
          <div className="info-row">
            <span className="info-icon">📍</span>
            <span className="info-text">{data.workshopAddress}</span>
          </div>
        )}
        {data.instagram && (
          <div className="info-row">
            <span className="info-icon">📸</span>
            <span className="info-text">@{data.instagram}</span>
          </div>
        )}
      </div>

      <div className="card-actions">
        <a
          href={`/pengrajin/${data.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          Kunjungi Profil
        </a>
        {data.phone && (
          <a
            href={`https://wa.me/${data.phone.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            💬 WhatsApp
          </a>
        )}
      </div>
    </div>
  );
};

export default PengrajinCard;
