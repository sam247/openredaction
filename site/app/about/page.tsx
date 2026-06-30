import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "About OpenRedaction | Open-Source PII Redaction",
  description:
    "Learn about OpenRedaction, an open-source PII detection and redaction library built with regex-first patterns.",
  path: "/about",
});

export default function About() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-[116px] pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight max-w-7xl mx-auto">
            About OpenRedaction
          </h1>

          <div className="prose prose-invert max-w-none space-y-6">
            <p className="text-xl text-gray-300">
              OpenRedaction is an open-source library for detecting and
              redacting personally identifiable information (PII) from text.
              Built with a regex-first approach, it provides fast,
              deterministic, and transparent PII detection.
            </p>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-gray-300">
                We believe that PII redaction should be open, transparent, and
                privacy-preserving. OpenRedaction gives you complete control
                over your data with self-hosting options, zero data retention,
                and fully auditable detection patterns.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>
                  500+ tested regex patterns for comprehensive PII detection
                </li>
                <li>Open-source and self-hostable for complete data control</li>
                <li>Zero data retention - all processing happens in memory</li>
                <li>Context-aware validation and checksum verification</li>
                <li>Fast, deterministic, and transparent detection</li>
                <li>GDPR, HIPAA, and CCPA compliant architecture</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Open Source</h2>
              <p className="text-gray-300">
                OpenRedaction is fully open source and available on GitHub. We
                welcome contributions from the community to improve pattern
                coverage, add new features, and enhance the library.
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
              <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
              <p className="text-gray-300 mb-4">
                Try OpenRedaction today with our free playground or install the
                library to get started.
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
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
