import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: Request,
  context: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await context.params;
    const cleanFilename = path.basename(filename);
    const filePath = path.join(process.cwd(), "public", "uploads", cleanFilename);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Görsel bulunamadı" }, { status: 404 });
    }

    const ext = path.extname(cleanFilename).toLowerCase();
    const contentTypes: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
    };

    const contentType = contentTypes[ext] || "application/octet-stream";
    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Görsel yüklenirken hata oluştu" }, { status: 500 });
  }
}