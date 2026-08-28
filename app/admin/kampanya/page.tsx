"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/components/admin/Toast";
import { PricingConfig, PcKategori } from "@/lib/types";

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

  const categories: { id: PcKategori; badgeName: string; title: string; subtitle: string }[] = [
    {
      id: "sari",
      badgeName: "SARI MASALAR",
      title: "Standart Gaming (Sarı Masalar)",
      subtitle: "RTX 4060 • 240 Hz Fast IPS Monitör",
    },
    {
      id: "mavi",
      badgeName: "MAVİ MASALAR",
      title: "Pro Gaming (Mavi Masalar)",
      subtitle: "RTX 4070 Super • 360 Hz Espor Monitör",
    },
    {
      id: "yesil",
      badgeName: "YEŞİL VIP MASALAR",
      title: "Elite VIP 540Hz (Yeşil Masalar)",
      subtitle: "RTX 4090 / 4080 • 540 Hz Zirve DyAc+",
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#ffffff", margin: 0, letterSpacing: "-0.3px" }}>
            Fiyat &amp; Kampanya Yönetimi
          </h1>
          <span style={{ fontSize: "13px", color: "#cbd5e1", marginTop: "3px", display: "block" }}>
            Saatlik ve avantajlı paket ücretlerini anlık olarak belirleyin
          </span>
        </div>

        <button
          type="button"
          onClick={() => handleSave()}
          disabled={saving}
          className="save-settings-btn"
          style={{ padding: "12px 24px", fontSize: "14px", fontWeight: 900 }}
        >
          {saving ? "Kaydediliyor..." : "💾 Tüm Fiyatları Kaydet"}
        </button>
      </div>

      <div className="fiyat-yonetim-grid">
        {categories.map((cat) => (
          <div key={cat.id} className="fiyat-yonetim-karti">
            <div className="fiyat-yonetim-baslik">
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#ffffff", margin: 0 }}>
                  {cat.title}
                </h3>
                <span style={{ fontSize: "12px", color: "#cbd5e1", marginTop: "3px", display: "block" }}>
                  {cat.subtitle}
                </span>
              </div>
              <span className={`fiyat-renk-etiketi ${cat.id}`}>{cat.badgeName}</span>
            </div>

            <div className="fiyat-yonetim-alanlari">
              <div className="form-group">
                <label>Saatlik Ücret (₺)</label>
                <input
                  type="number"
                  className="settings-input"
                  value={pricing[cat.id].saatlik}
                  onChange={(e) => handlePriceChange(cat.id, "saatlik", parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="form-group">
                <label>5 Saat Paket (₺)</label>
                <input
                  type="number"
                  className="settings-input"
                  value={pricing[cat.id].besSaatlik}
                  onChange={(e) => handlePriceChange(cat.id, "besSaatlik", parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="form-group">
                <label>Gün Boyu Paket (₺)</label>
                <input
                  type="number"
                  className="settings-input"
                  value={pricing[cat.id].gunluk}
                  onChange={(e) => handlePriceChange(cat.id, "gunluk", parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="fiyat-yonetim-aksiyonlar">
              <button
                type="button"
                className="fiyat-kaydet-btn"
                onClick={() => handleSave(cat.id)}
                disabled={saving}
              >
                Bu Tarifeyi Güncelle
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}