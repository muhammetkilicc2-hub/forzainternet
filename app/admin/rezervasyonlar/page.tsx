"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Rezervasyon } from "@/lib/types";
import { useToast } from "@/components/admin/Toast";
import {
  CheckCheck,
  Check,
  X,
  Search,
  Calendar,
  Phone,
  Monitor,
  Clock,
  TrendingUp,
  CreditCard,
  Filter,
  Download,
  CalendarDays,
  ListFilter,
  Layers,
  ChevronDown,
  ChevronUp,
  History,
  Sparkles,
} from "lucide-react";

export default function RezervasyonlarManagementPage() {
  const { showToast } = useToast();
  const [reservations, setReservations] = useState<Rezervasyon[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("tumu");
  const [filterCategory, setFilterCategory] = useState<string>("tumu");
  const [filterPeriod, setFilterPeriod] = useState<string>("tumu"); // 'tumu', 'bugun', 'dun', 'buHafta', 'buAy', 'gecmisAy', 'custom'
  const [selectedMonth, setSelectedMonth] = useState<string>("all"); // '2026-08', '2026-07', etc.
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"list" | "grouped">("grouped");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      let localRezList: Rezervasyon[] = [];
      try {
        const raw = localStorage.getItem("forzaBildirimler");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            localRezList = parsed.map((b: any) => ({
              id: b.id || `loc-${Date.now()}-${Math.random()}`,
              musteriAdi: b.musteri || b.baslik || "Müşteri",
              telefon: b.telefon || "0546 465 96 93",
              masaId: Array.isArray(b.pcler) ? b.pcler.join(", ") : b.masaId || "PC",
              masaIsim: Array.isArray(b.pcler) ? b.pcler.join(", ") : b.masaIsim || "Seçilen Masalar",
              kategori: b.kampanya?.toLowerCase().includes("60") ? "sari" : b.kampanya?.toLowerCase().includes("70") ? "mavi" : "yesil",
              tarih: b.tarih ? b.tarih.split("T")[0] : new Date().toISOString().split("T")[0],
              saat: b.tarih ? new Date(b.tarih).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }) : "19:00",
              sure: typeof b.sure === "number" ? b.sure : (typeof b.sure === "string" && b.sure.includes("Gün") ? 12 : 5),
              toplamTutar: Number(b.tutar) || 200,
              odemeYontemi: "kart",
              durum: (b.durum === "confirmed" ? "confirmed" : b.durum === "rejected" ? "rejected" : "pending") as Rezervasyon["durum"],
              olusturuldu: b.tarih || new Date().toISOString(),
              okundu: Boolean(b.okundu),
            }));
          }
        }
      } catch (e) {}

      const res = await fetch("/api/reservations", { cache: "no-store" });
      const data = await res.json();
      const serverList = data.reservations || [];

      const map = new Map<string, Rezervasyon>();
      localRezList.forEach((r) => map.set(r.id, r));
      serverList.forEach((r: Rezervasyon) => map.set(r.id, r));

      const merged = Array.from(map.values()).sort(
        (a, b) => new Date(b.olusturuldu || b.tarih).getTime() - new Date(a.olusturuldu || a.tarih).getTime()
      );
      setReservations(merged);
    } catch (err) {
      console.error("Rezervasyonlar yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleAction = async (id: string, durum: "confirmed" | "rejected") => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, durum, okundu: true } : r))
    );

    try {
      const raw = localStorage.getItem("forzaBildirimler");
      if (raw) {
        const notifs = JSON.parse(raw);
        const target = notifs.find((b: { id: string; durum?: string; okundu?: boolean }) => b.id === id);
        if (target) {
          target.durum = durum;
          target.okundu = true;
          localStorage.setItem("forzaBildirimler", JSON.stringify(notifs));
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("forzaBildirimGuncellendi", { detail: notifs }));
          }
        }
      }

      const rez = reservations.find((r) => r.id === id);
      if (rez) {
        const rawPc = localStorage.getItem("forzaPcDurumlari");
        const durumlar = rawPc ? JSON.parse(rawPc) : {};
        const pcMatches = rez.masaId.match(/\d+/g) || [];
        pcMatches.forEach((numStr) => {
          const pcId = parseInt(numStr, 10);
          const newSt = durum === "confirmed" ? "kullanımda" : "boş";
          durumlar[pcId] = newSt;
          durumlar[`pc-${pcId}`] = durum === "confirmed" ? "kullanimda" : "bos";
        });
        localStorage.setItem("forzaPcDurumlari", JSON.stringify(durumlar));
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("forzaPcDurumGuncellendi", { detail: durumlar }));
        }
      }
    } catch (e) {}

    try {
      await fetch("/api/reservations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, durum }),
      });
      showToast(
        durum === "confirmed" ? "Rezervasyon Onaylandı" : "Rezervasyon Reddedildi",
        durum === "confirmed" ? "Masa kullanıcı için hazırlandı ve aktifleştirildi." : "Talep iptal edildi.",
        durum === "confirmed" ? "success" : "warning"
      );
    } catch {
      showToast("Bilgi", "İşlem kaydedildi", "info");
    }
  };

  const markAllRead = async () => {
    try {
      await fetch("/api/reservations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      setReservations((prev) => prev.map((r) => ({ ...r, okundu: true })));

      try {
        const raw = localStorage.getItem("forzaBildirimler");
        if (raw) {
          const notifs = JSON.parse(raw);
          notifs.forEach((n: { okundu: boolean }) => (n.okundu = true));
          localStorage.setItem("forzaBildirimler", JSON.stringify(notifs));
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("forzaBildirimGuncellendi", { detail: notifs }));
          }
        }
      } catch (e) {}

      showToast("Başarılı", "Tüm talepler okundu olarak işaretlendi.", "success");
    } catch {
      showToast("Hata", "İşlem başarısız", "error");
    }
  };

  // Mevcut benzersiz ayları dinamik listele
  const availableMonths = useMemo(() => {
    const monthSet = new Set<string>();
    reservations.forEach((r) => {
      if (r.tarih) {
        const m = r.tarih.substring(0, 7); // '2026-08'
        monthSet.add(m);
      }
    });
    return Array.from(monthSet).sort().reverse();
  }, [reservations]);

  const monthNamesTr: Record<string, string> = {
    "01": "Ocak",
    "02": "Şubat",
    "03": "Mart",
    "04": "Nisan",
    "05": "Mayıs",
    "06": "Haziran",
    "07": "Temmuz",
    "08": "Ağustos",
    "09": "Eylül",
    "10": "Ekim",
    "11": "Kasım",
    "12": "Aralık",
  };

  const formatMonthLabel = (ym: string) => {
    const [y, m] = ym.split("-");
    return `${monthNamesTr[m] || m} ${y}`;
  };

  // Tarih ve Zaman Filtreleme Mantığı
  const filtered = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);

    return reservations.filter((r) => {
      // 1. Durum Filtresi
      if (filterStatus !== "tumu" && r.durum !== filterStatus) return false;

      // 2. Kategori Filtresi
      if (filterCategory !== "tumu" && r.kategori !== filterCategory) return false;

      // 3. Dönem & Tarih Filtresi
      const rezDate = r.tarih ? r.tarih.split("T")[0] : "";
      if (filterPeriod === "bugun" && rezDate !== todayStr) return false;
      if (filterPeriod === "dun" && rezDate !== yesterdayStr) return false;
      if (filterPeriod === "buHafta") {
        const d = new Date(rezDate);
        if (d < weekAgo || d > now) return false;
      }
      if (filterPeriod === "buAy") {
        const currentYM = todayStr.substring(0, 7);
        if (!rezDate.startsWith(currentYM)) return false;
      }
      if (filterPeriod === "gecmisAy" && selectedMonth !== "all") {
        if (!rezDate.startsWith(selectedMonth)) return false;
      }
      if (filterPeriod === "custom") {
        if (customStartDate && rezDate < customStartDate) return false;
        if (customEndDate && rezDate > customEndDate) return false;
      }

      // 4. Arama Sorgusu
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchName = r.musteriAdi.toLowerCase().includes(q);
        const matchPhone = r.telefon.includes(q);
        const matchDesk = r.masaIsim.toLowerCase().includes(q);
        const matchDate = (r.tarih || "").includes(q);
        if (!matchName && !matchPhone && !matchDesk && !matchDate) return false;
      }

      return true;
    });
  }, [reservations, filterStatus, filterCategory, filterPeriod, selectedMonth, customStartDate, customEndDate, searchQuery]);

  // Finansal & Operasyonel Özet İstatistikleri
  const statsSummary = useMemo(() => {
    const totalCount = filtered.length;
    const confirmedCount = filtered.filter((r) => r.durum === "confirmed").length;
    const pendingCount = filtered.filter((r) => r.durum === "pending").length;
    const rejectedCount = filtered.filter((r) => r.durum === "rejected").length;
    const totalRevenue = filtered
      .filter((r) => r.durum === "confirmed")
      .reduce((sum, r) => sum + (Number(r.toplamTutar) || 0), 0);

    return {
      totalCount,
      confirmedCount,
      pendingCount,
      rejectedCount,
      totalRevenue,
      successRate: totalCount > 0 ? Math.round((confirmedCount / totalCount) * 100) : 0,
    };
  }, [filtered]);

  // Gruplu Görünüm İçin Aya Göre Gruplama
  const groupedByMonth = useMemo(() => {
    const groups: Record<string, Rezervasyon[]> = {};
    filtered.forEach((r) => {
      const mKey = r.tarih ? r.tarih.substring(0, 7) : "Diğer";
      if (!groups[mKey]) groups[mKey] = [];
      groups[mKey].push(r);
    });
    return groups;
  }, [filtered]);

  // CSV Olarak Dışa Aktarma
  const exportToCSV = () => {
    if (filtered.length === 0) {
      showToast("Uyarı", "Dışa aktarılacak kayıt bulunamadı.", "warning");
      return;
    }

    const headers = ["ID", "Müşteri Adı", "Telefon", "Masa", "Kategori", "Tarih", "Saat", "Süre (Saat)", "Tutar (TL)", "Durum"];
    const rows = filtered.map((r) => [
      r.id,
      `"${r.musteriAdi}"`,
      `"${r.telefon}"`,
      `"${r.masaIsim}"`,
      r.kategori.toUpperCase(),
      r.tarih,
      r.saat,
      r.sure,
      r.toplamTutar,
      r.durum === "confirmed" ? "Onaylandı" : r.durum === "rejected" ? "Reddedildi" : "Bekliyor",
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `forza-rezervasyon-gecmisi-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Rapor İndirildi 🎉", "Filtrelenen rezervasyon geçmişi CSV formatında başarıyla kaydedildi.", "success");
  };

  return (
    <main className="dashboard-content" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* 1. TOP HEADER & EXPORT ACTIONS */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px",
          width: "100%",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#ffffff", margin: 0, letterSpacing: "-0.3px" }}>
              Rezervasyon Geçmişi &amp; Arşivi
            </h1>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 900,
                padding: "3px 10px",
                borderRadius: "12px",
                background: "rgba(223, 183, 88, 0.15)",
                color: "#dfb758",
                border: "1px solid rgba(223, 183, 88, 0.3)",
              }}
            >
              📅 Geçmiş &amp; Güncel
            </span>
          </div>
          <span style={{ fontSize: "13px", color: "#cbd5e1", marginTop: "4px", display: "block" }}>
            Günlük, haftalık ve aylık bazda tüm geçmiş müşteri rezervasyon kayıtları ve finansal özet
          </span>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={exportToCSV}
            className="apple-btn-glass"
          >
            <Download size={15} />
            <span>Dışa Aktar (CSV)</span>
          </button>

          <button
            type="button"
            onClick={markAllRead}
            className="apple-btn-white"
          >
            <CheckCheck size={16} />
            <span>Tümünü Okundu Yap</span>
          </button>
        </div>
      </div>

      {/* 2. STATS & ANALYTICS SUMMARY CARDS (APPLE JET BLACK) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          width: "100%",
        }}
      >
        {/* Toplam Rezervasyon */}
        <div className="ios-stat-widget">
          <div className="ios-widget-icon" style={{ background: "rgba(223, 183, 88, 0.15)", color: "#dfb758", border: "1px solid rgba(223, 183, 88, 0.3)" }}>
            <History size={22} />
          </div>
          <div className="ios-widget-info">
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>Seçili Kayıt</span>
            <strong style={{ fontSize: "28px", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.5px" }}>{statsSummary.totalCount}</strong>
          </div>
        </div>

        {/* Toplam Ciro / Kazanç */}
        <div className="ios-stat-widget">
          <div className="ios-widget-icon" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
            <CreditCard size={22} />
          </div>
          <div className="ios-widget-info">
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>Toplam Kazanç</span>
            <strong style={{ fontSize: "28px", fontWeight: 900, color: "#34d399", letterSpacing: "-0.5px" }}>₺{statsSummary.totalRevenue.toLocaleString("tr-TR")}</strong>
          </div>
        </div>

        {/* Onaylanan / Başarılı */}
        <div className="ios-stat-widget">
          <div className="ios-widget-icon" style={{ background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", border: "1px solid rgba(56, 189, 248, 0.3)" }}>
            <TrendingUp size={22} />
          </div>
          <div className="ios-widget-info">
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>Onay Oranı</span>
            <strong style={{ fontSize: "28px", fontWeight: 900, color: "#38bdf8", letterSpacing: "-0.5px" }}>%{statsSummary.successRate}</strong>
          </div>
        </div>

        {/* Bekleyen Talep */}
        <div className="ios-stat-widget">
          <div className="ios-widget-icon" style={{ background: "rgba(244, 63, 94, 0.15)", color: "#fb7185", border: "1px solid rgba(244, 63, 94, 0.3)" }}>
            <Clock size={22} />
          </div>
          <div className="ios-widget-info">
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>Bekleyen Talep</span>
            <strong style={{ fontSize: "28px", fontWeight: 900, color: "#f87171", letterSpacing: "-0.5px" }}>{statsSummary.pendingCount}</strong>
          </div>
        </div>
      </div>

      {/* 3. TIME-MACHINE PERIOD & DATE SELECTOR BAR */}
      <div className="dashboard-card" style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Hızlı Dönem Seçicileri */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "12.5px", fontWeight: 800, color: "#ffffff", display: "flex", alignItems: "center", gap: "6px" }}>
              <CalendarDays size={15} style={{ color: "#dfb758" }} />
              <span>Dönem Filtresi:</span>
            </span>

            <div className="computer-filter-tabs" style={{ width: "auto", flexWrap: "wrap" }}>
              <button
                type="button"
                className={`filter-tab ${filterPeriod === "tumu" ? "active" : ""}`}
                onClick={() => setFilterPeriod("tumu")}
              >
                Tüm Zamanlar
              </button>
              <button
                type="button"
                className={`filter-tab ${filterPeriod === "bugun" ? "active" : ""}`}
                onClick={() => setFilterPeriod("bugun")}
              >
                Bugün
              </button>
              <button
                type="button"
                className={`filter-tab ${filterPeriod === "dun" ? "active" : ""}`}
                onClick={() => setFilterPeriod("dun")}
              >
                Dün
              </button>
              <button
                type="button"
                className={`filter-tab ${filterPeriod === "buHafta" ? "active" : ""}`}
                onClick={() => setFilterPeriod("buHafta")}
              >
                Bu Hafta
              </button>
              <button
                type="button"
                className={`filter-tab ${filterPeriod === "buAy" ? "active" : ""}`}
                onClick={() => setFilterPeriod("buAy")}
              >
                Bu Ay (Ağustos)
              </button>
              <button
                type="button"
                className={`filter-tab ${filterPeriod === "gecmisAy" ? "active" : ""}`}
                onClick={() => setFilterPeriod("gecmisAy")}
              >
                Geçmiş Aylar
              </button>
              <button
                type="button"
                className={`filter-tab ${filterPeriod === "custom" ? "active" : ""}`}
                onClick={() => setFilterPeriod("custom")}
              >
                Özel Tarih Aralığı
              </button>
            </div>
          </div>

          {/* Liste vs Gruplu Görünüm Anahtarı */}
          <div style={{ display: "flex", gap: "6px", background: "rgba(255, 255, 255, 0.04)", padding: "4px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
            <button
              type="button"
              onClick={() => setViewMode("grouped")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 12px",
                borderRadius: "8px",
                border: "none",
                background: viewMode === "grouped" ? "#ffffff" : "transparent",
                color: viewMode === "grouped" ? "#000000" : "#94a3b8",
                fontWeight: 800,
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              <Layers size={13} />
              <span>Aylara Göre Grupla</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 12px",
                borderRadius: "8px",
                border: "none",
                background: viewMode === "list" ? "#ffffff" : "transparent",
                color: viewMode === "list" ? "#000000" : "#94a3b8",
                fontWeight: 800,
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              <ListFilter size={13} />
              <span>Düz Liste</span>
            </button>
          </div>
        </div>

        {/* Geçmiş Aylar Seçildiğinde Gözüken Ay Hapları */}
        {filterPeriod === "gecmisAy" && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", paddingTop: "6px", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
            <span style={{ fontSize: "12px", color: "#dfb758", fontWeight: 700 }}>Ay Seçin:</span>
            <button
              type="button"
              className={`apple-btn-glass ${selectedMonth === "all" ? "active-gold" : ""}`}
              style={{
                padding: "6px 14px",
                fontSize: "12px",
                background: selectedMonth === "all" ? "#dfb758" : undefined,
                color: selectedMonth === "all" ? "#000000" : undefined,
                fontWeight: 800,
              }}
              onClick={() => setSelectedMonth("all")}
            >
              Tüm Aylar
            </button>
            {availableMonths.map((ym) => (
              <button
                key={ym}
                type="button"
                className="apple-btn-glass"
                style={{
                  padding: "6px 14px",
                  fontSize: "12px",
                  background: selectedMonth === ym ? "#dfb758" : undefined,
                  color: selectedMonth === ym ? "#000000" : undefined,
                  fontWeight: 800,
                }}
                onClick={() => setSelectedMonth(ym)}
              >
                {formatMonthLabel(ym)}
              </button>
            ))}
          </div>
        )}

        {/* Özel Tarih Seçimi */}
        {filterPeriod === "custom" && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", paddingTop: "6px", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>Başlangıç:</span>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="settings-input"
                style={{ padding: "6px 10px", width: "auto" }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>Bitiş:</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="settings-input"
                style={{ padding: "6px 10px", width: "auto" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 4. SECONDARY FILTERS & SEARCH */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px",
        }}
      >
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {/* Status Tabs */}
          <div className="computer-filter-tabs" style={{ width: "auto" }}>
            <button
              type="button"
              className={`filter-tab ${filterStatus === "tumu" ? "active" : ""}`}
              onClick={() => setFilterStatus("tumu")}
            >
              Tümü ({reservations.length})
            </button>
            <button
              type="button"
              className={`filter-tab ${filterStatus === "pending" ? "active" : ""}`}
              onClick={() => setFilterStatus("pending")}
            >
              Bekleyenler ({reservations.filter((r) => r.durum === "pending").length})
            </button>
            <button
              type="button"
              className={`filter-tab ${filterStatus === "confirmed" ? "active" : ""}`}
              onClick={() => setFilterStatus("confirmed")}
            >
              Onaylananlar ({reservations.filter((r) => r.durum === "confirmed").length})
            </button>
            <button
              type="button"
              className={`filter-tab ${filterStatus === "rejected" ? "active" : ""}`}
              onClick={() => setFilterStatus("rejected")}
            >
              Reddedilenler ({reservations.filter((r) => r.durum === "rejected").length})
            </button>
          </div>

          {/* Category Tabs */}
          <div className="computer-filter-tabs" style={{ width: "auto" }}>
            <button
              type="button"
              className={`filter-tab ${filterCategory === "tumu" ? "active" : ""}`}
              onClick={() => setFilterCategory("tumu")}
            >
              Tüm Masalar
            </button>
            <button
              type="button"
              className={`filter-tab ${filterCategory === "sari" ? "active" : ""}`}
              onClick={() => setFilterCategory("sari")}
            >
              🟡 Sarı
            </button>
            <button
              type="button"
              className={`filter-tab ${filterCategory === "mavi" ? "active" : ""}`}
              onClick={() => setFilterCategory("mavi")}
            >
              🔵 Mavi
            </button>
            <button
              type="button"
              className={`filter-tab ${filterCategory === "yesil" ? "active" : ""}`}
              onClick={() => setFilterCategory("yesil")}
            >
              🟢 VIP
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="ios-search-bar" style={{ maxWidth: "300px", width: "100%" }}>
          <input
            type="text"
            placeholder="İsim, telefon, masa veya tarih..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* 5. RESERVATION RECORDS LIST / GROUPED TIMELINE VIEW */}
      <div className="dashboard-card" style={{ padding: "24px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>Kayıtlar yükleniyor...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px 20px", color: "#94a3b8" }}>
            <Calendar size={36} style={{ opacity: 0.3, margin: "0 auto 12px" }} />
            <p style={{ fontSize: "14.5px", fontWeight: 700, color: "#ffffff" }}>Seçilen dönem ve filtreye ait rezervasyon bulunamadı.</p>
            <span style={{ fontSize: "12.5px" }}>Filtreleri sıfırlayarak tüm geçmişi görüntüleyebilirsiniz.</span>
          </div>
        ) : viewMode === "grouped" ? (
          // AYLARA GÖRE GRUPLU GEÇMİŞ GÖRÜNÜMÜ
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {Object.keys(groupedByMonth)
              .sort()
              .reverse()
              .map((ym) => {
                const monthRezList = groupedByMonth[ym];
                const monthTotal = monthRezList
                  .filter((r) => r.durum === "confirmed")
                  .reduce((sum, r) => sum + (Number(r.toplamTutar) || 0), 0);

                return (
                  <div key={ym} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {/* Grup Başlığı */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 16px",
                        background: "rgba(255, 255, 255, 0.04)",
                        borderRadius: "12px",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Calendar size={16} style={{ color: "#dfb758" }} />
                        <strong style={{ fontSize: "14.5px", color: "#ffffff" }}>{formatMonthLabel(ym)}</strong>
                        <span style={{ fontSize: "12px", color: "#94a3b8" }}>({monthRezList.length} Rezervasyon)</span>
                      </div>

                      <div style={{ fontSize: "13px", fontWeight: 800, color: "#34d399" }}>
                        Aylık Kazanç: ₺{monthTotal.toLocaleString("tr-TR")}
                      </div>
                    </div>

                    {/* Ayın Rezervasyon Kartları */}
                    <div className="reservation-list">
                      {monthRezList.map((rez) => renderReservationCard(rez, handleAction))}
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          // DÜZ LİSTE GÖRÜNÜMÜ
          <div className="reservation-list">
            {filtered.map((rez) => renderReservationCard(rez, handleAction))}
          </div>
        )}
      </div>
    </main>
  );
}

// Yardımcı Rezervasyon Kartı Render Fonksiyonu
function renderReservationCard(rez: Rezervasyon, handleAction: (id: string, durum: "confirmed" | "rejected") => void) {
  return (
    <div key={rez.id} className={`reservation-item ${rez.durum === "pending" ? "highlight" : ""}`}>
      <div className="reservation-icon">🖥️</div>
      <div className="reservation-info">
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <strong style={{ fontSize: "14.5px", color: "#ffffff" }}>{rez.musteriAdi}</strong>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              padding: "2px 8px",
              background: "rgba(255, 255, 255, 0.08)",
              borderRadius: "6px",
              color: "#cbd5e1",
            }}
          >
            📞 {rez.telefon}
          </span>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 800,
              padding: "2px 8px",
              background:
                rez.kategori === "sari"
                  ? "rgba(255, 215, 0, 0.15)"
                  : rez.kategori === "mavi"
                  ? "rgba(56, 189, 248, 0.15)"
                  : "rgba(52, 211, 153, 0.15)",
              color: rez.kategori === "sari" ? "#dfb758" : rez.kategori === "mavi" ? "#38bdf8" : "#34d399",
              borderRadius: "6px",
            }}
          >
            {rez.kategori.toUpperCase()}
          </span>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 800,
              padding: "2px 8px",
              borderRadius: "6px",
              background: "#ffffff",
              color: "#000000",
            }}
          >
            ₺{rez.toplamTutar}
          </span>
        </div>

        <span style={{ fontSize: "12.5px", color: "#94a3b8", marginTop: "3px" }}>
          🖥️ {rez.masaIsim} • 📅 <strong>{rez.tarih}</strong> • 🕒 {rez.saat} • ⏳ {rez.sure} Saat ({rez.odemeYontemi.toUpperCase()})
        </span>
      </div>

      {rez.durum === "pending" ? (
        <div className="reservation-actions">
          <button
            type="button"
            onClick={() => handleAction(rez.id, "confirmed")}
            className="res-btn res-btn-approve"
            title="Onayla"
          >
            <Check size={14} />
          </button>
          <button
            type="button"
            onClick={() => handleAction(rez.id, "rejected")}
            className="res-btn res-btn-reject"
            title="Reddet"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <span className={`reservation-status ${rez.durum === "confirmed" ? "confirmed" : "rejected"}`}>
          {rez.durum === "confirmed" ? "✓ Onaylandı" : "✕ Reddedildi"}
        </span>
      )}
    </div>
  );
}