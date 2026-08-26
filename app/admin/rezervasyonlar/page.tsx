"use client";

import React, { useState, useEffect } from "react";
import { Rezervasyon } from "@/lib/types";
import { useToast } from "@/components/admin/Toast";

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
      const res = await fetch("/api/reservations");
      const data = await res.json();
      if (data.reservations) setReservations(data.reservations);
    } catch (err) {
      console.error("Rezervasyonlar yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleAction = async (id: string, durum: "confirmed" | "rejected") => {
    try {
      const res = await fetch("/api/reservations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, durum }),
      });
      const data = await res.json();
      if (data.success) {
        setReservations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, durum, okundu: true } : r))
        );
        showToast(
          durum === "confirmed" ? "Onaylandı" : "Reddedildi",
          durum === "confirmed" ? "Masa kullanıcı için hazırlandı." : "Talep iptal edildi.",
          durum === "confirmed" ? "success" : "warning"
        );
      }
    } catch {
      showToast("Hata", "İşlem yapılamadı", "error");
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
    <main className="dashboard-content" style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#fdfbf7", margin: 0 }}>
            Gelen Siparişler &amp; Talepler
          </h1>
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>
            Web sitesinden anlık iletilen müşteri rezervasyonları
          </span>
        </div>

        <button
          type="button"
          onClick={markAllRead}
          className="mark-all-read-btn"
        >
          ✓✓ Tümünü Okundu Yap
        </button>
      </div>

      {/* Filter and Search */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div className="computer-filter-tabs" style={{ maxWidth: "380px" }}>
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

        <div className="ios-search-bar" style={{ maxWidth: "300px", width: "100%" }}>
          <input
            type="text"
            placeholder="Müşteri veya tel ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Reservation List */}
      <div className="dashboard-card" style={{ padding: "20px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>Yükleniyor...</div>
        ) : filtered.length === 0 ? (
          <p style={{ textAlign: "center", padding: "30px", color: "#94a3b8" }}>Aramanızla eşleşen rezervasyon bulunamadı.</p>
        ) : (
          <div className="reservation-list">
            {filtered.map((rez) => (
              <div key={rez.id} className={`reservation-item ${rez.durum === "pending" ? "highlight" : ""}`}>
                <div className="reservation-icon">📅</div>
                <div className="reservation-info">
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <strong style={{ fontSize: "14px" }}>{rez.musteriAdi}</strong>
                    <span style={{ fontSize: "11px", padding: "2px 6px", background: "rgba(247,242,232,0.1)", borderRadius: "6px" }}>
                      📞 {rez.telefon}
                    </span>
                  </div>
                  <span>
                    🖥️ {rez.masaIsim} ({rez.kategori.toUpperCase()}) • 🕒 {rez.tarih} {rez.saat} • ⏳ {rez.sure} Saat • 💰 {rez.toplamTutar} ₺ ({rez.odemeYontemi.toUpperCase()})
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
                      ✓
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAction(rez.id, "rejected")}
                      className="res-btn res-btn-reject"
                      title="Reddet"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      padding: "6px 12px",
                      borderRadius: "8px",
                      background: rez.durum === "confirmed" ? "rgba(16,185,129,0.18)" : "rgba(244,63,94,0.18)",
                      color: rez.durum === "confirmed" ? "#10b981" : "#f43f5e",
                      border: `1px solid ${rez.durum === "confirmed" ? "rgba(16,185,129,0.4)" : "rgba(244,63,94,0.4)"}`,
                    }}
                  >
                    {rez.durum === "confirmed" ? "ONAYLANDI" : "REDDEDİLDİ"}
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