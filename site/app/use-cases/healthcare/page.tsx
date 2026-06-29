import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { generatePageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { Shield, Heart, FileText, Lock } from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title:
    "Healthcare Use Case - PII Redaction for Medical Records | OpenRedaction",
  description:
    "Protect patient data in medical records and communications with OpenRedaction. HIPAA-compliant PII redaction for healthcare organizations.",
  path: "/use-cases/healthcare",
});

export default function HealthcareUseCase() {
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
            Healthcare
          </h1>
          <p className="text-xl text-gray-300 mb-12">
            Protect patient data in medical records and communications
          </p>

          <div className="space-y-8 mb-12">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex items-start">
                <Shield
                  className="text-white mr-4 mt-1 flex-shrink-0"
                  size={24}
                />
                <div>
                  <h2 className="text-2xl font-semibold mb-3">
                    HIPAA Compliance
                  </h2>
                  <p className="text-gray-300">
                    OpenRedaction helps healthcare organizations meet HIPAA
                    requirements by automatically detecting and redacting
                    protected health information (PHI) from medical records,
                    patient communications, and administrative documents.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex items-start">
                <Heart
                  className="text-white mr-4 mt-1 flex-shrink-0"
                  size={24}
                />
                <div>
                  <h2 className="text-2xl font-semibold mb-3">
                    Patient Privacy Protection
                  </h2>
                  <p className="text-gray-300">
                    Safeguard patient names, medical record numbers, social
                    security numbers, and other sensitive identifiers when
                    sharing medical records for research, training, or
                    administrative purposes.
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
                    Medical Records Processing
                  </h2>
                  <p className="text-gray-300">
                    Process large volumes of medical records, discharge
                    summaries, and clinical notes while ensuring all PHI is
                    properly redacted before sharing or archiving.
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
                    Self-Hosted Security
                  </h2>
                  <p className="text-gray-300">
                    Deploy OpenRedaction on your own infrastructure for complete
                    control over patient data. Zero data retention ensures no
                    PHI leaves your environment.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
            <p className="text-gray-300 mb-4">
              Start protecting patient data today with OpenRedaction&apos;s
              open-source library.
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
