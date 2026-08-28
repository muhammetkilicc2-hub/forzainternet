import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "rgba(10, 14, 23, 0.98)", borderTop: "1px solid rgba(255, 255, 255, 0.08)", padding: "36px 20px 24px", marginTop: "auto", textAlign: "center" }}>
      <div className="footer-container" style={{ maxWidth: "800px", margin: "0 auto 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: "16px" }}>
        
        {/* Brand & Mini Bio */}
        <div className="footer-logo" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "20px", fontWeight: 800, color: "#ffd700", margin: "0 0 6px" }}>
            Forza İnternet &amp; Cafe
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "13.5px", lineHeight: 1.5, margin: 0, maxWidth: "480px" }}>
            Antalya'nın merkezinde premium espor donanımları, 540 Hz monitörler ve 1000 Mbps fiber gaming deneyimi.
          </p>
        </div>

        {/* Quick Horizontal Menu */}
        <div className="footer-links" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "12px 20px" }}>
          <Link href="/" style={{ color: "#cbd5e1", fontSize: "13.5px", fontWeight: 500, textDecoration: "none" }}>Anasayfa</Link>
          <Link href="/hakkimizda" style={{ color: "#cbd5e1", fontSize: "13.5px", fontWeight: 500, textDecoration: "none" }}>Hakkımızda</Link>
          <Link href="/rezerve" style={{ color: "#cbd5e1", fontSize: "13.5px", fontWeight: 500, textDecoration: "none" }}>Rezervasyon</Link>
          <Link href="/rezerve" style={{ color: "#cbd5e1", fontSize: "13.5px", fontWeight: 500, textDecoration: "none" }}>Fiyat Tarifeleri</Link>
          <Link href="/giris" style={{ color: "#cbd5e1", fontSize: "13.5px", fontWeight: 500, textDecoration: "none" }}>Yönetici Girişi</Link>
        </div>

        {/* Inline Contact Summary */}
        <div className="footer-contact" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "8px 18px", color: "#94a3b8", fontSize: "13px" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <i className="fa-solid fa-location-dot" style={{ color: "#ffd700" }}></i> Kültür Mh. 3809 Sk. Muratpaşa
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <i className="fa-solid fa-phone" style={{ color: "#ffd700" }}></i> 0 (546) 465 96 93
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <i className="fa-solid fa-clock" style={{ color: "#ffd700" }}></i> 7/24 Kesintisiz Açık
          </span>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: "16px", textAlign: "center", color: "#64748b", fontSize: "12.5px" }}>
        <small>
          © 2026 Forza İnternet &amp; Cafe | Tüm Hakları Saklıdır. |{" "}
          <Link
            href="/giris"
            style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}
          >
            Yönetici Girişi
          </Link>
        </small>
      </div>
    </footer>
  );
}