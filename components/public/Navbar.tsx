"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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

  return (
    <>
      <nav className="public-navbar">
        <Link
          href="/"
          className="logo-brand"
          aria-label="Forza İnternet Cafe Anasayfa"
          onClick={handleLogoClick}
        >
          <img
            src="/forzaikon.jpeg"
            alt="Forza İnternet &amp; Cafe Logo"
            className="forza-image"
            style={{
              transform: logoTransform,
              transition: "transform 0.15s ease",
            }}
          />
          <h1 className="para2">
            <span className="logo-forza">FORZA</span>
            <span className="logo-sub">E-SPORTS &amp; GAMING CAFE</span>
          </h1>
        </Link>

        <form
          className="nav-search"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            router.push(`/#fiyatlar`);
          }}
        >
          <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
          <input
            id="searchInput"
            className="searchInput"
            type="text"
            placeholder="Hizmet veya oyun ara..."
            autoComplete="off"
            aria-label="Arama"
          />
        </form>

        <ul id="navMenu" className={mobileOpen ? "active" : ""}>
          <li>
            <Link
              href="/"
              className={pathname === "/" ? "active" : ""}
              onClick={() => setMobileOpen(false)}
            >
              Anasayfa
            </Link>
          </li>
          <li>
            <Link
              href="/hakkimizda"
              className={pathname === "/hakkimizda" ? "active" : ""}
              onClick={() => setMobileOpen(false)}
            >
              Hakkımızda
            </Link>
          </li>
          <li>
            <Link
              href="/ozellikler"
              className={pathname === "/ozellikler" ? "active" : ""}
              onClick={() => setMobileOpen(false)}
            >
              Özellikler
            </Link>
          </li>
          <li>
            <Link
              href="#iletisim"
              onClick={() => setMobileOpen(false)}
            >
              İletişim
            </Link>
          </li>
        </ul>

        <button
          className={`hamburger ${mobileOpen ? "active" : ""}`}
          id="hamburgerBtn"
          aria-label="Menüyü Aç/Kapat"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(!mobileOpen)}
          type="button"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      <div
        className={`nav-overlay ${mobileOpen ? "active" : ""}`}
        id="navOverlay"
        onClick={() => setMobileOpen(false)}
      />
    </>
  );
}