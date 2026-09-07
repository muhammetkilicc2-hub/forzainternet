import { NextResponse } from "next/server";

export async function POST(request: Request) {
  return NextResponse.json(
    { error: "Güvenlik sebebiyle şifre sıfırlama paneli kapatılmıştır. Lütfen güvenliğiniz için şifrenizi unutursanız Firebase üzerinden değiştiriniz." },
    { status: 403 }
  );
}
