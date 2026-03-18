'use client';

import Link from 'next/link';
import { analytics } from '@/lib/analytics';

export default function DemoCTA() {
  return (
    <Link
      href="/playground"
      className="inline-block bg-white text-black px-6 py-2 rounded-md font-semibold hover:bg-gray-100 transition-colors"
      onClick={() => analytics.ctaClick('demo')}
    >
      Open Playground →
    </Link>
  );
}

