import React from "react";
import Link from "next/link";
import { FORZA_PHONE, FORZA_PHONE_FORMATTED, FORZA_MAPS_LINK, FORZA_WHATSAPP_LINK, FORZA_INSTAGRAM } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="public-footer">
      <div className="footer-glow-line" />

      <div className="footer-container">
        {/* Kolon 1: Logo & Marka & Mini Açıklama */}
        <div className="footer-col footer-brand-col">
          <div className="footer-brand">
            <div className="footer-badge-icon">
              <i className="fa-solid fa-gamepad" aria-hidden="true"></i>
            </div>
            <div className="footer-brand-text">
              <h2>FORZA E-SPORTS &amp; GAMING CAFE</h2>
              <span>Şehrin 1 Numaralı Espor &amp; Gaming Merkezi</span>
            </div>
          </div>

          <p className="footer-bio">
            Antalya'nın merkezinde profesyonel espor monitörleri, RTX canavar sistemler, 1000 Mbps simetrik fiber internet ve özel turnuva alanları ile profesyonel gaming deneyimi.
          </p>

          <div className="footer-social-links">
            <a
              href={FORZA_WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-btn whatsapp"
              aria-label="WhatsApp İletişim Hattı"
            >
              <i className="fa-brands fa-whatsapp" aria-hidden="true"></i>
              <span>WhatsApp</span>
            </a>
            <a
              href={FORZA_INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-btn instagram"
              aria-label="Instagram Sayfamız"
            >
              <i className="fa-brands fa-instagram" aria-hidden="true"></i>
              <span>Instagram</span>
            </a>
            <a
              href={FORZA_MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-btn maps"
              aria-label="Google Haritalar Yol Tarifi"
            >
              <i className="fa-solid fa-location-dot" aria-hidden="true"></i>
              <span>Yol Tarifi</span>
            </a>
          </div>
        </div>

        {/* Kolon 2: Hızlı Sayfa Menüsü */}
        <div className="footer-col footer-links-col">
          <h3 className="footer-heading">Hızlı Bağlantılar</h3>
          <ul className="footer-nav-list">
            <li>
              <Link href="/">
                <i className="fa-solid fa-angle-right" aria-hidden="true"></i> Anasayfa
              </Link>
            </li>
            <li>
              <Link href="/hakkimizda">
                <i className="fa-solid fa-angle-right" aria-hidden="true"></i> Hakkımızda &amp; Galeri
              </Link>
            </li>
            <li>
              <Link href="/ozellikler">
                <i className="fa-solid fa-angle-right" aria-hidden="true"></i> Fiyat Tarifeleri &amp; Paketler
              </Link>
            </li>
            <li>
              <Link href="/giris">
                <i className="fa-solid fa-angle-right" aria-hidden="true"></i> Yönetici Girişi
              </Link>
            </li>
          </ul>
        </div>

        {/* Kolon 3: İletişim & Lokasyon */}
        <div className="footer-col footer-contact-col">
          <h3 className="footer-heading">İletişim &amp; Lokasyon</h3>
          <div className="footer-contact-list">
            <a
              href={FORZA_MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-contact-item"
              title="Haritada Görüntüle"
            >
              <div className="contact-icon">
                <i className="fa-solid fa-location-dot" aria-hidden="true"></i>
              </div>
              <div className="contact-info">
                <strong>Adres</strong>
                <span>Kültür Mh. 3809 Sk. No:14 Kepez / Antalya</span>
              </div>
            </a>

            <a href={`tel:${FORZA_PHONE}`} className="footer-contact-item" title="Hemen Ara">
              <div className="contact-icon">
                <i className="fa-solid fa-phone" aria-hidden="true"></i>
              </div>
              <div className="contact-info">
                <strong>Telefon</strong>
                <span>{FORZA_PHONE_FORMATTED}</span>
              </div>
            </a>

            <div className="footer-contact-item static">
              <div className="contact-icon">
                <i className="fa-solid fa-clock" aria-hidden="true"></i>
              </div>
              <div className="contact-info">
                <strong>Çalışma Saatleri</strong>
                <span className="live-status-pill">
                  <span className="live-status-dot"></span> 7 Gün 24 Saat Kesintisiz Açık
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alt Telif & Yönetici Barı */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
            &copy; 2026 FORZA E-SPORTS & GAMING CAFE. Tüm Hakları Saklıdır.
          </p>
          <div className="footer-bottom-links">
            <Link href="/hakkimizda" className="footer-bottom-link">Hakkımızda</Link>
            
            <span className="footer-bottom-dot">•</span>
            <Link href="/giris" className="footer-bottom-link admin-link">
              <i className="fa-solid fa-lock" aria-hidden="true"></i> Yönetici Girişi
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
