"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppWidget from "@/components/public/WhatsAppWidget";
import { KampanyaFiyatlari } from "@/lib/types";
import { subscribeLiveUpdate, emitLiveUpdate } from "@/lib/liveSync";

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

const getTiers = (pricing: KampanyaFiyatlari): TierData[] => [
  {
    id: "sari",
    name: `${pricing.sari.saatlik} TL Masa`,
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
      { label: "5 Saat Paket", amount: pricing.sari.besSaatlik },
      { label: "Gün Boyu Paket", amount: pricing.sari.gunluk },
    ],
    pcs: ["PC 1", "PC 2", "PC 4", "PC 5", "PC 6", "PC 8", "PC 9", "PC 10"],
  },
  {
    id: "mavi",
    name: `${pricing.mavi.saatlik} TL Masa`,
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
      { label: "5 Saat Paket", amount: pricing.mavi.besSaatlik },
      { label: "Gün Boyu Paket", amount: pricing.mavi.gunluk },
    ],
    pcs: [
      "PC 11", "PC 12", "PC 14", "PC 15", "PC 16", "PC 17", "PC 18",
      "PC 20", "PC 22", "PC 24", "PC 25", "PC 26", "PC 27", "PC 28",
      "PC 29", "PC 31", "PC 32", "PC 33", "PC 34", "PC 36", "PC 37", "PC 42"
    ],
  },
  {
    id: "yesil",
    name: `${pricing.yesil.saatlik} TL Masa`,
    badge: "Ultra VIP Espor",
    badgeIcon: "fa-solid fa-crown",
    hz: "540 Hz Espor Ekran",
    specs: [
      { icon: "fa-solid fa-desktop", text: "540 Hz Pro Espor Turnuva Monitörü" },
      { icon: "fa-solid fa-microchip", text: "RTX 3070 Ti / RTX 5060" },
      { icon: "fa-solid fa-cpu", text: "AMD Ryzen 7 7800X3D Canavarı" },
      { icon: "fa-solid fa-memory", text: "32 GB DDR5 Yüksek Frekans RAM" },
    ],
    prices: [
      { label: "5 Saat Paket", amount: pricing.yesil.besSaatlik },
      { label: "Gün Boyu Paket", amount: pricing.yesil.gunluk },
    ],
    pcs: [
      "PC 38", "PC 40", "PC 43", "PC 44", "PC 45", "PC 46", "PC 47",
      "PC 48", "PC 49", "PC 50", "PC 51", "PC 52", "PC 54", "PC 55",
      "PC 56", "PC 57", "PC 59", "PC 60"
    ],
  },
];

