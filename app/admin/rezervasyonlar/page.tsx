"use client";

import React, { useState, useEffect } from "react";
import { Rezervasyon } from "@/lib/types";
import { useToast } from "@/components/admin/Toast";
import { CheckCheck, Check, X, Search, Calendar, Phone, Monitor, Clock } from "lucide-react";

export default function RezervasyonlarManagementPage() {
  const { showToast } = useToast();
  const [reservations, setReservations] = useState<Rezervasyon[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("tumu");
  const [searchQuery, setSearchQuery] = useState<string>("");
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

      const res = await fetch("/api/reservations");
      const data = await res.json();
      const serverList = data.reservations || [];

      const map = new Map<string, Rezervasyon>();
      localRezList.forEach((r) => map.set(r.id, r));
      serverList.forEach((r: Rezervasyon) => map.set(r.id, r));

      const merged = Array.from(map.values()).sort((a, b) => new Date(b.olusturuldu).getTime() - new Date(a.olusturuldu).getTime());
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
        durum === "confirmed" ? "Onaylandı" : "Reddedildi",
        durum === "confirmed" ? "Masa kullanıcı için hazırlandı." : "Talep iptal edildi.",
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

      showToast("Başarılı", "Tüm talepler okundu olarak işaretlendi.");
    } catch {
      showToast("Hata", "İşlem başarısız", "error");
    }
  };

  const filtered = reservations.filter((r) => {
    const statusMatch = filterStatus === "tumu" || r.durum === filterStatus;
    const searchMatch =
      searchQuery.trim() === "" ||
      r.musteriAdi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.telefon.includes(searchQuery) ||
      r.masaIsim.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && searchMatch;
  });

  return (
    <main className="dashboard-content" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Top Header */}
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
          <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#ffffff", margin: 0, letterSpacing: "-0.3px" }}>
            Gelen Siparişler &amp; Talepler
          </h1>
          <span style={{ fontSize: "13px", color: "#cbd5e1", marginTop: "4px", display: "block" }}>
            Web sitesinden anlık iletilen müşteri rezervasyonları
          </span>
        </div>

        <button
          type="button"
          onClick={markAllRead}
          className="apple-btn-white"
        >
          <CheckCheck size={16} />
          <span>Tümünü Okundu Yap</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px",
        }}
      >
        <div className="computer-filter-tabs">
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
        </div>

        <div className="ios-search-bar" style={{ maxWidth: "320px", width: "100%" }}>
          <input
            type="text"
            placeholder="Müşteri veya tel ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Reservation List */}
      <div className="dashboard-card" style={{ padding: "24px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>Yükleniyor...</div>
        ) : filtered.length === 0 ? (
          <p style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>Aramanızla eşleşen rezervasyon bulunamadı.</p>
        ) : (
          <div className="reservation-list">
            {filtered.map((rez) => (
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
                        background: rez.kategori === "sari" ? "rgba(255, 215, 0, 0.15)" : rez.kategori === "mavi" ? "rgba(56, 189, 248, 0.15)" : "rgba(52, 211, 153, 0.15)",
                        color: rez.kategori === "sari" ? "#dfb758" : rez.kategori === "mavi" ? "#38bdf8" : "#34d399",
                        borderRadius: "6px",
                      }}
                    >
                      {rez.kategori.toUpperCase()}
                    </span>
                  </div>
                  <span style={{ fontSize: "12.5px", color: "#94a3b8", marginTop: "3px" }}>
                    🖥️ {rez.masaIsim} • 🕒 {rez.tarih} {rez.saat} • ⏳ {rez.sure} Saat • 💰 ₺{rez.toplamTutar} ({rez.odemeYontemi.toUpperCase()})
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
                    {rez.durum === "confirmed" ? "Onaylandı" : "Reddedildi"}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}