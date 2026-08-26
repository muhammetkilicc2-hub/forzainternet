"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminTabBar() {
  const pathname = usePathname();

  const tabs = [
    { href: "/admin", label: "Panel", icon: "📊" },
    { href: "/admin/masalar", label: "Masalar", icon: "🖥️" },
    { href: "/admin/kampanya", label: "Fiyatlar", icon: "🏷️" },
    { href: "/admin/rezervasyonlar", label: "Talepler", icon: "📅" },
    { href: "/admin/ayarlar", label: "Ayarlar", icon: "⚙️" },
  ];

  return (
    <nav className="ios-tab-bar" aria-label="Yönetim Menüsü">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`ios-tab-item ${isActive ? "active" : ""}`}
          >
            <span className="ios-tab-icon" style={{ fontSize: "18px" }}>
              {tab.icon}
            </span>
            <span className="ios-tab-label">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}