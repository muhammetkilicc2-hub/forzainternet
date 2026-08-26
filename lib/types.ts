export type PcKategori = "sari" | "mavi" | "yesil";
export type PcDurum = "bos" | "kullanimda" | "rezerve" | "arizali";

export interface PC {
  id: string;
  no: number;
  isim: string;
  kategori: PcKategori;
  durum: PcDurum;
  guncellemeTarihi?: string;
}

export interface KategoriBilgisi {
  id: PcKategori;
  baslik: string;
  fiyat: number;
  renkKodu: string;
  ozellikler: string[];
}

export type OdemeYontemi = "kart" | "nakit" | "havale";
export type RezervasyonDurum = "pending" | "confirmed" | "rejected";

export interface Rezervasyon {
  id: string;
  musteriAdi: string;
  telefon: string;
  masaId: string;
  masaIsim: string;
  kategori: PcKategori;
  tarih: string;
  saat: string;
  sure: number;
  toplamTutar: number;
  odemeYontemi: OdemeYontemi;
  durum: RezervasyonDurum;
  olusturuldu: string;
  okundu?: boolean;
}

export interface KategoriFiyatPaket {
  saatlik: number;
  ucSaatlik: number;
  besSaatlik: number;
}

export interface KampanyaFiyatlari {
  sari: KategoriFiyatPaket;
  mavi: KategoriFiyatPaket;
  yesil: KategoriFiyatPaket;
}

export interface AdminAyarlar {
  adminUser: string;
  sesBildirimi: boolean;
  otomatikYenileme: boolean;
  yenilemeAraligi: number;
}

export interface AdminStats {
  toplamPc: number;
  aktifPc: number;
  bosPc: number;
  rezervePc: number;
  toplamRezervasyon: number;
  bekleyenRezervasyon: number;
  onaylananRezervasyon: number;
}

export interface CategoryInterest {
  sari: number;
  mavi: number;
  yesil: number;
}

export interface AnalyticsData {
  toplamZiyaret: number;
  tekilZiyaret: number;
  bugunZiyaret: number;
  anlikCanliKullanici: number;
  kategoriBakilma: CategoryInterest;
  cihazDagilimi: {
    mobil: number;
    masaustu: number;
  };
  sonGuncelleme: string;
}