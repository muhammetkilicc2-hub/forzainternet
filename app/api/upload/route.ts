import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    // 1. Multipart Form Data (Dosya Yükleme)
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = (formData.get("file") || formData.get("image")) as File | null;

      if (!file) {
        return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const mimeType = file.type || "image/jpeg";
      
      const base64Url = `data:${mimeType};base64,${buffer.toString('base64')}`;
      
      // Vercel serverless ortamında diske yazmak (fs.writeFileSync) hata verir (Read-only file system).
      // Bu yüzden küçük görselleri doğrudan Base64 olarak veritabanına kaydedilmesi için döndürüyoruz.
      return NextResponse.json({ success: true, url: base64Url });
    }

    // 2. Base64 Data URL JSON Yükleme (zaten base64 geldiyse aynen geri döndür)
    const body = await request.json();
    const base64Data = body.image || body.file || body.data;

    if (typeof base64Data === "string" && base64Data.startsWith("data:image")) {
      return NextResponse.json({ success: true, url: base64Data });
    }

    return NextResponse.json({ error: "Geçersiz görsel verisi" }, { status: 400 });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Görsel yüklenemedi" }, { status: 500 });
  }
}
