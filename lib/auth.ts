import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const AUTH_COOKIE_NAME = "forza_admin_session";
const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || "forza_super_secret_jwt_key_2026_apple_studio_secure_salt_998877665544332211"
);

export async function signToken(payload: { username: string }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(SECRET_KEY);
}

export async function verifyToken(token: string): Promise<{ username: string } | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as { username: string };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<{ username: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 saat
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}