"use client";

import React, { useState } from "react";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppWidget from "@/components/public/WhatsAppWidget";

interface TierData {
  id: "sari" | "mavi" | "yesil";
  name: string;
  badge: string;
  badgeIcon: string;
  hz: string;
  specs: { icon: string; text: string }[];
  prices: { label: string; amount: number }[];
  pcs: string[];
}

const TIERS: TierData[] = [
  {
    id: "sari",
    name: "60 TL Masa",
    badge: "Standart Gaming",
    badgeIcon: "fa-solid fa-microchip",
    hz: "144 Hz Espor Ekran",
    specs: [
      { icon: "fa-solid fa-desktop", text: "144 Hz Gaming Espor Monitör" },
      { icon: "fa-solid fa-microchip", text: "Nvidia GeForce RTX 3060" },
      { icon: "fa-solid fa-cpu", text: "Intel Core i5 Yüksek Performans" },
      { icon: "fa-solid fa-memory", text: "16 GB DDR4 Yüksek Hızlı RAM" },
    ],
    prices: [
      { label: "5 Saat Paket", amount: 200 },
      { label: "Gün Boyu Paket", amount: 400 },
    ],
    pcs: ["PC 1", "PC 2", "PC 4", "PC 5", "PC 6", "PC 8", "PC 9", "PC 10"],
  },
  {
    id: "mavi",
    name: "70 TL Masa",
    badge: "Pro Espor Gaming",
    badgeIcon: "fa-solid fa-bolt",
    hz: "240 Hz Espor Ekran",
    specs: [
      { icon: "fa-solid fa-desktop", text: "240 Hz Ultra Espor Monitör" },
      { icon: "fa-solid fa-microchip", text: "Nvidia GeForce RTX 3060 OC" },
      { icon: "fa-solid fa-cpu", text: "Intel Core i5 Gaming İşlemci" },
      { icon: "fa-solid fa-memory", text: "16 GB DDR4 Yüksek Hızlı RAM" },
    ],
    prices: [
      { label: "5 Saat Paket", amount: 250 },
      { label: "Gün Boyu Paket", amount: 500 },
    ],
    pcs: [
      "PC 11", "PC 12", "PC 14", "PC 15", "PC 16", "PC 17", "PC 18",
      "PC 20", "PC 22", "PC 24", "PC 25", "PC 26", "PC 27", "PC 28",
      "PC 29", "PC 31", "PC 32", "PC 33", "PC 34", "PC 36", "PC 37", "PC 42"
    ],
  },
  {
    id: "yesil",
    name: "90 TL Masa",
    badge: "Ultra VIP Espor",
    badgeIcon: "fa-solid fa-crown",
    hz: "360 - 540 Hz Espor Ekran",
    specs: [
      { icon: "fa-solid fa-desktop", text: "360-540 Hz Turnuva Monitörü" },
      { icon: "fa-solid fa-microchip", text: "RTX 3070 Ti / RTX 5060" },
      { icon: "fa-solid fa-cpu", text: "AMD Ryzen 7 7800X3D Canavarı" },
      { icon: "fa-solid fa-memory", text: "32 GB DDR5 Yüksek Frekans RAM" },
    ],
    prices: [
      { label: "5 Saat Paket", amount: 350 },
      { label: "Gün Boyu Paket", amount: 700 },
    ],
    pcs: [
      "PC 38", "PC 40", "PC 43", "PC 44", "PC 45", "PC 46", "PC 47",
      "PC 48", "PC 49", "PC 50", "PC 51", "PC 52", "PC 54", "PC 55",
      "PC 56", "PC 57", "PC 59", "PC 60"
    ],
  },
];

