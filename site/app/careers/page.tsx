import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = generatePageMetadata({
  title: 'Careers - Join OpenRedaction | OpenRedaction',
  description: 'Join the OpenRedaction team. We\'re building open-source tools for PII detection and redaction.',
  path: '/careers',
});

export default function Careers() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-[116px] pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight max-w-7xl mx-auto">Careers</h1>
          
          <div className="prose prose-invert max-w-none space-y-6">
            <p className="text-xl text-gray-300">
              OpenRedaction is an open-source project focused on building transparent, privacy-preserving tools for PII detection and redaction.
            </p>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Open Source Contributions</h2>
              <p className="text-gray-300">
                The best way to get involved with OpenRedaction is through open-source contributions. We welcome contributions of all kinds:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
                <li>New regex patterns for PII detection</li>
                <li>Bug fixes and improvements</li>
                <li>Documentation updates</li>
                <li>Feature enhancements</li>
                <li>Community support</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Get Involved</h2>
              <p className="text-gray-300 mb-4">
                Check out our GitHub repository to see open issues, contribute code, or suggest new features.
              </p>
              <div className="mt-4">
                <a
                  href="https://github.com/sam247/openredaction"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors inline-block"
                >
                  View on GitHub
                </a>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact</h2>
              <p className="text-gray-300">
                For inquiries about career opportunities or partnerships, please reach out through our contact page.
              </p>
              <div className="mt-4">
                <Link
                  href="/contact"
                  className="bg-gray-800 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-700 transition-colors border border-gray-700 inline-block"
                >
                  Contact Us
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

