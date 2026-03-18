import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = generatePageMetadata({
  title: 'Terms of Service | OpenRedaction',
  description: 'Terms of Service for OpenRedaction. Best-effort redaction service, acceptable use policy, and service availability terms.',
  path: '/terms',
});

export default function Terms() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-[116px] pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight max-w-7xl mx-auto">Terms of Service</h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-xl text-gray-300 mb-8">
              Last updated: January 2025
            </p>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">1. Service Description</h2>
              <p className="text-gray-300 mb-4">
                OpenRedaction provides an open-source library for detecting and redacting personally identifiable information (PII) from text. The offering includes:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>An open-source regex-based redaction library (free, self-hostable)</li>
                <li>Documentation, playground, and support resources</li>
                <li>Optional enterprise support (contact us for custom deployments or SLAs)</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">2. Best-Effort Service</h2>
              <p className="text-gray-300 mb-4">
                <strong>OpenRedaction provides best-effort redaction, not perfect or guaranteed redaction.</strong> The service uses regex patterns and optional AI to detect PII, but:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Detection may miss some entities or produce false positives</li>
                <li>Results are not guaranteed to be 100% accurate</li>
                <li>You are responsible for manually reviewing output when handling highly sensitive data</li>
                <li>For legal documents, compliance-critical content, or highly sensitive data, always perform manual review</li>
              </ul>
              <p className="text-gray-300">
                Automatic redaction should be used as a first pass, not a final solution.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">3. Liability Disclaimers</h2>
              <p className="text-gray-300 mb-4">
                <strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW, OPENREDACTION AND ITS PROVIDERS DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:</strong>
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Warranties of merchantability, fitness for a particular purpose, or non-infringement</li>
                <li>Any guarantee that the service will detect all PII or prevent all data leaks</li>
                <li>Any guarantee of service availability, uptime, or performance</li>
              </ul>
              <p className="text-gray-300 mb-4">
                <strong>OpenRedaction shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:</strong>
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Data breaches or privacy violations resulting from missed PII detection</li>
                <li>Compliance failures or regulatory penalties</li>
                <li>Loss of data, profits, or business opportunities</li>
                <li>Service interruptions or downtime</li>
              </ul>
              <p className="text-gray-300">
                You are solely responsible for ensuring compliance with applicable privacy laws (GDPR, HIPAA, CCPA, etc.) and for verifying the accuracy of redacted output.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use Policy</h2>
              <p className="text-gray-300 mb-4">
                You agree not to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Use the service for any illegal purpose or in violation of any laws or regulations</li>
                <li>Attempt to reverse engineer, decompile, or extract proprietary algorithms from the software</li>
                <li>Abuse, overload, or attempt to disrupt any website or service we operate (including but not limited to DDoS attacks or automated abuse)</li>
                <li>Use the library or site to process content that violates third-party rights (copyright, privacy, etc.)</li>
                <li>Use the service in a manner that could damage, disable, or impair the service or interfere with other users&apos; access</li>
              </ul>
              <p className="text-gray-300">
                Violation of this Acceptable Use Policy may result in immediate termination of your access to the service without refund.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">5. Website and Support</h2>
              <p className="text-gray-300 mb-4">
                This website, documentation, and playground are provided &quot;as-is&quot; with no service level agreement. We do not guarantee uptime, availability, or support. Enterprise support (if agreed separately) may have different terms.
              </p>
              <p className="text-gray-300">
                We reserve the right to modify, suspend, or discontinue the website or any part thereof at any time with or without notice.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">6. Data Handling</h2>
              <p className="text-gray-300 mb-4">
                Our data handling practices are described in our{' '}
                <Link href="/privacy" className="text-white hover:text-gray-300 underline">
                  Privacy Policy
                </Link>.
              </p>
              <p className="text-gray-300">
                In summary: we do not store your text. Processing is stateless and data is discarded after redaction. For complete privacy, you can self-host the open-source library.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
              <p className="text-gray-300 mb-4">
                We may terminate or suspend your access to the service immediately, without prior notice, if you:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Violate these Terms of Service</li>
                <li>Engage in abusive or illegal activity</li>
                <li>Fail to pay fees when due (Pro tier)</li>
              </ul>
              <p className="text-gray-300">
                Upon termination, your right to use the service will cease immediately. The open-source library remains available under its MIT license.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">8. Open Source License</h2>
              <p className="text-gray-300 mb-4">
                The OpenRedaction library is provided under the MIT License. Your use of the open-source library is governed by that license, not these Terms of Service.
              </p>
              <p className="text-gray-300">
                These Terms of Service apply only to the hosted API service, playground, and website.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
              <p className="text-gray-300">
                We reserve the right to modify these Terms of Service at any time. We will notify users of material changes via email (for Pro tier subscribers) or by posting a notice on our website. Your continued use of the service after changes become effective constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">10. Contact</h2>
              <p className="text-gray-300">
                If you have questions about these Terms of Service, please contact us through our support channels or{' '}
                <Link href="/contact" className="text-white hover:text-gray-300 underline">
                  contact page
                </Link>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

