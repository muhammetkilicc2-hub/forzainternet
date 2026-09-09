"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Edit3, ExternalLink } from "lucide-react";
import { subscribeLiveUpdate } from "@/lib/liveSync";

interface GalleryPhoto {
  src: string;
  badge?: string;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    visitors: { total: 0, today: 0, lastDate: "" },
    pageViews: { home: 0, ozellikler: 0, hakkimizda: 0 },
    clicks: { map: 0, phone: 0 }
  });
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>([
    { src: "/foto1.jpeg", badge: "Ana Salon" },
    { src: "/foto2.jpeg", badge: "VIP Espor" },
    { src: "/foto3.jpeg", badge: "Pro Setup" },
    { src: "/foto4.jpeg", badge: "VIP Lounge" },
    { src: "/foto5.jpeg", badge: "Ekipman" },
    { src: "/foto6.jpeg", badge: "Turnuva" },
  ]);

  useEffect(() => {
    loadData();
    try {
      const raw = localStorage.getItem("forzaGaleriFotograflar");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setGalleryPhotos(parsed);
      }
    } catch (e) {}

    const unsubGal = subscribeLiveUpdate("gallery", (photos) => {
      if (photos && Array.isArray(photos)) setGalleryPhotos(photos);
    });

    return () => {
      unsubGal();
    };
  }, []);

  async function loadData() {
    try {
      const resAn = await fetch("/api/analytics", { cache: "no-store" });
      const dataAn = await resAn.json();
      if (dataAn.success && dataAn.analytics) {
        setAnalytics(dataAn.analytics);
      }
    } catch(e) {}

    try {
      const resGal = await fetch("/api/gallery", { cache: "no-store" });
      const dataGal = await resGal.json();

      if (dataGal.photos && Array.isArray(dataGal.photos) && dataGal.photos.length > 0) {
        setGalleryPhotos(dataGal.photos);
      }
    } catch (err) {
      console.error("Dashboard veri yükleme hatası:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="dashboard-content" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", width: "100%" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#ffffff", margin: 0, letterSpacing: "-0.3px" }}>
            Ana Sayfa
          </h1>
          <span style={{ fontSize: "13px", color: "#cbd5e1", marginTop: "4px", display: "block" }}>
            Forza E-Sports & Gaming Yönetim Paneli
          </span>
        </div>
      </div>

      {/* İSTATİSTİKLER VE ZİYARETÇİ ANALİZİ */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
        
        {/* Toplam Ziyaretçi */}
        <div style={{ background: "rgba(18, 24, 38, 0.88)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "16px", padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(52, 211, 153, 0.15)", color: "#34d399", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "20px" }}>
            <i className="fa-solid fa-users"></i>
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600, marginBottom: "4px" }}>TOPLAM ZİYARETÇİ</div>
            <div style={{ fontSize: "24px", color: "#fff", fontWeight: 800 }}>{analytics.visitors?.total || 0}</div>
          </div>
        </div>

        {/* Bugünkü Ziyaretçi */}
        <div style={{ background: "rgba(18, 24, 38, 0.88)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "16px", padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "20px" }}>
            <i className="fa-solid fa-user-clock"></i>
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600, marginBottom: "4px" }}>BUGÜNKÜ ZİYARETÇİ</div>
            <div style={{ fontSize: "24px", color: "#fff", fontWeight: 800 }}>{analytics.visitors?.today || 0}</div>
          </div>
        </div>

        {/* Yol Tarifi */}
        <div style={{ background: "rgba(18, 24, 38, 0.88)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "16px", padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(255, 215, 0, 0.15)", color: "#ffd700", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "20px" }}>
            <i className="fa-solid fa-map-location-dot"></i>
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600, marginBottom: "4px" }}>YOL TARİFİ TIKLAMA</div>
            <div style={{ fontSize: "24px", color: "#fff", fontWeight: 800 }}>{analytics.clicks?.map || 0}</div>
          </div>
        </div>

        {/* Bizi Ara */}
        <div style={{ background: "rgba(18, 24, 38, 0.88)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "16px", padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(244, 63, 94, 0.15)", color: "#f43f5e", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "20px" }}>
            <i className="fa-solid fa-phone"></i>
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600, marginBottom: "4px" }}>BİZİ ARA TIKLAMA</div>
            <div style={{ fontSize: "24px", color: "#fff", fontWeight: 800 }}>{analytics.clicks?.phone || 0}</div>
          </div>
        </div>
      </div>

      <div className="dashboard-card" style={{ padding: "32px 24px", textAlign: "center", background: "linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, rgba(18, 24, 38, 0.9) 100%)" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "12px" }}>Forza Gaming Paneline Hoşgeldiniz</h2>
        <p style={{ color: "#94a3b8", fontSize: "14.5px", marginBottom: "24px", maxWidth: "600px", margin: "0 auto 24px" }}>
          Sol menüden kampanya fiyatlarını güncelleyebilir, sistem ayarlarından fotoğrafları ve genel site bilgilerini yönetebilirsiniz.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <Link href="/admin/kampanya" className="apple-btn-glass">Fiyat & Kampanya Ayarları</Link>
          <Link href="/admin/ayarlar" className="apple-btn-white">Sistem Ayarları</Link>
        </div>
      </div>

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

        <style>{`
          @media (max-width: 768px) {
            .mobile-hide-photo { display: none !important; }
          }
        `}</style>
        <div className="media-gallery-grid" style={{ marginTop: "18px" }}>
          {galleryPhotos.slice(0, 4).map((foto, index) => (
            <div key={foto.src + index} className={`media-item ${index >= 2 ? 'mobile-hide-photo' : ''}`}>
              <img src={foto.src} alt={foto.badge || "Mekan"} />
              <span className="media-badge">{foto.badge || "Mekan"}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}