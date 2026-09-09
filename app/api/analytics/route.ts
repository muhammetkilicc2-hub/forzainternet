import { NextResponse } from "next/server";
import { getAnalytics, trackClick, trackPageView } from "@/lib/data";

export async function GET() {
  const analytics = getAnalytics();
  return NextResponse.json({ success: true, analytics });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, type } = body;

    let analytics;
    if (action === "click") {
      analytics = trackClick(type as "map" | "phone");
    } else if (action === "pageview") {
      analytics = trackPageView(type as "home" | "ozellikler" | "hakkimizda");
    }

    return NextResponse.json({ success: true, analytics });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
