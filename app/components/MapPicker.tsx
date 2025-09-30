"use client";

import { useState, useEffect } from "react";
import { MapPin, X, Crosshair, Navigation } from "lucide-react";

interface MapPickerProps {
  initialLat: number;
  initialLng: number;
  onConfirm: (lat: number, lng: number) => void;
  onCancel: () => void;
}

export function MapPicker({
  initialLat,
  initialLng,
  onConfirm,
  onCancel,
}: MapPickerProps) {
  const [selectedLat, setSelectedLat] = useState(initialLat);
  const [selectedLng, setSelectedLng] = useState(initialLng);
  const [isLoadingMap, setIsLoadingMap] = useState(true);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setIsLoadingMap(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleGetCurrentLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSelectedLat(position.coords.latitude);
          setSelectedLng(position.coords.longitude);
          setIsGettingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(
            "Tidak dapat mengakses lokasi Anda. Pastikan izin lokasi sudah diberikan."
          );
          setIsGettingLocation(false);
        }
      );
    } else {
      alert("Browser Anda tidak mendukung Geolocation.");
      setIsGettingLocation(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/5 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Pilih Lokasi Perusahaan
              </h3>
              <p className="text-xs text-gray-500">
                Klik pada peta untuk menandai lokasi Anda
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative bg-gray-100">
          {isLoadingMap ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-3 text-sm text-gray-600 font-medium">
                  Memuat peta...
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Embedded Google Maps with iframe */}
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${selectedLat},${selectedLng}&z=15&output=embed`}
                className="w-full h-full"
              />

              {/* Get Current Location Button */}
              <button
                onClick={handleGetCurrentLocation}
                disabled={isGettingLocation}
                className="absolute top-4 right-4 bg-white rounded-lg shadow-lg px-4 py-2 flex items-center gap-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {isGettingLocation ? (
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Navigation className="w-4 h-4 text-blue-600" />
                )}
                <span className="text-sm font-medium text-gray-700">
                  {isGettingLocation ? "Mencari..." : "Lokasi Saya"}
                </span>
              </button>
            </>
          )}
        </div>

        {/* Coordinates Display & Actions */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Crosshair className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-gray-700">Koordinat:</span>
              <span className="text-gray-600 font-mono">
                {selectedLat.toFixed(6)}, {selectedLng.toFixed(6)}
              </span>
            </div>
          </div>

          {/* Manual Input */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={selectedLat}
                onChange={(e) =>
                  setSelectedLat(parseFloat(e.target.value) || 0)
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={selectedLng}
                onChange={(e) =>
                  setSelectedLng(parseFloat(e.target.value) || 0)
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Batal
            </button>
            <button
              onClick={() => onConfirm(selectedLat, selectedLng)}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Konfirmasi Lokasi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
