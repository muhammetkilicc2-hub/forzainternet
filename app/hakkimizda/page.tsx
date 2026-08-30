"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppWidget from "@/components/public/WhatsAppWidget";

import { GalleryPhoto } from "@/lib/types";

const DEFAULT_PHOTOS: GalleryPhoto[] = [
  { id: "f1", src: "/foto1.jpeg", alt: "Forza Gaming Salonu - Ana Espor Alanı", caption: "Forza Gaming Salonu - Ana Espor Alanı", badge: "Ana Salon" },
  { id: "f2", src: "/foto2.jpeg", alt: "540Hz BenQ Espor Turnuva Masaları", caption: "540Hz BenQ Espor Turnuva Masaları", badge: "540 Hz Alan" },
  { id: "f3", src: "/foto3.jpeg", alt: "Pro Gaming RTX 4070 Setup", caption: "Pro Gaming RTX 4070 Setup", badge: "Pro Setup" },
  { id: "f4", src: "/foto4.jpeg", alt: "VIP Espor Akustik Alanı", caption: "VIP Espor Akustik Alanı", badge: "VIP Lounge" },
  { id: "f5", src: "/foto5.jpeg", alt: "Ergonomik Espor Koltukları & Ekipmanlar", caption: "Ergonomik Espor Koltukları & Ekipmanlar", badge: "Ekipman" },
  { id: "f6", src: "/foto6.jpeg", alt: "Forza Turnuva ve Takım Odası", caption: "Forza Turnuva ve Takım Odası", badge: "Turnuva" },
];

