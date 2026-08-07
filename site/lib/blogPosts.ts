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
