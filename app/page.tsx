"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppWidget from "@/components/public/WhatsAppWidget";

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  return (
    <>
      <Navbar />

      <main>
        {/* HERO SECTION */}
        <header className="home-header">
          <div className="hero-pill-badge">
            <span className="badge-dot"></span>
            🟢 7/24 Kesintisiz Açık | Antalya Espor &amp; Gaming Merkezi
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
              <h3>7/24 Kesintisiz Açık</h3>
              <p>Haftanın 7 günü 24 saat kesintisiz espor keyfi.</p>
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
              <h3>7/24 Kesintisiz Açık</h3>
              <p>Haftanın 7 günü 24 saat kesintisiz espor keyfi.</p>
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


        {/* PLAYER REVIEWS & RATINGS ACCORDION */}
        <section className="home-section" id="yorumlar" style={{ maxWidth: "800px", margin: "0 auto 80px", width: "min(800px, calc(100% - 32px))", textAlign: "center" }}>
          <div className="home-section-header" style={{ textAlign: "center", marginBottom: "30px" }}>
            <span className="home-section-tag">
              <i className="fa-solid fa-star"></i> Oyuncu Değerlendirmeleri
            </span>
            <h2 className="home-section-title">Antalya'nın Esporcuları Ne Diyor?</h2>
            <p className="home-section-desc">
              Google Maps üzerinde 4.9 ★★★★★ puan ile Antalya'nın en yüksek memnuniyet oranına sahip oyun merkezi.
            </p>
          </div>

          <div className="home-reviews-accordion-list" style={{ display: "flex", flexDirection: "column", gap: "14px", width: "100%", margin: "0 auto", textAlign: "left" }}>
            {/* Review 1 */}
            <details className="home-review-accordion" style={{ background: "rgba(18, 24, 38, 0.85)", border: "1px solid rgba(255, 215, 0, 0.25)", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }} open>
              <summary className="home-review-summary" style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", listStyle: "none", userSelect: "none", gap: "12px", background: "rgba(255, 255, 255, 0.02)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #ffd700, #b8860b)", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "14px", flexShrink: 0 }}>BK</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px", textAlign: "left" }}>
                    <strong style={{ fontSize: "14.5px", color: "#ffffff", fontWeight: 700 }}>Batuhan K.</strong>
                    <span style={{ fontSize: "11.5px", color: "#ffd700", fontWeight: 600 }}>Espor Takım Kaptanı</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ color: "#f59e0b", fontSize: "13px", display: "flex", gap: "2px" }}>
                    <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                  </div>
                </div>
              </summary>
              <div className="home-review-body" style={{ padding: "14px 20px 20px", borderTop: "1px solid rgba(255, 255, 255, 0.08)", textAlign: "left" }}>
                <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.7, fontStyle: "italic", marginBottom: "12px" }}>
                  "540Hz BenQ ZOWIE ekranlar ve RTX 4090 sistemler gerçekten başka bir seviye. Turnuvamızda sıfır ping ve 500+ FPS aldık. Akustik düzeni, kulaklıkları ve atmosferi Antalya'da tek geçerim."
                </p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#34d399" }}><i className="fa-solid fa-circle-check"></i> Doğrulanmış Oyuncu</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "#94a3b8" }}>540 Hz Espor</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "#94a3b8" }}>RTX 4090</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "#94a3b8" }}>Valorant Turnuva</span>
                </div>
              </div>
            </details>

            {/* Review 2 */}
            <details className="home-review-accordion" style={{ background: "rgba(18, 24, 38, 0.85)", border: "1px solid rgba(255, 215, 0, 0.25)", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
              <summary className="home-review-summary" style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", listStyle: "none", userSelect: "none", gap: "12px", background: "rgba(255, 255, 255, 0.02)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #ffd700, #b8860b)", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "14px", flexShrink: 0 }}>EY</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px", textAlign: "left" }}>
                    <strong style={{ fontSize: "14.5px", color: "#ffffff", fontWeight: 700 }}>Emre Yılmaz</strong>
                    <span style={{ fontSize: "11.5px", color: "#ffd700", fontWeight: 600 }}>Düzenli Ziyaretçi</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ color: "#f59e0b", fontSize: "13px", display: "flex", gap: "2px" }}>
                    <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                  </div>
                </div>
              </summary>
              <div className="home-review-body" style={{ padding: "14px 20px 20px", borderTop: "1px solid rgba(255, 255, 255, 0.08)", textAlign: "left" }}>
                <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.7, fontStyle: "italic", marginBottom: "12px" }}>
                  "Online rezervasyon sistemi çok pratik, hafta sonları bile sıra beklemeden yerimi ayırtıp geliyorum. Koltuklar aşırı rahat, ortam ferah ve sıcak kaşarlı tostları çok lezzetli."
                </p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#34d399" }}><i className="fa-solid fa-circle-check"></i> Doğrulanmış Oyuncu</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "#94a3b8" }}>Hızlı Rezervasyon</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "#94a3b8" }}>Ergonomik Koltuk</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "#94a3b8" }}>Zengin Cafe Menüsü</span>
                </div>
              </div>
            </details>

            {/* Review 3 */}
            <details className="home-review-accordion" style={{ background: "rgba(18, 24, 38, 0.85)", border: "1px solid rgba(255, 215, 0, 0.25)", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
              <summary className="home-review-summary" style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", listStyle: "none", userSelect: "none", gap: "12px", background: "rgba(255, 255, 255, 0.02)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #ffd700, #b8860b)", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "14px", flexShrink: 0 }}>SD</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px", textAlign: "left" }}>
                    <strong style={{ fontSize: "14.5px", color: "#ffffff", fontWeight: 700 }}>Serkan Demir</strong>
                    <span style={{ fontSize: "11.5px", color: "#ffd700", fontWeight: 600 }}>CS2 Oyuncusu</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ color: "#f59e0b", fontSize: "13px", display: "flex", gap: "2px" }}>
                    <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                  </div>
                </div>
              </summary>
              <div className="home-review-body" style={{ padding: "14px 20px 20px", borderTop: "1px solid rgba(255, 255, 255, 0.08)", textAlign: "left" }}>
                <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.7, fontStyle: "italic", marginBottom: "12px" }}>
                  "Kliması, havalandırması ve ortamı tertemiz. Personel çok ilgili, ekipmanlar sıfır ayarında. 1000 Mbps fiber altyapı ile 3ms sabit ping alıyoruz. Kesinlikle tavsiye ederim."
                </p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#34d399" }}><i className="fa-solid fa-circle-check"></i> Doğrulanmış Oyuncu</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "#94a3b8" }}>1000 Mbps Fiber</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "#94a3b8" }}>3ms Ping</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "#94a3b8" }}>CS2 Turnuva</span>
                </div>
              </div>
            </details>

            {/* Review 4 */}
            <details className="home-review-accordion" style={{ background: "rgba(18, 24, 38, 0.85)", border: "1px solid rgba(255, 215, 0, 0.25)", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
              <summary className="home-review-summary" style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", listStyle: "none", userSelect: "none", gap: "12px", background: "rgba(255, 255, 255, 0.02)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #ffd700, #b8860b)", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "14px", flexShrink: 0 }}>CA</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px", textAlign: "left" }}>
                    <strong style={{ fontSize: "14.5px", color: "#ffffff", fontWeight: 700 }}>Caner Aydın</strong>
                    <span style={{ fontSize: "11.5px", color: "#ffd700", fontWeight: 600 }}>Espor Yayıncısı &amp; Oyuncu</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ color: "#f59e0b", fontSize: "13px", display: "flex", gap: "2px" }}>
                    <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                  </div>
                </div>
              </summary>
              <div className="home-review-body" style={{ padding: "14px 20px 20px", borderTop: "1px solid rgba(255, 255, 255, 0.08)", textAlign: "left" }}>
                <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.7, fontStyle: "italic", marginBottom: "12px" }}>
                  "Arkadaşlarla 5'li takım olarak geldik. SteelSeries Nova kulaklıklar ve Logitech G Pro fareler ile kusursuz bir rekabetçi ortam sağlanmış. 5 saatlik paket avantajı da çok cazip."
                </p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#34d399" }}><i className="fa-solid fa-circle-check"></i> Doğrulanmış Oyuncu</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "#94a3b8" }}>5v5 Takım Oyunu</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "#94a3b8" }}>Pro Ekipmanlar</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "#94a3b8" }}>Avantajlı Paket</span>
                </div>
              </div>
            </details>
          </div>
        </section>

        {/* FAQ ACCORDION SECTION */}
        <section className="home-section" id="sss" style={{ maxWidth: "800px", margin: "0 auto 80px", width: "min(800px, calc(100% - 32px))", textAlign: "center" }}>
          <div className="home-section-header" style={{ textAlign: "center", marginBottom: "30px" }}>
            <span className="home-section-tag">
              <i className="fa-solid fa-circle-question"></i> Sıkça Sorulan Sorular
            </span>
            <h2 className="home-section-title">Merak Edilenler</h2>
            <p className="home-section-desc">
              Rezervasyon, espor oyunları ve cafe hizmetlerimiz hakkında en çok sorulan sorular.
            </p>
          </div>

          <div className="home-faq-list">
            {/* Soru 1 */}
            <div className={`home-faq-item ${openFaq === 0 ? "active" : ""}`}>
              <button
                type="button"
                className="home-faq-header"
                onClick={() => toggleFaq(0)}
                aria-expanded={openFaq === 0}
              >
                <span className="home-faq-question-text">Rezervasyon yaptırdıktan sonra ne zaman gelmeliyim?</span>
                <span className="home-faq-icon" aria-hidden="true">
                  <i className="fa-solid fa-play"></i>
                </span>
              </button>
              <div className="home-faq-collapse">
                <div className="home-faq-body">
                  Rezervasyon saatinizden yaklaşık 10-15 dakika önce kafemize gelmeniz yeterlidir. Görevli arkadaşımıza isim ve telefon numaranızı belirterek doğrudan yerinize geçebilirsiniz.
                </div>
              </div>
            </div>

            {/* Soru 2 */}
            <div className={`home-faq-item ${openFaq === 1 ? "active" : ""}`}>
              <button
                type="button"
                className="home-faq-header"
                onClick={() => toggleFaq(1)}
                aria-expanded={openFaq === 1}
              >
                <span className="home-faq-question-text">Bilgisayarlarda hangi oyunlar ve programlar hazır?</span>
                <span className="home-faq-icon" aria-hidden="true">
                  <i className="fa-solid fa-play"></i>
                </span>
              </button>
              <div className="home-faq-collapse">
                <div className="home-faq-body">
                  Valorant, CS2, League of Legends, GTA V, FC24 (FIFA), PUBG, Call of Duty Warzone, Apex Legends, Rust, Dota 2, R6 Siege ve Steam kütüphanesindeki yüzlerce oyun en son güncellemeleriyle hazır olarak yüklüdür.
                </div>
              </div>
            </div>

            {/* Soru 3 */}
            <div className={`home-faq-item ${openFaq === 2 ? "active" : ""}`}>
              <button
                type="button"
                className="home-faq-header"
                onClick={() => toggleFaq(2)}
                aria-expanded={openFaq === 2}
              >
                <span className="home-faq-question-text">5 Saatlik ve Gün Boyu paketler nasıl çalışır?</span>
                <span className="home-faq-icon" aria-hidden="true">
                  <i className="fa-solid fa-play"></i>
                </span>
              </button>
              <div className="home-faq-collapse">
                <div className="home-faq-body">
                  5 saatlik veya gün boyu paket satın aldığınızda, saatlik ücret yerine çok daha avantajlı indirimli fiyattan yararlanırsınız. Süreniz oturumunuzu açtığınız andan itibaren başlar.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LOCATION & QUICK CONTACT BANNER */}
        <section className="home-section" id="iletisim">
          <div className="home-contact-banner">
            <div className="home-contact-info">
              <h3>Forza Gaming &amp; İnternet Cafe'ye Bekleriz</h3>
              <p><i className="fa-solid fa-location-dot" style={{ color: "#ffd700" }}></i> Kültür Mh. 3809 Sk. No:14 Muratpaşa / Antalya</p>
              <p><i className="fa-solid fa-clock" style={{ color: "#ffd700" }}></i> 7 Gün 24 Saat Kesintisiz Açık</p>
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