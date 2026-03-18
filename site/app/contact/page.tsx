import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = generatePageMetadata({
  title: 'Get Support for Self-Hosted Deployments',
  description: 'Contact OpenRedaction for self-hosted deployment support, GitHub issue reporting, community support, or learn more about Disclosurely.com.',
  path: '/contact',
});

export default function Contact() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="pt-[148px] pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight max-w-7xl mx-auto">
              Get Support for Self-Hosted Deployments
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-4">
              Need help with self-hosted deployment? Have questions about the library? 
              Want to report issues or contribute?
            </p>
            <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-yellow-400 text-sm">
                <strong>Note:</strong> For self-hosted support only. We do not provide cloud-hosted API service.
              </p>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-8 md:p-12 border border-gray-800 mb-8">
            <ContactForm />
          </div>

          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
            <h2 className="text-2xl font-semibold mb-4 text-center">Other Ways to Get Help</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">GitHub Issues</h3>
                <p className="text-gray-400 text-sm mb-3">
                  Report bugs, request features, or ask questions on GitHub.
                </p>
                <a
                  href="https://github.com/sam247/openredaction/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-300 underline text-sm"
                >
                  View Issues →
                </a>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Documentation</h3>
                <p className="text-gray-400 text-sm mb-3">
                  Check our documentation for installation and usage guides.
                </p>
                <Link
                  href="/docs"
                  prefetch={false}
                  className="text-white hover:text-gray-300 underline text-sm"
                >
                  View Docs →
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">Prefer to schedule a call?</p>
            <a
              href="mailto:support@openredaction.com"
              className="text-white hover:text-gray-300 underline"
            >
              Email us at support@openredaction.com
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

