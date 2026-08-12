import Link from 'next/link';

export interface TrailSegment {
  label: string;
  href?: string;
}

/**
 * Part 2 §0/§12/§25 Rule 5: "the Transcript Trail *is* the breadcrumb —
 * there is no separate breadcrumb component elsewhere in the product...
 * never removed, renamed, or replaced." Set in `type.mono.trail` (Part 2
 * §5) so it reads as *data*, not decoration — the signature move that
 * makes the transcript metaphor felt.
 *
 * The last segment (current position) is never a link — Part 2's Trail is
 * "always take you back," not a self-referential no-op click.
 */
export function TranscriptTrail({ segments }: { segments: TrailSegment[] }) {
  if (segments.length === 0) return null;

  return (
    <nav
      aria-label="Your position"
      className="scrollbar-none flex items-center gap-2 overflow-x-auto whitespace-nowrap font-mono text-mono-trail text-ink-soft"
    >
      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1;
        return (
          <span key={`${segment.label}-${index}`} className="flex items-center gap-2">
            {index > 0 && <span className="text-ink-faint">/</span>}
            {segment.href && !isLast ? (
              <Link href={segment.href} className="transition-colors hover:text-ink">
                {segment.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-accent' : ''}>{segment.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
