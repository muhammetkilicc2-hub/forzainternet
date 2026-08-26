import { PC, PcKategori, PcDurum, KategoriBilgisi, Rezervasyon, KampanyaFiyatlari, AdminStats } from "./types";

export const KATEGORILER: Record<PcKategori, KategoriBilgisi> = {
  sari: {
    id: "sari",
    baslik: "Standart Gaming (Sarı Masa)",
    fiyat: 60,
    renkKodu: "#ffd700",
    ozellikler: ["RTX 4060 8GB", "240 Hz Fast IPS", "Intel i5 14400F", "Konforlu Espor Koltuğu"],
  },
  mavi: {
    id: "mavi",
    baslik: "Pro Gaming (Mavi Masa)",
    fiyat: 70,
    renkKodu: "#0ea5e9",
    ozellikler: ["RTX 4070 Super", "360 Hz Espor Monitör", "Intel i7 14700F", "Mekanik Klavye + Espor Kulaklık"],
  },
  yesil: {
    id: "yesil",
    baslik: "Elite 540Hz VIP (Yeşil Masa)",
    fiyat: 90,
    renkKodu: "#10b981",
    ozellikler: ["RTX 4080 Super / 4090", "540 Hz Espor Monitör", "Intel i9 14900K", "VIP Özel Akustik Alan"],
  },
};

// 64 Masalık Standart Liste Oluştur
function createInitialPcList(): PC[] {
  const list: PC[] = [];
  // Sarı: PC 1 - PC 24
  for (let i = 1; i <= 24; i++) {
    list.push({
      id: `pc-${i}`,
      no: i,
      isim: `PC ${i}`,
      kategori: "sari",
      durum: i % 4 === 0 ? "kullanimda" : i === 13 ? "rezerve" : "bos",
    });
  }
  // Mavi: PC 25 - PC 48
  for (let i = 25; i <= 48; i++) {
    list.push({
      id: `pc-${i}`,
      no: i,
      isim: `PC ${i}`,
      kategori: "mavi",
      durum: i % 3 === 0 ? "kullanimda" : i === 31 ? "rezerve" : "bos",
    });
  }
  // Yeşil: PC 49 - PC 64
  for (let i = 49; i <= 64; i++) {
    list.push({
      id: `pc-${i}`,
      no: i,
      isim: `PC ${i}`,
      kategori: "yesil",
      durum: i % 5 === 0 ? "kullanimda" : i === 55 ? "rezerve" : "bos",
    });
  }
  return list;
}

// Global Singletons (Hot reload korumalı)
declare global {
  var __forzaPcList: PC[] | undefined;
  var __forzaReservations: Rezervasyon[] | undefined;
  var __forzaPricing: KampanyaFiyatlari | undefined;
}

if (!globalThis.__forzaPcList) {
  globalThis.__forzaPcList = createInitialPcList();
}

if (!globalThis.__forzaPricing) {
  globalThis.__forzaPricing = {
    sari: { saatlik: 60, ucSaatlik: 160, besSaatlik: 250 },
    mavi: { saatlik: 70, ucSaatlik: 190, besSaatlik: 300 },
    yesil: { saatlik: 90, ucSaatlik: 240, besSaatlik: 380 },
  };
}

if (!globalThis.__forzaReservations) {
  globalThis.__forzaReservations = [
    {
      id: "rez-101",
      musteriAdi: "Ahmet Yılmaz",
      telefon: "05464659693",
      masaId: "pc-12",
      masaIsim: "PC 12",
      kategori: "sari",
      tarih: new Date().toISOString().split("T")[0],
      saat: "19:00",
      sure: 3,
      toplamTutar: 160,
      odemeYontemi: "kart",
      durum: "pending",
      olusturuldu: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      okundu: false,
    },
    {
      id: "rez-102",
      musteriAdi: "Caner Özkan",
      telefon: "05321112233",
      masaId: "pc-52",
      masaIsim: "PC 52",
      kategori: "yesil",
      tarih: new Date().toISOString().split("T")[0],
      saat: "20:30",
      sure: 5,
      toplamTutar: 380,
      odemeYontemi: "nakit",
      durum: "confirmed",
      olusturuldu: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      okundu: true,
    },
    {
      id: "rez-103",
      musteriAdi: "Mert Demir",
      telefon: "05554443322",
      masaId: "pc-30",
      masaIsim: "PC 30",
      kategori: "mavi",
      tarih: new Date().toISOString().split("T")[0],
      saat: "21:00",
      sure: 3,
      toplamTutar: 190,
      odemeYontemi: "havale",
      durum: "pending",
      olusturuldu: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      okundu: false,
    },
  ];
}

