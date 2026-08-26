import { NextResponse } from "next/server";
import { getPricing, updatePricing } from "@/lib/data";
import { getSession } from "@/lib/auth";

export async function GET() {
  const pricing = getPricing();
  return NextResponse.json({ success: true, pricing });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updated = updatePricing(body);
    return NextResponse.json({ success: true, pricing: updated });
  } catch (error) {
    return NextResponse.json({ error: "Fiyatlar güncellenemedi" }, { status: 500 });
  }
}