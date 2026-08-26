"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminTabBar() {
  const pathname = usePathname();

  const tabs = [
    { href: "/admin", label: "Panel", iconClass: "fa-solid fa-gauge-high" },
    { href: "/admin/masalar", label: "Masalar", iconClass: "fa-solid fa-desktop" },
    { href: "/admin/kampanya", label: "Fiyatlar", iconClass: "fa-solid fa-tags" },
    { href: "/admin/rezervasyonlar", label: "Talepler", iconClass: "fa-solid fa-calendar-check" },
    { href: "/admin/ayarlar", label: "Ayarlar", iconClass: "fa-solid fa-gear" },
  ];

  return (
    <nav
      className="ios-tab-bar"
      aria-label="Yönetim Menüsü"
      style={{
        position: "fixed",
        bottom: "max(12px, env(safe-area-inset-bottom, 12px))",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 99999,
      }}
    >
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`ios-tab-item ${isActive ? "active" : ""}`}
          >
            <i className={tab.iconClass} aria-hidden="true"></i>
            <span className="ios-tab-label">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}