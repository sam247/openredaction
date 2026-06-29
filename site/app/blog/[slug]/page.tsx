import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Calendar, ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import BlogPostTracker from "@/components/BlogPostTracker";

// Blog posts data
const blogPosts: { [key: string]: any } = {
  "building-openredaction-developer-journey": {
    title: "Building OpenRedaction: A Regex-First Open Source Story",
    date: "2025-12-04",
    category: "Guide",
    authorName: "Sam Pettiford",
    authorImage: "/author.jpg",
    authorLinkedIn: "https://www.linkedin.com/in/sampettiford/",
    authorBio:
      "Founder of OpenRedaction, focused on building practical privacy infrastructure for developers shipping AI and data-heavy applications.",
    excerpt:
      "Why OpenRedaction was built regex-first, what broke in production, and how deterministic redaction became a practical open-source foundation.",
    content: `
      <p>Most open-source stories start with a vague idea and end with a maintainer's backlog.</p>
      <p>OpenRedaction started with something much more practical: a need for deterministic, self-hosted PII redaction that developers could trust in production. Not a black box. Not a model that behaves differently depending on prompt wording. Not a hosted service that quietly moves sensitive text through infrastructure you do not control. Just a library that takes text in, finds sensitive spans, and redacts them in a way you can inspect, test, and deploy on your own terms.</p>
      <p>That sounds simple, and in many ways it is. But the moment you start applying it to real-world text, the simplicity gets tested. Production text is messy, jurisdiction-specific, full of edge cases, and often far more ambiguous than the clean examples that make it into docs. That tension, between a clean deterministic core and the messy reality of developer workflows, is where OpenRedaction became a real project.</p>
      <p>What follows is the story of why we built it this way, what broke when we tried to apply it at scale, and why the combination of regex-first detection, validators, presets, and aggressive testing turned out to be the right foundation.</p>

      <h2>The starting point</h2>
      <p>The original problem was straightforward: teams needed a way to strip names, emails, phone numbers, addresses, account references, and other identifiers out of text before that text hit logs, exports, analytics pipelines, or external systems.</p>
      <p>At first glance, this looks like a solved problem. In reality, most teams end up with one of three weak patterns:</p>
      <ul>
        <li>They rely on manual review, which does not scale.</li>
        <li>They use a third-party API, which introduces privacy, residency, and procurement friction.</li>
        <li>They bolt together a few regexes, which works until the first false positive, formatting variation, or new jurisdiction-specific identifier.</li>
      </ul>
      <p>The design goal for OpenRedaction was to avoid all three failure modes. We wanted something you could run locally, inside your own infrastructure, without shipping raw text to a vendor. We wanted deterministic output so the same input would always produce the same redacted result. And we wanted the codebase to be readable enough that a security engineer, privacy lead, or skeptical platform team could inspect the patterns and understand exactly what the system would do.</p>
      <p>That is why the project is regex-first. Regex gives you a predictable detection layer. It is not magical, but it is auditable, fast, and easy to reason about. In security-adjacent tooling, that matters more than many people admit.</p>

      <h2>Why regex-first won</h2>
      <p>Regex is often dismissed as basic, but for PII detection it is the right primitive for a large part of the problem space.</p>
      <p>Structured identifiers tend to have structure for a reason. Email addresses, phone numbers, bank identifiers, tax numbers, card formats, and many national ID types are not arbitrary free text. They follow patterns, include delimiters, and often have checksum or format constraints that can be validated without machine learning. That makes them ideal for rule-based detection.</p>
      <p>The key advantage is not just accuracy. It is predictability.</p>
      <p>If a pattern matches, it matches the same way every time. There is no model drift, no hidden inference layer, no surprise dependence on prompt formatting, and no need to explain why one deployment redacted a value while another did not. That matters in compliance reviews, incident response, audit trails, and internal architecture discussions. It also matters to developers who just need a tool they can trust under load.</p>
      <p>That said, regex alone is not enough if you want the tool to survive in production. Real text does not arrive as tidy examples.</p>

      <h2>What production text actually looks like</h2>
      <p>Once OpenRedaction moved beyond simple demo cases, the edge cases showed up immediately.</p>
      <p>Support tickets include broken formatting, copied signatures, accidental JSON fragments, concatenated messages, and quoted history. Logs contain escaped characters, stack traces, query strings, and partial payloads. CSV exports often blur together user input, internal metadata, and cells that are technically text but semantically sensitive. Chat transcripts can contain repeated turns, nested quotes, pasted documents, and partial redactions from upstream systems that need to be recognized rather than treated as fresh text.</p>
      <p>This is where just write a regex stops being a complete answer.</p>
      <p>The real work is in the layers around the patterns:</p>
      <ul>
        <li><strong>Pattern coverage.</strong> You need a broad, maintained library of patterns across multiple jurisdictions and data types, not a single mega-regex that claims to solve everything.</li>
        <li><strong>Validation.</strong> Some identifiers need checksum checks, context checks, or format-aware rules to avoid false positives.</li>
        <li><strong>Priority ordering.</strong> When two patterns overlap, the engine has to know which one wins.</li>
        <li><strong>Redaction modes.</strong> Teams need different output styles depending on whether they are masking for internal use, sanitizing logs, or preparing data for external models.</li>
        <li><strong>Test coverage.</strong> The test suite is not a side effect of the product. It is part of the product.</li>
      </ul>
      <p>That last point became one of the strongest lessons from building the library. In privacy tooling, the test suite is the contract.</p>

      <h2>What we engineered around</h2>
      <p>The project matured by focusing on the boring things that make a privacy library usable in the real world.</p>
      <h3>Pattern breadth</h3>
      <p>Instead of relying on a handful of broad patterns, we expanded the library into a large set of maintained, categorized patterns. That gives teams coverage across common identifiers while still letting them tune what gets detected in their environment.</p>
      <p>This matters because privacy use cases are rarely uniform. A support system in the UK may care about phone numbers, emails, addresses, NHS-style identifiers, and payment references. A healthcare workflow may care more about medical context and patient identifiers. A SaaS product processing enterprise documents may need a very different default profile. A practical redaction engine needs to support those differences without forcing one global opinion.</p>
      <h3>Context and validators</h3>
      <p>Pure pattern matching can overmatch. A number looks like an identifier until it is actually an invoice line item, an internal reference, or part of a benign code sample. That is why we invested in validators and contextual rules that reduce false positives without weakening the detection layer too much.</p>
      <p>This is especially important in developer tools, where false positives can break workflows and cause people to distrust the product. If a privacy tool redacts too aggressively, teams start disabling it. If it redacts too little, they stop relying on it. The balance is hard, but it is the difference between a library that gets installed and one that gets adopted.</p>
      <h3>Presets and modes</h3>
      <p>Another design decision was to make the tool feel deployable rather than theoretical. Teams do not want to assemble a privacy policy from scratch every time. They want sensible defaults they can understand and override.</p>
      <p>That is why presets matter. Different redaction modes are useful in different environments: stricter modes for external outputs, more permissive masking for internal debugging, and compliance-oriented bundles for regulated workflows. The goal is to reduce decision fatigue while still allowing teams to adapt the engine to their risk model.</p>
      <h3>Testing as infrastructure</h3>
      <p>We also treated tests as part of the runtime architecture, not just as a CI checkbox.</p>
      <p>If a pattern changes, the relevant test should fail immediately. If a new jurisdiction-specific format is added, the suite should show whether it creates regressions elsewhere. If a validator improves recall but hurts precision, the tradeoff should be visible in code review. This is how a redaction engine stays honest over time.</p>
      <p>In a project like this, tests are not only about correctness. They are about preserving trust.</p>

      <h2>Why open source mattered</h2>
      <p>Open source was not a branding choice. It was a trust choice.</p>
      <p>Privacy tools are evaluated differently from generic developer libraries. People want to know where the code runs, how the patterns behave, and whether the system introduces a hidden dependency on some external inference service. They want to read the implementation, inspect the rules, and reproduce the output locally.</p>
      <p>MIT licensing, public tests, and visible documentation all support that expectation. If someone doubts a pattern, they can read it. If someone wants to contribute a new detector for a format in their region, they can submit it. If a team wants to run the library in a locked-down environment, they can do that without negotiating a vendor contract.</p>
      <p>That visibility is not just philosophically nice. It is operationally useful. Trust scales when behavior is inspectable.</p>

      <h2>Developer experience became the product</h2>
      <p>As the project matured, it became obvious that correctness alone would not be enough. The library had to be easy to adopt.</p>
      <p>That meant documentation that answered real implementation questions instead of only describing the API surface. It meant examples that showed how the library fits into Node apps, middleware, ingestion jobs, and data pipelines. It meant a browser <a href="/playground">playground</a> where people could test the behavior instantly without creating an account or uploading data into a system they did not trust.</p>
      <p>Developer tools are rarely won by raw capability alone. They are won by reducing friction at the exact moment someone is deciding whether to try them.</p>
      <p>We also found that the more boring the setup looked, the more serious teams engaged with it. A library that can run locally, has clear usage examples, and exposes deterministic behavior is easier to defend internally than a tool that promises magic.</p>

      <h2>The enterprise path without breaking the core</h2>
      <p>One of the hardest balancing acts in open source is deciding where the project ends and the support layer begins.</p>
      <p>The answer for OpenRedaction was to keep the core open and self-hostable, while making it possible for teams to get help when they need it. Some teams just want the library. Others need review support, rollout guidance, or help integrating it into larger workflows. The important thing is that the open core remains useful on its own.</p>
      <p>That separation protects the integrity of the project. It also keeps the main promise intact: use it locally, understand it, and keep control of your data path.</p>

      <h2>What we learned</h2>
      <p>A few lessons became very clear along the way.</p>
      <p>First, transparency beats hype. Security-adjacent libraries do not win by sounding clever. They win by being understandable.</p>
      <p>Second, pattern depth becomes a moat only if you keep pruning false positives. Coverage without maintenance is just technical debt.</p>
      <p>Third, documentation is part of the sales process whether you want it to be or not. If a tool is hard to evaluate, serious teams move on.</p>
      <p>Fourth, limits matter. No pattern-based system will ever guarantee 100 percent detection of every possible PII instance. Saying that clearly builds more trust than claiming perfection.</p>
      <p>Finally, maintenance is the product. Formats drift, regulations change, new identifier types emerge, and customers keep finding new ways to paste sensitive data into places they should not. A redaction engine has to keep pace with that reality.</p>

      <h2>Where it stands now</h2>
      <p>OpenRedaction today is a regex-first, open-source PII detection and redaction library built for developers who want deterministic, auditable, self-hostable behavior. It is designed to run locally, fit into real applications, and provide enough visibility that teams can explain and defend how it works.</p>
      <p>That is the real story.</p>
      <p>Not that PII is easy. Not that regex solves everything. But that a disciplined, inspectable, local-first approach can get you much farther than most people expect when they first start building privacy tooling.</p>
      <p>If you are building developer infrastructure in the same lane, the lessons are probably similar: ship a deterministic core, invest early in tests and docs, be honest about limits, and let the code earn trust.</p>
      <p>OpenRedaction is still evolving, but the principle has not changed. Make the safe path obvious. Make the behavior inspectable. And make privacy a property of the system, not a promise in the README.</p>

      <div style="margin-top: 3rem; padding: 1.5rem; background-color: #111827; border: 1px solid #374151; border-radius: 0.5rem;">
        <h3 style="margin-top: 0; margin-bottom: 1rem; font-size: 1.25rem; font-weight: 600; color: #fff;">Related</h3>
        <ul style="margin-bottom: 0; padding-left: 1.5rem; list-style-type: disc; color: #d1d5db;">
          <li style="margin-bottom: 0.5rem;"><a href="/blog/pii-detection-for-ai" style="color: #fff; text-decoration: underline;">PII detection for AI workflows</a></li>
          <li style="margin-bottom: 0.5rem;"><a href="/blog/pii-in-support-tickets" style="color: #fff; text-decoration: underline;">PII in support tickets &amp; chat</a></li>
          <li style="margin-bottom: 0.5rem;"><a href="/pii-redaction" style="color: #fff; text-decoration: underline;">PII redaction guide</a></li>
          <li style="margin-bottom: 0.5rem;"><a href="/open-source-ai-redaction-tools" style="color: #fff; text-decoration: underline;">Open source AI redaction tools</a></li>
          <li style="margin-bottom: 0.5rem;"><a href="/playground" style="color: #fff; text-decoration: underline;">Playground</a></li>
          <li style="margin-bottom: 0.5rem;"><a href="/docs" style="color: #fff; text-decoration: underline;">Documentation</a></li>
        </ul>
      </div>
    `,
  },
  "pii-detection-for-ai": {
    title: "PII Detection for AI: How to Safely Use User Data with LLMs",
    date: "2025-12-05",
    category: "Guide",
    authorName: "Sam Pettiford",
    authorImage: "/author.jpg",
    authorLinkedIn: "https://www.linkedin.com/in/sampettiford/",
    authorBio:
      "Founder of OpenRedaction, focused on privacy-safe LLM pipelines and production-grade data redaction patterns for modern teams.",
    excerpt:
      "How to detect and redact PII across LLM pipelines with pattern-first controls, optional NER, and infrastructure-level privacy safeguards.",
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
  "pii-in-support-tickets": {
    title:
      "How to Handle PII Safely in Support Tickets, Emails and Chat Transcripts",
    date: "2025-12-11",
    category: "Guide",
    authorName: "Sam Pettiford",
    authorImage: "/author.jpg",
    authorLinkedIn: "https://www.linkedin.com/in/sampettiford/",
    authorBio:
      "Founder of OpenRedaction, writing about practical controls for handling sensitive data in real-world support and product workflows.",
    excerpt:
      "Minimize what support channels store, redact early, and keep agents aligned — practical controls for tickets, email, and chat.",
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

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const post = blogPosts[params.slug];

  if (!post) {
    return {};
  }

  const excerpt =
    post.excerpt ||
    post.content?.replace(/<[^>]*>/g, "").substring(0, 160) ||
    "";

  return generatePageMetadata({
    title: post.title,
    description: excerpt,
    path: `/blog/${params.slug}`,
  });
}

export default async function BlogPost(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const post = blogPosts[params.slug];

  if (!post) {
    notFound();
  }

  // Process content - ensure links have proper styling
  const processedContent = post.content
    .replace(/<a href="([^"]+)">/g, (_match: string, href: string) => {
      if (
        href.startsWith("/") ||
        href.startsWith("https://openredaction.com")
      ) {
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

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight max-w-7xl mx-auto">
              {post.title}
            </h1>

            <div className="flex items-center text-gray-400 text-sm mb-8 gap-2">
              <Calendar size={16} className="mr-1" />
              {post.authorName ? (
                <span>
                  By {post.authorName},{" "}
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              ) : (
                <span>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>

            {post.authorName && (
              <div className="mb-10 rounded-xl border border-gray-800 bg-gray-950/70 p-4 sm:p-5">
                <div className="flex items-start gap-4">
                  {post.authorImage ? (
                    <img
                      src={post.authorImage}
                      alt={`${post.authorName} profile`}
                      className="h-14 w-14 rounded-full border border-gray-700 object-cover"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-full border border-gray-700 bg-gray-900" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">
                      {post.authorName}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-gray-300">
                      {post.authorBio || "Author profile coming soon."}
                    </p>
                    {post.authorLinkedIn ? (
                      <a
                        href={post.authorLinkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex text-sm text-gray-200 underline underline-offset-4 hover:text-white"
                      >
                        LinkedIn profile
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            )}

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
            <style
              dangerouslySetInnerHTML={{
                __html: `
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
            `,
              }}
            />
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
