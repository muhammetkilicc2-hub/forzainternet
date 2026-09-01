"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppWidget from "@/components/public/WhatsAppWidget";
import { KampanyaFiyatlari } from "@/lib/types";
import { subscribeLiveUpdate } from "@/lib/liveSync";

export default function HomePage() {
  const [pricing, setPricing] = useState<KampanyaFiyatlari>({
    sari: { saatlik: 60, besSaatlik: 200, gunluk: 400 },
    mavi: { saatlik: 70, besSaatlik: 250, gunluk: 500 },
    yesil: { saatlik: 90, besSaatlik: 350, gunluk: 700 },
  });

  useEffect(() => {
    async function loadPricingData() {
      try {
        const raw = localStorage.getItem("forzaFiyatlar");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.sari) setPricing(parsed);
        }
      } catch (e) {}

      try {
        const res = await fetch("/api/pricing", { cache: "no-store" });
        const data = await res.json();
        if (data.pricing) {
          setPricing(data.pricing);
          try {
            localStorage.setItem("forzaFiyatlar", JSON.stringify(data.pricing));
          } catch (e) {}
        }
      } catch (e) {}
    }

    loadPricingData();

    // 1. Subscribe to instant inter-tab live channel
    const unsubscribe = subscribeLiveUpdate("pricing", (updatedPricing) => {
      if (updatedPricing && updatedPricing.sari) {
        setPricing(updatedPricing);
      } else {
        loadPricingData();
      }
    });

    // 2. High-speed background sync (every 2.5s)
    const interval = setInterval(loadPricingData, 2500);

    // 3. Tab focus & visibility change listener
    const handleFocus = () => loadPricingData();
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);
    window.addEventListener("storage", loadPricingData);

    return () => {
      unsubscribe();
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
      window.removeEventListener("storage", loadPricingData);
    };
  }, []);
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
          <p className="para1">Profesyonel Espor Monitörleri, RTX Canavar Sistemler ve 1000 Mbps Düşük Ping Deneyimi.</p>
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

          <div className="kampanya-kartlari" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", textAlign: "left" }}>
            {/* Sarı Kart */}
            <div className="kampanya-karti sari" style={{ background: "rgba(14, 18, 26, 0.88)", border: "1px solid rgba(255, 215, 0, 0.3)", borderRadius: "24px", padding: "28px 24px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", backdropFilter: "blur(20px)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 800, padding: "4px 12px", borderRadius: "12px", background: "rgba(255, 215, 0, 0.15)", color: "#ffd700", border: "1px solid rgba(255, 215, 0, 0.3)" }}>
                    STANDART GAMING
                  </span>
                  <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600 }}>144 Hz Espor</span>
                </div>
                <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#ffffff", marginBottom: "6px" }}>Sarı Masalar</h3>
                <p style={{ fontSize: "13px", color: "#cbd5e1", marginBottom: "20px" }}>Nvidia RTX 3060 • Intel i5 • 16GB RAM • 144Hz Monitör</p>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "16px", background: "rgba(255, 255, 255, 0.03)", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.06)", marginBottom: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "13.5px", color: "#cbd5e1" }}>Saatlik Ücret</span>
                    <strong style={{ fontSize: "18px", color: "#ffffff", fontWeight: 800 }}>₺{pricing.sari.saatlik} <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 500 }}>/ saat</span></strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "13.5px", color: "#cbd5e1" }}>5 Saatlik Paket</span>
                    <strong style={{ fontSize: "18px", color: "#ffd700", fontWeight: 800 }}>₺{pricing.sari.besSaatlik}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "13.5px", color: "#cbd5e1" }}>Gün Boyu Paket</span>
                    <strong style={{ fontSize: "18px", color: "#ffd700", fontWeight: 800 }}>₺{pricing.sari.gunluk}</strong>
                  </div>
                </div>
              </div>

              <Link href="/rezerve" className="primary-btn" style={{ width: "100%", textAlign: "center", textDecoration: "none", display: "block" }}>
                Masa Seç &amp; Yerini Ayırt ➔
              </Link>
            </div>

            {/* Mavi Kart */}
            <div className="kampanya-karti mavi" style={{ background: "rgba(14, 18, 26, 0.88)", border: "1px solid rgba(56, 189, 248, 0.35)", borderRadius: "24px", padding: "28px 24px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", backdropFilter: "blur(20px)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 800, padding: "4px 12px", borderRadius: "12px", background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", border: "1px solid rgba(56, 189, 248, 0.35)" }}>
                    PRO ESPOR GAMING
                  </span>
                  <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600 }}>240 Hz Espor</span>
                </div>
                <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#ffffff", marginBottom: "6px" }}>Mavi Masalar</h3>
                <p style={{ fontSize: "13px", color: "#cbd5e1", marginBottom: "20px" }}>RTX 3060 OC • Intel i5 Gaming • 16GB RAM • 240Hz Monitör</p>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "16px", background: "rgba(255, 255, 255, 0.03)", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.06)", marginBottom: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "13.5px", color: "#cbd5e1" }}>Saatlik Ücret</span>
                    <strong style={{ fontSize: "18px", color: "#ffffff", fontWeight: 800 }}>₺{pricing.mavi.saatlik} <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 500 }}>/ saat</span></strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "13.5px", color: "#cbd5e1" }}>5 Saatlik Paket</span>
                    <strong style={{ fontSize: "18px", color: "#38bdf8", fontWeight: 800 }}>₺{pricing.mavi.besSaatlik}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "13.5px", color: "#cbd5e1" }}>Gün Boyu Paket</span>
                    <strong style={{ fontSize: "18px", color: "#38bdf8", fontWeight: 800 }}>₺{pricing.mavi.gunluk}</strong>
                  </div>
                </div>
              </div>

              <Link href="/rezerve" className="primary-btn" style={{ width: "100%", textAlign: "center", textDecoration: "none", display: "block" }}>
                Masa Seç &amp; Yerini Ayırt ➔
              </Link>
            </div>

            {/* Yeşil Kart (VIP) */}
            <div className="kampanya-karti yesil" style={{ background: "rgba(14, 18, 26, 0.88)", border: "2px solid rgba(52, 211, 153, 0.45)", borderRadius: "24px", padding: "28px 24px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", backdropFilter: "blur(20px)", boxShadow: "0 10px 30px rgba(52, 211, 153, 0.15)" }}>
              <div style={{ position: "absolute", top: "-13px", right: "24px", background: "linear-gradient(135deg, #10b981, #059669)", color: "#ffffff", padding: "3px 12px", borderRadius: "12px", fontSize: "11px", fontWeight: 800, letterSpacing: "0.5px" }}>
                ⭐ EN POPÜLER
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 800, padding: "4px 12px", borderRadius: "12px", background: "rgba(52, 211, 153, 0.15)", color: "#34d399", border: "1px solid rgba(52, 211, 153, 0.35)" }}>
                    ULTRA VIP ESPOR
                  </span>
                  <span style={{ fontSize: "12px", color: "#34d399", fontWeight: 700 }}>540 Hz Turnuva Alanı</span>
                </div>
                <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#ffffff", marginBottom: "6px" }}>Yeşil Masalar</h3>
                <p style={{ fontSize: "13px", color: "#cbd5e1", marginBottom: "20px" }}>RTX 3070 Ti / 5060 • Ryzen 7 7800X3D • 32GB DDR5 • 540 Hz Espor Monitörü</p>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "16px", background: "rgba(255, 255, 255, 0.03)", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.06)", marginBottom: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "13.5px", color: "#cbd5e1" }}>Saatlik Ücret</span>
                    <strong style={{ fontSize: "18px", color: "#ffffff", fontWeight: 800 }}>₺{pricing.yesil.saatlik} <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 500 }}>/ saat</span></strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "13.5px", color: "#cbd5e1" }}>5 Saatlik Paket</span>
                    <strong style={{ fontSize: "18px", color: "#34d399", fontWeight: 800 }}>₺{pricing.yesil.besSaatlik}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "13.5px", color: "#cbd5e1" }}>Gün Boyu Paket</span>
                    <strong style={{ fontSize: "18px", color: "#34d399", fontWeight: 800 }}>₺{pricing.yesil.gunluk}</strong>
                  </div>
                </div>
              </div>

              <Link href="/rezerve" className="primary-btn" style={{ width: "100%", textAlign: "center", textDecoration: "none", display: "block" }}>
                Masa Seç &amp; Yerini Ayırt ➔
              </Link>
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
              Google Maps üzerinde 4.9 ★★★★★ puan ile Antalya'nın en yüksek memnuniyet oranına sahip espor &amp; gaming merkezi.
            </p>
          </div>

          <div className="home-reviews-accordion-list" style={{ display: "flex", flexDirection: "column", gap: "14px", width: "100%", margin: "0 auto", textAlign: "left" }}>
            {/* Review 1 */}
            <details className="home-review-accordion" style={{ background: "rgba(18, 24, 38, 0.88)", border: "1px solid rgba(255, 215, 0, 0.25)", borderRadius: "18px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.35)" }} open>
              <summary className="home-review-summary" style={{ padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", listStyle: "none", userSelect: "none", gap: "14px", background: "rgba(255, 255, 255, 0.02)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "linear-gradient(135deg, #ffd700, #b8860b)", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "14.5px", flexShrink: 0, boxShadow: "0 0 12px rgba(255,215,0,0.4)" }}>MC</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px", textAlign: "left" }}>
                    <strong style={{ fontSize: "15px", color: "#ffffff", fontWeight: 700 }}>Mert Can</strong>
                    <span style={{ fontSize: "12px", color: "#ffd700", fontWeight: 600 }}>Google Yerel Rehber</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ color: "#f59e0b", fontSize: "13.5px", display: "flex", gap: "3px" }}>
                    <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                  </div>
                </div>
              </summary>
              <div className="home-review-body" style={{ padding: "16px 22px 22px", borderTop: "1px solid rgba(255, 255, 255, 0.08)", textAlign: "left" }}>
                <p style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: 1.75, fontStyle: "italic", marginBottom: "14px" }}>
                  "Akdeniz Üniversitesi'ne yürüme mesafesinde. Sınav haftası ve hafta sonları geceleri arkadaşlarla toplanıp LoL ve Valorant atıyoruz. Masalar geniş, koltuklar çok rahat ve internet hızı Antalya standartlarının çok üstünde."
                </p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "4px 12px", borderRadius: "20px", background: "rgba(16, 185, 129, 0.18)", border: "1px solid rgba(16, 185, 129, 0.35)", color: "#34d399" }}><i className="fa-solid fa-circle-check"></i> Doğrulanmış Müşteri</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "4px 12px", borderRadius: "20px", background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.12)", color: "#94a3b8" }}>Akdeniz Üni</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "4px 12px", borderRadius: "20px", background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.12)", color: "#94a3b8" }}>Valorant &amp; LoL</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "4px 12px", borderRadius: "20px", background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.12)", color: "#94a3b8" }}>Gece Paketi</span>
                </div>
              </div>
            </details>

            {/* Review 2 */}
            <details className="home-review-accordion" style={{ background: "rgba(18, 24, 38, 0.88)", border: "1px solid rgba(255, 215, 0, 0.25)", borderRadius: "18px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.35)" }}>
              <summary className="home-review-summary" style={{ padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", listStyle: "none", userSelect: "none", gap: "14px", background: "rgba(255, 255, 255, 0.02)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "linear-gradient(135deg, #ffd700, #b8860b)", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "14.5px", flexShrink: 0, boxShadow: "0 0 12px rgba(255,215,0,0.4)" }}>YA</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px", textAlign: "left" }}>
                    <strong style={{ fontSize: "15px", color: "#ffffff", fontWeight: 700 }}>Yiğit Aksoy</strong>
                    <span style={{ fontSize: "12px", color: "#ffd700", fontWeight: 600 }}>Espor Oyuncusu</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ color: "#f59e0b", fontSize: "13.5px", display: "flex", gap: "3px" }}>
                    <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                  </div>
                </div>
              </summary>
              <div className="home-review-body" style={{ padding: "16px 22px 22px", borderTop: "1px solid rgba(255, 255, 255, 0.08)", textAlign: "left" }}>
                <p style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: 1.75, fontStyle: "italic", marginBottom: "14px" }}>
                  "BenQ ZOWIE monitörler ve espor deneyimi muazzam. CS2 turnuva maçlarımızda sıfır gecikme aldık. Kafenin havalandırması ve ortamı tertemiz, çalışanlar da çok saygılı."
                </p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "4px 12px", borderRadius: "20px", background: "rgba(16, 185, 129, 0.18)", border: "1px solid rgba(16, 185, 129, 0.35)", color: "#34d399" }}><i className="fa-solid fa-circle-check"></i> Doğrulanmış Müşteri</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "4px 12px", borderRadius: "20px", background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.12)", color: "#94a3b8" }}>VIP Espor</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "4px 12px", borderRadius: "20px", background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.12)", color: "#94a3b8" }}>CS2 Turnuva</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "4px 12px", borderRadius: "20px", background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.12)", color: "#94a3b8" }}>0 Ping Fiber</span>
                </div>
              </div>
            </details>

            {/* Review 3 */}
            <details className="home-review-accordion" style={{ background: "rgba(18, 24, 38, 0.88)", border: "1px solid rgba(255, 215, 0, 0.25)", borderRadius: "18px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.35)" }}>
              <summary className="home-review-summary" style={{ padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", listStyle: "none", userSelect: "none", gap: "14px", background: "rgba(255, 255, 255, 0.02)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "linear-gradient(135deg, #ffd700, #b8860b)", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "14.5px", flexShrink: 0, boxShadow: "0 0 12px rgba(255,215,0,0.4)" }}>BK</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px", textAlign: "left" }}>
                    <strong style={{ fontSize: "15px", color: "#ffffff", fontWeight: 700 }}>Burak K.</strong>
                    <span style={{ fontSize: "12px", color: "#ffd700", fontWeight: 600 }}>Düzenli Ziyaretçi</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ color: "#f59e0b", fontSize: "13.5px", display: "flex", gap: "3px" }}>
                    <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                  </div>
                </div>
              </summary>
              <div className="home-review-body" style={{ padding: "16px 22px 22px", borderTop: "1px solid rgba(255, 255, 255, 0.08)", textAlign: "left" }}>
                <p style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: 1.75, fontStyle: "italic", marginBottom: "14px" }}>
                  "Online rezervasyon sistemi sayesinde kapıda sıra bekleme derdi bitti. Kaşarlı tostu ve soğuk kahveleri çok başarılı, Antalya'da gittiğim en temiz ve kaliteli gaming cafe."
                </p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "4px 12px", borderRadius: "20px", background: "rgba(16, 185, 129, 0.18)", border: "1px solid rgba(16, 185, 129, 0.35)", color: "#34d399" }}><i className="fa-solid fa-circle-check"></i> Doğrulanmış Müşteri</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "4px 12px", borderRadius: "20px", background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.12)", color: "#94a3b8" }}>Hızlı Rezervasyon</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "4px 12px", borderRadius: "20px", background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.12)", color: "#94a3b8" }}>Zengin Cafe</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "4px 12px", borderRadius: "20px", background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.12)", color: "#94a3b8" }}>Temiz Ortam</span>
                </div>
              </div>
            </details>

            {/* Review 4 */}
            <details className="home-review-accordion" style={{ background: "rgba(18, 24, 38, 0.88)", border: "1px solid rgba(255, 215, 0, 0.25)", borderRadius: "18px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.35)" }}>
              <summary className="home-review-summary" style={{ padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", listStyle: "none", userSelect: "none", gap: "14px", background: "rgba(255, 255, 255, 0.02)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "linear-gradient(135deg, #ffd700, #b8860b)", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "14.5px", flexShrink: 0, boxShadow: "0 0 12px rgba(255,215,0,0.4)" }}>OK</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px", textAlign: "left" }}>
                    <strong style={{ fontSize: "15px", color: "#ffffff", fontWeight: 700 }}>Oğuzhan Kaya</strong>
                    <span style={{ fontSize: "12px", color: "#ffd700", fontWeight: 600 }}>Gamer</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ color: "#f59e0b", fontSize: "13.5px", display: "flex", gap: "3px" }}>
                    <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                  </div>
                </div>
              </summary>
              <div className="home-review-body" style={{ padding: "16px 22px 22px", borderTop: "1px solid rgba(255, 255, 255, 0.08)", textAlign: "left" }}>
                <p style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: 1.75, fontStyle: "italic", marginBottom: "14px" }}>
                  "Ekipmanlar sıfır ve bakımlı, klavyeler ve fareler pırıl pırıl. 5 saatlik paket fiyatı da tam öğrenci dostu. Arkadaş grubuyla gelmek için Antalya'daki 1 numara mekan."
                </p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "4px 12px", borderRadius: "20px", background: "rgba(16, 185, 129, 0.18)", border: "1px solid rgba(16, 185, 129, 0.35)", color: "#34d399" }}><i className="fa-solid fa-circle-check"></i> Doğrulanmış Müşteri</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "4px 12px", borderRadius: "20px", background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.12)", color: "#94a3b8" }}>5 Saatlik Paket</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "4px 12px", borderRadius: "20px", background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.12)", color: "#94a3b8" }}>Pro Ekipman</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "4px 12px", borderRadius: "20px", background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.12)", color: "#94a3b8" }}>Grup Oyunu</span>
                </div>
              </div>
            </details>
          </div>
        </section>

        {/* FAQ ACCORDION SECTION */}
        <section className="home-section" id="sss" style={{ maxWidth: "820px", margin: "0 auto 80px", width: "min(820px, calc(100% - 32px))", textAlign: "center" }}>
          <div className="home-section-header" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: "32px" }}>
            <span className="home-section-tag" style={{ margin: "0 auto 12px" }}>
              <i className="fa-solid fa-circle-question"></i> Sıkça Sorulan Sorular
            </span>
            <h2 className="home-section-title" style={{ textAlign: "center", margin: "0 auto 10px" }}>Merak Edilenler</h2>
            <p className="home-section-desc" style={{ textAlign: "center", margin: "0 auto", maxWidth: "600px" }}>
              Rezervasyon, espor oyunları ve cafe hizmetlerimiz hakkında en çok sorulan sorular.
            </p>
          </div>

          <div className="home-faq-list" style={{ display: "flex", flexDirection: "column", gap: "14px", width: "100%", margin: "0 auto", textAlign: "left" }}>
            {/* Soru 1 */}
            <details className="home-faq-item" name="forza-faq-group">
              <summary className="home-faq-summary">
                <span className="home-faq-question-text">Rezervasyon yaptırdıktan sonra ne zaman gelmeliyim?</span>
                <span className="home-faq-icon" aria-hidden="true">
                  <i className="fa-solid fa-play"></i>
                </span>
              </summary>
              <div className="home-faq-body">
                Rezervasyon saatinizden yaklaşık 10-15 dakika önce kafemize gelmeniz yeterlidir. Görevli arkadaşımıza isim ve telefon numaranızı belirterek doğrudan yerinize geçebilirsiniz.
              </div>
            </details>

            {/* Soru 2 */}
            <details className="home-faq-item" name="forza-faq-group">
              <summary className="home-faq-summary">
                <span className="home-faq-question-text">Bilgisayarlarda hangi oyunlar ve programlar hazır?</span>
                <span className="home-faq-icon" aria-hidden="true">
                  <i className="fa-solid fa-play"></i>
                </span>
              </summary>
              <div className="home-faq-body">
                Valorant, CS2, League of Legends, GTA V, FC24 (FIFA), PUBG, Call of Duty Warzone, Apex Legends, Rust, Dota 2, R6 Siege ve Steam kütüphanesindeki yüzlerce oyun en son güncellemeleriyle hazır olarak yüklüdür.
              </div>
            </details>

            {/* Soru 3 */}
            <details className="home-faq-item" name="forza-faq-group">
              <summary className="home-faq-summary">
                <span className="home-faq-question-text">5 Saatlik ve Gün Boyu paketler nasıl çalışır?</span>
                <span className="home-faq-icon" aria-hidden="true">
                  <i className="fa-solid fa-play"></i>
                </span>
              </summary>
              <div className="home-faq-body">
                5 saatlik veya gün boyu paket satın aldığınızda, saatlik ücret yerine çok daha avantajlı indirimli fiyattan yararlanırsınız. Süreniz oturumunuzu açtığınız andan itibaren başlar.
              </div>
            </details>
          </div>
        </section>

        {/* LOCATION & QUICK CONTACT ACCORDION BANNER */}
        <section className="home-section" id="iletisim" style={{ maxWidth: "820px", margin: "0 auto 36px", width: "min(820px, calc(100% - 32px))", textAlign: "center" }}>
          <div className="home-contact-banner" style={{ background: "linear-gradient(135deg, rgba(255, 215, 0, 0.12) 0%, rgba(14, 165, 233, 0.08) 50%, rgba(18, 24, 38, 0.95) 100%)", border: "1px solid rgba(255, 215, 0, 0.35)", borderRadius: "28px", padding: "42px 32px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", width: "100%", boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(255, 215, 0, 0.1)", gap: "20px" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "linear-gradient(135deg, #ffd700, #b8860b)", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", boxShadow: "0 0 16px rgba(255,215,0,0.4)", margin: "0 auto 4px" }}>
              <i className="fa-solid fa-location-dot"></i>
            </div>

            <div className="home-contact-info" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", width: "100%" }}>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(22px, 3.5vw, 28px)", fontWeight: 800, color: "#ffffff", marginBottom: "14px", textAlign: "center" }}>Forza Gaming &amp; İnternet Cafe'ye Bekleriz</h3>
              <p style={{ fontSize: "15px", color: "#cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "10px", textAlign: "center" }}>
                <i className="fa-solid fa-location-dot" style={{ color: "#ffd700", fontSize: "16px" }}></i> Kültür Mh. 3809 Sk. No:14 Kepez / Antalya
              </p>
              <p style={{ fontSize: "15px", color: "#cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "10px", textAlign: "center" }}>
                <i className="fa-solid fa-clock" style={{ color: "#ffd700", fontSize: "16px" }}></i> 7 Gün 24 Saat Kesintisiz Açık
              </p>
              <p style={{ fontSize: "15px", color: "#cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "6px", textAlign: "center" }}>
                <i className="fa-solid fa-phone" style={{ color: "#ffd700", fontSize: "16px" }}></i> 0 (546) 465 96 93
              </p>
            </div>

            <div className="home-contact-actions" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", flexWrap: "wrap", marginTop: "6px", width: "100%" }}>
              <a
                href="https://maps.google.com/?q=Forza+Internet+Cafe+Kepez+Antalya"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{ background: "rgba(255,255,255,0.12)", color: "#fff", padding: "14px 26px", borderRadius: "12px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "8px" }}
              >
                <i className="fa-solid fa-map-location-dot"></i> Haritada Aç &amp; Yol Tarifi
              </a>
              <a
                href="tel:05464659693"
                className="rzr-main"
                style={{ padding: "14px 30px", borderRadius: "12px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "8px" }}
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