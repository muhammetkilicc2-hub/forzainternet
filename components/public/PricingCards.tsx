import React, { useState, useEffect } from "react";
import { KampanyaFiyatlari } from "@/lib/types";
import { subscribeLiveUpdate } from "@/lib/liveSync";
import { FORZA_PHONE, FORZA_MAPS_LINK } from "@/lib/constants";

export default function PricingCards({ isMini = false }: { isMini?: boolean }) {
  const [pricing, setPricing] = useState<KampanyaFiyatlari | null>(null);

  useEffect(() => {
    async function fetchPricing() {
      try {
        const raw = localStorage.getItem("forzaFiyatlar");
        if (raw) setPricing(JSON.parse(raw));

        const res = await fetch("/api/pricing", { cache: "no-store" });
        const data = await res.json();
        if (data.pricing) {
          setPricing(data.pricing);
          localStorage.setItem("forzaFiyatlar", JSON.stringify(data.pricing));
        }
      } catch (e) {}
    }
    fetchPricing();

    const unsub = subscribeLiveUpdate("pricing", (updated) => {
      if (updated) setPricing(updated);
    });
    return () => unsub();
  }, []);

  const trackPhoneClick = () => {
    fetch("/api/analytics", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "click", type: "phone" }) }).catch(() => {});
  };
  const trackMapClick = () => {
    fetch("/api/analytics", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "click", type: "map" }) }).catch(() => {});
  };

  if (!pricing) return null;

  return (
    <>
      <style>{`
        .btn-sari {
          background: linear-gradient(135deg, rgba(148, 163, 184, 0.1), rgba(148, 163, 184, 0.05));
          color: #cbd5e1;
          font-weight: 700;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid rgba(148, 163, 184, 0.2);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          transition: all 0.2s;
          flex: 1;
        }
        .btn-sari:hover {
          background: rgba(148, 163, 184, 0.2);
          border-color: rgba(148, 163, 184, 0.4);
        }
        .btn-mavi {
          background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(251, 191, 36, 0.05));
          color: #fbbf24;
          font-weight: 700;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid rgba(251, 191, 36, 0.2);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          transition: all 0.2s;
          flex: 1;
        }
        .btn-mavi:hover {
          background: rgba(251, 191, 36, 0.2);
          border-color: rgba(251, 191, 36, 0.4);
        }
        .btn-yesil {
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(168, 85, 247, 0.05));
          color: #c084fc;
          font-weight: 700;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid rgba(168, 85, 247, 0.2);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          transition: all 0.2s;
          flex: 1;
        }
        .btn-yesil:hover {
          background: rgba(168, 85, 247, 0.2);
          border-color: rgba(168, 85, 247, 0.4);
        }
        .action-buttons {
          display: flex;
          gap: 12px;
          margin-top: auto;
        }
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 80px;
          text-align: left;
        }
        @media (max-width: 992px) {
          .pricing-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          }
        }
        @media (max-width: 768px) {
          .pricing-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <div className="pricing-grid">
        
        {/* SARI MASA */}
        <div style={{ background: "linear-gradient(145deg, rgba(20, 25, 35, 0.95) 0%, rgba(30, 25, 10, 0.95) 100%)", border: "1px solid rgba(148, 163, 184, 0.6)", borderRadius: "24px", padding: "32px 28px", boxShadow: "0 10px 40px rgba(148, 163, 184, 0.15)", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "22px", color: "#f1f5f9", fontWeight: 800, margin: 0, display: "flex", alignItems: "center", gap: "12px" }}>
              Silver Masalar
            </h3>
            <span style={{ fontSize: "12px", fontWeight: 800, padding: "4px 12px", borderRadius: "12px", background: "rgba(148, 163, 184, 0.15)", color: "#cbd5e1", border: "1px solid rgba(148, 163, 184, 0.35)" }}>STANDART</span>
          </div>
          <div style={{ position: "absolute", top: "-50px", left: "-50px", width: "150px", height: "150px", background: "radial-gradient(circle, rgba(148, 163, 184, 0.15) 0%, rgba(148, 163, 184, 0) 70%)", borderRadius: "50%", pointerEvents: "none" }}></div>
          
          {!isMini && <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px 0", display: "flex", flexDirection: "column", gap: "10px" }}>
            <li style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#cbd5e1" }}>
              <i className="fa-solid fa-microchip" style={{ color: "#cbd5e1", width: "16px" }}></i> Nvidia RTX 3060 & Intel i5
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#cbd5e1" }}>
              <i className="fa-solid fa-desktop" style={{ color: "#cbd5e1", width: "16px" }}></i> 144 Hz Oyuncu Monitörü
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#cbd5e1" }}>
              <i className="fa-solid fa-gamepad" style={{ color: "#cbd5e1", width: "16px" }}></i> Ana Salon Deneyimi
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#cbd5e1" }}>
              <i className="fa-solid fa-headset" style={{ color: "#cbd5e1", width: "16px" }}></i> 7.1 Surround Kulaklık
            </li>
          </ul>}

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px", marginTop: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13.5px", color: "#cbd5e1" }}>Saatlik Ücret</span>
              <strong style={{ fontSize: "16px", fontWeight: 900, color: "#ffffff", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", padding: "4px 12px", borderRadius: "20px" }}>₺{pricing.sari.saatlik} <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 500 }}>/ saat</span></strong>
            </div>
            {!isMini && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13.5px", color: "#cbd5e1" }}>5 Saatlik Paket</span>
                  <strong style={{ fontSize: "18px", fontWeight: 900, color: "#cbd5e1", background: "rgba(148, 163, 184, 0.15)", border: "1px solid rgba(148, 163, 184, 0.4)", padding: "4px 14px", borderRadius: "20px", boxShadow: "0 2px 10px rgba(148, 163, 184, 0.2)" }}>₺{pricing.sari.besSaatlik}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13.5px", color: "#cbd5e1" }}>24 Saatlik Paket</span>
                  <strong style={{ fontSize: "18px", fontWeight: 900, color: "#cbd5e1", background: "rgba(148, 163, 184, 0.15)", border: "1px solid rgba(148, 163, 184, 0.4)", padding: "4px 14px", borderRadius: "20px", boxShadow: "0 2px 10px rgba(148, 163, 184, 0.2)" }}>₺{pricing.sari.gunluk}</strong>
                </div>
              </>
            )}
          </div>
          <div className="action-buttons">
            {isMini ? (
              <a href="/ozellikler" className="btn-sari" style={{ width: "100%", justifyContent: "center" }} title="Tüm Özellikleri İncele">
                <i className="fa-solid fa-bolt"></i> Tüm Özellikleri İncele
              </a>
            ) : (
              <>
                <a onClick={trackMapClick} href={FORZA_MAPS_LINK} target="_blank" rel="noopener noreferrer" className="btn-sari" title="Haritada Aç">
                  <i className="fa-solid fa-location-dot"></i> Yol Tarifi
                </a>
                <a onClick={trackPhoneClick} href={`tel:${FORZA_PHONE}`} className="btn-sari" title="Hemen Ara">
                  <i className="fa-solid fa-phone"></i> Bizi Ara
                </a>
              </>
            )}
          </div>
        </div>

        {/* MAVI MASA */}
        <div style={{ background: "linear-gradient(145deg, rgba(20, 25, 35, 0.95) 0%, rgba(10, 25, 40, 0.95) 100%)", border: "1px solid rgba(251, 191, 36, 0.6)", borderRadius: "24px", padding: "32px 28px", boxShadow: "0 10px 40px rgba(251, 191, 36, 0.15)", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "22px", color: "#f1f5f9", fontWeight: 800, margin: 0, display: "flex", alignItems: "center", gap: "12px" }}>
              Gold Pro Masalar
            </h3>
            <span style={{ fontSize: "12px", fontWeight: 800, padding: "4px 12px", borderRadius: "12px", background: "rgba(251, 191, 36, 0.15)", color: "#fbbf24", border: "1px solid rgba(251, 191, 36, 0.35)" }}>PREMIUM</span>
          </div>
          <div style={{ position: "absolute", top: "-50px", left: "-50px", width: "150px", height: "150px", background: "radial-gradient(circle, rgba(251, 191, 36, 0.2) 0%, rgba(251, 191, 36, 0) 70%)", borderRadius: "50%", pointerEvents: "none" }}></div>
          
          {!isMini && <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px 0", display: "flex", flexDirection: "column", gap: "10px" }}>
            <li style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#cbd5e1" }}>
              <i className="fa-solid fa-microchip" style={{ color: "#fbbf24", width: "16px" }}></i> Nvidia RTX 3060 Ti & Intel i7
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#cbd5e1" }}>
              <i className="fa-solid fa-desktop" style={{ color: "#fbbf24", width: "16px" }}></i> 240 Hz Fast IPS Monitör
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#cbd5e1" }}>
              <i className="fa-solid fa-chair" style={{ color: "#fbbf24", width: "16px" }}></i> Profesyonel Oyuncu Koltuğu
            </li>
          </ul>}

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px", marginTop: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13.5px", color: "#cbd5e1" }}>Saatlik Ücret</span>
              <strong style={{ fontSize: "16px", fontWeight: 900, color: "#ffffff", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", padding: "4px 12px", borderRadius: "20px" }}>₺{pricing.mavi.saatlik} <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 500 }}>/ saat</span></strong>
            </div>
            {!isMini && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13.5px", color: "#cbd5e1" }}>5 Saatlik Paket</span>
                  <strong style={{ fontSize: "18px", fontWeight: 900, color: "#fbbf24", background: "rgba(251, 191, 36, 0.15)", border: "1px solid rgba(251, 191, 36, 0.4)", padding: "4px 14px", borderRadius: "20px", boxShadow: "0 2px 10px rgba(251, 191, 36, 0.2)" }}>₺{pricing.mavi.besSaatlik}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13.5px", color: "#cbd5e1" }}>24 Saatlik Paket</span>
                  <strong style={{ fontSize: "18px", fontWeight: 900, color: "#fbbf24", background: "rgba(251, 191, 36, 0.15)", border: "1px solid rgba(251, 191, 36, 0.4)", padding: "4px 14px", borderRadius: "20px", boxShadow: "0 2px 10px rgba(251, 191, 36, 0.2)" }}>₺{pricing.mavi.gunluk}</strong>
                </div>
              </>
            )}
          </div>
          <div className="action-buttons">
            {isMini ? (
              <a href="/ozellikler" className="btn-mavi" style={{ width: "100%", justifyContent: "center" }} title="Tüm Özellikleri İncele">
                <i className="fa-solid fa-bolt"></i> Tüm Özellikleri İncele
              </a>
            ) : (
              <>
                <a onClick={trackMapClick} href={FORZA_MAPS_LINK} target="_blank" rel="noopener noreferrer" className="btn-mavi" title="Haritada Aç">
                  <i className="fa-solid fa-location-dot"></i> Yol Tarifi
                </a>
                <a onClick={trackPhoneClick} href={`tel:${FORZA_PHONE}`} className="btn-mavi" title="Hemen Ara">
                  <i className="fa-solid fa-phone"></i> Bizi Ara
                </a>
              </>
            )}
          </div>
        </div>

        {/* YESIL MASA */}
        <div style={{ background: "linear-gradient(145deg, rgba(20, 25, 35, 0.95) 0%, rgba(10, 30, 20, 0.95) 100%)", border: "2px solid rgba(168, 85, 247, 0.7)", borderRadius: "24px", padding: "32px 28px", boxShadow: "0 10px 50px rgba(168, 85, 247, 0.2)", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ position: "absolute", top: "12px", right: "12px", background: "linear-gradient(135deg, #9333ea, #7e22ce)", color: "#ffffff", padding: "5px 14px", borderRadius: "20px", fontSize: "11px", fontWeight: 800, zIndex: 10, boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)" }}>⭐ EN POPÜLER</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "22px", color: "#f1f5f9", fontWeight: 800, margin: 0, display: "flex", alignItems: "center", gap: "12px" }}>
              Platinum Masalar
            </h3>
            <span style={{ fontSize: "12px", fontWeight: 800, padding: "4px 12px", borderRadius: "12px", background: "rgba(168, 85, 247, 0.15)", color: "#c084fc", border: "1px solid rgba(168, 85, 247, 0.35)" }}>ULTRA VIP ESPOR</span>
          </div>
          <div style={{ position: "absolute", top: "-50px", left: "-50px", width: "150px", height: "150px", background: "radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, rgba(168, 85, 247, 0) 70%)", borderRadius: "50%", pointerEvents: "none" }}></div>
          
          {!isMini && <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px 0", display: "flex", flexDirection: "column", gap: "10px" }}>
            <li style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#cbd5e1" }}>
              <i className="fa-solid fa-microchip" style={{ color: "#c084fc", width: "16px" }}></i> Nvidia RTX 4070 Ti & i9
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#cbd5e1" }}>
              <i className="fa-solid fa-desktop" style={{ color: "#c084fc", width: "16px" }}></i> 360 Hz Espor Turnuva Monitörü
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#cbd5e1" }}>
              <i className="fa-solid fa-crown" style={{ color: "#c084fc", width: "16px" }}></i> Özel VIP Turnuva Odası
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#cbd5e1" }}>
              <i className="fa-solid fa-temperature-arrow-down" style={{ color: "#c084fc", width: "16px" }}></i> Sıvı Soğutma Sistemi
            </li>
          </ul>}

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px", marginTop: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13.5px", color: "#cbd5e1" }}>Saatlik Ücret</span>
              <strong style={{ fontSize: "16px", fontWeight: 900, color: "#ffffff", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", padding: "4px 12px", borderRadius: "20px" }}>₺{pricing.yesil.saatlik} <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 500 }}>/ saat</span></strong>
            </div>
            {!isMini && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13.5px", color: "#cbd5e1" }}>5 Saatlik Paket</span>
                  <strong style={{ fontSize: "18px", fontWeight: 900, color: "#c084fc", background: "rgba(168, 85, 247, 0.15)", border: "1px solid rgba(168, 85, 247, 0.4)", padding: "4px 14px", borderRadius: "20px", boxShadow: "0 2px 10px rgba(168, 85, 247, 0.2)" }}>₺{pricing.yesil.besSaatlik}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13.5px", color: "#cbd5e1" }}>24 Saatlik Paket</span>
                  <strong style={{ fontSize: "18px", fontWeight: 900, color: "#c084fc", background: "rgba(168, 85, 247, 0.15)", border: "1px solid rgba(168, 85, 247, 0.4)", padding: "4px 14px", borderRadius: "20px", boxShadow: "0 2px 10px rgba(168, 85, 247, 0.2)" }}>₺{pricing.yesil.gunluk}</strong>
                </div>
              </>
            )}
          </div>
          <div className="action-buttons">
            {isMini ? (
              <a href="/ozellikler" className="btn-yesil" style={{ width: "100%", justifyContent: "center" }} title="Tüm Özellikleri İncele">
                <i className="fa-solid fa-bolt"></i> Tüm Özellikleri İncele
              </a>
            ) : (
              <>
                <a onClick={trackMapClick} href={FORZA_MAPS_LINK} target="_blank" rel="noopener noreferrer" className="btn-yesil" title="Haritada Aç">
                  <i className="fa-solid fa-location-dot"></i> Yol Tarifi
                </a>
                <a onClick={trackPhoneClick} href={`tel:${FORZA_PHONE}`} className="btn-yesil" title="Hemen Ara">
                  <i className="fa-solid fa-phone"></i> Bizi Ara
                </a>
              </>
            )}
          </div>
        </div>

      </div>
    </>
  );
}
