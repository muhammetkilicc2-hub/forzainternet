"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const clickCountRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [logoTransform, setLogoTransform] = useState("");

  const handleLogoClick = (e: React.MouseEvent) => {
    clickCountRef.current += 1;
    if (timerRef.current) clearTimeout(timerRef.current);

    const count = clickCountRef.current;
    setLogoTransform(`scale(${1 + count * 0.1}) rotate(${count * 6}deg)`);

    if (count >= 3) {
      e.preventDefault();
      clickCountRef.current = 0;
      setLogoTransform("");
      const isLoggedIn = typeof window !== "undefined" && sessionStorage.getItem("forzaAdminGiris") === "true";
      router.push(isLoggedIn ? "/admin" : "/giris");
      return;
    }

    timerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
      setLogoTransform("");
    }, 400);
  };

  const navLinks = [
    { href: "/", label: "Anasayfa" },
    { href: "/hakkimizda", label: "Hakkımızda" },
    { href: "/rezerve", label: "Rezervasyon" },
    { href: "/rezerve", label: "Bilgisayarlar" },
  ];

  return (
    <>
      <nav aria-label="Ana Menü">
        <div className="nav-container">
          <Link
            href="/"
            className="logo-brand"
            aria-label="Forza İnternet Cafe Anasayfa"
            onClick={handleLogoClick}
          >
            <div
              className="forza-image-wrap"
              style={{
                display: "inline-block",
                transform: logoTransform,
                transition: "transform 0.15s ease",
              }}
            >
              <img
                src="/forzaikon.jpeg"
                alt="Forza İnternet & Cafe Logo"
                className="forza-image"
              />
            </div>
            <h1 className="para2">
              <span className="logo-forza">FORZA</span>
              <span className="logo-sub">İnternet&amp;Cafe</span>
            </h1>
          </Link>

          {/* Desktop Nav */}
          <ul className="nav-links">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={isActive ? "active" : ""}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="nav-actions">
            <Link href="/rezerve" className="btn-book">
              Masa Ayırt
            </Link>
            <button
              type="button"
              className={`hamburger ${mobileOpen ? "active" : ""}`}
              id="hamburgerBtn"
              aria-label="Menüyü Aç / Kapat"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`nav-menu ${mobileOpen ? "active" : ""}`} id="navMenu">
        <div className="nav-menu-header">
          <div className="menu-logo-title">FORZA Menü</div>
          <button
            type="button"
            className="close-menu-btn"
            id="closeMenuBtn"
            aria-label="Menüyü Kapat"
            onClick={() => setMobileOpen(false)}
          >
            ✕
          </button>
        </div>
        <ul className="mobile-nav-links">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={isActive ? "active" : ""}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mobile-menu-footer">
          <Link
            href="/rezerve"
            className="btn-book"
            style={{ width: "100%", justifyContent: "center" }}
            onClick={() => setMobileOpen(false)}
          >
            Masa Ayırt
          </Link>
          <div className="mobile-contact-preview">
            <span>📍 Cengiz Topel Cad. No: 42</span>
            <span>📞 0546 465 96 93</span>
          </div>
        </div>
      </div>

      <div
        className={`nav-overlay ${mobileOpen ? "active" : ""}`}
        id="navOverlay"
        onClick={() => setMobileOpen(false)}
      />
    </>
  );
}