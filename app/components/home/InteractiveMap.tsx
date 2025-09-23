"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

export function InteractiveMap() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const dummyData = [
    {
      id: 1,
      position: [-7.2575, 112.7521] as [number, number],
      type: "pengepul",
      name: "EcoCollect Surabaya",
      description: "Pengepul plastik dan logam",
    },
    {
      id: 2,
      position: [-7.2619, 112.7378] as [number, number],
      type: "pengrajin",
      name: "Kreasi Daur Ulang",
      description: "Pengrajin produk ramah lingkungan",
    },
    {
      id: 3,
      position: [-7.2504, 112.7688] as [number, number],
      type: "user",
      name: "Sampah Botol Plastik",
      description: "5kg botol plastik siap diambil",
    },
  ];

  if (!isMounted) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#F4E1D2] to-[#B7410E]/20 animate-pulse rounded-2xl flex items-center justify-center">
        <div className="text-[#B7410E] font-medium">Memuat peta...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={[-7.2575, 112.7521]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {dummyData.map((item) => (
          <Marker key={item.id} position={item.position}>
            <Popup className="custom-popup">
              <div className="p-2">
                <h3 className="font-semibold text-[#2C2C2C] mb-1">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-600">{item.description}</p>
                <div
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                    item.type === "pengepul"
                      ? "bg-blue-100 text-blue-800"
                      : item.type === "pengrajin"
                      ? "bg-green-100 text-green-800"
                      : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {item.type === "pengepul"
                    ? "Pengepul"
                    : item.type === "pengrajin"
                    ? "Pengrajin"
                    : "Pengguna"}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
        <div className="text-sm font-medium text-[#2C2C2C]">Surabaya</div>
        <div className="text-xs text-gray-500">3 aktif dalam radius 5km</div>
      </div>
    </div>
  );
}
