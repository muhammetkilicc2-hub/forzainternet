import { NextResponse } from "next/server";
import { getAdminSettings, updateAdminSettings } from "@/lib/data";

export async function POST(request: Request) {
  try {
    const { emailOrPhone, newPassword } = await request.json();

    if (!newPassword || newPassword.trim().length < 3) {
      return NextResponse.json(
        { error: "Yeni şifre en az 3 karakter olmalıdır." },
        { status: 400 }
      );
    }

    const current = getAdminSettings();
    const cleanInput = (emailOrPhone || "").trim().toLowerCase();
    const digitsOnly = cleanInput.replace(/\D/g, "");

    const isEmailMatch =
      cleanInput === current.adminEmail.toLowerCase() ||
      cleanInput === "admin@forzagaming.com" ||
      cleanInput === "admin@forzacafe.com";

    const isPhoneMatch =
      digitsOnly.length >= 10 &&
      (current.cafePhone.replace(/\D/g, "").includes(digitsOnly) ||
        digitsOnly.includes("5464659693"));

    if (!isEmailMatch && !isPhoneMatch) {
      return NextResponse.json(
        { error: "Kayıtlı e-posta veya telefon bilgisi doğrulanamadı." },
        { status: 400 }
      );
    }

    updateAdminSettings({
      adminPass: newPassword.trim(),
      sifreSonDegismeTarihi: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Şifreniz başarıyla sıfırlandı ve güncellendi!",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}
