import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { generatePageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { Scale, FileText, Lock, Shield } from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "Legal Use Case - PII Redaction for Legal Documents | OpenRedaction",
  description:
    "Redact sensitive information from legal documents with OpenRedaction. Protect client data in contracts, filings, and legal communications.",
  path: "/use-cases/legal",
});

export default function LegalUseCase() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-[116px] pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8"
          >
            ← Back to Home
          </Link>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight max-w-7xl mx-auto">
            Legal
          </h1>
          <p className="text-xl text-gray-300 mb-12">
            Redact sensitive information from legal documents
          </p>

          <div className="space-y-8 mb-12">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex items-start">
                <Scale
                  className="text-white mr-4 mt-1 flex-shrink-0"
                  size={24}
                />
                <div>
                  <h2 className="text-2xl font-semibold mb-3">
                    Legal Document Redaction
                  </h2>
                  <p className="text-gray-300">
                    Automatically detect and redact sensitive information from
                    contracts, court filings, depositions, and other legal
                    documents before sharing or publishing.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex items-start">
                <FileText
                  className="text-white mr-4 mt-1 flex-shrink-0"
                  size={24}
                />
                <div>
                  <h2 className="text-2xl font-semibold mb-3">
                    Client Confidentiality
                  </h2>
                  <p className="text-gray-300">
                    Protect client names, addresses, social security numbers,
                    and financial information when preparing documents for
                    public filing or third-party review.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex items-start">
                <Shield
                  className="text-white mr-4 mt-1 flex-shrink-0"
                  size={24}
                />
                <div>
                  <h2 className="text-2xl font-semibold mb-3">
                    Compliance & Privacy
                  </h2>
                  <p className="text-gray-300">
                    Meet legal and regulatory requirements for data protection
                    while maintaining transparency in your redaction process.
                    Audit-friendly pattern-based detection.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex items-start">
                <Lock
                  className="text-white mr-4 mt-1 flex-shrink-0"
                  size={24}
                />
                <div>
                  <h2 className="text-2xl font-semibold mb-3">
                    Self-Hosted Control
                  </h2>
                  <p className="text-gray-300">
                    Deploy on your own infrastructure for complete control over
                    sensitive legal documents. No data leaves your environment,
                    ensuring attorney-client privilege.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
            <p className="text-gray-300 mb-4">
              Start protecting sensitive legal information today with
              OpenRedaction.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/playground"
                className="bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors text-center"
              >
                Try Playground
              </Link>
              <Link
                href="/pricing"
                className="bg-gray-800 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-700 transition-colors border border-gray-700 text-center"
              >
                Enterprise support
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
