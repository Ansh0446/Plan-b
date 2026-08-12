import type { SubjectListItemDto } from '@plan-b/shared-types';

import { CodeChip } from '../base/badge';
import { Card } from '../base/card';

/**
 * Part 3 §6: name → code (mono chip) → resource count. List-leaning grid
 * (wider, shorter than the tile grids above it) since a subject name +
 * code chip + count needs more horizontal room. `onSelect` opens the
 * preview panel (Milestone 3 brief) rather than navigating away — the
 * Resource List this would normally lead to (Part 3 §7) doesn't exist
 * yet, so the preview panel is this milestone's terminal screen.
 */
export function SubjectCard({
  subject,
  selected,
  onSelect,
}: {
  subject: SubjectListItemDto;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <Card
      onClick={onSelect}
      className={`flex flex-row items-center justify-between gap-4 ${selected ? 'border-2 !border-accent' : ''}`}
      aria-label={`${subject.name}, ${subject.code}, ${subject.resourceCount} resources`}
      aria-pressed={selected}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect();
        }
      }}
    >
      <div className="flex min-w-0 flex-col gap-1">
        <span className="truncate font-display text-heading-md font-medium text-ink">
          {subject.name}
        </span>
        <CodeChip>{subject.code}</CodeChip>
      </div>
      <span className="shrink-0 font-mono text-mono-code text-ink-faint">
        {subject.resourceCount} resource{subject.resourceCount === 1 ? '' : 's'}
      </span>
    </Card>
  );
}
