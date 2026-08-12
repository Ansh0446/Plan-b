import type { CourseResponseDto } from '@plan-b/shared-types';
import Link from 'next/link';

import { StatusBadge } from '../base/badge';
import { Card } from '../base/card';

/**
 * Part 3 §3: fixed 4:3, identical size active or not — inactive is
 * *dimmed*, never *smaller*. Coming Soon cards are inert (no href, no
 * hover) rather than a dead link, per Part 2 §11's "must feel inert."
 */
export function CourseCard({ course }: { course: CourseResponseDto }) {
  const isActive = course.status === 'ACTIVE';

  const content = (
    <Card
      disabled={!isActive}
      interactive={isActive}
      className="flex aspect-[4/3] flex-col justify-between"
      aria-label={`${course.name}, ${isActive ? 'Active' : 'Coming Soon'} course`}
    >
      <span className="font-display text-heading-md font-medium text-ink">{course.name}</span>
      <div className="flex items-center justify-between">
        <span className="text-caption text-ink-soft">{course.category}</span>
        <StatusBadge status={course.status} />
      </div>
    </Card>
  );

  if (!isActive) {
    return <div title={`${course.name} isn't live yet.`}>{content}</div>;
  }

  return (
    <Link href={`/${course.slug}`} className="block">
      {content}
    </Link>
  );
}
