import { generatePageMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = generatePageMetadata({
  title: 'Blog - OpenRedaction Guides & Updates',
  description: 'Read guides, tutorials, and updates about PII detection, redaction, privacy compliance, and OpenRedaction features.',
  path: '/blog',
});

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

