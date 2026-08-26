"use client";

import React, { useState } from "react";

export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky-contact">
      {open && (
        <div
          style={{
            position: "absolute",
            bottom: "65px",
            right: "0",
            width: "260px",
            background: "rgba(14, 18, 26, 0.95)",
            border: "1px solid rgba(247, 242, 232, 0.22)",
            borderRadius: "18px",
            padding: "16px",
            backdropFilter: "blur(20px)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            zIndex: 9999,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong style={{ fontSize: "14px", color: "#fdfbf7" }}>Forza İletişim</strong>
            <button
              type="button"
              onClick={() => setOpen(false)}
              style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "14px" }}
            >
              ✕
            </button>
          </div>
          <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>
            Rezervasyon, masa durumu veya sorularınız için hemen bize ulaşın:
          </p>
          <a
            href="https://wa.me/905464659693?text=Merhaba,%20Forza%20İnternet%20Cafe%20rezervasyonu%20hakkında%20bilgi%20almak%20istiyorum."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              padding: "10px",
              background: "#25D366",
              color: "#ffffff",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "13px",
              textDecoration: "none",
            }}
          >
            💬 WhatsApp Sohbeti Aç
          </a>
        </div>
      )}

      <button
        type="button"
        className="sticky-contact-button"
        aria-label="WhatsApp İletişim"
        onClick={() => setOpen(!open)}
      >
        💬
      </button>
    </div>
  );
}