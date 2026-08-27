import { NextResponse } from "next/server";
import { getComputers, updateComputerStatus, getStats } from "@/lib/data";
import { getSession } from "@/lib/auth";

export async function GET() {
  const computers = getComputers();
  const stats = getStats();
  return NextResponse.json(
    { success: true, computers, stats },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const { computers } = await request.json();
    if (Array.isArray(computers)) {
      computers.forEach((pc: { id: string; durum: any }) => {
        if (pc.id && pc.durum) {
          updateComputerStatus(pc.id, pc.durum);
        }
      });
      return NextResponse.json({
        success: true,
        message: "Tüm masa durumları veritabanına kaydedildi.",
        computers: getComputers(),
        stats: getStats(),
      });
    }
    return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Kayıt başarısız" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const { id, durum } = await request.json();
    const updated = updateComputerStatus(id, durum);
    if (!updated) {
      return NextResponse.json({ error: "Masa bulunamadı" }, { status: 404 });
    }
    return NextResponse.json({ success: true, computer: updated, stats: getStats() });
  } catch (error) {
    return NextResponse.json({ error: "İşlem başarısız" }, { status: 500 });
  }
}