import fs from "fs";
import path from "path";
import { PC, PcKategori, PcDurum, KategoriBilgisi, Rezervasyon, KampanyaFiyatlari, AdminStats, AdminAuthSettings, GalleryPhoto } from "./types";

export const DEFAULT_GALLERY_PHOTOS: GalleryPhoto[] = [
  { id: "f1", src: "/foto1.jpeg", badge: "Ana Salon", alt: "Forza Gaming Salonu - Ana Espor Alanı", caption: "Forza Gaming Salonu - Ana Espor Alanı", isCover: true, order: 1 },
  { id: "f2", src: "/foto2.jpeg", badge: "540 Hz Alan", alt: "540Hz BenQ Espor Turnuva Masaları", caption: "540Hz BenQ Espor Turnuva Masaları", isCover: false, order: 2 },
  { id: "f3", src: "/foto3.jpeg", badge: "Pro Setup", alt: "Pro Gaming RTX 4070 Setup", caption: "Pro Gaming RTX 4070 Setup", isCover: false, order: 3 },
  { id: "f4", src: "/foto4.jpeg", badge: "VIP Lounge", alt: "VIP Espor Akustik Alanı", caption: "VIP Espor Akustik Alanı", isCover: false, order: 4 },
  { id: "f5", src: "/foto5.jpeg", badge: "Ekipman", alt: "Ergonomik Espor Koltukları & Ekipmanlar", caption: "Ergonomik Espor Koltukları & Ekipmanlar", isCover: false, order: 5 },
  { id: "f6", src: "/foto6.jpeg", badge: "Turnuva", alt: "Forza Turnuva ve Takım Odası", caption: "Forza Turnuva ve Takım Odası", isCover: false, order: 6 },
];

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

// 48 Masalık Salon Gerçek Masa Listesi (bilgisayar.json ile birebir eşleşir)
const SARI_IDS = [1, 2, 4, 5, 6, 8, 9, 10];
const MAVI_IDS = [11, 12, 14, 15, 16, 17, 18, 20, 22, 24, 25, 26, 27, 28, 29, 31, 32, 33, 34, 36, 37, 42];
const YESIL_IDS = [38, 40, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 54, 55, 56, 57, 59, 60];

function createInitialPcList(): PC[] {
  const list: PC[] = [];

  SARI_IDS.forEach((no) => {
    list.push({
      id: `pc-${no}`,
      no: no,
      isim: `PC ${no}`,
      kategori: "sari",
      durum: "bos",
    });
  });

  MAVI_IDS.forEach((no) => {
    list.push({
      id: `pc-${no}`,
      no: no,
      isim: `PC ${no}`,
      kategori: "mavi",
      durum: "bos",
    });
  });

  YESIL_IDS.forEach((no) => {
    list.push({
      id: `pc-${no}`,
      no: no,
      isim: `PC ${no}`,
      kategori: "yesil",
      durum: "bos",
    });
  });

  return list.sort((a, b) => a.no - b.no);
}

function getPcFilePath(): string {
  return path.join(process.cwd(), "bilgisayar_state.json");
}

function getRezFilePath(): string {
  return path.join(process.cwd(), "rezervasyon_state.json");
}

function getGaleriFilePath(): string {
  return path.join(process.cwd(), "galeri_state.json");
}

function getSettingsFilePath(): string {
  return path.join(process.cwd(), "ayarlar_state.json");
}

function getPricingFilePath(): string {
  return path.join(process.cwd(), "kampanya_state.json");
}

function loadPersistedPricing(): KampanyaFiyatlari | null {
  try {
    const p = getPricingFilePath();
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, "utf-8");
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === "object" && parsed.sari) {
        return parsed;
      }
    }
  } catch (e) {}
  return null;
}

function persistPricing(pricing: KampanyaFiyatlari) {
  try {
    const p = getPricingFilePath();
    fs.writeFileSync(p, JSON.stringify(pricing, null, 2), "utf-8");
    try {
      fs.writeFileSync(path.join(process.cwd(), "kampanya.json"), JSON.stringify(pricing, null, 2), "utf-8");
    } catch (e) {}
  } catch (e) {}
}

function loadPersistedPcList(): PC[] | null {
  try {
    const p = getPcFilePath();
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}
  return null;
}

function persistPcList(list: PC[]) {
  try {
    const p = getPcFilePath();
    fs.writeFileSync(p, JSON.stringify(list, null, 2), "utf-8");
  } catch (e) {}
}

