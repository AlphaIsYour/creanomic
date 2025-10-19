/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import Image from "next/image";
import {
  Bot,
  MessageCircle,
  User,
  LogOut,
  CheckCircle,
  Send,
  Search,
  HelpCircle,
  Home,
  MessageSquare,
} from "lucide-react";

interface ChatModeSelectorProps {
  onSelectMode: (mode: "chatbot" | "cs") => void;
  onLogout: () => void;
  userName: string;
}

const ChatModeSelector: React.FC<ChatModeSelectorProps> = ({
  onSelectMode,
  onLogout,
  userName,
}) => {
  return (
    <div
      className="min-h-screen  overflow-y-auto scrollbar-hide"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {/* Top Half - Dark */}
      <div className="bg-[#8C1007]  text-white p-6 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div className="mt-1">
            <Image
              src="/images/daurin.ai.png"
              alt="Daurin Logo"
              width={112}
              height={40}
              className="w-28  h-8"
            />
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        {/* Welcome Section */}
        <div className="mb-6">
          <h3 className="text-2xl font-semibold mb-2">Butuh bantuan?</h3>
          <h4 className="text-xl font-semibold text-gray-300">
            Bagaimana kami bisa membantumu?
          </h4>
        </div>
      </div>

      {/* Bottom Half - White */}
      <div className="bg-gray-200 text-gray-900 px-6 mt-0 sm:-mt-2 pt-4 min-h-[50vh] pb-10">
        {/* Status Card - Overlapping */}
        <div className="bg-white border border-gray-200 rounded-xl p-2 mb-2 sm:mb-2 shadow-sm -mt-16">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="text-green-500" size={24} />
            <div>
              <p className="text-lg text-gray-700">Halo, {userName}!</p>
              <p className="text-sm text-gray-600 mt-1">
                Pilih layanan yang Anda butuhkan:
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 bg-white border pb-35 sm:pb-40 border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
          {/* Send Message Button */}
          <button
            onClick={() => onSelectMode("cs")}
            className="w-full flex items-center justify-between p-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors group"
          >
            <div className="flex items-center gap-3">
              <MessageCircle size={20} />
              <span>Send us a message</span>
            </div>
            <Send size={16} className="text-blue-500" />
          </button>

          {/* AI Chatbot Button */}
          <button
            onClick={() => onSelectMode("chatbot")}
            className="w-full flex items-center justify-between p-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Bot size={20} />
              <span>Chatbot AI</span>
            </div>
            <Search size={16} className="text-blue-500" />
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100">
        <div className="flex items-center justify-around py-4">
          <button className="flex flex-col items-center gap-1 text-[#8C1007]">
            <Home size={24} />
            <span className="text-xs">Home</span>
          </button>
          <button
            className="flex flex-col items-center gap-1 text-gray-400"
            onClick={() => onSelectMode("cs")}
          >
            <MessageSquare size={24} />
            <span className="text-xs">Messages</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400">
            <HelpCircle size={24} />
            <span className="text-xs">Help</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatModeSelector;
