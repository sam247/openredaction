import { withBotId } from "botid/next/config";
import type { NextConfig } from "next";
import corePkg from "../packages/core/package.json";

/** Soft-404 / retired blog URLs → nearest live guide (not a dump to /blog). */
const removedBlogRedirects: Record<string, string> = {
  "understanding-pii-detection": "/blog/pii-detection-for-ai",
  "10-common-pii-redaction-mistakes": "/pii-redaction",
  "7-pii-redaction-best-practices": "/pii-redaction",
  "data-redaction-vs-masking": "/pii-redaction",
  "manual-vs-automated-pii-redaction": "/pii-redaction",
  "how-to-design-redaction-policy": "/pii-redaction",
  "pii-call-centre-redaction": "/blog/pii-in-support-tickets",
  "redacting-legal-documents": "/use-cases/legal",
  "what-is-pii": "/pii-detection",
};

const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return Object.entries(removedBlogRedirects).map(([slug, destination]) => ({
      source: `/blog/${slug}`,
      destination,
      permanent: true,
    }));
  },
  env: {
    NEXT_PUBLIC_OPENREDACTION_VERSION: corePkg.version,
  },
} satisfies NextConfig;

export default withBotId(nextConfig);
