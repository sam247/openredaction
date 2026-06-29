import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { generatePageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { DollarSign, Shield, Lock, FileText } from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title:
    "Finance Use Case - PII Redaction for Financial Documents | OpenRedaction",
  description:
    "Secure financial documents and customer communications with OpenRedaction. Protect sensitive financial data in banking and fintech applications.",
  path: "/use-cases/finance",
});

export default function FinanceUseCase() {
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
            Finance
          </h1>
          <p className="text-xl text-gray-300 mb-12">
            Secure financial documents and customer communications
          </p>

          <div className="space-y-8 mb-12">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex items-start">
                <DollarSign
                  className="text-white mr-4 mt-1 flex-shrink-0"
                  size={24}
                />
                <div>
                  <h2 className="text-2xl font-semibold mb-3">
                    Financial Data Protection
                  </h2>
                  <p className="text-gray-300">
                    Automatically detect and redact account numbers, credit card
                    information, social security numbers, and other sensitive
                    financial data from documents and communications.
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
                    Regulatory Compliance
                  </h2>
                  <p className="text-gray-300">
                    Meet PCI DSS, GDPR, and other financial regulations by
                    ensuring sensitive customer data is properly redacted before
                    sharing or archiving financial documents.
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
                    Customer Communications
                  </h2>
                  <p className="text-gray-300">
                    Process customer support tickets, email communications, and
                    financial statements while ensuring all PII is properly
                    redacted for internal reviews or external sharing.
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
                    Banking-Grade Security
                  </h2>
                  <p className="text-gray-300">
                    Self-host OpenRedaction on your own infrastructure for
                    complete control over sensitive financial data. Zero data
                    retention ensures no customer information leaves your
                    environment.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
            <p className="text-gray-300 mb-4">
              Start securing financial documents today with OpenRedaction.
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
