import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';
import { Shield, Heart, FileText, Lock, CheckCircle2, Stethoscope } from 'lucide-react';

export const metadata: Metadata = generatePageMetadata({
  title: 'HIPAA Redaction - HIPAA Compliant PHI Detection & Redaction | OpenRedaction',
  description: 'HIPAA-compliant PHI redaction for healthcare organizations. Automatically detect and redact protected health information to meet HIPAA requirements. Self-hostable solution.',
  path: '/hipaa-redaction',
});

export default function HipaaRedaction() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-[116px] pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight max-w-7xl mx-auto">
              HIPAA-Compliant PHI Redaction
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Automatically detect and redact Protected Health Information (PHI) to meet HIPAA requirements. Open-source solution with built-in HIPAA presets for healthcare compliance.
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
              <Stethoscope className="text-white mr-4 mt-1 flex-shrink-0" size={32} />
              <div>
                <h2 className="text-3xl font-semibold mb-4">What is HIPAA?</h2>
                <p className="text-gray-300 mb-4">
                  The Health Insurance Portability and Accountability Act (HIPAA) is a US federal law that requires healthcare organizations to protect sensitive patient health information. 
                  HIPAA defines Protected Health Information (PHI) as any information that can identify a patient and relates to their health condition, treatment, or payment.
                </p>
                <p className="text-gray-300">
                  Healthcare organizations must implement safeguards to protect PHI and can face significant penalties for non-compliance.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex items-start">
                <Shield className="text-white mr-4 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h2 className="text-2xl font-semibold mb-3">HIPAA Preset</h2>
                  <p className="text-gray-300">
                    OpenRedaction includes a built-in HIPAA preset that detects all PHI types covered by HIPAA regulations, including patient names, medical record numbers, and more.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex items-start">
                <Lock className="text-white mr-4 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Self-Hosted Security</h2>
                  <p className="text-gray-300">
                    Deploy OpenRedaction on your own infrastructure for complete control over patient data. Zero data retention ensures no PHI leaves your environment.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex items-start">
                <Heart className="text-white mr-4 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Patient Privacy</h2>
                  <p className="text-gray-300">
                    Protect patient privacy by automatically redacting PHI from medical records, communications, and administrative documents before sharing or archiving.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex items-start">
                <FileText className="text-white mr-4 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Medical Records Processing</h2>
                  <p className="text-gray-300">
                    Process large volumes of medical records, discharge summaries, and clinical notes while ensuring all PHI is properly redacted.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 mb-12">
            <h2 className="text-3xl font-semibold mb-6">HIPAA PHI Types Detected</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <CheckCircle2 className="text-white inline mr-2" size={20} />
                <span className="text-gray-300">Patient names</span>
              </div>
              <div>
                <CheckCircle2 className="text-white inline mr-2" size={20} />
                <span className="text-gray-300">Medical record numbers</span>
              </div>
              <div>
                <CheckCircle2 className="text-white inline mr-2" size={20} />
                <span className="text-gray-300">Social Security Numbers</span>
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
                <span className="text-gray-300">Physical addresses</span>
              </div>
              <div>
                <CheckCircle2 className="text-white inline mr-2" size={20} />
                <span className="text-gray-300">Date of birth</span>
              </div>
              <div>
                <CheckCircle2 className="text-white inline mr-2" size={20} />
                <span className="text-gray-300">IP addresses</span>
              </div>
              <div>
                <CheckCircle2 className="text-white inline mr-2" size={20} />
                <span className="text-gray-300">Account numbers</span>
              </div>
              <div>
                <CheckCircle2 className="text-white inline mr-2" size={20} />
                <span className="text-gray-300">Health plan beneficiary numbers</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 mb-12">
            <h2 className="text-3xl font-semibold mb-6">Use Cases for HIPAA Redaction</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Medical Records Sharing</h3>
                <p className="text-gray-300">
                  Redact PHI from medical records before sharing with researchers, training programs, or administrative staff who don&apos;t need access to patient identifiers.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Discharge Summaries</h3>
                <p className="text-gray-300">
                  Automatically redact patient information from discharge summaries and clinical notes before archiving or using in analytics.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Patient Communications</h3>
                <p className="text-gray-300">
                  Remove PHI from patient communications, emails, and chat logs before storing in shared systems or using for training purposes.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Research & Analytics</h3>
                <p className="text-gray-300">
                  Prepare medical data for research and analytics by redacting PHI while preserving the clinical information needed for analysis.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
            <h2 className="text-3xl font-semibold mb-4">Get Started with HIPAA Redaction</h2>
            <p className="text-gray-300 mb-6">
              OpenRedaction&apos;s HIPAA preset helps healthcare organizations meet regulatory requirements. The open-source library can be self-hosted for complete control over patient data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/docs/getting-started"
                className="bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors text-center"
              >
                Installation Guide →
              </Link>
              <Link
                href="/use-cases/healthcare"
                className="bg-gray-800 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-700 transition-colors border border-gray-700 text-center"
              >
                Healthcare Use Cases →
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
              <Link href="/gdpr-redaction" className="text-gray-300 hover:text-white underline">
                GDPR Redaction
              </Link>
              <Link href="/use-cases/healthcare" className="text-gray-300 hover:text-white underline">
                Healthcare Use Cases
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

