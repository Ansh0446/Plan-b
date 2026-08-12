import type { ReactNode } from 'react';

/**
 * Covers Part 2's two chip uses on this milestone's screens: a status
 * badge (Active / Coming Soon on Course/Branch cards) and a mono code
 * chip (Subject codes, e.g. "DSA-301"). Never used for color-only meaning
 * (Part 2 §17) — `Badge` always pairs its color with text.
 */

export function StatusBadge({ status }: { status: 'ACTIVE' | 'COMING_SOON' }) {
  if (status === 'ACTIVE') {
    return (
      <span className="inline-flex items-center rounded-full bg-accent-subtle px-2 py-0.5 font-body text-caption font-medium text-ink">
        Active
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-surface-sunken px-2 py-0.5 font-body text-caption font-medium text-ink-faint">
      Coming Soon
    </span>
  );
}

export function CodeChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded bg-surface-sunken px-2 py-0.5 font-mono text-mono-code text-ink-soft">
      {children}
    </span>
  );
}
