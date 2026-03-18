'use client';

import Link from 'next/link';
import { analytics } from '@/lib/analytics';

export default function HomepageCTAs() {
  return (
    <>
      <Link
        href="/playground"
        className="bg-white text-black px-8 py-4 rounded-md font-semibold text-lg hover:bg-gray-100 transition-colors w-full sm:w-auto"
        onClick={() => analytics.ctaClick('hero')}
      >
        Try Playground
      </Link>
      <a
        href="https://github.com/sam247/openredaction"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gray-900 text-white px-8 py-4 rounded-md font-semibold text-lg hover:bg-gray-800 transition-colors border border-gray-800 w-full sm:w-auto"
        onClick={() => analytics.externalLinkClick('github', 'hero', 'View on GitHub')}
      >
        View on GitHub
      </a>
    </>
  );
}

