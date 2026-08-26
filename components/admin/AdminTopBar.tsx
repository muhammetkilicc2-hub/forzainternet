"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface AdminTopBarProps {
  title?: string;
  subtitle?: string;
}

export default function AdminTopBar({ title = "Kontrol Paneli", subtitle = "Forza Studio" }: AdminTopBarProps) {
  const router = useRouter();
  const [avatar, setAvatar] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("forzaAyarlar");
      if (raw) {
        const data = JSON.parse(raw);
        if (data.adminAvatar) setAvatar(data.adminAvatar);
      }
    } catch (e) {}
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/giris");
    } catch {
      router.push("/giris");
    }
  };

  return (
    <header className="ios-status-bar">
      <div className="ios-status-left">
        <div className="forza-logo-badge">
          {avatar ? <img src={avatar} alt="Admin Avatar" /> : "F"}
        </div>
        <div className="forza-logo-title">
          <span style={{ fontSize: "14px", fontWeight: 800, color: "var(--cream-50)" }}>
            FORZA <span style={{ color: "var(--cream-gold)", fontWeight: 700 }}>STUDIO</span>
          </span>
          <span style={{ fontSize: "11px", color: "var(--cream-300)" }}>{subtitle}</span>
        </div>
      </div>

      <div className="ios-status-right">
        <div className="ios-live-indicator">
          <span className="live-dot"></span>
          <span className="live-text">Canlı Sistem</span>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="ios-logout-btn"
          title="Yönetici Oturumunu Kapat"
          aria-label="Güvenli Çıkış"
        >
          Çıkış ⎋
        </button>
      </div>
    </header>
  );
}