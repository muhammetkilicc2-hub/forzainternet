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
            🟢 Şu An Açık | Her Gün 09:00 - 04:00
          </div>

          <h1 className="para1">FORZA GAMING &amp; INTERNET CAFE</h1>
          <p className="para1">540 Hz Espor Monitörler, RTX Canavar Sistemler ve 1000 Mbps Düşük Ping Deneyimi.</p>
          <p className="hero-subtext">Arkadaşlarınla toplan, avantajlı 5 saatlik &amp; gün boyu paketlerle yerini hemen ayırt.</p>

          <div className="hero-actions czr">
            <Link href="/rezerve" className="rzr-main">
              <i className="fa-solid fa-calendar-check" aria-hidden="true"></i>
              Masa Seç &amp; Yerini Ayırt
            </Link>
            <Link href="/hakkimizda" className="btn-secondary">
              <i className="fa-solid fa-circle-info" aria-hidden="true"></i>
              Sistemleri İncele
            </Link>
          </div>

          {/* HERO MINI SPECS BAR */}
          <div className="hero-specs-container">
            <div className="hero-spec-card">
              <div className="hero-spec-icon">
                <i className="fa-solid fa-bolt"></i>
              </div>
              <div className="hero-spec-text">
                <strong>540 Hz Espor</strong>
                <span>BenQ ZOWIE Monitörler</span>
              </div>
            </div>

            <div className="hero-spec-card">
              <div className="hero-spec-icon">
                <i className="fa-solid fa-microchip"></i>
              </div>
              <div className="hero-spec-text">
                <strong>RTX 4080S / 4090</strong>
                <span>Intel i9 &amp; Ultra FPS</span>
              </div>
            </div>

            <div className="hero-spec-card">
              <div className="hero-spec-icon">
                <i className="fa-solid fa-wifi"></i>
              </div>
              <div className="hero-spec-text">
                <strong>1000 Mbps Fiber</strong>
                <span>Sıfır Loss &amp; 3ms Ping</span>
              </div>
            </div>

            <div className="hero-spec-card">
              <div className="hero-spec-icon">
                <i className="fa-solid fa-mug-hot"></i>
              </div>
              <div className="hero-spec-text">
                <strong>Zengin Cafe Menüsü</strong>
                <span>Taze Tost &amp; İçecekler</span>
              </div>
            </div>
          </div>
        </header>

        {/* FEATURE CARDS TICKER / SLIDER */}
        <section className="card-slider" aria-label="Öne Çıkan Hizmetlerimiz">
          <div className="card-track">
            {/* Group 1 */}
            <div className="card">
              <i className="fa-solid fa-gamepad" aria-hidden="true"></i>
              <h3>Espor Oyunları</h3>
              <p>Valorant, CS2, LoL, GTA V, FC24 en yüksek FPS ve sıfır gecikmeyle hazır.</p>
            </div>

            <div className="card">
              <i className="fa-solid fa-clock" aria-hidden="true"></i>
              <h3>Gece Boyu Açık</h3>
              <p>Haftanın 7 günü 09:00 - 04:00 arası kesintisiz espor keyfi.</p>
            </div>

            <div className="card">
              <i className="fa-solid fa-wifi" aria-hidden="true"></i>
              <h3>1000 Mbps Fiber</h3>
              <p>Özel oyun sunucularına doğrudan düşük pingli fiber hat.</p>
            </div>

            <div className="card">
              <i className="fa-solid fa-desktop" aria-hidden="true"></i>
              <h3>540 Hz &amp; 360 Hz</h3>
              <p>Turnuva standartlarında BenQ Fast IPS ve DyAc+ teknolojisi.</p>
            </div>

            <div className="card">
              <i className="fa-solid fa-couch" aria-hidden="true"></i>
              <h3>Ergonomik Koltuklar</h3>
              <p>Uzun oyun seanslarında bel ve boyun destekli profesyonel koltuklar.</p>
            </div>

            <div className="card">
              <i className="fa-solid fa-headphones" aria-hidden="true"></i>
              <h3>Pro Ekipmanlar</h3>
              <p>Logitech G Pro Superlight, SteelSeries Nova kulaklıklar.</p>
            </div>

            <div className="card">
              <i className="fa-solid fa-burger" aria-hidden="true"></i>
              <h3>Cafe &amp; İkramlar</h3>
              <p>Kavurmalı kaşarlı tost, taze kahve çeşitleri ve soğuk enerji içecekleri.</p>
            </div>

            {/* Group 2 (Seamless loop duplicate) */}
            <div className="card">
              <i className="fa-solid fa-gamepad" aria-hidden="true"></i>
              <h3>Espor Oyunları</h3>
              <p>Valorant, CS2, LoL, GTA V, FC24 en yüksek FPS ve sıfır gecikmeyle hazır.</p>
            </div>

            <div className="card">
              <i className="fa-solid fa-clock" aria-hidden="true"></i>
              <h3>Gece Boyu Açık</h3>
              <p>Haftanın 7 günü 09:00 - 04:00 arası kesintisiz espor keyfi.</p>
            </div>

            <div className="card">
              <i className="fa-solid fa-wifi" aria-hidden="true"></i>
              <h3>1000 Mbps Fiber</h3>
              <p>Özel oyun sunucularına doğrudan düşük pingli fiber hat.</p>
            </div>

            <div className="card">
              <i className="fa-solid fa-desktop" aria-hidden="true"></i>
              <h3>540 Hz &amp; 360 Hz</h3>
              <p>Turnuva standartlarında BenQ Fast IPS ve DyAc+ teknolojisi.</p>
            </div>

            <div className="card">
              <i className="fa-solid fa-couch" aria-hidden="true"></i>
              <h3>Ergonomik Koltuklar</h3>
              <p>Uzun oyun seanslarında bel ve boyun destekli profesyonel koltuklar.</p>
            </div>

            <div className="card">
              <i className="fa-solid fa-headphones" aria-hidden="true"></i>
              <h3>Pro Ekipmanlar</h3>
              <p>Logitech G Pro Superlight, SteelSeries Nova kulaklıklar.</p>
            </div>

            <div className="card">
              <i className="fa-solid fa-burger" aria-hidden="true"></i>
              <h3>Cafe &amp; İkramlar</h3>
              <p>Kavurmalı kaşarlı tost, taze kahve çeşitleri ve soğuk enerji içecekleri.</p>
            </div>
          </div>
        </section>

        {/* PRICING & TARIFF PREVIEW SECTION */}
        <section className="home-section" id="tarifeler">
          <div className="home-section-header">
            <span className="home-section-tag">
              <i className="fa-solid fa-tags"></i> Fiyat Tarifeleri &amp; Avantajlı Paketler
            </span>
            <h2 className="home-section-title">Masa Kategorileri &amp; Kampanyalar</h2>
            <p className="home-section-desc">
              İhtiyacınıza uygun donanımı seçin, 5 saatlik veya gün boyu paket avantajlarıyla yerinizi hemen ayırtın.
            </p>
          </div>

          <div className="home-pricing-grid">
            {/* Standart Sarı */}
            <div className="home-pricing-card">
              <div>
                <div className="home-pricing-header">
                  <span className="home-pricing-badge sari">Sarı Masalar</span>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>8 Masa</span>
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#fff", marginBottom: "4px" }}>Standart Gaming</h3>
                <div className="home-pricing-price">
                  60 ₺ <span>/ saat</span>
                </div>

                <div className="home-pricing-packages">
                  <div className="home-pkg-item">
                    <strong>200 ₺</strong>
                    <span>5 Saat Paket</span>
                  </div>
                  <div className="home-pkg-item">
                    <strong>400 ₺</strong>
                    <span>Gün Boyu</span>
                  </div>
                </div>

                <ul className="home-pricing-features">
                  <li><i className="fa-solid fa-check"></i> RTX 4060 8GB Grafik Gücü</li>
                  <li><i className="fa-solid fa-check"></i> 240 Hz Fast IPS Monitör</li>
                  <li><i className="fa-solid fa-check"></i> Intel i5 14400F İşlemci</li>
                  <li><i className="fa-solid fa-check"></i> Ergonomik Espor Koltuğu</li>
                </ul>
              </div>

              <Link href="/rezerve" className="home-pricing-btn">
                <i className="fa-solid fa-chair"></i> Sarı Masa Seç &amp; Ayırt
              </Link>
            </div>

            {/* Pro Mavi */}
            <div className="home-pricing-card">
              <div>
                <div className="home-pricing-header">
                  <span className="home-pricing-badge mavi">Mavi Masalar</span>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>22 Masa</span>
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#fff", marginBottom: "4px" }}>Pro Gaming 360Hz</h3>
                <div className="home-pricing-price">
                  70 ₺ <span>/ saat</span>
                </div>

                <div className="home-pricing-packages">
                  <div className="home-pkg-item">
                    <strong>250 ₺</strong>
                    <span>5 Saat Paket</span>
                  </div>
                  <div className="home-pkg-item">
                    <strong>500 ₺</strong>
                    <span>Gün Boyu</span>
                  </div>
                </div>

                <ul className="home-pricing-features">
                  <li><i className="fa-solid fa-check"></i> RTX 4070 Super 12GB</li>
                  <li><i className="fa-solid fa-check"></i> 360 Hz Espor Monitör</li>
                  <li><i className="fa-solid fa-check"></i> Intel i7 14700F İşlemci</li>
                  <li><i className="fa-solid fa-check"></i> Mekanik Klavye + Nova Kulaklık</li>
                </ul>
              </div>

              <Link href="/rezerve" className="home-pricing-btn">
                <i className="fa-solid fa-chair"></i> Mavi Masa Seç &amp; Ayırt
              </Link>
            </div>

            {/* Elite VIP Yeşil */}
            <div className="home-pricing-card featured">
              <div>
                <div className="home-pricing-header">
                  <span className="home-pricing-badge yesil">Yeşil VIP</span>
                  <span style={{ fontSize: "12px", color: "#34d399", fontWeight: 700 }}>540 Hz Espor</span>
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#fff", marginBottom: "4px" }}>Elite 540Hz VIP</h3>
                <div className="home-pricing-price">
                  90 ₺ <span>/ saat</span>
                </div>

                <div className="home-pricing-packages">
                  <div className="home-pkg-item">
                    <strong>350 ₺</strong>
                    <span>5 Saat Paket</span>
                  </div>
                  <div className="home-pkg-item">
                    <strong>700 ₺</strong>
                    <span>Gün Boyu</span>
                  </div>
                </div>

                <ul className="home-pricing-features">
                  <li><i className="fa-solid fa-check"></i> RTX 4080 Super / 4090</li>
                  <li><i className="fa-solid fa-check"></i> 540 Hz BenQ ZOWIE Espor</li>
                  <li><i className="fa-solid fa-check"></i> Intel i9 14900K Canavar Sistem</li>
                  <li><i className="fa-solid fa-check"></i> VIP Akustik Özel Alan</li>
                </ul>
              </div>

              <Link href="/rezerve" className="home-pricing-btn" style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", color: "#fff", border: "none" }}>
                <i className="fa-solid fa-crown"></i> VIP Masa Seç &amp; Ayırt
              </Link>
            </div>
          </div>
        </section>

        {/* PLAYER REVIEWS & RATINGS */}
        <section className="home-section" id="yorumlar">
          <div className="home-section-header">
            <span className="home-section-tag">
              <i className="fa-solid fa-star"></i> Oyuncu Değerlendirmeleri
            </span>
            <h2 className="home-section-title">Antalya'nın Esporcuları Ne Diyor?</h2>
            <p className="home-section-desc">
              Google Maps üzerinde 4.9 ★★★★★ puan ile Antalya'nın en yüksek memnuniyet oranına sahip oyun merkezi.
            </p>
          </div>

          <div className="home-reviews-grid">
            <div className="home-review-card">
              <div className="home-review-stars">
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
              </div>
              <p className="home-review-text">
                "540Hz ekranlar ve RTX 4090 sistemler gerçekten başka bir seviye. Valorant turnuvamız için Yeşil masaları kapattık, sıfır ping ve muazzam FPS aldık. Antalya'da tek geçerim."
              </p>
              <div className="home-reviewer">
                <div className="home-reviewer-avatar">BK</div>
                <div className="home-reviewer-info">
                  <strong>Batuhan K.</strong>
                  <span>Espor Takım Kaptanı</span>
                </div>
              </div>
            </div>

            <div className="home-review-card">
              <div className="home-review-stars">
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
              </div>
              <p className="home-review-text">
                "Online rezervasyon sistemi çok pratik, akşam saatlerinde yer kalmıyordu artık önceden masamı seçip geliyorum. Koltuklar aşırı rahat ve tostları çok lezzetli."
              </p>
              <div className="home-reviewer">
                <div className="home-reviewer-avatar">EY</div>
                <div className="home-reviewer-info">
                  <strong>Emre Yılmaz</strong>
                  <span>Düzenli Ziyaretçi</span>
                </div>
              </div>
            </div>

            <div className="home-review-card">
              <div className="home-review-stars">
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
              </div>
              <p className="home-review-text">
                "Kliması, havalandırması ve ortamı tertemiz. Personel çok ilgili, ekipmanlar sıfır ayarında. 5 saatlik paket fiyatı da çok uygun. Kesinlikle tavsiye ederim."
              </p>
              <div className="home-reviewer">
                <div className="home-reviewer-avatar">SD</div>
                <div className="home-reviewer-info">
                  <strong>Serkan Demir</strong>
                  <span>CS2 Oyuncusu</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION SECTION */}
        <section className="home-section" id="sss">
          <div className="home-section-header">
            <span className="home-section-tag">
              <i className="fa-solid fa-circle-question"></i> Sıkça Sorulan Sorular
            </span>
            <h2 className="home-section-title">Merak Edilenler</h2>
            <p className="home-section-desc">
              Rezervasyon, masa kiralama ve cafe hizmetlerimiz hakkında en çok sorulan sorular.
            </p>
          </div>

          <div className="home-faq-list">
            <details className="home-faq-item" open>
              <summary className="home-faq-summary">Rezervasyon yaptırdıktan sonra ne zaman gelmeliyim?</summary>
              <div className="home-faq-body">
                Rezervasyon saatinizden yaklaşık 10-15 dakika önce kafemize gelmeniz yeterlidir. Görevli arkadaşımıza isim ve telefon numaranızı belirterek seçtiğiniz masaya anında oturabilirsiniz.
              </div>
            </details>

            <details className="home-faq-item">
              <summary className="home-faq-summary">Bilgisayarlarda hangi oyunlar ve programlar hazır?</summary>
              <div className="home-faq-body">
                Valorant, CS2, League of Legends, GTA V, FC24 (FIFA), PUBG, Call of Duty Warzone, Apex Legends, Rust, Dota 2, R6 Siege ve Steam kütüphanesindeki yüzlerce oyun en son güncellemeleriyle hazır olarak yüklüdür.
              </div>
            </details>

            <details className="home-faq-item">
              <summary className="home-faq-summary">5 Saatlik ve Gün Boyu paketler nasıl çalışır?</summary>
              <div className="home-faq-body">
                5 saatlik veya gün boyu paket satın aldığınızda, saatlik ücret yerine çok daha avantajlı indirimli fiyattan yararlanırsınız. Süreniz masaya giriş yaptığınız andan itibaren başlar.
              </div>
            </details>

            <details className="home-faq-item">
              <summary className="home-faq-summary">Kendi mouse, kulaklık veya klavyemi getirebilir miyim?</summary>
              <div className="home-faq-body">
                Elbette! Tüm masalarımızda yüksek kaliteli profesyonel ekipmanlar bulunmaktadır ancak dileyen oyuncularımız kendi özel mouse, mousepad veya kulaklıklarını takıp kullanabilirler.
              </div>
            </details>
          </div>
        </section>

        {/* LOCATION & QUICK CONTACT BANNER */}
        <section className="home-section" id="iletisim">
          <div className="home-contact-banner">
            <div className="home-contact-info">
              <h3>Forza Gaming &amp; İnternet Cafe'ye Bekleriz</h3>
              <p><i className="fa-solid fa-location-dot" style={{ color: "#ffd700" }}></i> Kültür Mh. 3809 Sk. No:14 Muratpaşa / Antalya</p>
              <p><i className="fa-solid fa-clock" style={{ color: "#ffd700" }}></i> Haftanın Her Günü: 09:00 - 04:00 Kesintisiz Açık</p>
              <p><i className="fa-solid fa-phone" style={{ color: "#ffd700" }}></i> 0 (546) 465 96 93</p>
            </div>

            <div className="home-contact-actions">
              <a
                href="https://maps.google.com/?q=Forza+Internet+Cafe+Muratpasa+Antalya"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{ background: "rgba(255,255,255,0.12)", color: "#fff" }}
              >
                <i className="fa-solid fa-map-location-dot"></i> Haritada Aç &amp; Yol Tarifi
              </a>
              <a
                href="tel:05464659693"
                className="rzr-main"
                style={{ padding: "14px 28px" }}
              >
                <i className="fa-solid fa-phone"></i> Hemen Ara
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppWidget />
    </>
  );
}