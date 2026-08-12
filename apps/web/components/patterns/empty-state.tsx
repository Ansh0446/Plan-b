import { SearchX } from 'lucide-react';

/**
 * Part 2 §18: "copy-led first, illustration-second... an invitation to
 * act, not a mood board." Every message here is drawn verbatim or
 * near-verbatim from §18's table for the contexts this milestone has:
 * Coming Soon and a generic "nothing mapped yet" state (Branches/
 * Semesters/Subjects with no live content).
 */
export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-card border border-border bg-surface-card px-6 py-9 text-center">
      <SearchX className="h-6 w-6 text-ink-faint" strokeWidth={1.5} aria-hidden="true" />
      <p className="text-body-lg text-ink">{title}</p>
      <p className="max-w-measure text-body-md text-ink-soft">{description}</p>
    </div>
  );
}
