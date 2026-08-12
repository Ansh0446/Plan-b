import { notFound } from 'next/navigation';

import { SemesterCard } from '../../../components/composite/semester-card';
import { TranscriptTrail } from '../../../components/composite/transcript-trail';
import { EmptyState } from '../../../components/patterns/empty-state';
import { ErrorState } from '../../../components/patterns/error-state';
import { TileGrid } from '../../../components/patterns/grid';
import { getBranch, getCourse, getSemesters } from '../../../src/lib/academic-api';
import { ApiError } from '../../../src/lib/api';

// Never statically generated at build time -- see Milestone 3 note on dynamic rendering.
export const dynamic = 'force-dynamic';

export default async function SemesterPage({
  params,
}: {
  params: Promise<{ courseSlug: string; branchSlug: string }>;
}) {
  const { courseSlug, branchSlug } = await params;

  let course;
  let branch;
  try {
    [course, branch] = await Promise.all([getCourse(courseSlug), getBranch(branchSlug)]);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    return (
      <div className="mx-auto max-w-container px-4 py-8 md:px-6 md:py-8">
        <ErrorState />
      </div>
    );
  }

  let semesters;
  try {
    semesters = await getSemesters(branchSlug);
  } catch {
    return (
      <div className="mx-auto max-w-container px-4 py-8 md:px-6 md:py-8">
        <ErrorState />
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-container flex-col gap-6 px-4 py-8 md:gap-8 md:px-6 md:py-8">
      <TranscriptTrail
        segments={[
          { label: 'Courses', href: '/' },
          { label: course.name, href: `/${courseSlug}` },
          { label: branch.name },
        ]}
      />

      <div>
        <h1 className="font-display text-display-lg font-light text-ink">Choose your semester</h1>
        <p className="mt-2 max-w-measure text-body-lg text-ink-soft">{branch.name}</p>
      </div>

      {semesters.length === 0 ? (
        <EmptyState
          title="No subjects mapped for this specialization yet."
          description="Content for this branch is still being built out. Check back soon."
        />
      ) : (
        <TileGrid>
          {semesters.map((semester) => (
            <SemesterCard
              key={semester.id}
              courseSlug={courseSlug}
              branchSlug={branchSlug}
              semester={semester}
            />
          ))}
        </TileGrid>
      )}
    </div>
  );
}
