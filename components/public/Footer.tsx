import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-col brand-col">
          <div className="logo-brand footer-logo">
            <img
              src="/forzaikon.jpeg"
              alt="Forza Logo"
              className="forza-image"
            />
            <span className="para2">
              <span className="logo-forza">FORZA</span>
              <span className="logo-sub">İnternet&amp;Cafe</span>
            </span>
          </div>
          <p className="footer-desc">
            En yeni nesil RTX 40 serisi ekran kartları, 540 Hz espor monitörleri
            ve VIP konfor alanlarıyla şehrin 1 numaralı espor ve internet kafesi.
          </p>
          <div className="social-links">
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-btn"
              aria-label="Instagram"
            >
              Instagram
            </a>
            <a
              href="https://wa.me/905464659693"
              target="_blank"
              rel="noopener noreferrer"
              className="social-btn"
              aria-label="WhatsApp"
            >
              WhatsApp
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h4 className="footer-title">Hızlı Menü</h4>
          <ul className="footer-links">
            <li>
              <Link href="/">Anasayfa</Link>
            </li>
            <li>
              <Link href="/hakkimizda">Hakkımızda &amp; Galeri</Link>
            </li>
            <li>
              <Link href="/rezerve">Masa Rezervasyonu</Link>
            </li>
            <li>
              <Link href="/giris" style={{ opacity: 0.6, fontSize: "12px" }}>
                🔒 Yönetici Girişi
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-title">İletişim &amp; Çalışma</h4>
          <div className="footer-info-item">
            <strong>Adres:</strong>
            <span>Cengiz Topel Cad. No: 42 (Merkez)</span>
          </div>
          <div className="footer-info-item">
            <strong>Telefon:</strong>
            <a href="tel:05464659693">0546 465 96 93</a>
          </div>
          <div className="footer-info-item">
            <strong>Çalışma Saatleri:</strong>
            <span>Haftanın her günü 08:00 – 02:00</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 FORZA İnternet &amp; Cafe. Tüm Hakları Saklıdır.</p>
        <Link href="/giris" className="admin-link-footer">
          Yönetici Portalı
        </Link>
      </div>
    </footer>
  );
}