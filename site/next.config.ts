import { withBotId } from "botid/next/config";
import type { NextConfig } from "next";
import corePkg from "../packages/core/package.json";

const removedBlogSlugs = [
  "understanding-pii-detection",
  "10-common-pii-redaction-mistakes",
  "7-pii-redaction-best-practices",
  "data-redaction-vs-masking",
  "manual-vs-automated-pii-redaction",
  "how-to-design-redaction-policy",
  "pii-call-centre-redaction",
  "redacting-legal-documents",
  "what-is-pii",
];

const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return removedBlogSlugs.map((slug) => ({
      source: `/blog/${slug}`,
      destination: "/blog",
      permanent: true,
    }));
  },
  env: {
    NEXT_PUBLIC_OPENREDACTION_VERSION: corePkg.version,
  },
} satisfies NextConfig;

export default withBotId(nextConfig);
