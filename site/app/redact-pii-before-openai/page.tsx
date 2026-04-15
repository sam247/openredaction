import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'How to Redact PII Before Sending Data to OpenAI (Node.js)',
  description:
    'Redact emails, names and sensitive data before sending requests to OpenAI. Simple Node.js example using an open source redaction library.',
  path: '/redact-pii-before-openai',
});

export default function RedactPiiBeforeOpenAiPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-[116px] pb-20">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Developer guide</p>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-balance">
              How to Redact PII Before Sending Data to OpenAI (Node.js)
            </h1>
            <p className="mt-5 text-lg text-gray-300 max-w-2xl">
              OpenAI requests can expose PII if you pass raw user input through unchanged. Emails, names, and phone
              numbers should be sanitized before API calls. Use a local redaction step first, then send the cleaned
              text onward.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-gray-400">
              <Link href="/pii-redaction" className="underline underline-offset-4 hover:text-white">
                PII redaction
              </Link>
              <span className="text-gray-700">•</span>
              <Link href="/" className="underline underline-offset-4 hover:text-white">
                open source redaction
              </Link>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-800 bg-gray-950 p-5 sm:p-6">
              <h2 className="text-2xl font-semibold">The Problem</h2>
              <p className="mt-3 text-sm uppercase tracking-[0.18em] text-gray-500">
                Example: sending raw input to OpenAI
              </p>
              <pre className="mt-4 overflow-x-auto rounded-lg border border-gray-800 bg-black p-4 text-sm leading-6 text-gray-200">
{`const userInput = "Contact me at john@email.com";
await openai.chat.completions.create({
  messages: [{ role: "user", content: userInput }]
});`}
              </pre>
              <p className="mt-4 text-sm text-gray-300">This sends raw PII to an external API.</p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-950 p-5 sm:p-6">
              <h2 className="text-2xl font-semibold">The Solution</h2>
              <p className="mt-4 text-lg text-gray-200">Redact sensitive data before sending it to OpenAI.</p>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="rounded-xl border border-gray-800 bg-gray-950 p-5 sm:p-6">
            <h2 className="text-2xl font-semibold">Install OpenRedaction</h2>
            <p className="mt-3 text-gray-400">Install the library:</p>
            <pre className="mt-4 overflow-x-auto rounded-lg border border-gray-800 bg-black p-4 text-sm text-green-400">
{`npm install openredaction`}
            </pre>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="rounded-xl border border-gray-800 bg-gray-950 p-5 sm:p-6">
            <h2 className="text-2xl font-semibold">Redact Before Sending</h2>
            <p className="mt-3 text-gray-400">Redact the input before sending it:</p>
            <pre className="mt-4 overflow-x-auto rounded-lg border border-gray-800 bg-black p-4 text-sm leading-6 text-gray-200">
{`import OpenAI from "openai";
import { redact } from "openredaction";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const userInput = "Contact me at john@email.com";
const { redactedText } = redact(userInput);

const response = await openai.chat.completions.create({
  messages: [{ role: "user", content: redactedText }]
});`}
            </pre>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-800 bg-gray-950 p-5 sm:p-6">
              <h2 className="text-2xl font-semibold">Example output:</h2>
              <div className="mt-4 space-y-4">
                <div className="rounded-lg border border-gray-800 bg-black p-4 text-sm text-gray-200">
                  <div className="text-gray-400 mb-2">Input</div>
                  <div className="font-mono">
                    Email me at jane@company.com and call 555-123-4567
                  </div>
                </div>
                <div className="rounded-lg border border-gray-800 bg-black p-4 text-sm text-green-400">
                  <div className="text-gray-400 mb-2">Output</div>
                  <div className="font-mono">
                    Email me at [REDACTED] and call [REDACTED]
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-950 p-5 sm:p-6">
              <h2 className="text-2xl font-semibold">Why this matters</h2>
              <ul className="mt-4 space-y-3 text-sm text-gray-300 leading-6">
                <li>Avoid sending user data to external APIs</li>
                <li>Reduce compliance risk (GDPR, etc.)</li>
                <li>Keep logs and prompts clean</li>
                <li>Maintain control over sensitive data</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-800 bg-gray-950 p-5 sm:p-6">
              <h2 className="text-2xl font-semibold">Where to use this</h2>
              <ul className="mt-4 space-y-3 text-sm text-gray-300 leading-6">
                <li>Before OpenAI API calls</li>
                <li>Before logging user input</li>
                <li>Before storing prompts or responses</li>
              </ul>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-950 p-5 sm:p-6">
              <h2 className="text-2xl font-semibold">Regex vs AI</h2>
              <p className="mt-4 text-sm text-gray-300 leading-6">
                Regex is fast and predictable for known patterns.
                <br />
                AI can help with messy text.
                <br />
                Many systems use regex first, then AI if needed.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
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
