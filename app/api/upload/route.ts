import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 1. Multipart Form Data (Dosya Yükleme)
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = (formData.get("file") || formData.get("image")) as File | null;

      if (!file) {
        return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const originalName = file.name || "image.jpg";
      const ext = path.extname(originalName) || ".jpg";
      const cleanExt = [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext.toLowerCase()) ? ext.toLowerCase() : ".jpg";
      const fileName = `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${cleanExt}`;
      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(filePath, buffer);

      const fileUrl = `/uploads/${fileName}`;
      return NextResponse.json({ success: true, url: fileUrl });
    }

    // 2. Base64 Data URL JSON Yükleme
    const body = await request.json();
    const base64Data = body.image || body.file || body.data;

    if (typeof base64Data === "string" && base64Data.startsWith("data:image")) {
      const matches = base64Data.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (matches) {
        const extType = matches[1] === "jpeg" ? "jpg" : matches[1];
        const base64Content = matches[2];
        const buffer = Buffer.from(base64Content, "base64");

        const fileName = `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${extType}`;
        const filePath = path.join(uploadDir, fileName);

        fs.writeFileSync(filePath, buffer);

        const fileUrl = `/uploads/${fileName}`;
        return NextResponse.json({ success: true, url: fileUrl });
      }
    }

    return NextResponse.json({ error: "Geçersiz görsel verisi" }, { status: 400 });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Görsel yüklenemedi" }, { status: 500 });
  }
}
