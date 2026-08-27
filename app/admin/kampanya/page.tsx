"use client";

import React, { useState, useEffect } from "react";
import { KampanyaFiyatlari, PcKategori } from "@/lib/types";
import { useToast } from "@/components/admin/Toast";

export default function KampanyaManagementPage() {
  const { showToast } = useToast();
  const [pricing, setPricing] = useState<KampanyaFiyatlari>({
    sari: { saatlik: 60, besSaatlik: 200, gunluk: 400 },
    mavi: { saatlik: 70, besSaatlik: 250, gunluk: 500 },
    yesil: { saatlik: 90, besSaatlik: 350, gunluk: 700 },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadPricing() {
      try {
        const res = await fetch("/api/pricing");
        const data = await res.json();
        if (data.pricing) setPricing(data.pricing);
      } catch (err) {
        console.error("Fiyatlar yüklenemedi:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPricing();
  }, []);

  const handlePriceChange = (kategori: PcKategori, alan: "saatlik" | "besSaatlik" | "gunluk", value: number) => {
    setPricing((prev) => ({
      ...prev,
      [kategori]: {
        ...prev[kategori],
        [alan]: value,
      },
    }));
  };

  const handleSave = async (kategori?: PcKategori) => {
    setSaving(true);
    try {
      const res = await fetch("/api/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pricing),
      });
      const data = await res.json();
      if (data.success) {
        showToast(
          "Fiyatlar Güncellendi",
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

  const categories: { id: PcKategori; title: string; subtitle: string; color: string }[] = [
    { id: "sari", title: "Standart Gaming (Sarı Masalar)", subtitle: "RTX 4060 • 240 Hz Fast IPS", color: "var(--cream-gold)" },
    { id: "mavi", title: "Pro Gaming (Mavi Masalar)", subtitle: "RTX 4070 Super • 360 Hz Espor", color: "var(--cyber-blue)" },
    { id: "yesil", title: "Elite VIP 540Hz (Yeşil Masalar)", subtitle: "RTX 4090 / 4080 • 540 Hz Zirve", color: "var(--neon-green)" },
  ];

  return (
    <main className="dashboard-content" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#fdfbf7", margin: 0 }}>
            Fiyat &amp; Kampanya Yönetimi
          </h1>
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>
            Saatlik ve avantajlı paket ücretlerini anlık olarak belirleyin
          </span>
        </div>

        <button
          type="button"
          onClick={() => handleSave()}
          disabled={saving}
          className="save-settings-btn"
          style={{ padding: "10px 20px" }}
        >
          {saving ? "Kaydediliyor..." : "💾 Tüm Fiyatları Kaydet"}
        </button>
      </div>

      <div className="fiyat-yonetim-grid">
        {categories.map((cat) => (
          <div key={cat.id} className="fiyat-yonetim-karti">
            <div className="fiyat-yonetim-baslik">
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#fdfbf7", margin: 0 }}>{cat.title}</h3>
                <span style={{ fontSize: "11px", color: "#94a3b8" }}>{cat.subtitle}</span>
              </div>
              <span className={`fiyat-renk-etiketi ${cat.id}`}>{cat.id.toUpperCase()}</span>
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