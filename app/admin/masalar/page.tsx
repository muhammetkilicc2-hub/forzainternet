"use client";

import React, { useState, useEffect, useRef } from "react";
import { PC, PcDurum } from "@/lib/types";
import { useToast } from "@/components/admin/Toast";
import { subscribeLiveUpdate, emitLiveUpdate } from "@/lib/liveSync";
import { Save, RotateCcw, CheckCircle2, Flame, RefreshCw } from "lucide-react";

export default function MasalarManagementPage() {
  const { showToast } = useToast();
  const [computers, setComputers] = useState<PC[]>([]);
  const [pricing, setPricing] = useState<any>(null);
  const [filterCat, setFilterCat] = useState<string>("tumu");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData();

    // 1. Fast background polling
    const interval = setInterval(() => {
      loadData(false);
    }, 3000);

    // 2. Subscribe to instant inter-tab channels
    const unsubPricing = subscribeLiveUpdate("pricing", (p) => {
      if (p) setPricing(p);
    });

    const unsubComputers = subscribeLiveUpdate("computers", (updatedMap) => {
      if (updatedMap) {
        setComputers((prev) =>
          prev.map((pc) => {
            const rawStatus = updatedMap[pc.no] || updatedMap[pc.id] || updatedMap[`pc-${pc.no}`];
            if (rawStatus) {
              const stdStatus: PcDurum =
                rawStatus === "kullanımda" || rawStatus === "kullanimda"
                  ? "kullanimda"
                  : rawStatus === "rezerve"
                  ? "rezerve"
                  : "bos";
              return { ...pc, durum: stdStatus };
            }
            return pc;
          })
        );
      } else {
        loadData(false);
      }
    });

    const unsubRez = subscribeLiveUpdate("reservations", () => {
      loadData(false);
    });

    // 3. Tab focus & visibility change
    const handleFocus = () => loadData(false);
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

  async function loadData(showSpinner = true) {
    if (showSpinner && computers.length === 0) setLoading(true);
    try {
      const [resPc, resPricing] = await Promise.all([
        fetch("/api/computers", { cache: "no-store" }),
        fetch("/api/pricing", { cache: "no-store" }),
      ]);
      const dataPc = await resPc.json();
      const dataPricing = await resPricing.json();

      if (dataPc.computers && Array.isArray(dataPc.computers)) {
        setComputers(dataPc.computers);

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

  // Tekil Masa Durumu Değiştirme (Anında Kaydet & Anında Yayınla)
  const toggleStatus = async (pc: PC) => {
    let nextStatus: PcDurum = "bos";
    if (pc.durum === "bos") nextStatus = "kullanimda";
    else if (pc.durum === "kullanimda") nextStatus = "rezerve";
    else nextStatus = "bos";

    const updated = computers.map((p) => (p.id === pc.id ? { ...p, durum: nextStatus } : p));
    setComputers(updated);

    const locMap: Record<string, string> = {};
    updated.forEach((p) => {
      locMap[p.no] = p.durum === "kullanimda" ? "kullanımda" : p.durum;
    });

    try {
      localStorage.setItem("forzaPcDurumlari", JSON.stringify(locMap));
      emitLiveUpdate("computers", locMap);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("forzaPcDurumGuncellendi", { detail: locMap }));
      }
    } catch (e) {}

    try {
      const res = await fetch("/api/computers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: pc.id, durum: nextStatus }),
      });
      const data = await res.json();
      if (data.success && data.computers) {
        setComputers(data.computers);
      }
    } catch {
      showToast("Bilgi", `${pc.isim} durumu güncellendi.`, "info");
    }
  };

  // Toplu Masa Durumu Değiştirme (Tümünü veya Grubu Dolu/Boş Yap)
  const setAllStatus = async (durum: PcDurum, cat: string = "tumu") => {
    setIsSaving(true);
    const updated = computers.map((p) => {
      if (cat === "tumu" || p.kategori === cat) {
        return { ...p, durum };
      }
      return p;
    });
    setComputers(updated);

    const locMap: Record<string, string> = {};
    updated.forEach((p) => {
      locMap[p.no] = p.durum === "kullanimda" ? "kullanımda" : p.durum;
    });

    try {
      localStorage.setItem("forzaPcDurumlari", JSON.stringify(locMap));
      emitLiveUpdate("computers", locMap);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("forzaPcDurumGuncellendi", { detail: locMap }));
      }
    } catch (e) {}

    try {
      const res = await fetch("/api/computers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ computers: updated }),
      });
      const data = await res.json();
      if (data.success && data.computers) {
        setComputers(data.computers);
      }

      const label = cat === "tumu" ? "Tüm Masalar" : cat === "sari" ? "Sarı Masalar" : cat === "mavi" ? "Mavi Masalar" : "Yeşil VIP Masalar";
      const durumLabel = durum === "kullanimda" ? "DOLU" : durum === "rezerve" ? "REZERVE" : "BOŞ";
      showToast(`${label} ${durumLabel} Yapıldı`, "Tüm masalar güncellendi ve web sitesine anında yansıtıldı.", "success");
    } catch {
      showToast("Hata", "Masa durumları güncellenemedi.", "error");
    } finally {
      setIsSaving(false);
    }
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
          <button
            type="button"
            onClick={() => loadData(true)}
            className="apple-btn-glass"
            title="Verileri Yenile"
          >
            <RefreshCw size={15} />
            <span>Yenile</span>
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
          <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 700 }}>Hızlı İşlem ({filterCat === "tumu" ? "Tümü" : filterCat.toUpperCase()}):</span>
          <button
            type="button"
            onClick={() => setAllStatus("bos", filterCat)}
            disabled={isSaving}
            className="apple-btn-glass"
            style={{ padding: "8px 16px", fontSize: "12.5px", cursor: "pointer" }}
          >
            <CheckCircle2 size={15} style={{ color: "#10b981" }} />
            <span>Grubu BOŞ Yap</span>
          </button>
          <button
            type="button"
            onClick={() => setAllStatus("kullanimda", filterCat)}
            disabled={isSaving}
            className="apple-btn-glass"
            style={{ padding: "8px 16px", fontSize: "12.5px", cursor: "pointer", border: "1px solid rgba(239, 68, 68, 0.4)", background: "rgba(239, 68, 68, 0.12)" }}
          >
            <Flame size={15} style={{ color: "#ef4444" }} />
            <span style={{ color: "#fca5a5" }}>Grubu DOLU Yap</span>
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <span style={{ fontSize: "13px", color: "#94a3b8" }}>
            💡 Masaların üzerine tıklayarak durumlarını anında <strong>BOŞ ➔ DOLU ➔ REZERVE</strong> yapabilirsiniz. Değişiklikler anında canlı web sitesine uygulanır.
          </span>
        </div>

        {loading && computers.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>Masalar yükleniyor...</div>
        ) : filteredPcs.length === 0 ? (
          <p style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>Aramanızla eşleşen masa bulunamadı.</p>
        ) : (
          <div className="computer-status-grid">
            {filteredPcs.map((pc) => {
              const displayDurum =
                pc.durum === "kullanimda" ? "DOLU" : pc.durum === "rezerve" ? "REZERVE" : "BOŞ";

              return (
                <div
                  key={pc.id}
                  onClick={() => toggleStatus(pc)}
                  className={`computer-item ${pc.durum === "kullanimda" ? "busy" : pc.durum === "rezerve" ? "reserved" : "available"}`}
                  style={{
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleStatus(pc);
                    }
                  }}
                  title={`${pc.isim} — Durum: ${displayDurum} (Değiştirmek için tıkla)`}
                >
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