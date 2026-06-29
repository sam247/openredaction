import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WordPressWaitlistTrigger from "@/components/WordPressWaitlistTrigger";
import Link from "next/link";
import { Check } from "lucide-react";
import { generatePageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata({
  title: "Enterprise Support - OpenRedaction",
  description:
    "Contact OpenRedaction for enterprise support, custom deployments, SLAs, and self-hosted PII redaction at scale.",
  path: "/pricing",
});

export default function Pricing() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-[148px] pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight max-w-7xl mx-auto">
              Enterprise Support
            </h1>
            <p className="text-xl text-gray-300">
              OpenRedaction is open source and self-hostable. For custom
              deployments, SLAs, or dedicated support at scale, get in touch.
            </p>
          </div>

          <div className="max-w-3xl mx-auto mb-16">
            <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
              <h2 className="text-2xl font-bold mb-6">What we offer</h2>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Check
                    className="text-green-400 mr-3 mt-1 flex-shrink-0"
                    size={20}
                  />
                  <span className="text-gray-300">
                    Enterprise support and custom deployment guidance
                  </span>
                </li>
                <li className="flex items-start">
                  <Check
                    className="text-green-400 mr-3 mt-1 flex-shrink-0"
                    size={20}
                  />
                  <span className="text-gray-300">
                    SLAs and dedicated support for high-volume or regulated
                    environments
                  </span>
                </li>
                <li className="flex items-start">
                  <Check
                    className="text-green-400 mr-3 mt-1 flex-shrink-0"
                    size={20}
                  />
                  <span className="text-gray-300">
                    Integration and architecture advice for self-hosted PII
                    redaction
                  </span>
                </li>
                <li className="flex items-start">
                  <Check
                    className="text-green-400 mr-3 mt-1 flex-shrink-0"
                    size={20}
                  />
                  <span className="text-gray-300">
                    Training and compliance best practices
                  </span>
                </li>
              </ul>

              <Link
                href="/contact"
                className="block w-full bg-white text-black px-6 py-4 rounded-md font-semibold hover:bg-gray-100 transition-colors text-center"
              >
                Contact us
              </Link>
            </div>

            <div className="mt-8 rounded-lg border border-gray-800 bg-gray-950/40 p-6 text-left">
              <h3 className="text-lg font-semibold text-white mb-2">
                WordPress
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                A plugin for redacting sensitive data in forms and comments is
                exploratory. Join the waitlist for updates — no obligation.
              </p>
              <WordPressWaitlistTrigger
                source="pricing"
                triggerLabel="Join WordPress plugin waitlist"
              />
            </div>
          </div>

          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-400 text-sm">
              The OpenRedaction library is free and open source. Use it locally
              or self-host with no fees. Enterprise support is optional and
              tailored to your needs.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
