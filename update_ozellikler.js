const fs = require('fs');
let content = fs.readFileSync('app/ozellikler/page.tsx', 'utf8');

const importStatement = import React, { useEffect, useState } from "react";;
content = content.replace(/import React from "react";/, importStatement);

const stateAndFetch = 
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
;

content = content.replace(/export default function OzelliklerPage\(\) \{/, 'export default function OzelliklerPage() {' + stateAndFetch);

const pricingSection = 
          {/* DETAILED PRICING CARDS */}
          <div style={{ textAlign: "center", marginBottom: "40px", marginTop: "40px" }}>
            <h2 style={{ fontSize: "32px", color: "#fff", marginBottom: "16px" }}>Detaylı Masa Fiyatları & Paketler</h2>
            <p style={{ color: "#cbd5e1", fontSize: "16px", maxWidth: "600px", margin: "0 auto" }}>Süreli peşin ödemeli oturumlarda geçerlidir!!! Para iadesi yoktur.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginBottom: "80px" }}>
            
            {/* SARI MASA */}
            <div style={{ background: "rgba(14, 18, 26, 0.88)", border: "1px solid rgba(255, 215, 0, 0.35)", borderRadius: "24px", padding: "28px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <span style={{ fontSize: "12px", fontWeight: 800, padding: "4px 12px", borderRadius: "12px", background: "rgba(255, 215, 0, 0.15)", color: "#ffd700", border: "1px solid rgba(255, 215, 0, 0.35)" }}>STANDART GAMING</span>
              </div>
              <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#ffffff", marginBottom: "16px" }}>Sarı Masalar</h3>
              
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
                  <span style={{ fontSize: "13.5px", color: "#cbd5e1" }}>24 Saatlik Paket</span>
                  <strong style={{ fontSize: "18px", color: "#ffd700", fontWeight: 800 }}>₺{pricing.sari.gunluk}</strong>
                </div>
              </div>
              <p style={{ fontSize: "12px", color: "#94a3b8", textAlign: "center" }}>* 60 TL Masa</p>
            </div>

            {/* MAVI MASA */}
            <div style={{ background: "rgba(14, 18, 26, 0.88)", border: "1px solid rgba(56, 189, 248, 0.35)", borderRadius: "24px", padding: "28px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <span style={{ fontSize: "12px", fontWeight: 800, padding: "4px 12px", borderRadius: "12px", background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", border: "1px solid rgba(56, 189, 248, 0.35)" }}>PRO ESPOR GAMING</span>
              </div>
              <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#ffffff", marginBottom: "16px" }}>Mavi Masalar</h3>
              
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
                  <span style={{ fontSize: "13.5px", color: "#cbd5e1" }}>10 Saatlik Paket</span>
                  <strong style={{ fontSize: "18px", color: "#38bdf8", fontWeight: 800 }}>₺{pricing.mavi.onSaatlik || 450}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13.5px", color: "#cbd5e1" }}>24 Saatlik Paket</span>
                  <strong style={{ fontSize: "18px", color: "#38bdf8", fontWeight: 800 }}>₺{pricing.mavi.gunluk}</strong>
                </div>
              </div>
              <p style={{ fontSize: "12px", color: "#94a3b8", textAlign: "center" }}>* 70 TL Masa</p>
            </div>

            {/* YESIL MASA */}
            <div style={{ background: "rgba(14, 18, 26, 0.88)", border: "2px solid rgba(52, 211, 153, 0.45)", borderRadius: "24px", padding: "28px 24px", position: "relative" }}>
              <div style={{ position: "absolute", top: "-13px", right: "24px", background: "linear-gradient(135deg, #10b981, #059669)", color: "#ffffff", padding: "3px 12px", borderRadius: "12px", fontSize: "11px", fontWeight: 800 }}>⭐ EN POPÜLER</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <span style={{ fontSize: "12px", fontWeight: 800, padding: "4px 12px", borderRadius: "12px", background: "rgba(52, 211, 153, 0.15)", color: "#34d399", border: "1px solid rgba(52, 211, 153, 0.35)" }}>ULTRA VIP ESPOR</span>
              </div>
              <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#ffffff", marginBottom: "16px" }}>Yeşil Masalar</h3>
              
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
                  <span style={{ fontSize: "13.5px", color: "#cbd5e1" }}>10 Saatlik Paket</span>
                  <strong style={{ fontSize: "18px", color: "#34d399", fontWeight: 800 }}>₺{pricing.yesil.onSaatlik || 650}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13.5px", color: "#cbd5e1" }}>24 Saatlik Paket</span>
                  <strong style={{ fontSize: "18px", color: "#34d399", fontWeight: 800 }}>₺{pricing.yesil.gunluk}</strong>
                </div>
              </div>
              <p style={{ fontSize: "12px", color: "#94a3b8", textAlign: "center" }}>* 90 TL Masa (Özel VIP Oda)</p>
            </div>

          </div>
;

content = content.replace(/<div style={{ \n            background: "linear-gradient/, pricingSection + '\n          <div style={{ \n            background: "linear-gradient');

fs.writeFileSync('app/ozellikler/page.tsx', content);
