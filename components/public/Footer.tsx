import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "rgba(10, 14, 23, 0.95)", borderTop: "1px solid rgba(255, 255, 255, 0.08)", padding: "60px 24px 30px", marginTop: "auto", textAlign: "center" }}>
      <div className="footer-container" style={{ maxWidth: "820px", margin: "0 auto 40px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: "32px" }}>
        <div className="footer-logo" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", maxWidth: "500px" }}>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "24px", fontWeight: 800, color: "#ffd700", marginBottom: "10px" }}>Forza İnternet &amp; Cafe</h2>
          <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: 1.6, textAlign: "center" }}>
            Antalya'nın merkezinde premium oyun deneyimi, yüksek konfigürasyonlu espor donanımları ve keyifli bir sosyal ortam.
          </p>
        </div>

        <div className="footer-links" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: "10px" }}>
          <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "16px", fontWeight: 700, color: "#ffffff", marginBottom: "8px" }}>Hızlı Menü</h3>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "16px" }}>
            <Link href="/" style={{ color: "#cbd5e1", fontSize: "14px", textDecoration: "none" }}>Anasayfa</Link>
            <Link href="/hakkimizda" style={{ color: "#cbd5e1", fontSize: "14px", textDecoration: "none" }}>Hakkımızda</Link>
            <Link href="/rezerve" style={{ color: "#cbd5e1", fontSize: "14px", textDecoration: "none" }}>Rezervasyon</Link>
            <Link href="/rezerve" style={{ color: "#cbd5e1", fontSize: "14px", textDecoration: "none" }}>Fiyat Tarifeleri</Link>
            <Link href="/giris" style={{ color: "#cbd5e1", fontSize: "14px", textDecoration: "none" }}>Yönetici Girişi</Link>
          </div>
        </div>

        <div className="footer-contact" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: "8px" }}>
          <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "16px", fontWeight: 700, color: "#ffffff", marginBottom: "8px" }}>İletişim &amp; Konum</h3>
          <p style={{ color: "#cbd5e1", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", margin: "2px 0" }}>
            <i className="fa-solid fa-location-dot" style={{ color: "#ffd700" }}></i> Kültür Mh. 3809 Sk. Muratpaşa, Antalya
          </p>
          <p style={{ color: "#cbd5e1", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", margin: "2px 0" }}>
            <i className="fa-solid fa-phone" style={{ color: "#ffd700" }}></i> 0 (546) 465 96 93
          </p>
          <p style={{ color: "#cbd5e1", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", margin: "2px 0" }}>
            <i className="fa-solid fa-clock" style={{ color: "#ffd700" }}></i> 7/24 Kesintisiz Açık
          </p>
        </div>
      </div>

      <div className="footer-bottom" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "24px", textAlign: "center", color: "#64748b", fontSize: "13px" }}>
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