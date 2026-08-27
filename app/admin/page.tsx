"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PC, PcDurum, Rezervasyon, AdminStats } from "@/lib/types";
import { useToast } from "@/components/admin/Toast";

export default function AdminDashboardPage() {
  const { showToast } = useToast();
  const [computers, setComputers] = useState<PC[]>([]);
  const [reservations, setReservations] = useState<Rezervasyon[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [galleryPhotos, setGalleryPhotos] = useState<Array<{ src: string; badge?: string }>>([
    { src: "/foto1.jpeg", badge: "Ana Salon" },
    { src: "/foto2.jpeg", badge: "540 Hz Alan" },
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
        if (Array.isArray(parsed) && parsed.length > 0) setGalleryPhotos(parsed);
      }
    } catch (e) {}
    const interval = setInterval(loadData, 10000); // 10 sn otomatik yenileme
    return () => clearInterval(interval);
  }, []);

  async function loadData() {
    try {
      const [resPc, resRez] = await Promise.all([
        fetch("/api/computers", { cache: "no-store" }),
        fetch("/api/reservations", { cache: "no-store" }),
      ]);
      const dataPc = await resPc.json();
      const dataRez = await resRez.json();

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
            localRezList = parsed.map((b: { id?: string; musteri?: string; baslik?: string; telefon?: string; pcler?: string[]; masaId?: string; masaIsim?: string; kampanya?: string; tarih?: string; sure?: string | number; tutar?: number | string; durum?: string; okundu?: boolean }) => ({
              id: b.id || `loc-${Date.now()}-${Math.random()}`,
              musteriAdi: b.musteri || b.baslik || "Müşteri",
              telefon: b.telefon || "0546 465 96 93",
              masaId: Array.isArray(b.pcler) ? b.pcler.join(", ") : b.masaId || "PC",
              masaIsim: Array.isArray(b.pcler) ? b.pcler.join(", ") : b.masaIsim || "Seçilen Masalar",
              kategori: b.kampanya?.toLowerCase().includes("60") ? "sari" : b.kampanya?.toLowerCase().includes("70") ? "mavi" : "yesil",
              tarih: b.tarih ? b.tarih.split("T")[0] : new Date().toISOString().split("T")[0],
              saat: b.tarih ? new Date(b.tarih).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }) : "19:00",
              sure: typeof b.sure === "number" ? b.sure : (typeof b.sure === "string" && b.sure.includes("Gün") ? 12 : 5),
              toplamTutar: Number(b.tutar) || 200,
              odemeYontemi: "kart",
              durum: (b.durum === "confirmed" ? "confirmed" : b.durum === "rejected" ? "rejected" : "pending") as Rezervasyon["durum"],
              olusturuldu: b.tarih || new Date().toISOString(),
              okundu: Boolean(b.okundu),
            }));
          }
        }
      } catch (e) {}

      const serverRez = dataRez.reservations || [];
      const rezMap = new Map<string, Rezervasyon>();
      localRezList.forEach((r) => rezMap.set(r.id, r));
      serverRez.forEach((r: Rezervasyon) => rezMap.set(r.id, r));
      const mergedRez = Array.from(rezMap.values()).sort((a, b) => new Date(b.olusturuldu).getTime() - new Date(a.olusturuldu).getTime());
      setReservations(mergedRez);
    } catch (err) {
      console.error("Dashboard yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  }

  // Masanın durumunu döngüsel değiştir (Boş -> Kullanımda -> Rezerve -> Boş)
  const togglePcStatus = async (pc: PC) => {
    const nextStatus: PcDurum =
      pc.durum === "bos" ? "kullanimda" : pc.durum === "kullanimda" ? "rezerve" : "bos";

    // 1. React State Güncelle
    const updatedList: PC[] = computers.map((p) => (p.id === pc.id ? { ...p, durum: nextStatus } : p));
    setComputers(updatedList);
    setStats((prev) =>
      prev
        ? {
            ...prev,
            aktifPc: updatedList.filter((p) => p.durum === "kullanimda").length,
            bosPc: updatedList.filter((p) => p.durum === "bos").length,
            rezervePc: updatedList.filter((p) => p.durum === "rezerve").length,
          }
        : null
    );

    // 2. localStorage Senkronizasyonu
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
      showToast("Masa Güncellendi", `${pc.isim} durumu: ${nextStatus.toUpperCase()}`, "success");
    } catch {
      showToast("Bilgi", "Yerel olarak kaydedildi", "info");
    }
  };

  // Rezervasyon Onayla / Reddet
  const handleReservationAction = async (id: string, durum: "confirmed" | "rejected") => {
    // 1. React State Güncelle
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, durum, okundu: true } : r))
    );

    // 2. LocalStorage Senkronizasyonu
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

      // Onaylandıysa masaları kullanıma al
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

    // 3. API Sunucusuna Bildir
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
        durum === "confirmed" ? "Masa kullanıma hazırlandı ve aktifleştirildi." : "Talep iptal edildi.",
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
    <main className="dashboard-content" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      
      {/* 1. iOS STATS WIDGETS */}
      <div className="ios-widgets-grid">
        <div className="ios-stat-widget">
          <div className="ios-widget-icon">🖥️</div>
          <div className="ios-widget-info">
            <span>Toplam Masa</span>
            <strong>{stats ? stats.toplamPc : 64}</strong>
          </div>
        </div>

        <div className="ios-stat-widget">
          <div className="ios-widget-icon icon-busy">🎮</div>
          <div className="ios-widget-info">
            <span>Kullanımda</span>
            <strong style={{ color: "var(--a-danger)" }}>{stats ? stats.aktifPc : 0}</strong>
          </div>
        </div>

        <div className="ios-stat-widget">
          <div className="ios-widget-icon icon-available">🟢</div>
          <div className="ios-widget-info">
            <span>Boş Masa</span>
            <strong style={{ color: "var(--a-success)" }}>{stats ? stats.bosPc : 0}</strong>
          </div>
        </div>
      </div>

      {/* 2. DASHBOARD MAIN 2-COL GRID */}
      <div className="ios-dashboard-main-grid" style={{ marginTop: "28px" }}>
        
        {/* MASA DURUMLARI KARTI (İLK 12 MASA) */}
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Masa Durumları</h2>
              <span className="card-subtitle">Hızlı durum değiştirmek için masaya dokunun</span>
            </div>
            <Link href="/admin/masalar" className="view-all">
              Tümü (64) ➔
            </Link>
          </div>

          <div className="computer-filter-tabs">
            <button
              type="button"
              className={`filter-tab ${filterCat === "tumu" ? "active" : ""}`}
              onClick={() => setFilterCat("tumu")}
            >
              Tümü
            </button>
            <button
              type="button"
              className={`filter-tab ${filterCat === "sari" ? "active" : ""}`}
              onClick={() => setFilterCat("sari")}
            >
              60 TL
            </button>
            <button
              type="button"
              className={`filter-tab ${filterCat === "mavi" ? "active" : ""}`}
              onClick={() => setFilterCat("mavi")}
            >
              70 TL
            </button>
            <button
              type="button"
              className={`filter-tab ${filterCat === "yesil" ? "active" : ""}`}
              onClick={() => setFilterCat("yesil")}
            >
              90 TL
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "30px", color: "#94a3b8" }}>Yükleniyor...</div>
          ) : (
            <div className="computer-status-grid" style={{ marginTop: "12px" }}>
              {filteredPcs.slice(0, 12).map((pc) => (
                <div
                  key={pc.id}
                  onClick={() => togglePcStatus(pc)}
                  className={`computer-item ${pc.durum === "kullanimda" ? "busy" : pc.durum === "rezerve" ? "reserved" : "available"}`}
                >
                  <span className="computer-number">{pc.isim}</span>
                  <span className="computer-status">{pc.durum}</span>
                </div>
              ))}
            </div>
          )}

          <Link href="/admin/masalar" className="computer-more-link visible">
            + {Math.max(0, filteredPcs.length - 12)} masa daha — Tüm Masaları Yönet
          </Link>
        </div>

        {/* GELEN REZERVASYONLAR KARTI */}
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Gelen Rezervasyonlar</h2>
              <span className="card-subtitle">Anlık müşteri talepleri</span>
            </div>
            <Link href="/admin/rezervasyonlar" className="view-all">
              Tümü ➔
            </Link>
          </div>

          <div className="reservation-list" style={{ marginTop: "8px" }}>
            {reservations.length === 0 ? (
              <p style={{ textAlign: "center", padding: "20px", color: "#94a3b8", fontSize: "13px" }}>
                Henüz rezervasyon bulunmuyor.
              </p>
            ) : (
              reservations.slice(0, 6).map((rez) => (
                <div key={rez.id} className={`reservation-item ${rez.durum === "pending" ? "highlight" : ""}`}>
                  <div className="reservation-icon">🖥️</div>
                  <div className="reservation-info">
                    <div className="res-card-top">
                      <strong className="res-pc-name">{rez.masaIsim || "Masa Rezervasyonu"}</strong>
                      <span className="res-price-pill">₺{rez.toplamTutar}</span>
                    </div>
                    <div className="res-card-meta">
                      <span className="res-meta-item">👤 {rez.musteriAdi} ({rez.telefon})</span>
                      <span className="res-meta-item">⏱️ {rez.sure >= 12 ? "Gün Boyu" : "5 Saat"}</span>
                      <span className="res-meta-item res-time" style={{ color: "var(--cream-gold)", fontWeight: 700 }}>
                        🕒 Randevu: {rez.tarih} {rez.saat}
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
                        ✓
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReservationAction(rez.id, "rejected")}
                        className="res-btn res-btn-reject"
                        title="Reddet"
                      >
                        ✕
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

          <Link href="/admin/rezervasyonlar" className="computer-more-link visible" style={{ justifyContent: "center", textAlign: "center", marginTop: "auto" }}>
            Tüm Rezervasyonları Gör ➔
          </Link>
        </div>

      </div>

      {/* 3. MEKAN & MEDYA GALERİSİ KARTI */}
      <div className="dashboard-card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Mekan &amp; Medya Galerisi</h2>
            <span className="card-subtitle">Hakkımızda sayfasında sergilenen fotoğraflar</span>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <Link href="/admin/ayarlar" className="view-all" style={{ color: "var(--cream-gold)" }}>
              Fotoğrafları Düzenle ➔
            </Link>
            <Link href="/hakkimizda" target="_blank" className="view-all">
              Sitede Gör ↗
            </Link>
          </div>
        </div>

        <div className="media-gallery-grid">
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