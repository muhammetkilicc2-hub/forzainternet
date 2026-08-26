import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const AUTH_COOKIE_NAME = "forza_admin_session";
const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || "forza_super_secret_jwt_key_2026_apple_studio_secure_salt_998877665544332211"
);

async function isValidToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, SECRET_KEY);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const isAuthenticated = token ? await isValidToken(token) : false;

  // 1. Korumalı Admin Rotaları
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/giris", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Zaten giriş yapmışsa /giris sayfasına gelirse doğrudan /admin'e yönlendir
  if (pathname === "/giris" && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/giris"],
};