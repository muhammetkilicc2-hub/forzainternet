"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
}

export interface ToastContextType {
  showToast: (title: string, message?: string, type?: ToastMessage["type"]) => void;
}

export function playChimeSound() {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const playChimeNote = (freq: number, start: number, dur: number, gainLevel: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);

      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(gainLevel, ctx.currentTime + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur + 0.05);
    };

    // Kristal Apple Studio Chime Sesi
    playChimeNote(659.25, 0, 0.35, 0.18);
    playChimeNote(880.0, 0.1, 0.45, 0.22);
    playChimeNote(1318.51, 0.2, 0.65, 0.15);
  } catch (e) {
    console.warn("Ses çalınamadı:", e);
  }
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((title: string, message = "", type: ToastMessage["type"] = "success") => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    playChimeSound();

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div id="toastContainer" className="toast-container" style={{ position: "fixed", top: "20px", right: "20px", zIndex: 99999, display: "flex", flexDirection: "column", gap: "10px" }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast-item ${t.type === "success" ? "basarili" : t.type === "error" ? "hata" : "uyari"}`}
            style={{
              background: "rgba(14, 18, 26, 0.95)",
              border: `1px solid ${t.type === "success" ? "rgba(16, 185, 129, 0.45)" : t.type === "error" ? "rgba(244, 63, 94, 0.45)" : "rgba(245, 158, 11, 0.45)"}`,
              borderRadius: "14px",
              padding: "12px 16px",
              color: "#ffffff",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              backdropFilter: "blur(20px)",
              minWidth: "260px",
              maxWidth: "340px",
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
            }}
          >
            <span style={{ fontSize: "18px" }}>
              {t.type === "success" ? "✓" : t.type === "error" ? "✕" : "⚠️"}
            </span>
            <div>
              <strong style={{ display: "block", fontSize: "13px", color: "#fdfbf7", marginBottom: "2px" }}>
                {t.title}
              </strong>
              {t.message && <span style={{ fontSize: "12px", color: "#94a3b8" }}>{t.message}</span>}
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}