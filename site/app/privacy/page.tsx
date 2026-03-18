import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = generatePageMetadata({
  title: 'Privacy Policy | OpenRedaction',
  description: 'Privacy policy for OpenRedaction. Learn about our data handling practices, zero data retention, and self-hosted options.',
  path: '/privacy',
});

export default function Privacy() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-[116px] pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight max-w-7xl mx-auto">Privacy Policy</h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-xl text-gray-300 mb-8">
              OpenRedaction is designed with privacy and data minimization at its core. This policy explains how we handle your data.
            </p>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">No Data Storage</h2>
              <p className="text-gray-300 mb-4">
                We do not store or log your text. When you use OpenRedaction (whether via the playground, API, or library), your data is processed in memory and discarded immediately after processing.
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>No persistent databases</li>
                <li>No logs of your input text</li>
                <li>No retention of processed data</li>
                <li>All processing happens in memory</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Hosted AI Assist</h2>
              <p className="text-gray-300 mb-4">
                When AI assist is enabled, your text is sent to our hosted AI proxy for entity detection. Here&apos;s what happens:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Text is sent to our hosted AI proxy</li>
                <li>The proxy forwards it to our model provider strictly for entity detection</li>
                <li>We do not log or store your text</li>
                <li>Everything is processed in memory and discarded</li>
                <li>No persistent storage of any kind</li>
              </ul>
              <p className="text-gray-300">
                AI assist is optional. Regex-only mode works completely offline and requires no external services.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Self-Hosted Option</h2>
              <p className="text-gray-300 mb-4">
                For complete privacy and control, you can self-host OpenRedaction on your own infrastructure:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Your data never leaves your environment</li>
                <li>You control all processing and logging</li>
                <li>You can configure your own AI endpoint if needed</li>
                <li>Complete control over data handling</li>
              </ul>
              <p className="text-gray-300">
                OpenRedaction is fully open source, so you can audit the code and deploy it on your own servers.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Data Minimization Principles</h2>
              <p className="text-gray-300 mb-4">
                Our approach aligns with GDPR and UK-GDPR data minimization principles:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li><strong>Storage limitation:</strong> We don&apos;t store your data</li>
                <li><strong>Data minimization:</strong> We only process what you send, and only for the purpose of redaction</li>
                <li><strong>Purpose limitation:</strong> Data is used solely for PII detection and redaction</li>
                <li><strong>Transparency:</strong> All code is open source and auditable</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">User Data Discarded After Processing</h2>
              <p className="text-gray-300 mb-4">
                All user data is discarded immediately after processing:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Input text is processed and then discarded</li>
                <li>No intermediate storage</li>
                <li>No caching of results</li>
                <li>No analytics or tracking of your content</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
              <p className="text-gray-300 mb-4">
                OpenRedaction uses the following third-party services:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li><strong>Email Service:</strong> We use an email service provider for the contact form and support communications. Email addresses are used solely for replying to your enquiries and are not shared with third parties for marketing purposes.</li>
              </ul>
              <p className="text-gray-300">
                All third-party services are used in compliance with applicable privacy laws and data protection regulations.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Metadata Logging</h2>
              <p className="text-gray-300 mb-4">
                For rate limiting, abuse prevention, and service improvement, we may log minimal metadata:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>IP addresses (e.g. for abuse prevention)</li>
                <li>Request timestamps</li>
                <li>Response status codes</li>
              </ul>
              <p className="text-gray-300">
                <strong>We do not log:</strong> your input text, detected entities, or any content of your requests. All metadata is retained only as long as necessary for rate limiting and abuse prevention purposes.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">GDPR & UK-GDPR Compliance</h2>
              <p className="text-gray-300 mb-4">
                Our data handling practices align with GDPR and UK-GDPR principles:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li><strong>Data Minimization:</strong> We only process data necessary for the service (PII detection and redaction)</li>
                <li><strong>Storage Limitation:</strong> We do not store your text — processing is stateless</li>
                <li><strong>Purpose Limitation:</strong> Data is used solely for PII detection and redaction</li>
                <li><strong>Transparency:</strong> All code is open source and auditable</li>
                <li><strong>Right to Erasure:</strong> Since we don&apos;t store your text, there&apos;s nothing to delete. For metadata, contact us to request deletion.</li>
              </ul>
              <p className="text-gray-300">
                For complete control over your data, you can self-host the open-source library, which requires no external services and processes everything locally.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Contact</h2>
              <p className="text-gray-300">
                If you have questions about this privacy policy, please contact us through our support channels or{' '}
                <Link href="/contact" className="text-white hover:text-gray-300 underline">
                  contact page
                </Link>.
              </p>
            </section>

            <section className="mb-12">
              <p className="text-sm text-gray-400 italic">
                Last updated: January 2025
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

