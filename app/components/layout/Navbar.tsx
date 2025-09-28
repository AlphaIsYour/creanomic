/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Menu, X, LogIn, UserPlus, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "FAQs", href: "#faqs" },
    { name: "Contact", href: "#contact" },
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#8C1007]/10 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#8C1007] to-[#8C1007]/80 rounded-lg flex items-center justify-center shadow-md">
              <div className="w-6 h-6 bg-[#F4E1D2] rounded-sm"></div>
            </div>
            <span className="text-2xl font-bold text-[#2C2C2C]">Daurin</span>
          </Link>

          {/* Navigation Links - Only show if not authenticated */}
          {!session && (
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-[#2C2C2C] hover:text-[#8C1007] transition-colors duration-200 font-medium text-sm tracking-wide relative group"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#8C1007] transition-all duration-200 group-hover:w-full"></span>
                </Link>
              ))}
            </div>
          )}

          {/* Auth Buttons or User Menu */}
          <div className="hidden md:flex items-center space-x-3">
            {session ? (
              // Authenticated user menu
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 px-4 py-2 bg-[#F4E1D2]/30 rounded-lg">
                  <div className="w-8 h-8 bg-[#8C1007] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {session.user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#2C2C2C]">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-gray-600 capitalize">
                      {session.user.role?.toLowerCase()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-[#2C2C2C] hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar</span>
                </button>
              </div>
            ) : (
              // Guest user buttons
              <>
                <Link
                  href="/auth/login"
                  className="flex items-center space-x-2 px-4 py-2 text-[#2C2C2C] hover:text-[#8C1007] hover:bg-[#F4E1D2]/30 rounded-lg transition-all duration-200 font-medium text-sm"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Masuk</span>
                </Link>
                <Link
                  href="/auth/register"
                  className="flex items-center space-x-2 px-5 py-2 bg-[#8C1007] text-white rounded-lg hover:bg-[#8C1007]/90 hover:shadow-lg transition-all duration-200 font-medium text-sm"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Daftar</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-[#F4E1D2]/30 transition-colors"
          >
            {isOpen ? (
              <X className="w-5 h-5 text-[#2C2C2C]" />
            ) : (
              <Menu className="w-5 h-5 text-[#2C2C2C]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-[#8C1007]/10"
          >
            <div className="px-4 py-4 space-y-3">
              {/* Navigation items - only show if not authenticated */}
              {!session &&
                navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block py-3 text-[#2C2C2C] hover:text-[#8C1007] transition-colors font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

              <div className="pt-4 space-y-3 border-t border-[#8C1007]/10">
                {session ? (
                  // Authenticated mobile menu
                  <>
                    <div className="flex items-center space-x-3 py-3">
                      <div className="w-10 h-10 bg-[#8C1007] rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {session.user.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-[#2C2C2C]">
                          {session.user.name}
                        </p>
                        <p className="text-sm text-gray-600 capitalize">
                          {session.user.role?.toLowerCase()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="flex items-center justify-center space-x-2 w-full py-3 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-all font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Keluar</span>
                    </button>
                  </>
                ) : (
                  // Guest mobile menu
                  <>
                    <Link
                      href="/auth/login"
                      className="flex items-center justify-center space-x-2 w-full py-3 text-[#2C2C2C] border border-[#8C1007]/20 rounded-lg hover:bg-[#F4E1D2]/30 transition-all font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Masuk</span>
                    </Link>
                    <Link
                      href="/auth/register"
                      className="flex items-center justify-center space-x-2 w-full py-3 bg-[#8C1007] text-white rounded-lg hover:bg-[#8C1007]/90 transition-all font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Daftar</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
