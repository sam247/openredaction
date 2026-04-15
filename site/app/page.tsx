import Link from 'next/link';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { generatePageMetadata } from '@/lib/metadata';
import { ArrowRight, Check, Shield, Zap, Code2, GitBranch, Lock } from 'lucide-react';

export const metadata: Metadata = generatePageMetadata({
  title: 'OpenRedaction | Open-source PII redaction for Node.js',
  description:
    'Redact PII locally in Node.js with 500+ regex patterns. No API calls. No data leaves your system.',
  path: '/',
});

const comparisonRows = [
  ['Runs locally', 'Cloud service'],
  ['No API calls', 'Sends data externally'],
  ['Deterministic (regex)', 'ML-based'],
  ['Open source', 'Closed'],
  ['Self-hosted', 'Vendor managed'],
] as const;

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-[116px] pb-20">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-800 bg-gray-950 px-3 py-1 text-xs text-gray-400">
              <Lock size={14} />
              Open-source PII redaction for Node.js
            </div>

            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-balance">
              Redact PII in Node.js before it leaves your app.
            </h1>

            <p className="mt-5 text-lg sm:text-xl text-gray-300 max-w-2xl">
              Run it locally. No API calls. No data leaves your system.
            </p>
            <p className="mt-4 text-sm text-gray-400">
              Need <Link href="/pii-redaction" className="underline underline-offset-4 hover:text-white">PII redaction</Link>?
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Compare <Link href="/open-source-ai-redaction-tools" className="underline underline-offset-4 hover:text-white">open source AI redaction tools</Link>.
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Before OpenAI calls, see <Link href="/redact-pii-before-openai" className="underline underline-offset-4 hover:text-white">redact pii before openai</Link>.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href="https://github.com/sam247/openredaction"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-5 py-3 font-medium text-black transition-colors hover:bg-gray-100"
              >
                View on GitHub
                <ArrowRight size={16} />
              </a>
              <Link
                href="/docs/getting-started"
                className="inline-flex items-center justify-center rounded-md border border-gray-800 bg-gray-950 px-5 py-3 font-medium text-white transition-colors hover:bg-gray-900"
              >
                Get Started
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-xl border border-gray-800 bg-gray-950 p-5 sm:p-6">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Code2 size={16} />
                Before / after
              </div>
              <pre className="mt-4 overflow-x-auto rounded-lg border border-gray-800 bg-black p-4 text-sm leading-6 text-gray-200">
{`import { redact } from "openredaction";

const input = "Email me at alice@company.com and call 555-123-4567.";
const { redactedText } = redact(input);

console.log(redactedText);
// Email me at [REDACTED] and call [REDACTED].`}
              </pre>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-950 p-5 sm:p-6">
              <h2 className="text-lg font-medium">Quick usage</h2>
              <p className="mt-2 text-sm text-gray-400">
                Install it, import it, and redact before you send anything to an API.
              </p>
              <div className="mt-5 rounded-lg border border-gray-800 bg-black px-4 py-3 font-mono text-sm text-green-400">
                npm install openredaction
              </div>
              <pre className="mt-4 overflow-x-auto rounded-lg border border-gray-800 bg-black p-4 text-sm leading-6 text-gray-200">
{`import { redact } from "openredaction";

const text = "Patient: Sarah Lee, SSN 123-45-6789";
const { redactedText } = redact(text);

console.log(redactedText);`}
              </pre>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="rounded-xl border border-gray-800 bg-gray-950 p-5 sm:p-6">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <GitBranch size={16} />
              Trust
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-gray-800 bg-black p-4">
                <div className="text-2xl font-semibold">GitHub stars: 100+</div>
                <div className="mt-2 text-sm text-gray-400">Placeholder until the repo count is updated.</div>
              </div>
              <div className="rounded-lg border border-gray-800 bg-black p-4">
                <div className="text-sm text-white">“Using this before OpenAI calls to strip emails and names.”</div>
              </div>
              <div className="rounded-lg border border-gray-800 bg-black p-4">
                <div className="text-sm text-white">“Dropped into our logging pipeline — works well.”</div>
              </div>
              <div className="rounded-lg border border-gray-800 bg-black p-4 md:col-span-2">
                <div className="text-sm text-white">“Nice to have something deterministic instead of guessing.”</div>
              </div>
              <div className="rounded-lg border border-gray-800 bg-black p-4">
                <div className="text-sm text-white">Actively maintained. No external dependencies.</div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] items-start">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
                Use case: prevent leaking PII to AI APIs
              </p>
              <h2 className="mt-3 text-3xl font-semibold">Redact data before you send it to a model.</h2>
              <p className="mt-3 text-gray-400 max-w-xl">
                Keep emails, names, phone numbers, SSNs, and payment details out of prompts and logs.
              </p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-950 p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-gray-500">Input</div>
                  <div className="mt-2 rounded-lg border border-gray-800 bg-black p-4 text-sm text-gray-200">
                    Send the order to jane.doe@company.com and use card 4111 1111 1111 1111.
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-gray-500">Output</div>
                  <div className="mt-2 rounded-lg border border-gray-800 bg-black p-4 text-sm text-green-400">
                    Send the order to [REDACTED] and use card [REDACTED].
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-gray-800 bg-gray-950 p-5">
              <Shield className="text-white" size={20} />
              <div className="mt-3 font-medium">Runs locally</div>
              <p className="mt-2 text-sm text-gray-400">No data leaves your system.</p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-950 p-5">
              <Check className="text-white" size={20} />
              <div className="mt-3 font-medium">Deterministic</div>
              <p className="mt-2 text-sm text-gray-400">Regex patterns you can inspect.</p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-950 p-5">
              <Zap className="text-white" size={20} />
              <div className="mt-3 font-medium">Fast</div>
              <p className="mt-2 text-sm text-gray-400">Designed for inline use.</p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-950 p-5">
              <Code2 className="text-white" size={20} />
              <div className="mt-3 font-medium">Open source</div>
              <p className="mt-2 text-sm text-gray-400">Self-hosted and auditable.</p>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="rounded-xl border border-gray-800 bg-gray-950 p-5 sm:p-6">
            <h2 className="text-2xl font-semibold">OpenRedaction vs AWS / Google DLP</h2>
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
          <div className="rounded-xl border border-gray-800 bg-gray-950 p-6 sm:p-8">
            <p className="text-lg text-gray-200">Ready to use locally in your app.</p>
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <Link
                href="/docs/getting-started"
                className="inline-flex items-center justify-center rounded-md bg-white px-5 py-3 font-medium text-black transition-colors hover:bg-gray-100"
              >
                Install
              </Link>
              <a
                href="https://github.com/sam247/openredaction"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md border border-gray-800 bg-gray-950 px-5 py-3 font-medium text-white transition-colors hover:bg-gray-900"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
