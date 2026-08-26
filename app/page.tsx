import React from "react";
import Link from "next/link";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppWidget from "@/components/public/WhatsAppWidget";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        {/* HERO SECTION */}
        <header className="home-header">
          <div className="hero-pill-badge">
            <span className="badge-dot"></span>
            Antalya'nın 1 Numaralı Espor Gaming Merkezi
          </div>

          <h1 className="para1">FORZA GAMING &amp; INTERNET CAFE</h1>
          <p className="para1">540 Hz Espor Monitörler, RTX Gücü ve Kesintisiz Fiber İnternet Deneyimi.</p>
          <p className="hero-subtext">Arkadaşlarınla toplan, özel fiyat avantajlarıyla yerini hemen ayırt.</p>

          <div className="hero-actions czr">
            <Link href="/rezerve" className="rzr-main">
              <i className="fa-solid fa-calendar-check" aria-hidden="true"></i>
              Hemen Yerini Ayırt
            </Link>
            <Link href="/hakkimizda" className="btn-secondary">
              <i className="fa-solid fa-circle-info" aria-hidden="true"></i>
              Bizi Keşfet
            </Link>
          </div>
        </header>

        {/* FEATURE CARDS TICKER / SLIDER */}
        <section className="card-slider" aria-label="Öne Çıkan Hizmetlerimiz">
          <div className="card-track">
            {/* Group 1 */}
            <div className="card">
              <i className="fa-solid fa-gamepad" aria-hidden="true"></i>
              <h3>Espor Oyunları</h3>
              <p>En yeni rekabetçi oyunlar en yüksek FPS ve sıfır gecikmeyle hazır.</p>
            </div>

            <div className="card">
              <i className="fa-solid fa-clock" aria-hidden="true"></i>
              <h3>Geniş Hizmet Saatleri</h3>
              <p>Haftanın 7 günü 08:00 - 02:00 arası kesintisiz açık.</p>
            </div>

            <div className="card">
              <i className="fa-solid fa-wifi" aria-hidden="true"></i>
              <h3>1000 Mbps Fiber</h3>
              <p>Ultra düşük ping süresi ve yüksek hızlı fiber altyapı.</p>
            </div>

            <div className="card">
              <i className="fa-solid fa-desktop" aria-hidden="true"></i>
              <h3>540 Hz Ekranlar</h3>
              <p>Espor standartlarında 144Hz, 240Hz ve 540Hz monitör seçenekleri.</p>
            </div>

            <div className="card">
              <i className="fa-solid fa-couch" aria-hidden="true"></i>
              <h3>Oyuncu Koltukları</h3>
              <p>Uzun oyun seanslarında maksimum ergonomi ve konfor.</p>
            </div>

            <div className="card">
              <i className="fa-solid fa-headphones" aria-hidden="true"></i>
              <h3>Pro Ekipmanlar</h3>
              <p>Mekanik klavyeler, hassas gaming kulaklık ve fareler.</p>
            </div>

            <div className="card">
              <i className="fa-solid fa-burger" aria-hidden="true"></i>
              <h3>Cafe &amp; İkramlar</h3>
              <p>Oyun aralarında taze sıcak tost, kahve ve soğuk içecekler.</p>
            </div>

            {/* Group 2 (Seamless loop duplicate) */}
            <div className="card">
              <i className="fa-solid fa-gamepad" aria-hidden="true"></i>
              <h3>Espor Oyunları</h3>
              <p>En yeni rekabetçi oyunlar en yüksek FPS ve sıfır gecikmeyle hazır.</p>
            </div>

            <div className="card">
              <i className="fa-solid fa-clock" aria-hidden="true"></i>
              <h3>Geniş Hizmet Saatleri</h3>
              <p>Haftanın 7 günü 08:00 - 02:00 arası kesintisiz açık.</p>
            </div>

            <div className="card">
              <i className="fa-solid fa-wifi" aria-hidden="true"></i>
              <h3>1000 Mbps Fiber</h3>
              <p>Ultra düşük ping süresi ve yüksek hızlı fiber altyapı.</p>
            </div>

            <div className="card">
              <i className="fa-solid fa-desktop" aria-hidden="true"></i>
              <h3>540 Hz Ekranlar</h3>
              <p>Espor standartlarında 144Hz, 240Hz ve 540Hz monitör seçenekleri.</p>
            </div>

            <div className="card">
              <i className="fa-solid fa-couch" aria-hidden="true"></i>
              <h3>Oyuncu Koltukları</h3>
              <p>Uzun oyun seanslarında maksimum ergonomi ve konfor.</p>
            </div>

            <div className="card">
              <i className="fa-solid fa-headphones" aria-hidden="true"></i>
              <h3>Pro Ekipmanlar</h3>
              <p>Mekanik klavyeler, hassas gaming kulaklık ve fareler.</p>
            </div>

            <div className="card">
              <i className="fa-solid fa-burger" aria-hidden="true"></i>
              <h3>Cafe &amp; İkramlar</h3>
              <p>Oyun aralarında taze sıcak tost, kahve ve soğuk içecekler.</p>
            </div>
          </div>
        </section>
      </main>

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