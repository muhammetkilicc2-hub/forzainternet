"use client";

import React, { useState, useEffect, useRef } from "react";
import { PC, PcDurum } from "@/lib/types";
import { useToast } from "@/components/admin/Toast";
import { subscribeLiveUpdate, emitLiveUpdate } from "@/lib/liveSync";
import { Save, RotateCcw, Search, CheckCircle2, Flame, Sparkles } from "lucide-react";

export default function MasalarManagementPage() {
  const { showToast } = useToast();
  const [computers, setComputers] = useState<PC[]>([]);
  const [serverSnapshot, setServerSnapshot] = useState<PC[]>([]);
  const [pricing, setPricing] = useState<any>(null);
  const [filterCat, setFilterCat] = useState<string>("tumu");
  const [searchQuery, setSearchQuery] = useState<string>("" );
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [unsavedCount, setUnsavedCount] = useState(0);

  const unsavedRef = useRef(unsavedCount);
  unsavedRef.current = unsavedCount;

  useEffect(() => {
    loadData();

    // 1. Fast background polling when no unsaved changes exist
    const interval = setInterval(() => {
      if (unsavedRef.current === 0) {
        loadData();
      }
    }, 2500);

    // 2. Subscribe to instant inter-tab channels
    const unsubPricing = subscribeLiveUpdate("pricing", (p) => {
      if (p) setPricing(p);
    });

    const unsubComputers = subscribeLiveUpdate("computers", () => {
      if (unsavedRef.current === 0) {
        loadData();
      }
    });

    const unsubRez = subscribeLiveUpdate("reservations", () => {
      if (unsavedRef.current === 0) {
        loadData();
      }
    });

    // 3. Tab focus & visibility change
    const handleFocus = () => {
      if (unsavedRef.current === 0) {
        loadData();
      }
    };
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);
    window.addEventListener("storage", handleFocus);

    return () => {
      clearInterval(interval);
      unsubPricing();
      unsubComputers();
      unsubRez();
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
      window.removeEventListener("storage", handleFocus);
    };
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

    let diff = 0;
    updated.forEach((p) => {
      const original = serverSnapshot.find((s) => s.id === p.id);
      if (original && original.durum !== p.durum) {
        diff++;
      }
    });
    setUnsavedCount(diff);
  };

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

  const handleSaveAllToDatabase = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/computers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ computers }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setServerSnapshot(JSON.parse(JSON.stringify(computers)));
        setUnsavedCount(0);

        try {
          const locMap: Record<string, string> = {};
          computers.forEach((pc) => {
            locMap[pc.no] = pc.durum === "kullanimda" ? "kullanımda" : pc.durum;
          });
          localStorage.setItem("forzaPcDurumlari", JSON.stringify(locMap));
          if (typeof window !== "undefined") {
            emitLiveUpdate("computers", locMap);
          }
        } catch (e) {}

        showToast(
          "Veritabanına Kaydedildi 🎉",
          "Tüm masa durumları başarıyla kalıcı olarak veritabanına işlendi.",
          "success"
        );
      } else {
        throw new Error(data.error || "Kayıt başarısız");
      }
    } catch {
      showToast("Hata", "Masa durumları veritabanına kaydedilemedi.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscardChanges = () => {
    setComputers(JSON.parse(JSON.stringify(serverSnapshot)));
    setUnsavedCount(0);
    showToast("Değişiklikler Geri Alındı", "Masa durumları sunucudaki son kaydedilen haline döndü.", "info");
  };

  const filteredPcs = computers.filter((p) => {
    const catMatch = filterCat === "tumu" || p.kategori === filterCat;
    const searchMatch =
      searchQuery.trim() === "" ||
      p.isim.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.no.toString().includes(searchQuery);
    return catMatch && searchMatch;
  });

  const totalCount = computers.length;
  const activeCount = computers.filter((p) => p.durum === "kullanimda").length;
  const reservedCount = computers.filter((p) => p.durum === "rezerve").length;
  const emptyCount = computers.filter((p) => p.durum === "bos").length;

  return (
    <main className="dashboard-content" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Top Header & Save Actions */}
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
            Masa &amp; PC Yönetimi
          </h1>
          <span style={{ fontSize: "13px", color: "#cbd5e1", marginTop: "4px", display: "block" }}>
            {totalCount} Masa • {activeCount} Dolu • {emptyCount} Boş • {reservedCount} Rezerve
          </span>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          {unsavedCount > 0 && (
            <button
              type="button"
              onClick={handleDiscardChanges}
              className="apple-btn-glass"
            >
              <RotateCcw size={15} />
              <span>Vazgeç</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSaveAllToDatabase}
            disabled={isSaving}
            className="apple-btn-white"
          >
            <Save size={16} />
            <span>
              {isSaving
                ? "Kaydediliyor..."
                : unsavedCount > 0
                ? `Kaydet (${unsavedCount} Masa Değişti)`
                : "Masaları Kaydet"}
            </span>
          </button>
        </div>
      </div>

      {/* Search & Bulk Operations */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px",
        }}
      >
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
          <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 700 }}>Hızlı İşlem:</span>
          <button
            type="button"
            onClick={() => setAllStatus("bos", filterCat)}
            className="apple-btn-glass"
            style={{ padding: "6px 14px", fontSize: "12px" }}
          >
            <CheckCircle2 size={13} style={{ color: "#10b981" }} />
            <span>Seçili Grubu Boş Yap</span>
          </button>
          <button
            type="button"
            onClick={() => setAllStatus("kullanimda", filterCat)}
            className="apple-btn-glass"
            style={{ padding: "6px 14px", fontSize: "12px" }}
          >
            <Flame size={13} style={{ color: "#ef4444" }} />
            <span>Seçili Grubu Dolu Yap</span>
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
          <span className="tab-desktop-text">Tümü ({computers.length || 48})</span>
          <span className="tab-mobile-text">Tümü ({computers.length || 48})</span>
        </button>
        <button
          type="button"
          className={`filter-tab ${filterCat === "sari" ? "active" : ""}`}
          onClick={() => setFilterCat("sari")}
        >
          <span className="tab-desktop-text">🟡 Sarı Masalar ({pricing?.sari?.saatlik || 60} TL)</span>
          <span className="tab-mobile-text">🟡 Sarı ({pricing?.sari?.saatlik || 60}₺)</span>
        </button>
        <button
          type="button"
          className={`filter-tab ${filterCat === "mavi" ? "active" : ""}`}
          onClick={() => setFilterCat("mavi")}
        >
          <span className="tab-desktop-text">🔵 Mavi Masalar ({pricing?.mavi?.saatlik || 70} TL)</span>
          <span className="tab-mobile-text">🔵 Mavi ({pricing?.mavi?.saatlik || 70}₺)</span>
        </button>
        <button
          type="button"
          className={`filter-tab ${filterCat === "yesil" ? "active" : ""}`}
          onClick={() => setFilterCat("yesil")}
        >
          <span className="tab-desktop-text">🟢 Yeşil VIP ({pricing?.yesil?.saatlik || 90} TL)</span>
          <span className="tab-mobile-text">🟢 VIP ({pricing?.yesil?.saatlik || 90}₺)</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="dashboard-card" style={{ padding: "24px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>Masalar yükleniyor...</div>
        ) : filteredPcs.length === 0 ? (
          <p style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>Aramanızla eşleşen masa bulunamadı.</p>
        ) : (
          <div className="computer-status-grid">
            {filteredPcs.map((pc) => {
              const displayDurum =
                pc.durum === "kullanimda" ? "DOLU" : pc.durum === "rezerve" ? "REZERVE" : "BOŞ";
              const original = serverSnapshot.find((s) => s.id === pc.id);
              const isModified = original && original.durum !== pc.durum;

              return (
                <div
                  key={pc.id}
                  onClick={() => toggleStatus(pc)}
                  className={`computer-item ${pc.durum === "kullanimda" ? "busy" : pc.durum === "rezerve" ? "reserved" : "available"} ${isModified ? "modified-pulse" : ""}`}
                  style={{
                    position: "relative",
                    border: isModified ? "2px dashed #dfb758" : undefined,
                  }}
                  title={`${pc.isim} — Durum: ${displayDurum} (Değiştirmek için tıkla)`}
                >
                  <span className="computer-number">{pc.isim}</span>
                  <span className="computer-status">{displayDurum}</span>
                  {isModified && (
                    <span
                      style={{
                        position: "absolute",
                        top: "4px",
                        right: "4px",
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: "#dfb758",
                        boxShadow: "0 0 8px #dfb758",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}