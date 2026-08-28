"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Monitor,
  Tag,
  CalendarCheck,
  Settings,
  ExternalLink,
  LogOut,
  X,
  Shield,
  Activity,
} from "lucide-react";

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [unreadRezCount, setUnreadRezCount] = useState<number>(0);
  const [stats, setStats] = useState<{ total: number; active: number; empty: number }>({
    total: 48,
    active: 0,
    empty: 48,
  });

  const menuItems = [
    { href: "/admin", label: "Ana Sayfa", icon: Home, desc: "Özet & Metrikler" },
    { href: "/admin/masalar", label: "Masalar", icon: Monitor, desc: "PC Durumları & Kontrol" },
    { href: "/admin/kampanya", label: "Fiyat & Kampanya", icon: Tag, desc: "Tarifeler & Paketler" },
    {
      href: "/admin/rezervasyonlar",
      label: "Rezervasyonlar",
      icon: CalendarCheck,
      desc: "Gelen Randevu Talepleri",
      badge: unreadRezCount > 0 ? unreadRezCount : undefined,
    },
    { href: "/admin/ayarlar", label: "Sistem Ayarları", icon: Settings, desc: "Şifre, İletişim & Galeri" },
  ];

  useEffect(() => {
    // Load avatar from localStorage
    try {
      const raw = localStorage.getItem("forzaAyarlar");
      if (raw) {
        const data = JSON.parse(raw);
        if (data.adminAvatar) setAvatar(data.adminAvatar);
      }
    } catch (e) {}

    // Load unread reservations count and pc stats
    const fetchQuickStats = async () => {
      try {
        const resRez = await fetch("/api/reservations", { cache: "no-store" });
        const dataRez = await resRez.json();
        if (dataRez.success && Array.isArray(dataRez.reservations)) {
          const unread = dataRez.reservations.filter((r: any) => !r.okundu).length;
          setUnreadRezCount(unread);
        }
      } catch (e) {}

      try {
        const resPc = await fetch("/api/computers", { cache: "no-store" });
        const dataPc = await resPc.json();
        if (dataPc.success && Array.isArray(dataPc.computers)) {
          const total = dataPc.computers.length;
          const active = dataPc.computers.filter((p: any) => p.durum === "kullanimda").length;
          const empty = dataPc.computers.filter((p: any) => p.durum === "bos").length;
          setStats({ total, active, empty });
        }
      } catch (e) {}
    };

    fetchQuickStats();
    const interval = setInterval(fetchQuickStats, 5000);

    return () => clearInterval(interval);
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
        {/* Brand Header */}
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-brand">
            <div className="admin-sidebar-logo-badge">
              {avatar ? <img src={avatar} alt="Admin" /> : <Shield size={20} />}
            </div>
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

                  {item.badge && item.badge > 0 && (
                    <span className="admin-sidebar-badge">{item.badge}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Live System Mini Stats Widget */}
        <div className="admin-sidebar-stats-card">
          <div className="admin-sidebar-stats-header">
            <div className="admin-sidebar-stats-title">
              <Activity size={14} className="stats-icon-spin" /> Canlı Doluluk
            </div>
            <span className="admin-sidebar-stats-ratio">
              {stats.active}/{stats.total}
            </span>
          </div>

          <div className="admin-sidebar-progress-bg">
            <div
              className="admin-sidebar-progress-fill"
              style={{
                width: `${stats.total > 0 ? (stats.active / stats.total) * 100 : 0}%`,
              }}
            />
          </div>

          <div className="admin-sidebar-stats-details">
            <span className="status-item-empty">🟢 {stats.empty} Boş</span>
            <span className="status-item-active">🔴 {stats.active} Dolu</span>
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
