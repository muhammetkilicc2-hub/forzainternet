"use client";

import React, { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Shield, Eye, EyeOff, Lock, User, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);

  // Şifremi Unuttum State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [newResetPass, setNewResetPass] = useState("");
  const [confirmResetPass, setConfirmResetPass] = useState("");
  const [showResetPass, setShowResetPass] = useState(false);
  const [showConfirmResetPass, setShowConfirmResetPass] = useState(false);
  const [forgotMsg, setForgotMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    // Load avatar if exists
    try {
      const raw = localStorage.getItem("forzaAyarlar");
      if (raw) {
        const data = JSON.parse(raw);
        if (data.adminAvatar) setAvatar(data.adminAvatar);
      }
    } catch (e) {}
  }, []);

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

  const handleConfirmResetPass = async () => {
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
      await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailOrPhone: forgotEmail,
          newPassword: newResetPass,
        }),
      });

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
      style={{
        width: "100%",
        maxWidth: "420px",
        background: "rgba(14, 18, 26, 0.95)",
        border: "1px solid rgba(255, 215, 0, 0.25)",
        borderRadius: "24px",
        padding: "36px 30px",
        boxShadow: "0 25px 70px rgba(0, 0, 0, 0.85), 0 0 35px rgba(255, 215, 0, 0.08)",
        backdropFilter: "blur(30px)",
        WebkitBackdropFilter: "blur(30px)",
        textAlign: "center",
        boxSizing: "border-box",
      }}
    >
      {/* Top Logo Badge */}
      <div
        style={{
          width: "60px",
          height: "60px",
          margin: "0 auto 16px",
          borderRadius: "16px",
          background: "linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 215, 0, 0.05))",
          border: "1px solid rgba(255, 215, 0, 0.5)",
          color: "#ffd700",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "26px",
          fontWeight: 900,
          boxShadow: "0 0 24px rgba(255, 215, 0, 0.25)",
          overflow: "hidden",
        }}
      >
        {avatar ? (
          <img src={avatar} alt="Admin Profil" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          "F"
        )}
      </div>

      <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#ffffff", margin: "0 0 6px", letterSpacing: "-0.3px" }}>
        Forza Yönetici Girişi
      </h2>
      <p style={{ fontSize: "13px", color: "#94a3b8", margin: "0 0 24px" }}>
        Güvenli Obsidian Studio Yönetim Portalı
      </p>

      {errorMsg && (
        <div
          style={{
            padding: "11px 14px",
            borderRadius: "12px",
            background: "rgba(244, 63, 94, 0.15)",
            border: "1px solid rgba(244, 63, 94, 0.35)",
            color: "#fb7185",
            fontSize: "13px",
            marginBottom: "18px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            textAlign: "left",
          }}
        >
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ textAlign: "left" }}>
          <label style={{ fontSize: "11.5px", color: "#cbd5e1", display: "block", marginBottom: "6px", fontWeight: 700, letterSpacing: "0.5px" }}>
            KULLANICI ADI
          </label>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <User size={18} style={{ position: "absolute", left: "14px", color: "#64748b" }} />
            <input
              type="text"
              required
              autoFocus
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: "100%",
                padding: "13px 14px 13px 42px",
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#ffffff",
                fontSize: "14.5px",
                outline: "none",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(255, 215, 0, 0.6)";
                e.target.style.boxShadow = "0 0 16px rgba(255, 215, 0, 0.15)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255, 255, 255, 0.12)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
        </div>

        <div style={{ textAlign: "left" }}>
          <label style={{ fontSize: "11.5px", color: "#cbd5e1", display: "block", marginBottom: "6px", fontWeight: 700, letterSpacing: "0.5px" }}>
            ŞİFRE
          </label>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <Lock size={18} style={{ position: "absolute", left: "14px", color: "#64748b" }} />
            <input
              type={showPass ? "text" : "password"}
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "13px 42px 13px 42px",
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#ffffff",
                fontSize: "14.5px",
                outline: "none",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(255, 215, 0, 0.6)";
                e.target.style.boxShadow = "0 0 16px rgba(255, 215, 0, 0.15)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255, 255, 255, 0.12)";
                e.target.style.boxShadow = "none";
              }}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              style={{
                position: "absolute",
                right: "12px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: showPass ? "#ffd700" : "#64748b",
                padding: "4px",
                display: "flex",
                alignItems: "center",
              }}
              title={showPass ? "Şifreyi Gizle" : "Şifreyi Göster"}
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12.5px", color: "#94a3b8", cursor: "pointer", userSelect: "none" }}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ accentColor: "#ffd700", cursor: "pointer", width: "15px", height: "15px" }}
            />
            Beni Hatırla
          </label>

          <button
            type="button"
            onClick={() => setShowForgotModal(true)}
            style={{
              background: "none",
              border: "none",
              color: "#ffd700",
              fontSize: "12.5px",
              fontWeight: 700,
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
            marginTop: "10px",
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #ffd700 0%, #d4af37 50%, #b8860b 100%)",
            color: "#000000",
            fontWeight: 800,
            fontSize: "15px",
            border: "none",
            cursor: loading ? "wait" : "pointer",
            boxShadow: "0 6px 24px rgba(255, 215, 0, 0.35)",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          {loading ? (
            "Giriş Yapılıyor..."
          ) : (
            <>
              <span>Güvenli Giriş Yap</span>
              <ArrowRight size={17} />
            </>
          )}
        </button>
      </form>

      {/* Şifremi Unuttum Modal */}
      {showForgotModal && (
        <div className="modal-overlay" style={{ display: "flex" }}>
          <div className="modal-card" style={{ maxWidth: "420px" }}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#fdfbf7", margin: 0 }}>🔐 Şifre Sıfırlama</h3>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>E-posta veya telefonunuza güvenlik kodu üretilir</span>
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
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px", textAlign: "left" }}>
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
                      borderRadius: "10px",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      color: "#ffffff",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendResetCode}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #ffd700, #b8860b)",
                    color: "#000",
                    fontWeight: 800,
                    fontSize: "14px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Güvenlik Kodu Üret &amp; Devam Et
                </button>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px", textAlign: "left" }}>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--cream-300)", display: "block", marginBottom: "4px" }}>
                      6 Haneli Güvenlik Kodu
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="6 haneli kodu girin"
                      value={verifyCode}
                      onChange={(e) => setVerifyCode(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "10px",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        color: "#ffd700",
                        fontSize: "16px",
                        fontWeight: 800,
                        letterSpacing: "4px",
                        textAlign: "center",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--cream-300)", display: "block", marginBottom: "4px" }}>
                      Yeni Şifre
                    </label>
                    <input
                      type={showResetPass ? "text" : "password"}
                      placeholder="Yeni şifreniz"
                      value={newResetPass}
                      onChange={(e) => setNewResetPass(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "10px",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        color: "#ffffff",
                        fontSize: "14px",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--cream-300)", display: "block", marginBottom: "4px" }}>
                      Yeni Şifre Tekrarı
                    </label>
                    <input
                      type={showConfirmResetPass ? "text" : "password"}
                      placeholder="Yeni şifrenizi tekrar girin"
                      value={confirmResetPass}
                      onChange={(e) => setConfirmResetPass(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "10px",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        color: "#ffffff",
                        fontSize: "14px",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmResetPass}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: "14px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  ✓ Şifreyi Güncelle &amp; Giriş Yap
                </button>
              </div>
            )}

            {forgotMsg && (
              <div
                style={{
                  fontSize: "12.5px",
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
            fontSize: "13px",
            textDecoration: "none",
            transition: "color 0.15s ease",
            fontWeight: 600,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#ffd700")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
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
        background: "radial-gradient(circle at 50% 15%, rgba(255, 215, 0, 0.08) 0%, transparent 60%), #07090e",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <Suspense fallback={<div style={{ color: "#94a3b8", fontSize: "14px" }}>Yükleniyor...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}