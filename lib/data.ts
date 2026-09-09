import fs from "fs";
import path from "path";
import { PC, PcKategori, PcDurum, KategoriBilgisi, Rezervasyon, KampanyaFiyatlari, AdminStats, AdminAuthSettings, GalleryPhoto } from "./types";

export const DEFAULT_GALLERY_PHOTOS: GalleryPhoto[] = [
  { id: "f1", src: "/foto1.jpeg", badge: "Ana Salon", alt: "Forza Gaming Salonu - Ana Espor Alanı", caption: "Forza Gaming Salonu - Ana Espor Alanı", isCover: true, order: 1 },
  { id: "f2", src: "/foto2.jpeg", badge: "VIP Espor", alt: "BenQ Espor Turnuva Masaları", caption: "BenQ Espor Turnuva Masaları", isCover: false, order: 2 },
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
    baslik: "Elite VIP Turnuva (Yeşil Masa)",
    fiyat: 90,
    renkKodu: "#10b981",
    ozellikler: ["RTX 4080 Super / 4090", "540 Hz Espor Turnuva Monitörü", "Intel i9 14900K", "VIP Özel Akustik Alan"],
  },
};

const SARI_IDS = [1, 2, 4, 5, 6, 8, 9, 10];
const MAVI_IDS = [11, 12, 14, 15, 16, 17, 18, 20, 22, 24, 25, 26, 27, 28, 29, 31, 32, 33, 34, 36, 37, 42];
const YESIL_IDS = [38, 40, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 54, 55, 56, 57, 59, 60];

function createInitialPcList(): PC[] {
  const list: PC[] = [];
  SARI_IDS.forEach((no) => list.push({ id: `pc-${no}`, no, isim: `PC ${no}`, kategori: "sari", durum: "bos" }));
  MAVI_IDS.forEach((no) => list.push({ id: `pc-${no}`, no, isim: `PC ${no}`, kategori: "mavi", durum: "bos" }));
  YESIL_IDS.forEach((no) => list.push({ id: `pc-${no}`, no, isim: `PC ${no}`, kategori: "yesil", durum: "bos" }));
  return list.sort((a, b) => a.no - b.no);
}

// ------------------------------------------------------------------
// HYBRID STORAGE LAYER (FIREBASE REALTIME DB + FS)
// ------------------------------------------------------------------

const FIREBASE_URL = "https://forzainternet-c424e-default-rtdb.europe-west1.firebasedatabase.app";

async function readData<T>(key: string, filename: string): Promise<T | null> {
  try {
    const res = await fetch(`${FIREBASE_URL}/${key}.json`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data) return data;
    }
  } catch (e) {
    console.error(`Firebase read error [${key}]:`, e);
  }
  
  // Local disk fallback
  try {
    const p = path.join(process.cwd(), filename);
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, "utf-8");
      return JSON.parse(content) as T;
    }
  } catch (e) {}
  
  return null;
}

