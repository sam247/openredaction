import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { defaultMetadata } from "@/lib/metadata";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://openredaction.com";
const pageUrl = `${siteUrl}/open-source-ai-redaction-tools`;
const title =
  "Open Source AI Redaction Tools (Self-Hosted Alternatives for PII)";
const description =
  "Compare open source and managed tools for redacting PII before sending data to AI APIs. Includes Node.js, Python and cloud-based options.";

export const metadata: Metadata = {
  ...defaultMetadata,
  title,
  description,
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    ...defaultMetadata.openGraph,
    url: pageUrl,
    title,
    description,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    ...defaultMetadata.twitter,
    title,
    description,
    images: [`${siteUrl}/og-image.png`],
  },
};

const tools = [
  {
    name: "OpenRedaction",
    stack: "Node.js",
    approach: "Regex",
    strength: "Simple local use",
    limitation: "Mostly structured PII",
    scenario:
      "Use when you want deterministic redaction in Node.js apps before OpenAI or other AI APIs.",
  },
  {
    name: "Microsoft Presidio",
    stack: "Python",
    approach: "NLP + Regex",
    strength: "Flexible detection",
    limitation: "More setup",
    scenario:
      "Use when your stack is Python and you want NLP-based detection with local control.",
  },
  {
    name: "AWS Comprehend",
    stack: "Cloud",
    approach: "ML",
    strength: "Managed service",
    limitation: "Data sent to AWS",
    scenario:
      "Use when managed infrastructure is fine and external processing is acceptable.",
  },
  {
    name: "Google DLP",
    stack: "Cloud",
    approach: "ML",
    strength: "Broad coverage",
    limitation: "External processing",
    scenario:
      "Use when you want a managed service with stronger coverage and do not need local execution.",
  },
] as const;

const comparisonRows = [
  ["OpenRedaction", "Open source", "Yes", "Regex", "Simple"],
  ["Presidio", "Open source", "Yes", "NLP + Regex", "Medium"],
  ["AWS Comprehend", "Managed", "No", "ML", "Easy"],
  ["Google DLP", "Managed", "No", "ML", "Easy"],
] as const;

export default function OpenSourceAiRedactionToolsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-[116px] pb-20">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
              Comparison page
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-balance">
              Open Source AI Redaction Tools (Self-Hosted Alternatives for PII)
            </h1>
            <p className="mt-5 text-lg text-gray-300 max-w-2xl">
              AI APIs can expose sensitive data if PII is still present in
              prompts, logs, or exports. Teams usually compare local tools,
              Python libraries, and managed cloud services before choosing a
              redaction path. OpenRedaction is our{" "}
              <Link
                href="/"
                className="underline underline-offset-4 hover:text-white"
              >
                open source redaction
              </Link>{" "}
              option for Node.js, and you can also read the{" "}
              <Link
                href="/pii-redaction"
                className="underline underline-offset-4 hover:text-white"
              >
                PII redaction
              </Link>{" "}
              guide for a shorter overview.
            </p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {tools.map((tool) => (
              <article
                key={tool.name}
                className="rounded-xl border border-gray-800 bg-gray-950 p-5 sm:p-6"
              >
                <h2 className="text-xl font-semibold">{tool.name}</h2>
                <div className="mt-3 space-y-2 text-sm text-gray-400">
                  <p>
                    <span className="text-gray-200">Stack:</span> {tool.stack}
                  </p>
                  <p>
                    <span className="text-gray-200">Approach:</span>{" "}
                    {tool.approach}
                  </p>
                  <p>
                    <span className="text-gray-200">Strength:</span>{" "}
                    {tool.strength}
                  </p>
                  <p>
                    <span className="text-gray-200">Limitation:</span>{" "}
                    {tool.limitation}
                  </p>
                </div>
                <p className="mt-4 text-sm text-gray-300 leading-6">
                  {tool.scenario}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="rounded-xl border border-gray-800 bg-gray-950 p-5 sm:p-6">
            <h2 className="text-2xl font-semibold">Quick comparison</h2>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left text-sm">
                <thead>
                  <tr className="text-gray-400">
                    <th className="border-b border-gray-800 px-4 py-3 font-medium">
                      Tool
                    </th>
                    <th className="border-b border-gray-800 px-4 py-3 font-medium">
                      Type
                    </th>
                    <th className="border-b border-gray-800 px-4 py-3 font-medium">
                      Local
                    </th>
                    <th className="border-b border-gray-800 px-4 py-3 font-medium">
                      Approach
                    </th>
                    <th className="border-b border-gray-800 px-4 py-3 font-medium">
                      Setup
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row[0]}>
                      {row.map((cell) => (
                        <td
                          key={cell}
                          className="border-b border-gray-900 px-4 py-3 text-gray-300"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-800 bg-gray-950 p-5 sm:p-6">
              <h2 className="text-2xl font-semibold">When to use each</h2>
              <ul className="mt-4 space-y-3 text-sm text-gray-300 leading-6">
                <li>
                  <span className="text-gray-100">OpenRedaction:</span> Node.js
                  apps, pre-processing before OpenAI, deterministic output.
                </li>
                <li>
                  <span className="text-gray-100">Presidio:</span> Python stack,
                  NLP detection, local execution.
                </li>
                <li>
                  <span className="text-gray-100">AWS / Google:</span> Managed
                  environments, external processing acceptable, less setup.
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-950 p-5 sm:p-6">
              <h2 className="text-2xl font-semibold">
                Example: redacting PII before sending to an API
              </h2>
              <div className="mt-4 rounded-lg border border-gray-800 bg-black p-4 text-sm text-gray-200">
                <div className="text-gray-400 mb-2">Input</div>
                <div className="font-mono">
                  Send this to john@email.com and call 555-123-4567
                </div>
              </div>
              <div className="mt-4 rounded-lg border border-gray-800 bg-black p-4 text-sm text-green-400">
                <div className="text-gray-400 mb-2">Output</div>
                <div className="font-mono">
                  Send this to [REDACTED] and call [REDACTED]
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-800 bg-gray-950 p-5 sm:p-6">
              <h2 className="text-2xl font-semibold">Self-hosted</h2>
              <ul className="mt-4 space-y-3 text-sm text-gray-300 leading-6">
                <li>Local control</li>
                <li>No external calls</li>
                <li>Predictable output</li>
              </ul>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-950 p-5 sm:p-6">
              <h2 className="text-2xl font-semibold">Managed</h2>
              <ul className="mt-4 space-y-3 text-sm text-gray-300 leading-6">
                <li>Less setup</li>
                <li>Vendor-managed infra</li>
                <li>External processing</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="rounded-xl border border-gray-800 bg-gray-950 p-5 sm:p-6">
            <h2 className="text-2xl font-semibold">
              Why open source redaction is growing
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-gray-300 leading-6">
              <li>AI apps increasing PII exposure</li>
              <li>Cost of usage-based APIs</li>
              <li>Need for predictable outputs</li>
              <li>Preference for local processing</li>
            </ul>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="rounded-xl border border-gray-800 bg-gray-950 p-6 sm:p-8">
            <p className="text-lg text-gray-200">Use it locally in your app.</p>
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <a
                href="https://github.com/sam247/openredaction"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-white px-5 py-3 font-medium text-black transition-colors hover:bg-gray-100"
              >
                View OpenRedaction on GitHub (open source)
              </a>
              <Link
                href="/docs/getting-started"
                className="inline-flex items-center justify-center rounded-md border border-gray-800 bg-gray-950 px-5 py-3 font-medium text-white transition-colors hover:bg-gray-900"
              >
                Install with npm
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
