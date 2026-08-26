"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Şifremi Unuttum State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [newResetPass, setNewResetPass] = useState("");
  const [confirmResetPass, setConfirmResetPass] = useState("");
  const [forgotMsg, setForgotMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleSendResetCode = () => {
    const inputClean = forgotEmail.trim().toLowerCase();
    if (!inputClean || inputClean.length < 4) {
      setForgotMsg({ text: "Lütfen kayıtlı e-posta adresinizi veya telefon numaranızı girin.", type: "error" });
      return;
    }

    let savedEmail = "admin@forzagaming.com";
    let savedPhone = "0546 465 96 93";
    try {
      const raw = localStorage.getItem("forzaAyarlar");
      if (raw) {
        const data = JSON.parse(raw);
        if (data.adminEmail) savedEmail = data.adminEmail.toLowerCase();
        if (data.cafePhone) savedPhone = data.cafePhone;
      }
    } catch (e) {}

    const digitsOnly = inputClean.replace(/\D/g, "");
    const savedDigits = savedPhone.replace(/\D/g, "");
    const isEmailMatch = (inputClean === savedEmail || inputClean === "admin@forzacafe.com" || inputClean === "admin@forzagaming.com");
    const isPhoneMatch = digitsOnly.length >= 10 && (savedDigits.includes(digitsOnly) || digitsOnly.includes("5464659693"));

    if (!isEmailMatch && !isPhoneMatch) {
      setForgotMsg({ text: `Girdiğiniz bilgi kayıtlı değil! Kayıtlı: "${savedEmail}" veya "${savedPhone}"`, type: "error" });
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setForgotStep(2);
    setForgotMsg({
      text: `✅ 6 haneli güvenlik kodunuz üretildi. [Güvenlik Kodu: ${code}]`,
      type: "success",
    });
  };

  const handleConfirmResetPass = () => {
    if (!verifyCode.trim() || verifyCode.trim() !== generatedCode) {
      setForgotMsg({ text: "Hatalı güvenlik kodu! Lütfen size verilen 6 haneli kodu girin.", type: "error" });
      return;
    }

    if (newResetPass.length < 3) {
      setForgotMsg({ text: "Yeni şifre en az 3 karakter olmalıdır.", type: "error" });
      return;
    }

    if (newResetPass !== confirmResetPass) {
      setForgotMsg({ text: "Yeni şifreler birbiriyle uyuşmuyor.", type: "error" });
      return;
    }

    try {
      let ayarlar: Record<string, unknown> = {
        adminUser: "admin",
        adminPass: newResetPass,
        adminEmail: forgotEmail,
        sifreSonDegismeTarihi: new Date().toISOString(),
      };
      const raw = localStorage.getItem("forzaAyarlar");
      if (raw) {
        ayarlar = Object.assign(ayarlar, JSON.parse(raw));
      }
      ayarlar.adminPass = newResetPass;
      ayarlar.sifreSonDegismeTarihi = new Date().toISOString();
      localStorage.setItem("forzaAyarlar", JSON.stringify(ayarlar));
    } catch (e) {}

    setForgotMsg({ text: "🎉 Şifreniz başarıyla güncellendi! Giriş yapılıyor...", type: "success" });

    setTimeout(() => {
      setShowForgotModal(false);
      setPassword(newResetPass);
      setForgotMsg(null);
      setForgotStep(1);
    }, 1200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("forzaAdminGiris", "true");
        }
        router.push(redirectUrl);
      } else {
        setErrorMsg(data.message || "Kullanıcı adı veya şifre hatalı!");
      }
    } catch {
      setErrorMsg("Bağlantı hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-box"
      style={{
        width: "100%",
        maxWidth: "380px",
        background: "rgba(14, 18, 26, 0.94)",
        border: "1px solid rgba(247, 242, 232, 0.22)",
        borderRadius: "28px",
        padding: "36px 28px",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(30px)",
        textAlign: "center",
      }}
    >
      <div
        className="forza-logo-badge"
        style={{
          width: "56px",
          height: "56px",
          fontSize: "24px",
          margin: "0 auto 16px",
          borderRadius: "16px",
          background: "linear-gradient(135deg, #ffffff, #ede3d1)",
          color: "#07090d",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
          boxShadow: "0 8px 24px rgba(245, 238, 219, 0.3)",
        }}
      >
        F
      </div>

      <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#fdfbf7", margin: "0 0 6px" }}>
        Forza Yönetici Girişi
      </h2>
      <p style={{ fontSize: "12.5px", color: "#94a3b8", margin: "0 0 24px" }}>
        Güvenli Apple Obsidian Studio Paneli
      </p>

      {errorMsg && (
        <div
          style={{
            padding: "10px",
            borderRadius: "12px",
            background: "rgba(244, 63, 94, 0.15)",
            border: "1px solid rgba(244, 63, 94, 0.4)",
            color: "#f43f5e",
            fontSize: "12.5px",
            marginBottom: "16px",
            fontWeight: 600,
          }}
        >
          ✕ {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <div style={{ textAlign: "left" }}>
          <label style={{ fontSize: "11.5px", color: "#94a3b8", display: "block", marginBottom: "4px", fontWeight: 700 }}>
            KULLANICI ADI
          </label>
          <input
            type="text"
            required
            autoFocus
            placeholder="admin"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: "12px",
              background: "rgba(247, 242, 232, 0.06)",
              border: "1px solid rgba(247, 242, 232, 0.18)",
              color: "#ffffff",
              fontSize: "14px",
              outline: "none",
            }}
          />
        </div>

        <div style={{ textAlign: "left" }}>
          <label style={{ fontSize: "11.5px", color: "#94a3b8", display: "block", marginBottom: "4px", fontWeight: 700 }}>
            ŞİFRE
          </label>
          <input
            type="password"
            required
            placeholder="••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: "12px",
              background: "rgba(247, 242, 232, 0.06)",
              border: "1px solid rgba(247, 242, 232, 0.18)",
              color: "#ffffff",
              fontSize: "14px",
              outline: "none",
            }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-6px" }}>
          <button
            type="button"
            onClick={() => setShowForgotModal(true)}
            style={{
              background: "none",
              border: "none",
              color: "var(--cream-gold)",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              padding: 0,
            }}
          >
            Şifremi Unuttum?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: "8px",
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #ffffff 0%, #f7f2e8 50%, #ede3d1 100%)",
            color: "#07090d",
            fontWeight: 800,
            fontSize: "15px",
            border: "none",
            cursor: loading ? "wait" : "pointer",
            boxShadow: "0 6px 20px rgba(245, 238, 219, 0.3)",
            transition: "transform 0.15s ease",
          }}
        >
          {loading ? "Giriş Yapılıyor..." : "Giriş Yap ➔"}
        </button>
      </form>

      {/* Şifremi Unuttum Modal */}
      {showForgotModal && (
        <div className="modal-overlay" style={{ display: "flex" }}>
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#fdfbf7", margin: 0 }}>🔐 Şifre Sıfırlama</h3>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>E-posta veya telefon numaranıza kod üretilir</span>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotStep(1);
                  setForgotMsg(null);
                }}
              >
                &times;
              </button>
            </div>

            {forgotStep === 1 ? (
              <div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "14px", textAlign: "left" }}>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--cream-300)" }}>
                    Kayıtlı E-Posta veya Telefon
                  </label>
                  <input
                    type="text"
                    placeholder="örn: admin@forzagaming.com veya 0546 465 96 93"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "12px",
                      background: "rgba(247, 242, 232, 0.06)",
                      border: "1px solid rgba(247, 242, 232, 0.18)",
                      color: "#ffffff",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendResetCode}
                  className="primary-btn"
                  style={{ width: "100%" }}
                >
                  📩 Doğrulama Kodu Üret &amp; Gönder
                </button>
              </div>
            ) : (
              <div>
                {generatedCode && (
                  <div style={{ marginBottom: "12px" }}>
                    <a
                      href={`https://wa.me/905464659693?text=${encodeURIComponent(`*FORZA YÖNETİCİ ŞİFRE SIFIRLAMA*\nGüvenlik Kodunuz: ${generatedCode}\nBu kodu girerek yeni şifrenizi belirleyebilirsiniz.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="primary-btn"
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        background: "#25D366",
                        color: "#fff",
                        textDecoration: "none",
                        padding: "10px",
                        borderRadius: "12px",
                        fontWeight: 700,
                        fontSize: "13px",
                      }}
                    >
                      📲 WhatsApp ile Kodu Telefona İlet
                    </a>
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "10px", textAlign: "left" }}>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--cream-300)" }}>6 Haneli Güvenlik Kodu</label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Örn: 849201"
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "12px",
                      background: "rgba(247, 242, 232, 0.06)",
                      border: "1px solid rgba(247, 242, 232, 0.18)",
                      color: "#ffffff",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "10px", textAlign: "left" }}>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--cream-300)" }}>Yeni Şifre</label>
                  <input
                    type="password"
                    placeholder="En az 3 karakter"
                    value={newResetPass}
                    onChange={(e) => setNewResetPass(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "12px",
                      background: "rgba(247, 242, 232, 0.06)",
                      border: "1px solid rgba(247, 242, 232, 0.18)",
                      color: "#ffffff",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "14px", textAlign: "left" }}>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--cream-300)" }}>Yeni Şifre (Tekrar)</label>
                  <input
                    type="password"
                    placeholder="Yeni şifreyi tekrar yazın"
                    value={confirmResetPass}
                    onChange={(e) => setConfirmResetPass(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "12px",
                      background: "rgba(247, 242, 232, 0.06)",
                      border: "1px solid rgba(247, 242, 232, 0.18)",
                      color: "#ffffff",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleConfirmResetPass}
                  className="primary-btn"
                  style={{ width: "100%" }}
                >
                  ✓ Şifreyi Güncelle &amp; Kaydet
                </button>
              </div>
            )}

            {forgotMsg && (
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  marginTop: "14px",
                  textAlign: "center",
                  color: forgotMsg.type === "success" ? "#10b981" : "#f43f5e",
                }}
              >
                {forgotMsg.text}
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ marginTop: "24px" }}>
        <Link
          href="/"
          style={{
            color: "#94a3b8",
            fontSize: "12px",
            textDecoration: "none",
            transition: "color 0.15s ease",
          }}
        >
          ← Ana Sayfaya Geri Dön
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at 50% 0%, rgba(245, 238, 219, 0.08) 0%, transparent 70%), #07090d",
        padding: "20px",
      }}
    >
      <Suspense fallback={<div style={{ color: "#94a3b8", fontSize: "14px" }}>Yükleniyor...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}