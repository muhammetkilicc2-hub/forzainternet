import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-logo">
          <h2>Forza İnternet &amp; Cafe</h2>
          <p>
            Antalya'nın merkezinde premium oyun deneyimi, yüksek konfigürasyonlu espor donanımları ve keyifli bir sosyal ortam.
          </p>
        </div>

        <div className="footer-links">
          <h3>Hızlı Menü</h3>
          <Link href="/">Anasayfa</Link>
          <Link href="/hakkimizda">Hakkımızda</Link>
          <Link href="/rezerve">Rezervasyon</Link>
          <Link href="/rezerve">Fiyat Tarifeleri</Link>
          <Link href="/giris">Yönetici Girişi</Link>
        </div>

        <div className="footer-contact">
          <h3>İletişim &amp; Konum</h3>
          <p>
            <i className="fa-solid fa-location-dot" aria-hidden="true"></i> Kültür Mh. 3809 Sk. Muratpaşa, Antalya
          </p>
          <p>
            <i className="fa-solid fa-phone" aria-hidden="true"></i> 0 (546) 465 96 93
          </p>
          <p>
            <i className="fa-solid fa-clock" aria-hidden="true"></i> 7/24 Kesintisiz Açık
          </p>
        </div>
      </div>

      <div className="footer-bottom">
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