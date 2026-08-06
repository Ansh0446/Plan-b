import basePreset from '@plan-b/config/tailwind/base';
import type { Config } from 'tailwindcss';

/**
 * Design tokens (color, spacing, radius, type scale) are owned by
 * `styles/tokens/` (Part 2 §24, Phase 1 §6) and layered into `theme.extend`
 * here as they're defined in a future milestone. No raw values are
 * hardcoded in components — Tailwind classes only ever resolve to tokens
 * declared in this one place.
 */
const config: Config = {
  presets: [basePreset as Config],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './layouts/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
