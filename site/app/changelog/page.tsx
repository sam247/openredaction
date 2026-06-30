import { Calendar, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import WordPressWaitlistTrigger from "@/components/WordPressWaitlistTrigger";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Changelog | OpenRedaction",
  description:
    "Recent updates, versions, and improvements to OpenRedaction. Track new features, bug fixes, and enhancements.",
  path: "/changelog",
});

const changelogEntries = [
  {
    date: "2026-03-19",
    version: "1.1.2",
    title: "OpenRedaction 1.1.2",
    changes: [
      "API server: correct HTTP method/path routing; enforce configurable request body size limits",
      "Build: worker bundle for WorkerPool; streaming detector compatible with Node Readable streams",
      "Detection: hosted AI assist removed from the library; false-positive filter on by default; NER-only entities merged when NER is enabled",
      "Validators: SWIFT/BIC, Canadian SIN (Luhn), Australian TFN; compliance presets: pci-dss, soc2",
      "Security / bundle shape: `APIServer` and `PrometheusServer` live under `openredaction/server` so the main entry does not reference `node:http`",
      "Tests: Express middleware, JSON/CSV processors, LocalLearningStore, server entry smoke tests",
      "CI: GitHub Release created automatically when a version tag successfully publishes to npm",
      "Package metadata: repository, bugs, homepage on npm",
    ],
  },
  {
    date: "2026-03-19",
    version: "1.0.10",
    title: "Library: npm README — no AI-assist section",
    changes: [
      "npm package README focuses on local regex-first usage; removed optional hosted-AI configuration block",
      "Advanced integration options stay documented on the site and GitHub repo README",
    ],
  },
  {
    date: "2026-03-19",
    version: "1.0.9",
    title: "Library: npm README and docs sync",
    changes: [
      "npm README: `detect()` is async (`await`); links to openredaction.com and GitHub",
      "Use 1.0.9 on npm if you hit “cannot republish” on 1.0.8 — registries never allow the same version twice",
    ],
  },
  {
    date: "2025-03-01",
    version: "1.2.0",
    title: "Focus on open source and enterprise support",
    changes: [
      "OpenRedaction is now offered as open-source library and self-hosted only; no hosted API or Pro tier",
      "Enterprise support and custom deployments available via contact",
      "Pricing page replaced with Enterprise support (contact us)",
      "Documentation and playground updated for library-only use",
    ],
  },
  {
    date: "2025-01-10",
    version: "1.0.0",
    title: "Initial Release",
    changes: [
      "Open-source regex-based PII detection library",
      "500+ tested patterns for emails, phones, SSNs, addresses, credit cards",
      "Support for GDPR, HIPAA, and CCPA presets",
      "Self-hostable with npm installation",
      "Interactive playground for testing",
      "Comprehensive documentation",
    ],
  },
];

export default function Changelog() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-[116px] pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight max-w-7xl mx-auto">
              Changelog
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Track updates, new features, and improvements to OpenRedaction
            </p>
          </div>

          <div className="space-y-8">
            {changelogEntries.map((entry, index) => (
              <div
                key={index}
                className="bg-gray-900 rounded-lg p-6 border border-gray-800"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-semibold">{entry.title}</h2>
                      <span className="text-sm bg-gray-800 px-2 py-1 rounded text-gray-400">
                        v{entry.version}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Calendar size={14} className="mr-2" />
                      {new Date(entry.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>
                <ul className="space-y-2">
                  {entry.changes.map((change, changeIndex) => (
                    <li
                      key={changeIndex}
                      className="flex items-start text-gray-300"
                    >
                      <span className="text-green-400 mr-2">•</span>
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-6 text-center">
            <Link
              href="https://www.npmjs.com/package/openredaction"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
            >
              npm package
              <ExternalLink size={16} />
            </Link>
            <Link
              href="https://github.com/sam247/openredaction/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
            >
              GitHub releases
              <ExternalLink size={16} />
            </Link>
          </div>

          <div className="mt-12 max-w-xl mx-auto text-center border-t border-gray-800 pt-10">
            <p className="text-gray-400 text-sm mb-4">
              Interested in a future WordPress plugin for UGC redaction? Join
              the waitlist for updates.
            </p>
            <div className="flex justify-center">
              <WordPressWaitlistTrigger
                source="changelog"
                triggerLabel="WordPress plugin waitlist"
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
