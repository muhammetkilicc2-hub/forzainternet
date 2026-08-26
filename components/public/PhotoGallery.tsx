"use client";

import React, { useState } from "react";

interface PhotoItem {
  id?: string;
  src: string;
  title?: string;
  desc?: string;
  badge?: string;
}

const DEFAULT_PHOTOS: PhotoItem[] = [
  { id: "f1", src: "/foto1.jpeg", title: "Ana Espor ve Oyun Salonu", desc: "RGB aydınlatmalı ferah atmosfer", badge: "Ana Salon" },
  { id: "f2", src: "/foto2.jpeg", title: "540 Hz Profesyonel Espor Masaları", desc: "Zirve turnuva monitörleri ve ekipmanları", badge: "540 Hz Alan" },
  { id: "f3", src: "/foto3.jpeg", title: "Özel VIP & Takım Odası", desc: "Akustik yalıtımlı özel antrenman alanı", badge: "VIP Lounge" },
  { id: "f4", src: "/foto4.jpeg", title: "Mekanik Klavye & Espor Kulaklıklar", desc: "Ultra düşük gecikmeli oyuncu donanımları", badge: "Pro Setup" },
  { id: "f5", src: "/foto5.jpeg", title: "Kafe & Dinlenme Alanı", desc: "Sıcak/soğuk içecekler ve atıştırmalıklar", badge: "Ekipman" },
  { id: "f6", src: "/foto6.jpeg", title: "Kafe Genel Görünümü", desc: "Konforlu oyuncu koltukları ve geniş masalar", badge: "Turnuva" },
];

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<PhotoItem[]>(DEFAULT_PHOTOS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("forzaGaleriFotograflar");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) setPhotos(parsed);
      }
    } catch (e) {}
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="fotogaleri">
        <div className="fotogaleri-header">
          <div>
            <h2 className="section-title">Mekan &amp; Ekipman Galerisi</h2>
            <p className="section-subtitle">Oyun salonumuzdan gerçek fotoğraflar</p>
          </div>
          <div className="gallery-controls">
            <button
              type="button"
              className="photo-nav photo-prev"
              onClick={prevSlide}
              aria-label="Önceki Fotoğraf"
            >
              ❮
            </button>
            <span className="photo-counter">
              {currentIndex + 1} / {photos.length}
            </span>
            <button
              type="button"
              className="photo-nav photo-next"
              onClick={nextSlide}
              aria-label="Sonraki Fotoğraf"
            >
              ❯
            </button>
          </div>
        </div>

        <div className="photo-slider-viewport">
          <div
            className="photo-track"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {photos.map((photo, index) => (
              <div
                key={photo.id || photo.src + index}
                className="photo-slide"
                onClick={() => setLightboxIndex(index)}
              >
                <img src={photo.src} alt={photo.title || photo.badge || "Mekan Fotoğrafı"} />
                <div className="photo-slide-caption">
                  <strong>{photo.title || photo.badge || "Forza Salonu"}</strong>
                  <span>{photo.desc || "Forza İnternet & Cafe"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="gallery-thumbnails">
          {photos.map((photo, index) => (
            <button
              type="button"
              key={photo.id || photo.src + index}
              className={`gallery-thumb-btn ${index === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Fotoğraf ${index + 1}`}
            >
              <img src={photo.src} alt="" />
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          className="lightbox-overlay active"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="lightbox-close"
              onClick={() => setLightboxIndex(null)}
              aria-label="Kapat"
            >
              ✕
            </button>
            <img
              src={photos[lightboxIndex]?.src}
              alt={photos[lightboxIndex]?.title || photos[lightboxIndex]?.badge || "Mekan Fotoğrafı"}
              className="lightbox-image"
            />
            <div className="lightbox-caption">
              <h3>{photos[lightboxIndex]?.title || photos[lightboxIndex]?.badge || "Forza Salonu"}</h3>
              <p>{photos[lightboxIndex]?.desc || "Forza İnternet & Cafe"}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}