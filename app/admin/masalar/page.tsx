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
    // Yalnızca kaydedilmemiş taslak değişiklik yokken arka planda yoklama yap (gel-git yapmasını engeller)
    const interval = setInterval(() => {
      if (unsavedRef.current === 0) {
        loadData(true);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  async function loadData(silent = false) {
    try {
      const [resPc, resPricing] = await Promise.all([
        fetch("/api/computers", { cache: "no-store" }),
        fetch("/api/pricing", { cache: "no-store" }),
      ]);
      const dataPc = await resPc.json();
      const dataPricing = await resPricing.json();

      if (dataPc.computers && Array.isArray(dataPc.computers)) {
        if (!silent || unsavedRef.current === 0) {
          setComputers(dataPc.computers);
          setServerSnapshot(JSON.parse(JSON.stringify(dataPc.computers)));
          setUnsavedCount(0);
        }

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
      if (!silent) console.error("Masalar yüklenemedi:", err);
    } finally {
      if (!silent) setLoading(false);
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
          Tümü (64)
        </button>
        <button
          type="button"
          className={`filter-tab ${filterCat === "sari" ? "active" : ""}`}
          onClick={() => setFilterCat("sari")}
        >
          Sarı ({pricing?.sari?.saatlik || 60} TL)
        </button>
        <button
          type="button"
          className={`filter-tab ${filterCat === "mavi" ? "active" : ""}`}
          onClick={() => setFilterCat("mavi")}
        >
          Mavi ({pricing?.mavi?.saatlik || 70} TL)
        </button>
        <button
          type="button"
          className={`filter-tab ${filterCat === "yesil" ? "active" : ""}`}
          onClick={() => setFilterCat("yesil")}
        >
          Yeşil VIP ({pricing?.yesil?.saatlik || 90} TL)
        </button>
      </div>

      {/* 64 PC GRID */}
      <div className="dashboard-card" style={{ padding: "22px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>Masalar yükleniyor...</div>
        ) : filtered.length === 0 ? (
          <p style={{ textAlign: "center", padding: "30px", color: "#94a3b8" }}>Eşleşen masa bulunamadı.</p>
        ) : (
          <div className="computer-status-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(76px, 1fr))", gap: "12px" }}>
            {filtered.map((pc) => {
              const original = serverSnapshot.find((s) => s.id === pc.id);
              const isModified = original && original.durum !== pc.durum;

              return (
                <div
                  key={pc.id}
                  onClick={() => toggleStatus(pc)}
                  className={`computer-item ${pc.durum === "kullanimda" ? "busy" : pc.durum === "rezerve" ? "reserved" : "available"}`}
                  style={{
                    height: "68px",
                    position: "relative",
                    border: isModified ? "2px solid #10b981" : undefined,
                    boxShadow: isModified ? "0 0 12px rgba(16, 185, 129, 0.4)" : undefined,
                    cursor: "pointer",
                  }}
                  title={`${pc.isim} — Şu anki durum: ${pc.durum.toUpperCase()} (Tıklayarak değiştirin)`}
                >
                  {isModified && (
                    <span
                      style={{
                        position: "absolute",
                        top: "-5px",
                        right: "-5px",
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: "#10b981",
                        boxShadow: "0 0 6px #10b981",
                      }}
                    />
                  )}
                  <span className="computer-number" style={{ fontSize: "14px" }}>{pc.isim}</span>
                  <span className="computer-status">{pc.durum}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Kaydedilmemiş Değişiklik Varsa Sabit Alt Bildirim & Kaydet Çubuğu */}
      {unsavedCount > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(600px, calc(100% - 32px))",
            background: "rgba(15, 23, 42, 0.92)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(16, 185, 129, 0.5)",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(16, 185, 129, 0.25)",
            borderRadius: "20px",
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            zIndex: 999,
            animation: "fadeInUp 0.3s ease-out forwards",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "50%", background: "#10b981", boxShadow: "0 0 10px #10b981" }} />
            <div>
              <strong style={{ display: "block", fontSize: "13.5px", color: "#fdfbf7" }}>
                {unsavedCount} Masanın Durumu Değiştirildi
              </strong>
              <span style={{ fontSize: "11.5px", color: "#94a3b8" }}>
                Değişikliklerin sitede aktif olması için kaydedin
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              type="button"
              onClick={handleDiscardChanges}
              disabled={isSaving}
              style={{
                padding: "8px 14px",
                background: "transparent",
                color: "#94a3b8",
                border: "none",
                fontSize: "12.5px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Vazgeç
            </button>
            <button
              type="button"
              onClick={handleSaveAllToDatabase}
              disabled={isSaving}
              style={{
                padding: "10px 20px",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                fontSize: "13.5px",
                fontWeight: 800,
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(16, 185, 129, 0.4)",
              }}
            >
              {isSaving ? "Kaydediliyor..." : "Veritabanına Kaydet"}
            </button>
          </div>
        </div>
      )}

    </main>
  );
}