import { NextResponse } from "next/server";
import { getGalleryPhotos, updateGalleryPhotos, getAdminSettings } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const photos = getGalleryPhotos();
  const settings = getAdminSettings();
  const coverPhoto = settings.aboutCoverPhoto || "/foto1.jpeg";

  return NextResponse.json(
    { success: true, photos, coverPhoto },
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
    const photos = Array.isArray(body.photos) ? body.photos : Array.isArray(body) ? body : null;
    if (photos) {
      const updated = updateGalleryPhotos(photos);
      return NextResponse.json(
        { success: true, photos: updated },
        {
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );
    }
    return NextResponse.json({ error: "Geçersiz galeri verisi" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Galeri kaydedilemedi" }, { status: 500 });
  }
}
