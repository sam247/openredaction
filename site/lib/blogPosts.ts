// Blog posts metadata — kept in sync with app/blog/[slug]/page.tsx
export const blogPosts: { [key: string]: any } = {
  "building-openredaction-developer-journey": {
    title: "Building OpenRedaction: A Regex-First Open Source Story",
    date: "2025-12-04",
    category: "Guide",
    excerpt:
      "How a small deterministic redaction experiment became a tested open-source library—patterns, trust, and what we learned shipping for privacy-minded developers.",
    slug: "building-openredaction-developer-journey",
  },
  "pii-detection-for-ai": {
    title:
      "How to Detect and Redact PII in LLM Prompts Before They Reach the Model",
    date: "2025-12-05",
    category: "Guide",
    excerpt:
      "Detect and redact PII in LLM inputs and outputs locally—before prompts hit vendors, logs, or RAG indexes. Pattern-first guardrails for AI pipelines.",
    slug: "pii-detection-for-ai",
  },
  "pii-in-support-tickets": {
    title: "How to Handle PII in Customer Support Tickets, Email & Chat",
    date: "2025-12-11",
    category: "Guide",
    excerpt:
      "Is your helpdesk leaking customer PII? Practical redaction, retention, and agent workflows for Zendesk, Intercom, email, and chat.",
    slug: "pii-in-support-tickets",
  },
};

export function getAllBlogPostSlugs(): string[] {
  return Object.keys(blogPosts);
}
