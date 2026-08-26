import React from "react";
import Link from "next/link";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppWidget from "@/components/public/WhatsAppWidget";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="home-header">
        <div className="home-hero-glow"></div>
        <div className="home-container">
          <div className="home-badge">
            <span className="badge-dot"></span>
            <span>Şehrin En Güçlü Espor &amp; Gaming Deneyimi</span>
          </div>

          <h1 className="para1">
            OYUNDA <span className="gold-text">ZİRVEYİ</span> YAKALA
          </h1>

          <p className="home-sub">
            En yeni nesil <strong>RTX 40 Serisi</strong> ekran kartları, <strong>540 Hz</strong> turnuva sınıfı monitörler ve VIP konfor alanıyla espor heyecanını Forza’da yaşayın.
          </p>

          <div className="home-cta-group">
            <Link href="/rezerve" className="btn-primary">
              ⚡ Hemen Masa Ayırt
            </Link>
            <Link href="/hakkimizda" className="btn-secondary">
              Salonumuzu Keşfet ➔
            </Link>
          </div>

          {/* Feature Highlights Grid */}
          <div className="home-stats-strip">
            <div className="stat-strip-item">
              <span className="stat-num">540 Hz</span>
              <span className="stat-label">Espor Zirvesi</span>
            </div>
            <div className="stat-strip-item">
              <span className="stat-num">RTX 4090</span>
              <span className="stat-label">Ultra Performans</span>
            </div>
            <div className="stat-strip-item">
              <span className="stat-num">64 Masa</span>
              <span className="stat-label">Geniş Salon Kapasitesi</span>
            </div>
            <div className="stat-strip-item">
              <span className="stat-num">08:00–02:00</span>
              <span className="stat-label">Haftanın Her Günü Açık</span>
            </div>
          </div>
        </div>
      </main>

      {/* 540Hz FEATURE SECTION */}
      <section className="hz-feature-section">
        <div className="section-container">
          <div className="feature-card-spotlight">
            <div className="spotlight-content">
              <span className="spotlight-tag">540 HZ ESPOR ALANI</span>
              <h2>Gecikmesiz, Saf Hız ve Kusursuz Akıcılık</h2>
              <p>
                Valorant, CS2 ve rekabetçi FPS oyunlarında her pikseli rakiplerinizden milisaniyeler önce görün. Özel turnuva sınıfı monitörler ve profesyonel mekanik çevre birimleri hazır.
              </p>
              <Link href="/rezerve" className="btn-primary" style={{ display: "inline-flex", marginTop: "16px" }}>
                540 Hz Masanı Rezerve Et
              </Link>
            </div>
            <div className="spotlight-image-wrap">
              <img src="/foto2.jpeg" alt="540Hz Espor Alanı" className="spotlight-img" />
            </div>
          </div>
        </div>
      </section>

      {/* TICKER / CARD SLIDER */}
      <section className="card-slider">
        <div className="slider-track">
          <div className="slider-item">
            <div className="slider-badge">VIP ODA</div>
            <p className="slider-title">Özel Akustik Espor Odası</p>
            <span className="slider-desc">5 kişilik takım antrenmanları ve özel turnuva alanı</span>
          </div>
          <div className="slider-item">
            <div className="slider-badge">TURBO GIDA</div>
            <p className="slider-title">Sıcak &amp; Soğuk İçecek Barı</p>
            <span className="slider-desc">Tost, kahve, enerji içecekleri ve atıştırmalıklar masanıza servis</span>
          </div>
          <div className="slider-item">
            <div className="slider-badge">DONANIM</div>
            <p className="slider-title">Mekanik Ekipmanlar</p>
            <span className="slider-desc">Hassas optik sensörlü espor fareleri ve 7.1 kulaklıklar</span>
          </div>
        </div>
      </section>

      {/* PRICE PREVIEW SECTION */}
      <section className="pricing-preview-section">
        <div className="section-container">
          <div className="section-header-center">
            <h2 className="section-title">Oyun Paketleri &amp; Masalar</h2>
            <p className="section-subtitle">Bütçenize ve oyun tarzınıza uygun donanım kategorileri</p>
          </div>

          <div className="kampanya-kartlari">
            {/* SARI MASA */}
            <div className="kart sari-kart">
              <div className="kart-baslik">
                <h3>Standart Gaming</h3>
                <span className="badge-kategori">SARI MASA</span>
              </div>
              <p className="hz-baslik">240 Hz Fast IPS • RTX 4060</p>
              <ul className="donanim-listesi">
                <li>Intel Core i5 14400F İşlemci</li>
                <li>GeForce RTX 4060 8GB</li>
                <li>240 Hz 0.5ms Gaming Monitör</li>
                <li>Ergonomik Oyuncu Koltuğu</li>
              </ul>
              <div className="fiyat-bolumu">
                <div className="fiyat">
                  <span>Saatlik:</span>
                  <strong>60 ₺</strong>
                </div>
                <div className="fiyat">
                  <span>3 Saatlik Paket:</span>
                  <strong>160 ₺</strong>
                </div>
              </div>
              <Link href="/rezerve" className="odeme-btn" style={{ textAlign: "center", textDecoration: "none" }}>
                Masa Seç
              </Link>
            </div>

            {/* MAVİ MASA */}
            <div className="kart mavi-kart">
              <div className="kart-baslik">
                <h3>Pro Gaming</h3>
                <span className="badge-kategori">MAVİ MASA</span>
              </div>
              <p className="hz-baslik">360 Hz Espor • RTX 4070 Super</p>
              <ul className="donanim-listesi">
                <li>Intel Core i7 14700F İşlemci</li>
                <li>GeForce RTX 4070 Super 12GB</li>
                <li>360 Hz Espor Turnuva Monitörü</li>
                <li>Mekanik RGB Klavye &amp; 7.1 Kulaklık</li>
              </ul>
              <div className="fiyat-bolumu">
                <div className="fiyat">
                  <span>Saatlik:</span>
                  <strong>70 ₺</strong>
                </div>
                <div className="fiyat">
                  <span>3 Saatlik Paket:</span>
                  <strong>190 ₺</strong>
                </div>
              </div>
              <Link href="/rezerve" className="odeme-btn" style={{ textAlign: "center", textDecoration: "none" }}>
                Masa Seç
              </Link>
            </div>

            {/* YEŞİL MASA */}
            <div className="kart yesil-kart">
              <div className="kart-baslik">
                <h3>Elite 540Hz VIP</h3>
                <span className="badge-kategori">YEŞİL MASA</span>
              </div>
              <p className="hz-baslik">540 Hz Zirve • RTX 4090 / 4080</p>
              <ul className="donanim-listesi">
                <li>Intel Core i9 14900K Canavarı</li>
                <li>GeForce RTX 4080 Super / 4090</li>
                <li>540 Hz Ultra Düşük Gecikme</li>
                <li>VIP Akustik Alan &amp; Premium Deri Koltuk</li>
              </ul>
              <div className="fiyat-bolumu">
                <div className="fiyat">
                  <span>Saatlik:</span>
                  <strong>90 ₺</strong>
                </div>
                <div className="fiyat">
                  <span>3 Saatlik Paket:</span>
                  <strong>240 ₺</strong>
                </div>
              </div>
              <Link href="/rezerve" className="odeme-btn" style={{ textAlign: "center", textDecoration: "none" }}>
                Masa Seç
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppWidget />
    </>
  );
}