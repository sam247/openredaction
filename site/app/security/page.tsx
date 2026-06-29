import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { generatePageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { Shield, Lock, Eye, Key } from "lucide-react";

export const metadata: Metadata = generatePageMetadata({
  title: "Security - OpenRedaction Security Practices | OpenRedaction",
  description:
    "Learn about OpenRedaction security practices, zero data retention, self-hosting options, and privacy-preserving architecture.",
  path: "/security",
});

export default function Security() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-[116px] pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight max-w-7xl mx-auto">
            Security
          </h1>

          <div className="prose prose-invert max-w-none space-y-8">
            <p className="text-xl text-gray-300">
              Security and privacy are fundamental to OpenRedaction. Our
              architecture is designed to minimize data risk and give you
              complete control over your sensitive information.
            </p>

            <section className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex items-start">
                <Lock
                  className="text-white mr-4 mt-1 flex-shrink-0"
                  size={24}
                />
                <div>
                  <h2 className="text-2xl font-semibold mb-3">
                    Zero Data Retention
                  </h2>
                  <p className="text-gray-300">
                    When self-hosted, OpenRedaction processes all text in memory
                    and never persists it to disk or databases. Your data is
                    processed and immediately discarded - we store nothing.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex items-start">
                <Shield
                  className="text-white mr-4 mt-1 flex-shrink-0"
                  size={24}
                />
                <div>
                  <h2 className="text-2xl font-semibold mb-3">
                    Self-Hosted Control
                  </h2>
                  <p className="text-gray-300">
                    Deploy OpenRedaction on your own infrastructure for complete
                    control over your data. Your sensitive information never
                    leaves your environment, ensuring maximum security and
                    compliance.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex items-start">
                <Eye className="text-white mr-4 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h2 className="text-2xl font-semibold mb-3">
                    Transparent Detection
                  </h2>
                  <p className="text-gray-300">
                    All regex patterns are open source and fully auditable. You
                    can review, test, and verify every detection pattern. No
                    black box AI - complete transparency in how PII is detected.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex items-start">
                <Key className="text-white mr-4 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h2 className="text-2xl font-semibold mb-3">
                    Library & self-hosted deployments
                  </h2>
                  <p className="text-gray-300">
                    The npm library runs in your process: text is handled in
                    memory according to your code. If you expose an HTTP API
                    yourself, apply your own authentication, rate limiting, and
                    logging policies. See our{" "}
                    <Link
                      href="/privacy"
                      className="text-white hover:text-gray-300 underline"
                    >
                      Privacy Policy
                    </Link>{" "}
                    for how we handle data on this website.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Security Best Practices
              </h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Self-host for maximum security and data control</li>
                <li>Review and audit all regex patterns before deployment</li>
                <li>
                  Store any third-party credentials securely (e.g. environment
                  variables) when integrating with external services
                </li>
                <li>Monitor and log access to sensitive data processing</li>
                <li>
                  Keep the library updated with the latest security patches
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Reporting Security Issues
              </h2>
              <p className="text-gray-300">
                If you discover a security vulnerability, please report it
                responsibly. Open an issue on GitHub or contact us through our{" "}
                <Link
                  href="/contact"
                  className="text-white hover:text-gray-300 underline"
                >
                  contact page
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
