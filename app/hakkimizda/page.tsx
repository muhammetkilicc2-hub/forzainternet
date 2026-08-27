"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppWidget from "@/components/public/WhatsAppWidget";

const PHOTOS = [
  { src: "/foto1.jpeg", alt: "Forza Gaming Salonu - Ana Espor Alanı" },
  { src: "/foto2.jpeg", alt: "540Hz BenQ Espor Turnuva Masaları" },
  { src: "/foto3.jpeg", alt: "Pro Gaming RTX 4070 Setup" },
  { src: "/foto4.jpeg", alt: "VIP Espor Akustik Alanı" },
  { src: "/foto5.jpeg", alt: "Ergonomik Espor Koltukları & Ekipmanlar" },
  { src: "/foto6.jpeg", alt: "Forza Turnuva ve Takım Odası" },
];

export default function AboutPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Responsively calculate visible slide count
  useEffect(() => {
    const updateVisible = () => {
      if (typeof window !== "undefined") {
        if (window.innerWidth <= 768) {
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
    return () => window.removeEventListener("resize", updateVisible);
  }, []);

  const maxIndex = Math.max(0, PHOTOS.length - visibleCount);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const lightboxPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLightboxIndex((prev) => (prev === null || prev <= 0 ? PHOTOS.length - 1 : prev - 1));
  };

  const lightboxNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLightboxIndex((prev) => (prev === null || prev >= PHOTOS.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation inside lightbox
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

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 40) lightboxNext();
    if (diff < -40) lightboxPrev();
    setTouchStart(null);
  };

  // Slider touch swipe for mobile gallery
  const [sliderTouchStart, setSliderTouchStart] = useState<number | null>(null);

  const handleSliderTouchStart = (e: React.TouchEvent) => {
    setSliderTouchStart(e.targetTouches[0].clientX);
  };

  const handleSliderTouchEnd = (e: React.TouchEvent) => {
    if (sliderTouchStart === null) return;
    const diff = sliderTouchStart - e.changedTouches[0].clientX;
    if (diff > 40) nextSlide();
    if (diff < -40) prevSlide();
    setSliderTouchStart(null);
  };

  const shiftPercent = currentIndex * (100 / visibleCount);

  return (
    <>
      <Navbar />

      <main className="about">
        {/* ABOUT HERO */}
        <section className="about-hero">
          <div className="about-left">
            <h1>FORZA</h1>
            <h2>HAKKIMIZDA</h2>
            <div className="gold-line"></div>
            <p>
              Antalya'nın Premium Gaming Merkezi olarak, yüksek performanslı espor bilgisayarlarımız, 540 Hz monitörlerimiz ve konforlu ortamımızla oyunculara benzersiz bir deneyim sunuyoruz.
            </p>
            <p>
              Arkadaşlarınızla takım kurup rekabet edebileceğiniz, turnuva heyecanını yaşayabileceğiniz ve kesintisiz fiber hızında oyunun tadını çıkarabileceğiniz modern bir buluşma noktasıyız.
            </p>
          </div>

          <div className="about-right">
            <img src="/foto1.jpeg" alt="Forza İnternet Cafe Salonu" />
          </div>
        </section>

        {/* WHO WE ARE SECTION */}
        <section className="about-info">
          <h2>BİZ KİMİZ?</h2>
          <div className="gold-line"></div>
          <p>
            Forza İnternet &amp; Cafe olarak oyun tutkusunu, en son donanım teknolojilerini ve sıcak bir cafe ortamını bir araya getiriyoruz.
          </p>
          <p>
            En yeni nesil RTX ekran kartlı sistemlerimiz, yüksek hızlı simetrik fiber internetimiz ve profesyonel oyuncu koltuklarımız sayesinde espor tutkunlarına en yüksek kare hızı (FPS) ve minimum gecikmeyi garanti ediyoruz.
          </p>
          <p>
            Sadece oyun oynanan bir mekan değil; turnuvalarla topluluğun birleştiği, dostlukların pekiştiği ve keyifli anıların biriktiği Antalya'nın en sevilen dijital yaşam alanıyız.
          </p>
        </section>

        {/* PHOTO GALLERY SLIDER */}
        <section className="fotogaleri" aria-label="Mekan Fotoğrafları Galerisi">
          <button
            type="button"
            className="photo-nav prev"
            id="prev"
            aria-label="Önceki Fotoğraf"
            onClick={prevSlide}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <div
            className="photo-window"
            onTouchStart={handleSliderTouchStart}
            onTouchEnd={handleSliderTouchEnd}
          >
            <div
              className="photo-track"
              style={{
                transform: `translateX(-${shiftPercent}%)`,
                transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {PHOTOS.map((photo, index) => (
                <img
                  key={index}
                  src={photo.src}
                  alt={photo.alt}
                  onClick={() => setLightboxIndex(index)}
                  style={{
                    flex: `0 0 calc(${100 / visibleCount}% - ${visibleCount > 1 ? 11 : 0}px)`,
                  }}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            className="photo-nav next"
            id="next"
            aria-label="Sonraki Fotoğraf"
            onClick={nextSlide}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </section>

        {/* LIGHTBOX SLIDING MODAL */}
        <div
          className={`lightbox ${lightboxIndex !== null ? "active" : ""}`}
          id="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Büyütülmüş Fotoğraf Görüntüleyici"
          onClick={() => setLightboxIndex(null)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close Button */}
          <button
            type="button"
            className="close-lightbox"
            id="closeLightbox"
            aria-label="Fotoğrafı Kapat"
            onClick={() => setLightboxIndex(null)}
          >
            ×
          </button>

          {/* Previous Arrow */}
          <button
            type="button"
            className="lightbox-nav prev"
            aria-label="Önceki Fotoğraf"
            onClick={lightboxPrev}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          {/* Image & Caption */}
          {lightboxIndex !== null && (
            <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
              <div style={{ position: "relative", display: "inline-block", cursor: "pointer" }}>
                <img
                  src={PHOTOS[lightboxIndex].src}
                  alt={PHOTOS[lightboxIndex].alt}
                  id="lightboxImage"
                  onClick={(e) => {
                    e.stopPropagation();
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    if (clickX < rect.width / 2) {
                      lightboxPrev();
                    } else {
                      lightboxNext();
                    }
                  }}
                  style={{
                    maxWidth: "88vw",
                    maxHeight: "80vh",
                    objectFit: "contain",
                    borderRadius: "16px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.8)",
                    animation: "fadeIn 0.25s ease-out",
                    userSelect: "none",
                  }}
                  title="Sol tarafa dokunarak geri, sağ tarafa dokunarak ileri gidebilirsiniz"
                />
              </div>
              <div
                style={{
                  marginTop: "12px",
                  color: "#fdfbf7",
                  fontSize: "14px",
                  fontWeight: 600,
                  textAlign: "center",
                  background: "rgba(0,0,0,0.6)",
                  padding: "6px 16px",
                  borderRadius: "20px",
                  backdropFilter: "blur(8px)",
                }}
              >
                {PHOTOS[lightboxIndex].alt}
              </div>
            </div>
          )}

          {/* Next Arrow */}
          <button
            type="button"
            className="lightbox-nav next"
            aria-label="Sonraki Fotoğraf"
            onClick={lightboxNext}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>

          {/* Index Counter */}
          {lightboxIndex !== null && (
            <div className="lightbox-counter">
              {lightboxIndex + 1} / {PHOTOS.length}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppWidget />
    </>
  );
}