// ----------------------------------------------------
// VERİ ERİŞİM FONKSİYONLARI
// ----------------------------------------------------

export function getComputers(): PC[] {
  return globalThis.__forzaPcList!;
}

export function updateComputerStatus(id: string, durum: PcDurum): PC | null {
  const list = globalThis.__forzaPcList!;
  const pc = list.find((p) => p.id === id || p.isim.toLowerCase() === id.toLowerCase());
  if (!pc) return null;
  pc.durum = durum;
  pc.guncellemeTarihi = new Date().toISOString();
  return pc;
}

export function getReservations(): Rezervasyon[] {
  return globalThis.__forzaReservations!;
}

export function createReservation(data: Omit<Rezervasyon, "id" | "olusturuldu" | "durum">): Rezervasyon {
  const list = globalThis.__forzaReservations!;
  const newRez: Rezervasyon = {
    ...data,
    id: `rez-${Date.now().toString().slice(-6)}`,
    durum: "pending",
    olusturuldu: new Date().toISOString(),
    okundu: false,
  };
  list.unshift(newRez);

  // Masanın durumunu rezerve yap
  updateComputerStatus(data.masaId, "rezerve");

  return newRez;
}

export function updateReservationStatus(id: string, durum: "confirmed" | "rejected"): Rezervasyon | null {
  const list = globalThis.__forzaReservations!;
  const rez = list.find((r) => r.id === id);
  if (!rez) return null;
  rez.durum = durum;
  rez.okundu = true;

  if (durum === "confirmed") {
    updateComputerStatus(rez.masaId, "kullanimda");
  } else if (durum === "rejected") {
    updateComputerStatus(rez.masaId, "bos");
  }

  return rez;
}

export function markAllReservationsRead(): void {
  const list = globalThis.__forzaReservations!;
  list.forEach((r) => {
    r.okundu = true;
  });
}

export function getPricing(): KampanyaFiyatlari {
  return globalThis.__forzaPricing!;
}

export function updatePricing(newPricing: Partial<KampanyaFiyatlari>): KampanyaFiyatlari {
  globalThis.__forzaPricing = {
    ...globalThis.__forzaPricing!,
    ...newPricing,
  };
  return globalThis.__forzaPricing!;
}

export function getStats(): AdminStats {
  const pcs = getComputers();
  const reservations = getReservations();

  return {
    toplamPc: pcs.length,
    aktifPc: pcs.filter((p) => p.durum === "kullanimda").length,
    bosPc: pcs.filter((p) => p.durum === "bos").length,
    rezervePc: pcs.filter((p) => p.durum === "rezerve").length,
    toplamRezervasyon: reservations.length,
    bekleyenRezervasyon: reservations.filter((r) => r.durum === "pending").length,
    onaylananRezervasyon: reservations.filter((r) => r.durum === "confirmed").length,
  };
}

// ----------------------------------------------------
// CANLI ORGANİZMA & ANALİTİK FONKSİYONLARI
// ----------------------------------------------------

declare global {
  var __forzaAnalytics: import("./types").AnalyticsData | undefined;
}

if (!globalThis.__forzaAnalytics) {
  globalThis.__forzaAnalytics = {
    toplamZiyaret: 1482,
    tekilZiyaret: 940,
    bugunZiyaret: 184,
    anlikCanliKullanici: 14,
    kategoriBakilma: {
      sari: 320,
      mavi: 580,
      yesil: 790,
    },
    cihazDagilimi: {
      mobil: 68,
      masaustu: 32,
    },
    sonGuncelleme: new Date().toISOString(),
  };
}

export function getAnalytics() {
  const an = globalThis.__forzaAnalytics!;
  const saat = new Date().getHours();
  const baz = (saat >= 16 && saat <= 24) ? 22 : 12;
  an.anlikCanliKullanici = Math.max(6, baz + Math.floor(Math.random() * 5) - 2);
  return an;
}

export function trackVisit(isUnique = false) {
  const an = globalThis.__forzaAnalytics!;
  an.toplamZiyaret += 1;
  an.bugunZiyaret += 1;
  if (isUnique) an.tekilZiyaret += 1;
  an.sonGuncelleme = new Date().toISOString();
  return an;
}

export function trackCategoryInterest(kategori: "sari" | "mavi" | "yesil") {
  const an = globalThis.__forzaAnalytics!;
  if (an.kategoriBakilma[kategori] !== undefined) {
    an.kategoriBakilma[kategori] += 1;
  }
  an.sonGuncelleme = new Date().toISOString();
  return an;
}