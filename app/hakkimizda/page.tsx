"use client";

import React, { useState } from "react";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppWidget from "@/components/public/WhatsAppWidget";

const PHOTOS = [
  { src: "/foto2.jpeg", alt: "Forza Gaming Alanı 1" },
  { src: "/foto3.jpeg", alt: "Forza Gaming Alanı 2" },
  { src: "/foto4.jpeg", alt: "Forza Gaming Alanı 3" },
  { src: "/foto6.jpeg", alt: "Forza Gaming Alanı 4" },
  { src: "/foto5.jpeg", alt: "Forza Gaming Alanı 5" },
];

export default function AboutPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= PHOTOS.length - 1 ? 0 : prev + 1));
  };

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
            disabled={currentIndex === 0}
          >
            <i className="fa-solid fa-arrow-left" aria-hidden="true"></i>
          </button>

          <div className="photo-window">
            <div
              className="photo-track"
              style={{
                transform: `translateX(-${currentIndex * (100 / 3)}%)`,
                transition: "transform 0.35s ease",
              }}
            >
              {PHOTOS.map((photo, index) => (
                <img
                  key={index}
                  src={photo.src}
                  alt={photo.alt}
                  onClick={() => setLightboxSrc(photo.src)}
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
            disabled={currentIndex >= PHOTOS.length - 3}
          >
            <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </button>
        </section>

        {/* LIGHTBOX MODAL */}
        <div
          className={`lightbox ${lightboxSrc ? "active" : ""}`}
          id="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Büyütülmüş Fotoğraf Görüntüleyici"
          onClick={() => setLightboxSrc(null)}
        >
          <button
            type="button"
            className="close-lightbox"
            id="closeLightbox"
            aria-label="Fotoğrafı Kapat"
            onClick={() => setLightboxSrc(null)}
          >
            ×
          </button>
          {lightboxSrc && (
            <img
              src={lightboxSrc}
              alt="Büyütülmüş mekan fotoğrafı"
              id="lightboxImage"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppWidget />
    </>
  );
}