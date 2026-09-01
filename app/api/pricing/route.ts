import { NextResponse } from "next/server";
import { getPricing, updatePricing } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const pricing = getPricing();
  return NextResponse.json(
    { success: true, pricing },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = body && body.pricing ? body.pricing : body;
    const updated = updatePricing(payload);
    return NextResponse.json(
      { success: true, pricing: updated },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    return NextResponse.json({ error: "Fiyatlar güncellenemedi" }, { status: 500 });
  }
}