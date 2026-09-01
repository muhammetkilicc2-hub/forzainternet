"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/components/admin/Toast";
import { GalleryPhoto } from "@/lib/types";
import { emitLiveUpdate } from "@/lib/liveSync";
import {
  Star,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Lock,
  Eye,
  EyeOff,
  Check,
  RotateCcw,
  Building2,
  User,
  Save,
  ShieldCheck,
  Bell,
  RefreshCw,
  Camera,
} from "lucide-react";

const DEFAULT_PHOTOS: GalleryPhoto[] = [
  { id: "f1", src: "/foto1.jpeg", badge: "Ana Salon", alt: "Forza Gaming Salonu - Ana Espor Alanı", caption: "Forza Gaming Salonu - Ana Espor Alanı" },
  { id: "f2", src: "/foto2.jpeg", badge: "VIP Espor", alt: "BenQ Espor Turnuva Masaları", caption: "BenQ Espor Turnuva Masaları" },
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

  // Galeri & Vitrin Yönetimi State (Akordeonlu)
  const [isMediaAccordionOpen, setIsMediaAccordionOpen] = useState(false);
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
        const avatarUrl = data.url;
        setAvatar(avatarUrl);

        try {
          await fetch("/api/auth/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ adminAvatar: avatarUrl }),
          });
        } catch (e) {}

        try {
          const raw = localStorage.getItem("forzaAyarlar");
          const cur = raw ? JSON.parse(raw) : {};
          cur.adminAvatar = avatarUrl;
          localStorage.setItem("forzaAyarlar", JSON.stringify(cur));
          window.dispatchEvent(new CustomEvent("forzaAyarlarGuncellendi", { detail: { adminAvatar: avatarUrl } }));
          window.dispatchEvent(new Event("storage"));
        } catch (e) {}

        showToast("Profil Fotoğrafı Güncellendi 🎉", "Yeni fotoğrafınız başarıyla yüklendi ve sol üstteki logoya yerleştirildi.", "success");
      } else {
        throw new Error(data.error || "Yükleme başarısız");
      }
    } catch {
      showToast("Hata", "Fotoğraf sunucuya yüklenemedi.", "error");
    } finally {
      e.target.value = "";
    }
  };

  const handleAvatarRemove = async () => {
    setAvatar(null);

    try {
      await fetch("/api/auth/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminAvatar: null }),
      });
    } catch (e) {}

    try {
      const raw = localStorage.getItem("forzaAyarlar");
      const cur = raw ? JSON.parse(raw) : {};
      cur.adminAvatar = null;
      localStorage.setItem("forzaAyarlar", JSON.stringify(cur));
      window.dispatchEvent(new CustomEvent("forzaAyarlarGuncellendi", { detail: { adminAvatar: null } }));
      window.dispatchEvent(new Event("storage"));
    } catch (e) {}

    showToast("Profil Fotoğrafı Sıfırlandı", "Varsayılan 'F' logosuna dönüldü.", "info");
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

        emitLiveUpdate("gallery", galleryPhotos);
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
    emitLiveUpdate("gallery", updated);

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
    emitLiveUpdate("gallery", reordered);
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

  // 4. Yeni Fotoğraf Yükleme
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
        emitLiveUpdate("gallery", updated);
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
    emitLiveUpdate("gallery", updated);
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
    const deletedPhoto = galleryPhotos.find((f, idx) => f.id === idOrIndex || idx === idOrIndex);
    const updated = galleryPhotos.filter((f, idx) => f.id !== idOrIndex && idx !== idOrIndex);
    setGalleryPhotos(updated);

    let nextCover = aboutCoverPhoto;
    if (deletedPhoto && deletedPhoto.src === aboutCoverPhoto) {
      nextCover = updated.length > 0 ? updated[0].src : "/foto1.jpeg";
      setAboutCoverPhoto(nextCover);
      localStorage.setItem("forzaAboutCoverPhoto", nextCover);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("forzaAyarlarGuncellendi", { detail: { aboutCoverPhoto: nextCover } }));
      }
    }

    localStorage.setItem("forzaGaleriFotograflar", JSON.stringify(updated));
    emitLiveUpdate("gallery", updated);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("forzaGaleriGuncellendi", { detail: updated }));
    }
    try {
      await Promise.all([
        fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ photos: updated }),
        }),
        fetch("/api/auth/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ aboutCoverPhoto: nextCover, galleryPhotos: updated }),
        }),
      ]);
    } catch (e) {}

    showToast("Fotoğraf Silindi", "Fotoğraf galeriden kaldırıldı ve Hakkımızda sayfası güncellendi.", "warning");
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

      localStorage.setItem("forzaAboutCoverPhoto", aboutCoverPhoto);
      localStorage.setItem("forzaGaleriFotograflar", JSON.stringify(galleryPhotos));
      emitLiveUpdate("gallery", galleryPhotos);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("forzaAyarlarGuncellendi", { detail: { aboutCoverPhoto } }));
        window.dispatchEvent(new CustomEvent("forzaGaleriGuncellendi", { detail: galleryPhotos }));
      }

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
    <main className="dashboard-content" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Top Action Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          width: "100%",
        }}
      >
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#ffffff", margin: 0, letterSpacing: "-0.3px" }}>
            Sistem &amp; Yönetici Ayarları
          </h1>
          <span style={{ fontSize: "13px", color: "#cbd5e1", marginTop: "4px", display: "block" }}>
            Hakkımızda vitrini, fotoğraf galerisi, yönetici profili ve işletme tercihleri
          </span>
        </div>
      </div>

      <form onSubmit={handleSave} className="settings-grid">
        {/* AKORDEON: FOTOĞRAF GALERİSİ & VİTRİN GÖRSELLERİ YÖNETİMİ */}
        <div className="dashboard-card" style={{ gridColumn: "1 / -1", padding: "0", overflow: "hidden" }}>
          {/* Akordeon Tıklanabilir Başlık Barı */}
          <div
            onClick={() => setIsMediaAccordionOpen(!isMediaAccordionOpen)}
            style={{
              padding: "18px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
              cursor: "pointer",
              userSelect: "none",
              background: isMediaAccordionOpen ? "rgba(255, 255, 255, 0.05)" : "transparent",
              transition: "all 0.2s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: "rgba(223, 183, 88, 0.15)",
                  color: "#dfb758",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(223, 183, 88, 0.3)",
                  boxShadow: "0 0 16px rgba(223, 183, 88, 0.15)",
                  flexShrink: 0,
                }}
              >
                <ImageIcon size={20} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <h3 style={{ fontSize: "16.5px", fontWeight: 800, color: "#ffffff", margin: 0 }}>
                    Mekan Galerisi &amp; Vitrin Fotoğrafları
                  </h3>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      color: "#dfb758",
                      background: "rgba(223, 183, 88, 0.15)",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      border: "1px solid rgba(223, 183, 88, 0.3)",
                    }}
                  >
                    {galleryPhotos.length} Fotoğraf
                  </span>
                </div>
                <span style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginTop: "2px" }}>
                  {isMediaAccordionOpen
                    ? "Kapatmak için başlığa tıklayın."
                    : "Kapak ve galeri fotoğraflarını yönetmek için tıklayarak açın."}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                type="button"
                className={isMediaAccordionOpen ? "apple-btn-white" : "apple-btn-glass"}
                style={{ pointerEvents: "none", padding: "7px 14px", fontSize: "12.5px" }}
              >
                <span>{isMediaAccordionOpen ? "Kapat" : "Fotoğrafları Düzenle"}</span>
                {isMediaAccordionOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>
            </div>
          </div>

          {/* Akordeon Açılır İçeriği */}
          {isMediaAccordionOpen && (
            <div
              style={{
                padding: "20px",
                borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                background: "rgba(0, 0, 0, 0.25)",
              }}
            >
              {/* 1. HAKKIMIZDA ANA VİTRİN GÖRSELİ */}
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "16px",
                  padding: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "10px",
                    marginBottom: "12px",
                  }}
                >
                  <strong style={{ fontSize: "14.5px", color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Star size={16} style={{ color: "#dfb758" }} />
                    <span>Hakkımızda Ana Vitrin (Hero / Kapak) Görseli</span>
                  </strong>

                  <Link href="/hakkimizda" target="_blank" className="apple-btn-glass" style={{ fontSize: "12px", padding: "6px 12px" }}>
                    <span>Canlı Gör</span>
                    <ExternalLink size={13} />
                  </Link>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "18px",
                    flexWrap: "wrap",
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "14px",
                    padding: "14px",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "180px",
                      height: "110px",
                      borderRadius: "12px",
                      overflow: "hidden",
                      border: "2px solid #dfb758",
                      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.7), 0 0 16px rgba(223, 183, 88, 0.2)",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={aboutCoverPhoto || "/foto1.jpeg"}
                      alt="Ana Vitrin Görseli"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "6px",
                        left: "6px",
                        background: "#dfb758",
                        color: "#000000",
                        fontSize: "9.5px",
                        fontWeight: 900,
                        padding: "2px 8px",
                        borderRadius: "8px",
                      }}
                    >
                      ⭐ AKTİF VİTRİN
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1, minWidth: "200px" }}>
                    <div>
                      <span style={{ fontSize: "11.5px", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>
                        Mevcut Vitrin Görseli
                      </span>
                      <strong style={{ fontSize: "13.5px", color: "#ffffff", display: "block", marginTop: "2px", wordBreak: "break-all" }}>
                        {aboutCoverPhoto}
                      </strong>
                    </div>

                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                      <label
                        className="apple-btn-white"
                        htmlFor="coverFileInput"
                        style={{
                          opacity: isCoverUploading ? 0.7 : 1,
                          cursor: isCoverUploading ? "wait" : "pointer",
                          fontSize: "12px",
                          padding: "7px 12px",
                        }}
                      >
                        <Camera size={14} />
                        <span>{isCoverUploading ? "Yükleniyor..." : "Yeni Vitrin Yükle"}</span>
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
                        className="apple-btn-glass"
                        style={{ fontSize: "12px", padding: "7px 12px" }}
                        title="Varsayılan fotoğrafa dön"
                      >
                        <RotateCcw size={13} />
                        <span>Varsayılana Dön (/foto1.jpeg)</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. FOTOĞRAF EKLEME FORMU & GALERİ IZGARASI */}
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "16px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                <strong style={{ fontSize: "14.5px", color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Sparkles size={16} style={{ color: "#38bdf8" }} />
                  <span>Yeni Galeri Fotoğrafı Ekle</span>
                </strong>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                  <label
                    className="apple-btn-glass"
                    htmlFor="galleryFileInput"
                    style={{
                      opacity: isUploading ? 0.7 : 1,
                      cursor: isUploading ? "wait" : "pointer",
                      fontSize: "12px",
                      padding: "7px 14px",
                    }}
                  >
                    <Upload size={14} />
                    <span>{isUploading ? "Yükleniyor..." : fileLabel}</span>
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
                    className="settings-input"
                    style={{ flex: 1, minWidth: "160px", padding: "8px 12px", fontSize: "13px" }}
                    placeholder="Görsel URL (örn: /foto1.jpeg)"
                    value={newPhotoUrl}
                    disabled={isUploading}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                  />

                  <input
                    type="text"
                    className="settings-input"
                    style={{ flex: 1, minWidth: "140px", padding: "8px 12px", fontSize: "13px" }}
                    placeholder="Başlık (örn: VIP Espor)"
                    value={newPhotoBadge}
                    disabled={isUploading}
                    onChange={(e) => setNewPhotoBadge(e.target.value)}
                  />

                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    disabled={isUploading}
                    className="apple-btn-white"
                    style={{ fontSize: "12.5px", padding: "8px 14px" }}
                  >
                    <span>+ Galeriye Ekle</span>
                  </button>
                </div>

                {/* Galeri Izgarası */}
                <div className="media-gallery-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "14px", marginTop: "10px" }}>
                  {galleryPhotos.map((foto, index) => {
                    const isCover = foto.src === aboutCoverPhoto || foto.isCover;
                    return (
                      <div
                        key={foto.id || foto.src + index}
                        className="media-item"
                        style={{
                          height: "165px",
                          borderRadius: "14px",
                          overflow: "hidden",
                          border: isCover ? "2px solid #dfb758" : "1px solid rgba(255, 255, 255, 0.15)",
                          boxShadow: isCover ? "0 0 16px rgba(223, 183, 88, 0.3)" : "0 4px 14px rgba(0, 0, 0, 0.4)",
                        }}
                      >
                        <img src={foto.src} alt={foto.badge || "Mekan Fotoğrafı"} />

                        {/* Sıra & Vitrin Rozetleri */}
                        {isCover ? (
                          <span className="photo-cover-badge" style={{ background: "#dfb758", color: "#000000", fontWeight: 900 }}>
                            ⭐ VİTRİN
                          </span>
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
                          <Trash2 size={13} />
                        </button>

                        {/* Başlık Rozeti */}
                        <span className="media-badge" style={{ bottom: "38px" }}>
                          {foto.badge || "Mekan"}
                        </span>

                        {/* Alt Kontrol Çubuğu */}
                        <div className="photo-controls-bar">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMovePhoto(index, "left")}
                            className="photo-ctrl-btn"
                            title="Sola / Öne Taşı"
                          >
                            <ChevronLeft size={14} />
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
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. YÖNETİCİ PROFİLİ & ŞİFRE YÖNETİMİ */}
        <div className="dashboard-card">
          <div className="card-header" style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <User size={18} />
              </div>
              <h3 style={{ fontSize: "17.5px", fontWeight: 800, color: "#ffffff", margin: 0 }}>
                Yönetici Profili &amp; Giriş Bilgileri
              </h3>
            </div>
          </div>

          {/* Avatar Yükleyici */}
          <div className="admin-avatar-manager" style={{ marginBottom: "18px" }}>
            <div className="admin-avatar-preview">
              {avatar ? <img src={avatar} alt="Admin Profil" /> : "F"}
            </div>
            <div className="admin-avatar-controls">
              <label className="apple-btn-white" htmlFor="avatarFileInputNext">
                <Camera size={14} />
                <span>Profil Fotoğrafı Seç</span>
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
                className="apple-btn-glass"
              >
                <span>Fotoğrafı Kaldır / Sıfırla</span>
              </button>
            </div>
          </div>
          
          <div className="form-group" style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "11.5px", fontWeight: 800, color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Yönetici Kullanıcı Adı
            </label>
            <input
              type="text"
              required
              className="settings-input"
              value={adminUser}
              onChange={(e) => setAdminUser(e.target.value)}
              placeholder="admin"
            />
          </div>

          <div className="form-group" style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "11.5px", fontWeight: 800, color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Yönetici E-Posta Adresi
            </label>
            <input
              type="email"
              required
              className="settings-input"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="admin@forzagaming.com"
            />
          </div>

          <div className="form-group" style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "11.5px", fontWeight: 800, color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Mevcut Şifre
            </label>
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
                  color: showCurrentPass ? "#dfb758" : "#94a3b8",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "11.5px", fontWeight: 800, color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Yeni Şifre
            </label>
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
                  color: showNewPass ? "#dfb758" : "#94a3b8",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

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

          <div className="form-group" style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "11.5px", fontWeight: 800, color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Yeni Şifre (Tekrar)
            </label>
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
                  color: showConfirmPass ? "#dfb758" : "#94a3b8",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {confirmPassword.length > 0 && (
              <div style={{ marginTop: "6px", fontSize: "11.5px", fontWeight: 700, color: newPassword === confirmPassword ? "#10b981" : "#f43f5e" }}>
                {newPassword === confirmPassword ? "✓ Şifreler birebir uyuşuyor" : "✕ Şifreler eşleşmiyor"}
              </div>
            )}
          </div>

          <div
            style={{
              marginTop: "14px",
              padding: "12px 16px",
              borderRadius: "14px",
              background: passwordAgeDays >= 180 ? "rgba(244,63,94,0.12)" : "rgba(255, 255, 255, 0.04)",
              border: `1px solid ${passwordAgeDays >= 180 ? "rgba(244,63,94,0.3)" : "rgba(255, 255, 255, 0.1)"}`,
              fontSize: "12px",
              color: passwordAgeDays >= 180 ? "#f43f5e" : "#cbd5e1",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <ShieldCheck size={16} style={{ color: passwordAgeDays >= 180 ? "#f43f5e" : "#dfb758" }} />
            <span>
              Şifre Durumu: <strong>{passwordAgeDays} gün önce</strong> güncellendi (Aktif parola koruması devrede)
            </span>
          </div>
        </div>

        {/* 4. İŞLETME & BİLDİRİM TERCİHLERİ */}
        <div className="dashboard-card">
          <div className="card-header" style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "rgba(223, 183, 88, 0.15)",
                  color: "#dfb758",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(223, 183, 88, 0.3)",
                }}
              >
                <Building2 size={18} />
              </div>
              <h3 style={{ fontSize: "17.5px", fontWeight: 800, color: "#ffffff", margin: 0 }}>
                İşletme &amp; Bildirim Tercihleri
              </h3>
            </div>
          </div>
          
          <div className="form-group" style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "11.5px", fontWeight: 800, color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Kafe Adı
            </label>
            <input
              type="text"
              className="settings-input"
              value={cafeName}
              onChange={(e) => setCafeName(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "11.5px", fontWeight: 800, color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              WhatsApp / İletişim Telefonu
            </label>
            <input
              type="tel"
              className="settings-input"
              value={cafePhone}
              onChange={(e) => setCafePhone(e.target.value)}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px",
              borderRadius: "14px",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              marginBottom: "12px",
            }}
          >
            <div>
              <strong style={{ fontSize: "13.5px", color: "#ffffff", display: "flex", alignItems: "center", gap: "6px" }}>
                <Bell size={14} style={{ color: "#dfb758" }} />
                <span>Sesli Bildirim Uyarısı</span>
              </strong>
              <span style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px", display: "block" }}>
                Yeni rezervasyon talebi geldiğinde ses çal
              </span>
            </div>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              style={{ width: "22px", height: "22px", accentColor: "#dfb758", cursor: "pointer" }}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px",
              borderRadius: "14px",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div>
              <strong style={{ fontSize: "13.5px", color: "#ffffff", display: "flex", alignItems: "center", gap: "6px" }}>
                <RefreshCw size={14} style={{ color: "#38bdf8" }} />
                <span>Otomatik Canlı Yenileme</span>
              </strong>
              <span style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px", display: "block" }}>
                Masa ve rezervasyon durumlarını periyodik güncelle
              </span>
            </div>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              style={{ width: "22px", height: "22px", accentColor: "#dfb758", cursor: "pointer" }}
            />
          </div>
        </div>

        {/* 5. KAYDET BUTONU */}
        <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
          <button
            type="submit"
            className="apple-btn-white"
            style={{
              padding: "14px 32px",
              fontSize: "14.5px",
              fontWeight: 900,
            }}
          >
            <Save size={18} />
            <span>Tüm Değişiklikleri Kaydet</span>
          </button>
        </div>
      </form>
    </main>
  );
}