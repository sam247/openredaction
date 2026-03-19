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
    excerpt: 'Where PII leaks in LLM pipelines, how to architect pattern-first guardrails, and when to add separate ML detection — without sending data you cannot explain.',
    content: `
      <p>LLMs excel at messy text — and they will happily absorb names, emails, IDs, and pasted documents unless you control what crosses the boundary. If user data reaches a model or a log, you need <strong>visibility</strong> and a <strong>repeatable redaction layer</strong>, not hope.</p>

      <p>This guide maps where PII appears around AI systems, how to think about risk, and how a <strong>pattern-first</strong>, self-hosted detector (like <a href="/">OpenRedaction</a>) fits at gateways, RAG ingestion, and logging. For implementation detail, start with the <a href="/pii-detection">PII detection guide</a> and <a href="/docs/getting-started">docs</a>.</p>

      <h2>Where PII hides</h2>
      <ul>
        <li><strong>Inbound:</strong> prompts, uploads (PDF/DOCX/CSV), CRM exports pasted into chat, email threads, transcripts.</li>
        <li><strong>Processing:</strong> request/response logs, traces, replay tools, feature stores.</li>
        <li><strong>Storage:</strong> vector DBs, fine-tuning sets, warehouses that retain “raw prompts for debugging.”</li>
        <li><strong>Outbound:</strong> model replies that echo user input or retrieved chunks.</li>
      </ul>
      <p>One message can fan out across many systems — treat the <strong>first hop</strong> (gateway / worker) as the main control point.</p>

      <h2>What you are actually protecting against</h2>
      <ul>
        <li><strong>Accidental logging</strong> of prompts and completions in shared observability stacks.</li>
        <li><strong>Vendor and residency risk</strong> when text leaves your region or subprocessors.</li>
        <li><strong>RAG / training leakage</strong> when unredacted chunks reappear in unrelated answers.</li>
        <li><strong>Compliance load</strong> — DSARs and deletion get harder every time PII is copied “just in case.”</li>
      </ul>

      <h2>Pattern-first vs ML — and how they combine</h2>
      <p><strong>Regex / rules</strong> catch structured identifiers (emails, phones, cards, many national IDs). They are fast, deterministic, and auditable — ideal as the default gate before anything hits an LLM API.</p>
      <p><strong>NER / ML models</strong> help with names, organizations, and messy prose, but add cost, latency, and often <strong>another data processor</strong>. Many teams run them only on segments that policy allows, or only inside a VPC.</p>
      <p>A solid production pattern: <strong>(1)</strong> run high-precision pattern redaction locally; <strong>(2)</strong> optionally run a separate NER pass where legal/security approves the data flow; <strong>(3)</strong> merge spans and redact once. OpenRedaction focuses on step 1 — the part every team can deploy everywhere without external calls.</p>

      <h2>Where to wire detection</h2>
      <ul>
        <li><strong>LLM gateway / middleware</strong> — redact request bodies before they leave your network.</li>
        <li><strong>RAG ingest</strong> — extract text → redact → chunk/embed so the index never stores raw identifiers.</li>
        <li><strong>Log and trace sinks</strong> — scrub payloads before they reach third-party APM.</li>
        <li><strong>Response path</strong> — scan model output before it is stored or shown (echo suppression).</li>
      </ul>

      <h2>Redaction style</h2>
      <p>For external models, prefer <strong>full placeholders</strong> or tokens over partial leaks. Partial masking is for tightly controlled internal tools. Pick one strategy per pipeline and document it — auditors care that it is consistent, not clever.</p>

      <h2>Prove it works</h2>
      <ul>
        <li>Regression tests with synthetic PII through your real gateway.</li>
        <li>Periodic searches in logs and vector stores for canary values.</li>
        <li>Latency budget for the redaction step so teams do not bypass it under load.</li>
      </ul>

      <h2>OpenRedaction in this stack</h2>
      <p>OpenRedaction is an open-source, regex-first library you run on your own hardware: large pattern set, validators, presets, deterministic output. Use it at the edges above; pair with other tooling if your policy requires ML coverage for free-text names.</p>

      <p>Questions or rollout help: <a href="/contact">contact</a> · <a href="/pricing">enterprise</a>.</p>

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
    excerpt: 'Minimize what support channels store, redact early, and keep agents aligned — practical controls for tickets, email, and chat.',
    content: `
      <p>Support is where customers paste passwords, card numbers, and medical context into the thread. Assume <strong>every channel</strong> (ticket, email, chat) will receive PII — then design for least collection, early redaction, and short retention.</p>

      <h2>What shows up most often</h2>
      <ul>
        <li>Contact and account identifiers: name, email, phone, address, account numbers.</li>
        <li>Government and financial: tax IDs, partial or full card numbers, bank details.</li>
        <li>Credentials: passwords, OTPs, API keys pasted “to help debug.”</li>
        <li>Health and sensitive context when your product touches regulated domains.</li>
        <li>Quasi-identifiers: order IDs, device IDs, timestamps + geography that re-identify when combined.</li>
      </ul>

      <h2>Policy: collect the minimum</h2>
      <ul>
        <li>Define what agents may <strong>ask for</strong> vs what customers may <strong>volunteer</strong> — block or delete what you do not need.</li>
        <li>Use structured fields where possible so free-text notes carry less sensitive narrative.</li>
        <li>Document <strong>why</strong> each data element is retained and for how long.</li>
      </ul>

      <h2>Technical controls</h2>
      <ul>
        <li><strong>Ingest-time redaction</strong> — run automated detection on inbound messages and attachments before indexing or replication (pattern libraries work well for structured PII).</li>
        <li><strong>Display masking</strong> — default UI shows truncated tokens; reveal full detail only with role-based break-glass.</li>
        <li><strong>Retention</strong> — shorter TTL on full transcript stores; archive redacted summaries for metrics.</li>
        <li><strong>Exports</strong> — scrub before CSV/PDF leaves the helpdesk.</li>
      </ul>

      <h2>Agent workflow</h2>
      <ul>
        <li>Train: never ask for full card numbers or passwords; use secure upload links or verified flows.</li>
        <li>When PII appears anyway, redact or delete the surplus and note <em>why</em> in the ticket.</li>
        <li>Escalation queues for fraud or abuse — separate permissions from general L1.</li>
      </ul>

      <h2>Playbooks for edge cases</h2>
      <p>One-page flows beat policy PDFs: “customer pasted card,” “user posted child’s name,” “attachment might be medical.” Pair each with redaction steps, who can view raw content, and when legal must be involved.</p>

      <h2>Audit what you actually stored</h2>
      <p>Sample tickets monthly. Search for patterns (card BINs, email regex, national ID formats). If hits appear in the wrong tier of storage, fix the pipeline — not the agent memo.</p>

      <h2>Conclusion</h2>
      <p>Support PII risk is operational: defaults, tooling, and training matter more than a single “secure” product checkbox. Redact early, retain less, and prove it with sampling.</p>

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
            
            <div className="flex items-center text-gray-400 text-sm mb-8">
              <Calendar size={16} className="mr-2" />
              {new Date(post.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
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
