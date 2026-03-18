// Blog posts data - shared between blog pages and sitemap
export const blogPosts: { [key: string]: any } = {
  'building-openredaction-developer-journey': {
    title: 'From Regex Library to Real API: Building OpenRedaction\'s Developer Journey',
    date: '2025-12-04',
    category: 'Guide',
    excerpt: 'How OpenRedaction evolved from a simple regex-based redaction library into a hosted API with AI-assist, billing and product-grade infrastructure.',
    slug: 'building-openredaction-developer-journey',
  },
  'understanding-pii-detection': {
    title: 'Understanding PII Detection',
    date: '2025-01-15',
    category: 'Guide',
    excerpt: 'Learn what PII is, why detecting it is challenging, and how pattern-based and AI-assisted approaches combine for robust redaction pipelines.',
    slug: 'understanding-pii-detection',
  },
  'pii-detection-for-ai': {
    title: 'PII Detection for AI: How to Safely Use User Data with LLMs',
    date: '2025-12-05',
    category: 'Guide',
    excerpt: 'Learn how PII detection fits into AI workflows, where personal data typically leaks, and how to design a PII-aware architecture using a hybrid pattern-first + AI assist approach.',
    slug: 'pii-detection-for-ai',
  },
  '10-common-pii-redaction-mistakes': {
    title: '10 Common PII Redaction Mistakes Engineers Make (And How to Avoid Them)',
    date: '2025-12-06',
    category: 'Guide',
    excerpt: 'Learn the 10 most common PII redaction mistakes engineers make and how to shut them down before data leaks bite.',
    slug: '10-common-pii-redaction-mistakes',
  },
  '7-pii-redaction-best-practices': {
    title: '7 PII Redaction Best Practices to Protect Customer Data in 2025',
    date: '2025-12-07',
    category: 'Guide',
    excerpt: 'Wise strategies to redact PII in 2025 reveal gaps and invite safer data practices—will you uncover the steps that keep customers protected?',
    slug: '7-pii-redaction-best-practices',
  },
  'data-redaction-vs-masking': {
    title: 'Data Redaction Vs Data Masking: Key Differences and When to Use Each',
    date: '2025-12-08',
    category: 'Guide',
    excerpt: 'Organize your data security choices: explore redaction vs masking and discover when to choose each, but the answer might surprise you—keep reading.',
    slug: 'data-redaction-vs-masking',
  },
  'manual-vs-automated-pii-redaction': {
    title: 'Manual Vs Automated PII Redaction: Pros, Cons and Common Pitfalls',
    date: '2025-12-09',
    category: 'Guide',
    excerpt: 'Weigh manual vs automated PII redaction—pros, cons, and pitfalls—then discover why the right mix matters and what you should consider next.',
    slug: 'manual-vs-automated-pii-redaction',
  },
  'how-to-design-redaction-policy': {
    title: 'How to Design a Basic Redaction Policy for Your SaaS or Internal Tools',
    date: '2025-12-10',
    category: 'Guide',
    excerpt: 'Laying the groundwork for a practical redaction policy can seem daunting—wondering how to start, you\'ll discover a simple, auditable path to follow.',
    slug: 'how-to-design-redaction-policy',
  },
  'pii-in-support-tickets': {
    title: 'How to Handle PII Safely in Support Tickets, Emails and Chat Transcripts',
    date: '2025-12-11',
    category: 'Guide',
    excerpt: 'Describe practical steps to handle PII safely in support tickets, emails, and chat transcripts, and discover what you\'re risking by skipping safeguards.',
    slug: 'pii-in-support-tickets',
  },
  'pii-call-centre-redaction': {
    title: 'PII Redaction in Call Centres: How to Protect Customers on Every Call Recording',
    date: '2025-12-12',
    category: 'Guide',
    excerpt: 'Aiming to shield customers on every call, this guide reveals how to implement automated PII redaction with human checks—but the full method awaits your next step.',
    slug: 'pii-call-centre-redaction',
  },
  'redacting-legal-documents': {
    title: 'Redacting Sensitive Data in Legal Documents: A Practical Starter Guide',
    date: '2025-12-13',
    category: 'Guide',
    excerpt: 'Upholding privacy in legal documents starts here, but the full method reveals pitfalls you won\'t want to miss.',
    slug: 'redacting-legal-documents',
  },
  'what-is-pii': {
    title: 'What Is PII? A Plain-English Guide for Developers and Product Teams',
    date: '2025-12-14',
    category: 'Guide',
    excerpt: 'PII is any data that can identify someone, directly like names or emails, or indirectly when combined with other information. You should treat both direct and indirect identifiers with strict access controls, data minimization, and strong auditing.',
    slug: 'what-is-pii',
  },
};

// Get all blog post slugs for sitemap
export function getAllBlogPostSlugs(): string[] {
  return Object.keys(blogPosts);
}

