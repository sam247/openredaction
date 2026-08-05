import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { TrackedDocsGettingStartedLink } from "@/components/TrackedLinks";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "How to Redact PII Before Sending Data to OpenAI (Node.js)",
  description:
    "Redact emails, names and sensitive data locally before OpenAI API calls. Node.js example using OpenRedaction’s detect() API.",
  path: "/redact-pii-before-openai",
});

export default function RedactPiiBeforeOpenAiPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-[116px] pb-20">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
              Developer guide
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-balance">
              How to Redact PII Before Sending Data to OpenAI (Node.js)
            </h1>
            <p className="mt-5 text-lg text-gray-300 max-w-2xl">
              OpenAI requests can expose PII if you pass raw user input through
              unchanged. Emails, names, and phone numbers should be sanitized
              locally before API calls—then send only the cleaned text onward.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-gray-400">
              <Link
                href="/pii-redaction"
                className="underline underline-offset-4 hover:text-white"
              >
                Full PII redaction guide
              </Link>
              <span className="text-gray-700">•</span>
              <Link
                href="/nodejs-redaction"
                className="underline underline-offset-4 hover:text-white"
              >
                Node.js redaction API
              </Link>
              <span className="text-gray-700">•</span>
              <TrackedDocsGettingStartedLink
                location="redact_before_openai_hero"
                className="underline underline-offset-4 hover:text-white"
              >
                Getting started
              </TrackedDocsGettingStartedLink>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-800 bg-gray-950 p-5 sm:p-6">
              <h2 className="text-2xl font-semibold">The Problem</h2>
              <p className="mt-3 text-sm uppercase tracking-[0.18em] text-gray-500">
                Example: sending raw input to OpenAI
              </p>
              <pre className="mt-4 overflow-x-auto rounded-lg border border-gray-800 bg-black p-4 text-sm leading-6 text-gray-200">
                {`const userInput = "Contact me at john@email.com";
await openai.chat.completions.create({
  model: "gpt-4.1-mini",
  messages: [{ role: "user", content: userInput }],
});`}
              </pre>
              <p className="mt-4 text-sm text-gray-300">
                This sends raw PII to an external API—and often into vendor
                logs.
              </p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-950 p-5 sm:p-6">
              <h2 className="text-2xl font-semibold">The Solution</h2>
              <p className="mt-4 text-lg text-gray-200 leading-relaxed">
                Run OpenRedaction in your process first. Call{" "}
                <code className="text-green-400">detect()</code>, pass{" "}
                <code className="text-green-400">result.redacted</code> to
                OpenAI, and keep any{" "}
                <code className="text-green-400">redactionMap</code> out of
                vendor traffic.
              </p>
              <p className="mt-4 text-sm text-gray-400">
                For gateways, RAG, citations, and telemetry layers, read the{" "}
                <Link
                  href="/pii-redaction"
                  className="text-white underline underline-offset-4"
                >
                  PII redaction for AI systems
                </Link>{" "}
                guide.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="rounded-xl border border-gray-800 bg-gray-950 p-5 sm:p-6">
            <h2 className="text-2xl font-semibold">Install OpenRedaction</h2>
            <p className="mt-3 text-gray-400">Install the library:</p>
            <pre className="mt-4 overflow-x-auto rounded-lg border border-gray-800 bg-black p-4 text-sm text-green-400">
              {`npm install openredaction openai`}
            </pre>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="rounded-xl border border-gray-800 bg-gray-950 p-5 sm:p-6">
            <h2 className="text-2xl font-semibold">Redact before sending</h2>
            <p className="mt-3 text-gray-400">
              <code className="text-gray-300">detect()</code> is async. Reuse
              one <code className="text-gray-300">OpenRedaction</code> instance
              across requests.
            </p>
            <pre className="mt-4 overflow-x-auto rounded-lg border border-gray-800 bg-black p-4 text-sm leading-6 text-gray-200">
              {`import OpenAI from "openai";
import { OpenRedaction } from "openredaction";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const redactor = new OpenRedaction({
  redactionMode: "placeholder",
  deterministic: true,
});

async function safeCompletion(userInput: string) {
  const { redacted } = await redactor.detect(userInput);

  return openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: redacted }],
  });
}

await safeCompletion("Contact me at john@email.com");`}
            </pre>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-800 bg-gray-950 p-5 sm:p-6">
              <h2 className="text-2xl font-semibold">Example output</h2>
              <div className="mt-4 space-y-4">
                <div className="rounded-lg border border-gray-800 bg-black p-4 text-sm text-gray-200">
                  <div className="text-gray-400 mb-2">Input</div>
                  <div className="font-mono">
                    Email me at jane@company.com and call 555-123-4567
                  </div>
                </div>
                <div className="rounded-lg border border-gray-800 bg-black p-4 text-sm text-green-400">
                  <div className="text-gray-400 mb-2">Sent to OpenAI</div>
                  <div className="font-mono">
                    Email me at [EMAIL_…] and call [PHONE_…]
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-950 p-5 sm:p-6">
              <h2 className="text-2xl font-semibold">Why this matters</h2>
              <ul className="mt-4 space-y-3 text-sm text-gray-300 leading-6">
                <li>Avoid sending raw user identifiers to external APIs</li>
                <li>Reduce compliance risk (GDPR, CCPA, sector rules)</li>
                <li>Keep prompts, vendor logs, and local traces cleaner</li>
                <li>Retain control over sensitive data in your process</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-800 bg-gray-950 p-5 sm:p-6">
              <h2 className="text-2xl font-semibold">Where to use this</h2>
              <ul className="mt-4 space-y-3 text-sm text-gray-300 leading-6">
                <li>Before OpenAI (or any LLM) API calls</li>
                <li>Before logging user input or tool payloads</li>
                <li>Before storing prompts, embeddings, or responses</li>
                <li>
                  At Express/gateway ingress — see{" "}
                  <Link
                    href="/nodejs-redaction"
                    className="text-white underline underline-offset-4"
                  >
                    Node.js redaction
                  </Link>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-950 p-5 sm:p-6">
              <h2 className="text-2xl font-semibold">Regex vs AI detection</h2>
              <p className="mt-4 text-sm text-gray-300 leading-6">
                Regex (plus validators) is fast and predictable for structured
                identifiers—emails, phones, cards, national IDs. NER or ML can
                help with messy free-text names. Most production stacks run
                local pattern redaction first, then optional NER. Details in the{" "}
                <Link
                  href="/pii-redaction#how-to-implement"
                  className="text-white underline underline-offset-4"
                >
                  implementation section
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="rounded-xl border border-gray-800 bg-gray-950 p-6 sm:p-8">
            <p className="text-lg text-gray-200">
              Use it locally in your app—then harden the rest of the pipeline.
            </p>
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <Link
                href="/pii-redaction"
                className="inline-flex items-center justify-center rounded-md bg-white px-5 py-3 font-medium text-black transition-colors hover:bg-gray-100"
              >
                Read the full PII redaction guide
              </Link>
              <TrackedDocsGettingStartedLink
                location="redact_before_openai_cta"
                className="inline-flex items-center justify-center rounded-md border border-gray-800 bg-gray-950 px-5 py-3 font-medium text-white transition-colors hover:bg-gray-900"
              >
                Install with npm
              </TrackedDocsGettingStartedLink>
              <Link
                href="/playground"
                className="inline-flex items-center justify-center rounded-md border border-gray-800 bg-gray-950 px-5 py-3 font-medium text-white transition-colors hover:bg-gray-900"
              >
                Try the playground
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
