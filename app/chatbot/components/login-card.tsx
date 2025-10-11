/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import "../chatbot.css";

interface LoginCardProps {
  onLogin: (userData: { name: string; email: string }) => void;
  onClose: () => void;
}

const LoginCard: React.FC<LoginCardProps> = ({ onLogin, onClose }) => {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto login if session exists
  useEffect(() => {
    if (session?.user) {
      onLogin({
        name: session.user.name || "",
        email: session.user.email || "",
      });
    }
  }, [session, onLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password.trim()) return;

    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email atau password salah");
      } else if (result?.ok) {
        // Session akan diupdate otomatis dan trigger useEffect
      }
    } catch (err) {
      setError("Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    setFormData({ email: "", password: "" });
  };

  if (status === "loading") {
    return (
      <div className="login-card-overlay">
        <div className="login-card">
          <p>Checking session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-card-overlay">
      <div className="login-card">
        <button onClick={onClose} className="login-card-close">
          ×
        </button>
        <h3>Silahkan Login Terlebih Dahulu</h3>
        <p>Untuk mengakses chatbot</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        {session && (
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default LoginCard;
