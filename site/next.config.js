const { withBotId } = require('botid/next/config');
const path = require('path');

// Use core package version for playground script cache-busting
const corePkg = require(path.join(__dirname, '../packages/core/package.json'));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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

