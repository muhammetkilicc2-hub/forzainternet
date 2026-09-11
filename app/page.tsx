"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppWidget from "@/components/public/WhatsAppWidget";
import { KampanyaFiyatlari } from "@/lib/types";
import PricingCards from "@/components/public/PricingCards";
import { FORZA_PHONE, FORZA_PHONE_FORMATTED, FORZA_MAPS_LINK } from "@/lib/constants";
import { subscribeLiveUpdate } from "@/lib/liveSync";

export default function HomePage() {
  

  
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

          <h1 className="para1">FORZA E-SPORTS &amp; GAMING CAFE</h1>
          <p className="para1">Profesyonel Espor Monitörleri, RTX Canavar Sistemler ve 1000 Mbps Düşük Ping Deneyimi.</p>
          <div className="hero-actions czr" style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", marginTop: "24px" }}>
            <Link href="/hakkimizda" className="rzr-main" style={{ background: "whitesmoke", color: "#111827", textDecoration: "none", boxShadow: "0 0 20px rgba(255, 255, 255, 0.2)", padding: "14px 28px", borderRadius: "50px", fontWeight: 800 }}>
              <i className="fa-solid fa-users" aria-hidden="true" style={{ marginRight: "8px" }}></i>
              Hakkımızda
            </Link>
            <a onClick={() => { fetch("/api/analytics", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "click", type: "phone" }) }) }}  href={`tel:${FORZA_PHONE}`} className="rzr-main" style={{ textDecoration: "none", padding: "14px 28px", borderRadius: "50px", fontWeight: 800 }}>
              <i className="fa-solid fa-phone" aria-hidden="true" style={{ marginRight: "8px" }}></i>
              Bizi Ara
            </a>
                        <Link href="/ozellikler" className="rzr-main" style={{ background: "linear-gradient(135deg, #ffd700 0%, #d97706 100%)", color: "#111827", textDecoration: "none", boxShadow: "0 0 20px rgba(255, 215, 0, 0.3)", padding: "14px 28px", borderRadius: "50px", fontWeight: 800 }}>
              <i className="fa-solid fa-bolt" aria-hidden="true" style={{ marginRight: "8px" }}></i>
              Özellikler
            </Link>
          </div>

          {/* HERO MINI SPECS BAR */}
          <div className="hero-specs-container">
            <div className="hero-spec-card">
              <div className="hero-spec-icon">
                <i className="fa-solid fa-bolt"></i>
              </div>
              <div className="hero-spec-text">
                <strong>Ultra Yüksek Hz</strong>
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
              <h3>Espor Monitörleri</h3>
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
              <p>Kaşarlı sucuklu tost, taze kahve çeşitleri ve soğuk enerji içecekleri.</p>
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
              <h3>Espor Monitörleri</h3>
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
              <p>Kaşarlı sucuklu tost, taze kahve çeşitleri ve soğuk enerji içecekleri.</p>
            </div>
          </div>
        </section>

        {/* PRICING & CAMPAIGN PACKAGES SECTION */}
        <section className="home-section" id="fiyatlar" style={{ maxWidth: "1200px", margin: "0 auto 80px", width: "min(1200px, calc(100% - 32px))", textAlign: "center" }}>
          <div className="home-section-header" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: "36px" }}>
            <span className="home-section-tag" style={{ margin: "0 auto 12px" }}>
              <i className="fa-solid fa-tags"></i> Fiyat Tarifeleri &amp; Avantajlı Paketler
            </span>
            <h2 className="home-section-title" style={{ textAlign: "center", margin: "0 auto 10px" }}>Şehrin En Avantajlı Espor Paketleri</h2>
            <p className="home-section-desc" style={{ textAlign: "center", margin: "0 auto", maxWidth: "620px" }}>
              İster saatlik oyna, ister 5 saatlik ve gün boyu özel indirimli espor paketlerimizle kesintisiz rekabetin tadını çıkar.
            </p>
          </div>

          <PricingCards isMini={true} />
          </section>


        

        

        {/* FAQ ACCORDION SECTION */}
        <section className="home-section" id="sss" style={{ maxWidth: "820px", margin: "0 auto 80px", width: "min(820px, calc(100% - 32px))", textAlign: "center" }}>
          <div className="home-section-header" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: "32px" }}>
            <span className="home-section-tag" style={{ margin: "0 auto 12px" }}>
              <i className="fa-solid fa-circle-question"></i> Sıkça Sorulan Sorular
            </span>
            <h2 className="home-section-title" style={{ textAlign: "center", margin: "0 auto 10px" }}>Merak Edilenler</h2>
            <p className="home-section-desc" style={{ textAlign: "center", margin: "0 auto", maxWidth: "600px" }}>
              Espor oyunları ve cafe hizmetlerimiz hakkında en çok sorulan sorular.
            </p>
          </div>

          <div className="home-faq-list" style={{ display: "flex", flexDirection: "column", gap: "14px", width: "100%", margin: "0 auto", textAlign: "left" }}>
            {/* Soru 1 */}
            

            {/* Soru 2 */}
            <details className="home-faq-item" name="forza-faq-group" style={{ background: "rgba(18, 24, 38, 0.88)", border: "1px solid rgba(148, 163, 184, 0.25)", borderRadius: "18px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.35)", backdropFilter: "blur(20px)" }}>
              <summary className="home-faq-summary" style={{ padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", listStyle: "none", userSelect: "none", gap: "14px", background: "rgba(255, 255, 255, 0.02)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "12px", background: "linear-gradient(135deg, rgba(148, 163, 184, 0.2), rgba(148, 163, 184, 0.05))", border: "1px solid rgba(148, 163, 184, 0.35)", color: "#cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "14px", flexShrink: 0, boxShadow: "0 0 10px rgba(148, 163, 184, 0.15)" }}>
                    <i className="fa-solid fa-gamepad"></i>
                  </div>
                  <strong style={{ fontSize: "15.5px", color: "#ffffff", fontWeight: 700, lineHeight: 1.4 }}>Bilgisayarlarda hangi oyunlar ve programlar hazır?</strong>
                </div>
                <div className="faq-chevron" style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.12)", color: "#cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", flexShrink: 0, transition: "transform 0.3s ease" }}>
                  <i className="fa-solid fa-chevron-down"></i>
                </div>
              </summary>
              <div className="home-faq-body" style={{ padding: "18px 22px 22px", borderTop: "1px solid rgba(255, 255, 255, 0.08)", background: "rgba(10, 14, 22, 0.45)", fontSize: "14.5px", color: "#cbd5e1", lineHeight: 1.75 }}>
                <p style={{ margin: "0 0 12px" }}>
                  Valorant, CS2, League of Legends, GTA V, FC24 (FIFA), PUBG, Call of Duty Warzone, Apex Legends, Rust, Dota 2, R6 Siege ve Steam kütüphanesindeki yüzlerce oyun en son güncellemeleriyle hazır olarak yüklüdür.
                </p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: "rgba(251, 191, 36, 0.15)", border: "1px solid rgba(251, 191, 36, 0.3)", color: "#fbbf24" }}>Tüm Espor Oyunları</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.12)", color: "#94a3b8" }}>Güncel Patchler</span>
                </div>
              </div>
            </details>

            {/* Soru 3 */}
            <details className="home-faq-item" name="forza-faq-group" style={{ background: "rgba(18, 24, 38, 0.88)", border: "1px solid rgba(148, 163, 184, 0.25)", borderRadius: "18px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.35)", backdropFilter: "blur(20px)" }}>
              <summary className="home-faq-summary" style={{ padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", listStyle: "none", userSelect: "none", gap: "14px", background: "rgba(255, 255, 255, 0.02)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "12px", background: "linear-gradient(135deg, rgba(148, 163, 184, 0.2), rgba(148, 163, 184, 0.05))", border: "1px solid rgba(148, 163, 184, 0.35)", color: "#cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "14px", flexShrink: 0, boxShadow: "0 0 10px rgba(148, 163, 184, 0.15)" }}>
                    <i className="fa-solid fa-clock"></i>
                  </div>
                  <strong style={{ fontSize: "15.5px", color: "#ffffff", fontWeight: 700, lineHeight: 1.4 }}>5 Saatlik ve Gün Boyu paketler nasıl çalışır?</strong>
                </div>
                <div className="faq-chevron" style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.12)", color: "#cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", flexShrink: 0, transition: "transform 0.3s ease" }}>
                  <i className="fa-solid fa-chevron-down"></i>
                </div>
              </summary>
              <div className="home-faq-body" style={{ padding: "18px 22px 22px", borderTop: "1px solid rgba(255, 255, 255, 0.08)", background: "rgba(10, 14, 22, 0.45)", fontSize: "14.5px", color: "#cbd5e1", lineHeight: 1.75 }}>
                <p style={{ margin: "0 0 12px" }}>
                  5 saatlik veya gün boyu paket satın aldığınızda, saatlik ücret yerine çok daha avantajlı indirimli fiyattan yararlanırsınız. Süreniz oturumunuzu açtığınız andan itibaren başlar.
                </p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: "rgba(148, 163, 184, 0.15)", border: "1px solid rgba(148, 163, 184, 0.3)", color: "#cbd5e1" }}>İndirimli Fiyat</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.12)", color: "#94a3b8" }}>Oturum Başlangıcı</span>
                </div>
              </div>
            </details>
          </div>
        </section>

        {/* LOCATION & QUICK CONTACT ACCORDION BANNER */}
        <section className="home-section" id="iletisim" style={{ maxWidth: "820px", margin: "0 auto 36px", width: "min(820px, calc(100% - 32px))", textAlign: "center" }}>
          <div className="home-contact-banner" style={{ background: "linear-gradient(135deg, rgba(148, 163, 184, 0.12) 0%, rgba(14, 165, 233, 0.08) 50%, rgba(18, 24, 38, 0.95) 100%)", border: "1px solid rgba(148, 163, 184, 0.35)", borderRadius: "28px", padding: "42px 32px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", width: "100%", boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(148, 163, 184, 0.1)", gap: "20px" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "linear-gradient(135deg, #cbd5e1, #b8860b)", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", boxShadow: "0 0 16px rgba(148, 163, 184,0.4)", margin: "0 auto 4px" }}>
              <i className="fa-solid fa-location-dot"></i>
            </div>

            <div className="home-contact-info" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", width: "100%" }}>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(22px, 3.5vw, 28px)", fontWeight: 800, color: "#ffffff", marginBottom: "14px", textAlign: "center" }}>Forza E-Sports &amp; Gaming Cafe'ye Bekleriz</h3>
              <p style={{ fontSize: "15px", color: "#cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "10px", textAlign: "center" }}>
                <i className="fa-solid fa-location-dot" style={{ color: "#cbd5e1", fontSize: "16px" }}></i> Kültür Mh. 3809 Sk. No:14 Kepez / Antalya
              </p>
              <p style={{ fontSize: "15px", color: "#cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "10px", textAlign: "center" }}>
                <i className="fa-solid fa-clock" style={{ color: "#cbd5e1", fontSize: "16px" }}></i> 7 Gün 24 Saat Kesintisiz Açık
              </p>
              <p style={{ fontSize: "15px", color: "#cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "6px", textAlign: "center" }}>
                <i className="fa-solid fa-phone" style={{ color: "#cbd5e1", fontSize: "16px" }}></i> {FORZA_PHONE_FORMATTED}
              </p>
            </div>

            <div className="home-contact-actions" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", flexWrap: "wrap", marginTop: "6px", width: "100%" }}>
              <a
                href={FORZA_MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{ background: "rgba(255,255,255,0.12)", color: "#fff", padding: "14px 26px", borderRadius: "12px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "8px" }}
              >
                <i className="fa-solid fa-map-location-dot"></i> Haritada Aç &amp; Yol Tarifi
              </a>
              <a
                href={`tel:`}
                className="rzr-main"
                style={{ padding: "14px 30px", borderRadius: "12px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "8px" }}
              >
                <i className="fa-solid fa-phone"></i> Hemen Ara
              </a>
            </div>
          </div>
</section>
        {/* PLAYER REVIEWS & RATINGS ACCORDION */}
        <section className="home-section" id="yorumlar" style={{ maxWidth: "820px", margin: "0 auto 80px", width: "min(820px, calc(100% - 32px))", textAlign: "center" }}>
          <div className="home-section-header" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: "32px" }}>
            <span className="home-section-tag" style={{ margin: "0 auto 12px" }}>
              <i className="fa-solid fa-star"></i> Oyuncu Değerlendirmeleri
            </span>
            <h2 className="home-section-title" style={{ textAlign: "center", margin: "0 auto 10px" }}>Antalya'nın Esporcuları Ne Diyor?</h2>
            <p className="home-section-desc" style={{ textAlign: "center", margin: "0 auto", maxWidth: "600px" }}>
              Google Maps üzerinde 4.9 <i className="fa-solid fa-star" style={{color:"#f59e0b"}}></i> ile Antalya'nın en yüksek memnuniyet oranına sahip espor &amp; gaming merkezi.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px", textAlign: "left", maxWidth: "700px", margin: "0 auto" }}>
            <div style={{ background: "rgba(30, 41, 59, 0.4)", border: "1px solid rgba(148, 163, 184, 0.1)", borderRadius: "20px", padding: "24px", position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "18px", color: "#fff" }}>
                  B
                </div>
                <div>
                  <h4 style={{ margin: "0 0 4px", fontSize: "16px", color: "#f8fafc" }}>Burak Yılmaz</h4>
                  <div style={{ color: "#f59e0b", fontSize: "12px" }}>
                    <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                  </div>
                </div>
              </div>
              <p style={{ color: "#cbd5e1", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
                "Ekipmanlar sıfır ve bakımlı, klavyeler ve fareler pırıl pırıl. 5 saatlik paket fiyatı da tam öğrenci dostu. Arkadaş grubuyla gelmek için Antalya'daki 1 numara mekan."
              </p>
            </div>

            <div style={{ background: "rgba(30, 41, 59, 0.4)", border: "1px solid rgba(148, 163, 184, 0.1)", borderRadius: "20px", padding: "24px", position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "18px", color: "#fff" }}>
                  M
                </div>
                <div>
                  <h4 style={{ margin: "0 0 4px", fontSize: "16px", color: "#f8fafc" }}>Mert Can</h4>
                  <div style={{ color: "#f59e0b", fontSize: "12px" }}>
                    <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                  </div>
                </div>
              </div>
              <p style={{ color: "#cbd5e1", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
                "Ortam çok ferah, klimalar buz gibi yapıyor. VIP odalardaki monitörler ve koltuklar harika. Antalya'da böyle nezih ve kaliteli bir internet kafe bulmak gerçekten zor."
              </p>
            </div>

            <div style={{ background: "rgba(30, 41, 59, 0.4)", border: "1px solid rgba(148, 163, 184, 0.1)", borderRadius: "20px", padding: "24px", position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "18px", color: "#fff" }}>
                  K
                </div>
                <div>
                  <h4 style={{ margin: "0 0 4px", fontSize: "16px", color: "#f8fafc" }}>Kerem D.</h4>
                  <div style={{ color: "#f59e0b", fontSize: "12px" }}>
                    <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                  </div>
                </div>
              </div>
              <p style={{ color: "#cbd5e1", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
                "Antalya'da espor turnuvalarına hazırlandığımız tek adres. FPS oyunlarında yüksek Hz monitörlerin farkı inanılmaz. 5 saatlik paketlerle tüm gün buradayız."
              </p>
            </div>

            <div style={{ background: "rgba(30, 41, 59, 0.4)", border: "1px solid rgba(148, 163, 184, 0.1)", borderRadius: "20px", padding: "24px", position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "18px", color: "#fff" }}>
                  B
                </div>
                <div>
                  <h4 style={{ margin: "0 0 4px", fontSize: "16px", color: "#f8fafc" }}>Berkay K.</h4>
                  <div style={{ color: "#f59e0b", fontSize: "12px" }}>
                    <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                  </div>
                </div>
              </div>
              <p style={{ color: "#cbd5e1", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
                "Hem ortamın kalitesi hem de çalışanların ilgisi muazzam. Bilgisayarlar her masaya oturduğunuzda tertemiz. RTX ekran kartları sayesinde hiçbir oyunda kasma yaşamıyorsunuz."
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppWidget />
    </>
  );
}