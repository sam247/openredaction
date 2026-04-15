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

const comparisonCards = [
  {
    name: 'OpenRedaction',
    type: 'Open source',
    runtime: 'Node.js',
    processing: 'Local or self-hosted',
    detection: 'Deterministic regex',
    bestFor: 'Teams wanting predictable redaction in JS stacks',
  },
  {
    name: 'AWS Comprehend',
    type: 'Managed',
    runtime: 'Managed AWS service',
    processing: 'External cloud processing',
    detection: 'ML-based entity detection',
    bestFor: 'AWS-native pipelines',
  },
  {
    name: 'Microsoft Presidio',
    type: 'Open source',
    runtime: 'Python',
    processing: 'Self-hosted',
    detection: 'NLP + regex',
    bestFor: 'Python teams with custom NLP needs',
  },
  {
    name: 'Google DLP',
    type: 'Managed',
    runtime: 'Managed GCP service',
    processing: 'External cloud processing',
    detection: 'ML + infoTypes',
    bestFor: 'GCP-centric compliance workflows',
  },
] as const;

const trustStripItems = [
  {
    quote: 'We added it in front of our prototype assistant so support emails get masked before prompts go out.',
    name: 'Jordan P.',
    company: 'Small product team',
    avatar: 'https://i.pravatar.cc/96?img=12',
  },
  {
    quote: 'Not perfect for every edge case, but it gives us a practical baseline for sanitizing logs in Node.',
    name: 'Maya R.',
    company: 'Indie SaaS',
    avatar: 'https://i.pravatar.cc/96?img=32',
  },
  {
    quote: 'We use it in staging and early production paths to reduce accidental PII leakage while we tune rules.',
    name: 'Chris L.',
    company: 'Internal tooling',
    avatar: 'https://i.pravatar.cc/96?img=15',
  },
  {
    quote: 'The open-source approach made it easy to audit what is being redacted before we ship wider.',
    name: 'Nina K.',
    company: 'Security-minded startup',
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

type EcosystemCarouselItem = {
  name: string;
  iconSrc: string;
  wordmarkSrc?: string;
};

const ecosystemCarouselItems: EcosystemCarouselItem[] = [
  { name: 'AlphaWave', iconSrc: '/logo_repo/logos_icons/AlphaWave.svg' },
  { name: 'Segment', iconSrc: '/logo_repo/logos_icons/Segment.svg', wordmarkSrc: '/logo_repo/logos/Segment.svg' },
  { name: 'Constellation', iconSrc: '/logo_repo/logos_icons/Constellation.svg' },
  { name: 'Luminary', iconSrc: '/logo_repo/logos_icons/Luminary.svg', wordmarkSrc: '/logo_repo/logos/Luminary.svg' },
  { name: 'Biosynthesis', iconSrc: '/logo_repo/logos_icons/Biosynthesis.svg' },
  { name: 'Euphoria', iconSrc: '/logo_repo/logos_icons/Euphoria.svg', wordmarkSrc: '/logo_repo/logos/Euphoria.svg' },
  { name: 'Elasticware', iconSrc: '/logo_repo/logos_icons/Elasticware.svg' },
  { name: 'Capsule', iconSrc: '/logo_repo/logos_icons/Capsule.svg', wordmarkSrc: '/logo_repo/logos/Capsule.svg' },
] as const;

const trustCardLogos = [
  '/logo_repo/logos_icons/Watchtower.svg',
  '/logo_repo/logos_icons/Kintsugi.svg',
  '/logo_repo/logos_icons/Cubekit.svg',
  '/logo_repo/logos_icons/Hexsmith.svg',
] as const;

const comingSoonItems = [
  {
    platform: 'OpenAI',
    title: 'OpenAI wrapper',
    description:
      'Redact sensitive data from prompts before sending requests to OpenAI. Prevent emails, names, and other PII from leaving your application while keeping the same API usage pattern.',
    logo: 'openai',
  },
  {
    platform: 'Express.js',
    title: 'Express middleware',
    description:
      'Sanitise incoming request data automatically before it reaches your application logic. Helps prevent sensitive user information from being logged, stored, or forwarded unintentionally in backend services.',
    logo: 'express',
  },
  {
    platform: 'Logging',
    title: 'Logging integrations',
    description:
      'Redact sensitive fields before writing logs to tools like Pino or Winston. Avoid storing emails, phone numbers, and personal data while keeping logs useful for debugging and monitoring.',
    logo: 'logs',
  },
  {
    platform: 'Webhook',
    title: 'Webhook safety',
    description:
      'Redact data before sending outbound requests to third-party APIs and webhooks. Prevent sensitive information from leaving your system when integrating with external services or automation workflows.',
    logo: 'webhook',
  },
] as const;

function ComingSoonLogo({ logo }: { logo: 'openai' | 'express' | 'logs' | 'webhook' }) {
  const logoMap = {
    openai: '/chatgpt.png',
    express: '/js.png',
    logs: '/log.png',
    webhook: '/webhook.png',
  } as const;

  const altMap = {
    openai: 'OpenAI',
    express: 'Express.js',
    logs: 'Logging',
    webhook: 'Webhook',
  } as const;

  return (
    <div className="flex h-12 w-12 items-center justify-center">
      <img src={logoMap[logo]} alt={altMap[logo]} className="h-9 w-9 object-contain" />
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
            <div className="trust-strip-continuous flex w-max items-center gap-4 whitespace-nowrap">
              {Array.from({ length: 3 }).flatMap((_, index) =>
                ecosystemCarouselItems.map((logo) => (
                  <div
                    key={`${logo.name}-${index}`}
                    aria-label={logo.name}
                    className="flex items-center justify-center rounded-full border border-gray-900 bg-gray-950/75 px-6 py-3.5"
                  >
                    {logo.wordmarkSrc ? (
                      <img
                        src={logo.wordmarkSrc}
                        alt={`${logo.name} logo`}
                        className="h-[22px] w-auto max-w-[118px] object-contain opacity-70 grayscale-[20%] brightness-90"
                      />
                    ) : (
                      <img
                        src={logo.iconSrc}
                        alt={`${logo.name} icon`}
                        className="h-7 w-7 object-contain opacity-70 grayscale-[20%] brightness-90"
                      />
                    )}
                  </div>
                )),
              )}
            </div>
          </div>

          <section className="mt-16 border-t border-gray-900 pt-12">
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

            <div className="min-w-0 rounded-2xl border border-gray-800 bg-gray-950 p-5 sm:p-6">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <TerminalSquare size={16} />
                Quick usage
              </div>
              <p className="mt-2 text-sm text-gray-400">
                Install it, import it, and redact before you send anything to an API.
              </p>
              <div className="mt-5 inline-flex rounded-md border border-gray-800 bg-black px-3 py-2 font-mono text-sm text-green-400">
                npm install openredaction
              </div>
              <pre className="mt-4 overflow-x-auto rounded-lg border border-gray-800 bg-black p-4 text-sm leading-6 text-gray-200">
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
              trustStripItems.map((item, itemIndex) => (
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
                      <div className="mt-1 flex items-center gap-1.5">
                        <img
                          src={trustCardLogos[itemIndex]}
                          alt={`${item.company} logo icon`}
                          className="h-3.5 w-3.5 object-contain opacity-90"
                        />
                        <p className="text-xs uppercase tracking-[0.18em] text-gray-500">{item.company}</p>
                      </div>
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
                  className="flex items-start gap-3 rounded-xl bg-gray-950/40 p-3"
                >
                  <ComingSoonLogo logo={item.logo} />
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-gray-500">{item.platform}</p>
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
              &ldquo;OpenRedaction gave us a practical, inspectable first layer for masking obvious PII before prompts and logs.&rdquo;
            </p>
            <div className="mt-6 flex flex-col items-center">
              <img
                src="https://i.pravatar.cc/112?img=60"
                alt="Samir Q portrait"
                className="h-16 w-16 rounded-full border border-gray-800 object-cover"
              />
              <p className="mt-4 text-sm font-medium text-white">Samir Q.</p>
              <p className="mt-1 text-xs uppercase tracking-[0.22em] text-gray-500">
                Maintainer, internal AI tooling
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

            <div className="mt-8 overflow-x-auto rounded-2xl border border-gray-800 bg-black/40">
              <table className="min-w-[820px] w-full text-left">
                <thead className="bg-gray-950/80">
                  <tr>
                    <th className="px-4 py-3 text-xs uppercase tracking-[0.18em] text-gray-500">Tool</th>
                    <th className="px-4 py-3 text-xs uppercase tracking-[0.18em] text-gray-500">Type</th>
                    <th className="px-4 py-3 text-xs uppercase tracking-[0.18em] text-gray-500">Runtime</th>
                    <th className="px-4 py-3 text-xs uppercase tracking-[0.18em] text-gray-500">Processing</th>
                    <th className="px-4 py-3 text-xs uppercase tracking-[0.18em] text-gray-500">Detection</th>
                    <th className="px-4 py-3 text-xs uppercase tracking-[0.18em] text-gray-500">Best fit</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonCards.map((card, index) => (
                    <tr key={card.name} className={index === 0 ? 'bg-gray-950/50' : 'bg-transparent'}>
                      <td className="px-4 py-4 border-t border-gray-900 text-sm font-medium text-white">{card.name}</td>
                      <td className="px-4 py-4 border-t border-gray-900 text-sm text-gray-300">{card.type}</td>
                      <td className="px-4 py-4 border-t border-gray-900 text-sm text-gray-300">{card.runtime}</td>
                      <td className="px-4 py-4 border-t border-gray-900 text-sm text-gray-300">{card.processing}</td>
                      <td className="px-4 py-4 border-t border-gray-900 text-sm text-gray-300">{card.detection}</td>
                      <td className="px-4 py-4 border-t border-gray-900 text-sm text-gray-300">{card.bestFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
