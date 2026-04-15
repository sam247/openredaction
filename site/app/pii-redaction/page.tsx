import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { generatePageMetadata } from '@/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'PII Redaction (Open Source, Self-Hosted Node.js Library)',
  description:
    'Redact emails, names and sensitive data before sending to APIs or storing logs. Open-source PII redaction for Node.js. No API calls, runs locally.',
  path: '/pii-redaction',
});

const comparisonRows = [
  ['Runs locally', 'Cloud'],
  ['No data leaves system', 'Sent externally'],
  ['Deterministic (regex)', 'ML-based'],
  ['Free / open source', 'Usage pricing'],
  ['Fully auditable', 'Limited visibility'],
] as const;

export default function PiiRedactionPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-[116px] pb-20">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">PII redaction</p>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-balance">
              PII Redaction (Open Source, Self-Hosted)
            </h1>
            <p className="mt-5 text-lg text-gray-300 max-w-2xl">
              PII redaction removes emails, names, phone numbers, card data, and other sensitive text from input
              before you store it or send it elsewhere. Use it on AI APIs, production logs, and exported data.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-gray-400">
              <Link href="/docs/getting-started" className="underline underline-offset-4 hover:text-white">
                Start with the Node.js docs
              </Link>
              <span className="text-gray-700">•</span>
              <Link href="/nodejs-redaction" className="underline underline-offset-4 hover:text-white">
                Node.js redaction guide
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-xl border border-gray-800 bg-gray-950 p-5 sm:p-6">
              <h2 className="text-xl font-medium">Why PII redaction matters</h2>
              <ul className="mt-4 space-y-3 text-gray-300 text-sm leading-6">
                <li>Prevent leaking sensitive data to AI APIs</li>
                <li>Reduce GDPR and compliance risk</li>
                <li>Keep logs and datasets safe</li>
                <li>Avoid sending user data to third-party services</li>
              </ul>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-950 p-5 sm:p-6">
              <div className="text-sm uppercase tracking-[0.18em] text-gray-500">Example</div>
              <div className="mt-4 rounded-lg border border-gray-800 bg-black p-4 text-sm text-gray-200 leading-7">
                <div className="font-medium text-gray-400 mb-3">Input</div>
                <div className="font-mono">
                  My name is John, email john@email.com, phone 555-123-4567, card 4111 1111 1111 1111
                </div>
              </div>
              <div className="mt-4 rounded-lg border border-gray-800 bg-black p-4 text-sm text-green-400 leading-7">
                <div className="font-medium text-gray-400 mb-3">Example output</div>
                <div className="font-mono">
                  My name is [REDACTED], email [REDACTED], phone [REDACTED], card [REDACTED]
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="rounded-xl border border-gray-800 bg-gray-950 p-5 sm:p-6">
            <h2 className="text-2xl font-semibold">PII redaction in Node.js</h2>
            <p className="mt-3 text-gray-400">Install and use in a Node.js app:</p>
            <div className="mt-4 rounded-lg border border-gray-800 bg-black px-4 py-3 font-mono text-sm text-green-400">
              npm install openredaction
            </div>
            <pre className="mt-4 overflow-x-auto rounded-lg border border-gray-800 bg-black p-4 text-sm leading-6 text-gray-200">
{`import { redact } from "openredaction";

const input = "Contact me at jane@company.com";
const { redactedText } = redact(input);

console.log(redactedText);`}
            </pre>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="rounded-xl border border-gray-800 bg-gray-950 p-5 sm:p-6">
            <h2 className="text-2xl font-semibold">Features</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 text-sm text-gray-300">
              <li className="rounded-lg border border-gray-800 bg-black px-4 py-3">Runs locally</li>
              <li className="rounded-lg border border-gray-800 bg-black px-4 py-3">500+ built-in regex patterns</li>
              <li className="rounded-lg border border-gray-800 bg-black px-4 py-3">Deterministic output</li>
              <li className="rounded-lg border border-gray-800 bg-black px-4 py-3">Fast for inline use</li>
              <li className="rounded-lg border border-gray-800 bg-black px-4 py-3">Open source and self-hosted</li>
            </ul>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="rounded-xl border border-gray-800 bg-gray-950 p-5 sm:p-6">
            <h2 className="text-2xl font-semibold">Open source vs managed redaction</h2>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[640px] border-separate border-spacing-0 text-left text-sm">
                <thead>
                  <tr className="text-gray-400">
                    <th className="border-b border-gray-800 px-4 py-3 font-medium">OpenRedaction</th>
                    <th className="border-b border-gray-800 px-4 py-3 font-medium">AWS / Google DLP</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map(([left, right]) => (
                    <tr key={left}>
                      <td className="border-b border-gray-900 px-4 py-3">{left}</td>
                      <td className="border-b border-gray-900 px-4 py-3 text-gray-400">{right}</td>
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
              <h2 className="text-2xl font-semibold">Use cases</h2>
              <ul className="mt-4 space-y-3 text-sm text-gray-300 leading-6">
                <li>Redact user input before sending to OpenAI</li>
                <li>Sanitise production logs</li>
                <li>Clean exported customer datasets</li>
                <li>Process form submissions safely</li>
              </ul>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-950 p-5 sm:p-6">
              <h2 className="text-2xl font-semibold">Regex vs AI</h2>
              <p className="mt-4 text-sm text-gray-300 leading-6">
                Regex is fast and predictable for known patterns.
                <br />
                AI can help with messy or unstructured text.
                <br />
                Many teams use regex first, then AI if they need it.
              </p>
            </div>
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
                View on GitHub (open source)
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
