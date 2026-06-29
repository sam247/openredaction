"use client";

import { useEffect } from "react";
import { analytics } from "@/lib/analytics";

/** Fires a dedicated roadmap_view event once per full page visit (in addition to global page_view). */
export default function RoadmapViewTracker() {
  useEffect(() => {
    analytics.roadmapPageView();
  }, []);
  return null;
}
