"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface AdminTopBarProps {
  title?: string;
  subtitle?: string;
}

interface NotificationItem {
  id: string;
  baslik: string;
  mesaj?: string;
  tarih: string;
  okundu?: boolean;
}

export default function AdminTopBar({ subtitle = "Forza Studio" }: AdminTopBarProps) {
  const router = useRouter();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadNotifications = () => {
    try {
      const raw = localStorage.getItem("forzaBildirimler");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setNotifications(parsed.slice(0, 15));
        }
      }
    } catch (e) {}
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

      <div className="ios-status-right" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div className="ios-live-indicator">
          <span className="live-dot"></span>
          <span className="live-text">Canlı</span>
        </div>

        {/* BİLDİRİM KUTUSU & DROPDOWN */}
        <div className="notification-wrapper" ref={dropdownRef} style={{ position: "relative" }}>
          <button
            type="button"
            className="notification-btn"
            id="notificationBtn"
            aria-label="Bildirimler"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            <i className="fa-solid fa-bell" aria-hidden="true"></i>
            {unreadCount > 0 && (
              <span className="notification-count" id="notificationCount">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {dropdownOpen && (
            <div className="notification-dropdown visible" id="notificationDropdown">
              <div className="notification-dropdown-header">
                <h4>Bildirimler</h4>
                <button
                  type="button"
                  className="notification-clear-btn"
                  onClick={handleMarkAllRead}
                >
                  Tümünü okundu yap
                </button>
              </div>

              <div className="notification-list" id="notificationList">
                {notifications.length === 0 ? (
                  <p className="notification-empty" id="notificationEmpty">
                    Henüz yeni bildirim yok.
                  </p>
                ) : (
                  notifications.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`notification-item ${item.okundu ? "" : "unread"}`}
                      onClick={() => handleItemClick(item)}
                    >
                      <span className="notification-item-icon">
                        <i className="fa-solid fa-calendar-check" aria-hidden="true"></i>
                      </span>
                      <span className="notification-item-body">
                        <strong>{item.baslik}</strong>
                        {item.mesaj && <span className="notification-item-mesaj">{item.mesaj}</span>}
                        <span className="notification-item-zaman">{formatRelativeTime(item.tarih)}</span>
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
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