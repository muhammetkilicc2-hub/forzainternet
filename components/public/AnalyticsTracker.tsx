"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Only track public pages
    if (pathname && !pathname.startsWith("/admin") && !pathname.startsWith("/api")) {
      let pageType = "home";
      if (pathname.includes("ozellikler")) pageType = "ozellikler";
      if (pathname.includes("hakkimizda")) pageType = "hakkimizda";

      // Session storage check to not over-count reloads in same session for pageViews if desired, 
      // but for now we track every hit as a pageview, uniqueness is handled by session storage for 'tekilZiyaret' in future.
      
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "pageview", type: pageType })
      }).catch(err => console.error("Analytics Error:", err));
    }
  }, [pathname]);

  return null;
}
