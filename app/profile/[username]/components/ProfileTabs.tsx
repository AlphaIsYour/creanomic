"use client";

import { motion } from "framer-motion";

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface ProfileTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: React.ReactNode;
}

export default function ProfileTabs({
  tabs,
  activeTab,
  onTabChange,
  children,
}: ProfileTabsProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="bg-white rounded-2xl border border-[#2C2C2C] shadow-lg overflow-hidden"
      >
        {/* Tab Headers */}
        <div className="border-b-2 border-[#2C2C2C] bg-[#F4E1D2]/30">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative px-6 py-4 font-bold text-sm transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-[#8C1007] bg-white"
                    : "text-gray-600 hover:text-[#2C2C2C] hover:bg-white/50"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className={`ml-2 px-2.5 py-1 text-xs font-bold rounded-full border-2 transition-all ${
                      activeTab === tab.id
                        ? "bg-[#8C1007] text-white border-[#8C1007]"
                        : "bg-gray-100 text-gray-600 border-gray-300"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-[#8C1007]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 md:p-8">{children}</div>
      </motion.div>
    </div>
  );
}
