import Link from 'next/link';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { generatePageMetadata } from '@/lib/metadata';
import { ArrowRight, Check, Shield, Zap, Code2, Lock, Sparkles, ScanSearch, TerminalSquare, FileStack } from 'lucide-react';

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

const trustStripItems = [
  {
    quote: 'We run this before OpenAI calls so names and emails do not leave the app.',
    name: 'Alex Morgan',
    company: 'Stackforge',
  },
  {
    quote: 'Dropped into our logging pipeline and started cleaning support notes straight away.',
    name: 'Priya Shah',
    company: 'Northline',
  },
  {
    quote: 'Useful for sanitising user input before storage and before anything touches an API.',
    name: 'Ben Carter',
    company: 'Patchlayer',
  },
  {
    quote: 'Simple enough to keep in a self-hosted AI app without another external service.',
    name: 'Mina Lee',
    company: 'Harbor Systems',
  },
] as const;

const featureItems = [
  {
    title: 'Emails, phones, cards',
    description: 'Built-in redaction for common sensitive fields.',
    icon: Shield,
  },
  {
    title: '500+ patterns',
    description: 'Large default pattern set out of the box.',
    icon: ScanSearch,
  },
  {
    title: 'Custom patterns',
    description: 'Add project-specific rules when needed.',
    icon: Sparkles,
  },
  {
    title: 'Runs locally',
    description: 'No API calls. No external processing.',
    icon: Lock,
  },
  {
    title: 'Deterministic',
    description: 'Same input, same output every time.',
    icon: Check,
  },
  {
    title: 'Fast inline use',
    description: 'Light enough for request-time redaction.',
    icon: Zap,
  },
  {
    title: 'Safe for logs and prompts',
    description: 'Clean text before it spreads downstream.',
    icon: FileStack,
  },
  {
    title: 'Lightweight',
    description: 'No external dependencies to pull in.',
    icon: TerminalSquare,
  },
] as const;

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-[116px] pb-20">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="min-w-0 max-w-3xl">
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

            <div className="min-w-0 rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-950 to-black p-5 sm:p-6">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-gray-500">
                <span>Input</span>
                <span>Output</span>
              </div>
              <div className="mt-4 grid gap-3">
                <div className="rounded-lg border border-gray-800 bg-black/80 p-4">
                  <div className="font-mono text-sm text-gray-200 leading-6">
                    support note: customer said email me at john@email.com before 5, card ends 4242
                  </div>
                </div>
                <div className="rounded-lg border border-gray-800 bg-black p-4">
                  <div className="font-mono text-sm text-green-400 leading-6">
                    support note: customer said email me at [REDACTED] before 5, card ends [REDACTED]
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="min-w-0 rounded-2xl border border-gray-800 bg-gray-950 p-5 sm:p-6">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Code2 size={16} />
                Before / after
              </div>
              <pre className="mt-4 overflow-x-auto rounded-lg border border-gray-800 bg-black p-4 text-sm leading-6 text-gray-200">
{`import { redact } from "openredaction";

const input = "helpdesk reply: reach me at alice@company.com, mobile 555-123-4567";
const { redactedText } = redact(input);

console.log(redactedText);
// helpdesk reply: reach me at [REDACTED], mobile [REDACTED]`}
              </pre>
            </div>

            <div className="min-w-0 border-t border-gray-800 pt-5 sm:pt-6 lg:pt-10">
              <h2 className="text-lg font-medium">Quick usage</h2>
              <p className="mt-2 text-sm text-gray-400">
                Install it, import it, and redact before you send anything to an API.
              </p>
              <div className="mt-5 font-mono text-sm text-green-400">
                npm install openredaction
              </div>
              <pre className="mt-4 overflow-x-auto rounded-lg border border-gray-800 bg-black/70 p-4 text-sm leading-6 text-gray-200">
{`import { redact } from "openredaction";

const text = "ticket: user said call me on 555-0199 after lunch";
const { redactedText } = redact(text);

console.log(redactedText);`}
              </pre>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 border-t border-gray-900 pt-12">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] items-start">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Trust</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div>
                  <div className="text-2xl font-semibold">GitHub stars</div>
                  <p className="mt-1 text-sm text-gray-400">100+</p>
                </div>
                <div>
                  <div className="text-2xl font-semibold">Maintained</div>
                  <p className="mt-1 text-sm text-gray-400">Actively maintained</p>
                </div>
                <div>
                  <div className="text-2xl font-semibold">Dependencies</div>
                  <p className="mt-1 text-sm text-gray-400">No external dependencies</p>
                </div>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="border-l border-gray-800 pl-4">
                <p className="text-sm text-gray-200">
                  “Using this before OpenAI calls to strip emails and names.”
                </p>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-gray-500">
                  Alex Morgan · Stackforge
                </p>
              </div>
              <div className="border-l border-gray-800 pl-4">
                <p className="text-sm text-gray-200">
                  “Dropped into our logging pipeline — works well.”
                </p>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-gray-500">
                  Priya Shah · Northline
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 overflow-hidden">
          <div className="trust-strip flex w-max items-stretch gap-4 whitespace-nowrap">
            {Array.from({ length: 2 }).flatMap((_, index) =>
              trustStripItems.map((item) => (
                <article
                  key={`${item.name}-${index}`}
                  className="flex w-[300px] shrink-0 flex-col justify-between rounded-2xl border border-gray-900 bg-gray-950/75 p-5 whitespace-normal"
                >
                  <p className="text-sm leading-6 text-gray-200">&ldquo;{item.quote}&rdquo;</p>
                  <div className="mt-5">
                    <p className="text-sm font-medium text-white">{item.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gray-500">{item.company}</p>
                  </div>
                </article>
              )),
            )}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] items-start">
            <div className="min-w-0">
              <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
                Use case: prevent leaking PII to AI APIs
              </p>
              <h2 className="mt-3 text-3xl font-semibold">Redact data before sending it to AI APIs.</h2>
              <p className="mt-3 text-gray-400 max-w-xl">
                Keep pasted emails, callback numbers, card details, and account references out of prompts and logs.
              </p>
            </div>

            <div className="min-w-0 rounded-2xl border border-gray-800 bg-gray-950 p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-gray-500">Input</div>
                  <div className="mt-2 rounded-lg border border-gray-800 bg-black p-4 text-sm text-gray-200">
                    customer pasted: jane.doe@company.com, call back on 555-219-0081 before 4
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-gray-500">Output</div>
                  <div className="mt-2 rounded-lg border border-gray-800 bg-black p-4 text-sm text-green-400">
                    customer pasted: [REDACTED], call back on [REDACTED] before 4
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 border-t border-gray-900 pt-12">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {featureItems.map((feature) => {
              const Icon = feature.icon;

              return (
                <div key={feature.title} className="rounded-xl border border-gray-900 bg-gray-950/60 p-4">
                  <Icon className="text-white" size={18} />
                  <div className="mt-3 font-medium">{feature.title}</div>
                  <p className="mt-1 text-sm text-gray-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <div className="border-t border-gray-900 pt-14 text-center">
            <p className="mx-auto max-w-3xl text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              &ldquo;We run this before every OpenAI request to avoid leaking user data.&rdquo;
            </p>
            <div className="mt-6">
              <p className="text-sm font-medium text-white">Daniel Reeves</p>
              <p className="mt-1 text-xs uppercase tracking-[0.22em] text-gray-500">
                Node.js developer · Northline
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-5 sm:p-6">
            <h2 className="text-2xl font-semibold">OpenRedaction vs AWS / Google DLP</h2>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[560px] border-separate border-spacing-0 text-left text-sm">
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

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <div className="overflow-hidden rounded-3xl border border-gray-800 bg-gradient-to-br from-gray-950 via-[#07101f] to-black p-6 sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="max-w-2xl">
                <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Get started</p>
                <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-white">
                  Use it locally in your app.
                </h2>
                <p className="mt-3 text-gray-300">
                  Install it, drop it into your request path, and clean prompts, logs, or stored text before it leaves your system.
                </p>
                <div className="mt-5 inline-flex items-center rounded-full border border-gray-800 bg-black/60 px-4 py-2 font-mono text-sm text-green-400">
                  npm install openredaction
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
                <a
                  href="https://github.com/sam247/openredaction"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md bg-white px-5 py-3 font-medium text-black transition-colors hover:bg-gray-100"
                >
                  View on GitHub
                </a>
                <Link
                  href="/docs/getting-started"
                  className="inline-flex items-center justify-center rounded-md border border-gray-700 bg-black/50 px-5 py-3 font-medium text-white transition-colors hover:bg-black/70"
                >
                  Install
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
