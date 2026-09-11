"use client";

import React, { useEffect } from "react";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppWidget from "@/components/public/WhatsAppWidget";
import PricingCards from "@/components/public/PricingCards";

export default function OzelliklerPage() {
  useEffect(() => {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "pageview", type: "ozellikler" }),
    }).catch(e => console.error(e));
  }, []);

  return (
    <>
      <Navbar />

      <main className="features" style={{ maxWidth: "1100px", margin: "100px auto 60px", padding: "0 20px" }}>
        
        <section className="features-system" id="fiyatlar" style={{ marginTop: "40px" }}>
          <div className="features-header" style={{ textAlign: "center", marginBottom: "48px" }}>
            <span className="home-section-tag" style={{ margin: "0 auto 12px", background: "rgba(148, 163, 184, 0.1)", border: "1px solid rgba(148, 163, 184, 0.2)", color: "#cbd5e1" }}>
              <i className="fa-solid fa-tags"></i> Fiyat Tarifeleri
            </span>
            <h1 style={{ fontSize: "32px", color: "#f8fafc", fontWeight: 800, margin: "0 0 16px" }}>
              Premium Donanım, <span style={{ color: "#38bdf8" }}>Uygun Fiyatlar</span>
            </h1>
            <p style={{ fontSize: "16px", color: "#cbd5e1", lineHeight: 1.7, maxWidth: "700px", margin: "0 auto" }}>
              Kafemizdeki masaların donanım özelliklerini ve detaylı fiyat paketlerini aşağıdan inceleyebilirsiniz. Süreli peşin ödemeli oturumlarda geçerlidir.
            </p>
          </div>

          <PricingCards />

        </section>
      </main>

      <Footer />
      <WhatsAppWidget />
    </>
  );
}
