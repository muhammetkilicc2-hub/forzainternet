import { NextResponse } from "next/server";
import { signToken, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const validUser = process.env.ADMIN_USERNAME || "admin";
    const validPass = process.env.ADMIN_PASSWORD || "1234";

    if (username === validUser && password === validPass) {
      const token = await signToken({ username });
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