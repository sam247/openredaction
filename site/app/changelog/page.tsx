import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Calendar, ExternalLink } from 'lucide-react';
import { generatePageMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = generatePageMetadata({
  title: 'Changelog | OpenRedaction',
  description: 'Recent updates, versions, and improvements to OpenRedaction. Track new features, bug fixes, and enhancements.',
  path: '/changelog',
});

const changelogEntries = [
  {
    date: '2026-03-19',
    version: '1.0.9',
    title: 'Library: npm README and docs sync',
    changes: [
      'npm README: `detect()` is async (`await`); links to openredaction.com and GitHub',
      'Use **1.0.9** on npm if you hit “cannot republish” on 1.0.8 — registries never allow the same version twice',
    ],
  },
  {
    date: '2025-03-01',
    version: '1.2.0',
    title: 'Focus on open source and enterprise support',
    changes: [
      'OpenRedaction is now offered as open-source library and self-hosted only; no hosted API or Pro tier',
      'Enterprise support and custom deployments available via contact',
      'Pricing page replaced with Enterprise support (contact us)',
      'Documentation and playground updated for library-only use',
    ],
  },
  {
    date: '2025-01-10',
    version: '1.0.0',
    title: 'Initial Release',
    changes: [
      'Open-source regex-based PII detection library',
      '500+ tested patterns for emails, phones, SSNs, addresses, credit cards',
      'Support for GDPR, HIPAA, and CCPA presets',
      'Self-hostable with npm installation',
      'Interactive playground for testing',
      'Comprehensive documentation',
    ],
  },
];

export default function Changelog() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-[116px] pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight max-w-7xl mx-auto">Changelog</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Track updates, new features, and improvements to OpenRedaction
            </p>
          </div>

          <div className="space-y-8">
            {changelogEntries.map((entry, index) => (
              <div key={index} className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-semibold">{entry.title}</h2>
                      <span className="text-sm bg-gray-800 px-2 py-1 rounded text-gray-400">
                        v{entry.version}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Calendar size={14} className="mr-2" />
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
                <ul className="space-y-2">
                  {entry.changes.map((change, changeIndex) => (
                    <li key={changeIndex} className="flex items-start text-gray-300">
                      <span className="text-green-400 mr-2">•</span>
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gray-900 rounded-lg p-6 border border-gray-800 text-center">
            <p className="text-gray-300 mb-4">
              For the latest updates and releases, check out our{' '}
              <a
                href="https://github.com/sam247/openredaction/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 underline inline-flex items-center gap-1"
              >
                GitHub releases
                <ExternalLink size={14} />
              </a>
            </p>
            <Link
              href="/docs"
              prefetch={false}
              className="inline-block text-white hover:text-gray-300 underline"
            >
              View Documentation →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

