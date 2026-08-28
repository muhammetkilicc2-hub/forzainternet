"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Monitor, Tag, CalendarCheck, Settings } from "lucide-react";

export default function AdminTabBar() {
  const pathname = usePathname();

  const tabs = [
    { href: "/admin", label: "Ana Sayfa", icon: Home },
    { href: "/admin/masalar", label: "Masalar", icon: Monitor },
    { href: "/admin/kampanya", label: "Fiyatlar", icon: Tag },
    { href: "/admin/rezervasyonlar", label: "Talepler", icon: CalendarCheck },
    { href: "/admin/ayarlar", label: "Ayarlar", icon: Settings },
  ];

  return (
    <nav className="ios-tab-bar" aria-label="Yönetim Menüsü">
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`ios-tab-item ${isActive ? "active" : ""}`}
            title={tab.label}
          >
            <IconComponent size={20} strokeWidth={isActive ? 2.5 : 2} aria-hidden="true" />
            <span className="ios-tab-label">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}