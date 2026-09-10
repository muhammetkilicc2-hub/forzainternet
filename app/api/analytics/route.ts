import { NextResponse } from "next/server";
import { getAnalytics, trackClick, trackPageView } from "@/lib/data";

export async function GET() {
  const analytics = await getAnalytics();
  return NextResponse.json({ success: true, analytics });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, type } = body;

    let analytics;
    if (action === "click") {
      analytics = await trackClick(type as "map" | "phone");
    } else if (action === "pageview") {
      analytics = await trackPageView(type as "home" | "ozellikler" | "hakkimizda");
    }

    return NextResponse.json({ success: true, analytics });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
