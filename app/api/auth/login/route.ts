import { NextResponse } from "next/server";
import { signToken, setSessionCookie } from "@/lib/auth";
import { verifyAdminCredentials, getAdminSettings } from "@/lib/data";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const isValid = verifyAdminCredentials(username, password);

    if (isValid) {
      const settings = getAdminSettings();
      const token = await signToken({ username: settings.adminUser });
      await setSessionCookie(token);
      return NextResponse.json({ success: true, message: "Giriş başarılı" });
    }

    return NextResponse.json(
      { success: false, message: "Hatalı kullanıcı adı veya şifre!" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}