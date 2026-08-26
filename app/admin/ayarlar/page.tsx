"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/components/admin/Toast";

interface GalleryPhoto {
  id?: string;
  src: string;
  badge?: string;
}

const DEFAULT_PHOTOS: GalleryPhoto[] = [
  { id: "f1", src: "/foto1.jpeg", badge: "Ana Salon" },
  { id: "f2", src: "/foto2.jpeg", badge: "540 Hz Alan" },
  { id: "f3", src: "/foto3.jpeg", badge: "Pro Setup" },
  { id: "f4", src: "/foto4.jpeg", badge: "VIP Lounge" },
  { id: "f5", src: "/foto5.jpeg", badge: "Ekipman" },
  { id: "f6", src: "/foto6.jpeg", badge: "Turnuva" },
];

export default function AyarlarPage() {
  const { showToast } = useToast();
  const [adminUser, setAdminUser] = useState("admin");
  const [adminEmail, setAdminEmail] = useState("admin@forzagaming.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cafeName, setCafeName] = useState("Forza İnternet & Cafe");
  const [cafePhone, setCafePhone] = useState("0546 465 96 93");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(10);
  const [savedPass, setSavedPass] = useState("1234");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [passwordAgeDays, setPasswordAgeDays] = useState(0);

  // Galeri Yönetimi State
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>(DEFAULT_PHOTOS);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [newPhotoBadge, setNewPhotoBadge] = useState("");
  const [fileLabel, setFileLabel] = useState("Dosya Seç");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("forzaAyarlar");
      if (raw) {
        const data = JSON.parse(raw);
        if (data.adminUser) setAdminUser(data.adminUser);
        if (data.adminEmail) setAdminEmail(data.adminEmail);
        if (data.adminPass) setSavedPass(data.adminPass);
        if (data.cafeName) setCafeName(data.cafeName);
        if (data.cafePhone) setCafePhone(data.cafePhone);
        if (data.adminAvatar) setAvatar(data.adminAvatar);

        const lastDate = data.sifreSonDegismeTarihi || new Date().toISOString();
        const days = Math.floor((Date.now() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24));
        setPasswordAgeDays(days);
      }

      const galleryRaw = localStorage.getItem("forzaGaleriFotograflar");
      if (galleryRaw) {
        const parsedGallery = JSON.parse(galleryRaw);
        if (Array.isArray(parsedGallery) && parsedGallery.length > 0) {
          setGalleryPhotos(parsedGallery);
        }
      }
    } catch (e) {
      console.error("Ayarlar yüklenemedi:", e);
    }
  }, []);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        setAvatar(evt.target.result as string);
        showToast("Profil Fotoğrafı Seçildi (Taslak)", "Fotoğraf yüklendi. Kalıcı olması için aşağıdaki 'Değişiklikleri Kaydet' butonuna basmalısınız.", "warning");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarRemove = () => {
    setAvatar(null);
    showToast("Profil Fotoğrafı Sıfırlandı (Taslak)", "Varsayılan logoya dönüldü. Kaydet butonuna basarak onaylayın.", "info");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setFileLabel(file.name.length > 14 ? file.name.substring(0, 11) + "..." : file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        setNewPhotoUrl(evt.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddPhoto = () => {
    if (!newPhotoUrl.trim()) {
      showToast("Hata", "Lütfen bir fotoğraf dosyası seçin veya görsel URL'si girin.", "warning");
      return;
    }

    const newPhotoItem: GalleryPhoto = {
      id: "foto_" + Date.now(),
      src: newPhotoUrl.trim(),
      badge: newPhotoBadge.trim() || "Mekan Fotoğrafı",
    };

    const updated = [...galleryPhotos, newPhotoItem];
    setGalleryPhotos(updated);

    setNewPhotoUrl("");
    setNewPhotoBadge("");
    setFileLabel("Dosya Seç");

    showToast("Fotoğraf Eklendi (Taslak)", `"${newPhotoItem.badge}" listeye eklendi. Yayına almak için aşağıdaki "Değişiklikleri Kaydet" butonuna basmalısınız.`, "warning");
  };

  const handleDeletePhoto = (idOrIndex: string | number) => {
    const updated = galleryPhotos.filter((f, idx) => f.id !== idOrIndex && idx !== idOrIndex);
    setGalleryPhotos(updated);
    showToast("Fotoğraf Çıkartıldı (Taslak)", "Fotoğraf listeden çıkartıldı. Canlı siteden kaldırmak için aşağıdaki \"Değişiklikleri Kaydet\" butonuna basmalısınız.", "warning");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!adminUser.trim()) {
      showToast("Hata", "Yönetici kullanıcı adı boş bırakılamaz.", "error");
      return;
    }

    let finalPass = savedPass;

    if (newPassword || currentPassword) {
      if (currentPassword !== savedPass) {
        showToast("Hata", "Mevcut şifreniz hatalı! Lütfen doğru şifreyi girin.", "error");
        return;
      }

      if (newPassword.length < 3) {
        showToast("Uyarı", "Yeni şifre en az 3 karakter olmalıdır.", "warning");
        return;
      }

      if (newPassword !== confirmPassword) {
        showToast("Hata", "Yeni şifre ile şifre tekrarı uyuşmuyor.", "error");
        return;
      }

      finalPass = newPassword;
      setSavedPass(newPassword);
    }

    // 1. Galeri fotoğraflarını kalıcı olarak kaydet
    localStorage.setItem("forzaGaleriFotograflar", JSON.stringify(galleryPhotos));

    // 2. Sistem & Yönetici ayarlarını kaydet
    const isPassChanged = newPassword.trim() !== "";
    const newConfig = {
      adminUser: adminUser.trim(),
      adminEmail: adminEmail.trim() || "admin@forzagaming.com",
      adminPass: finalPass,
      adminAvatar: avatar,
      cafeName: cafeName.trim(),
      cafePhone: cafePhone.trim(),
      soundEnabled,
      autoRefresh,
      refreshInterval,
      sifreSonDegismeTarihi: isPassChanged ? new Date().toISOString() : (localStorage.getItem("forzaAyarlar") ? JSON.parse(localStorage.getItem("forzaAyarlar")!).sifreSonDegismeTarihi || new Date().toISOString() : new Date().toISOString()),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem("forzaAyarlar", JSON.stringify(newConfig));
    if (isPassChanged) setPasswordAgeDays(0);

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    showToast(
      "Tüm Değişiklikler Kaydedildi",
      `Profil fotoğrafınız, galeri ve kullanıcı "${adminUser}" ayarları başarıyla kaydedildi!`,
      "success"
    );
  };

  return (
    <main className="dashboard-content" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#fdfbf7", margin: 0 }}>
            Sistem &amp; Yönetici Ayarları
          </h1>
          <span style={{ fontSize: "12.5px", color: "#94a3b8" }}>
            Yönetici profil fotoğrafı, giriş bilgileri ve işletme tercihleri
          </span>
        </div>
      </div>

      <form onSubmit={handleSave} className="settings-grid">
        
        {/* 1. Hakkımızda Fotoğraf Galerisi Yönetimi */}
        <div className="dashboard-card settings-card" style={{ gridColumn: "1 / -1" }}>
          <div className="card-header" style={{ marginBottom: "8px" }}>
            <div className="settings-card-title" style={{ marginBottom: 0 }}>
              <span style={{ fontSize: "18px" }}>🖼️</span>
              <h4>Hakkımızda Fotoğraf Galerisi (Ekle &amp; Çıkart)</h4>
            </div>
            <Link href="/hakkimizda" target="_blank" className="view-all">
              Hakkımızda Sayfasında Gör ↗
            </Link>
          </div>

          <span className="card-subtitle" style={{ marginTop: "-4px", marginBottom: "14px" }}>
            Bilgisayarınızdan fotoğraf yükleyin veya görsel linki ekleyin. İstediğiniz fotoğrafı kırmızı çöp kutusu butonuyla galeriden silebilirsiniz.
          </span>

          {/* Fotoğraf Ekleme Formu */}
          <div className="gallery-upload-card">
            <strong style={{ fontSize: "13px", color: "var(--cream-100)" }}>📸 Yeni Fotoğraf Ekle</strong>
            <div className="gallery-form-row">
              <label className="gallery-file-label" htmlFor="galleryFileInput">
                📁 {fileLabel}
              </label>
              <input
                type="file"
                id="galleryFileInput"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />

              <input
                type="text"
                className="gallery-form-input"
                placeholder="veya görsel URL'si / dosya adı (örn: /foto1.jpeg)"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
              />

              <input
                type="text"
                className="gallery-form-input"
                placeholder="Fotoğraf Başlığı / Etiketi (örn: 540Hz Espor Alanı)"
                value={newPhotoBadge}
                onChange={(e) => setNewPhotoBadge(e.target.value)}
              />

              <button
                type="button"
                onClick={handleAddPhoto}
                className="gallery-add-btn"
              >
                + Galeriye Ekle
              </button>
            </div>
          </div>

          {/* Galeri Izgarası */}
          <div className="media-gallery-grid">
            {galleryPhotos.map((foto, index) => (
              <div key={foto.id || foto.src + index} className="media-item">
                <img src={foto.src} alt={foto.badge || "Mekan Fotoğrafı"} />
                <span className="media-badge">{foto.badge || "Mekan"}</span>
                <button
                  type="button"
                  onClick={() => handleDeletePhoto(foto.id || index)}
                  className="photo-delete-btn"
                  title="Fotoğrafı Galeri'den Sil"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Yönetici Profili & Giriş Bilgileri */}
        <div className="settings-card">
          <h2 className="settings-card-title">👤 Yönetici Profili &amp; Giriş Bilgileri</h2>

          {/* Avatar Yükleyici */}
          <div className="admin-avatar-manager">
            <div className="admin-avatar-preview">
              {avatar ? <img src={avatar} alt="Admin Profil" /> : "F"}
            </div>
            <div className="admin-avatar-controls">
              <label className="avatar-upload-btn" htmlFor="avatarFileInputNext">
                📷 Profil Fotoğrafı Seç
              </label>
              <input
                type="file"
                id="avatarFileInputNext"
                accept="image/*"
                onChange={handleAvatarUpload}
                style={{ display: "none" }}
              />
              <button
                type="button"
                onClick={handleAvatarRemove}
                className="avatar-remove-btn"
              >
                Fotoğrafı Kaldır / Sıfırla
              </button>
            </div>
          </div>
          
          <div className="form-group">
            <label>Yönetici Kullanıcı Adı</label>
            <input
              type="text"
              required
              className="settings-input"
              value={adminUser}
              onChange={(e) => setAdminUser(e.target.value)}
              placeholder="admin"
            />
          </div>

          <div className="form-group">
            <label>Yönetici E-Posta Adresi (Şifre Sıfırlama İçin)</label>
            <input
              type="email"
              required
              className="settings-input"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="admin@forzagaming.com"
            />
          </div>

          <div className="form-group">
            <label>Mevcut Şifre</label>
            <input
              type="password"
              placeholder="Şifre değiştirmek için mevcut şifrenizi girin"
              className="settings-input"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Yeni Şifre</label>
            <input
              type="password"
              placeholder="Değiştirmek istemiyorsanız boş bırakın"
              className="settings-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Yeni Şifre (Tekrar)</label>
            <input
              type="password"
              placeholder="Yeni şifreyi doğrulayın"
              className="settings-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div
            style={{
              marginTop: "12px",
              padding: "8px 14px",
              borderRadius: "10px",
              background: passwordAgeDays >= 180 ? "rgba(244,63,94,0.12)" : "rgba(247,242,232,0.05)",
              border: `1px solid ${passwordAgeDays >= 180 ? "rgba(244,63,94,0.3)" : "rgba(247,242,232,0.1)"}`,
              fontSize: "12px",
              color: passwordAgeDays >= 180 ? "#f43f5e" : "var(--cream-300)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>🛡️</span>
            <span>
              Şifre Güvenlik Durumu: <strong>{passwordAgeDays} gün önce</strong> değiştirildi (6 ayda bir zorunlu yenileme süresi)
            </span>
          </div>
        </div>

        {/* İşletme & Bildirim Ayarları */}
        <div className="settings-card">
          <h2 className="settings-card-title">🏢 İşletme &amp; Bildirim Tercihleri</h2>
          
          <div className="form-group">
            <label>Kafe Adı</label>
            <input
              type="text"
              className="settings-input"
              value={cafeName}
              onChange={(e) => setCafeName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>WhatsApp / İletişim Telefonu</label>
            <input
              type="tel"
              className="settings-input"
              value={cafePhone}
              onChange={(e) => setCafePhone(e.target.value)}
            />
          </div>

          <div className="toggle-setting-row" style={{ marginTop: "14px" }}>
            <div>
              <strong style={{ fontSize: "13px", color: "#fdfbf7", display: "block" }}>Sesli Bildirim Uyarısı</strong>
              <span style={{ fontSize: "11.5px", color: "#94a3b8" }}>Yeni rezervasyon geldiğinde ses çal</span>
            </div>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              style={{ width: "20px", height: "20px", accentColor: "var(--cream-gold)" }}
            />
          </div>

          <div className="toggle-setting-row" style={{ marginTop: "12px" }}>
            <div>
              <strong style={{ fontSize: "13px", color: "#fdfbf7", display: "block" }}>Otomatik Canlı Yenileme</strong>
              <span style={{ fontSize: "11.5px", color: "#94a3b8" }}>Masa durumlarını periyodik olarak güncelle</span>
            </div>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              style={{ width: "20px", height: "20px", accentColor: "var(--cream-gold)" }}
            />
          </div>
        </div>

        <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end" }}>
          <button
            type="submit"
            className="save-settings-btn"
            style={{
              padding: "14px 28px",
              borderRadius: "14px",
              background: "var(--cream-gradient)",
              color: "#07090d",
              fontWeight: 800,
              fontSize: "14px",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 6px 20px rgba(245, 238, 219, 0.3)",
            }}
          >
            ✓ Değişiklikleri Kaydet
          </button>
        </div>

      </form>
    </main>
  );
}