async function writeData<T>(key: string, filename: string, data: T) {
  try {
    await fetch(`${FIREBASE_URL}/${key}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch (e) {
    console.error(`Firebase write error [${key}]:`, e);
  }
  
  // Local disk fallback
  try {
    const p = path.join(process.cwd(), filename);
    fs.writeFileSync(p, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {}
}

// ------------------------------------------------------------------
// ASYNC API
// ------------------------------------------------------------------

export async function getPricing(): Promise<KampanyaFiyatlari> {
  const dbData = await readData<KampanyaFiyatlari>("pricing", "kampanya_state.json");
  if (dbData && dbData.sari) return dbData;
  return {
    sari: { saatlik: 60, besSaatlik: 200, gunluk: 400 },
    mavi: { saatlik: 70, besSaatlik: 250, gunluk: 500 },
    yesil: { saatlik: 90, besSaatlik: 350, gunluk: 700 },
  };
}

export async function updatePricing(newPricing: any): Promise<KampanyaFiyatlari> {
  const payload = newPricing && newPricing.pricing ? newPricing.pricing : newPricing;
  const current = await getPricing();
  const updated: KampanyaFiyatlari = {
    sari: {
      saatlik: Number(payload?.sari?.saatlik) || current.sari.saatlik,
      besSaatlik: Number(payload?.sari?.besSaatlik) || current.sari.besSaatlik,
      gunluk: Number(payload?.sari?.gunluk) || current.sari.gunluk,
    },
    mavi: {
      saatlik: Number(payload?.mavi?.saatlik) || current.mavi.saatlik,
      besSaatlik: Number(payload?.mavi?.besSaatlik) || current.mavi.besSaatlik,
      gunluk: Number(payload?.mavi?.gunluk) || current.mavi.gunluk,
    },
    yesil: {
      saatlik: Number(payload?.yesil?.saatlik) || current.yesil.saatlik,
      besSaatlik: Number(payload?.yesil?.besSaatlik) || current.yesil.besSaatlik,
      gunluk: Number(payload?.yesil?.gunluk) || current.yesil.gunluk,
    },
  };
  await writeData("pricing", "kampanya_state.json", updated);
  try { fs.writeFileSync(path.join(process.cwd(), "kampanya.json"), JSON.stringify(updated, null, 2), "utf-8"); } catch(e){}
  
  return updated;
}

export async function getGalleryPhotos(): Promise<GalleryPhoto[]> {
  const dbData = await readData<GalleryPhoto[]>("gallery", "galeri_state.json");
  if (Array.isArray(dbData) && dbData.length > 0) return dbData;
  
  await writeData("gallery", "galeri_state.json", DEFAULT_GALLERY_PHOTOS);
  return DEFAULT_GALLERY_PHOTOS;
}

export async function updateGalleryPhotos(photos: GalleryPhoto[]): Promise<GalleryPhoto[]> {
  await writeData("gallery", "galeri_state.json", photos);
  return photos;
}

export async function getAdminSettings(): Promise<AdminAuthSettings> {
  const dbData = await readData<AdminAuthSettings>("adminSettings", "ayarlar_state.json");
  if (dbData && typeof dbData === "object") return dbData;
  
  const defaultSettings = {
    adminUser: "admin",
    adminPass: "forza123",
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
  await writeData("adminSettings", "ayarlar_state.json", defaultSettings);
  return defaultSettings;
}

export async function updateAdminSettings(data: Partial<AdminAuthSettings>): Promise<AdminAuthSettings> {
  const current = await getAdminSettings();
  const updated = {
    ...current,
    ...data,
    updatedAt: new Date().toISOString(),
  };
  await writeData("adminSettings", "ayarlar_state.json", updated);
  return updated;
}

export async function verifyAdminCredentials(username: string, pass: string): Promise<boolean> {
  const current = await getAdminSettings();
  const inputUser = (username || "").trim().toLowerCase();
  const currentAdminUser = (current.adminUser || "admin").trim().toLowerCase();

  const validUsers = [currentAdminUser, "admin"];
  if (!validUsers.includes(inputUser)) return false;

  const inputPass = (pass || "").trim();
  const currentPass = (current.adminPass || "forza123").trim();

  return inputPass === currentPass;
}

export async function getStats(): Promise<AdminStats> {
  return {
    toplamPc: 0,
    aktifPc: 0,
    bosPc: 0,
    rezervePc: 0,
    toplamRezervasyon: 0,
    bekleyenRezervasyon: 0,
    onaylananRezervasyon: 0,
  };
}

declare global {
  var __forzaAnalytics: import("./types").AnalyticsData | undefined;
}
if (!globalThis.__forzaAnalytics) {
  globalThis.__forzaAnalytics = {
    toplamZiyaret: 1482,
    tekilZiyaret: 940,
    bugunZiyaret: 184,
    anlikCanliKullanici: 14,
    kategoriBakilma: { sari: 320, mavi: 580, yesil: 790 },
    cihazDagilimi: { mobil: 68, masaustu: 32 },
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
  if (an.kategoriBakilma[kategori] !== undefined) an.kategoriBakilma[kategori] += 1;
  an.sonGuncelleme = new Date().toISOString();
  return an;
}