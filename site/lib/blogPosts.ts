// Blog posts metadata — kept in sync with app/blog/[slug]/page.tsx
export const blogPosts: { [key: string]: any } = {
  'building-openredaction-developer-journey': {
    title: 'Building OpenRedaction: A Regex-First Open Source Story',
    date: '2025-12-04',
    category: 'Guide',
    excerpt:
      'How a small deterministic redaction experiment became a tested open-source library—patterns, trust, and what we learned shipping for privacy-minded developers.',
    slug: 'building-openredaction-developer-journey',
  },
  'pii-detection-for-ai': {
    title: 'PII Detection for AI: How to Safely Use User Data with LLMs',
    date: '2025-12-05',
    category: 'Guide',
    excerpt:
      'Where PII leaks in LLM pipelines, how to architect pattern-first guardrails, and when to add separate ML detection — without sending data you cannot explain.',
    slug: 'pii-detection-for-ai',
  },
  'pii-in-support-tickets': {
    title: 'How to Handle PII Safely in Support Tickets, Emails and Chat Transcripts',
    date: '2025-12-11',
    category: 'Guide',
    excerpt:
      'Minimize what support channels store, redact early, and keep agents aligned — practical controls for tickets, email, and chat.',
    slug: 'pii-in-support-tickets',
  },
};

export function getAllBlogPostSlugs(): string[] {
  return Object.keys(blogPosts);
}
