import { NextResponse } from "next/server";
import { getReservations, createReservation, updateReservationStatus, markAllReservationsRead, getStats } from "@/lib/data";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }
  const reservations = getReservations();
  return NextResponse.json({ success: true, reservations, stats: getStats() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.musteriAdi || !body.telefon || !body.masaId) {
      return NextResponse.json({ error: "Eksik rezervasyon bilgisi" }, { status: 400 });
    }
    const created = createReservation(body);
    return NextResponse.json({ success: true, reservation: created });
  } catch (error) {
    return NextResponse.json({ error: "Rezervasyon kaydedilemedi" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const { id, durum, markAllRead } = await request.json();

    if (markAllRead) {
      markAllReservationsRead();
      return NextResponse.json({ success: true, reservations: getReservations(), stats: getStats() });
    }

    if (id && durum) {
      const updated = updateReservationStatus(id, durum);
      if (!updated) {
        return NextResponse.json({ error: "Rezervasyon bulunamadı" }, { status: 404 });
      }
      return NextResponse.json({ success: true, reservation: updated, stats: getStats() });
    }

    return NextResponse.json({ error: "Geçersiz parametreler" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Güncelleme başarısız" }, { status: 500 });
  }
}