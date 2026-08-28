import { NextResponse } from "next/server";
import { getGalleryPhotos, updateGalleryPhotos } from "@/lib/data";

export async function GET() {
  const photos = getGalleryPhotos();
  return NextResponse.json(
    { success: true, photos },
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
  try {
    const body = await request.json();
    const photos = Array.isArray(body.photos) ? body.photos : Array.isArray(body) ? body : null;
    if (photos) {
      const updated = updateGalleryPhotos(photos);
      return NextResponse.json({ success: true, photos: updated });
    }
    return NextResponse.json({ error: "Geçersiz galeri verisi" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Galeri kaydedilemedi" }, { status: 500 });
  }
}
