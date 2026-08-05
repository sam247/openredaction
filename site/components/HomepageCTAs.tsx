"use client";

import Link from "next/link";
import { analytics } from "@/lib/analytics";
import { TrackedGitHubLink } from "@/components/TrackedLinks";

export default function HomepageCTAs() {
  return (
    <>
      <Link
        href="/playground"
        className="bg-white text-black px-8 py-4 rounded-md font-semibold text-lg hover:bg-gray-100 transition-colors w-full sm:w-auto text-center"
        onClick={() => analytics.ctaClick("hero")}
      >
        Try Playground
      </Link>
      <TrackedGitHubLink
        location="hero"
        className="bg-gray-900 text-white px-8 py-4 rounded-md font-semibold text-lg hover:bg-gray-800 transition-colors border border-gray-800 w-full sm:w-auto text-center"
      >
        View on GitHub
      </TrackedGitHubLink>
    </>
  );
}
