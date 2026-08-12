import Link from 'next/link';

/**
 * Part 2 §12: sticky, `nav.bg` at 90% opacity + blur, never hides on
 * scroll. Search/Notifications/Profile are excluded from this milestone
 * (Search is a later module; Notifications/Profile need Auth) — the
 * Transcript Trail itself is rendered per-page (it needs page-specific
 * segments), not here, so this shell is deliberately minimal: logo only.
 */
export function Navbar() {
  return (
    <header className="bg-surface-base/90 sticky top-0 z-30 border-b border-border backdrop-blur">
      <div className="mx-auto flex max-w-container items-center px-4 py-4 md:px-6">
        <Link href="/" className="font-display text-heading-md font-medium text-ink">
          Plan B
        </Link>
      </div>
    </header>
  );
}
