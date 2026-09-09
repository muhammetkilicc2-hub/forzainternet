"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Tag,
  Settings,
  ExternalLink,
  LogOut,
  X,
} from "lucide-react";

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [avatar, setAvatar] = useState<string | null>(null);

  const menuItems = [
    { href: "/admin", label: "Ana Sayfa", icon: Home, desc: "Özet & Metrikler" },
    { href: "/admin/kampanya", label: "Fiyat & Kampanya", icon: Tag, desc: "Tarifeler & Paketler" },
    { href: "/admin/ayarlar", label: "Sistem Ayarları", icon: Settings, desc: "Şifre, İletişim & Galeri" },
  ];

  const loadAvatarSettings = async () => {
    try {
      const raw = localStorage.getItem("forzaAyarlar");
      if (raw) {
        const data = JSON.parse(raw);
        if (data.adminAvatar) setAvatar(data.adminAvatar);
      }
    } catch (e) {}

    try {
      const res = await fetch("/api/auth/settings", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.settings && data.settings.adminAvatar) {
          setAvatar(data.settings.adminAvatar);
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    loadAvatarSettings();

    // Event listener for real-time avatar updates
    const handleSettingsUpdate = (e: CustomEvent<any>) => {
      if (e.detail && e.detail.adminAvatar !== undefined) {
        setAvatar(e.detail.adminAvatar);
      } else {
        loadAvatarSettings();
      }
    };

    window.addEventListener("forzaAyarlarGuncellendi" as any, handleSettingsUpdate);
    window.addEventListener("storage", loadAvatarSettings);

    return () => {
      window.removeEventListener("forzaAyarlarGuncellendi" as any, handleSettingsUpdate);
      window.removeEventListener("storage", loadAvatarSettings);
    };
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
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`admin-sidebar ${isOpen ? "open" : ""}`}>
        {/* Brand Header with Avatar / "F" Badge */}
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-brand">
            <Link
              href="/admin/ayarlar"
              className="admin-sidebar-logo-badge"
              title={avatar ? "Profil Fotoğrafını Değiştir" : "Admin Profili"}
            >
              {avatar ? (
                <img
                  src={avatar}
                  alt="Admin Profil Fotoğrafı"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span className="brand-badge-f">F</span>
              )}
            </Link>
            <div className="admin-sidebar-title-group">
              <div className="admin-sidebar-brand-name">
                FORZA <span className="brand-gold">GAMING</span>
              </div>
              <div className="admin-sidebar-brand-subtitle">
                <span className="live-dot-mini"></span> Yönetim Paneli
              </div>
            </div>
          </div>

          {onClose && (
            <button
              type="button"
              className="admin-sidebar-close-btn"
              onClick={onClose}
              aria-label="Menüyü Kapat"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <div className="admin-sidebar-nav-container">
          <div className="admin-sidebar-section-title">YÖNETİM MENÜSÜ</div>
          <div className="admin-sidebar-nav" role="navigation" aria-label="Sol Kenar Çubuğu Menüsü">
            {menuItems.map((item) => {
              const IconComp = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`admin-sidebar-link ${isActive ? "active" : ""}`}
                  onClick={() => {
                    if (onClose) onClose();
                  }}
                >
                  <div className="admin-sidebar-link-left">
                    <span className="admin-sidebar-link-icon">
                      <IconComp size={19} strokeWidth={isActive ? 2.5 : 2} />
                    </span>
                    <div className="admin-sidebar-link-text">
                      <span className="admin-sidebar-link-label">{item.label}</span>
                      <span className="admin-sidebar-link-desc">{item.desc}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="admin-sidebar-footer">
          <Link
            href="/"
            target="_blank"
            className="admin-sidebar-footer-btn web-btn"
            title="Ana Web Sitesini Yeni Sekmede Aç"
          >
            <ExternalLink size={16} />
            <span>Siteyi Görüntüle</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="admin-sidebar-footer-btn logout-btn"
            title="Yönetici Oturumunu Kapat"
          >
            <LogOut size={16} />
            <span>Güvenli Çıkış</span>
          </button>
        </div>
      </aside>
    </>
  );
}