function loadPersistedReservations(): Rezervasyon[] | null {
  try {
    const p = getRezFilePath();
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {}
  return null;
}

function persistReservations(list: Rezervasyon[]) {
  try {
    const p = getRezFilePath();
    fs.writeFileSync(p, JSON.stringify(list, null, 2), "utf-8");
  } catch (e) {}
}

function loadPersistedGalleryPhotos(): GalleryPhoto[] | null {
  try {
    const p = getGaleriFilePath();
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}
  return null;
}

function persistGalleryPhotos(list: GalleryPhoto[]) {
  try {
    const p = getGaleriFilePath();
    fs.writeFileSync(p, JSON.stringify(list, null, 2), "utf-8");
  } catch (e) {}
}

function loadPersistedAdminSettings(): AdminAuthSettings | null {
  try {
    const p = getSettingsFilePath();
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, "utf-8");
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    }
  } catch (e) {}
  return null;
}

function persistAdminSettings(settings: AdminAuthSettings) {
  try {
    const p = getSettingsFilePath();
    fs.writeFileSync(p, JSON.stringify(settings, null, 2), "utf-8");
  } catch (e) {}
}

// Global Singletons (Hot reload korumalı)
declare global {
  var __forzaPcList: PC[] | undefined;
  var __forzaReservations: Rezervasyon[] | undefined;
  var __forzaPricing: KampanyaFiyatlari | undefined;
  var __forzaAdminSettings: AdminAuthSettings | undefined;
  var __forzaGalleryPhotos: GalleryPhoto[] | undefined;
}

if (!globalThis.__forzaPcList) {
  const persisted = loadPersistedPcList();
  globalThis.__forzaPcList = persisted || createInitialPcList();
}

if (!globalThis.__forzaPricing) {
  const persistedPricing = loadPersistedPricing();
  globalThis.__forzaPricing = persistedPricing || {
    sari: { saatlik: 60, besSaatlik: 200, gunluk: 400 },
    mavi: { saatlik: 70, besSaatlik: 250, gunluk: 500 },
    yesil: { saatlik: 90, besSaatlik: 350, gunluk: 700 },
  };
}

