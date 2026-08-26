import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppWidget from "@/components/public/WhatsAppWidget";
import PhotoGallery from "@/components/public/PhotoGallery";

export const metadata: Metadata = {
  title: "Hakkımızda & Mekan Galerisi — Forza İnternet & Cafe",
  description: "Forza İnternet & Cafe hakkında bilgiler, 540 Hz espor salonu fotoğrafları, donanım özellikleri ve iletişim adresimiz.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="about">
        <div className="about-hero">
          <div className="about-left">
            <span className="about-badge" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "30px",
              background: "rgba(255, 215, 0, 0.12)",
              border: "1px solid rgba(255, 215, 0, 0.3)",
              color: "#ffd700",
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "0.5px",
              width: "fit-content",
              marginBottom: "8px"
            }}>
              ✨ HİKAYEMİZ &amp; VİZYONUMUZ
            </span>
            <h1 style={{ fontSize: "clamp(32px, 4.5vw, 54px)", margin: "8px 0" }}>
              Şehrin Espor Kalbi <span className="gold-text">Forza’da</span> Atıyor
            </h1>
            <h2 style={{ fontSize: "clamp(18px, 2.5vw, 24px)", color: "#fdfbf7", margin: "0 0 16px" }}>
              Kesintisiz Güç, Sıfır Gecikme ve Üst Düzey Konfor
            </h2>
            <div className="gold-line" style={{ marginBottom: "18px" }}></div>
            <p>
              Forza İnternet &amp; Cafe; rekabetçi oyun tutkunlarına, espor takımlarına ve keyifli vakit geçirmek isteyen tüm oyunculara en üst düzey donanım altyapısını sunmak amacıyla kuruldu.
            </p>
            <p>
              64 masalık ferah salonumuzda 240Hz, 360Hz ve Türkiye&apos;nin en iddialı <strong>540 Hz</strong> monitörleriyle donatılmış özel espor istasyonları yer almaktadır. Yüksek hızlı simetrik fiber internet bağlantımızla ping değerlerinizi minimumda tutuyoruz.
            </p>

            <div className="about-metrics" style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "12px",
              marginTop: "20px"
            }}>
              <div className="metric-box" style={{
                background: "rgba(14, 18, 26, 0.7)",
                border: "1px solid rgba(247, 242, 232, 0.12)",
                borderRadius: "16px",
                padding: "16px 12px",
                textAlign: "center"
              }}>
                <strong style={{ display: "block", fontSize: "24px", color: "#ffd700", fontWeight: 800 }}>64</strong>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>Gaming Masası</span>
              </div>
              <div className="metric-box" style={{
                background: "rgba(14, 18, 26, 0.7)",
                border: "1px solid rgba(247, 242, 232, 0.12)",
                borderRadius: "16px",
                padding: "16px 12px",
                textAlign: "center"
              }}>
                <strong style={{ display: "block", fontSize: "24px", color: "#0ea5e9", fontWeight: 800 }}>1000 Mbps</strong>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>Simetrik Fiber</span>
              </div>
              <div className="metric-box" style={{
                background: "rgba(14, 18, 26, 0.7)",
                border: "1px solid rgba(247, 242, 232, 0.12)",
                borderRadius: "16px",
                padding: "16px 12px",
                textAlign: "center"
              }}>
                <strong style={{ display: "block", fontSize: "24px", color: "#10b981", fontWeight: 800 }}>540 Hz</strong>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>Espor Zirvesi</span>
              </div>
            </div>
          </div>

          <div className="about-right">
            <img src="/foto1.jpeg" alt="Forza Gaming Salonu" className="about-hero-img" style={{
              width: "100%",
              height: "420px",
              objectFit: "cover",
              borderRadius: "24px",
              border: "1px solid rgba(247, 242, 232, 0.16)",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)"
            }} />
          </div>
        </div>

        {/* WHO WE ARE SECTION */}
        <section className="about-info" style={{
          background: "rgba(14, 18, 26, 0.8)",
          border: "1px solid rgba(247, 242, 232, 0.14)",
          borderRadius: "24px",
          padding: "36px",
          backdropFilter: "blur(20px)"
        }}>
          <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#fdfbf7", margin: "0 0 8px" }}>BİZ KİMİZ?</h2>
          <div className="gold-line" style={{ marginBottom: "16px" }}></div>
          <p style={{ fontSize: "15px", color: "#cbd5e1", lineHeight: 1.8 }}>
            Forza İnternet &amp; Cafe olarak oyun tutkusunu, en son donanım teknolojilerini ve sıcak bir cafe ortamını bir araya getiriyoruz.
          </p>
          <p style={{ fontSize: "15px", color: "#cbd5e1", lineHeight: 1.8 }}>
            En yeni nesil RTX ekran kartlı sistemlerimiz, yüksek hızlı simetrik fiber internetimiz ve profesyonel oyuncu koltuklarımız sayesinde espor tutkunlarına en yüksek kare hızı (FPS) ve minimum gecikmeyi garanti ediyoruz.
          </p>
          <p style={{ fontSize: "15px", color: "#cbd5e1", lineHeight: 1.8 }}>
            Sadece oyun oynanan bir mekan değil; turnuvalarla topluluğun birleştiği, dostlukların pekiştiği ve keyifli anıların biriktiği Antalya&apos;nın en sevilen dijital yaşam alanıyız.
          </p>
        </section>

        {/* PHOTO GALLERY SLIDER + LIGHTBOX */}
        <PhotoGallery />

        {/* FACILITY HIGHLIGHTS */}
        <div className="about-info-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px"
        }}>
          <div className="about-info-card" style={{
            background: "rgba(14, 18, 26, 0.75)",
            border: "1px solid rgba(247, 242, 232, 0.12)",
            borderRadius: "20px",
            padding: "28px",
            backdropFilter: "blur(20px)"
          }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>⚡</div>
            <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#fdfbf7", marginBottom: "8px" }}>Yüksek Hızlı Fiber İnternet</h3>
            <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.6 }}>Yedekli ve düşük ping garantili 1000 Mbps simetrik espor omurgasıyla takılmadan oynayın.</p>
          </div>

          <div className="about-info-card" style={{
            background: "rgba(14, 18, 26, 0.75)",
            border: "1px solid rgba(247, 242, 232, 0.12)",
            borderRadius: "20px",
            padding: "28px",
            backdropFilter: "blur(20px)"
          }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>🎧</div>
            <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#fdfbf7", marginBottom: "8px" }}>Profesyonel Çevre Birimleri</h3>
            <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.6 }}>HyperX, SteelSeries ve Razer espor serisi kulaklıklar, mekanik klavyeler ve hassas oyuncu fareleri.</p>
          </div>

          <div className="about-info-card" style={{
            background: "rgba(14, 18, 26, 0.75)",
            border: "1px solid rgba(247, 242, 232, 0.12)",
            borderRadius: "20px",
            padding: "28px",
            backdropFilter: "blur(20px)"
          }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>🍔</div>
            <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#fdfbf7", marginBottom: "8px" }}>Zengin Kafe &amp; İçecek Barı</h3>
            <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.6 }}>Oyununuza ara vermeden masanıza sipariş edebileceğiniz sıcak/soğuk kahveler, tost ve atıştırmalıklar.</p>
          </div>
        </div>

        {/* WORKING HOURS & LOCATION */}
        <div className="about-location-card" style={{
          background: "linear-gradient(135deg, rgba(14, 18, 26, 0.95), rgba(20, 25, 36, 0.9))",
          border: "1px solid rgba(247, 242, 232, 0.16)",
          borderRadius: "24px",
          padding: "36px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "24px"
        }}>
          <div className="location-details" style={{ maxWidth: "600px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#fdfbf7", margin: "0 0 8px" }}>Bizi Ziyaret Edin</h2>
            <p style={{ fontSize: "14px", color: "#94a3b8", margin: "0 0 20px" }}>Merkezi konumumuz ve ferah espor merkezimizle haftanın 7 günü hizmetinizdeyiz.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px", color: "#cbd5e1" }}>
              <div><strong style={{ color: "#fdfbf7" }}>📍 Adres:</strong> Kültür Mh. 3809 Sk. Muratpaşa, Antalya</div>
              <div><strong style={{ color: "#fdfbf7" }}>🕒 Saatler:</strong> Her gün 09:00 – 04:00</div>
              <div><strong style={{ color: "#fdfbf7" }}>📞 Telefon:</strong> <a href="tel:05464659693" style={{ color: "#ffd700", fontWeight: 700 }}>0 (546) 465 96 93</a></div>
            </div>
          </div>

          <div className="location-cta">
            <a
              href="https://wa.me/905464659693?text=Merhaba,%20Forza%20İnternet%20Cafe%20hakkında%20bilgi%20almak%20istiyorum."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "16px 28px",
                fontSize: "15px",
                fontWeight: 800,
                borderRadius: "14px",
                textDecoration: "none"
              }}
            >
              💬 WhatsApp ile Yol Tarifi Al
            </a>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppWidget />
    </>
  );
}