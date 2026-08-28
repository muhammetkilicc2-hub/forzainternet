"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  Bell,
  LogOut,
  CalendarCheck,
  CheckCheck,
  Globe,
  ShieldCheck,
} from "lucide-react";

interface AdminTopBarProps {
  title?: string;
  subtitle?: string;
  onToggleSidebar?: () => void;
}

interface NotificationItem {
  id: string;
  baslik: string;
  mesaj?: string;
  tarih: string;
  okundu?: boolean;
}

export default function AdminTopBar({
  subtitle = "Forza Studio",
  onToggleSidebar,
}: AdminTopBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getPageTitle = () => {
    if (pathname === "/admin") return { title: "Genel Bakış", tag: "Panel" };
    if (pathname === "/admin/masalar") return { title: "Masa & PC Yönetimi", tag: "Masalar" };
    if (pathname === "/admin/kampanya") return { title: "Fiyat & Kampanyalar", tag: "Tarifeler" };
    if (pathname === "/admin/rezervasyonlar") return { title: "Rezervasyon Talepleri", tag: "Talepler" };
    if (pathname === "/admin/ayarlar") return { title: "Sistem & Güvenlik Ayarları", tag: "Ayarlar" };
    return { title: "Yönetim Paneli", tag: "Admin" };
  };

  const currentInfo = getPageTitle();

  const loadNotifications = async () => {
    let localList: NotificationItem[] = [];
    try {
      const raw = localStorage.getItem("forzaBildirimler");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          localList = parsed;
        }
      }
    } catch (e) {}

    try {
      const res = await fetch("/api/reservations", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.reservations)) {
        const serverNotifs: NotificationItem[] = data.reservations.map((r: any) => ({
          id: r.id,
          baslik: `Yeni Rezervasyon — ${r.masaIsim || r.masaId}`,
          mesaj: `${r.musteriAdi} (${r.telefon}) · 🕒 Randevu: ${r.tarih} ${r.saat} · ₺${r.toplamTutar}`,
          tarih: r.olusturuldu || new Date().toISOString(),
          okundu: Boolean(r.okundu),
        }));

        const map = new Map<string, NotificationItem>();
        localList.forEach((n) => map.set(n.id, n));
        serverNotifs.forEach((n) => map.set(n.id, n));

        const merged = Array.from(map.values()).sort(
          (a, b) => new Date(b.tarih).getTime() - new Date(a.tarih).getTime()
        );
        setNotifications(merged.slice(0, 15));
        return;
      }
    } catch (e) {}

    setNotifications(localList.slice(0, 15));
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem("forzaAyarlar");
      if (raw) {
        const data = JSON.parse(raw);
        if (data.adminAvatar) setAvatar(data.adminAvatar);
      }
    } catch (e) {}

    loadNotifications();

    const handleNotifUpdate = (e: CustomEvent<NotificationItem[]>) => {
      if (e.detail && Array.isArray(e.detail)) {
        setNotifications(e.detail.slice(0, 15));
      } else {
        loadNotifications();
      }
    };

    window.addEventListener("forzaBildirimGuncellendi" as any, handleNotifUpdate);
    window.addEventListener("storage", loadNotifications);

    const interval = setInterval(loadNotifications, 4000);

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDropdownOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("forzaBildirimGuncellendi" as any, handleNotifUpdate);
      window.removeEventListener("storage", loadNotifications);
      clearInterval(interval);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
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

  const handleMarkAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, okundu: true }));
    setNotifications(updated);
    try {
      localStorage.setItem("forzaBildirimler", JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("forzaBildirimGuncellendi", { detail: updated }));
    } catch (e) {}
  };

  const handleItemClick = (item: NotificationItem) => {
    const updated = notifications.map((n) => (n.id === item.id ? { ...n, okundu: true } : n));
    setNotifications(updated);
    try {
      localStorage.setItem("forzaBildirimler", JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("forzaBildirimGuncellendi", { detail: updated }));
    } catch (e) {}
    setDropdownOpen(false);
    router.push(`/admin/rezervasyonlar?highlight=${encodeURIComponent(item.id)}`);
  };

  const unreadCount = notifications.filter((n) => !n.okundu).length;

  const formatRelativeTime = (isoString?: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "";
    const sec = Math.round((Date.now() - date.getTime()) / 1000);
    if (sec < 60) return "az önce";
    if (sec < 3600) return `${Math.floor(sec / 60)} dk önce`;
    if (sec < 86400) return `${Math.floor(sec / 3600)} sa önce`;
    return `${Math.floor(sec / 86400)} gün önce`;
  };

  return (
    <header className="admin-top-navbar">
      <div className="admin-top-left">
        {/* Mobile Hamburger Toggle Button */}
        {onToggleSidebar && (
          <button
            type="button"
            className="admin-hamburger-btn"
            onClick={onToggleSidebar}
            aria-label="Menüyü Aç/Kapat"
            title="Kenar Menüsü"
          >
            <Menu size={22} />
          </button>
        )}

        <div className="admin-page-breadcrumb">
          <div className="admin-page-tag">{currentInfo.tag}</div>
          <h1 className="admin-page-title">{currentInfo.title}</h1>
        </div>
      </div>

      <div className="admin-top-right">
        {/* Live Indicator */}
        <div className="admin-live-badge" title="Sistem Aktif ve Bağlı">
          <span className="live-dot-pulse"></span>
          <span className="live-text-desktop">Sistem Canlı</span>
        </div>

        {/* View Main Website Button */}
        <Link
          href="/"
          target="_blank"
          className="admin-quick-web-btn"
          title="Ana Sayfayı Gör"
        >
          <Globe size={16} />
          <span>Siteyi Gör</span>
        </Link>

        {/* BİLDİRİM KUTUSU & DROPDOWN */}
        <div className="notification-wrapper" ref={dropdownRef}>
          <button
            type="button"
            className={`admin-icon-btn ${unreadCount > 0 ? "has-unread" : ""}`}
            id="notificationBtn"
            aria-label="Bildirimler"
            onClick={() => setDropdownOpen((prev) => !prev)}
            title="Bildirimler"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="notification-badge-count">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {dropdownOpen && (
            <div className="notification-dropdown visible" id="notificationDropdown">
              <div className="notification-dropdown-header">
                <div className="dropdown-title-row">
                  <h4>Bildirimler</h4>
                  {unreadCount > 0 && <span className="unread-pill">{unreadCount} Yeni</span>}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    className="notification-clear-btn"
                    onClick={handleMarkAllRead}
                  >
                    <CheckCheck size={13} />
                    Tümünü oku
                  </button>
                )}
              </div>

              <div className="notification-list" id="notificationList">
                {notifications.length === 0 ? (
                  <div className="notification-empty">
                    <ShieldCheck size={28} style={{ opacity: 0.3, marginBottom: "8px" }} />
                    <p>Henüz yeni bildirim bulunmuyor.</p>
                  </div>
                ) : (
                  notifications.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`notification-item ${item.okundu ? "" : "unread"}`}
                      onClick={() => handleItemClick(item)}
                    >
                      <span className="notification-item-icon">
                        <CalendarCheck size={16} />
                      </span>
                      <span className="notification-item-body">
                        <strong>{item.baslik}</strong>
                        {item.mesaj && (
                          <span className="notification-item-mesaj">{item.mesaj}</span>
                        )}
                        <span className="notification-item-zaman">
                          {formatRelativeTime(item.tarih)}
                        </span>
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Mini Profile Avatar & Logout */}
        <div className="admin-user-profile-menu">
          <div className="admin-mini-avatar" title="Yönetici">
            {avatar ? <img src={avatar} alt="Admin" /> : "F"}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="admin-logout-action-btn"
            title="Güvenli Çıkış Yap"
            aria-label="Çıkış"
          >
            <LogOut size={16} />
            <span className="logout-text-desktop">Çıkış</span>
          </button>
        </div>
      </div>
    </header>
  );
}