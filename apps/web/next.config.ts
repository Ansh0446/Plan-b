import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@plan-b/ui', '@plan-b/shared-types'],
  eslint: {
    // Linting runs via `pnpm lint` (Turborepo pipeline) — skip Next's
    // built-in eslint-during-build step to avoid double-running it in CI.
    ignoreDuringBuilds: true,
  },
  images: {
    // User-generated content (uploaded PDFs, thumbnails, previews) is never
    // served from Next's static/image pipeline — it lives in Cloudflare R2
    // and is referenced by URL from the API (Phase 1 §6). Remote patterns
    // are configured once that storage domain is finalized.
    remotePatterns: [],
  },
};

export default nextConfig;
