import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';
import { Shield, CheckCircle2, FileText, Lock, Globe } from 'lucide-react';

export const metadata: Metadata = generatePageMetadata({
  title: 'GDPR Redaction - GDPR Compliant PII Detection & Redaction | OpenRedaction',
  description: 'GDPR-compliant PII redaction for European data protection. Automatically detect and redact personal data to meet GDPR requirements. Open-source, self-hostable solution.',
  path: '/gdpr-redaction',
});

export default function GdprRedaction() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-[116px] pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight max-w-7xl mx-auto">
              GDPR-Compliant PII Redaction
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Automatically detect and redact personal data to meet GDPR requirements. Open-source solution with built-in GDPR presets for European data protection compliance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/playground"
                className="bg-white text-black px-8 py-4 rounded-md font-semibold text-lg hover:bg-gray-100 transition-colors"
              >
                Try Playground
              </Link>
              <Link
                href="/docs/getting-started"
                className="bg-gray-900 text-white px-8 py-4 rounded-md font-semibold text-lg hover:bg-gray-800 transition-colors border border-gray-800"
              >
                Get Started
              </Link>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 mb-12">
            <div className="flex items-start mb-6">
              <Globe className="text-white mr-4 mt-1 flex-shrink-0" size={32} />
              <div>
                <h2 className="text-3xl font-semibold mb-4">What is GDPR?</h2>
                <p className="text-gray-300 mb-4">
                  The General Data Protection Regulation (GDPR) is a European Union regulation that governs data protection and privacy for individuals within the EU and EEA. 
                  It requires organizations to protect personal data and gives individuals control over their personal information.
                </p>
                <p className="text-gray-300">
                  GDPR defines personal data as any information that can directly or indirectly identify a person, including names, email addresses, IP addresses, and more.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex items-start">
                <Shield className="text-white mr-4 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h2 className="text-2xl font-semibold mb-3">GDPR Preset</h2>
                  <p className="text-gray-300">
                    OpenRedaction includes a built-in GDPR preset that detects all personal data types covered by GDPR regulations, including names, emails, phone numbers, IP addresses, and more.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex items-start">
                <Lock className="text-white mr-4 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Data Residency</h2>
                  <p className="text-gray-300">
                    Self-host OpenRedaction on your own infrastructure to ensure all processing happens within the EU. No data leaves your environment by default.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex items-start">
                <FileText className="text-white mr-4 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Right to Erasure</h2>
                  <p className="text-gray-300">
                    Automate the redaction of personal data from documents, logs, and databases to support GDPR&apos;s &quot;right to be forgotten&quot; requirements.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex items-start">
                <CheckCircle2 className="text-white mr-4 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Compliance Automation</h2>
                  <p className="text-gray-300">
                    Integrate PII detection into your data processing pipelines to automatically identify and protect personal data before storage or sharing.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 mb-12">
            <h2 className="text-3xl font-semibold mb-6">GDPR Personal Data Types Detected</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <CheckCircle2 className="text-white inline mr-2" size={20} />
                <span className="text-gray-300">Names (first, last, full names)</span>
              </div>
              <div>
                <CheckCircle2 className="text-white inline mr-2" size={20} />
                <span className="text-gray-300">Email addresses</span>
              </div>
              <div>
                <CheckCircle2 className="text-white inline mr-2" size={20} />
                <span className="text-gray-300">Phone numbers</span>
              </div>
              <div>
                <CheckCircle2 className="text-white inline mr-2" size={20} />
                <span className="text-gray-300">IP addresses</span>
              </div>
              <div>
                <CheckCircle2 className="text-white inline mr-2" size={20} />
                <span className="text-gray-300">Physical addresses</span>
              </div>
              <div>
                <CheckCircle2 className="text-white inline mr-2" size={20} />
                <span className="text-gray-300">Date of birth</span>
              </div>
              <div>
                <CheckCircle2 className="text-white inline mr-2" size={20} />
                <span className="text-gray-300">National identification numbers</span>
              </div>
              <div>
                <CheckCircle2 className="text-white inline mr-2" size={20} />
                <span className="text-gray-300">Credit card numbers</span>
              </div>
              <div>
                <CheckCircle2 className="text-white inline mr-2" size={20} />
                <span className="text-gray-300">Passport numbers</span>
              </div>
              <div>
                <CheckCircle2 className="text-white inline mr-2" size={20} />
                <span className="text-gray-300">Driver&apos;s license numbers</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 mb-12">
            <h2 className="text-3xl font-semibold mb-6">Use Cases for GDPR Redaction</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Data Export Compliance</h3>
                <p className="text-gray-300">
                  Redact personal data from data exports and backups before sharing with third parties or moving data across borders.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Log Management</h3>
                <p className="text-gray-300">
                  Remove PII from application logs before sending to log management tools or analytics platforms to ensure GDPR compliance.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Document Sharing</h3>
                <p className="text-gray-300">
                  Automatically redact personal data from documents before sharing internally or externally to prevent unauthorized access.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Subject Access Requests</h3>
                <p className="text-gray-300">
                  Support GDPR&apos;s right to access by identifying and redacting third-party personal data from documents shared with data subjects.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
            <h2 className="text-3xl font-semibold mb-4">Get Started with GDPR Redaction</h2>
            <p className="text-gray-300 mb-6">
              OpenRedaction&apos;s GDPR preset makes it easy to comply with European data protection regulations. The open-source library is free and can be self-hosted within the EU.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/docs/getting-started"
                className="bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors text-center"
              >
                Installation Guide →
              </Link>
              <Link
                href="/docs/security"
                className="bg-gray-800 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-700 transition-colors border border-gray-700 text-center"
              >
                Security & Compliance →
              </Link>
              <Link
                href="/docs/self-hosting"
                className="bg-gray-800 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-700 transition-colors border border-gray-700 text-center"
              >
                Self-Hosting Guide →
              </Link>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">Related Resources</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/pii-detection" className="text-gray-300 hover:text-white underline">
                PII Detection
              </Link>
              <Link href="/hipaa-redaction" className="text-gray-300 hover:text-white underline">
                HIPAA Redaction
              </Link>
              <Link href="/use-cases/legal" className="text-gray-300 hover:text-white underline">
                Legal Use Cases
              </Link>
              <Link href="/docs/security" className="text-gray-300 hover:text-white underline">
                Security Documentation
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

