"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/components/admin/Toast";
import { PricingConfig, PcKategori } from "@/lib/types";
import { Clock, Zap, SunMedium, Save, Sparkles, Monitor } from "lucide-react";

import { emitLiveUpdate } from "@/lib/liveSync";

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
          emitLiveUpdate("pricing", pricing);
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
  }[] = [
    {
      id: "sari",
      badgeName: "STANDART GAMING",
      hzTag: "144 Hz",
      title: "Sarı Masalar",
      subtitle: "144 Hz Espor Gaming Monitör",
    },
    {
      id: "mavi",
      badgeName: "PRO ESPOR GAMING",
      hzTag: "240 Hz",
      title: "Mavi Masalar",
      subtitle: "240 Hz Ultra Espor Monitör",
    },
    {
      id: "yesil",
      badgeName: "ULTRA VIP ESPOR",
      hzTag: "VIP Turnuva",
      title: "Yeşil Masalar (VIP)",
      subtitle: "Zirve Turnuva Espor Alanı",
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

      {/* 3 Clean Pricing Cards */}
      <div className="fiyat-yonetim-grid">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="fiyat-yonetim-karti"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              padding: "24px 22px",
            }}
          >
            {/* Header: Non-overlapping structured top area with clear badges */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
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
                    fontSize: "12px",
                    fontWeight: 900,
                    color: cat.id === "sari" ? "#dfb758" : cat.id === "mavi" ? "#38bdf8" : "#34d399",
                    background: "rgba(255, 255, 255, 0.06)",
                    padding: "4px 12px",
                    borderRadius: "10px",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <Monitor size={13} />
                  <span>{cat.hzTag}</span>
                </span>
              </div>

              <div>
                <h3
                  style={{
                    fontSize: "19px",
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
                    fontSize: "13px",
                    color: "#94a3b8",
                    marginTop: "3px",
                    display: "block",
                    fontWeight: 600,
                  }}
                >
                  {cat.subtitle}
                </span>
              </div>
            </div>

            {/* Inputs: 3 Stacked Full-Width Luxury Fields with Icons */}
            <div className="fiyat-yonetim-alanlari" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 800, color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  <Clock size={14} style={{ color: "#dfb758" }} />
                  <span>Saatlik Ücret (₺)</span>
                </label>
                <input
                  type="number"
                  className="settings-input"
                  value={pricing[cat.id].saatlik}
                  onChange={(e) => handlePriceChange(cat.id, "saatlik", parseInt(e.target.value) || 0)}
                  style={{ fontSize: "16px", fontWeight: 800 }}
                />
              </div>

              <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 800, color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  <Zap size={14} style={{ color: "#38bdf8" }} />
                  <span>5 Saat Paket (₺)</span>
                </label>
                <input
                  type="number"
                  className="settings-input"
                  value={pricing[cat.id].besSaatlik}
                  onChange={(e) => handlePriceChange(cat.id, "besSaatlik", parseInt(e.target.value) || 0)}
                  style={{ fontSize: "16px", fontWeight: 800 }}
                />
              </div>

              <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 800, color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  <SunMedium size={14} style={{ color: "#34d399" }} />
                  <span>Gün Boyu Paket (₺)</span>
                </label>
                <input
                  type="number"
                  className="settings-input"
                  value={pricing[cat.id].gunluk}
                  onChange={(e) => handlePriceChange(cat.id, "gunluk", parseInt(e.target.value) || 0)}
                  style={{ fontSize: "16px", fontWeight: 800 }}
                />
              </div>
            </div>

            {/* Action Button */}
            <div style={{ marginTop: "auto", paddingTop: "8px" }}>
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