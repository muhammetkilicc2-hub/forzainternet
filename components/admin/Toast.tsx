"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface ToastMessage {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
}

interface ToastContextType {
  showToast: (title: string, message: string, type?: ToastMessage["type"]) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((title: string, message: string, type: ToastMessage["type"] = "success") => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);

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
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>{t.message}</span>
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