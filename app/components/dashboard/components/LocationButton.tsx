/* eslint-disable @typescript-eslint/no-unused-vars */
// maps/components/LocationButton.tsx
"use client";

import { useState } from "react";

interface LocationButtonProps {
  onLocationFound: () => void;
  isLocating: boolean;
}

export const LocationButton = ({
  onLocationFound,
  isLocating,
}: LocationButtonProps) => {
  return (
    <button
      onClick={onLocationFound}
      disabled={isLocating}
      className="w-full flex items-center border-[#097593] justify-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-[12px] font-semibold rounded-[12px] transition-colors duration-200 shadow-sm"
    >
      {isLocating ? (
        <>
          <svg
            className="w-4 h-4 animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-2 8l.7-.7M12 18.01l.01-.01M17.656 17.656l-.707-.707M18.01 12l-.01.01M17.656 6.344l-.707.707M12 6.01l.01-.01M6.344 6.344l.707.707M6.01 12l.01-.01M6.344 17.656l.707-.707"
            />
          </svg>
          <span>Mencari...</span>
        </>
      ) : (
        <>
          <span>LOKASI SAYA</span>
        </>
      )}
    </button>
  );
};
