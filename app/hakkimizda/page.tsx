import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppWidget from "@/components/public/WhatsAppWidget";
import PhotoGallery from "@/components/public/PhotoGallery";

export const metadata: Metadata = {
  title: "Hakkımızda & Mekan Galerisi",
  description: "Forza İnternet & Cafe hakkında bilgiler, 540 Hz espor salonu fotoğrafları, donanım özellikleri ve iletişim adresimiz.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="about">
        <div className="about-hero">
          <div className="about-left">
            <span className="about-badge">HİKAYEMİZ &amp; VİZYONUMUZ</span>
            <h1>Şehrin Espor Kalbi Forza’da Atıyor</h1>
            <h2>Kesintisiz Güç, Sıfır Gecikme ve Üst Düzey Konfor</h2>
            <p>
              Forza İnternet &amp; Cafe; rekabetçi oyun tutkunlarına, espor takımlarına ve keyifli vakit geçirmek isteyen tüm oyunculara en üst düzey donanım altyapısını sunmak amacıyla kuruldu.
            </p>
            <p>
              64 masalık ferah salonumuzda 240Hz, 360Hz ve Türkiye&apos;nin en iddialı <strong>540 Hz</strong> monitörleriyle donatılmış özel espor istasyonları yer almaktadır. Yüksek hızlı simetrik fiber internet bağlantımızla ping değerlerinizi minimumda tutuyoruz.
            </p>

            <div className="about-metrics">
              <div className="metric-box">
                <strong>64</strong>
                <span>Gaming İstasyonu</span>
              </div>
              <div className="metric-box">
                <strong>1000 Mbps</strong>
                <span>Simetrik Fiber Hız</span>
              </div>
              <div className="metric-box">
                <strong>540 Hz</strong>
                <span>Espor Monitörleri</span>
              </div>
            </div>
          </div>

          <div className="about-right">
            <img src="/foto1.jpeg" alt="Forza Gaming Salonu" className="about-hero-img" />
          </div>
        </div>

        {/* PHOTO GALLERY SLIDER + LIGHTBOX */}
        <PhotoGallery />

        {/* FACILITY HIGHLIGHTS */}
        <div className="about-info-grid">
          <div className="about-info-card">
            <div className="info-icon">⚡</div>
            <h3>Yüksek Hızlı Fiber İnternet</h3>
            <p>Yedekli ve düşük ping garantili 1000 Mbps simetrik espor omurgasıyla takılmadan oynayın.</p>
          </div>
          <div className="info-icon-card about-info-card">
            <div className="info-icon">🎧</div>
            <h3>Profesyonel Çevre Birimleri</h3>
            <p>HyperX, SteelSeries ve Razer espor serisi kulaklıklar, mekanik klavyeler ve hassas oyuncu fareleri.</p>
          </div>
          <div className="about-info-card">
            <div className="info-icon">🍔</div>
            <h3>Zengin Kafe &amp; İçecek Barı</h3>
            <p>Oyununuza ara vermeden masanıza sipariş edebileceğiniz sıcak/soğuk kahveler, tost ve atıştırmalıklar.</p>
          </div>
        </div>

        {/* WORKING HOURS & LOCATION */}
        <div className="about-location-card">
          <div className="location-details">
            <h2>Bizi Ziyaret Edin</h2>
            <p>Merkezi konumumuz ve kolay ulaşılabilir espor merkezimizle haftanın 7 günü hizmetinizdeyiz.</p>
            <div className="location-row">
              <strong>📍 Adres:</strong>
              <span>Cengiz Topel Cad. No: 42 (Merkez)</span>
            </div>
            <div className="location-row">
              <strong>🕒 Saatler:</strong>
              <span>Her gün 08:00 – 02:00</span>
            </div>
            <div className="location-row">
              <strong>📞 Telefon:</strong>
              <a href="tel:05464659693">0546 465 96 93</a>
            </div>
          </div>
          <div className="location-cta">
            <a
              href="https://wa.me/905464659693?text=Merhaba,%20Forza%20İnternet%20Cafe%20hakkında%20bilgi%20almak%20istiyorum."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              💬 WhatsApp ile Yol Tarifi Al
            </a>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppWidget />
    </>
  );
}