export default function ReservationPage() {
  const [selectedPrices, setSelectedPrices] = useState<Record<string, { label: string; amount: number }>>({
    sari: TIERS[0].prices[0],
    mavi: TIERS[1].prices[0],
    yesil: TIERS[2].prices[0],
  });
  const [selectedPcsByTier, setSelectedPcsByTier] = useState<Record<string, string[]>>({
    sari: ["PC 1"],
    mavi: ["PC 11"],
    yesil: ["PC 38"],
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [activeModalTier, setActiveModalTier] = useState<TierData>(TIERS[0]);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "balance">("card");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectPrice = (tierId: string, priceObj: { label: string; amount: number }) => {
    setSelectedPrices((prev) => ({ ...prev, [tierId]: priceObj }));
  };

  const handleTogglePc = (tierId: string, pcName: string) => {
    setSelectedPcsByTier((prev) => {
      const current = prev[tierId] || [];
      if (current.includes(pcName)) {
        if (current.length === 1) return prev;
        return { ...prev, [tierId]: current.filter((p) => p !== pcName) };
      } else {
        if (current.length >= 3) {
          alert("Aynı anda en fazla 3 masa seçebilirsiniz.");
          return prev;
        }
        return { ...prev, [tierId]: [...current, pcName] };
      }
    });
  };

  const handleOpenPayment = (tier: TierData) => {
    let pcs = selectedPcsByTier[tier.id] || [];
    if (pcs.length === 0) {
      pcs = [tier.pcs[0]];
      setSelectedPcsByTier((prev) => ({ ...prev, [tier.id]: pcs }));
    }
    setActiveModalTier(tier);
    setModalOpen(true);
  };

  const calculateTotal = () => {
    const price = selectedPrices[activeModalTier.id]?.amount || 0;
    const count = (selectedPcsByTier[activeModalTier.id] || []).length;
    return price * count;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 16);
    let formatted = val.replace(/(.{4})/g, "$1 ").trim();
    setCardNumber(formatted);
  };

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setCardExpiry(val);
  };

  const handleSubmitReservation = async () => {
    if (!name.trim() || !surname.trim()) {
      alert("Lütfen ad ve soyadınızı giriniz.");
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      alert("Lütfen geçerli bir telefon numarası giriniz.");
      return;
    }

    setIsSubmitting(true);

    const pcs = selectedPcsByTier[activeModalTier.id] || [];
    const total = calculateTotal();
    const durationLabel = selectedPrices[activeModalTier.id]?.label || "5 Saat Paket";

    try {
      await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          musteriAdi: `${name.trim()} ${surname.trim()}`,
          telefon: phone.trim(),
          masaId: pcs.join(", "),
          masaIsim: pcs.join(", "),
          kategori: activeModalTier.id,
          tarih: new Date().toISOString().split("T")[0],
          saat: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
          sure: durationLabel.includes("Gün") ? 12 : 5,
          toplamTutar: total,
          odemeYontemi: paymentMethod === "card" ? "kart" : "nakit",
        }),
      });

      alert(`✅ Rezervasyon Talebiniz Alındı!\n\nSeçilen Masalar: ${pcs.join(", ")}\nToplam Tutar: ₺${total}\n\nEn kısa sürede onay iletilecektir.`);
      setModalOpen(false);
      setName("");
      setSurname("");
      setPhone("");
      setCardNumber("");
      setCardExpiry("");
      setCardCvv("");
    } catch (err) {
      alert("Rezervasyon kaydedilirken bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main>
        <section className="kampanyalar" id="kampanyalar">
          <h2>Kampanyalarımız</h2>
          <p className="kampanya-intro">
            İhtiyacına en uygun donanım paketini seç, masanı belirle ve anında yerini ayırt.
          </p>
          <p className="kampanya-alt">
            Önce bir fiyat tarifesi (5 Saat / Gün Boyu) seçip ardından dilediğin masaya tıklayın.
          </p>

          <div className="kampanya-kartlari">
            {TIERS.map((tier) => {
              const currentPrice = selectedPrices[tier.id];
              const currentPcs = selectedPcsByTier[tier.id] || [];

              return (
                <div key={tier.id} className={`kart ${tier.id}`} data-tier={tier.id}>
                  <div className="pc-card">
                    <div className="kart-baslik">
                      <h3>{tier.name}</h3>
                    </div>
                    <div className="analiz-rozeti">
                      <i className={tier.badgeIcon} aria-hidden="true"></i> {tier.badge}
                    </div>
                    <h4 className="hz-baslik">{tier.hz}</h4>
                    <ul className="donanim-listesi">
                      {tier.specs.map((spec, sIdx) => (
                        <li key={sIdx}>
                          <i className={spec.icon} aria-hidden="true"></i> {spec.text}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="fiyat-bolumu">
                    <div className="bolum-basligi">
                      <i className="fa-solid fa-tags" aria-hidden="true"></i> Süreli Tarife Seçin
                    </div>

                    {tier.prices.map((p, pIdx) => {
                      const isSelected = currentPrice?.label === p.label;
                      return (
                        <div
                          key={pIdx}
                          className={`fiyat ${isSelected ? "secili-fiyat" : ""}`}
                          role="button"
                          tabIndex={0}
                          aria-label={`${tier.name} ${p.label}`}
                          onClick={() => handleSelectPrice(tier.id, p)}
                          style={{
                            cursor: "pointer",
                            borderColor: isSelected ? "var(--cream-gold)" : undefined,
                            background: isSelected ? "rgba(255, 215, 0, 0.12)" : undefined,
                          }}
                        >
                          <span>{p.label}</span>
                          <strong>{p.amount} TL</strong>
                        </div>
                      );
                    })}

                    <div className="bolum-basligi" style={{ marginTop: "14px" }}>
                      <i className="fa-solid fa-desktop" aria-hidden="true"></i> Masa Seçin (Maks. 3)
                    </div>

                    <div className="pc-container" aria-label={`${tier.name} Bilgisayarları`}>
                      {tier.pcs.map((pcName) => {
                        const isSelected = currentPcs.includes(pcName);
                        return (
                          <div
                            key={pcName}
                            className={`comp ${isSelected ? "secili" : ""}`}
                            tabIndex={0}
                            role="button"
                            aria-label={pcName}
                            onClick={() => handleTogglePc(tier.id, pcName)}
                          >
                            {pcName}
                          </div>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      className="odeme-btn"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        marginTop: "16px",
                        width: "100%",
                        cursor: "pointer",
                      }}
                      aria-label="Ödemeye Geç"
                      onClick={() => handleOpenPayment(tier)}
                    >
                      <i className="fa-solid fa-credit-card"></i>{" "}
                      {currentPcs.length > 0
                        ? `${currentPcs.length} Masa Seçildi (₺${(currentPrice?.amount || 0) * currentPcs.length}) — Ödemeye Geç`
                        : "Ödemeye Geç"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="uyari">
            * Süreli peşin ödemeli kampanyalarda geçerlidir. İptal ve iade koşulları işletme kurallarına tabidir.
          </p>
        </section>
      </main>

      {modalOpen && (
        <div
          className="payment-modal active"
          id="paymentModal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="paymentTitle"
          style={{ display: "flex" }}
        >
          <div className="payment-box">
            <button
              type="button"
              className="payment-close"
              id="paymentClose"
              aria-label="Ödemeyi Kapat"
              onClick={() => setModalOpen(false)}
            >
              <i className="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>

            <h2 className="payment-title" id="paymentTitle">
              Masa Rezervasyonu
            </h2>
            <p className="payment-subtitle">
              Seçtiğiniz bilgisayarlar için rezervasyon detaylarını tamamlayın.
            </p>

            <div className="payment-summary">
              <div className="payment-summary-row">
                <span>Seçilen Bilgisayarlar</span>
                <strong id="paymentPc">
                  {(selectedPcsByTier[activeModalTier.id] || []).join(", ") || "PC -"}
                </strong>
              </div>
              <div className="payment-summary-row">
                <span>Donanım Paketi</span>
                <strong id="paymentPackage">{activeModalTier.name}</strong>
              </div>
              <div className="payment-summary-row">
                <span>Süre Tarifesi</span>
                <strong id="paymentDuration">
                  {selectedPrices[activeModalTier.id]?.label || "-"}
                </strong>
              </div>
              <div className="payment-total">
                <span>Ödenecek Tutar</span>
                <strong id="paymentTotal">₺{calculateTotal()}</strong>
              </div>
            </div>

            <div className="payment-methods">
              <div className="payment-method">
                <input
                  type="radio"
                  name="paymentMethod"
                  id="cardPayment"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                />
                <label htmlFor="cardPayment">
                  <i className="fa-solid fa-credit-card" aria-hidden="true"></i>
                  Kredi / Banka Kartı
                </label>
              </div>

              <div className="payment-method">
                <input
                  type="radio"
                  name="paymentMethod"
                  id="balancePayment"
                  value="balance"
                  checked={paymentMethod === "balance"}
                  onChange={() => setPaymentMethod("balance")}
                />
                <label htmlFor="balancePayment">
                  <i className="fa-solid fa-wallet" aria-hidden="true"></i>
                  Forza Bakiye
                </label>
              </div>
            </div>

            <div className="payment-form-row">
              <div className="payment-form-group">
                <label htmlFor="paymentName">Ad</label>
                <input
                  type="text"
                  id="paymentName"
                  placeholder="Adınız"
                  autoComplete="given-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="payment-form-group">
                <label htmlFor="paymentSurname">Soyad</label>
                <input
                  type="text"
                  id="paymentSurname"
                  placeholder="Soyadınız"
                  autoComplete="family-name"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="payment-form-group">
              <label htmlFor="paymentPhone">Telefon Numarası</label>
              <input
                type="tel"
                id="paymentPhone"
                placeholder="05XX XXX XX XX"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            {paymentMethod === "card" && (
              <div id="cardFields">
                <div className="payment-form-group">
                  <label htmlFor="cardName">Kart Üzerindeki İsim</label>
                  <input
                    type="text"
                    id="cardName"
                    placeholder="AD SOYAD"
                    autoComplete="cc-name"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                  />
                </div>

                <div className="payment-form-group">
                  <label htmlFor="cardNumber">Kart Numarası</label>
                  <input
                    type="text"
                    id="cardNumber"
                    inputMode="numeric"
                    maxLength={19}
                    placeholder="0000 0000 0000 0000"
                    autoComplete="cc-number"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                  />
                </div>

                <div className="payment-form-row">
                  <div className="payment-form-group">
                    <label htmlFor="cardExpiry">Son Kullanma</label>
                    <input
                      type="text"
                      id="cardExpiry"
                      maxLength={5}
                      placeholder="AA/YY"
                      autoComplete="cc-exp"
                      value={cardExpiry}
                      onChange={handleCardExpiryChange}
                    />
                  </div>
                  <div className="payment-form-group">
                    <label htmlFor="cardCvv">CVV Güvenlik Kodu</label>
                    <input
                      type="password"
                      id="cardCvv"
                      inputMode="numeric"
                      maxLength={4}
                      placeholder="•••"
                      autoComplete="cc-csc"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              className="payment-submit"
              id="paymentSubmit"
              onClick={handleSubmitReservation}
              disabled={isSubmitting}
            >
              <i className="fa-solid fa-lock" aria-hidden="true"></i>
              <span id="paymentSubmitText">
                {isSubmitting ? "İşleniyor..." : "Rezervasyonu Tamamla"}
              </span>
            </button>

            <p className="payment-security">
              <i className="fa-solid fa-shield-halved" aria-hidden="true"></i>
              Demo Rezervasyon &amp; Güvenli Ön Ödeme Alanı
            </p>
          </div>
        </div>
      )}

      <Footer />
      <WhatsAppWidget />
    </>
  );
}