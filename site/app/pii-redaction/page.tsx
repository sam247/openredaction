import type { Metadata } from "next";
import Link from "next/link";
import FAQAccordion from "@/components/FAQAccordion";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import {
  TrackedDocsGettingStartedLink,
} from "@/components/TrackedLinks";
import { generatePageMetadata } from "@/lib/metadata";

const pageTitle =
  "PII Redaction for AI Systems: Detection, Logs, Citations & Node.js";
const pageDescription =
  "What PII redaction is, where it belongs in AI pipelines, and how to implement it locally in Node.js—prompts, RAG, citations, logs, and OpenTelemetry.";

export const metadata: Metadata = {
  ...generatePageMetadata({
    title: pageTitle,
    description: pageDescription,
    path: "/pii-redaction",
  }),
  keywords: [
    "PII redaction",
    "PII redaction AI",
    "personally identifiable information redaction",
    "redact PII before LLM",
    "PII redaction Node.js",
    "AI citation redaction",
    "OpenTelemetry PII masking",
    "redaction vs anonymization vs tokenization",
    "open source PII redaction",
  ],
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://openredaction.com";

const toc = [
  { id: "what-is-pii-redaction", label: "What PII redaction really is" },
  { id: "why-pii-redaction", label: "Why it is critical for AI systems" },
  { id: "entities", label: "Core PII entities" },
  { id: "redaction-vs-anonymization", label: "Redaction vs anonymization" },
  { id: "defense-in-depth", label: "Defense-in-depth strategy" },
  { id: "how-to-implement", label: "How to implement with OpenRedaction" },
  { id: "placement", label: "Where to redact in AI pipelines" },
  { id: "telemetry", label: "Logs, traces, and telemetry" },
  { id: "ai-citations", label: "Redaction for AI citations" },
  { id: "governance", label: "Policies and governance" },
  { id: "evaluation", label: "Evaluation and quality" },
  { id: "faq", label: "FAQ" },
] as const;

const faqItems = [
  {
    question: "What is PII redaction?",
    answer:
      "PII redaction is the practice of detecting and masking personally identifiable information before text is stored, logged, embedded, or sent to an LLM or third-party API. Typical targets include emails, phone numbers, national IDs, and other identifiers that can single someone out.",
  },
  {
    question: "Is PII redaction the same as anonymization?",
    answer:
      "No. Redaction masks or removes sensitive values while keeping useful context. Anonymization aims to make re-identification impossible even when data is combined with other sources. Tokenization replaces values with reversible tokens stored in a secure mapping.",
  },
  {
    question: "Where should I redact PII in an AI pipeline?",
    answer:
      "At every trust boundary: before inference (gateway or middleware), before RAG indexing, before writing logs/traces, and before user-facing citations or exports. A single edge filter is rarely enough because prompts fan out into models, vector stores, and observability tools.",
  },
  {
    question: "Can OpenRedaction redact PII before sending data to OpenAI?",
    answer:
      "Yes. Run OpenRedaction locally on prompts and tool outputs, then pass only the redacted text to the OpenAI (or other LLM) API. The open-source library processes text in your process—no cloud redaction hop is required.",
  },
  {
    question: "How do AI citations leak PII?",
    answer:
      "Citations often point back to source chunks, document titles, metadata, or telemetry IDs. If those sources still contain emails, names, or account numbers, the citation path becomes a leak even when the main answer looks clean. Use stable placeholders and redacted metadata.",
  },
  {
    question: "Should I use regex or NER for PII detection?",
    answer:
      "Use both when you can. Regex and validators are strong for structured identifiers (emails, cards, IBANs, national IDs). NER helps with free-text names and locations. Most production stacks run deterministic pattern redaction first, then optional local NER.",
  },
];

const entityGroups = [
  {
    title: "Contact information",
    items: "Emails, phone numbers, postal addresses, postcodes",
  },
  {
    title: "Identity numbers",
    items:
      "National IDs, SSNs, passport numbers, driver’s licenses, NHS/NINO-style identifiers",
  },
  {
    title: "Financial data",
    items: "Credit cards, IBANs, account numbers, routing / sort codes",
  },
  {
    title: "Health identifiers",
    items: "Patient IDs, clinical record IDs, insurance member IDs (HIPAA-bound systems)",
  },
  {
    title: "Online / device identifiers",
    items: "IP addresses, device IDs, cookies where regulations treat them as personal data",
  },
  {
    title: "Free-text personal details",
    items:
      "Names, employers, locations, and attribute combinations that can re-identify someone",
  },
] as const;

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="mt-4 overflow-x-auto rounded-lg border border-gray-800 bg-black p-4 text-sm leading-6 text-gray-200">
      <code>{code}</code>
    </pre>
  );
}

