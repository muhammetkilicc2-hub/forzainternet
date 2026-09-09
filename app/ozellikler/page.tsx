"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppWidget from "@/components/public/WhatsAppWidget";
import Link from "next/link";

export default function OzelliklerPage() {
  const [pricing, setPricing] = useState({
    sari: { saatlik: 60, besSaatlik: 200, onSaatlik: 0, gunluk: 400 },
    mavi: { saatlik: 70, besSaatlik: 250, onSaatlik: 450, gunluk: 950 },
    yesil: { saatlik: 90, besSaatlik: 350, onSaatlik: 650, gunluk: 1200 },
  });

  useEffect(() => {
    fetch("/api/pricing")
      .then(res => res.json())
      .then(data => {
        if(data && data.sari) setPricing(data);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "120px", paddingBottom: "80px", minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
        
        <div style={{ maxWidth: "1000px", width: "100%", padding: "0 20px" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: "8px", 
              background: "rgba(255, 215, 0, 0.1)", 
              border: "1px solid rgba(255, 215, 0, 0.3)", 
              padding: "6px 14px", 
              borderRadius: "20px", 
              color: "#ffd700", 
              fontSize: "13px", 
              fontWeight: 700,
              marginBottom: "16px"
            }}>
              <i className="fa-solid fa-microchip"></i> Sistem Özellikleri
            </span>
            <h1 style={{ fontFamily: "'Racing Sans One', sans-serif", fontSize: "clamp(32px, 5vw, 48px)", color: "#ffffff", margin: "0 0 16px 0", letterSpacing: "1px", lineHeight: 1.1 }}>
              BİLGİSAYAR ÖZELLİKLERİ VE FİYATLAR
            </h1>
            <p style={{ fontSize: "16px", color: "#cbd5e1", lineHeight: 1.7, maxWidth: "700px", margin: "0 auto" }}>
              Kafemizdeki masaların donanım özelliklerini ve detaylı fiyat paketlerini aşağıdan inceleyebilirsiniz. Süreli peşin ödemeli oturumlarda geçerlidir.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginBottom: "80px" }}>
            
            {/* SARI MASA */}
            <div style={{ background: "rgba(14, 18, 26, 0.88)", border: "1px solid rgba(255, 215, 0, 0.35)", borderRadius: "24px", padding: "28px 24px", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <span style={{ fontSize: "12px", fontWeight: 800, padding: "4px 12px", borderRadius: "12px", background: "rgba(255, 215, 0, 0.15)", color: "#ffd700", border: "1px solid rgba(255, 215, 0, 0.35)" }}>STANDART GAMING</span>
              </div>
              <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#ffffff", marginBottom: "6px" }}>Sarı Masalar</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px 0", display: "flex", flexDirection: "column", gap: "10px" }}>
                <li style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#cbd5e1" }}>
                  <i className="fa-solid fa-microchip" style={{ color: "#ffd700", width: "16px" }}></i> Nvidia RTX 3060 & Intel i5
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#cbd5e1" }}>
                  <i className="fa-solid fa-memory" style={{ color: "#ffd700", width: "16px" }}></i> 16GB DDR4 Yüksek Hızlı RAM
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#cbd5e1" }}>
                  <i className="fa-solid fa-desktop" style={{ color: "#ffd700", width: "16px" }}></i> 144Hz Espor Monitör
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#cbd5e1" }}>
                  <i className="fa-solid fa-wifi" style={{ color: "#ffd700", width: "16px" }}></i> 1000 Mbps Fiber İnternet
                </li>
              </ul>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "16px", background: "rgba(255, 255, 255, 0.03)", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.06)", flexGrow: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13.5px", color: "#cbd5e1" }}>Saatlik Ücret</span>
                  <strong style={{ fontSize: "18px", color: "#ffffff", fontWeight: 800 }}>₺{pricing.sari.saatlik} <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 500 }}>/ saat</span></strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13.5px", color: "#cbd5e1" }}>5 Saatlik Paket</span>
                  <strong style={{ fontSize: "18px", color: "#ffd700", fontWeight: 800 }}>₺{pricing.sari.besSaatlik}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13.5px", color: "#cbd5e1" }}>24 Saatlik Paket</span>
                  <strong style={{ fontSize: "18px", color: "#ffd700", fontWeight: 800 }}>₺{pricing.sari.gunluk}</strong>
                </div>
              </div>
              <a href="tel:05464659693" className="primary-btn" style={{ width: "100%", textAlign: "center", textDecoration: "none", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "16px", background: "linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0.05))", color: "#ffd700", border: "1px solid rgba(255, 215, 0, 0.3)" }}>
                <i className="fa-solid fa-phone"></i> Hemen Bizi Ara
              </a>
            </div>

            {/* MAVI MASA */}
            <div style={{ background: "rgba(14, 18, 26, 0.88)", border: "1px solid rgba(56, 189, 248, 0.35)", borderRadius: "24px", padding: "28px 24px", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <span style={{ fontSize: "12px", fontWeight: 800, padding: "4px 12px", borderRadius: "12px", background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", border: "1px solid rgba(56, 189, 248, 0.35)" }}>PRO ESPOR GAMING</span>
              </div>
              <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#ffffff", marginBottom: "6px" }}>Mavi Masalar</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px 0", display: "flex", flexDirection: "column", gap: "10px" }}>
                <li style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#cbd5e1" }}>
                  <i className="fa-solid fa-microchip" style={{ color: "#38bdf8", width: "16px" }}></i> RTX 3060 OC & Intel i5 Gaming
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#cbd5e1" }}>
                  <i className="fa-solid fa-memory" style={{ color: "#38bdf8", width: "16px" }}></i> 16GB DDR4 Yüksek Hızlı RAM
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#cbd5e1" }}>
                  <i className="fa-solid fa-desktop" style={{ color: "#38bdf8", width: "16px" }}></i> 240Hz Espor Monitörü
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#cbd5e1" }}>
                  <i className="fa-solid fa-headphones" style={{ color: "#38bdf8", width: "16px" }}></i> Pro Espor Ekipmanları
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#cbd5e1" }}>
                  <i className="fa-solid fa-wifi" style={{ color: "#38bdf8", width: "16px" }}></i> 1000 Mbps Fiber İnternet
                </li>
              </ul>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "16px", background: "rgba(255, 255, 255, 0.03)", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.06)", flexGrow: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13.5px", color: "#cbd5e1" }}>Saatlik Ücret</span>
                  <strong style={{ fontSize: "18px", color: "#ffffff", fontWeight: 800 }}>₺{pricing.mavi.saatlik} <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 500 }}>/ saat</span></strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13.5px", color: "#cbd5e1" }}>5 Saatlik Paket</span>
                  <strong style={{ fontSize: "18px", color: "#38bdf8", fontWeight: 800 }}>₺{pricing.mavi.besSaatlik}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13.5px", color: "#cbd5e1" }}>10 Saatlik Paket</span>
                  <strong style={{ fontSize: "18px", color: "#38bdf8", fontWeight: 800 }}>₺{pricing.mavi.onSaatlik || 450}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13.5px", color: "#cbd5e1" }}>24 Saatlik Paket</span>
                  <strong style={{ fontSize: "18px", color: "#38bdf8", fontWeight: 800 }}>₺{pricing.mavi.gunluk}</strong>
                </div>
              </div>
              <a href="tel:05464659693" className="primary-btn" style={{ width: "100%", textAlign: "center", textDecoration: "none", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "16px", background: "linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(56, 189, 248, 0.05))", color: "#38bdf8", border: "1px solid rgba(56, 189, 248, 0.3)" }}>
                <i className="fa-solid fa-phone"></i> Hemen Bizi Ara
              </a>
            </div>

            {/* YESIL MASA */}
            <div style={{ background: "rgba(14, 18, 26, 0.88)", border: "2px solid rgba(52, 211, 153, 0.45)", borderRadius: "24px", padding: "28px 24px", position: "relative", display: "flex", flexDirection: "column" }}>
              <div style={{ position: "absolute", top: "-13px", right: "24px", background: "linear-gradient(135deg, #10b981, #059669)", color: "#ffffff", padding: "3px 12px", borderRadius: "12px", fontSize: "11px", fontWeight: 800 }}>⭐ EN POPÜLER</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <span style={{ fontSize: "12px", fontWeight: 800, padding: "4px 12px", borderRadius: "12px", background: "rgba(52, 211, 153, 0.15)", color: "#34d399", border: "1px solid rgba(52, 211, 153, 0.35)" }}>ULTRA VIP ESPOR</span>
              </div>
              <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#ffffff", marginBottom: "6px" }}>Yeşil Masalar</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px 0", display: "flex", flexDirection: "column", gap: "10px" }}>
                <li style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#cbd5e1" }}>
                  <i className="fa-solid fa-microchip" style={{ color: "#34d399", width: "16px" }}></i> RTX 3070 Ti / 5060 & Ryzen 7
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#cbd5e1" }}>
                  <i className="fa-solid fa-memory" style={{ color: "#34d399", width: "16px" }}></i> 32GB DDR5 Yüksek Frekans RAM
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#cbd5e1" }}>
                  <i className="fa-solid fa-desktop" style={{ color: "#34d399", width: "16px" }}></i> 540Hz Espor Turnuva Monitörü
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#cbd5e1" }}>
                  <i className="fa-solid fa-crown" style={{ color: "#34d399", width: "16px" }}></i> Özel VIP Turnuva Odası
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#cbd5e1" }}>
                  <i className="fa-solid fa-wifi" style={{ color: "#34d399", width: "16px" }}></i> 1000 Mbps Fiber İnternet
                </li>
              </ul>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "16px", background: "rgba(255, 255, 255, 0.03)", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.06)", flexGrow: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13.5px", color: "#cbd5e1" }}>Saatlik Ücret</span>
                  <strong style={{ fontSize: "18px", color: "#ffffff", fontWeight: 800 }}>₺{pricing.yesil.saatlik} <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 500 }}>/ saat</span></strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13.5px", color: "#cbd5e1" }}>5 Saatlik Paket</span>
                  <strong style={{ fontSize: "18px", color: "#34d399", fontWeight: 800 }}>₺{pricing.yesil.besSaatlik}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13.5px", color: "#cbd5e1" }}>10 Saatlik Paket</span>
                  <strong style={{ fontSize: "18px", color: "#34d399", fontWeight: 800 }}>₺{pricing.yesil.onSaatlik || 650}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13.5px", color: "#cbd5e1" }}>24 Saatlik Paket</span>
                  <strong style={{ fontSize: "18px", color: "#34d399", fontWeight: 800 }}>₺{pricing.yesil.gunluk}</strong>
                </div>
              </div>
              <a href="tel:05464659693" className="primary-btn" style={{ width: "100%", textAlign: "center", textDecoration: "none", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "16px", background: "linear-gradient(135deg, rgba(52, 211, 153, 0.1), rgba(52, 211, 153, 0.05))", color: "#34d399", border: "1px solid rgba(52, 211, 153, 0.3)" }}>
                <i className="fa-solid fa-phone"></i> Hemen Bizi Ara
              </a>
            </div>

          </div>

          <div style={{ 
            background: "linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(18, 24, 38, 0.8) 100%)",
            border: "1px solid rgba(255, 215, 0, 0.25)",
            borderRadius: "24px",
            padding: "40px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px"
          }}>
            <div>
              <h2 style={{ fontSize: "24px", color: "#fff", marginBottom: "12px" }}>Hemen Bize Ulaşın</h2>
              <p style={{ color: "#cbd5e1", fontSize: "15px", maxWidth: "500px", margin: "0 auto" }}>
                Grup rezervasyonları, turnuva organizasyonları veya yer durumu hakkında bilgi almak için bizimle iletişime geçin.
              </p>
            </div>
            
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="https://maps.google.com/?q=Forza+Internet+Cafe+Kepez+Antalya" target="_blank" rel="noopener noreferrer" className="primary-btn" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px", background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", padding: "16px 28px", fontSize: "16px" }}>
                <i className="fa-solid fa-map-location-dot" aria-hidden="true"></i>
                Yol Tarifi Al
              </a>
              <a href="tel:05464659693" className="primary-btn" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px", padding: "16px 28px", fontSize: "16px" }}>
                <i className="fa-solid fa-phone" aria-hidden="true"></i>
                Hemen Bizi Ara
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppWidget />
    </>
  );
}
