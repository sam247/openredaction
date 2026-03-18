import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';
import { Search, Eye, Shield, CheckCircle2, AlertCircle } from 'lucide-react';

export const metadata: Metadata = generatePageMetadata({
  title: 'PII Detection - Identify Personally Identifiable Information | OpenRedaction',
  description: 'Detect PII in text with 500+ regex patterns and optional AI assist. Open-source PII detection library for emails, phones, SSNs, credit cards, and more. GDPR/HIPAA compliant.',
  path: '/pii-detection',
});

export default function PiiDetection() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-[116px] pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight max-w-7xl mx-auto">
              PII Detection Made Simple
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Automatically detect personally identifiable information (PII) in text using 500+ tested regex patterns. Optional AI-assist for better coverage on unstructured data.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/playground"
                className="bg-white text-black px-8 py-4 rounded-md font-semibold text-lg hover:bg-gray-100 transition-colors"
              >
                Try Detection Free
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
            <h2 className="text-3xl font-semibold mb-6">What is PII Detection?</h2>
            <p className="text-gray-300 mb-4">
              Personally Identifiable Information (PII) detection is the process of identifying sensitive data in text that could be used to identify, contact, or locate an individual. This includes:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
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
                <span className="text-gray-300">Social Security Numbers (SSN)</span>
              </div>
              <div>
                <CheckCircle2 className="text-white inline mr-2" size={20} />
                <span className="text-gray-300">Credit card numbers</span>
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
                <span className="text-gray-300">Passport numbers</span>
              </div>
              <div>
                <CheckCircle2 className="text-white inline mr-2" size={20} />
                <span className="text-gray-300">Driver&apos;s license numbers</span>
              </div>
              <div>
                <CheckCircle2 className="text-white inline mr-2" size={20} />
                <span className="text-gray-300">Names and personal identifiers</span>
              </div>
              <div>
                <CheckCircle2 className="text-white inline mr-2" size={20} />
                <span className="text-gray-300">Date of birth</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <Search className="text-white mb-4" size={32} />
              <h2 className="text-2xl font-semibold mb-3">Pattern-Based Detection</h2>
              <p className="text-gray-300">
                500+ tested regex patterns for fast, deterministic PII detection. Works entirely offline with no external dependencies.
              </p>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <Eye className="text-white mb-4" size={32} />
              <h2 className="text-2xl font-semibold mb-3">AI-Assisted Detection</h2>
              <p className="text-gray-300">
                Optional AI assist for better coverage on messy, unstructured text. Finds names, locations, and context-based PII that patterns might miss.
              </p>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <Shield className="text-white mb-4" size={32} />
              <h2 className="text-2xl font-semibold mb-3">Compliance Ready</h2>
              <p className="text-gray-300">
                Built-in presets for GDPR, HIPAA, and CCPA compliance. Helps organizations meet regulatory requirements for data protection.
              </p>
            </div>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-6 mb-12">
            <div className="flex items-start">
              <AlertCircle className="text-yellow-400 mr-4 mt-1 flex-shrink-0" size={24} />
              <div>
                <h3 className="text-xl font-semibold text-yellow-400 mb-2">Why PII Detection Matters</h3>
                <p className="text-yellow-200">
                  Unprotected PII in logs, databases, or shared documents can lead to data breaches, compliance violations, and privacy risks. 
                  Automated PII detection helps organizations identify and protect sensitive data before it&apos;s exposed.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 mb-12">
            <h2 className="text-3xl font-semibold mb-6">Common Use Cases</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Log Sanitization</h3>
                <p className="text-gray-300">
                  Remove PII from application logs before storage or analysis to prevent sensitive data from leaking into log management tools.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">API Request Filtering</h3>
                <p className="text-gray-300">
                  Detect and redact PII in API requests and responses to ensure sensitive data doesn&apos;t get logged or stored unintentionally.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Document Processing</h3>
                <p className="text-gray-300">
                  Process documents, emails, and chat logs to identify PII before sharing, archiving, or using in AI training datasets.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Compliance Automation</h3>
                <p className="text-gray-300">
                  Automate GDPR, HIPAA, and CCPA compliance by detecting PII in data exports, backups, and shared documents.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
            <h2 className="text-3xl font-semibold mb-4">Start Detecting PII Today</h2>
            <p className="text-gray-300 mb-6">
              OpenRedaction provides both pattern-based and AI-assisted PII detection. The open-source library is free and works entirely offline.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/playground"
                className="bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors text-center"
              >
                Try Playground →
              </Link>
              <Link
                href="/docs/getting-started"
                className="bg-gray-800 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-700 transition-colors border border-gray-700 text-center"
              >
                Installation Guide →
              </Link>
              <Link
                href="/blog/understanding-pii-detection"
                className="bg-gray-800 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-700 transition-colors border border-gray-700 text-center"
              >
                Learn More →
              </Link>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">Related Resources</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/nodejs-redaction" className="text-gray-300 hover:text-white underline">
                Node.js Redaction
              </Link>
              <Link href="/gdpr-redaction" className="text-gray-300 hover:text-white underline">
                GDPR Redaction
              </Link>
              <Link href="/hipaa-redaction" className="text-gray-300 hover:text-white underline">
                HIPAA Redaction
              </Link>
              <Link href="/blog/pii-detection-for-ai" className="text-gray-300 hover:text-white underline">
                PII Detection for AI
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

