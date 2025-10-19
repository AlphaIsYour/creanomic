// app/chatbot/components/ChatFab.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import "../chatbot.css";

interface ChatFabProps {
  onClick: () => void;
  isOpen: boolean;
}

const ChatAppIcon = () => (
  <Image src="/images/chatbot.svg" alt="chatbot" width={38} height={38} />
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    width="28"
    height="28"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const SmallCloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    width="16"
    height="16"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const ChatFab: React.FC<ChatFabProps> = ({ onClick, isOpen }) => {
  const [showWelcomeImage, setShowWelcomeImage] = useState(true); // Default true
  const [hasInteracted, setHasInteracted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Welcome image akan muncul setiap refresh karena tidak lagi cek sessionStorage
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  const handleWelcomeImageClick = () => {
    setShowWelcomeImage(false);
    setHasInteracted(true);
    onClick();
  };

  const handleDismissWelcomeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowWelcomeImage(false);
    setHasInteracted(true);
  };

  const handleFabClick = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
    onClick();
  };

  return (
    <>
      {/* Welcome Image */}
      {showWelcomeImage && !hasInteracted && (
        <div
          className="fixed bottom-0 right-2 md:bottom-[-5px] md:right-[10px] cursor-pointer z-[998] transition-all duration-300 ease-in-out hover:scale-102 bg-transparent"
          onClick={handleWelcomeImageClick}
          style={{ bottom: window.innerWidth <= 768 ? "0px" : "-5px" }}
        >
          <Image
            src="/images/contact.svg"
            alt="Asisten CHat"
            width={200}
            height={150}
            className="rounded-xl transition-transform duration-200 ease-in-out bg-transparent w-32 h-24 md:w-[165px] md:h-[110px]"
            unoptimized
          />
          <button
            className="absolute -top-1 -right-1 md:-top-[1px] md:right-[14px] bg-red-500 hover:bg-red-600 border-2 border-white rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center cursor-pointer text-white text-xs transition-all duration-200 ease-in-out hover:scale-110 z-[999]"
            onClick={handleDismissWelcomeImage}
            aria-label="Tutup gambar"
          >
            <SmallCloseIcon />
          </button>
        </div>
      )}

      {/* Chat FAB - Only show when welcome image is not visible */}
      {(!showWelcomeImage || hasInteracted) && (
        <button
          className="fixed bottom-0 right-6 bg-[#8C1007] hover:bg-[#750c04] text-white border-none rounded-t-[10px] w-[120px] h-[42px] md:w-[120px] md:h-[45px] sm:w-14 sm:h-14 text-[28px] md:text-[28px] sm:text-2xl shadow-lg cursor-pointer flex justify-center items-center z-[999] transition-all duration-200 ease-in-out hover:scale-[1.01] sm:rounded-t-[10px] sm:bottom-0"
          onClick={handleFabClick}
          aria-label={isOpen ? "Tutup obrolan" : "Buka obrolan"}
          title={isOpen ? "Tutup obrolan" : "Buka obrolan"}
        >
          {isOpen ? <CloseIcon /> : <ChatAppIcon />}
        </button>
      )}
    </>
  );
};

export default ChatFab;
