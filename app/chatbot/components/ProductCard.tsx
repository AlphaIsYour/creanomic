// app/chatbot/components/ProductCard.tsx
"use client";

import React from "react";

export interface ProductData {
  id: string;
  title: string;
  price: number;
  materials: string[];
  category: string;
  stock: number;
  customizable: boolean;
  pengrajinName: string;
  pengrajinRating: number;
  pengrajinPhone: string;
  description: string;
}

interface ProductCardProps {
  data: ProductData;
}

const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString("id-ID")}`;
  };

  return (
    <div className="product-card">
      <div className="card-header">
        <h3 className="card-title">{data.title}</h3>
        <div className="card-price">{formatPrice(data.price)}</div>
      </div>

      <div className="card-info">
        <div className="info-row">
          <span className="info-icon">📦</span>
          <span className="info-text">{data.materials.join(", ")}</span>
        </div>
        <div className="info-row">
          <span className="info-icon">🏷️</span>
          <span className="info-text">{data.category}</span>
        </div>
        <div className="info-row">
          <span className="info-icon">📊</span>
          <span className="info-text">Stok: {data.stock} pcs</span>
        </div>
        {data.customizable && (
          <div className="info-row">
            <span className="info-icon">✨</span>
            <span className="info-text custom-badge">Bisa Custom</span>
          </div>
        )}
        <div className="info-row">
          <span className="info-icon">👨‍🎨</span>
          <span className="info-text">
            {data.pengrajinName} • ⭐ {data.pengrajinRating.toFixed(1)}
          </span>
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
          href={`/marketplace/products/${data.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          Lihat Produk
        </a>
        {data.pengrajinPhone && (
          <a
            href={`https://wa.me/${data.pengrajinPhone.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            💬 Chat Pengrajin
          </a>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
