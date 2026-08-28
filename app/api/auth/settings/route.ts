import { NextResponse } from "next/server";
import { getAdminSettings, updateAdminSettings, getGalleryPhotos, updateGalleryPhotos } from "@/lib/data";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  const settings = getAdminSettings();
  return NextResponse.json({
    success: true,
    settings: {
      adminUser: settings.adminUser,
      adminEmail: settings.adminEmail,
      adminAvatar: settings.adminAvatar,
      aboutCoverPhoto: settings.aboutCoverPhoto,
      cafeName: settings.cafeName,
      cafePhone: settings.cafePhone,
      soundEnabled: settings.soundEnabled,
      autoRefresh: settings.autoRefresh,
      refreshInterval: settings.refreshInterval,
      sifreSonDegismeTarihi: settings.sifreSonDegismeTarihi,
      updatedAt: settings.updatedAt,
      galleryPhotos: getGalleryPhotos(),
    },
  });
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await request.json();
    const current = getAdminSettings();

    // Şifre değişikliği doğrulaması
    if (body.newPassword) {
      if (!body.currentPassword) {
        return NextResponse.json(
          { error: "Şifre değiştirmek için mevcut şifrenizi girmelisiniz." },
          { status: 400 }
        );
      }

      const activePassword = (current.adminPass || "1234").trim();
      const inputCurrentPassword = body.currentPassword.trim();

      const isCurrentValid =
        inputCurrentPassword === activePassword ||
        (process.env.ADMIN_PASSWORD && inputCurrentPassword === process.env.ADMIN_PASSWORD.trim());

      if (!isCurrentValid) {
        return NextResponse.json(
          { error: "Mevcut şifreniz hatalı!" },
          { status: 400 }
        );
      }

      if (body.newPassword.trim().length < 3) {
        return NextResponse.json(
          { error: "Yeni şifre en az 3 karakter olmalıdır." },
          { status: 400 }
        );
      }

      current.adminPass = body.newPassword.trim();
      current.sifreSonDegismeTarihi = new Date().toISOString();
    }

    if (body.adminUser) current.adminUser = body.adminUser.trim();
    if (body.adminEmail) current.adminEmail = body.adminEmail.trim();
    if (body.adminAvatar !== undefined) current.adminAvatar = body.adminAvatar;
    if (body.aboutCoverPhoto !== undefined) current.aboutCoverPhoto = body.aboutCoverPhoto;
    if (body.cafeName) current.cafeName = body.cafeName.trim();
    if (body.cafePhone) current.cafePhone = body.cafePhone.trim();
    if (body.soundEnabled !== undefined) current.soundEnabled = Boolean(body.soundEnabled);
    if (body.autoRefresh !== undefined) current.autoRefresh = Boolean(body.autoRefresh);
    if (body.refreshInterval !== undefined) current.refreshInterval = Number(body.refreshInterval);

    if (Array.isArray(body.galleryPhotos)) {
      updateGalleryPhotos(body.galleryPhotos);
    }

    const updated = updateAdminSettings(current);

    return NextResponse.json({
      success: true,
      message: "Yönetici ayarları ve şifresi başarıyla güncellendi!",
      settings: {
        ...updated,
        galleryPhotos: getGalleryPhotos(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Ayarlar güncellenirken bir sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}