export default function PiiRedactionPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: pageTitle,
    description: pageDescription,
    url: `${siteUrl}/pii-redaction`,
    dateModified: "2026-08-05",
    author: {
      "@type": "Organization",
      name: "OpenRedaction",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "OpenRedaction",
      url: siteUrl,
    },
    about: [
      "PII redaction",
      "AI privacy",
      "LLM prompt sanitization",
      "OpenTelemetry redaction",
      "AI citations",
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "PII Redaction",
        item: `${siteUrl}/pii-redaction`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD via JSON.stringify
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD via JSON.stringify
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD via JSON.stringify
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="pt-[116px] pb-20">
        <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
          <header>
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
              Implementation guide
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-balance">
              PII Redaction for AI Systems
            </h1>
            <p className="mt-5 text-lg text-gray-300 leading-relaxed">
              Protecting personally identifiable information is a core
              requirement for any AI system that handles real-world data—
              especially when prompts, logs, traces, embeddings, and citations
              can unintentionally leak who the data is about. This guide covers
              how to design, implement, and operate PII redaction across modern
              AI pipelines.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-gray-400">
              <TrackedDocsGettingStartedLink
                location="pii_redaction_hero"
                className="underline underline-offset-4 hover:text-white"
              >
                Getting started docs
              </TrackedDocsGettingStartedLink>
              <span className="text-gray-700">•</span>
              <Link
                href="/redact-pii-before-openai"
                className="underline underline-offset-4 hover:text-white"
              >
                Redact before OpenAI
              </Link>
              <span className="text-gray-700">•</span>
              <Link
                href="/playground"
                className="underline underline-offset-4 hover:text-white"
              >
                Try the playground
              </Link>
            </div>
          </header>

          <nav
            aria-label="Table of contents"
            className="mt-10 rounded-xl border border-gray-800 bg-gray-950 p-5 sm:p-6"
          >
            <h2 className="text-sm uppercase tracking-[0.18em] text-gray-500">
              On this page
            </h2>
            <ol className="mt-4 grid gap-2 sm:grid-cols-2 text-sm text-gray-300">
              {toc.map((item, index) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="hover:text-white underline-offset-4 hover:underline"
                  >
                    {index + 1}. {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-14 space-y-14 text-gray-300 leading-relaxed">
            <section id="what-is-pii-redaction" className="scroll-mt-28">
              <h2 className="text-2xl sm:text-3xl font-semibold text-white">
                What PII redaction really is
              </h2>
              <p className="mt-4">
                PII redaction is the practice of detecting and masking
                information that can directly or indirectly identify an
                individual before that data is stored, processed, or exposed
                downstream. In AI systems, that includes prompts, model outputs,
                logs, traces, embeddings, analytics, and any citation that
                points back to user data.
              </p>
              <p className="mt-4">
                PII broadly covers two categories:
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-5">
                <li>
                  <strong className="text-white">Direct identifiers:</strong>{" "}
                  email addresses, phone numbers, names, national IDs, account
                  numbers
                </li>
                <li>
                  <strong className="text-white">
                    Indirect or quasi-identifiers:
                  </strong>{" "}
                  dates of birth, postcodes, job titles, and combinations of
                  attributes that re-identify a person when linked
                </li>
              </ul>
              <p className="mt-4">
                What matters most is not only what counts as PII, but{" "}
                <em>where</em> it can appear across your AI stack. For a
                detection-focused treatment of prompts and RAG surfaces, see{" "}
                <Link
                  href="/blog/pii-detection-for-ai"
                  className="text-white underline underline-offset-4"
                >
                  PII detection for AI workflows
                </Link>
                .
              </p>
            </section>

            <section id="why-pii-redaction" className="scroll-mt-28">
              <h2 className="text-2xl sm:text-3xl font-semibold text-white">
                Why PII redaction is critical for AI systems
              </h2>
              <p className="mt-4">
                AI systems amplify traditional privacy risks because they copy,
                transform, and log data across multiple layers. Without
                redaction, a single prompt can end up in model vendor logs,
                vector stores, observability platforms, and audit trails.
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-5">
                <li>
                  <strong className="text-white">Regulatory compliance:</strong>{" "}
                  GDPR, CCPA, HIPAA, and sector rules increasingly expect
                  proactive controls on personal data (see{" "}
                  <Link
                    href="/gdpr-redaction"
                    className="text-white underline underline-offset-4"
                  >
                    GDPR redaction
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/hipaa-redaction"
                    className="text-white underline underline-offset-4"
                  >
                    HIPAA redaction
                  </Link>
                  )
                </li>
                <li>
                  <strong className="text-white">Security posture:</strong>{" "}
                  masking high-value identifiers reduces the blast radius of any
                  breach
                </li>
                <li>
                  <strong className="text-white">Trust and adoption:</strong>{" "}
                  users and customers adopt AI features faster when privacy
                  controls are concrete and inspectable
                </li>
              </ul>
              <p className="mt-4">
                For AI citations specifically, redaction keeps references
                informative without leaking who the underlying data is about.
              </p>
            </section>

            <section id="entities" className="scroll-mt-28">
              <h2 className="text-2xl sm:text-3xl font-semibold text-white">
                Core PII entities and redaction targets
              </h2>
              <p className="mt-4">
                Start with clear entity definitions and a consistent masking
                strategy per entity. In AI pipelines, the same entities show up
                in prompts, tool outputs, RAG documents, citations, logs,
                traces, and embeddings.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {entityGroups.map((group) => (
                  <div
                    key={group.title}
                    className="rounded-lg border border-gray-800 bg-gray-950 p-4"
                  >
                    <h3 className="text-base font-medium text-white">
                      {group.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-400">{group.items}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm text-gray-400">
                Ask for your use case: which of these entity types is most
                likely to appear in logs or citations? Start there, then expand
                coverage once recall and false-positive rates are measured.
              </p>
            </section>

            <section id="redaction-vs-anonymization" className="scroll-mt-28">
              <h2 className="text-2xl sm:text-3xl font-semibold text-white">
                Redaction vs anonymization vs tokenization
              </h2>
              <p className="mt-4">
                Different privacy techniques serve different goals. Mixing them
                up leads to brittle designs.
              </p>
              <div className="mt-6 overflow-x-auto rounded-xl border border-gray-800">
                <table className="w-full min-w-[640px] border-separate border-spacing-0 text-left text-sm">
                  <thead>
                    <tr className="bg-gray-950 text-gray-400">
                      <th className="border-b border-gray-800 px-4 py-3 font-medium">
                        Technique
                      </th>
                      <th className="border-b border-gray-800 px-4 py-3 font-medium">
                        What it does
                      </th>
                      <th className="border-b border-gray-800 px-4 py-3 font-medium">
                        Best for
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border-b border-gray-900 px-4 py-3 text-white">
                        Redaction
                      </td>
                      <td className="border-b border-gray-900 px-4 py-3">
                        Remove or mask the sensitive value (e.g.{" "}
                        <code className="text-green-400">[EMAIL_9619]</code>)
                      </td>
                      <td className="border-b border-gray-900 px-4 py-3">
                        Prompts, logs, model traffic when structure/context
                        remains useful
                      </td>
                    </tr>
                    <tr>
                      <td className="border-b border-gray-900 px-4 py-3 text-white">
                        Anonymization
                      </td>
                      <td className="border-b border-gray-900 px-4 py-3">
                        Transform so individuals are no longer identifiable,
                        even when linked
                      </td>
                      <td className="border-b border-gray-900 px-4 py-3">
                        Long-term analytics, public datasets, aggregated
                        reporting
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-white">Tokenization</td>
                      <td className="px-4 py-3">
                        Replace values with reversible tokens plus a secure map
                      </td>
                      <td className="px-4 py-3">
                        Internal workflows that still need authorised
                        re-identification
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4">
                For AI citations, redaction and tokenization matter most:
                citations should not leak real identifiers, but privileged
                services may still need to resolve a placeholder back to a
                record.
              </p>
            </section>

            <section id="defense-in-depth" className="scroll-mt-28">
              <h2 className="text-2xl sm:text-3xl font-semibold text-white">
                Defense-in-depth: a multi-layer strategy
              </h2>
              <p className="mt-4">
                Modern AI systems need PII controls at multiple layers, not a
                single filter at the edge.
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-5">
                <li>
                  <strong className="text-white">Input layer:</strong> redact or
                  tokenise before data reaches the model or vector store
                </li>
                <li>
                  <strong className="text-white">Logging layer:</strong> scrub
                  structured logs, traces, and metrics (including OpenTelemetry
                  attributes)
                </li>
                <li>
                  <strong className="text-white">Storage and analytics:</strong>{" "}
                  anonymize or aggregate before long-term retention
                </li>
                <li>
                  <strong className="text-white">Output and citations:</strong>{" "}
                  ensure responses, explanations, and provenance never re-emit
                  raw identifiers
                </li>
              </ul>
              <p className="mt-4">
                Keep a shared entity taxonomy and redaction policy across layers
                so one hop does not undo another.
              </p>
            </section>
          </div>

          <section
            id="how-to-implement"
            className="mt-16 scroll-mt-28"
          >
            <h2 className="text-2xl sm:text-3xl font-semibold text-white">
              How to implement PII redaction with OpenRedaction
            </h2>
            <p className="mt-4 text-gray-300 leading-relaxed">
              OpenRedaction is a regex-first, open-source library that detects
              and redacts PII locally in Node.js. Use it as the deterministic
              control plane before LLM calls, RAG indexing, and log export. The
              steps below mirror the pattern used in production AI agent stacks:
              install a specialized redactor, wrap sensitive payloads, then keep
              observability tools from storing the originals.
            </p>

            <div className="mt-8 space-y-10">
              <div>
                <h3 className="text-xl font-medium text-white">
                  Step 1: Install the library
                </h3>
                <CodeBlock code={`npm install openredaction`} />
              </div>

              <div>
                <h3 className="text-xl font-medium text-white">
                  Step 2: Detect and redact a string
                </h3>
                <p className="mt-3 text-sm text-gray-400">
                  <code className="text-gray-300">detect()</code> is async and
                  returns the redacted text plus a{" "}
                  <code className="text-gray-300">redactionMap</code> for
                  authorised restore flows.
                </p>
                <CodeBlock
                  code={`import { OpenRedaction } from "openredaction";

const redactor = new OpenRedaction({
  preset: "gdpr",
  redactionMode: "placeholder",
  deterministic: true,
});

const input =
  "Hi, I'm Jane Smith. Email jane@acme.com or call 07700900123.";

const result = await redactor.detect(input);

console.log(result.redacted);
// e.g. "Hi, I'm [NAME_...]. Email [EMAIL_...] or call [PHONE_UK_MOBILE_...]."

console.log(result.detections.map((d) => d.type));
// ["NAME", "EMAIL", "PHONE_UK_MOBILE"]`}
                />
              </div>

              <div>
                <h3 className="text-xl font-medium text-white">
                  Step 3: Redact before an LLM API call
                </h3>
                <p className="mt-3 text-sm text-gray-400">
                  Never pass raw user text to a third-party model when PII is
                  possible. Full walkthrough:{" "}
                  <Link
                    href="/redact-pii-before-openai"
                    className="text-white underline underline-offset-4"
                  >
                    redact PII before OpenAI
                  </Link>
                  .
                </p>
                <CodeBlock
                  code={`import OpenAI from "openai";
import { OpenRedaction } from "openredaction";

const client = new OpenAI();
const redactor = new OpenRedaction({ redactionMode: "placeholder" });

async function safeCompletion(userPrompt: string) {
  const { redacted } = await redactor.detect(userPrompt);

  return client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: redacted }],
  });
}`}
                />
              </div>

              <div>
                <h3 className="text-xl font-medium text-white">
                  Step 4: Scrub request bodies with Express middleware
                </h3>
                <p className="mt-3 text-sm text-gray-400">
                  Put redaction at the gateway so every route inherits the same
                  policy. See also the{" "}
                  <Link
                    href="/nodejs-redaction"
                    className="text-white underline underline-offset-4"
                  >
                    Node.js redaction guide
                  </Link>
                  .
                </p>
                <CodeBlock
                  code={`import express from "express";
import { openredactionMiddleware } from "@openredaction/express";

const app = express();
app.use(express.json());

app.use(
  openredactionMiddleware({
    autoRedact: true,
    fields: ["prompt", "message", "content"],
  }),
);

app.post("/chat", (req, res) => {
  // req.body fields are already redacted
  res.json({ ok: true, body: req.body, pii: req.pii });
});`}
                />
              </div>

              <div>
                <h3 className="text-xl font-medium text-white">
                  Step 5: Keep session-scoped maps for citations (optional)
                </h3>
                <p className="mt-3 text-sm text-gray-400">
                  Stable placeholders keep RAG citations readable. Store
                  <code className="text-gray-300"> redactionMap </code>
                  only in an authorised, short-lived context—never in the vector
                  store or public citation payload.
                </p>
                <CodeBlock
                  code={`const redactor = new OpenRedaction({
  redactionMode: "placeholder",
  deterministic: true,
});

async function prepareChunkForIndex(chunk: string) {
  const { redacted, redactionMap } = await redactor.detect(chunk);

  // Persist only redacted text in your vector DB / citation index
  await indexDocument({ text: redacted });

  // Keep the map in a privileged session store if restore is required
  await sessionStore.set(sessionId, redactionMap);

  return redacted;
}

// Later, privileged internal tooling only:
const map = await sessionStore.get(sessionId);
const restored = redactor.restore(redactedCitation, map);`}
                />
              </div>

              <div className="rounded-xl border border-gray-800 bg-gray-950 p-5">
                <h3 className="text-lg font-medium text-white">
                  Before / after
                </h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-gray-800 bg-black p-4 text-sm">
                    <div className="mb-2 text-gray-500">Before</div>
                    <code className="text-gray-200">
                      Contact jane@acme.com about order #4412, SSN 078-05-1120
                    </code>
                  </div>
                  <div className="rounded-lg border border-gray-800 bg-black p-4 text-sm">
                    <div className="mb-2 text-gray-500">After</div>
                    <code className="text-green-400">
                      Contact [EMAIL_…] about order #4412, SSN [SSN_…]
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-14 space-y-14 text-gray-300 leading-relaxed">
            <section id="placement" className="scroll-mt-28">
              <h2 className="text-2xl sm:text-3xl font-semibold text-white">
                Placement: where to redact in AI pipelines
              </h2>
              <p className="mt-4">
                Placement is as important as detection quality.
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-5">
                <li>
                  <strong className="text-white">
                    Before inference (gateway):
                  </strong>{" "}
                  scrub inputs and tool results before third-party LLMs
                </li>
                <li>
                  <strong className="text-white">Application / RAG layer:</strong>{" "}
                  integrate into middleware and chunking so embeddings never
                  store raw identifiers
                </li>
                <li>
                  <strong className="text-white">Observability layer:</strong>{" "}
                  use collectors and span processors to scrub attributes before
                  export
                </li>
                <li>
                  <strong className="text-white">Storage and analytics:</strong>{" "}
                  tokenize or aggregate before dashboards and training sets
                </li>
              </ul>
              <p className="mt-4">
                In practice, many teams combine a model gateway with
                collector-level redaction for logs and traces.
              </p>
            </section>

            <section id="telemetry" className="scroll-mt-28">
              <h2 className="text-2xl sm:text-3xl font-semibold text-white">
                Redaction in logs, traces, and telemetry
              </h2>
              <p className="mt-4">
                Most compliance findings involving AI stacks come from logs and
                observability data—not just primary databases.
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-5">
                <li>
                  Prefer field-level redaction in structured logs before
                  serialisation
                </li>
                <li>
                  Scrub span attributes and events that may contain emails,
                  tokens, or prompt bodies
                </li>
                <li>
                  Ensure debug logs and stack traces never dump raw prompts
                </li>
                <li>
                  Separate operational logs from compliance audit logs—neither
                  should retain raw identifiers by default
                </li>
              </ul>
              <p className="mt-4">
                You can also apply collector-level masking (useful when many
                services need a central policy). Example OpenTelemetry Collector
                snippet:
              </p>
              <CodeBlock
                code={`processors:
  attributes/pii:
    actions:
      - key: user.email
        action: delete
      - key: http.url
        regex: '(\\?|&)(token|password)=([^&]+)'
        action: update
        value: '[REDACTED]'

service:
  pipelines:
    traces:
      processors: [attributes/pii]`}
              />
              <p className="mt-4 text-sm text-gray-400">
                Collector rules catch known attribute keys. Application-layer
                OpenRedaction still matters for free-text prompts and message
                bodies those keys will not cover.
              </p>
            </section>

            <section id="ai-citations" className="scroll-mt-28">
              <h2 className="text-2xl sm:text-3xl font-semibold text-white">
                Designing redaction for AI citations
              </h2>
              <p className="mt-4">
                AI citations refer model outputs back to source documents,
                prompts, or intermediate artifacts. If those sources contain
                PII, citations become a leak point even when the answer looks
                safe.
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-5">
                <li>
                  <strong className="text-white">Stable placeholders:</strong>{" "}
                  replace PII with consistent tokens (
                  <code className="text-green-400">[PERSON_1]</code>,{" "}
                  <code className="text-green-400">[EMAIL_1]</code>) so citations
                  remain meaningful
                </li>
                <li>
                  <strong className="text-white">
                    Session-scoped redaction maps:
                  </strong>{" "}
                  only privileged services can de-redact
                </li>
                <li>
                  <strong className="text-white">Redacted metadata:</strong>{" "}
                  titles, IDs, and document labels must not encode PII
                </li>
                <li>
                  <strong className="text-white">Constraint-based outputs:</strong>{" "}
                  prevent the model from reconstructing raw identifiers from
                  context
                </li>
              </ul>
            </section>

            <section id="governance" className="scroll-mt-28">
              <h2 className="text-2xl sm:text-3xl font-semibold text-white">
                Policies, classification, and governance
              </h2>
              <p className="mt-4">
                Effective PII redaction is driven by policy, not only tooling.
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-5">
                <li>
                  Classify data tiers (public, internal, sensitive, regulated)
                </li>
                <li>
                  Map entity types to regulations (for example, SSN → GDPR /
                  HIPAA expectations)
                </li>
                <li>
                  Define who can see de-tokenised data versus fully masked
                  outputs
                </li>
                <li>
                  Treat redaction configuration as code—versioned, reviewed, and
                  approved
                </li>
              </ul>
              <p className="mt-4">
                OpenRedaction presets (
                <code className="text-gray-200">gdpr</code>,{" "}
                <code className="text-gray-200">hipaa</code>,{" "}
                <code className="text-gray-200">ccpa</code>, finance, education,
                healthcare) give teams a concrete starting policy they can
                inspect and override.
              </p>
            </section>

            <section id="evaluation" className="scroll-mt-28">
              <h2 className="text-2xl sm:text-3xl font-semibold text-white">
                Evaluation: precision, recall, and quality
              </h2>
              <p className="mt-4">
                Redaction pipelines need continuous evaluation or they rot
                quietly.
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-5">
                <li>
                  Maintain fixture sets with known PII and assert nothing
                  sensitive reaches models or logs
                </li>
                <li>
                  Prioritise recall for high-risk entities even when that means
                  some over-redaction
                </li>
                <li>
                  Tune confidence thresholds and human-review queues per entity
                  type
                </li>
                <li>
                  Periodically scan prompts, logs, and citation stores for
                  regressions
                </li>
              </ul>
              <p className="mt-4">
                No automated system catches everything. Keep review queues for
                low-confidence matches, especially in healthcare, legal, and HR
                workflows—see also{" "}
                <Link
                  href="/blog/pii-in-support-tickets"
                  className="text-white underline underline-offset-4"
                >
                  PII in support tickets
                </Link>
                .
              </p>
            </section>

            <section className="scroll-mt-28">
              <h2 className="text-2xl sm:text-3xl font-semibold text-white">
                Where OpenRedaction fits in
              </h2>
              <p className="mt-4">
                OpenRedaction provides an open-source foundation for detecting
                and redacting a broad set of PII entities using extensive regex
                libraries, validators, and configurable masking modes. Pair it
                with optional NER, structured logging, and clear policies for
                end-to-end coverage.
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-5">
                <li>Gateways in front of LLMs</li>
                <li>Middleware scrubbing for APIs and support tools</li>
                <li>
                  Pre-processing documents and prompts before RAG or search
                  indexes
                </li>
                <li>Local, auditable redaction for compliance reviews</li>
              </ul>
              <p className="mt-4">
                Compare approaches on{" "}
                <Link
                  href="/open-source-ai-redaction-tools"
                  className="text-white underline underline-offset-4"
                >
                  open source AI redaction tools
                </Link>
                , or read how the library was built in{" "}
                <Link
                  href="/blog/building-openredaction-developer-journey"
                  className="text-white underline underline-offset-4"
                >
                  Building OpenRedaction
                </Link>
                .
              </p>
            </section>
          </div>

          <section id="faq" className="mt-16 scroll-mt-28">
            <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-6">
              FAQ
            </h2>
            <FAQAccordion items={faqItems} />
          </section>

          <section className="mt-16 rounded-xl border border-gray-800 bg-gray-950 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-white">
              Related guides
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-gray-300">
              <li>
                <TrackedDocsGettingStartedLink
                  location="pii_redaction_related"
                  className="text-white underline underline-offset-4"
                >
                  Getting started with OpenRedaction
                </TrackedDocsGettingStartedLink>
              </li>
              <li>
                <Link
                  href="/redact-pii-before-openai"
                  className="text-white underline underline-offset-4"
                >
                  How to redact PII before OpenAI
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/pii-detection-for-ai"
                  className="text-white underline underline-offset-4"
                >
                  Detect &amp; redact PII in LLM prompts and outputs
                </Link>
              </li>
              <li>
                <Link
                  href="/nodejs-redaction"
                  className="text-white underline underline-offset-4"
                >
                  Node.js redaction API
                </Link>
              </li>
              <li>
                <Link
                  href="/pii-detection"
                  className="text-white underline underline-offset-4"
                >
                  PII detection overview
                </Link>
              </li>
              <li>
                <Link
                  href="/security"
                  className="text-white underline underline-offset-4"
                >
                  Security
                </Link>
              </li>
            </ul>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/playground"
                className="inline-flex items-center justify-center rounded-md bg-white px-5 py-3 font-medium text-black transition-colors hover:bg-gray-100"
              >
                Try the playground
              </Link>
              <TrackedDocsGettingStartedLink
                location="pii_redaction_cta"
                className="inline-flex items-center justify-center rounded-md border border-gray-800 bg-black px-5 py-3 font-medium text-white transition-colors hover:bg-gray-900"
              >
                Install with npm
              </TrackedDocsGettingStartedLink>
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
