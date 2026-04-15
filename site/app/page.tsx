import Link from 'next/link';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { generatePageMetadata } from '@/lib/metadata';
import { ArrowRight, Check, Shield, Zap, Code2, Lock, Sparkles, ScanSearch, TerminalSquare, FileStack, Globe } from 'lucide-react';

export const metadata: Metadata = generatePageMetadata({
  title: 'OpenRedaction | Open-source PII redaction for Node.js',
  description:
    'Redact PII locally in Node.js with 500+ regex patterns. No API calls. No data leaves your system.',
  path: '/',
});

const comparisonCards = [
  {
    name: 'OpenRedaction',
    type: 'Open source',
    notes: ['Node.js', 'Runs locally', 'Deterministic regex', 'Self-hosted'],
  },
  {
    name: 'AWS Comprehend',
    type: 'Managed',
    notes: ['Cloud API', 'External processing', 'ML detection', 'AWS setup'],
  },
  {
    name: 'Microsoft Presidio',
    type: 'Open source',
    notes: ['Python', 'NLP + regex', 'More setup', 'Self-hosted'],
  },
  {
    name: 'Google DLP',
    type: 'Managed',
    notes: ['Cloud service', 'External processing', 'ML detection', 'Google stack'],
  },
] as const;

const trustStripItems = [
  {
    quote: 'We run this before OpenAI calls so names and emails do not leave the app.',
    name: 'Alex Morgan',
    company: 'Stackforge',
    avatar: 'https://i.pravatar.cc/96?img=12',
  },
  {
    quote: 'Dropped into our logging pipeline and started cleaning support notes straight away.',
    name: 'Priya Shah',
    company: 'Northline',
    avatar: 'https://i.pravatar.cc/96?img=32',
  },
  {
    quote: 'Useful for sanitising user input before storage and before anything touches an API.',
    name: 'Ben Carter',
    company: 'Patchlayer',
    avatar: 'https://i.pravatar.cc/96?img=15',
  },
  {
    quote: 'Simple enough to keep in a self-hosted AI app without another external service.',
    name: 'Mina Lee',
    company: 'Harbor Systems',
    avatar: 'https://i.pravatar.cc/96?img=47',
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

const ecosystemLogos = [
  'OpenAI',
  'Vercel',
  'Supabase',
  'Stripe',
  'GitHub',
  'Next.js',
  'Anthropic',
  'Cloudflare',
] as const;

const comingSoonItems = [
  {
    title: 'OpenAI wrapper',
    description: 'Redact before API calls',
    logo: 'openai',
  },
  {
    title: 'Express middleware',
    description: 'Sanitise requests and logs',
    logo: 'express',
  },
  {
    title: 'Logging integrations',
    description: 'Safe structured logging',
    logo: 'logs',
  },
  {
    title: 'Webhook safety',
    description: 'Redact before outbound requests',
    logo: 'webhook',
  },
] as const;

function BrandLogo({ name }: { name: typeof ecosystemLogos[number] }) {
  if (name === 'OpenAI') {
    return (
      <div className="flex items-center gap-3">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-gray-200" fill="none" aria-hidden="true">
          <path
            d="M12 3.25a3.4 3.4 0 0 1 3.07 1.93l.22.46.52-.03a3.4 3.4 0 0 1 3.4 5.11l-.27.45.27.45a3.4 3.4 0 0 1-3.4 5.12l-.52-.03-.22.46a3.4 3.4 0 0 1-6.14 0l-.22-.46-.52.03a3.4 3.4 0 0 1-3.4-5.12l.27-.45-.27-.45a3.4 3.4 0 0 1 3.4-5.11l.52.03.22-.46A3.4 3.4 0 0 1 12 3.25Z"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <path d="M9.3 7.7 14.8 11v6.1M14.7 7.7 9.2 11m0 0v6.1m5.6-9.4 2.7 4.7-2.7 4.7H9.2l-2.7-4.7 2.7-4.7Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
        <span className="font-medium tracking-[0.04em] text-gray-300">{name}</span>
      </div>
    );
  }

  if (name === 'GitHub') {
    return (
      <div className="flex items-center gap-3">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-gray-200" fill="currentColor" aria-hidden="true">
          <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.42-4.04-1.42-.55-1.37-1.34-1.73-1.34-1.73-1.09-.73.08-.72.08-.72 1.2.08 1.84 1.21 1.84 1.21 1.08 1.81 2.82 1.29 3.5.99.11-.76.42-1.29.76-1.59-2.66-.3-5.47-1.31-5.47-5.81 0-1.28.47-2.33 1.23-3.15-.12-.3-.53-1.52.12-3.17 0 0 1.01-.32 3.3 1.2A11.6 11.6 0 0 1 12 6.6c1.02 0 2.05.14 3.01.41 2.28-1.52 3.29-1.2 3.29-1.2.65 1.65.24 2.87.12 3.17.77.82 1.23 1.87 1.23 3.15 0 4.51-2.81 5.5-5.49 5.8.43.37.82 1.1.82 2.23v3.31c0 .32.21.7.83.58A12 12 0 0 0 12 .5Z" />
        </svg>
        <span className="font-medium tracking-[0.04em] text-gray-300">{name}</span>
      </div>
    );
  }

  if (name === 'Vercel') {
    return (
      <div className="flex items-center gap-3">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-gray-200" fill="currentColor" aria-hidden="true">
          <path d="M12 4 20 18H4l8-14Z" />
        </svg>
        <span className="font-medium tracking-[0.04em] text-gray-300">{name}</span>
      </div>
    );
  }

  if (name === 'Next.js') {
    return (
      <div className="flex items-center gap-3">
        <div className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-700 text-[9px] font-semibold text-gray-200">
          N
        </div>
        <span className="font-medium tracking-[0.04em] text-gray-300">{name}</span>
      </div>
    );
  }

  if (name === 'Supabase') {
    return (
      <div className="flex items-center gap-3">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-gray-200" fill="currentColor" aria-hidden="true">
          <path d="M14.8 3.5c.39-.48 1.16-.2 1.16.42v9.14h2.13c.73 0 1.13.84.67 1.4l-8.54 9.97c-.4.46-1.15.18-1.15-.43v-9.03H6.93c-.73 0-1.12-.85-.66-1.41L14.8 3.5Z" />
        </svg>
        <span className="font-medium tracking-[0.04em] text-gray-300">{name}</span>
      </div>
    );
  }

  if (name === 'Stripe') {
    return (
      <div className="flex items-center gap-3">
        <div className="text-sm font-semibold tracking-[0.02em] text-gray-200">stripe</div>
      </div>
    );
  }

  if (name === 'Anthropic') {
    return (
      <div className="flex items-center gap-3">
        <div className="text-sm font-semibold tracking-[0.02em] text-gray-200">AI</div>
        <span className="font-medium tracking-[0.04em] text-gray-300">{name}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-gray-200" fill="none" aria-hidden="true">
        <path d="M5 12a7 7 0 0 1 14 0M12 5a7 7 0 0 1 0 14M6.5 8.5c2.2 1.5 8.8 1.5 11 0M6.5 15.5c2.2-1.5 8.8-1.5 11 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      <span className="font-medium tracking-[0.04em] text-gray-300">{name}</span>
    </div>
  );
}

function ComingSoonLogo({ logo }: { logo: 'openai' | 'express' | 'logs' | 'webhook' }) {
  if (logo === 'openai') {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-800 bg-gray-950 text-gray-200">
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" aria-hidden="true">
          <path
            d="M12 3.25a3.4 3.4 0 0 1 3.07 1.93l.22.46.52-.03a3.4 3.4 0 0 1 3.4 5.11l-.27.45.27.45a3.4 3.4 0 0 1-3.4 5.12l-.52-.03-.22.46a3.4 3.4 0 0 1-6.14 0l-.22-.46-.52.03a3.4 3.4 0 0 1-3.4-5.12l.27-.45-.27-.45a3.4 3.4 0 0 1 3.4-5.11l.52.03.22-.46A3.4 3.4 0 0 1 12 3.25Z"
            stroke="currentColor"
            strokeWidth="1.4"
          />
        </svg>
      </div>
    );
  }

  if (logo === 'express') {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-800 bg-gray-950 text-[8px] font-semibold uppercase tracking-[0.1em] text-gray-200">
        ex
      </div>
    );
  }

  if (logo === 'webhook') {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-800 bg-gray-950 text-gray-300">
        <Globe size={16} />
      </div>
    );
  }

  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-800 bg-gray-950 text-gray-300">
      <FileStack size={16} />
    </div>
  );
}

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

          <div className="mt-20 overflow-hidden border-t border-gray-900 pt-8">
            <div className="trust-strip flex w-max items-center gap-4 whitespace-nowrap">
              {Array.from({ length: 2 }).flatMap((_, index) =>
                ecosystemLogos.map((logo) => (
                  <div
                    key={`${logo}-${index}`}
                    className="flex items-center gap-3 rounded-full border border-gray-900 bg-gray-950/75 px-5 py-3 text-sm text-gray-400"
                  >
                    <BrandLogo name={logo} />
                  </div>
                )),
              )}
            </div>
          </div>

          <div className="mt-20 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
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

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32 overflow-hidden border-t border-gray-900 pt-14">
          <div className="trust-strip flex w-max items-stretch gap-4 whitespace-nowrap">
            {Array.from({ length: 2 }).flatMap((_, index) =>
              trustStripItems.map((item) => (
                <article
                  key={`${item.name}-${index}`}
                  className="flex w-[300px] shrink-0 flex-col justify-between rounded-2xl border border-gray-900 bg-gray-950/75 p-5 whitespace-normal"
                >
                  <p className="text-sm leading-6 text-gray-200">&ldquo;{item.quote}&rdquo;</p>
                  <div className="mt-5 flex items-center gap-3">
                    <img
                      src={item.avatar}
                      alt={`${item.name} portrait`}
                      className="h-12 w-12 rounded-full border border-gray-800 object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-white">{item.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gray-500">{item.company}</p>
                    </div>
                  </div>
                </article>
              )),
            )}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
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

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32 border-t border-gray-900 pt-16">
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

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-28">
          <div className="border-t border-gray-900 pt-10">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Coming soon</p>
              <p className="mt-3 text-sm text-gray-400">
                Working on simple wrappers for common use cases:
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {comingSoonItems.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3 rounded-xl border border-gray-900/80 bg-transparent px-1 py-2"
                >
                  <ComingSoonLogo logo={item.logo} />
                  <div>
                    <p className="text-sm font-medium text-white">{item.title}</p>
                    <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
          <div className="border-t border-gray-900 pt-14 text-center">
            <p className="mx-auto max-w-3xl text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              &ldquo;We run this before every OpenAI request to avoid leaking user data.&rdquo;
            </p>
            <div className="mt-6 flex flex-col items-center">
              <img
                src="https://i.pravatar.cc/112?img=60"
                alt="Daniel Reeves portrait"
                className="h-16 w-16 rounded-full border border-gray-800 object-cover"
              />
              <p className="mt-4 text-sm font-medium text-white">Daniel Reeves</p>
              <p className="mt-1 text-xs uppercase tracking-[0.22em] text-gray-500">
                Node.js developer · Northline
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-5 sm:p-6 lg:p-8">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Alternatives</p>
              <h2 className="mt-3 text-2xl sm:text-3xl font-semibold">
                OpenRedaction alongside AWS, Presidio, and Google DLP
              </h2>
              <p className="mt-3 text-sm text-gray-400">
                A simple Node.js option if you want local redaction, plus common managed and Python-based alternatives.
              </p>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-4">
              {comparisonCards.map((card, index) => (
                <div
                  key={card.name}
                  className={`rounded-2xl border p-5 ${
                    index === 0 ? 'border-gray-700 bg-black' : 'border-gray-900 bg-black/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-base font-medium text-white">{card.name}</h3>
                    <span className="rounded-full border border-gray-800 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-gray-500">
                      {card.type}
                    </span>
                  </div>
                  <div className="mt-5 space-y-3">
                    {card.notes.map((note) => (
                      <div key={note} className="border-t border-gray-900 pt-3 text-sm text-gray-300">
                        {note}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
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
