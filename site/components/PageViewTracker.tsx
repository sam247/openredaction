"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { analytics } from "@/lib/analytics";
import { gtagEvent } from "@/lib/gtag";

export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      analytics.pageView(pathname);
      gtagEvent("page_view", { page_path: pathname });
    }
  }, [pathname]);

  return null;
}