export default function ReservationPage() {
  const [pricing, setPricing] = useState<KampanyaFiyatlari>({
    sari: { saatlik: 60, besSaatlik: 200, gunluk: 400 },
    mavi: { saatlik: 70, besSaatlik: 250, gunluk: 500 },
    yesil: { saatlik: 90, besSaatlik: 350, gunluk: 700 },
  });

  const tiers = getTiers(pricing);
  const [tableStatuses, setTableStatuses] = useState<Record<string, "bos" | "rezerve" | "kullanimda">>({});
  const [selectedPrices, setSelectedPrices] = useState<Record<string, { label: string; amount: number }>>({});
  const [selectedPcsByTier, setSelectedPcsByTier] = useState<Record<string, string[]>>({});

  const [modalOpen, setModalOpen] = useState(false);
  const [activeModalTier, setActiveModalTier] = useState<TierData>(tiers[0]);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "balance">("card");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [appointmentDate, setAppointmentDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [appointmentTime, setAppointmentTime] = useState("18:00");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const triggerHaptic = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(12);
      } catch {}
    }
  };

  const loadCentralStatuses = async () => {
    try {
      const res = await fetch("/api/computers", { cache: "no-store" });
      const data = await res.json();
      if (data && data.computers && Array.isArray(data.computers)) {
        const map: Record<string, "bos" | "rezerve" | "kullanimda"> = {};
        data.computers.forEach((pc: { id: string; no: number; isim: string; durum: "bos" | "rezerve" | "kullanimda" }) => {
          const num = pc.no || (pc.isim.match(/\d+/) ? parseInt(pc.isim.match(/\d+/)![0], 10) : pc.id);
          map[`PC ${num}`] = pc.durum;
          map[`${num}`] = pc.durum;
          map[pc.isim] = pc.durum;
          map[pc.id] = pc.durum;
        });
        setTableStatuses(map);

        try {
          const locMap: Record<string, string> = {};
          data.computers.forEach((pc: { no: number; durum: string }) => {
            locMap[pc.no] = pc.durum === "kullanimda" ? "kullanımda" : pc.durum;
          });
          localStorage.setItem("forzaPcDurumlari", JSON.stringify(locMap));
        } catch (e) {}
      }
    } catch (e) {}
  };

  const loadPricingData = async () => {
    try {
      const raw = localStorage.getItem("forzaFiyatlar");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.sari) setPricing(parsed);
      }
    } catch (e) {}

    try {
      const res = await fetch("/api/pricing", { cache: "no-store" });
      const data = await res.json();
      if (data.pricing) {
        setPricing(data.pricing);
        try {
          localStorage.setItem("forzaFiyatlar", JSON.stringify(data.pricing));
        } catch (e) {}
      }
    } catch (e) {}
  };

  useEffect(() => {
    loadCentralStatuses();
    loadPricingData();

    // 1. Fast live polling (every 2.5s) for both computers and pricing
    const interval = setInterval(() => {
      loadCentralStatuses();
      loadPricingData();
    }, 2500);

    // 2. Subscribe to instant inter-tab pricing and computers channels
    const unsubPricing = subscribeLiveUpdate("pricing", (updatedPricing) => {
      if (updatedPricing && updatedPricing.sari) {
        setPricing(updatedPricing);
      } else {
        loadPricingData();
      }
    });

    const unsubComputers = subscribeLiveUpdate("computers", () => {
      loadCentralStatuses();
    });

    const unsubRez = subscribeLiveUpdate("reservations", () => {
      loadCentralStatuses();
    });

    // 3. Tab focus & visibility change
    const handleFocus = () => {
      loadCentralStatuses();
      loadPricingData();
    };
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);
    window.addEventListener("storage", handleFocus);

    return () => {
      clearInterval(interval);
      unsubPricing();
      unsubComputers();
      unsubRez();
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
      window.removeEventListener("storage", handleFocus);
    };
  }, []);

  const handleSelectPrice = (tierId: string, priceObj: { label: string; amount: number }) => {
    triggerHaptic();
    setSelectedPrices((prev) => {
      if (prev[tierId]?.label === priceObj.label) {
        return { ...prev, [tierId]: priceObj };
      }
      return { ...prev, [tierId]: priceObj };
    });
  };

  const handleTogglePc = (tierId: string, pcName: string) => {
    const status = tableStatuses[pcName] || tableStatuses[pcName.replace(/\D/g, "")] || "bos";
    if (status === "rezerve" || status === "kullanimda") {
      triggerHaptic();
      return;
    }

    triggerHaptic();

    // Otomatik ilk tarifeyi seç (eğer seçili tarife yoksa)
    const tier = tiers.find((t) => t.id === tierId);
    if (tier && (!selectedPrices[tierId] || !selectedPrices[tierId].amount)) {
      setSelectedPrices((prev) => ({ ...prev, [tierId]: tier.prices[0] }));
    }

    setSelectedPcsByTier((prev) => {
      const current = prev[tierId] || [];
      if (current.includes(pcName)) {
        const filtered = current.filter((p) => p !== pcName);
        return { ...prev, [tierId]: filtered };
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
    triggerHaptic();
    const currentTier = tiers.find((t) => t.id === tier.id) || tier;
    const pcs = selectedPcsByTier[currentTier.id] || [];
    let price = selectedPrices[currentTier.id];

    // Fiyat seçilmemişse varsayılan 5 Saat paketini uygula
    if (!price && currentTier.prices && currentTier.prices.length > 0) {
      price = currentTier.prices[0];
      setSelectedPrices((prev) => ({ ...prev, [currentTier.id]: currentTier.prices[0] }));
    }

    if (pcs.length === 0) {
      alert("Lütfen rezervasyon yapmak istediğiniz en az 1 adet masayı seçiniz.");
      return;
    }

    setActiveModalTier(currentTier);
    setModalOpen(true);
  };

  const calculateTotal = () => {
    const currentTier = tiers.find((t) => t.id === activeModalTier.id) || activeModalTier;
    const selectedPriceObj = selectedPrices[currentTier.id];
    if (!selectedPriceObj) return 0;
    const dynamicPrice = currentTier.prices.find((p) => p.label === selectedPriceObj.label);
    const unitPrice = dynamicPrice ? dynamicPrice.amount : selectedPriceObj.amount;
    const pcs = selectedPcsByTier[currentTier.id] || [];
    return unitPrice * pcs.length;
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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let digits = e.target.value.replace(/\D/g, "");
    if (digits.startsWith("0")) digits = digits.slice(1);
    digits = digits.slice(0, 10);

    let formatted = "";
    if (digits.length > 0) {
      formatted = "0 (" + digits.slice(0, 3);
      if (digits.length >= 3) {
        formatted += ") " + digits.slice(3, 6);
      }
      if (digits.length >= 6) {
        formatted += " " + digits.slice(6, 8);
      }
      if (digits.length >= 8) {
        formatted += " " + digits.slice(8, 10);
      }
    }
    setPhone(formatted);
  };

  const handleSubmitReservation = async () => {
    if (!name.trim() || !surname.trim()) {
      alert("Lütfen ad ve soyadınızı giriniz.");
      return;
    }
    if (!appointmentTime) {
      alert("Lütfen kafeye geliş / randevu saatinizi belirtiniz.");
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
          masaIsim: `${pcs.join(", ")} (${activeModalTier.name})`,
          kategori: activeModalTier.id,
          tarih: appointmentDate,
          saat: appointmentTime,
          sure: durationLabel.includes("Gün") ? 12 : 5,
          toplamTutar: total,
          odemeYontemi: paymentMethod === "card" ? "kart" : "nakit",
        }),
      });

      // LocalStorage Bildirim & PC Durumu Senkronizasyonu (panel.html için)
      try {
        const rawNotifs = localStorage.getItem("forzaBildirimler");
        const bildirimler = rawNotifs ? JSON.parse(rawNotifs) : [];
        const yeniBildirim = {
          id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
          tur: "siparis",
          durum: "pending",
          baslik: `Yeni Rezervasyon — ${activeModalTier.name}`,
          mesaj: `${pcs.join(", ")} · ${activeModalTier.name} · ${durationLabel} · 🕒 Randevu: ${appointmentDate} Saat ${appointmentTime} · ₺${total.toLocaleString("tr-TR")} · ${name.trim()} ${surname.trim()} (${phone.trim()})`,
          pcler: pcs,
          kampanya: activeModalTier.name,
          sure: durationLabel,
          randevuTarihi: appointmentDate,
          randevuSaati: appointmentTime,
          tutar: total,
          musteri: `${name.trim()} ${surname.trim()}`,
          telefon: phone.trim(),
          tarih: new Date().toISOString(),
          okundu: false,
        };
        bildirimler.unshift(yeniBildirim);
        localStorage.setItem("forzaBildirimler", JSON.stringify(bildirimler.slice(0, 50)));

        // Masaları rezerve durumuna al
        const rawPc = localStorage.getItem("forzaPcDurumlari");
        const durumlar = rawPc ? JSON.parse(rawPc) : {};
        pcs.forEach((pcName) => {
          const match = pcName.match(/\d+/);
          if (match) {
            const pcId = parseInt(match[0], 10);
            durumlar[pcId] = "rezerve";
            durumlar[`pc-${pcId}`] = "rezerve";
          }
        });
        localStorage.setItem("forzaPcDurumlari", JSON.stringify(durumlar));

        if (typeof window !== "undefined") {
          emitLiveUpdate("notifications", bildirimler);
          emitLiveUpdate("computers", durumlar);
          emitLiveUpdate("reservations", yeniBildirim);
        }
      } catch (e) {}

      await loadCentralStatuses();
      setSelectedPcsByTier({});

      alert(`✅ Rezervasyon Talebiniz Alındı!\n\nSeçilen Masalar: ${pcs.join(", ")}\nPaket: ${activeModalTier.name}\nTarife: ${durationLabel}\nRandevu Saati: ${appointmentDate} Saat ${appointmentTime}\nToplam Tutar: ₺${total}\n\nİşletmemize geldiğinizde adınızı belirterek masanıza geçebilirsiniz.`);
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
            {tiers.map((tier) => {
              const currentPrice = selectedPrices[tier.id];

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
                          className={`fiyat ${isSelected ? "secili" : ""}`}
                          role="button"
                          tabIndex={0}
                          aria-label={`${tier.name} ${p.label}`}
                          onClick={() => handleSelectPrice(tier.id, p)}
                          style={{
                            cursor: "pointer",
                            borderColor: isSelected ? "var(--gold)" : undefined,
                            background: isSelected ? "rgba(255, 215, 0, 0.14)" : undefined,
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
                        const status = tableStatuses[pcName] || "bos";
                        const isOccupied = status === "kullanimda";
                        const isReserved = status === "rezerve";
                        const isUnavailable = isOccupied || isReserved;
                        const isSelected = (selectedPcsByTier[tier.id] || []).includes(pcName);

                        return (
                          <div
                            key={pcName}
                            className={`comp ${isSelected ? "secili" : ""} ${isOccupied ? "dolu" : ""} ${isReserved ? "dolu rezerveli" : ""}`}
                            tabIndex={isUnavailable ? -1 : 0}
                            role="button"
                            aria-label={pcName}
                            aria-disabled={isUnavailable}
                            title={isReserved ? "Bu masa rezerve edildi" : isOccupied ? "Bu masa kullanımda" : ""}
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
                      {(() => {
                        const pcs = selectedPcsByTier[tier.id] || [];
                        if (pcs.length > 0 && currentPrice) {
                          return `${pcs.length} Masa Seçildi (₺${currentPrice.amount * pcs.length}) — Ödemeye Geç`;
                        } else if (pcs.length > 0) {
                          return `${pcs.length} Masa Seçildi (Tarife Seçin)`;
                        } else if (currentPrice) {
                          return `${currentPrice.label} — Masa Seçin`;
                        }
                        return "Masa & Tarife Seçin";
                      })()}
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
                <span>Seçilen Masalar</span>
                <strong id="paymentPc">{(selectedPcsByTier[activeModalTier.id] || []).join(", ")}</strong>
              </div>
              <div className="payment-summary-row">
                <span>Donanım Paketi</span>
                <strong id="paymentPackage">{activeModalTier.name} ({activeModalTier.badge})</strong>
              </div>
              <div className="payment-summary-row">
                <span>Süre Tarifesi</span>
                <strong id="paymentDuration">
                  {selectedPrices[activeModalTier.id]?.label || "-"}
                </strong>
              </div>
              <div className="payment-summary-row">
                <span>Randevu Saati</span>
                <strong id="paymentAppointment" style={{ color: "var(--gold)" }}>
                  {appointmentDate} · Saat {appointmentTime}
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
                placeholder="0 (5XX) XXX XX XX"
                autoComplete="tel"
                value={phone}
                onChange={handlePhoneChange}
                required
              />
            </div>

            {/* Randevu Tarihi ve Başlangıç Saati */}
            <div className="payment-form-row" style={{ marginTop: "4px" }}>
              <div className="payment-form-group">
                <label htmlFor="paymentDate" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <i className="fa-solid fa-calendar-day" style={{ color: "var(--gold)" }}></i>
                  Randevu Tarihi
                </label>
                <input
                  type="date"
                  id="paymentDate"
                  value={appointmentDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  required
                />
              </div>

              <div className="payment-form-group">
                <label htmlFor="paymentTime" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <i className="fa-solid fa-clock" style={{ color: "var(--gold)" }}></i>
                  Geliş / Randevu Saati
                </label>
                <input
                  type="time"
                  id="paymentTime"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Hızlı Saat Butonları */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", margin: "-2px 0 6px" }}>
              {["12:00", "14:00", "16:00", "18:00", "20:00", "22:00"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setAppointmentTime(t)}
                  style={{
                    padding: "4px 8px",
                    borderRadius: "6px",
                    border: `1px solid ${appointmentTime === t ? "var(--gold)" : "rgba(247,242,232,0.15)"}`,
                    background: appointmentTime === t ? "rgba(255,215,0,0.18)" : "rgba(255,255,255,0.04)",
                    color: appointmentTime === t ? "var(--gold)" : "var(--cream-100)",
                    fontSize: "11px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {t}
                </button>
              ))}
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