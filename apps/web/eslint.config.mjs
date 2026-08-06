import { FlatCompat } from '@eslint/eslintrc';
import prettierConfig from 'eslint-config-prettier';

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

/**
 * `next/core-web-vitals` + `next/typescript` already bundle their own
 * `eslint-plugin-import` and `@typescript-eslint` plugin instances, which
 * collide if the shared workspace base config (`@plan-b/config/eslint/base`)
 * is spread alongside them -- ESLint's flat config refuses to redefine a
 * plugin under the same name. So this config only reuses the shared base's
 * ignore patterns and Prettier compatibility, and otherwise builds on top
 * of Next's own preset directly.
 */
const config = [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/.turbo/**',
      '**/coverage/**',
      '**/out/**',
      'next-env.d.ts',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // Enforced by folder structure per Phase 1 Sec4 -- a Composite may
      // only import from Primitives/Base, a Pattern only from
      // Composite/Base, and a page.tsx only from Patterns/Composite. The
      // concrete boundary rule (eslint-plugin-boundaries or similar) is
      // wired once the first components exist in a future milestone; this
      // comment marks the permanent contract.
    },
  },
  prettierConfig,
];

export default config;
