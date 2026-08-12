import basePreset from '@plan-b/config/tailwind/base';
import type { Config } from 'tailwindcss';

/**
 * Design tokens (color, spacing, radius, type scale) are owned by
 * `styles/tokens/tokens.css` (Part 2 §24, Phase 1 §6) as CSS custom
 * properties — light/dark values live there, and this file only maps
 * each Tailwind utility to the matching CSS variable. No component ever
 * hardcodes a raw hex/px value (Part 2 §25 Rule 1); every value here
 * traces back to Part 2 §4/§5/§6's token tables exactly.
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
    extend: {
      colors: {
        paper: 'var(--color-paper)',
        ink: 'var(--color-ink)',
        'ink-soft': 'var(--color-ink-soft)',
        'ink-faint': 'var(--color-ink-faint)',
        surface: {
          base: 'var(--surface-base)',
          card: 'var(--surface-card)',
          elevated: 'var(--surface-elevated)',
          sunken: 'var(--surface-sunken)',
        },
        border: {
          DEFAULT: 'var(--border-default)',
          strong: 'var(--border-strong)',
        },
        accent: {
          DEFAULT: 'var(--accent-highlighter)',
          hover: 'var(--accent-highlighter-hover)',
          pressed: 'var(--accent-highlighter-pressed)',
          subtle: 'var(--accent-highlighter-subtle)',
        },
        status: {
          success: 'var(--status-success)',
          'success-subtle': 'var(--status-success-subtle)',
          error: 'var(--status-error)',
          'error-subtle': 'var(--status-error-subtle)',
          warning: 'var(--status-warning)',
          'warning-subtle': 'var(--status-warning-subtle)',
          info: 'var(--status-info)',
          'info-subtle': 'var(--status-info-subtle)',
        },
      },
      fontFamily: {
        /**
         * Part 2 §5's three type roles, as literal family names + system
         * fallback stacks — not `next/font/google`, which requires network
         * access to fonts.googleapis.com at *build* time and would make
         * `pnpm build` fail in any network-restricted environment (CI
         * runners, offline dev). A future milestone can self-host the
         * actual font files under these same names with zero changes
         * needed here or in any component — only the `@font-face` source
         * changes.
         */
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['Inter', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      fontSize: {
        'display-xl': ['48px', { lineHeight: '1.1' }],
        'display-lg': ['36px', { lineHeight: '1.15' }],
        'display-md': ['28px', { lineHeight: '1.2' }],
        'heading-lg': ['22px', { lineHeight: '1.3' }],
        'heading-md': ['18px', { lineHeight: '1.35' }],
        'body-lg': ['16px', { lineHeight: '1.5' }],
        'body-md': ['14px', { lineHeight: '1.5' }],
        label: ['13px', { lineHeight: '1.4' }],
        caption: ['12px', { lineHeight: '1.4' }],
        'mono-trail': ['13px', { lineHeight: '1.2' }],
        'mono-price': ['18px', { lineHeight: '1.2' }],
        'mono-code': ['12px', { lineHeight: '1.3' }],
      },
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '24px',
        6: '32px',
        7: '48px',
        8: '64px',
        9: '96px',
      },
      borderRadius: {
        card: '12px',
        control: '8px',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.06)',
        md: '0 4px 12px 0 rgb(0 0 0 / 0.10)',
      },
      transitionDuration: {
        150: '150ms',
        180: '180ms',
        200: '200ms',
      },
      maxWidth: {
        container: '1200px',
        measure: '640px',
      },
    },
  },
  plugins: [],
};

export default config;
