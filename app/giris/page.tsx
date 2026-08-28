"use client";

import React, { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Shield, Eye, EyeOff, Lock, User, ArrowRight, CheckCircle2, AlertCircle, KeyRound, ArrowLeft, Mail } from "lucide-react";

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
      setForgotMsg({ text: `Girdiğiniz bilgi sistemde kayıtlı değil! (Kayıtlı: "${savedEmail}" veya "${savedPhone}")`, type: "error" });
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setForgotStep(2);
    setForgotMsg({
      text: `✅ 6 haneli güvenlik kodunuz üretildi: [${code}]`,
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
    } catch (err) {
      console.error("Giriş hatası:", err);
      setErrorMsg("Bağlantı hatası oluştu, lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "min(440px, 100%)",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        boxSizing: "border-box",
      }}
    >
      {/* Centered Glassmorphic Card */}
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          background: "rgba(20, 28, 44, 0.94)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          borderRadius: "26px",
          padding: "36px 30px",
          boxShadow: "0 25px 65px rgba(0, 0, 0, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 0 40px rgba(255, 215, 0, 0.08)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          boxSizing: "border-box",
        }}
      >
        {/* Header with Logo Badge */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", width: "100%" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "18px",
              background: "linear-gradient(135deg, #ffd700 0%, #b8860b 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 24px rgba(255, 215, 0, 0.4)",
              overflow: "hidden",
              border: "2px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            {avatar ? (
              <img src={avatar} alt="Admin" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontSize: "28px", fontWeight: 900, color: "#07090d", fontFamily: "'Racing Sans One', sans-serif" }}>
                F
              </span>
            )}
          </div>

          <div>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: 800,
                color: "#ffffff",
                margin: 0,
                letterSpacing: "-0.5px",
                fontFamily: "'Sora', sans-serif",
              }}
            >
              Yönetici Paneli
            </h1>
            <p style={{ fontSize: "13px", color: "#cbd5e1", margin: "4px 0 0" }}>
              Forza İnternet &amp; Cafe Yönetim Konsolu
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "12px",
              background: "rgba(244, 63, 94, 0.14)",
              border: "1px solid rgba(244, 63, 94, 0.35)",
              color: "#f43f5e",
              fontSize: "13px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              textAlign: "left",
            }}
          >
            <AlertCircle size={17} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Inputs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", width: "100%", textAlign: "left" }}>
          {/* Username */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: 700, color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Kullanıcı Adı
            </label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <User
                size={18}
                style={{
                  position: "absolute",
                  left: "14px",
                  color: "#94a3b8",
                  pointerEvents: "none",
                }}
              />
              <input
                type="text"
                placeholder="örn: admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "13px 14px 13px 44px",
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                  borderRadius: "12px",
                  color: "#ffffff",
                  fontSize: "14.5px",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "all 0.2s ease",
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: 700, color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Şifre
            </label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <Lock
                size={18}
                style={{
                  position: "absolute",
                  left: "14px",
                  color: "#94a3b8",
                  pointerEvents: "none",
                }}
              />
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "13px 44px 13px 44px",
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                  borderRadius: "12px",
                  color: "#ffffff",
                  fontSize: "14.5px",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "all 0.2s ease",
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
                  color: "#94a3b8",
                  cursor: "pointer",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Options (Remember & Forgot) */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            fontSize: "13px",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#cbd5e1",
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ accentColor: "#ffd700", cursor: "pointer", width: "16px", height: "16px" }}
            />
            Beni Hatırla
          </label>

          <button
            type="button"
            onClick={() => {
              setShowForgotModal(true);
              setForgotStep(1);
              setForgotMsg(null);
            }}
            style={{
              background: "none",
              border: "none",
              color: "#ffd700",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              padding: 0,
              transition: "color 0.15s ease",
            }}
          >
            Şifremi Unuttum?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: "6px",
            width: "100%",
            padding: "15px",
            borderRadius: "14px",
            background: "linear-gradient(135deg, #ffd700 0%, #d4af37 50%, #b8860b 100%)",
            color: "#000000",
            fontWeight: 900,
            fontSize: "15.5px",
            border: "none",
            cursor: loading ? "wait" : "pointer",
            boxShadow: "0 6px 24px rgba(255, 215, 0, 0.4)",
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
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      {/* ŞİFREMİ UNUTTUM MODAL - HIGH CONTRAST OBSIDIAN LUXURY */}
      {showForgotModal && (
        <div
          className="modal-overlay"
          style={{
            display: "flex",
            position: "fixed",
            inset: 0,
            background: "rgba(5, 8, 14, 0.88)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            zIndex: 99999,
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            className="modal-card"
            style={{
              width: "min(440px, 100%)",
              background: "rgba(20, 28, 44, 0.96)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "24px",
              padding: "32px 26px",
              boxShadow: "0 25px 65px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 0 40px rgba(255, 215, 0, 0.15)",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              boxSizing: "border-box",
              position: "relative",
            }}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", borderBottom: "1px solid rgba(255, 255, 255, 0.12)", paddingBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", textAlign: "left" }}>
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "12px",
                    background: "rgba(255, 215, 0, 0.15)",
                    border: "1px solid rgba(255, 215, 0, 0.35)",
                    color: "#ffd700",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: "0 0 16px rgba(255, 215, 0, 0.2)",
                  }}
                >
                  <KeyRound size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#ffffff", margin: 0, fontFamily: "'Sora', sans-serif" }}>
                    Şifre Sıfırlama
                  </h3>
                  <span style={{ fontSize: "12px", color: "#cbd5e1", marginTop: "2px", display: "block" }}>
                    {forgotStep === 1 ? "Doğrulama bilginizi girin" : "Yeni şifrenizi belirleyin"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotStep(1);
                  setForgotMsg(null);
                }}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                  color: "#ffffff",
                  fontSize: "18px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                  transition: "all 0.15s ease",
                }}
              >
                &times;
              </button>
            </div>

            {/* Step 1: E-posta / Telefon Girişi */}
            {forgotStep === 1 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "left" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Kayıtlı E-Posta veya Telefon
                  </label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <Mail size={18} style={{ position: "absolute", left: "14px", color: "#94a3b8", pointerEvents: "none" }} />
                    <input
                      type="text"
                      placeholder="admin@forzagaming.com veya 0546 465 96 93"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSendResetCode();
                        }
                      }}
                      style={{
                        width: "100%",
                        padding: "13px 14px 13px 44px",
                        borderRadius: "12px",
                        background: "rgba(255, 255, 255, 0.08)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        color: "#ffffff",
                        fontSize: "14px",
                        outline: "none",
                        boxSizing: "border-box",
                        transition: "all 0.2s ease",
                      }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSendResetCode}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "12px",
                    background: "#ffffff",
                    color: "#0b0f19",
                    fontWeight: 900,
                    fontSize: "14.5px",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 4px 18px rgba(255, 255, 255, 0.35)",
                    transition: "transform 0.15s ease, background 0.15s ease",
                  }}
                >
                  Güvenlik Kodu Üret &amp; Devam Et
                </button>
              </div>
            ) : (
              /* Step 2: Güvenlik Kodu & Yeni Şifre */
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "left" }}>
                {/* Güvenlik Kodu */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      6 Haneli Güvenlik Kodu
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotStep(1);
                        setForgotMsg(null);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#38bdf8",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: 0,
                      }}
                    >
                      <ArrowLeft size={13} /> Bilgiyi Değiştir
                    </button>
                  </div>

                  <input
                    type="text"
                    maxLength={6}
                    placeholder="6 haneli kod"
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "12px",
                      background: "rgba(255, 215, 0, 0.1)",
                      border: "1px solid rgba(255, 215, 0, 0.4)",
                      color: "#ffd700",
                      fontSize: "18px",
                      fontWeight: 900,
                      letterSpacing: "6px",
                      textAlign: "center",
                      outline: "none",
                      boxSizing: "border-box",
                      boxShadow: "0 0 16px rgba(255, 215, 0, 0.15)",
                    }}
                  />
                </div>

                {/* Yeni Şifre */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Yeni Şifre
                  </label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <Lock size={18} style={{ position: "absolute", left: "14px", color: "#94a3b8", pointerEvents: "none" }} />
                    <input
                      type={showResetPass ? "text" : "password"}
                      placeholder="Yeni şifreniz"
                      value={newResetPass}
                      onChange={(e) => setNewResetPass(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "13px 44px 13px 44px",
                        borderRadius: "12px",
                        background: "rgba(255, 255, 255, 0.08)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        color: "#ffffff",
                        fontSize: "14px",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowResetPass(!showResetPass)}
                      style={{
                        position: "absolute",
                        right: "12px",
                        background: "none",
                        border: "none",
                        color: "#94a3b8",
                        cursor: "pointer",
                        padding: "4px",
                        display: "flex",
                      }}
                    >
                      {showResetPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Yeni Şifre Tekrarı */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Yeni Şifre Tekrarı
                  </label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <Lock size={18} style={{ position: "absolute", left: "14px", color: "#94a3b8", pointerEvents: "none" }} />
                    <input
                      type={showConfirmResetPass ? "text" : "password"}
                      placeholder="Yeni şifrenizi tekrar girin"
                      value={confirmResetPass}
                      onChange={(e) => setConfirmResetPass(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "13px 44px 13px 44px",
                        borderRadius: "12px",
                        background: "rgba(255, 255, 255, 0.08)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        color: "#ffffff",
                        fontSize: "14px",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmResetPass(!showConfirmResetPass)}
                      style={{
                        position: "absolute",
                        right: "12px",
                        background: "none",
                        border: "none",
                        color: "#94a3b8",
                        cursor: "pointer",
                        padding: "4px",
                        display: "flex",
                      }}
                    >
                      {showConfirmResetPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmResetPass}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    color: "#ffffff",
                    fontWeight: 900,
                    fontSize: "14.5px",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 6px 20px rgba(16, 185, 129, 0.4)",
                    transition: "transform 0.15s ease",
                  }}
                >
                  ✓ Şifreyi Güncelle &amp; Giriş Yap
                </button>
              </div>
            )}

            {/* Notification / Feedback Banner */}
            {forgotMsg && (
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: "12px",
                  background: forgotMsg.type === "success" ? "rgba(16, 185, 129, 0.16)" : "rgba(244, 63, 94, 0.16)",
                  border: forgotMsg.type === "success" ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid rgba(244, 63, 94, 0.4)",
                  color: forgotMsg.type === "success" ? "#34d399" : "#f43f5e",
                  fontSize: "13px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  textAlign: "left",
                }}
              >
                {forgotMsg.type === "success" ? (
                  <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
                ) : (
                  <AlertCircle size={18} style={{ flexShrink: 0 }} />
                )}
                <span>{forgotMsg.text}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Return to Site */}
      <div style={{ marginTop: "24px" }}>
        <Link
          href="/"
          style={{
            color: "#94a3b8",
            fontSize: "13.5px",
            fontWeight: 600,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            transition: "color 0.15s ease",
          }}
        >
          <ArrowLeft size={16} />
          <span>Web Sitesine Geri Dön</span>
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div style={{ textAlign: "center", color: "#ffffff", padding: "80px 20px" }}>
          Yükleniyor...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}