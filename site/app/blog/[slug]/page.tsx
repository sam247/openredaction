import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Calendar, ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import { generatePageMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';
import BlogPostTracker from '@/components/BlogPostTracker';

// Blog posts data
const blogPosts: { [key: string]: any } = {
  'building-openredaction-developer-journey': {
    title: 'Building OpenRedaction: A Regex-First Open Source Story',
    date: '2025-12-04',
    category: 'Guide',
    excerpt:
      'How a small deterministic redaction experiment became a tested open-source library—patterns, trust, and what we learned shipping for privacy-minded developers.',
    content: `
      <p>You ship a tiny open-source utility. Then come stars, forks, issues, and pull requests — and a clear message: <em>people want PII-safe text without black boxes.</em></p>

      <p>That’s the arc behind <a href="/">OpenRedaction</a>: a regex-first, self-hostable library built for developers who need <strong>deterministic</strong>, <strong>auditable</strong> redaction. This post is the honest story — what we optimized for, where real-world text pushed us, and what stuck.</p>

      <h2>1. The start: privacy-first, local, boring (in a good way)</h2>

      <ul>
        <li><strong>Origins</strong> — A practical need: strip names, emails, phones, addresses, and dozens of other identifiers from text before logs, exports, or workflows touched the wrong systems.</li>
        <li><strong>Why regex-first</strong> — Same input → same output. No mystery calls, no opaque models in the default path. That matters for compliance conversations, security reviews, and sleep at night.</li>
        <li><strong>Open source</strong> — MIT, GitHub, tests, and docs. If someone doubts a pattern, they can read it. Trust scales when the behavior is inspectable.</li>
      </ul>

      <p><strong>What “good” looked like:</strong> a library you could drop into Node, run entirely on your infra, and defend in an architecture review.</p>

      <h2>2. Real-world text fights back</h2>

      <p>Production text is messy: mixed casing, odd phone formats, jurisdiction-specific IDs, JSON blobs, support tickets, pasted addresses, and false positives that look like PII but aren’t.</p>

      <p>Raw regex alone isn’t enough — so we invested in the <em>boring</em> adjacent layers that make regex usable at scale:</p>

      <ul>
        <li><strong>More (and better) patterns</strong> — Hundreds of maintained types, priorities, and categories — not one mega-regex.</li>
        <li><strong>Validators &amp; context</strong> — Cut false positives without giving up recall on the formats that matter.</li>
        <li><strong>Presets &amp; modes</strong> — GDPR / HIPAA / sector bundles and redaction styles teams actually deploy.</li>
        <li><strong>Tests as the contract</strong> — If it isn’t tested, it isn’t guaranteed. The suite is the product as much as the API surface.</li>
      </ul>

      <p>The through-line: <strong>stay deterministic</strong>, but don’t pretend edge cases don’t exist — engineer for them in the open.</p>

      <h2>3. What we doubled down on</h2>

      <ul>
        <li><strong>Documentation &amp; examples</strong> — Integration should be faster than reinventing regex from scratch.</li>
        <li><strong>Playground on the site</strong> — Try redaction in the browser against sample text; no account, no storage — just the library doing its job.</li>
        <li><strong>Developer ergonomics</strong> — Hooks and patterns that fit real apps, not just demo snippets.</li>
        <li><strong>Enterprise path</strong> — When teams need support, review, or rollout help, <a href="/pricing">we’re reachable</a> — without compromising the open core.</li>
      </ul>

      <h2>4. Distribution is trust</h2>

      <p>Open source isn’t only code — it’s proof. Issues and PRs surface what breaks in the wild; discussions (and a growing <a href="/community">community wall</a>) show who’s betting on the same constraints you are.</p>

      <p>If you’re evaluating a redaction tool, ask: <em>Can I read the rules? Can I run it locally? Can I reproduce the output?</em> That’s the bar we optimize for.</p>

      <h2>5. Lessons that generalize</h2>

      <h3>What worked</h3>
      <ul>
        <li>Transparency beats feature hype for security-adjacent libraries.</li>
        <li>A large, tested pattern set is a moat — but only if you keep pruning false positives.</li>
        <li>Clear docs convert evaluators who already burned time on brittle regex.</li>
      </ul>

      <h3>Hard truths</h3>
      <ul>
        <li>You will never win “100% PII” with patterns alone — honesty in the README beats overclaiming.</li>
        <li>Maintenance is the product: locales, formats, and regulations drift; the library has to keep pace.</li>
        <li>Privacy tools are judged on defaults — keep the safe path obvious.</li>
      </ul>

      <h2>6. Where things stand</h2>

      <p>OpenRedaction today is an open-source, regex-first toolkit: npm package, docs, playground, and patterns you can audit. Self-host for control; engage us when you need enterprise support — not the other way around.</p>

      <p>If that matches how you build, we’d love you in the repo — and on the <a href="/community">community page</a> if you’re happy to say you’re using it.</p>

      <p>If you want the broader intent page, start with the <a href="/pii-redaction">PII redaction guide</a>.</p>
      <p>For a tool comparison, see <a href="/open-source-ai-redaction-tools">open source AI redaction tools</a>.</p>
      <p>For a quick implementation guide, read <a href="/redact-pii-before-openai">How to Redact PII Before Sending Data to OpenAI (Node.js)</a>.</p>

      <h2>7. If you’re building a dev tool in the same lane</h2>

      <ul>
        <li>Ship a <strong>deterministic core</strong> people can reason about.</li>
        <li>Invest early in <strong>tests and docs</strong> — they’re your sales team.</li>
        <li>Prefer <strong>incremental credibility</strong> (real patterns, real users) over a roadmap slide.</li>
        <li>Be explicit about <strong>limits</strong>; developers respect that more than marketing superlatives.</li>
      </ul>

      <h2>Conclusion</h2>

      <p>OpenRedaction’s story isn’t “magic box fixes PII.” It’s <strong>disciplined pattern work</strong>, <strong>open code</strong>, and <strong>operator-friendly defaults</strong> — the kind of foundation teams can actually deploy.</p>

      <p>Explore the code on <a href="https://github.com/sam247/openredaction" target="_blank" rel="noopener noreferrer">GitHub</a>, try the <a href="/playground">playground</a>, or read the <a href="/docs">docs</a> to integrate in your stack.</p>

      <div style="margin-top: 3rem; padding: 1.5rem; background-color: #111827; border: 1px solid #374151; border-radius: 0.5rem;">
        <h3 style="margin-top: 0; margin-bottom: 1rem; font-size: 1.25rem; font-weight: 600; color: #fff;">Next steps</h3>
        <ul style="margin-bottom: 1rem; padding-left: 1.5rem; list-style-type: disc; color: #d1d5db;">
          <li style="margin-bottom: 0.5rem;"><a href="/pii-detection" style="color: #fff; text-decoration: underline;">PII detection guide</a> — concepts and implementation</li>
          <li style="margin-bottom: 0.5rem;"><a href="/blog/pii-detection-for-ai" style="color: #fff; text-decoration: underline;">PII Detection for AI workflows</a> — pattern-first guardrails around LLMs</li>
          <li style="margin-bottom: 0.5rem;"><a href="/nodejs-redaction" style="color: #fff; text-decoration: underline;">Node.js redaction</a> — integration-oriented guide</li>
          <li style="margin-bottom: 0.5rem;"><a href="/community" style="color: #fff; text-decoration: underline;">Community</a> — who’s using Open Redaction</li>
          <li style="margin-bottom: 0.5rem;"><a href="/pricing" style="color: #fff; text-decoration: underline;">Enterprise</a> — support when you need it</li>
          <li style="margin-bottom: 0.5rem;"><a href="/playground" style="color: #fff; text-decoration: underline;">Playground</a> — try it in the browser</li>
          <li style="margin-bottom: 0.5rem;"><a href="/docs" style="color: #fff; text-decoration: underline;">Documentation</a></li>
        </ul>
      </div>
    `,
  },
  'pii-detection-for-ai': {
    title: 'PII Detection for AI: How to Safely Use User Data with LLMs',
    date: '2025-12-05',
    category: 'Guide',
    authorName: '[Your Name]',
    authorBio: 'Placeholder profile text for author credentials and background.',
    excerpt:
      'How to detect and redact PII across LLM pipelines with pattern-first controls, optional NER, and infrastructure-level privacy safeguards.',
    content: `
      <p>Large Language Models (LLMs) are extraordinary at handling messy, unstructured text. They effortlessly parse incomplete sentences, analyze context, and synthesize fluent replies—but that same flexibility makes them eager to absorb anything passed their way: names, email addresses, national IDs, financial details, or confidential documents.</p>
      <p>Without strict boundaries, your AI system can unintentionally become a privacy sink—logging sensitive content across model pipelines, traces, or fine-tuning datasets. The solution is not blind trust, it is visibility and repeatable redaction layers built directly into every boundary of your data flow.</p>
      <p>This guide explores where Personally Identifiable Information (PII) hides within AI systems, how to conceptualize risk, and how modern detection frameworks such as OpenRedaction and our upcoming OpenAI and Express.js packages fit into secure workflows for prompts, retrieval systems, and observability logs.</p>

      <h2>1. The AI Privacy Problem: Unstructured Risk Everywhere</h2>
      <p>The AI development stack is inherently porous. Every message, document, or vector embedding can pass through multiple layers of software, from gateways and middlewares to third-party APIs. Each layer presents unique opportunities for accidental data exposure.</p>
      <h3>Common Injection Points</h3>
      <ul>
        <li><strong>Inbound streams:</strong> User prompts, uploads, and pasted exports (CSV, DOCX, or CRM snapshots).</li>
        <li><strong>Processing layers:</strong> System logs, traces, APM instrumentation, and replay tools used for debugging.</li>
        <li><strong>Storage:</strong> Vector databases, custom embeddings, RAG indexes, and training sets retaining raw payloads.</li>
        <li><strong>Outbound channels:</strong> Model-generated responses that echo user prompts, retrieved snippets, or internal context.</li>
      </ul>
      <p>One interaction can fan out through half a dozen network boundaries, cloud storage, caching layers, message queues, and analytics systems. Treat the first hop (typically the API gateway or Express.js middleware) as your critical control plane. That is where redaction must begin.</p>

      <h2>2. What You Are Actually Protecting Against</h2>
      <p>LLM privacy challenges are rarely about malicious intent, they stem from operational sprawl, where sensitive inputs get replicated or logged unintentionally.</p>
      <ul>
        <li><strong>Accidental logging:</strong> Prompts, completions, and file content copied into observability platforms (Datadog, LogStream, Elastic) that lack structured privacy controls.</li>
        <li><strong>Vendor and residency risk:</strong> Text leaving your legal region or entering subprocessors operated by the model vendor.</li>
        <li><strong>Retrieval leakage (RAG, fine-tuning):</strong> Unredacted chunks reappearing in unrelated completions due to embeddings storing human-identifiable metadata.</li>
        <li><strong>Compliance complexity:</strong> Each duplicate makes GDPR deletion requests and DSARs exponentially harder.</li>
      </ul>
      <p>These risks scale faster than visibility. To manage them, engineers must design PII-aware pipelines, where every text transformation, ingestion step, and storage event is privacy-scoped.</p>

      <h2>3. Pattern-First vs Machine Learning Detection</h2>
      <p>There are two dominant paradigms for detecting sensitive text: pattern-first (regex-based) and ML/NLP-based. The best production systems combine both strategically.</p>
      <h3>Pattern-First (Regex / Rule-Based)</h3>
      <p>Regex-driven detectors catch structured identifiers, emails, phone numbers, credit card numbers, postal codes, and national IDs, with deterministic precision.</p>
      <p><strong>Advantages:</strong></p>
      <ul>
        <li>Fast, local, and auditable.</li>
        <li>Requires no external data processor.</li>
        <li>Easy to embed into existing gateways or Express.js middleware.</li>
      </ul>
      <p>This approach forms step one in any privacy stack, your PII firewall before content ever reaches an LLM API.</p>
      <p>Our upcoming Express.js Redaction Middleware will implement this layer out-of-the-box:</p>
      <pre><code>app.use(require('@openredaction/express-pii')());</code></pre>
      <p>Integrated directly with OpenAI SDK routes, it ensures every prompt and completion is pre-scrubbed using deterministic regex before external transmission.</p>
      <h3>ML / Named Entity Recognition (NER)</h3>
      <p>NER-based models expand detection to unstructured text, names, organizations, and contextual references. They use statistical patterns and embeddings rather than explicit formulas.</p>
      <p><strong>Advantages:</strong></p>
      <ul>
        <li>Powerful for conversational or narrative text.</li>
        <li>Detects entities missed by rigid regex (e.g., "John from Barclays" or "Emma's discharge summary").</li>
      </ul>
      <p><strong>Trade-offs:</strong></p>
      <ul>
        <li>Slower and costlier.</li>
        <li>Adds potential data residency issues, since some frameworks outsource inference.</li>
        <li>Requires additional privacy safeguards if running externally.</li>
      </ul>
      <p><strong>Optimal architecture:</strong></p>
      <ul>
        <li>Run high-precision pattern redaction locally.</li>
        <li>Optionally apply NER within a private VPC.</li>
        <li>Merge spans and enforce single-pass redaction.</li>
      </ul>
      <p>OpenRedaction, and our OpenAI privacy SDK, focuses on step 1, the part you can deploy everywhere, safely, without external API calls.</p>

      <h2>4. Wiring Detection into Your Infrastructure</h2>
      <p>Modern AI apps often integrate dozens of components, with data moving bidirectionally across LLM APIs, vector indices, and analytics dashboards. You need to wire PII detection across all data surfaces that cross a trust boundary.</p>
      <h3>Core Locations for Redaction</h3>
      <p><strong>LLM Gateway / Middleware:</strong><br />Redact request bodies before they leave your secure network.</p>
      <p>Our upcoming Express.js PII Detection Package will expose middleware hooks such as:</p>
      <pre><code>app.use(require('@openredaction/express-pii')());</code></pre>
      <p>Integrated directly with OpenAI SDK routes, it ensures every prompt and completion is pre-scrubbed using deterministic regex before external transmission.</p>
      <p><strong>RAG Pipeline Ingestion:</strong><br />When processing documents for Retrieval-Augmented Generation, redact text early before embeddings and chunking. That way, your vector database never stores raw identifiers.</p>
      <p><strong>Log and Trace Streams:</strong><br />Scrub payloads before they hit APM systems or cloud observability tools. Use stream filters that detect and mask sensitive tokens in the log formatter.</p>
      <p><strong>Response Path (Echo Suppression):</strong><br />Scan generated replies before storage or display. Models can inadvertently echo user inputs; suppression filters prevent accidental resurfacing of PII.</p>
      <p>This architecture is simple but powerful: every layer performs a privacy check just before data exits its internal domain.</p>

      <h2>5. Redaction Style and Consistency</h2>
      <p>Redaction strategy defines how PII is represented post-sanitization. Consistency beats cleverness, auditors prefer a stable, predictable approach.</p>
      <h3>Placeholder vs Partial Masking</h3>
      <ul>
        <li>Full placeholders (e.g., {{EMAIL_REDACTED}}) are best for external model interactions.</li>
        <li>Partial masking (e.g., jo***@domain.com) is suitable only for internal dashboards or controlled analytics.</li>
      </ul>
      <p>Document your chosen style, apply it globally across pipelines, and version-control redaction schemas as part of data governance metadata.</p>
      <p>Our OpenAI redaction package will support both strategies with schema validation, allowing developers to pick between tokenization, reversible pseudonyms, or irreversible placeholders.</p>

      <h2>6. Proving It Works: Verification and Audit</h2>
      <p>Privacy assurance is not theoretical, it requires continuous, automated proof. Build regression pipelines that simulate realistic scenarios across your AI stack.</p>
      <ul>
        <li>Synthetic PII regression tests: Generate fake data, emails, IDs, card numbers, and feed it through your gateway to ensure redaction consistency.</li>
        <li>Search audits: Periodically scan vector databases and log stores using regex patterns or hash-checks for synthetic markers.</li>
        <li>Latency measurement: Maintain a defined threshold (e.g., less than 50ms per prompt redaction). If performance drops, teams may bypass redaction under pressure, a major security risk.</li>
      </ul>
      <h3>Example Audit Flow</h3>
      <ul>
        <li>Inject canary values (e.g., test-3456-email@piitest.co.uk) into prompts.</li>
        <li>Verify they never appear in logs, embedding vectors, or LLM responses.</li>
        <li>Generate compliance reports referencing test timestamps and sanitized outputs.</li>
      </ul>
      <p>This cycle creates active assurance, privacy that operates as part of CI/CD rather than afterthought compliance.</p>

      <h2>7. Integrating with the OpenAI SDK</h2>
      <p>Our upcoming OpenAI Redaction SDK for Node.js provides native interoperation with the official OpenAI client, letting developers hook redaction logic directly into model calls.</p>
      <pre><code>import { redactPII } from '@openredaction/openai';
import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_KEY });

async function safeCompletion(prompt) {
  const sanitized = await redactPII(prompt);
  return client.chat.completions.create({
    model: 'gpt-5-turbo',
    messages: [{ role: 'user', content: sanitized }],
  });
}</code></pre>
      <p>This ensures sensitive data is removed before transmission, preserving compliance across GDPR, CCPA, and DPA 2018 (UK). The SDK adds:</p>
      <ul>
        <li>Adjustable regex libraries (PCI, HIPAA, UK/US standards).</li>
        <li>Redaction logging to your local audit files.</li>
        <li>Built-in Express middlewares for auto-scrubbing inbound JSON bodies.</li>
      </ul>
      <p>Together, the Express.js middleware and OpenAI SDK hooks create a fully enclosed privacy perimeter, covering data entry, model invocation, and log retention uniformly.</p>

      <h2>8. Deployment Patterns for Self-Hosted Privacy</h2>
      <p>For enterprise compliance, you may choose to host redaction infrastructure locally rather than through a cloud processor.</p>
      <h3>Recommended Setup</h3>
      <ul>
        <li>Self-hosted detector service: Run OpenRedaction or our upcoming Express package within a secure Kubernetes namespace.</li>
        <li>Isolated ingress queue: All inbound requests are queued and sanitized before API forwarding.</li>
        <li>Environment separation: Maintain distinct namespaces for preprocessing (redaction) and postprocessing (response capture).</li>
        <li>Config audit log: Persist redaction configurations as YAML in version control for reproducibility.</li>
      </ul>
      <p>This architecture parallels zero-trust design, assuming each node is potentially untrusted and enforcing privacy at every hop.</p>

      <h2>9. Compliance and Governance Alignment</h2>
      <p>Effective PII detection is not just an engineering safeguard, it satisfies legal and ethical obligations under modern privacy frameworks.</p>
      <p>Your stack should explicitly reference:</p>
      <ul>
        <li>GDPR Articles 5, 25 (Data minimization and Privacy by Design).</li>
        <li>UK Data Protection Act (2018) Schedule 1.</li>
        <li>SOC 2 Type II Security and Processing Integrity Controls.</li>
        <li>ISO 27701 Extension for Privacy Information Management.</li>
      </ul>
      <p>By incorporating automated redaction, your organization meets the appropriate technical and organizational measures clause, proving that PII exposure is not accidental, but actively prevented.</p>

      <h2>10. The Path Forward</h2>
      <p>PII detection in LLM pipelines is no longer optional, it is structural. As AI workloads move into production, regulators, auditors, and enterprise clients expect verifiable privacy constraints.</p>
      <p>Through our upcoming OpenAI integration and Express.js packages, teams will be able to deploy end-to-end safeguards with:</p>
      <ul>
        <li>Local, deterministic redaction.</li>
        <li>Seamless embedding into any API route or AI service.</li>
        <li>Full visibility and proof through audit-ready logs.</li>
      </ul>
      <p>Combined with OpenRedaction&apos;s regex-first precision, these tools form a privacy-first foundation for AI developers handling real-world data.</p>

      <h2>Closing Thought</h2>
      <p>In the era of generative computation, the true measure of responsible AI is not what models can learn, but what data they never see.</p>
      <p>Detection and redaction are invisible victories: each scrubbed identifier represents one less compliance nightmare, one more proof of operational maturity. Redaction is not bureaucracy, it is architecture.</p>

      <div style="margin-top: 2.5rem; padding: 1.25rem; background-color: #0f172a; border: 1px solid #334155; border-radius: 0.5rem;">
        <h3 style="margin-top: 0; margin-bottom: 0.5rem; font-size: 1.1rem; font-weight: 600; color: #fff;">Author</h3>
        <p style="margin: 0; color: #cbd5e1;"><strong>[Your Name]</strong> — Placeholder profile text for author credentials and background.</p>
      </div>

      <p style="margin-top: 2rem;">Questions or rollout help: <a href="/contact">contact</a> · <a href="/pricing">enterprise</a>.</p>

      <div style="margin-top: 3rem; padding: 1.5rem; background-color: #111827; border: 1px solid #374151; border-radius: 0.5rem;">
        <h3 style="margin-top: 0; margin-bottom: 1rem; font-size: 1.25rem; font-weight: 600; color: #fff;">Related</h3>
        <ul style="margin-bottom: 0; padding-left: 1.5rem; list-style-type: disc; color: #d1d5db;">
          <li style="margin-bottom: 0.5rem;"><a href="/blog/pii-in-support-tickets" style="color: #fff; text-decoration: underline;">PII in support tickets &amp; chat</a></li>
          <li style="margin-bottom: 0.5rem;"><a href="/blog/building-openredaction-developer-journey" style="color: #fff; text-decoration: underline;">How OpenRedaction is built</a></li>
          <li style="margin-bottom: 0.5rem;"><a href="/playground" style="color: #fff; text-decoration: underline;">Playground</a></li>
          <li style="margin-bottom: 0.5rem;"><a href="/nodejs-redaction" style="color: #fff; text-decoration: underline;">Node.js integration</a></li>
        </ul>
      </div>
    `,
  },
  'pii-in-support-tickets': {
    title: 'How to Handle PII Safely in Support Tickets, Emails and Chat Transcripts',
    date: '2025-12-11',
    category: 'Guide',
    authorName: 'Sam Pettiford',
    authorBio: 'Placeholder bio: privacy engineer and builder focused on practical data protection systems for modern support operations.',
    excerpt: 'Minimize what support channels store, redact early, and keep agents aligned — practical controls for tickets, email, and chat.',
    content: `
      <p>Customer support is a paradoxical frontline in data security: it is where users come seeking help and often hand over their most private information in the process. Between urgent troubleshooting and unscripted human dialogue, sensitive identifiers appear freely in emails, ticket comments, and live chat. Passwords, card numbers, tax IDs, and even medical context routinely find their way into support threads, creating high exposure risk across systems never designed for long-term storage of personal data.</p>
      <p>To handle Personally Identifiable Information (PII) safely, assume every inbound support channel will receive sensitive data. Then design for least collection, early redaction, and short retention, a data minimization triad that should shape every interaction, policy, and pipeline across your helpdesk stack.</p>

      <h2>1. What Shows Up Most Often</h2>
      <p>Support datasets typically contain a predictable pattern of privacy hazards, each with distinct technical implications:</p>
      <ul>
        <li><strong>Contact and account identifiers:</strong> Full name, email address, phone numbers, physical addresses, and account references. These form the baseline of contextual identity and are commonly indexed across CRM connectors.</li>
        <li><strong>Government and financial IDs:</strong> National insurance numbers, tax IDs, partial or full credit card numbers, and bank details. These trigger PCI-DSS and GDPR sensitivity thresholds if stored unencrypted.</li>
        <li><strong>Credentials:</strong> Passwords, one-time passcodes (OTPs), private API keys, and session tokens often surface as users "paste to debug." These represent critical authentication artifacts and warrant immediate redaction.</li>
        <li><strong>Health or regulated context:</strong> In sectors intersecting medical or financial systems, chat transcripts can contain regulated patient data, ICD-10 codes, or insurance reference numbers, invoking HIPAA or FCA confidentiality standards.</li>
        <li><strong>Quasi-identifiers:</strong> Order numbers, device IDs, timestamps, and geographic data. While innocuous individually, combinations can lead to re-identification attacks, where anonymized records are reversed into identifiable profiles using common data points.</li>
      </ul>
      <p>Together, these elements turn every customer message into a data security liability. Even a single support ticket can meet definitions of personal data under GDPR Article 4(1). That is why technical and operational controls must apply from message ingestion, not only at rest.</p>

      <h2>2. Policy: Collect the Minimum</h2>
      <p>Effective PII handling begins with policy, not software. Define precisely which data agents may request, what customers may volunteer, and what must be blocked or deleted automatically.</p>
      <ul>
        <li><strong>Scope Definition:</strong> Catalogue every field handled in your support platform (Zendesk, Intercom, or custom CRM). Map each field to its business purpose and lawful basis for processing under Article 6 of GDPR.</li>
        <li><strong>Structured Inputs:</strong> Replace free-text fields with controlled input widgets wherever possible. For example, use dropdowns for account type instead of letting users write identifiers into text areas.</li>
        <li><strong>Consent Barriers:</strong> Configure form logic to restrict uploads or text entry of card numbers or passwords. Validation regexes help pre-screen common numeric patterns (e.g., Luhn-check for card digits).</li>
        <li><strong>Documentation:</strong> Record why each data element is collected, its maximum retention period, and the security classification. ISO/IEC 27001 frameworks require such justification for audit compliance.</li>
      </ul>
      <p>The principle here is data by design, not reaction. Avoid storing what you do not need to resolve a ticket, and assume customer messages will always contain extra data you never asked for.</p>

      <h2>3. Technical Controls: Engineering for Redaction, Masking, and Retention</h2>
      <p>Policy serves as intent; engineering delivers enforcement. Modern support infrastructure can leverage machine learning, pattern libraries, encryption, and structured retention to ensure PII is instantly contained.</p>

      <h3>Ingest-Time Redaction</h3>
      <p>The first opportunity for defense is at message ingestion. Configure automated scrubbing pipelines that detect patterns (regex-based or ML-managed) before indexing content into your ticket store or message database.</p>
      <ul>
        <li><strong>Pattern libraries:</strong> Create detection modules for card formats, IBANs, government IDs, and email regexes. These run as pre-processors inside ETL jobs.</li>
        <li><strong>AI-assisted redaction:</strong> Use NLP models trained on conversational PII contexts. These outperform simple regex in identifying embedded credentials or health data within free-text support requests.</li>
        <li><strong>Attachment screening:</strong> PDFs and screenshots must pass through OCR + entity detection before storage. If PII appears, redact pixel regions or discard entirely.</li>
      </ul>
      <p>The guiding concept is PII should never reach replication or search indexing unfiltered. Detect and mutate content immediately, before it becomes part of a retrievable corpus.</p>

      <h3>Display Masking</h3>
      <p>Even when PII is legitimately captured, it should not be freely visible. Implement layered visibility using UI masking and role-based access control (RBAC):</p>
      <ul>
        <li>Default views show truncated identifiers: only last 4 digits of card or account numbers should remain.</li>
        <li>Break-glass access: require elevated roles (e.g., security lead or compliance officer) to view raw data through audited access events.</li>
        <li>Tokenization systems: Replace identifiers with reversible tokens stored in a dedicated, encrypted vault with AES-256 encryption keys managed via HSM (Hardware Security Module).</li>
      </ul>
      <p>This ensures operational efficiency for agents while maintaining strict visibility segregation between front-line support and administrative staff.</p>

      <h3>Retention and Lifecycle Controls</h3>
      <p>Retention policies should follow the TTL-first approach, where time-to-live determines storage expiry automatically.</p>
      <ul>
        <li>Short transcript TTL: Unredacted conversation stores should auto-delete within 30-90 days. Persistent analytics or QA archives should only retain sanitized versions.</li>
        <li>Immutable audit versions: Keep minimal metadata, ticket ID, timestamp, category, for compliance reporting without retaining user text.</li>
        <li>Encrypted storage: All sensitive indices must use field-level encryption. Secrets management should rotate keys periodically (every 90 days recommended) using automated vault policies.</li>
        <li>Deletion pipelines: Automated expunge routines should run on schedule, ensuring no long-term drift between policy and practice.</li>
      </ul>

      <h3>Export Hygiene</h3>
      <p>Data exports represent a common leakage path. CSV and PDF exports must include scrub functions before leaving the helpdesk environment:</p>
      <ul>
        <li>Run pre-export data sanitization via Lambda or worker queue.</li>
        <li>Exclude raw identifiers unless explicitly authorized.</li>
        <li>Tag exports with compliance tracking metadata (e.g., GDPR lawful basis code, request timestamp).</li>
      </ul>

      <h2>4. Agent Workflow: Training for Threat Mitigation</h2>
      <p>Human error is often more dangerous than any API leak. Even the most technically secure support system fails if agents mishandle content. Agent workflows must therefore embed best practices directly into user experience.</p>
      <ul>
        <li><strong>Training:</strong> Incorporate real-world examples showing how customer copy-paste behavior can violate PCI or HIPAA rules. Teach "never ask for full card numbers, passwords, or identifiers."</li>
        <li><strong>Secure upload mechanisms:</strong> When verification is genuinely required, agents should direct users to secure upload portals using HTTPS + client-side encryption for files.</li>
        <li><strong>Redaction and annotation:</strong> When sensitive data appears, the agent should immediately redact or delete the surplus and record why. Example: "Redacted full card number accidentally pasted by user."</li>
        <li><strong>Escalation protocols:</strong> Fraud or abuse tickets should route to restricted queues with distinct permission tiers, isolating exposure from standard L1 environments.</li>
      </ul>
      <p>Reinforce training through interface design, contextual warnings, auto-redact shortcuts, and validation logic all help operationalize good privacy hygiene.</p>

      <h2>5. Playbooks for Edge Cases</h2>
      <p>Technical policy alone cannot capture the nuance of live interaction. Support teams thrive on micro playbooks, concise one-page guides for common PII events. Examples:</p>
      <ul>
        <li><strong>Customer pasted card info:</strong> Immediately redact all but final four digits. Confirm metadata removal, log event under "PCI inadvertent exposure," and tag for review.</li>
        <li><strong>User shared child's name or medical note:</strong> Flag for privacy review, restrict visibility, and notify compliance officer if data meets regulated health criteria.</li>
        <li><strong>Attachment appears medical or financial:</strong> Quarantine file in isolated bucket with restricted access. Run automated entity recognition before restoring access.</li>
      </ul>
      <p>Each playbook should specify who can view raw content, how to document remediation, and when legal or data protection officers must be contacted. These bite-sized responses outperform lengthy policy PDFs, crucial when agents must act quickly under real-time pressure.</p>

      <h2>6. Auditing What You Actually Store</h2>
      <p>Without regular validation, even the most refined strategy decays under operational drift. Implement continuous audit cycles across support data to identify leakage or non-compliance.</p>
      <ul>
        <li>Monthly sampling: Select a random batch of tickets across all channels. Run regex searches for common patterns, credit card BINs, email structures, tax ID formats.</li>
        <li>Tier validation: If PII exists within wrong storage tiers (e.g., analytics warehouse vs live helpdesk DB), fix ingestion pipelines, not only the agent memo.</li>
        <li>Metadata analysis: Inspect logs for unusual access patterns to masked fields. Audit RBAC integrity and break-glass events.</li>
        <li>Automated compliance reporting: Integrate results with governance platforms like OneTrust or Azure Purview to maintain visibility and produce proof for external audits.</li>
      </ul>
      <p>This establishes a feedback loop proving that privacy measures exist not just in theory but in measurable operational outcomes.</p>

      <h2>7. Designing for Privacy-Resilient Infrastructure</h2>
      <p>Security culture should evolve alongside infrastructure. Consider architectural upgrades that embed privacy at the framework level:</p>
      <ul>
        <li>Privacy proxies: Route inbound emails through middleware that strips identifiers. Systems like AWS Clean Rooms or custom Kubernetes microservices can implement regex + ML redaction at message ingestion.</li>
        <li>Message queue isolation: Use separate queues for raw vs redacted messages (e.g., SQS/Azure Service Bus partitions) with distinct IAM roles.</li>
        <li>Logging minimalism: Application logs should obfuscate identifiers before write. Use pseudonymization for debugging rather than exposing ticket data.</li>
        <li>Cross-service encryption standards: Enforce AES-256 for transit and rest, enable TLS 1.3 transport, and maintain key custody under dedicated vaults.</li>
      </ul>
      <p>This level of architectural embedding ensures data safety even under complex service meshes and distributed workloads across hybrid clouds.</p>

      <h2>8. The Operational Philosophy of Support Privacy</h2>
      <p>Customer support PII risk is not solved by a single secure feature. It is an operational philosophy combining defaults, tooling, and training. Secure data pathways mean little if retention logic misfires or if agents casually copy transcripts into personal inboxes.</p>
      <ul>
        <li><strong>Redact early.</strong> Every unredacted minute increases exposure across caches, search indices, and notification systems.</li>
        <li><strong>Retain less.</strong> Short-term visibility with long-term safety. Metrics and summaries suffice for quality assurance without full content retention.</li>
        <li><strong>Prove compliance.</strong> Use audit sampling, log integrity checks, and documented deletion reports to demonstrate ongoing adherence.</li>
      </ul>
      <p>The goal is clear: make privacy enforcement routine, not exceptional. By treating PII handling as part of core architecture design, just like scalability or uptime, you create a support environment resilient by default.</p>
      <p>In every ticket, email, or chat, PII risk is operational, not incidental. Build your systems to detect, redact, and forget. The most secure support platform is not the one with the hardest encryption, it is the one that retains the least data possible and can prove it continuously.</p>

      <div style="margin-top: 2.5rem; padding: 1.25rem; background-color: #0f172a; border: 1px solid #334155; border-radius: 0.5rem;">
        <h3 style="margin-top: 0; margin-bottom: 0.5rem; font-size: 1.1rem; font-weight: 600; color: #fff;">Author</h3>
        <p style="margin: 0; color: #cbd5e1;"><strong>Sam Pettiford</strong> — Placeholder profile text for author bio and credentials.</p>
      </div>

      <div style="margin-top: 3rem; padding: 1.5rem; background-color: #111827; border: 1px solid #374151; border-radius: 0.5rem;">
        <h3 style="margin-top: 0; margin-bottom: 1rem; font-size: 1.25rem; font-weight: 600; color: #fff;">Related</h3>
        <ul style="margin-bottom: 0; padding-left: 1.5rem; list-style-type: disc; color: #d1d5db;">
          <li style="margin-bottom: 0.5rem;"><a href="/blog/pii-detection-for-ai" style="color: #fff; text-decoration: underline;">PII detection for AI &amp; LLM pipelines</a></li>
          <li style="margin-bottom: 0.5rem;"><a href="/pii-detection" style="color: #fff; text-decoration: underline;">PII detection guide</a></li>
          <li style="margin-bottom: 0.5rem;"><a href="/playground" style="color: #fff; text-decoration: underline;">Try redaction in the playground</a></li>
          <li style="margin-bottom: 0.5rem;"><a href="/docs" style="color: #fff; text-decoration: underline;">Documentation</a></li>
        </ul>
      </div>
    `,
  },

};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPosts[params.slug];

  if (!post) {
    return {};
  }

  const excerpt = post.excerpt || post.content?.replace(/<[^>]*>/g, '').substring(0, 160) || '';

  return generatePageMetadata({
    title: post.title,
    description: excerpt,
    path: `/blog/${params.slug}`,
  });
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug];

  if (!post) {
    notFound();
  }

  // Process content - ensure links have proper styling
  const processedContent = post.content
    .replace(/<a href="([^"]+)">/g, (_match: string, href: string) => {
      if (href.startsWith('/') || href.startsWith('https://openredaction.com')) {
        return `<a href="${href}" style="color: #fff; text-decoration: underline; hover:color: #d1d5db;">`;
      }
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color: #fff; text-decoration: underline;">`;
    })
    .trim();

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <BlogPostTracker slug={params.slug} title={post.title} />
      
      <main className="pt-[148px] pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Blog
          </Link>

          <article>
            <div className="mb-6">
              <span className="text-xs font-medium text-gray-400 bg-gray-800 px-2 py-1 rounded">
                {post.category}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight max-w-7xl mx-auto">{post.title}</h1>
            
            <div className="flex items-center text-gray-400 text-sm mb-8 gap-2">
              <Calendar size={16} className="mr-1" />
              {post.authorName ? (
                <span>
                  By {post.authorName},{' '}
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              ) : (
                <span>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              )}
            </div>

            <div 
              className="blog-content prose prose-invert prose-lg max-w-none
                prose-headings:text-white prose-headings:font-semibold
                prose-h1:text-3xl prose-h1:font-bold prose-h1:mt-8 prose-h1:mb-4
                prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-8 prose-h2:mb-6 prose-h2:leading-tight
                prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-4 prose-h3:leading-tight
                prose-p:text-gray-300 prose-p:mb-6 prose-p:leading-7 prose-p:text-base
                prose-a:text-white prose-a:underline prose-a:hover:text-gray-300
                prose-strong:text-white prose-strong:font-semibold
                prose-code:text-green-400 prose-code:bg-gray-900 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800 prose-pre:rounded prose-pre:p-4
                prose-ul:text-gray-300 prose-ul:my-6 prose-ul:pl-6 prose-ul:space-y-2
                prose-li:text-gray-300 prose-li:my-1 prose-li:leading-7 prose-li:text-base
                prose-hr:border-gray-800 prose-hr:my-10 prose-hr:border-t
                prose-blockquote:border-l-gray-800 prose-blockquote:text-gray-400"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />
            <style dangerouslySetInnerHTML={{ __html: `
              .blog-content p {
                margin-bottom: 1.5rem !important;
                line-height: 1.75 !important;
              }
              .blog-content ul {
                margin-top: 1.5rem !important;
                margin-bottom: 1.5rem !important;
              }
              .blog-content li {
                margin-top: 0.5rem !important;
                margin-bottom: 0.5rem !important;
                line-height: 1.75 !important;
              }
              .blog-content h2 {
                margin-top: 2.5rem !important;
                margin-bottom: 1.5rem !important;
              }
              .blog-content h3 {
                margin-top: 2rem !important;
                margin-bottom: 1rem !important;
              }
              .blog-content hr {
                margin-top: 2.5rem !important;
                margin-bottom: 2.5rem !important;
              }
            `}} />
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
