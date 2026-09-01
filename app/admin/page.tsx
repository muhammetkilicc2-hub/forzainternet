"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PC, PcDurum, Rezervasyon, AdminStats } from "@/lib/types";
import { useToast } from "@/components/admin/Toast";
import {
  Monitor,
  Flame,
  CheckCircle2,
  CalendarCheck,
  Image as ImageIcon,
  ExternalLink,
  Edit3,
  ArrowRight,
  Clock,
  User,
  Check,
  X,
  Sparkles,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { showToast } = useToast();
  const [computers, setComputers] = useState<PC[]>([]);
  const [reservations, setReservations] = useState<Rezervasyon[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pricing, setPricing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [galleryPhotos, setGalleryPhotos] = useState<Array<{ src: string; badge?: string }>>([
    { src: "/foto1.jpeg", badge: "Ana Salon" },
    { src: "/foto2.jpeg", badge: "VIP Espor" },
    { src: "/foto3.jpeg", badge: "Pro Setup" },
    { src: "/foto4.jpeg", badge: "VIP Lounge" },
    { src: "/foto5.jpeg", badge: "Ekipman" },
    { src: "/foto6.jpeg", badge: "Turnuva" },
  ]);

  const [filterCat, setFilterCat] = useState<string>("tumu");

  useEffect(() => {
    loadData();
    try {
      const raw = localStorage.getItem("forzaGaleriFotograflar");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setGalleryPhotos(parsed);
      }
    } catch (e) {}

    const handleGalUpdate = (e: CustomEvent<any[]>) => {
      if (e.detail && Array.isArray(e.detail)) setGalleryPhotos(e.detail);
      else loadData();
    };

    const handleFiyatUpdate = (e: CustomEvent<any>) => {
      if (e.detail && e.detail.sari) setPricing(e.detail);
      else loadData();
    };

    window.addEventListener("forzaGaleriGuncellendi" as any, handleGalUpdate);
    window.addEventListener("forzaFiyatlarGuncellendi" as any, handleFiyatUpdate);
    window.addEventListener("storage", loadData);

    const interval = setInterval(loadData, 8000);
    return () => {
      window.removeEventListener("forzaGaleriGuncellendi" as any, handleGalUpdate);
      window.removeEventListener("forzaFiyatlarGuncellendi" as any, handleFiyatUpdate);
      window.removeEventListener("storage", loadData);
      clearInterval(interval);
    };
  }, []);

  async function loadData() {
    try {
      const [resPc, resRez, resGal, resPricing] = await Promise.all([
        fetch("/api/computers", { cache: "no-store" }),
        fetch("/api/reservations", { cache: "no-store" }),
        fetch("/api/gallery", { cache: "no-store" }),
        fetch("/api/pricing", { cache: "no-store" }),
      ]);
      const dataPc = await resPc.json();
      const dataRez = await resRez.json();
      const dataGal = await resGal.json();
      const dataPricing = await resPricing.json();

      if (dataPricing && dataPricing.pricing) {
        setPricing(dataPricing.pricing);
      }

      if (dataGal.photos && Array.isArray(dataGal.photos) && dataGal.photos.length > 0) {
        setGalleryPhotos(dataGal.photos);
      }

      if (dataPc.computers && Array.isArray(dataPc.computers)) {
        setComputers(dataPc.computers);

        try {
          const locMap: Record<string, string> = {};
          dataPc.computers.forEach((pc: PC) => {
            locMap[pc.no] = pc.durum === "kullanimda" ? "kullanımda" : pc.durum;
          });
          localStorage.setItem("forzaPcDurumlari", JSON.stringify(locMap));
        } catch (e) {}

        if (dataPc.stats) {
          setStats({
            ...dataPc.stats,
            toplamPc: dataPc.computers.length,
            aktifPc: dataPc.computers.filter((p: PC) => p.durum === "kullanimda").length,
            bosPc: dataPc.computers.filter((p: PC) => p.durum === "bos").length,
            rezervePc: dataPc.computers.filter((p: PC) => p.durum === "rezerve").length,
          });
        }
      }

      let localRezList: Rezervasyon[] = [];
      try {
        const rawNotifs = localStorage.getItem("forzaBildirimler");
        if (rawNotifs) {
          const parsed = JSON.parse(rawNotifs);
          if (Array.isArray(parsed)) {
            localRezList = parsed.map((b: any) => ({
              id: b.id,
              musteriAdi: b.baslik?.replace("Yeni Rezervasyon — ", "") || "Misafir",
              telefon: b.mesaj ? b.mesaj.split(" · ")[0] : "05XX XXX XX XX",
              masaId: b.baslik?.split(" — ")[1] || "PC",
              masaIsim: b.baslik?.split(" — ")[1] || "PC Masa",
              kategori: b.kampanya?.toLowerCase().includes("60") ? "sari" : b.kampanya?.toLowerCase().includes("70") ? "mavi" : "yesil",
              tarih: new Date().toISOString().split("T")[0],
              saat: "18:00",
              sure: 5,
              toplamTutar: 250,
              odemeYontemi: "kart",
              durum: b.durum || "pending",
              olusturuldu: b.tarih || new Date().toISOString(),
              okundu: b.okundu,
            }));
          }
        }
      } catch (e) {}

      if (dataRez.reservations && Array.isArray(dataRez.reservations)) {
        const map = new Map<string, Rezervasyon>();
        localRezList.forEach((r) => map.set(r.id, r));
        dataRez.reservations.forEach((r: Rezervasyon) => map.set(r.id, r));
        const merged = Array.from(map.values()).sort(
          (a, b) => new Date(b.olusturuldu).getTime() - new Date(a.olusturuldu).getTime()
        );
        setReservations(merged);
      } else {
        setReservations(localRezList);
      }
    } catch (err) {
      console.error("Dashboard veri yükleme hatası:", err);
    } finally {
      setLoading(false);
    }
  }

  // PC Durumunu Tıklandığında Değiştir
  const togglePcStatus = async (pc: PC) => {
    let nextDurum: PcDurum = "bos";
    if (pc.durum === "bos") nextDurum = "kullanimda";
    else if (pc.durum === "kullanimda") nextDurum = "rezerve";
    else nextDurum = "bos";

    const updated = computers.map((p) => (p.id === pc.id ? { ...p, durum: nextDurum } : p));
    setComputers(updated);

    try {
      const locMap: Record<string, string> = {};
      updated.forEach((p) => {
        locMap[p.no] = p.durum === "kullanimda" ? "kullanımda" : p.durum;
      });
      localStorage.setItem("forzaPcDurumlari", JSON.stringify(locMap));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("forzaPcDurumGuncellendi", { detail: locMap }));
        window.dispatchEvent(new Event("storage"));
      }
    } catch (e) {}

    try {
      const res = await fetch("/api/computers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: pc.id, durum: nextDurum }),
      });
      const data = await res.json();
      if (data.success && data.stats) {
        setStats(data.stats);
      }
    } catch {
      showToast("Bilgi", `${pc.isim} durumu güncellendi.`, "info");
    }
  };

  // Rezervasyon Onayla / Reddet
  const handleReservationAction = async (id: string, durum: "confirmed" | "rejected") => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, durum, okundu: true } : r))
    );

    try {
      const raw = localStorage.getItem("forzaBildirimler");
      if (raw) {
        const notifs = JSON.parse(raw);
        const target = notifs.find((b: { id: string; durum?: string; okundu?: boolean }) => b.id === id);
        if (target) {
          target.durum = durum;
          target.okundu = true;
          localStorage.setItem("forzaBildirimler", JSON.stringify(notifs));
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("forzaBildirimGuncellendi", { detail: notifs }));
          }
        }
      }

      if (durum === "confirmed") {
        const rez = reservations.find((r) => r.id === id);
        if (rez) {
          const rawPc = localStorage.getItem("forzaPcDurumlari");
          const durumlar = rawPc ? JSON.parse(rawPc) : {};
          const pcMatches = rez.masaId.match(/\d+/g) || [];
          pcMatches.forEach((numStr) => {
            const pcId = parseInt(numStr, 10);
            durumlar[pcId] = "kullanımda";
            durumlar[`pc-${pcId}`] = "kullanimda";
          });
          localStorage.setItem("forzaPcDurumlari", JSON.stringify(durumlar));
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("forzaPcDurumGuncellendi", { detail: durumlar }));
          }
        }
      }
    } catch (e) {}

    try {
      const res = await fetch("/api/reservations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, durum }),
      });
      const data = await res.json();
      if (data.success && data.stats) {
        setStats(data.stats);
      }
      showToast(
        durum === "confirmed" ? "Rezervasyon Onaylandı" : "Rezervasyon Reddedildi",
        durum === "confirmed" ? "Masa kullanıma hazırlandı." : "Talep iptal edildi.",
        durum === "confirmed" ? "success" : "warning"
      );
    } catch {
      showToast("Bilgi", "İşlem kaydedildi", "info");
    }
  };

  const filteredPcs = computers.filter(
    (p) => filterCat === "tumu" || p.kategori === filterCat
  );

  return (
    <main className="dashboard-content" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* 1. APPLE OBSIDIAN STATS WIDGETS (4 KART) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          width: "100%",
        }}
      >
        {/* Toplam Masa */}
        <div className="ios-stat-widget">
          <div className="ios-widget-icon" style={{ background: "rgba(223, 183, 88, 0.15)", color: "#dfb758", border: "1px solid rgba(223, 183, 88, 0.3)" }}>
            <Monitor size={22} />
          </div>
          <div className="ios-widget-info">
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>Toplam Masa</span>
            <strong style={{ fontSize: "28px", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.5px" }}>{stats ? stats.toplamPc : 48}</strong>
          </div>
        </div>

        {/* Kullanımda */}
        <div className="ios-stat-widget">
          <div className="ios-widget-icon" style={{ background: "rgba(239, 68, 68, 0.15)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
            <Flame size={22} />
          </div>
          <div className="ios-widget-info">
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>Kullanımda (Dolu)</span>
            <strong style={{ fontSize: "28px", fontWeight: 900, color: "#f87171", letterSpacing: "-0.5px" }}>{stats ? stats.aktifPc : 0}</strong>
          </div>
        </div>

        {/* Boş Masa */}
        <div className="ios-stat-widget">
          <div className="ios-widget-icon" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
            <CheckCircle2 size={22} />
          </div>
          <div className="ios-widget-info">
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>Boş (Hazır) Masa</span>
            <strong style={{ fontSize: "28px", fontWeight: 900, color: "#34d399", letterSpacing: "-0.5px" }}>{stats ? stats.bosPc : 48}</strong>
          </div>
        </div>

        {/* Bekleyen Rezervasyon */}
        <div className="ios-stat-widget">
          <div className="ios-widget-icon" style={{ background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", border: "1px solid rgba(56, 189, 248, 0.3)" }}>
            <CalendarCheck size={22} />
          </div>
          <div className="ios-widget-info">
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>Rezervasyon</span>
            <strong style={{ fontSize: "28px", fontWeight: 900, color: "#38bdf8", letterSpacing: "-0.5px" }}>
              {reservations.filter((r) => r.durum === "pending").length}
            </strong>
          </div>
        </div>
      </div>

      {/* 2. DASHBOARD MAIN 2-COLUMN GRID */}
      <div className="ios-dashboard-main-grid">
        {/* MASA DURUMLARI KARTI */}
        <div className="dashboard-card" style={{ display: "flex", flexDirection: "column" }}>
          <div className="card-header">
            <div>
              <h2 className="card-title">Masa Durumları</h2>
              <span className="card-subtitle">Hızlı durum değiştirmek için masaya tıklayın</span>
            </div>
            <Link href="/admin/masalar" className="apple-btn-glass">
              <span>Tümü ({computers.length || 48})</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="computer-filter-tabs">
            <button
              type="button"
              className={`filter-tab ${filterCat === "tumu" ? "active" : ""}`}
              onClick={() => setFilterCat("tumu")}
            >
              <span className="tab-desktop-text">Tümü</span>
              <span className="tab-mobile-text">Tümü</span>
            </button>
            <button
              type="button"
              className={`filter-tab ${filterCat === "sari" ? "active" : ""}`}
              onClick={() => setFilterCat("sari")}
            >
              <span className="tab-desktop-text">🟡 Sarı ({pricing?.sari?.saatlik || 60} TL)</span>
              <span className="tab-mobile-text">🟡 Sarı ({pricing?.sari?.saatlik || 60}₺)</span>
            </button>
            <button
              type="button"
              className={`filter-tab ${filterCat === "mavi" ? "active" : ""}`}
              onClick={() => setFilterCat("mavi")}
            >
              <span className="tab-desktop-text">🔵 Mavi ({pricing?.mavi?.saatlik || 70} TL)</span>
              <span className="tab-mobile-text">🔵 Mavi ({pricing?.mavi?.saatlik || 70}₺)</span>
            </button>
            <button
              type="button"
              className={`filter-tab ${filterCat === "yesil" ? "active" : ""}`}
              onClick={() => setFilterCat("yesil")}
            >
              <span className="tab-desktop-text">🟢 Yeşil ({pricing?.yesil?.saatlik || 90} TL)</span>
              <span className="tab-mobile-text">🟢 VIP ({pricing?.yesil?.saatlik || 90}₺)</span>
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>Yükleniyor...</div>
          ) : (
            <div className="computer-status-grid" style={{ marginTop: "14px" }}>
              {filteredPcs.slice(0, 12).map((pc) => {
                const displayDurum =
                  pc.durum === "kullanimda" ? "DOLU" : pc.durum === "rezerve" ? "REZERVE" : "BOŞ";
                return (
                  <div
                    key={pc.id}
                    onClick={() => togglePcStatus(pc)}
                    className={`computer-item ${pc.durum === "kullanimda" ? "busy" : pc.durum === "rezerve" ? "reserved" : "available"}`}
                    title={`${pc.isim} — Durum: ${displayDurum}`}
                  >
                    <span className="computer-number">{pc.isim}</span>
                    <span className="computer-status">{displayDurum}</span>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ marginTop: "auto", paddingTop: "16px" }}>
            <Link
              href="/admin/masalar"
              className="apple-btn-white"
              style={{ width: "100%", justifyContent: "center", textDecoration: "none", boxSizing: "border-box" }}
            >
              <span>+ {Math.max(0, filteredPcs.length - 12)} masa daha — Tüm Masaları Yönet</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* GELEN REZERVASYONLAR KARTI */}
        <div className="dashboard-card" style={{ display: "flex", flexDirection: "column" }}>
          <div className="card-header">
            <div>
              <h2 className="card-title">Gelen Rezervasyonlar</h2>
              <span className="card-subtitle">Anlık müşteri talepleri</span>
            </div>
            <Link href="/admin/rezervasyonlar" className="apple-btn-glass">
              <span>Tüm Talepler</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="reservation-list" style={{ marginTop: "12px", flex: 1 }}>
            {reservations.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "#94a3b8", fontSize: "13.5px" }}>
                <CalendarCheck size={32} style={{ opacity: 0.3, margin: "0 auto 10px" }} />
                <p>Henüz bekleyen rezervasyon bulunmuyor.</p>
              </div>
            ) : (
              reservations.slice(0, 5).map((rez) => (
                <div key={rez.id} className={`reservation-item ${rez.durum === "pending" ? "highlight" : ""}`}>
                  <div className="reservation-icon">🖥️</div>
                  <div className="reservation-info">
                    <div className="res-card-top">
                      <strong className="res-pc-name">{rez.masaIsim || "Masa Rezervasyonu"}</strong>
                      <span className="res-price-pill">₺{rez.toplamTutar}</span>
                    </div>
                    <div className="res-card-meta">
                      <span className="res-meta-item">
                        <User size={12} /> {rez.musteriAdi} ({rez.telefon})
                      </span>
                      <span className="res-meta-item">
                        <Clock size={12} /> {rez.tarih} {rez.saat} ({rez.sure >= 12 ? "Gün Boyu" : "5 Saat"})
                      </span>
                    </div>
                  </div>
                  {rez.durum === "pending" ? (
                    <div className="reservation-actions">
                      <button
                        type="button"
                        onClick={() => handleReservationAction(rez.id, "confirmed")}
                        className="res-btn res-btn-approve"
                        title="Onayla"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReservationAction(rez.id, "rejected")}
                        className="res-btn res-btn-reject"
                        title="Reddet"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <span className={`reservation-status ${rez.durum === "confirmed" ? "confirmed" : "rejected"}`}>
                      {rez.durum === "confirmed" ? "Onaylandı" : "Reddedildi"}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>

          <div style={{ marginTop: "auto", paddingTop: "16px" }}>
            <Link
              href="/admin/rezervasyonlar"
              className="apple-btn-white"
              style={{ width: "100%", justifyContent: "center", textDecoration: "none", boxSizing: "border-box" }}
            >
              <span>Tüm Rezervasyonları İncele</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. MEKAN & MEDYA GALERİSİ KARTI - ZERO OVERFLOW APPLE HEADER */}
      <div className="dashboard-card">
        <div
          className="card-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "14px",
            width: "100%",
          }}
        >
          <div>
            <h2 className="card-title" style={{ fontSize: "18px", fontWeight: 800, color: "#ffffff", margin: 0 }}>
              Mekan &amp; Medya Galerisi
            </h2>
            <span className="card-subtitle" style={{ fontSize: "12.5px", color: "#94a3b8", marginTop: "3px", display: "block" }}>
              Hakkımızda sayfasında sergilenen fotoğraflar
            </span>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <Link href="/admin/ayarlar" className="apple-btn-white" style={{ textDecoration: "none" }}>
              <Edit3 size={15} />
              <span>Fotoğrafları Düzenle</span>
            </Link>
            <Link href="/hakkimizda" target="_blank" className="apple-btn-glass" style={{ textDecoration: "none" }}>
              <ExternalLink size={15} />
              <span>Sitede Gör</span>
            </Link>
          </div>
        </div>

        <div className="media-gallery-grid" style={{ marginTop: "18px" }}>
          {galleryPhotos.map((foto, index) => (
            <div key={foto.src + index} className="media-item">
              <img src={foto.src} alt={foto.badge || "Mekan"} />
              <span className="media-badge">{foto.badge || "Mekan"}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}