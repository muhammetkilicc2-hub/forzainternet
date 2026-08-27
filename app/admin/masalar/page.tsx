"use client";

import React, { useState, useEffect } from "react";
import { PC } from "@/lib/types";
import { useToast } from "@/components/admin/Toast";

export default function MasalarManagementPage() {
  const { showToast } = useToast();
  const [computers, setComputers] = useState<PC[]>([]);
  const [pricing, setPricing] = useState<any>(null);
  const [filterCat, setFilterCat] = useState<string>("tumu");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
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

  const toggleStatus = async (pc: PC) => {
    const nextStatus: import("@/lib/types").PcDurum =
      pc.durum === "bos" ? "kullanimda" : pc.durum === "kullanimda" ? "rezerve" : "bos";

    // 1. React State Güncelle
    setComputers((prev) =>
      prev.map((p) => (p.id === pc.id ? { ...p, durum: nextStatus } : p))
    );

    // 2. localStorage Senkronizasyonu (Kalıcı Saklama)
    try {
      let localStatuses: Record<string, string> = {};
      const raw = localStorage.getItem("forzaPcDurumlari");
      if (raw) localStatuses = JSON.parse(raw);
      const numId = pc.no || (pc.isim.match(/\d+/) ? parseInt(pc.isim.match(/\d+/)![0], 10) : pc.id);
      const trDurum = nextStatus === "kullanimda" ? "kullanımda" : nextStatus;
      localStatuses[numId] = trDurum;
      localStatuses[pc.id] = trDurum;
      localStorage.setItem("forzaPcDurumlari", JSON.stringify(localStatuses));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("forzaPcDurumGuncellendi", { detail: localStatuses }));
      }
    } catch (e) {}

    // 3. API Sunucusuna Gönder
    try {
      await fetch("/api/computers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: pc.id, durum: nextStatus }),
      });
      showToast("Durum Güncellendi", `${pc.isim} ➔ ${nextStatus.toUpperCase()}`);
    } catch {
      showToast("Bilgi", "Yerel olarak kaydedildi", "info");
    }
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
    <main className="dashboard-content" style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      
      {/* Header & Search */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#fdfbf7", margin: 0 }}>
            Masa Listesi &amp; Durum Yönetimi
          </h1>
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>
            Toplam 64 Masa — Boş / Kullanımda / Rezerve geçişi için masaya dokunun
          </span>
        </div>

        <div className="ios-search-bar" style={{ maxWidth: "320px", width: "100%" }}>
          <input
            type="text"
            placeholder="Masa ara (örn: PC 12)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
      <div className="dashboard-card" style={{ padding: "20px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>Masalar yükleniyor...</div>
        ) : filtered.length === 0 ? (
          <p style={{ textAlign: "center", padding: "30px", color: "#94a3b8" }}>Eşleşen masa bulunamadı.</p>
        ) : (
          <div className="computer-status-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))", gap: "10px" }}>
            {filtered.map((pc) => (
              <div
                key={pc.id}
                onClick={() => toggleStatus(pc)}
                className={`computer-item ${pc.durum === "kullanimda" ? "busy" : pc.durum === "rezerve" ? "reserved" : "available"}`}
                style={{ height: "64px" }}
              >
                <span className="computer-number" style={{ fontSize: "14px" }}>{pc.isim}</span>
                <span className="computer-status">{pc.durum}</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </main>
  );
}