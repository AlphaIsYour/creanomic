// app/chatbot/components/PengepulCard.tsx
"use client";

import React from "react";

export interface PengepulData {
  id: string;
  name: string;
  rating: number;
  materials: string[];
  areas: string[];
  phone: string;
  collections: number;
  totalWeight: number;
  workingHours?: string;
}

interface PengepulCardProps {
  data: PengepulData;
}

const PengepulCard: React.FC<PengepulCardProps> = ({ data }) => {
  return (
    <div className="pengepul-card">
      <div className="card-header">
        <h3 className="card-title">{data.name}</h3>
        <div className="card-rating">⭐ {data.rating.toFixed(1)}/5.0</div>
      </div>

      <div className="card-info">
        <div className="info-row">
          <span className="info-icon">📦</span>
          <span className="info-text">{data.materials.join(", ")}</span>
        </div>
        <div className="info-row">
          <span className="info-icon">📍</span>
          <span className="info-text">{data.areas.join(", ")}</span>
        </div>
        <div className="info-row">
          <span className="info-icon">🔢</span>
          <span className="info-text">
            {data.collections} koleksi • {data.totalWeight} kg terkumpul
          </span>
        </div>
        {data.workingHours && (
          <div className="info-row">
            <span className="info-icon">🕒</span>
            <span className="info-text">{data.workingHours}</span>
          </div>
        )}
      </div>

      <div className="card-actions">
        <a
          href={`/pengepul/${data.id}`}
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

export default PengepulCard;
