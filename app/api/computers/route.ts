import { NextResponse } from "next/server";
import { getComputers, updateComputerStatus, updateAllComputers, getStats } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const computers = getComputers();
  const stats = getStats();
  return NextResponse.json(
    { success: true, computers, stats },
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
    const { computers } = await request.json();
    if (Array.isArray(computers)) {
      const updatedList = updateAllComputers(computers);
      const stats = getStats();
      return NextResponse.json(
        {
          success: true,
          message: "Tüm masa durumları veritabanına kaydedildi.",
          computers: updatedList,
          stats: stats,
        },
        {
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );
    }
    return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Kayıt başarısız" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, durum } = await request.json();
    const updated = updateComputerStatus(id, durum);
    if (!updated) {
      return NextResponse.json({ error: "Masa bulunamadı" }, { status: 404 });
    }
    const computers = getComputers();
    const stats = getStats();
    return NextResponse.json(
      { success: true, computer: updated, computers, stats },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    return NextResponse.json({ error: "İşlem başarısız" }, { status: 500 });
  }
}