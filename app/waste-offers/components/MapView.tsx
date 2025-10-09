/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/waste-offers/MapView.tsx
"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { WasteOffer, MATERIAL_TYPE_LABELS } from "@/types/waste-offer";
import Link from "next/link";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapViewProps {
  offers: WasteOffer[];
}

export default function MapView({ offers }: MapViewProps) {
  const [selectedOffer, setSelectedOffer] = useState<WasteOffer | null>(null);
  const defaultCenter: [number, number] = [-8.1319, 113.2254]; // Lumajang, East Java

  // Calculate center based on offers
  const center: [number, number] =
    offers.length > 0
      ? [
          offers.reduce((sum, o) => sum + o.latitude, 0) / offers.length,
          offers.reduce((sum, o) => sum + o.longitude, 0) / offers.length,
        ]
      : defaultCenter;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-3 h-[600px]">
        {/* Map */}
        <div className="lg:col-span-2 h-full">
          <MapContainer
            center={center}
            zoom={12}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {offers.map((offer) => (
              <Marker
                key={offer.id}
                position={[offer.latitude, offer.longitude]}
                eventHandlers={{
                  click: () => setSelectedOffer(offer),
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {offer.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {MATERIAL_TYPE_LABELS[offer.materialType]}
                      {offer.weight && ` • ${offer.weight} kg`}
                    </p>
                    {offer.offerType === "SELL" && offer.suggestedPrice && (
                      <p className="text-sm font-semibold text-[#8C1007] mb-2">
                        Rp {offer.suggestedPrice.toLocaleString("id-ID")}
                      </p>
                    )}
                    <Link
                      href={`/waste-offers/${offer.id}`}
                      className="text-sm text-[#8C1007] hover:underline"
                    >
                      Lihat Detail →
                    </Link>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Sidebar */}
        <div className="bg-gray-50 border-l border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 bg-white">
            <h3 className="font-semibold text-gray-900">
              {offers.length} Penawaran di Peta
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Klik marker untuk melihat detail
            </p>
          </div>

          <div className="p-4 space-y-3">
            {offers.map((offer) => (
              <div
                key={offer.id}
                onClick={() => setSelectedOffer(offer)}
                className={`p-3 bg-white rounded-lg border cursor-pointer transition-all ${
                  selectedOffer?.id === offer.id
                    ? "border-[#8C1007] shadow-md"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start gap-3">
                  {offer.images && offer.images.length > 0 ? (
                    <img
                      src={offer.images[0]}
                      alt={offer.title}
                      className="w-16 h-16 object-cover rounded flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">
                      {offer.title}
                    </h4>
                    <p className="text-xs text-gray-600 mb-1">
                      {MATERIAL_TYPE_LABELS[offer.materialType]}
                      {offer.weight && ` • ${offer.weight} kg`}
                    </p>
                    {offer.offerType === "SELL" && offer.suggestedPrice && (
                      <p className="text-sm font-semibold text-[#8C1007]">
                        Rp {offer.suggestedPrice.toLocaleString("id-ID")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
