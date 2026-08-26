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
          <p className="para1">540 Hz Espor Espor Monitörler, RTX Gücü ve Kesintisiz Fiber İnternet Deneyimi.</p>
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
              <p>Haftanın 7 günü 09:00 - 04:00 arası kesintisiz açık.</p>
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
              <p>Haftanın 7 günü 09:00 - 04:00 arası kesintisiz açık.</p>
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

      <Footer />
      <WhatsAppWidget />
    </>
  );
}