import { NextResponse } from "next/server";
import { getComputers, updateComputerStatus, getStats } from "@/lib/data";
import { getSession } from "@/lib/auth";

export async function GET() {
  const computers = getComputers();
  const stats = getStats();
  return NextResponse.json({ success: true, computers, stats });
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