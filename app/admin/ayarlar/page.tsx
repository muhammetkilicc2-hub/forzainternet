"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/components/admin/Toast";

import { GalleryPhoto } from "@/lib/types";

const DEFAULT_PHOTOS: GalleryPhoto[] = [
  { id: "f1", src: "/foto1.jpeg", badge: "Ana Salon", alt: "Forza Gaming Salonu - Ana Espor Alanı", caption: "Forza Gaming Salonu - Ana Espor Alanı" },
  { id: "f2", src: "/foto2.jpeg", badge: "540 Hz Alan", alt: "540Hz BenQ Espor Turnuva Masaları", caption: "540Hz BenQ Espor Turnuva Masaları" },
  { id: "f3", src: "/foto3.jpeg", badge: "Pro Setup", alt: "Pro Gaming RTX 4070 Setup", caption: "Pro Gaming RTX 4070 Setup" },
  { id: "f4", src: "/foto4.jpeg", badge: "VIP Lounge", alt: "VIP Espor Akustik Alanı", caption: "VIP Espor Akustik Alanı" },
  { id: "f5", src: "/foto5.jpeg", badge: "Ekipman", alt: "Ergonomik Espor Koltukları & Ekipmanlar", caption: "Ergonomik Espor Koltukları & Ekipmanlar" },
  { id: "f6", src: "/foto6.jpeg", badge: "Turnuva", alt: "Forza Turnuva ve Takım Odası", caption: "Forza Turnuva ve Takım Odası" },
];

