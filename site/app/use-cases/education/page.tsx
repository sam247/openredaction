import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { generatePageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { GraduationCap, Shield, Lock, FileText } from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title:
    "Education Use Case - PII Redaction for Student Records | OpenRedaction",
  description:
    "Protect student privacy in educational records with OpenRedaction. FERPA-compliant PII redaction for schools and universities.",
  path: "/use-cases/education",
});

export default function EducationUseCase() {
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
            Education
          </h1>
          <p className="text-xl text-gray-300 mb-12">
            Protect student privacy in educational records
          </p>

          <div className="space-y-8 mb-12">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex items-start">
                <GraduationCap
                  className="text-white mr-4 mt-1 flex-shrink-0"
                  size={24}
                />
                <div>
                  <h2 className="text-2xl font-semibold mb-3">
                    FERPA Compliance
                  </h2>
                  <p className="text-gray-300">
                    Help educational institutions meet FERPA requirements by
                    automatically detecting and redacting student names, ID
                    numbers, and other personally identifiable information from
                    educational records.
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
                    Student Record Protection
                  </h2>
                  <p className="text-gray-300">
                    Safeguard student information when sharing educational
                    records for research, training, or administrative purposes.
                    Protect student names, addresses, and social security
                    numbers.
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
                    Academic Document Processing
                  </h2>
                  <p className="text-gray-300">
                    Process transcripts, grade reports, disciplinary records,
                    and other academic documents while ensuring all student PII
                    is properly redacted before sharing or archiving.
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
                    Campus Data Security
                  </h2>
                  <p className="text-gray-300">
                    Deploy OpenRedaction on your campus infrastructure for
                    complete control over student data. Zero data retention
                    ensures no student information leaves your environment.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
            <p className="text-gray-300 mb-4">
              Start protecting student privacy today with OpenRedaction.
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
