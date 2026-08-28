"use client";

import React, { useState, useEffect, useRef } from "react";
import { PC, PcDurum } from "@/lib/types";
import { useToast } from "@/components/admin/Toast";

export default function MasalarManagementPage() {
  const { showToast } = useToast();
  const [computers, setComputers] = useState<PC[]>([]);
  const [serverSnapshot, setServerSnapshot] = useState<PC[]>([]);
  const [pricing, setPricing] = useState<any>(null);
  const [filterCat, setFilterCat] = useState<string>("tumu");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [unsavedCount, setUnsavedCount] = useState(0);

  const unsavedRef = useRef(unsavedCount);
  unsavedRef.current = unsavedCount;

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [resPc, resPricing] = await Promise.all([
        fetch("/api/computers", { cache: "no-store" }),
        fetch("/api/pricing", { cache: "no-store" }),
      ]);
      const dataPc = await resPc.json();
      const dataPricing = await resPricing.json();

      if (dataPc.computers && Array.isArray(dataPc.computers)) {
        setComputers(dataPc.computers);
        setServerSnapshot(JSON.parse(JSON.stringify(dataPc.computers)));
        setUnsavedCount(0);

        try {
          const locMap: Record<string, string> = {};
          dataPc.computers.forEach((pc: PC) => {
            locMap[pc.no] = pc.durum === "kullanimda" ? "kullanımda" : pc.durum;
          });
          localStorage.setItem("forzaPcDurumlari", JSON.stringify(locMap));
        } catch (e) {}
      }
      if (dataPricing.pricing) setPricing(dataPricing.pricing);
    } catch (err) {
      console.error("Masalar yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  }

  const toggleStatus = (pc: PC) => {
    const nextStatus: PcDurum =
      pc.durum === "bos" ? "kullanimda" : pc.durum === "kullanimda" ? "rezerve" : "bos";

    const updated = computers.map((p) => (p.id === pc.id ? { ...p, durum: nextStatus } : p));
    setComputers(updated);

    // Kaç masanın sunucu verisinden farklı olduğunu hesapla
    let diff = 0;
    updated.forEach((p) => {
      const original = serverSnapshot.find((s) => s.id === p.id);
      if (original && original.durum !== p.durum) {
        diff++;
      }
    });
    setUnsavedCount(diff);
  };

  // Toplu Masa Durumu Değiştirme
  const setAllStatus = (durum: PcDurum, cat: string = "tumu") => {
    const updated = computers.map((p) => {
      if (cat === "tumu" || p.kategori === cat) {
        return { ...p, durum };
      }
      return p;
    });
    setComputers(updated);

    let diff = 0;
    updated.forEach((p) => {
      const original = serverSnapshot.find((s) => s.id === p.id);
      if (original && original.durum !== p.durum) {
        diff++;
      }
    });
    setUnsavedCount(diff);
  };

  // Tüm Masaları Kesin Olarak Veritabanına Kaydet
  const handleSaveAllToDatabase = async () => {
    setIsSaving(true);
    try {
      // 1. API Sunucusuna Toplu Kaydet (Single Source of Truth)
      const res = await fetch("/api/computers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          computers: computers.map((p) => ({ id: p.id, durum: p.durum })),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Kayıt işlemi başarısız");
      }

      // 2. localStorage Senkronizasyonu
      const locMap: Record<string, string> = {};
      computers.forEach((pc) => {
        const trDurum = pc.durum === "kullanimda" ? "kullanımda" : pc.durum;
        locMap[pc.no] = trDurum;
        locMap[pc.id] = trDurum;
      });
      localStorage.setItem("forzaPcDurumlari", JSON.stringify(locMap));

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("forzaPcDurumGuncellendi", { detail: locMap }));
      }

      // 3. Başarılı snapshot güncelleme
      setServerSnapshot(JSON.parse(JSON.stringify(computers)));
      setUnsavedCount(0);

      showToast(
        "Veritabanına Kaydedildi",
        "Tüm 64 masa durumu başarıyla veritabanına kaydedildi ve canlı sitede güncellendi.",
        "success"
      );
    } catch (err: any) {
      showToast("Kayıt Hatası", err.message || "İşlem sırasında bir hata oluştu", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Değişiklikleri Geri Al / İptal Et
  const handleDiscardChanges = () => {
    setComputers(JSON.parse(JSON.stringify(serverSnapshot)));
    setUnsavedCount(0);
    showToast("Geri Alındı", "Kaydedilmemiş değişiklikler iptal edildi.", "info");
  };

  const filtered = computers.filter((p) => {
    const catMatch = filterCat === "tumu" || p.kategori === filterCat;
    const searchMatch =
      searchQuery.trim() === "" ||
      p.isim.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.kategori.toLowerCase().includes(searchQuery.toLowerCase());
    return catMatch && searchMatch;
  });

  return (
    <main className="dashboard-content" style={{ display: "flex", flexDirection: "column", gap: "18px", position: "relative", paddingBottom: "80px" }}>
      
      {/* Header & Save Action */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", background: "rgba(255, 255, 255, 0.03)", padding: "18px 22px", borderRadius: "18px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#fdfbf7", margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
            <i className="fa-solid fa-desktop" style={{ color: "#ffd700" }}></i> Masa Listesi &amp; Durum Yönetimi
          </h1>
          <span style={{ fontSize: "12.5px", color: "#94a3b8", marginTop: "4px", display: "inline-block" }}>
            Masa durumunu değiştirmek için tıklayın, ardından <strong style={{ color: "#ffd700" }}>"Veritabanına Kaydet"</strong> butonuna basın.
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {unsavedCount > 0 && (
            <button
              type="button"
              onClick={handleDiscardChanges}
              disabled={isSaving}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 18px",
                background: "rgba(244, 63, 94, 0.15)",
                color: "#fb7185",
                fontWeight: 700,
                fontSize: "13.5px",
                borderRadius: "12px",
                border: "1px solid rgba(244, 63, 94, 0.3)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <i className="fa-solid fa-rotate-left"></i> Vazgeç
            </button>
          )}

          <button
            type="button"
            onClick={handleSaveAllToDatabase}
            disabled={isSaving}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 24px",
              background: unsavedCount > 0 ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" : "linear-gradient(135deg, #ffd700 0%, #eab308 100%)",
              color: "#000",
              fontWeight: 800,
              fontSize: "14.5px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              boxShadow: unsavedCount > 0 ? "0 6px 24px rgba(16, 185, 129, 0.45)" : "0 4px 16px rgba(255, 215, 0, 0.3)",
              transition: "all 0.2s ease",
              transform: unsavedCount > 0 ? "scale(1.02)" : "none",
            }}
          >
            <i className={`fa-solid ${isSaving ? "fa-spinner fa-spin" : "fa-floppy-disk"}`}></i>
            {isSaving ? "Kaydediliyor..." : unsavedCount > 0 ? `💾 Veritabanına Kaydet (${unsavedCount} Masa Değişti)` : "💾 Masaları Veritabanına Kaydet"}
          </button>
        </div>
      </div>

      {/* Search & Bulk Operations */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div className="ios-search-bar" style={{ maxWidth: "340px", width: "100%" }}>
          <input
            type="text"
            placeholder="Masa ara (örn: PC 12)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Hızlı Toplu Aksiyonlar */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>Hızlı İşlem:</span>
          <button
            type="button"
            onClick={() => setAllStatus("bos", filterCat)}
            style={{
              padding: "6px 12px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "8px",
              color: "#fdfbf7",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Seçili Grubu Boş Yap
          </button>
          <button
            type="button"
            onClick={() => setAllStatus("kullanimda", filterCat)}
            style={{
              padding: "6px 12px",
              background: "rgba(244,63,94,0.12)",
              border: "1px solid rgba(244,63,94,0.25)",
              borderRadius: "8px",
              color: "#f87171",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Seçili Grubu Dolu Yap
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="computer-filter-tabs">
        <button
          type="button"
          className={`filter-tab ${filterCat === "tumu" ? "active" : ""}`}
          onClick={() => setFilterCat("tumu")}
        >
          Tümü ({computers.length || 48})
        </button>
        <button
          type="button"
          className={`filter-tab ${filterCat === "sari" ? "active" : ""}`}
          onClick={() => setFilterCat("sari")}
        >
          🟡 Sarı Masalar ({pricing?.sari?.saatlik || 60} TL)
        </button>
        <button
          type="button"
          className={`filter-tab ${filterCat === "mavi" ? "active" : ""}`}
          onClick={() => setFilterCat("mavi")}
        >
          🔵 Mavi Masalar ({pricing?.mavi?.saatlik || 70} TL)
        </button>
        <button
          type="button"
          className={`filter-tab ${filterCat === "yesil" ? "active" : ""}`}
          onClick={() => setFilterCat("yesil")}
        >
          🟢 Yeşil VIP ({pricing?.yesil?.saatlik || 90} TL)
        </button>
      </div>

      {/* 64 PC GRID */}
      <div className="dashboard-card" style={{ padding: "22px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>Masalar yükleniyor...</div>
        ) : filtered.length === 0 ? (
          <p style={{ textAlign: "center", padding: "30px", color: "#94a3b8" }}>Eşleşen masa bulunamadı.</p>
        ) : (
          <div className="computer-status-grid">
            {filtered.map((pc) => {
              const original = serverSnapshot.find((s) => s.id === pc.id);
              const isModified = original && original.durum !== pc.durum;
              const displayDurum =
                pc.durum === "kullanimda" ? "KULLANIMDA" : pc.durum === "rezerve" ? "REZERVE" : "BOŞ";

              return (
                <div
                  key={pc.id}
                  onClick={() => toggleStatus(pc)}
                  className={`computer-item ${pc.durum === "kullanimda" ? "busy" : pc.durum === "rezerve" ? "reserved" : "available"}`}
                  style={{
                    position: "relative",
                    border: isModified ? "2px solid #10b981" : undefined,
                    boxShadow: isModified ? "0 0 14px rgba(16, 185, 129, 0.45)" : undefined,
                  }}
                  title={`${pc.isim} — Durum: ${displayDurum} (Değiştirmek için dokunun)`}
                >
                  {isModified && (
                    <span
                      style={{
                        position: "absolute",
                        top: "-5px",
                        right: "-5px",
                        width: "11px",
                        height: "11px",
                        borderRadius: "50%",
                        background: "#10b981",
                        boxShadow: "0 0 8px #10b981",
                      }}
                    />
                  )}
                  <span className="computer-number">{pc.isim}</span>
                  <span className="computer-status">{displayDurum}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}