if (!globalThis.__forzaAdminSettings) {
  const persistedAdmin = loadPersistedAdminSettings();
  globalThis.__forzaAdminSettings = persistedAdmin || {
    adminUser: "admin",
    adminPass: "1234",
    adminEmail: "admin@forzagaming.com",
    adminAvatar: null,
    aboutCoverPhoto: "/foto1.jpeg",
    cafeName: "Forza İnternet & Cafe",
    cafePhone: "0546 465 96 93",
    soundEnabled: true,
    autoRefresh: true,
    refreshInterval: 10,
    sifreSonDegismeTarihi: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

if (!globalThis.__forzaReservations) {
  const persistedRez = loadPersistedReservations();
  globalThis.__forzaReservations = persistedRez || [];
}

if (!globalThis.__forzaGalleryPhotos) {
  const persistedGal = loadPersistedGalleryPhotos();
  globalThis.__forzaGalleryPhotos = persistedGal || DEFAULT_GALLERY_PHOTOS;
}

// ----------------------------------------------------
// VERİ ERİŞİM FONKSİYONLARI
// ----------------------------------------------------

export function getGalleryPhotos(): GalleryPhoto[] {
  const diskList = loadPersistedGalleryPhotos();
  if (diskList && Array.isArray(diskList) && diskList.length > 0) {
    globalThis.__forzaGalleryPhotos = diskList;
  }
  return globalThis.__forzaGalleryPhotos!;
}

export function updateGalleryPhotos(photos: GalleryPhoto[]): GalleryPhoto[] {
  globalThis.__forzaGalleryPhotos = photos;
  persistGalleryPhotos(photos);
  return globalThis.__forzaGalleryPhotos!;
}

export function getComputers(): PC[] {
  const diskList = loadPersistedPcList();
  if (diskList && Array.isArray(diskList) && diskList.length > 0) {
    globalThis.__forzaPcList = diskList;
  }
  return globalThis.__forzaPcList!;
}

export function updateComputerStatus(id: string, durum: PcDurum): PC | null {
  const list = globalThis.__forzaPcList!;
  const resList = globalThis.__forzaReservations || [];
  const matches = (id || "").match(/\d+/g);

  let lastUpdated: PC | null = null;
  if (matches && matches.length > 0) {
    matches.forEach((numStr) => {
      const num = parseInt(numStr, 10);
      const target = list.find((p) => p.no === num || p.id === `pc-${num}` || p.isim.toLowerCase() === `pc ${num}`);
      if (target) {
        target.durum = durum;
        target.guncellemeTarihi = new Date().toISOString();
        lastUpdated = target;
      }

      // Eğer masa boşa çekildiyse, bu masaya ait bekleyen eski rezervasyonları sonlandır
      if (durum === "bos") {
        resList.forEach((r) => {
          const rMatches: string[] = (r.masaId || "").match(/\d+/g) || [];
          if (rMatches.includes(numStr) && r.durum === "pending") {
            r.durum = "rejected";
          }
        });
      }
    });
  } else {
    const pc = list.find((p) => p.id === id || p.isim.toLowerCase() === (id || "").toLowerCase());
    if (pc) {
      pc.durum = durum;
      pc.guncellemeTarihi = new Date().toISOString();
      lastUpdated = pc;
    }
  }
  persistPcList(list);
  persistReservations(resList);
  return lastUpdated;
}

export function getReservations(): Rezervasyon[] {
  const diskRez = loadPersistedReservations();
  if (diskRez && Array.isArray(diskRez)) {
    globalThis.__forzaReservations = diskRez;
  }
  return globalThis.__forzaReservations!;
}

export function createReservation(data: Omit<Rezervasyon, "id" | "olusturuldu" | "durum">): Rezervasyon {
  const list = getReservations();
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
  persistReservations(list);

  return newRez;
}

export function updateReservationStatus(id: string, durum: "confirmed" | "rejected"): Rezervasyon | null {
  const list = getReservations();
  const rez = list.find((r) => r.id === id);
  if (!rez) return null;
  rez.durum = durum;
  rez.okundu = true;

  if (durum === "confirmed") {
    updateComputerStatus(rez.masaId, "kullanimda");
  } else if (durum === "rejected") {
    updateComputerStatus(rez.masaId, "bos");
  }
  persistReservations(list);

  return rez;
}

export function markAllReservationsRead(): void {
  const list = globalThis.__forzaReservations!;
  list.forEach((r) => {
    r.okundu = true;
  });
}

export function getPricing(): KampanyaFiyatlari {
  const diskPricing = loadPersistedPricing();
  if (diskPricing && typeof diskPricing === "object" && diskPricing.sari) {
    globalThis.__forzaPricing = diskPricing;
  }
  return globalThis.__forzaPricing!;
}

export function updatePricing(newPricing: any): KampanyaFiyatlari {
  const payload = newPricing && newPricing.pricing ? newPricing.pricing : newPricing;
  globalThis.__forzaPricing = {
    ...globalThis.__forzaPricing!,
    ...payload,
  };
  persistPricing(globalThis.__forzaPricing!);
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

// ----------------------------------------------------
// YÖNETİCİ GİRİŞ & ŞİFRE YÖNETİMİ
// ----------------------------------------------------

export function getAdminSettings(): AdminAuthSettings {
  const diskSettings = loadPersistedAdminSettings();
  if (diskSettings && typeof diskSettings === "object") {
    globalThis.__forzaAdminSettings = diskSettings;
  }
  return globalThis.__forzaAdminSettings!;
}

export function updateAdminSettings(data: Partial<AdminAuthSettings>): AdminAuthSettings {
  globalThis.__forzaAdminSettings = {
    ...globalThis.__forzaAdminSettings!,
    ...data,
    updatedAt: new Date().toISOString(),
  };
  persistAdminSettings(globalThis.__forzaAdminSettings!);
  return globalThis.__forzaAdminSettings!;
}

export function verifyAdminCredentials(username: string, pass: string): boolean {
  const current = getAdminSettings();
  const inputUser = (username || "").trim().toLowerCase();
  const currentAdminUser = (current.adminUser || "admin").trim().toLowerCase();

  const validUsers = [
    currentAdminUser,
    "admin",
  ];

  if (!validUsers.includes(inputUser)) {
    return false;
  }

  const inputPass = (pass || "").trim();
  const currentPass = (current.adminPass || "1234").trim();

  // Aktif yönetici şifresi doğrulaması
  return inputPass === currentPass;
}