const { withBotId } = require('botid/next/config');
const path = require('path');

// Use core package version for playground script cache-busting
const corePkg = require(path.join(__dirname, '../packages/core/package.json'));

const removedBlogSlugs = [
  'understanding-pii-detection',
  '10-common-pii-redaction-mistakes',
  '7-pii-redaction-best-practices',
  'data-redaction-vs-masking',
  'manual-vs-automated-pii-redaction',
  'how-to-design-redaction-policy',
  'pii-call-centre-redaction',
  'redacting-legal-documents',
  'what-is-pii',
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return removedBlogSlugs.map((slug) => ({
      source: `/blog/${slug}`,
      destination: '/blog',
      permanent: true,
    }));
  },
  env: {
    NEXT_PUBLIC_OPENREDACTION_VERSION: corePkg.version,
  },
  images: {
    unoptimized: false,
  },
  // Transpile the openredaction package to handle ESM chunks
  transpilePackages: ['openredaction'],
  webpack: (config, { isServer }) => {
    // Ignore Node.js modules that aren't available in the browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        'fs/promises': false,
        worker_threads: false,
        path: false,
        crypto: false,
      };
    }

    return config;
  },
}

module.exports = withBotId(nextConfig)

