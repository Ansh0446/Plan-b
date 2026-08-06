import type { Config } from 'tailwindcss';

/**
 * Shared Tailwind preset. Design tokens (color, spacing, radius, type scale)
 * are owned by `apps/web/styles/tokens` per Part 2 §24 — this preset only
 * wires Tailwind's plumbing (content globs, dark mode strategy) so every
 * consumer stays consistent. Token values are layered in by the app that
 * extends this preset, never hardcoded here.
 */
const preset: Omit<Config, 'content'> = {
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
};

export default preset;