export default function AyarlarPage() {
  const { showToast } = useToast();
  const [adminUser, setAdminUser] = useState("admin");
  const [adminEmail, setAdminEmail] = useState("admin@forzagaming.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [cafeName, setCafeName] = useState("Forza İnternet & Cafe");
  const [cafePhone, setCafePhone] = useState("0546 465 96 93");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(10);
  const [savedPass, setSavedPass] = useState("1234");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [passwordAgeDays, setPasswordAgeDays] = useState(0);

  // Galeri & Vitrin Yönetimi State
  const [aboutCoverPhoto, setAboutCoverPhoto] = useState<string>("/foto1.jpeg");
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>(DEFAULT_PHOTOS);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [newPhotoBadge, setNewPhotoBadge] = useState("");
  const [fileLabel, setFileLabel] = useState("Dosya Seç");
  const [isUploading, setIsUploading] = useState(false);
  const [isCoverUploading, setIsCoverUploading] = useState(false);

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "", color: "#94a3b8", width: "0%" };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score: 1, label: "Zayıf Şifre (En az 6 karakter önerilir)", color: "#f43f5e", width: "25%" };
    if (score === 2) return { score: 2, label: "Orta Seviye Şifre", color: "#f59e0b", width: "50%" };
    if (score === 3 || score === 4) return { score: 3, label: "Güçlü Şifre ✓", color: "#10b981", width: "75%" };
    return { score: 4, label: "Çok Güçlü & Güvenli Şifre 🛡️", color: "#34d399", width: "100%" };
  };

  useEffect(() => {
    async function loadSettings() {
      try {
        const [resSettings, resGallery] = await Promise.all([
          fetch("/api/auth/settings"),
          fetch("/api/gallery"),
        ]);

        if (resSettings.ok) {
          const data = await resSettings.json();
          if (data.settings) {
            if (data.settings.adminUser) setAdminUser(data.settings.adminUser);
            if (data.settings.adminEmail) setAdminEmail(data.settings.adminEmail);
            if (data.settings.cafeName) setCafeName(data.settings.cafeName);
            if (data.settings.cafePhone) setCafePhone(data.settings.cafePhone);
            if (data.settings.adminAvatar) setAvatar(data.settings.adminAvatar);
            if (data.settings.aboutCoverPhoto) setAboutCoverPhoto(data.settings.aboutCoverPhoto);
            if (data.settings.soundEnabled !== undefined) setSoundEnabled(data.settings.soundEnabled);
            if (data.settings.autoRefresh !== undefined) setAutoRefresh(data.settings.autoRefresh);
            if (data.settings.refreshInterval !== undefined) setRefreshInterval(data.settings.refreshInterval);

            const lastDate = data.settings.sifreSonDegismeTarihi || new Date().toISOString();
            const days = Math.floor((Date.now() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24));
            setPasswordAgeDays(days);
          }
        }

        if (resGallery.ok) {
          const galData = await resGallery.json();
          if (Array.isArray(galData.photos) && galData.photos.length > 0) {
            setGalleryPhotos(galData.photos);
          }
        }
      } catch (e) {
        console.error("Sunucu ayarları alınamadı, yerel bellek kullanılacak:", e);
      }

      try {
        const raw = localStorage.getItem("forzaAyarlar");
        if (raw) {
          const data = JSON.parse(raw);
          if (data.adminUser && !adminUser) setAdminUser(data.adminUser);
          if (data.adminEmail && !adminEmail) setAdminEmail(data.adminEmail);
          if (data.adminPass) setSavedPass(data.adminPass);
          if (data.cafeName && !cafeName) setCafeName(data.cafeName);
          if (data.cafePhone && !cafePhone) setCafePhone(data.cafePhone);
          if (data.adminAvatar && !avatar) setAvatar(data.adminAvatar);
        }

        const savedCover = localStorage.getItem("forzaAboutCoverPhoto");
        if (savedCover) {
          setAboutCoverPhoto(savedCover);
        }

        const galleryRaw = localStorage.getItem("forzaGaleriFotograflar");
        if (galleryRaw) {
          const parsedGallery = JSON.parse(galleryRaw);
          if (Array.isArray(parsedGallery) && parsedGallery.length > 0) {
            setGalleryPhotos(parsedGallery);
          }
        }
      } catch (e) {
        console.error("Yerel ayarlar yüklenemedi:", e);
      }
    }

    loadSettings();
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        setAvatar(data.url);
        showToast("Profil Fotoğrafı Yüklendi", "Kalıcı olması için aşağıdaki 'Değişiklikleri Kaydet' butonuna basınız.", "info");
      } else {
        throw new Error();
      }
    } catch {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setAvatar(evt.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarRemove = () => {
    setAvatar(null);
    showToast("Profil Fotoğrafı Sıfırlandı (Taslak)", "Varsayılan logoya dönüldü. Kaydet butonuna basarak onaylayın.", "info");
  };

  // 1. Hakkımızda Ana Vitrin Görseli Yükleme
  const handleCoverPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setIsCoverUploading(true);
    showToast("Vitrin Görseli Yükleniyor...", "Fotoğraf sunucuya yükleniyor, lütfen bekleyin.", "info");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        setAboutCoverPhoto(data.url);
        localStorage.setItem("forzaAboutCoverPhoto", data.url);

        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("forzaAyarlarGuncellendi", { detail: { aboutCoverPhoto: data.url } }));
          window.dispatchEvent(new CustomEvent("forzaGaleriGuncellendi", { detail: galleryPhotos }));
        }

        await fetch("/api/auth/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ aboutCoverPhoto: data.url }),
        });

        showToast("Vitrin Görseli Güncellendi!", "Hakkımızda sayfasının başlık yanındaki ana görseli başarıyla değiştirildi.", "success");
      } else {
        throw new Error();
      }
    } catch (err) {
      showToast("Hata", "Vitrin görseli yüklenemedi.", "error");
    } finally {
      setIsCoverUploading(false);
      e.target.value = "";
    }
  };

  // 2. Galeriden Bir Fotoğrafı Vitrin / Kapak Yapma
  const handleSetCoverPhoto = async (photoSrc: string) => {
    setAboutCoverPhoto(photoSrc);
    const updated = galleryPhotos.map((p) => ({
      ...p,
      isCover: p.src === photoSrc,
    }));
    setGalleryPhotos(updated);

    localStorage.setItem("forzaAboutCoverPhoto", photoSrc);
    localStorage.setItem("forzaGaleriFotograflar", JSON.stringify(updated));

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("forzaAyarlarGuncellendi", { detail: { aboutCoverPhoto: photoSrc } }));
      window.dispatchEvent(new CustomEvent("forzaGaleriGuncellendi", { detail: updated }));
    }

    try {
      await Promise.all([
        fetch("/api/auth/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ aboutCoverPhoto: photoSrc, galleryPhotos: updated }),
        }),
        fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ photos: updated }),
        }),
      ]);
    } catch (e) {}

    showToast("Ana Vitrin Görseli Ayarlandı! ⭐", "Seçilen fotoğraf Hakkımızda sayfasının ana vitrin görseli yapıldı.", "success");
  };

  // 3. Fotoğraf Sırasını Değiştirme (Sola / Sağa Taşı)
  const handleMovePhoto = async (index: number, direction: "left" | "right") => {
    if (direction === "left" && index === 0) return;
    if (direction === "right" && index === galleryPhotos.length - 1) return;

    const targetIndex = direction === "left" ? index - 1 : index + 1;
    const updated = [...galleryPhotos];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    const reordered = updated.map((p, idx) => ({ ...p, order: idx + 1 }));
    setGalleryPhotos(reordered);

    localStorage.setItem("forzaGaleriFotograflar", JSON.stringify(reordered));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("forzaGaleriGuncellendi", { detail: reordered }));
    }

    try {
      await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photos: reordered }),
      });
    } catch (e) {}

    showToast("Sıralama Değiştirildi", `Fotoğraf ${direction === "left" ? "öne" : "arkaya"} taşındı.`, "info");
  };

  // 4. Yeni Fotoğraf Yükleme (Mevcut Vitrin Görselini Bozmaz)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setFileLabel(file.name.length > 14 ? file.name.substring(0, 11) + "..." : file.name);
    setIsUploading(true);
    showToast("Görsel Yükleniyor...", "Fotoğraf sunucuya aktarılıyor, lütfen bekleyin.", "info");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        setNewPhotoUrl(data.url);
        
        const newPhoto: GalleryPhoto = {
          id: "galeri-" + Date.now(),
          src: data.url,
          badge: newPhotoBadge.trim() || "Mekan Fotoğrafı",
          alt: newPhotoBadge.trim() || "Forza Gaming Mekan Fotoğrafı",
          caption: newPhotoBadge.trim() || "Forza Gaming Mekan Fotoğrafı",
          isCover: false,
          order: galleryPhotos.length + 1,
        };

        const updated = [...galleryPhotos, newPhoto];
        setGalleryPhotos(updated);
        setNewPhotoUrl("");
        setNewPhotoBadge("");
        setFileLabel("Dosya Seç");

        localStorage.setItem("forzaGaleriFotograflar", JSON.stringify(updated));
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("forzaGaleriGuncellendi", { detail: updated }));
        }

        try {
          await fetch("/api/gallery", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ photos: updated }),
          });
        } catch (e) {}

        showToast("Fotoğraf Galeriye Eklendi!", "Fotoğraf mekan galerisine eklendi. İsterseniz 'Vitrin Yap' butonuyla ana görsel yapabilirsiniz.", "success");
      } else {
        throw new Error(data.error || "Görsel yüklenemedi");
      }
    } catch (err: any) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setNewPhotoUrl(evt.target.result as string);
          showToast("Fotoğraf Seçildi", "Görsel seçildi. Eklemek için '+ Galeriye Ekle' butonuna basın.", "info");
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleAddPhoto = async () => {
    if (!newPhotoUrl.trim()) {
      showToast("Uyarı", "Lütfen bir fotoğraf dosyası seçin veya geçerli bir görsel bağlantısı girin.", "warning");
      return;
    }

    const newPhoto: GalleryPhoto = {
      id: "galeri-" + Date.now(),
      src: newPhotoUrl.trim(),
      badge: newPhotoBadge.trim() || "Mekan Fotoğrafı",
      alt: newPhotoBadge.trim() || "Forza Gaming Mekan Fotoğrafı",
      caption: newPhotoBadge.trim() || "Forza Gaming Mekan Fotoğrafı",
      isCover: false,
      order: galleryPhotos.length + 1,
    };

    const updated = [...galleryPhotos, newPhoto];
    setGalleryPhotos(updated);
    setNewPhotoUrl("");
    setNewPhotoBadge("");
    setFileLabel("Dosya Seç");

    localStorage.setItem("forzaGaleriFotograflar", JSON.stringify(updated));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("forzaGaleriGuncellendi", { detail: updated }));
    }
    try {
      await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photos: updated }),
      });
    } catch (e) {}

    showToast("Fotoğraf Eklendi", "Fotoğraf galeriye eklendi ve yayınlandı.", "success");
  };

  const handleDeletePhoto = async (idOrIndex: string | number) => {
    const updated = galleryPhotos.filter((f, idx) => f.id !== idOrIndex && idx !== idOrIndex);
    setGalleryPhotos(updated);

    localStorage.setItem("forzaGaleriFotograflar", JSON.stringify(updated));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("forzaGaleriGuncellendi", { detail: updated }));
    }
    try {
      await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photos: updated }),
      });
    } catch (e) {}

    showToast("Fotoğraf Silindi", "Fotoğraf galeriden kaldırıldı.", "warning");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!adminUser.trim()) {
      showToast("Hata", "Yönetici kullanıcı adı boş bırakılamaz.", "error");
      return;
    }

    if (newPassword || currentPassword) {
      if (!currentPassword) {
        showToast("Hata", "Şifre değiştirmek için mevcut şifrenizi girmelisiniz.", "error");
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
    }

    try {
      const res = await fetch("/api/auth/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminUser: adminUser.trim(),
          adminEmail: adminEmail.trim(),
          adminAvatar: avatar,
          aboutCoverPhoto,
          cafeName: cafeName.trim(),
          cafePhone: cafePhone.trim(),
          soundEnabled,
          autoRefresh,
          refreshInterval,
          galleryPhotos,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      // Ayrıca galeri API'sine de doğrudan kaydet
      try {
        await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ photos: galleryPhotos }),
        });
      } catch (e) {}

      const data = await res.json();

      if (!res.ok || !data.success) {
        showToast("Hata", data.error || "Ayarlar kaydedilemedi.", "error");
        return;
      }

      // 1. Galeri fotoğraflarını kalıcı olarak kaydet ve canlı sayfaları tetikle
      localStorage.setItem("forzaAboutCoverPhoto", aboutCoverPhoto);
      localStorage.setItem("forzaGaleriFotograflar", JSON.stringify(galleryPhotos));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("forzaAyarlarGuncellendi", { detail: { aboutCoverPhoto } }));
        window.dispatchEvent(new CustomEvent("forzaGaleriGuncellendi", { detail: galleryPhotos }));
      }

      // 2. Sistem & Yönetici ayarlarını yerel depolamaya da eşitle
      const isPassChanged = newPassword.trim() !== "";
      const newConfig = {
        adminUser: adminUser.trim(),
        adminEmail: adminEmail.trim() || "admin@forzagaming.com",
        adminPass: newPassword || savedPass,
        adminAvatar: avatar,
        aboutCoverPhoto,
        cafeName: cafeName.trim(),
        cafePhone: cafePhone.trim(),
        soundEnabled,
        autoRefresh,
        refreshInterval,
        sifreSonDegismeTarihi: isPassChanged ? new Date().toISOString() : undefined,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem("forzaAyarlar", JSON.stringify(newConfig));
      if (isPassChanged) {
        setSavedPass(newPassword);
        setPasswordAgeDays(0);
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      showToast(
        "Tüm Değişiklikler Kalıcı Olarak Kaydedildi",
        `Yönetici kullanıcısı "${adminUser}" ve ayarlar güncellendi!`,
        "success"
      );
    } catch (err) {
      showToast("Hata", "Sunucu ile iletişim kurulurken hata oluştu.", "error");
    }
  };

  return (
    <main className="dashboard-content" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#fdfbf7", margin: 0 }}>
            Sistem &amp; Yönetici Ayarları
          </h1>
          <span style={{ fontSize: "12.5px", color: "#94a3b8" }}>
            Hakkımızda vitrini, fotoğraf galerisi, yönetici profili ve işletme tercihleri
          </span>
        </div>
      </div>

      <form onSubmit={handleSave} className="settings-grid">
        
        {/* 1. Hakkımızda Ana Vitrin (Hero / Kapak) Görseli */}
        <div className="dashboard-card settings-card" style={{ gridColumn: "1 / -1" }}>
          <div className="card-header" style={{ marginBottom: "8px" }}>
            <div className="settings-card-title" style={{ marginBottom: 0 }}>
              <span style={{ fontSize: "18px" }}>⭐</span>
              <h4>Hakkımızda Ana Vitrin (Hero / Kapak) Görseli</h4>
            </div>
            <Link href="/hakkimizda" target="_blank" className="view-all">
              Hakkımızda Sayfasında Canlı Gör ↗
            </Link>
          </div>

          <span className="card-subtitle" style={{ marginTop: "-4px", marginBottom: "16px" }}>
            Hakkımızda sayfasında &quot;FORZA GAMING HAKKIMIZDA&quot; başlığının hemen sağında duran ana vitrin görselidir. Doğrudan yeni bir fotoğraf yükleyebilir veya aşağıdaki galeri fotoğraflarından birini &quot;⭐ Vitrin Yap&quot; butonuyla ana görsel seçebilirsiniz.
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap", background: "rgba(255, 215, 0, 0.05)", border: "1px solid rgba(255, 215, 0, 0.25)", borderRadius: "16px", padding: "18px 22px" }}>
            <div style={{ position: "relative", width: "200px", height: "120px", borderRadius: "12px", overflow: "hidden", border: "2px solid #ffd700", boxShadow: "0 4px 20px rgba(0,0,0,0.5)", flexShrink: 0 }}>
              <img src={aboutCoverPhoto || "/foto1.jpeg"} alt="Ana Vitrin Görseli" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", top: "6px", left: "6px", background: "#ffd700", color: "#000", fontSize: "10px", fontWeight: 800, padding: "2px 8px", borderRadius: "12px" }}>
                ⭐ AKTİF VİTRİN
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1, minWidth: "220px" }}>
              <strong style={{ fontSize: "14px", color: "#fdfbf7" }}>Mevcut Vitrin Görseli: <span style={{ color: "#ffd700", fontWeight: 600 }}>{aboutCoverPhoto}</span></strong>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <label className="avatar-upload-btn" htmlFor="coverFileInput" style={{ opacity: isCoverUploading ? 0.7 : 1, cursor: isCoverUploading ? "wait" : "pointer" }}>
                  {isCoverUploading ? "⏳ Yükleniyor..." : "📷 Yeni Vitrin Fotoğrafı Yükle"}
                </label>
                <input
                  type="file"
                  id="coverFileInput"
                  accept="image/*"
                  disabled={isCoverUploading}
                  onChange={handleCoverPhotoUpload}
                  style={{ display: "none" }}
                />
                <button
                  type="button"
                  onClick={() => handleSetCoverPhoto("/foto1.jpeg")}
                  className="avatar-remove-btn"
                  title="Varsayılan ana salon fotoğrafına dön"
                >
                  🔄 Varsayılana Dön (/foto1.jpeg)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Hakkımızda Fotoğraf Galerisi & Sıralama */}
        <div className="dashboard-card settings-card" style={{ gridColumn: "1 / -1" }}>
          <div className="card-header" style={{ marginBottom: "8px" }}>
            <div className="settings-card-title" style={{ marginBottom: 0 }}>
              <span style={{ fontSize: "18px" }}>🖼️</span>
              <h4>Mekan Fotoğraf Galerisi (Sıralama, Ekle &amp; Çıkart)</h4>
            </div>
            <span style={{ fontSize: "12px", color: "#94a3b8" }}>
              Toplam: <strong style={{ color: "#ffd700" }}>{galleryPhotos.length} Fotoğraf</strong>
            </span>
          </div>

          <span className="card-subtitle" style={{ marginTop: "-4px", marginBottom: "14px" }}>
            Fotoğraf ekleyebilir, <strong>◀ Sola / ▶ Sağa</strong> butonlarıyla sırasını değiştirebilir, <strong>⭐ Vitrin Yap</strong> ile ana kapak fotoğrafı yapabilir veya kırmızı butondan silebilirsiniz.
          </span>

          {/* Fotoğraf Ekleme Formu */}
          <div className="gallery-upload-card">
            <strong style={{ fontSize: "13px", color: "var(--cream-100)" }}>📸 Yeni Galeri Fotoğrafı Ekle</strong>
            <div className="gallery-form-row">
              <label className="gallery-file-label" htmlFor="galleryFileInput" style={{ opacity: isUploading ? 0.7 : 1, cursor: isUploading ? "wait" : "pointer" }}>
                {isUploading ? "⏳ Yükleniyor..." : `📁 ${fileLabel}`}
              </label>
              <input
                type="file"
                id="galleryFileInput"
                accept="image/*"
                disabled={isUploading}
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />

              <input
                type="text"
                className="gallery-form-input"
                placeholder="veya görsel URL'si / dosya adı (örn: /foto1.jpeg)"
                value={newPhotoUrl}
                disabled={isUploading}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
              />

              <input
                type="text"
                className="gallery-form-input"
                placeholder="Fotoğraf Başlığı / Etiketi (örn: 540Hz Espor Alanı)"
                value={newPhotoBadge}
                disabled={isUploading}
                onChange={(e) => setNewPhotoBadge(e.target.value)}
              />

              <button
                type="button"
                onClick={handleAddPhoto}
                disabled={isUploading}
                className="gallery-add-btn"
              >
                + Galeriye Ekle
              </button>
            </div>
          </div>

          {/* Galeri Izgarası */}
          <div className="media-gallery-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: "16px" }}>
            {galleryPhotos.map((foto, index) => {
              const isCover = foto.src === aboutCoverPhoto || foto.isCover;
              return (
                <div
                  key={foto.id || foto.src + index}
                  className="media-item"
                  style={{
                    height: "175px",
                    border: isCover ? "2px solid #ffd700" : "1px solid rgba(255, 255, 255, 0.15)",
                    boxShadow: isCover ? "0 0 15px rgba(255, 215, 0, 0.35)" : "none",
                  }}
                >
                  <img src={foto.src} alt={foto.badge || "Mekan Fotoğrafı"} />

                  {/* Sıra & Vitrin Rozetleri */}
                  {isCover ? (
                    <span className="photo-cover-badge">⭐ VİTRİN</span>
                  ) : (
                    <span className="photo-order-badge">#{index + 1}</span>
                  )}

                  {/* Silme Butonu */}
                  <button
                    type="button"
                    onClick={() => handleDeletePhoto(foto.id || index)}
                    className="photo-delete-btn"
                    title="Fotoğrafı Galeriden Sil"
                  >
                    ✕
                  </button>

                  {/* Başlık Rozeti */}
                  <span className="media-badge" style={{ bottom: "38px" }}>
                    {foto.badge || "Mekan"}
                  </span>

                  {/* Alt Kontrol Çubuğu (Sıralama + Vitrin Yap) */}
                  <div className="photo-controls-bar">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMovePhoto(index, "left")}
                      className="photo-ctrl-btn"
                      title="Sola / Öne Taşı"
                    >
                      ◀
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSetCoverPhoto(foto.src)}
                      className={`photo-ctrl-btn cover-btn ${isCover ? "active" : ""}`}
                      title={isCover ? "Bu fotoğraf zaten ana vitrin görseli" : "Hakkımızda sayfasının ana görseli yap"}
                    >
                      {isCover ? "⭐ Vitrin" : "Vitrin Yap"}
                    </button>

                    <button
                      type="button"
                      disabled={index === galleryPhotos.length - 1}
                      onClick={() => handleMovePhoto(index, "right")}
                      className="photo-ctrl-btn"
                      title="Sağa / Arkaya Taşı"
                    >
                      ▶
                    </button>
                  </div>
                </div>
              );
            })}
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
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <input
                type={showCurrentPass ? "text" : "password"}
                placeholder="Şifre değiştirmek için mevcut şifrenizi girin"
                className="settings-input"
                style={{ paddingRight: "44px" }}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                style={{
                  position: "absolute",
                  right: "12px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: showCurrentPass ? "#ffd700" : "#94a3b8",
                  fontSize: "15px",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                }}
                title={showCurrentPass ? "Şifreyi Gizle" : "Şifreyi Göster"}
              >
                {showCurrentPass ? "👁️" : "🔒"}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Yeni Şifre</label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <input
                type={showNewPass ? "text" : "password"}
                placeholder="Değiştirmek istemiyorsanız boş bırakın"
                className="settings-input"
                style={{ paddingRight: "44px" }}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                style={{
                  position: "absolute",
                  right: "12px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: showNewPass ? "#ffd700" : "#94a3b8",
                  fontSize: "15px",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                }}
                title={showNewPass ? "Şifreyi Gizle" : "Şifreyi Göster"}
              >
                {showNewPass ? "👁️" : "🔒"}
              </button>
            </div>

            {/* Canlı Güvenlik Seviyesi Göstergesi */}
            {newPassword.length > 0 && (
              <div style={{ marginTop: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "4px", color: getPasswordStrength(newPassword).color, fontWeight: 700 }}>
                  <span>Güvenlik: {getPasswordStrength(newPassword).label}</span>
                  <span>{newPassword.length} Karakter</span>
                </div>
                <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: getPasswordStrength(newPassword).width,
                      background: getPasswordStrength(newPassword).color,
                      transition: "all 0.3s ease",
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Yeni Şifre (Tekrar)</label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <input
                type={showConfirmPass ? "text" : "password"}
                placeholder="Yeni şifreyi doğrulayın"
                className="settings-input"
                style={{ paddingRight: "44px" }}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                style={{
                  position: "absolute",
                  right: "12px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: showConfirmPass ? "#ffd700" : "#94a3b8",
                  fontSize: "15px",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                }}
                title={showConfirmPass ? "Şifreyi Gizle" : "Şifreyi Göster"}
              >
                {showConfirmPass ? "👁️" : "🔒"}
              </button>
            </div>

            {/* Şifre Eşleşme Bildirimi */}
            {confirmPassword.length > 0 && (
              <div style={{ marginTop: "6px", fontSize: "11.5px", fontWeight: 700, color: newPassword === confirmPassword ? "#10b981" : "#f43f5e" }}>
                {newPassword === confirmPassword ? "✓ Şifreler birebir uyuşuyor" : "✕ Şifreler eşleşmiyor"}
              </div>
            )}
          </div>

          <div
            style={{
              marginTop: "12px",
              padding: "10px 14px",
              borderRadius: "12px",
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
              Şifre Durumu: <strong>{passwordAgeDays} gün önce</strong> güncellendi (Aktif parola koruması devrede)
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