// components/waste-offers/WasteOfferCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  WasteOffer,
  MATERIAL_TYPE_LABELS,
  OFFER_TYPE_LABELS,
} from "@/types/waste-offer";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface WasteOfferCardProps {
  offer: WasteOffer;
  showActions?: boolean;
  onEdit?: (id: string) => void;
  onCancel?: (id: string) => void;
  onComplete?: (id: string) => void;
}

export default function WasteOfferCard({
  offer,
  showActions = false,
  onEdit,
  onCancel,
  onComplete,
}: WasteOfferCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 text-green-800 border-green-200";
      case "RESERVED":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "TAKEN":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "COMPLETED":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getOfferTypeColor = (type: string) => {
    return type === "SELL"
      ? "bg-[#8C1007] text-white"
      : "bg-[#F4E1D2] text-[#8C1007]";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative h-48 bg-gray-100">
        {offer.images && offer.images.length > 0 ? (
          <Image
            src={offer.images[0]}
            alt={offer.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg
              className="w-16 h-16 text-gray-300"
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

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-medium ${getOfferTypeColor(
              offer.offerType
            )}`}
          >
            {OFFER_TYPE_LABELS[offer.offerType]}
          </span>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
              offer.status
            )}`}
          >
            {offer.status === "AVAILABLE" && "Tersedia"}
            {offer.status === "RESERVED" && "Direservasi"}
            {offer.status === "TAKEN" && "Diambil"}
            {offer.status === "COMPLETED" && "Selesai"}
            {offer.status === "CANCELLED" && "Dibatalkan"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1">
          {offer.title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
          <span>{MATERIAL_TYPE_LABELS[offer.materialType]}</span>
          {offer.weight && (
            <>
              <span>•</span>
              <span>{offer.weight} kg</span>
            </>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {offer.description}
        </p>

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="line-clamp-1">{offer.address}</span>
        </div>

        {offer.offerType === "SELL" && offer.suggestedPrice && (
          <div className="text-[#8C1007] font-semibold text-lg mb-3">
            Rp {offer.suggestedPrice.toLocaleString("id-ID")}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {offer.user.image ? (
              <Image
                src={offer.user.image}
                alt={offer.user.name || "User"}
                width={24}
                height={24}
                className="rounded-full"
              />
            ) : (
              <div className="w-6 h-6 bg-gray-200 rounded-full" />
            )}
            <span className="text-sm text-gray-600">{offer.user.name}</span>
          </div>

          <span className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(offer.createdAt), {
              addSuffix: true,
              locale: idLocale,
            })}
          </span>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 mt-4">
            {offer.status === "AVAILABLE" && (
              <>
                <button
                  onClick={() => onEdit?.(offer.id)}
                  className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => onCancel?.(offer.id)}
                  className="flex-1 px-3 py-2 text-sm font-medium text-white bg-[#8C1007] rounded-md hover:bg-[#6d0c05] transition-colors"
                >
                  Batalkan
                </button>
              </>
            )}

            {(offer.status === "TAKEN" || offer.status === "RESERVED") && (
              <button
                onClick={() => onComplete?.(offer.id)}
                className="flex-1 px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
              >
                Tandai Selesai
              </button>
            )}

            {offer.status === "COMPLETED" && offer.pengepul && (
              <Link
                href={`/reviews/create?pengepulId=${offer.pengepul.id}`}
                className="flex-1 px-3 py-2 text-sm font-medium text-center text-[#8C1007] bg-[#F4E1D2] rounded-md hover:bg-[#e8d1c0] transition-colors"
              >
                Beri Review
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