export default function AboutPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(DEFAULT_PHOTOS);
  const [coverPhoto, setCoverPhoto] = useState<string>("/foto1.jpeg");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    // 1. Yerel Depolamadan Hızlı Yükleme
    try {
      const savedCover = localStorage.getItem("forzaAboutCoverPhoto");
      if (savedCover) {
        setCoverPhoto(savedCover);
      }

      const raw = localStorage.getItem("forzaGaleriFotograflar");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setPhotos(parsed);
          if (!savedCover && parsed.length > 0) {
            const coverItem = parsed.find((p: GalleryPhoto) => p.isCover);
            if (coverItem) setCoverPhoto(coverItem.src);
            else setCoverPhoto(parsed[0].src);
          }
        }
      }
    } catch (e) {}

    // 2. Sunucu API'sinden Canlı Senkronizasyon (Galeri & Ayarlar)
    async function fetchGalleryAndSettings() {
      try {
        const [resGal, resSettings] = await Promise.all([
          fetch("/api/gallery", { cache: "no-store" }),
          fetch("/api/auth/settings", { cache: "no-store" }).catch(() => null),
        ]);

        if (resGal && resGal.ok) {
          const data = await resGal.json();
          if (data.success && Array.isArray(data.photos)) {
            setPhotos(data.photos);
          }
        }

        if (resSettings && resSettings.ok) {
          const sData = await resSettings.json();
          if (sData.settings?.aboutCoverPhoto) {
            setCoverPhoto(sData.settings.aboutCoverPhoto);
          }
        }
      } catch (e) {}
    }
    fetchGalleryAndSettings();

    // 3. Canlı Değişiklikleri Dinleme
    const handleGalleryUpdate = (e: CustomEvent<GalleryPhoto[]>) => {
      if (e.detail && Array.isArray(e.detail)) {
        setPhotos(e.detail);
      } else {
        fetchGalleryAndSettings();
      }
    };

    const handleSettingsUpdate = (e: CustomEvent<{ aboutCoverPhoto?: string }>) => {
      if (e.detail?.aboutCoverPhoto) {
        setCoverPhoto(e.detail.aboutCoverPhoto);
      }
    };

    window.addEventListener("forzaGaleriGuncellendi" as any, handleGalleryUpdate);
    window.addEventListener("forzaAyarlarGuncellendi" as any, handleSettingsUpdate);
    window.addEventListener("storage", fetchGalleryAndSettings);

    const updateVisible = () => {
      if (typeof window !== "undefined") {
        if (window.innerWidth <= 640) {
          setVisibleCount(1);
        } else if (window.innerWidth <= 1024) {
          setVisibleCount(2);
        } else {
          setVisibleCount(3);
        }
      }
    };
    updateVisible();
    window.addEventListener("resize", updateVisible);

    return () => {
      window.removeEventListener("forzaGaleriGuncellendi" as any, handleGalleryUpdate);
      window.removeEventListener("forzaAyarlarGuncellendi" as any, handleSettingsUpdate);
      window.removeEventListener("storage", fetchGalleryAndSettings);
      window.removeEventListener("resize", updateVisible);
    };
  }, []);

  const maxIndex = Math.max(0, photos.length - visibleCount);

  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [visibleCount, maxIndex, currentIndex]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const lightboxPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLightboxIndex((prev) => (prev === null || prev <= 0 ? photos.length - 1 : prev - 1));
  };

  const lightboxNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLightboxIndex((prev) => (prev === null || prev >= photos.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "ArrowLeft") lightboxPrev();
      if (e.key === "ArrowRight") lightboxNext();
      if (e.key === "Escape") setLightboxIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) nextSlide();
    else if (diff < -45) prevSlide();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const lbTouchStartX = useRef<number | null>(null);
  const handleLbTouchStart = (e: React.TouchEvent) => {
    lbTouchStartX.current = e.targetTouches[0].clientX;
  };

  const handleLbTouchEnd = (e: React.TouchEvent) => {
    if (lbTouchStartX.current === null) return;
    const diff = lbTouchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) lightboxNext();
    else if (diff < -50) lightboxPrev();
    lbTouchStartX.current = null;
  };

  return (
    <>
      <Navbar />

      <main className="about" style={{ maxWidth: "1100px", margin: "100px auto 60px", padding: "0 20px", display: "flex", flexDirection: "column", gap: "48px" }}>
        <section className="about-hero" style={{ display: "grid", gridTemplateColumns: visibleCount === 1 ? "1fr" : "1.2fr 1fr", gap: "36px", alignItems: "center" }}>
          <div className="about-left" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255, 215, 0, 0.1)", border: "1px solid rgba(255, 215, 0, 0.3)", padding: "6px 14px", borderRadius: "20px", width: "fit-content", color: "#ffd700", fontSize: "13px", fontWeight: 700 }}>
              Antalya'nın Espor &amp; Gaming Merkezi
            </div>
            <h1 style={{ fontFamily: "'Racing Sans One', sans-serif", fontSize: "clamp(32px, 5vw, 48px)", color: "#ffd700", margin: 0, letterSpacing: "1px", lineHeight: 1.1 }}>
              FORZA GAMING
            </h1>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(20px, 3.5vw, 28px)", color: "#ffffff", fontWeight: 800, margin: 0 }}>
              HAKKIMIZDA
            </h2>
            <div className="gold-line" style={{ width: "64px", height: "4px", background: "#ffd700", borderRadius: "4px", boxShadow: "0 0 12px rgba(255,215,0,0.4)" }}></div>
            <p style={{ fontSize: "15.5px", color: "#cbd5e1", lineHeight: 1.7, margin: 0 }}>
              Antalya'nın Premium Gaming Merkezi olarak, yüksek performanslı espor bilgisayarlarımız, 540 Hz monitörlerimiz ve konforlu ortamımızla oyunculara benzersiz bir deneyim sunuyoruz.
            </p>
            <p style={{ fontSize: "15.5px", color: "#94a3b8", lineHeight: 1.7, margin: 0 }}>
              Arkadaşlarınızla takım kurup rekabet edebileceğiniz, turnuva heyecanını yaşayabileceğiniz ve kesintisiz fiber hızında oyunun tadını çıkarabileceğiniz modern bir buluşma noktasıyız.
            </p>
          </div>

          <div className="about-right" style={{ position: "relative", width: "100%", overflow: "hidden", borderRadius: "20px", border: "1px solid rgba(255, 215, 0, 0.25)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
            <img src={coverPhoto || "/foto1.jpeg"} alt="Forza Gaming Espor Salonu" style={{ width: "100%", height: visibleCount === 1 ? "240px" : "380px", objectFit: "cover", display: "block" }} />
          </div>
        </section>

        <section className="about-info" style={{ background: "rgba(18, 24, 38, 0.88)", border: "1px solid rgba(255, 215, 0, 0.25)", borderRadius: "24px", padding: visibleCount === 1 ? "28px 20px" : "40px 36px", display: "flex", flexDirection: "column", gap: "16px", backdropFilter: "blur(20px)", boxShadow: "0 12px 36px rgba(0,0,0,0.35)" }}>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "24px", fontWeight: 800, color: "#ffffff", margin: 0 }}>BİZ KİMİZ?</h2>
          <div className="gold-line" style={{ width: "48px", height: "3px", background: "#ffd700", borderRadius: "3px" }}></div>
          <p style={{ fontSize: "15px", color: "#cbd5e1", lineHeight: 1.75, margin: 0 }}>Forza İnternet &amp; Cafe olarak oyun tutkusunu, en son donanım teknolojilerini ve sıcak bir cafe ortamını bir araya getiriyoruz.</p>
          <p style={{ fontSize: "15px", color: "#cbd5e1", lineHeight: 1.75, margin: 0 }}>En yeni nesil RTX ekran kartlı sistemlerimiz, yüksek hızlı simetrik fiber internetimiz ve profesyonel espor koltuklarımız sayesinde rekabetçi oyunculara en yüksek kare hızı (FPS) ve minimum gecikmeyi garanti ediyoruz.</p>
          <p style={{ fontSize: "15px", color: "#94a3b8", lineHeight: 1.75, margin: 0 }}>Sadece oyun oynanan bir mekan değil; turnuvalarla espor topluluğunun birleştiği, dostlukların pekiştiği ve keyifli anıların biriktiği Antalya'nın en sevilen dijital yaşam alanıyız.</p>
        </section>

        <section style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <span style={{ fontSize: "12px", color: "#ffd700", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Galeri</span>
              <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(22px, 3.5vw, 28px)", fontWeight: 800, color: "#ffffff", margin: "4px 0 0" }}>Mekan Fotoğrafları</h2>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Önceki"
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: visibleCount === 1 ? "transparent" : "rgba(18, 24, 38, 0.9)",
                  border: visibleCount === 1 ? "none" : "1px solid rgba(255, 215, 0, 0.35)",
                  color: visibleCount === 1 ? "transparent" : "#ffd700",
                  opacity: visibleCount === 1 ? 0 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  pointerEvents: "auto",
                }}
              >
                &lt;
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Sonraki"
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: visibleCount === 1 ? "transparent" : "rgba(18, 24, 38, 0.9)",
                  border: visibleCount === 1 ? "none" : "1px solid rgba(255, 215, 0, 0.35)",
                  color: visibleCount === 1 ? "transparent" : "#ffd700",
                  opacity: visibleCount === 1 ? 0 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  pointerEvents: "auto",
                }}
              >
                &gt;
              </button>
            </div>
          </div>

          <div style={{ width: "100%", overflow: "hidden", borderRadius: "20px", position: "relative", touchAction: "pan-y" }} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
            <div style={{ display: "flex", transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`, transition: "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)", willChange: "transform" }}>
              {photos.map((photo, index) => (
                <div key={photo.id || index} style={{ flex: `0 0 ${100 / visibleCount}%`, padding: "0 8px", boxSizing: "border-box" }}>
                  <div onClick={() => setLightboxIndex(index)} style={{ position: "relative", borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(255, 215, 0, 0.2)", cursor: "pointer" }}>
                    <img src={photo.src} alt={photo.alt || photo.caption || photo.badge || "Mekan Fotoğrafı"} style={{ width: "100%", height: visibleCount === 1 ? "240px" : "220px", objectFit: "cover", display: "block" }} />
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "10px 14px", background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)", color: "#f8fafc", fontSize: "13px", fontWeight: 600 }}>{photo.caption || photo.badge || "Forza Espor Alanı"}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Indicators */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "8px" }}>
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                aria-label={`Fotoğraf ${i + 1}`}
                style={{
                  width: currentIndex === i ? "24px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  background: currentIndex === i ? "#ffd700" : "rgba(255, 255, 255, 0.2)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  padding: 0,
                }}
              />
            ))}
          </div>
        </section>

        {lightboxIndex !== null && photos[lightboxIndex] && (
          <div role="dialog" aria-modal="true" onClick={() => setLightboxIndex(null)} onTouchStart={handleLbTouchStart} onTouchEnd={handleLbTouchEnd} style={{ position: "fixed", inset: 0, background: "rgba(3, 7, 18, 0.95)", backdropFilter: "blur(20px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <button type="button" onClick={() => setLightboxIndex(null)} style={{ position: "absolute", top: "20px", right: "20px", background: "none", border: "none", color: "#fff", fontSize: "32px", cursor: "pointer" }}>&times;</button>
            <button
              type="button"
              onClick={lightboxPrev}
              style={{
                position: "absolute",
                left: "20px",
                background: "none",
                border: visibleCount === 1 ? "none" : "1px solid #ffd700",
                borderRadius: "50%",
                color: visibleCount === 1 ? "transparent" : "#ffd700",
                opacity: visibleCount === 1 ? 0 : 1,
                width: visibleCount === 1 ? "60px" : "50px",
                height: visibleCount === 1 ? "100%" : "50px",
                cursor: "pointer",
                pointerEvents: "auto",
              }}
            >
              &lt;
            </button>
            <div onClick={(e) => e.stopPropagation()} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <img src={photos[lightboxIndex].src} alt={photos[lightboxIndex].alt || photos[lightboxIndex].caption || "Mekan Fotoğrafı"} style={{ maxWidth: "90vw", maxHeight: "75vh", borderRadius: "16px" }} />
              <div style={{ color: "#fff", marginTop: "12px" }}>{photos[lightboxIndex].caption || photos[lightboxIndex].badge || "Mekan"} ({lightboxIndex + 1} / {photos.length})</div>
            </div>
            <button
              type="button"
              onClick={lightboxNext}
              style={{
                position: "absolute",
                right: "20px",
                background: "none",
                border: visibleCount === 1 ? "none" : "1px solid #ffd700",
                borderRadius: "50%",
                color: visibleCount === 1 ? "transparent" : "#ffd700",
                opacity: visibleCount === 1 ? 0 : 1,
                width: visibleCount === 1 ? "60px" : "50px",
                height: visibleCount === 1 ? "100%" : "50px",
                cursor: "pointer",
                pointerEvents: "auto",
              }}
            >
              &gt;
            </button>
          </div>
        )}
      </main>

      <Footer />
      <WhatsAppWidget />
    </>
  );
}