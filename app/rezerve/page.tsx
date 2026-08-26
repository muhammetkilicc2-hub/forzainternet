"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppWidget from "@/components/public/WhatsAppWidget";
import { PC, PcKategori, KampanyaFiyatlari } from "@/lib/types";

export default function ReservationPage() {
  const [computers, setComputers] = useState<PC[]>([]);
  const [pricing, setPricing] = useState<KampanyaFiyatlari | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedKategori, setSelectedKategori] = useState<PcKategori>("sari");
  const [selectedPc, setSelectedPc] = useState<PC | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [selectedTime, setSelectedTime] = useState<string>("18:00");
  const [selectedDuration, setSelectedDuration] = useState<number>(3);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"kart" | "nakit" | "havale">("kart");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Verileri Sunucudan Çek
  useEffect(() => {
    async function loadData() {
      try {
        const [resPc, resPricing] = await Promise.all([
          fetch("/api/computers"),
          fetch("/api/pricing"),
        ]);
        const dataPc = await resPc.json();
        const dataPricing = await resPricing.json();

        if (dataPc.computers) setComputers(dataPc.computers);
        if (dataPricing.pricing) setPricing(dataPricing.pricing);
      } catch (err) {
        console.error("Veri yüklenemedi:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Fiyat Hesaplama
  const calculateTotal = (): number => {
    if (!pricing) return selectedDuration * 60;
    const catPrices = pricing[selectedKategori];
    if (selectedDuration === 3) return catPrices.ucSaatlik;
    if (selectedDuration === 5) return catPrices.besSaatlik;
    return catPrices.saatlik * selectedDuration;
  };

  const filteredPcs = computers.filter((p) => p.kategori === selectedKategori);

  const handlePcSelect = (pc: PC) => {
    if (pc.durum !== "bos") return;
    setSelectedPc(pc);
  };

  const handleOpenModal = () => {
    if (!selectedPc) {
      alert("Lütfen rezervasyon yapmak için boş bir masa seçin.");
      return;
    }
    setModalOpen(true);
  };

  const handleSubmitReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPc || !customerName || !customerPhone) {
      alert("Lütfen adınızı ve telefon numaranızı eksiksiz girin.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        musteriAdi: customerName,
        telefon: customerPhone,
        masaId: selectedPc.id,
        masaIsim: selectedPc.isim,
        kategori: selectedKategori,
        tarih: selectedDate,
        saat: selectedTime,
        sure: selectedDuration,
        toplamTutar: calculateTotal(),
        odemeYontemi: paymentMethod,
      };

      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setSuccessMessage("🎉 Rezervasyonunuz başarıyla kaydedildi! Masanız sizin için ayrıldı.");
        // Masayı meşgule al
        setComputers((prev) =>
          prev.map((p) => (p.id === selectedPc.id ? { ...p, durum: "rezerve" } : p))
        );

        // WhatsApp Onay Mesajı Linki
        const waText = encodeURIComponent(
          `*FORZA İNTERNET CAFE REZERVASYON TALEBİ*\n` +
          `👤 Müşteri: ${customerName}\n` +
          `📞 Tel: ${customerPhone}\n` +
          `🖥️ Masa: ${selectedPc.isim} (${selectedKategori.toUpperCase()} MASA)\n` +
          `📅 Tarih/Saat: ${selectedDate} ${selectedTime}\n` +
          `⏳ Süre: ${selectedDuration} Saat\n` +
          `💰 Tutar: ${calculateTotal()} ₺\n` +
          `💳 Ödeme: ${paymentMethod.toUpperCase()}`
        );

        setTimeout(() => {
          window.open(`https://wa.me/905464659693?text=${waText}`, "_blank");
        }, 1200);
      } else {
        alert(data.error || "Rezervasyon kaydedilemedi.");
      }
    } catch {
      alert("Bağlantı hatası oluştu.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="rezerve-page-main" style={{ minHeight: "85vh", padding: "100px 16px 60px" }}>
        <div className="section-container" style={{ maxWidth: "1100px", margin: "0 auto" }}>
          
          <div className="section-header-center" style={{ textAlign: "center", marginBottom: "32px" }}>
            <span className="about-badge">CANLI MASA SEÇİMİ</span>
            <h1 className="para1" style={{ fontSize: "36px", margin: "12px 0 8px" }}>
              Masa <span className="gold-text">Rezervasyonu</span>
            </h1>
            <p className="section-subtitle">Kategori seçin, salon krokisinden boş masanıza dokunun ve yerinizi hemen ayırtın.</p>
          </div>

          {/* STEP 1: KATEGORİ SEKMELERİ */}
          <div className="category-select-tabs" style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap", marginBottom: "28px" }}>
            <button
              type="button"
              className={`cat-tab-btn ${selectedKategori === "sari" ? "active sari" : ""}`}
              onClick={() => { setSelectedKategori("sari"); setSelectedPc(null); }}
              style={{
                padding: "14px 22px",
                borderRadius: "16px",
                border: "1px solid rgba(255,215,0,0.3)",
                background: selectedKategori === "sari" ? "linear-gradient(135deg, #ffd700, #b29400)" : "rgba(14,18,26,0.8)",
                color: selectedKategori === "sari" ? "#000" : "#fff",
                fontWeight: 800,
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              🟡 Standart Gaming ({pricing?.sari?.saatlik ?? 60} ₺/s)
            </button>
            <button
              type="button"
              className={`cat-tab-btn ${selectedKategori === "mavi" ? "active mavi" : ""}`}
              onClick={() => { setSelectedKategori("mavi"); setSelectedPc(null); }}
              style={{
                padding: "14px 22px",
                borderRadius: "16px",
                border: "1px solid rgba(14,165,233,0.3)",
                background: selectedKategori === "mavi" ? "linear-gradient(135deg, #0ea5e9, #0284c7)" : "rgba(14,18,26,0.8)",
                color: selectedKategori === "mavi" ? "#fff" : "#fff",
                fontWeight: 800,
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              🔵 Pro Gaming 360Hz ({pricing?.mavi?.saatlik ?? 70} ₺/s)
            </button>
            <button
              type="button"
              className={`cat-tab-btn ${selectedKategori === "yesil" ? "active yesil" : ""}`}
              onClick={() => { setSelectedKategori("yesil"); setSelectedPc(null); }}
              style={{
                padding: "14px 22px",
                borderRadius: "16px",
                border: "1px solid rgba(16,185,129,0.3)",
                background: selectedKategori === "yesil" ? "linear-gradient(135deg, #10b981, #059669)" : "rgba(14,18,26,0.8)",
                color: selectedKategori === "yesil" ? "#fff" : "#fff",
                fontWeight: 800,
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              🟢 Elite 540Hz VIP ({pricing?.yesil?.saatlik ?? 90} ₺/s)
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
            
            {/* STEP 2: 64 MASA CANLI IZGARA */}
            <div className="dashboard-card" style={{ padding: "24px", background: "rgba(14,18,26,0.9)", borderRadius: "24px", border: "1px solid rgba(247,242,232,0.18)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <h2 style={{ fontSize: "20px", color: "#fdfbf7", margin: 0 }}>
                    {selectedKategori === "sari" ? "Sarı Masalar (PC 1 - PC 24)" : selectedKategori === "mavi" ? "Mavi Masalar (PC 25 - PC 48)" : "Yeşil Masalar (PC 49 - PC 64)"}
                  </h2>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>Seçmek istediğiniz boş masaya tıklayın</span>
                </div>
                <div style={{ display: "flex", gap: "12px", fontSize: "12px" }}>
                  <span style={{ color: "#10b981", display: "flex", alignItems: "center", gap: "4px" }}>🟢 Boş</span>
                  <span style={{ color: "#f43f5e", display: "flex", alignItems: "center", gap: "4px" }}>🔴 Kullanımda</span>
                  <span style={{ color: "#f59e0b", display: "flex", alignItems: "center", gap: "4px" }}>🟡 Rezerve</span>
                </div>
              </div>

              {loading ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>Masalar yükleniyor...</div>
              ) : (
                <div className="pc-container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(68px, 1fr))", gap: "8px", maxHeight: "280px", overflowY: "auto", padding: "8px" }}>
                  {filteredPcs.map((pc) => {
                    const isSelected = selectedPc?.id === pc.id;
                    const isAvailable = pc.durum === "bos";
                    return (
                      <button
                        type="button"
                        key={pc.id}
                        onClick={() => handlePcSelect(pc)}
                        disabled={!isAvailable}
                        className={`comp ${isSelected ? "selected" : ""} ${pc.durum}`}
                        style={{
                          height: "56px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "12px",
                          border: isSelected ? "2px solid #ffffff" : `1px solid ${pc.durum === "bos" ? "rgba(16,185,129,0.4)" : pc.durum === "kullanimda" ? "rgba(244,63,94,0.4)" : "rgba(245,158,11,0.4)"}`,
                          background: isSelected ? "linear-gradient(135deg, #ffd700, #cca400)" : pc.durum === "bos" ? "rgba(16,185,129,0.12)" : pc.durum === "kullanimda" ? "rgba(244,63,94,0.12)" : "rgba(245,158,11,0.12)",
                          color: isSelected ? "#000" : "#fff",
                          cursor: isAvailable ? "pointer" : "not-allowed",
                          opacity: isAvailable ? 1 : 0.65,
                          transition: "all 0.15s ease",
                        }}
                      >
                        <strong style={{ fontSize: "14px" }}>{pc.isim}</strong>
                        <span style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          {isSelected ? "SEÇİLDİ" : pc.durum}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* STEP 3 & 4: SÜRE SEÇİMİ VE REZERVASYON ÖZETİ */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
              
              {/* Tarih / Saat / Süre Formu */}
              <div className="dashboard-card" style={{ padding: "20px", background: "rgba(14,18,26,0.85)", borderRadius: "20px", border: "1px solid rgba(247,242,232,0.14)" }}>
                <h3 style={{ fontSize: "16px", color: "#fdfbf7", marginBottom: "14px" }}>📅 Zaman ve Süre Seçimi</h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Tarih</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="settings-input"
                      style={{ width: "100%", padding: "10px", borderRadius: "10px", background: "rgba(247,242,232,0.06)", border: "1px solid rgba(247,242,232,0.2)", color: "#fff" }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Başlangıç Saati</label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="settings-select"
                      style={{ width: "100%", padding: "10px", borderRadius: "10px", background: "rgba(14,18,26,0.9)", border: "1px solid rgba(247,242,232,0.2)", color: "#fff" }}
                    >
                      {["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00", "00:00"].map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Oyun Süresi</label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px" }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          type="button"
                          key={s}
                          onClick={() => setSelectedDuration(s)}
                          style={{
                            padding: "8px",
                            borderRadius: "8px",
                            border: `1px solid ${selectedDuration === s ? "#ffd700" : "rgba(247,242,232,0.15)"}`,
                            background: selectedDuration === s ? "rgba(255,215,0,0.15)" : "transparent",
                            color: selectedDuration === s ? "#ffd700" : "#fff",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          {s} Saat
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Rezervasyon Özeti & Aksiyon */}
              <div className="dashboard-card" style={{ padding: "20px", background: "rgba(14,18,26,0.85)", borderRadius: "20px", border: "1px solid rgba(247,242,232,0.14)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ fontSize: "16px", color: "#fdfbf7", marginBottom: "14px" }}>📋 Rezervasyon Özeti</h3>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "#94a3b8" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Kategori:</span>
                      <strong style={{ color: "#fff" }}>{selectedKategori === "sari" ? "Sarı Masa (240Hz)" : selectedKategori === "mavi" ? "Mavi Masa (360Hz)" : "Yeşil Masa (540Hz)"}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Seçilen Masa:</span>
                      <strong style={{ color: selectedPc ? "#ffd700" : "#f43f5e" }}>
                        {selectedPc ? selectedPc.isim : "Masa Seçilmedi"}
                      </strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Tarih &amp; Saat:</span>
                      <strong style={{ color: "#fff" }}>{selectedDate} {selectedTime}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Süre:</span>
                      <strong style={{ color: "#fff" }}>{selectedDuration} Saat</strong>
                    </div>
                    <hr style={{ borderColor: "rgba(247,242,232,0.12)", margin: "8px 0" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "18px", alignItems: "center" }}>
                      <span style={{ color: "#fdfbf7", fontWeight: 700 }}>Toplam Tutar:</span>
                      <strong style={{ color: "#ffd700", fontSize: "24px" }}>{calculateTotal()} ₺</strong>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleOpenModal}
                  disabled={!selectedPc}
                  className="btn-primary"
                  style={{
                    width: "100%",
                    padding: "16px",
                    fontSize: "16px",
                    fontWeight: 800,
                    marginTop: "16px",
                    opacity: selectedPc ? 1 : 0.5,
                    cursor: selectedPc ? "pointer" : "not-allowed",
                  }}
                >
                  {selectedPc ? "💳 Bilgileri Gir ve Ayırt" : "Lütfen Yukarıdan Boş Masa Seçin"}
                </button>
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* CHECKOUT MODAL */}
      {modalOpen && (
        <div className="payment-modal active" style={{ display: "flex" }}>
          <div className="payment-box" style={{ maxWidth: "480px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 className="payment-title" style={{ fontSize: "20px", margin: 0 }}>
                Rezervasyon &amp; İletişim
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "18px", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            {successMessage ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: "42px", marginBottom: "12px" }}>🎉</div>
                <h3 style={{ color: "#10b981", fontSize: "18px", marginBottom: "8px" }}>Rezervasyon Alındı!</h3>
                <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "20px" }}>{successMessage}</p>
                <button
                  type="button"
                  onClick={() => { setModalOpen(false); setSuccessMessage(null); setSelectedPc(null); }}
                  className="btn-primary"
                  style={{ width: "100%" }}
                >
                  Tamam
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitReservation} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Adınız Soyadınız *</label>
                  <input
                    type="text"
                    required
                    placeholder="örn: Ahmet Yılmaz"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "rgba(247,242,232,0.08)", border: "1px solid rgba(247,242,232,0.2)", color: "#fff" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Telefon Numaranız *</label>
                  <input
                    type="tel"
                    required
                    placeholder="05XX XXX XX XX"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "rgba(247,242,232,0.08)", border: "1px solid rgba(247,242,232,0.2)", color: "#fff" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Ödeme Yöntemi Tercihi</label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("kart")}
                      style={{
                        padding: "10px 6px",
                        borderRadius: "8px",
                        border: `1px solid ${paymentMethod === "kart" ? "#ffd700" : "rgba(247,242,232,0.15)"}`,
                        background: paymentMethod === "kart" ? "rgba(255,215,0,0.15)" : "transparent",
                        color: paymentMethod === "kart" ? "#ffd700" : "#fff",
                        fontWeight: 700,
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      💳 Kredi Kartı
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("nakit")}
                      style={{
                        padding: "10px 6px",
                        borderRadius: "8px",
                        border: `1px solid ${paymentMethod === "nakit" ? "#ffd700" : "rgba(247,242,232,0.15)"}`,
                        background: paymentMethod === "nakit" ? "rgba(255,215,0,0.15)" : "transparent",
                        color: paymentMethod === "nakit" ? "#ffd700" : "#fff",
                        fontWeight: 700,
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      💵 Kafede Nakit
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("havale")}
                      style={{
                        padding: "10px 6px",
                        borderRadius: "8px",
                        border: `1px solid ${paymentMethod === "havale" ? "#ffd700" : "rgba(247,242,232,0.15)"}`,
                        background: paymentMethod === "havale" ? "rgba(255,215,0,0.15)" : "transparent",
                        color: paymentMethod === "havale" ? "#ffd700" : "#fff",
                        fontWeight: 700,
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      🏦 Havale / FAST
                    </button>
                  </div>
                </div>

                <div style={{ background: "rgba(247,242,232,0.06)", padding: "12px", borderRadius: "12px", fontSize: "13px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Ödenecek Tutar:</span>
                    <strong style={{ color: "#ffd700", fontSize: "16px" }}>{calculateTotal()} ₺</strong>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="payment-submit"
                  style={{ width: "100%", padding: "14px", fontWeight: 800, fontSize: "15px" }}
                >
                  {submitting ? "Kaydediliyor..." : "⚡ Rezervasyonu Onayla"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
      <WhatsAppWidget />
    </>
  );
}