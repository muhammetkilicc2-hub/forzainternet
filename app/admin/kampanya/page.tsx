"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/components/admin/Toast";
import { PricingConfig, PcKategori } from "@/lib/types";
import { Clock, Zap, SunMedium, Save, Sparkles, CheckCircle2, Monitor, Cpu } from "lucide-react";

export default function KampanyaManagementPage() {
  const { showToast } = useToast();
  const [pricing, setPricing] = useState<PricingConfig>({
    sari: { saatlik: 60, besSaatlik: 200, gunluk: 400 },
    mavi: { saatlik: 70, besSaatlik: 250, gunluk: 500 },
    yesil: { saatlik: 90, besSaatlik: 350, gunluk: 700 },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadPricing() {
      try {
        const res = await fetch("/api/pricing", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.pricing) {
            setPricing(data.pricing);
          }
        }
      } catch (err) {
        console.error("Fiyatlar yüklenemedi:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPricing();
  }, []);

  const handlePriceChange = (kategori: PcKategori, field: "saatlik" | "besSaatlik" | "gunluk", value: number) => {
    setPricing((prev) => ({
      ...prev,
      [kategori]: {
        ...prev[kategori],
        [field]: value,
      },
    }));
  };

  const handleSave = async (kategori?: PcKategori) => {
    setSaving(true);
    try {
      const res = await fetch("/api/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pricing }),
      });

      if (res.ok) {
        try {
          localStorage.setItem("forzaFiyatlar", JSON.stringify(pricing));
          window.dispatchEvent(new CustomEvent("forzaFiyatlarGuncellendi", { detail: pricing }));
          window.dispatchEvent(new Event("storage"));
        } catch (e) {}

        showToast(
          "Fiyatlar Güncellendi 🎉",
          kategori ? `${kategori.toUpperCase()} masa fiyatları kaydedildi.` : "Tüm fiyat tarifeleri güncellendi.",
          "success"
        );
      }
    } catch {
      showToast("Hata", "Fiyatlar kaydedilemedi", "error");
    } finally {
      setSaving(false);
    }
  };

  const categories: {
    id: PcKategori;
    badgeName: string;
    hzTag: string;
    title: string;
    subtitle: string;
    specs: string[];
  }[] = [
    {
      id: "sari",
      badgeName: "STANDART GAMING",
      hzTag: "144 Hz Espor Ekran",
      title: "Sarı Masalar",
      subtitle: "144 Hz Espor Ekran • RTX 3060 • Intel i5 • 16 GB RAM",
      specs: [
        "144 Hz Gaming Espor Monitör",
        "Nvidia GeForce RTX 3060",
        "Intel Core i5 Yüksek Performans",
        "16 GB DDR4 Yüksek Hızlı RAM",
      ],
    },
    {
      id: "mavi",
      badgeName: "PRO ESPOR GAMING",
      hzTag: "240 Hz Espor Ekran",
      title: "Mavi Masalar",
      subtitle: "240 Hz Espor Ekran • RTX 3060 OC • Intel i5 • 16 GB RAM",
      specs: [
        "240 Hz Ultra Espor Monitör",
        "Nvidia GeForce RTX 3060 OC",
        "Intel Core i5 Gaming İşlemci",
        "16 GB DDR4 Yüksek Hızlı RAM",
      ],
    },
    {
      id: "yesil",
      badgeName: "ULTRA VIP ESPOR",
      hzTag: "360 – 540 Hz Espor",
      title: "Yeşil Masalar (VIP)",
      subtitle: "360-540 Hz Turnuva Ekranı • RTX 3070 Ti / 5060 • Ryzen 7 7800X3D • 32 GB DDR5",
      specs: [
        "360-540 Hz Turnuva Monitörü",
        "RTX 3070 Ti / RTX 5060",
        "AMD Ryzen 7 7800X3D Canavarı",
        "32 GB DDR5 Yüksek Frekans RAM",
      ],
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px", color: "#ffffff", fontSize: "15px" }}>
        Fiyat tarifeleri yükleniyor...
      </div>
    );
  }

  return (
    <main className="dashboard-content" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Top Action Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          width: "100%",
        }}
      >
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#ffffff", margin: 0, letterSpacing: "-0.3px" }}>
            Fiyat &amp; Kampanya Yönetimi
          </h1>
          <span style={{ fontSize: "13px", color: "#cbd5e1", marginTop: "4px", display: "block" }}>
            Masa kategorileri, saatlik ve süreli paket ücretlerini anlık olarak belirleyin
          </span>
        </div>

        <button
          type="button"
          onClick={() => handleSave()}
          disabled={saving}
          className="apple-btn-white"
          style={{
            padding: "12px 24px",
            fontSize: "14px",
            fontWeight: 900,
          }}
        >
          <Save size={17} />
          <span>{saving ? "Kaydediliyor..." : "Tüm Fiyatları Kaydet"}</span>
        </button>
      </div>

      {/* 3 Pricing Cards Grid */}
      <div className="fiyat-yonetim-grid">
        {categories.map((cat) => (
          <div key={cat.id} className="fiyat-yonetim-karti">
            {/* Header: Non-overlapping structured top area */}
            <div className="fiyat-yonetim-baslik">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  gap: "8px",
                  flexWrap: "wrap",
                }}
              >
                <span className={`fiyat-renk-etiketi ${cat.id}`}>{cat.badgeName}</span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#94a3b8",
                    background: "rgba(255, 255, 255, 0.06)",
                    padding: "3px 10px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  {cat.hzTag}
                </span>
              </div>

              <div style={{ marginTop: "6px" }}>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: 800,
                    color: "#ffffff",
                    margin: 0,
                    letterSpacing: "-0.3px",
                  }}
                >
                  {cat.title}
                </h3>
                <span
                  style={{
                    fontSize: "12px",
                    color: "#94a3b8",
                    marginTop: "3px",
                    display: "block",
                    lineHeight: 1.4,
                  }}
                >
                  {cat.subtitle}
                </span>
              </div>

              {/* Hardware Specs Bullets */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                  marginTop: "8px",
                  padding: "10px 12px",
                  background: "rgba(255, 255, 255, 0.03)",
                  borderRadius: "10px",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                }}
              >
                {cat.specs.map((s, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11.5px", color: "#cbd5e1" }}>
                    <CheckCircle2 size={12} style={{ color: cat.id === "sari" ? "#ffd700" : cat.id === "mavi" ? "#38bdf8" : "#34d399", flexShrink: 0 }} />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Inputs: 3 Stacked Full-Width Luxury Fields with Icons */}
            <div className="fiyat-yonetim-alanlari">
              <div className="form-group">
                <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Clock size={13} style={{ color: "#ffd700" }} />
                  <span>Saatlik Ücret (₺)</span>
                </label>
                <input
                  type="number"
                  className="settings-input"
                  value={pricing[cat.id].saatlik}
                  onChange={(e) => handlePriceChange(cat.id, "saatlik", parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="form-group">
                <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Zap size={13} style={{ color: "#38bdf8" }} />
                  <span>5 Saat Paket (₺)</span>
                </label>
                <input
                  type="number"
                  className="settings-input"
                  value={pricing[cat.id].besSaatlik}
                  onChange={(e) => handlePriceChange(cat.id, "besSaatlik", parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="form-group">
                <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <SunMedium size={13} style={{ color: "#34d399" }} />
                  <span>Gün Boyu Paket (₺)</span>
                </label>
                <input
                  type="number"
                  className="settings-input"
                  value={pricing[cat.id].gunluk}
                  onChange={(e) => handlePriceChange(cat.id, "gunluk", parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            {/* Action Button */}
            <div className="fiyat-yonetim-aksiyonlar" style={{ marginTop: "auto" }}>
              <button
                type="button"
                className="apple-btn-white"
                onClick={() => handleSave(cat.id)}
                disabled={saving}
                style={{
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <Sparkles size={15} />
                <span>Bu Tarifeyi Güncelle</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}