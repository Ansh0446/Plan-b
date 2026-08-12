import { notFound } from 'next/navigation';

import { TranscriptTrail } from '../../../../components/composite/transcript-trail';
import { EmptyState } from '../../../../components/patterns/empty-state';
import { ErrorState } from '../../../../components/patterns/error-state';
import { getBranch, getCourse, getSemester, getSubjects } from '../../../../src/lib/academic-api';
import { ApiError } from '../../../../src/lib/api';

import { SubjectsGrid } from './subjects-grid';

// Never statically generated at build time -- see Milestone 3 note on dynamic rendering.
export const dynamic = 'force-dynamic';

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ courseSlug: string; branchSlug: string; semesterId: string }>;
}) {
  const { courseSlug, branchSlug, semesterId } = await params;

  let course;
  let branch;
  let semester;
  try {
    [course, branch, semester] = await Promise.all([
      getCourse(courseSlug),
      getBranch(branchSlug),
      getSemester(semesterId),
    ]);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    return (
      <div className="mx-auto max-w-container px-4 py-8 md:px-6 md:py-8">
        <ErrorState />
      </div>
    );
  }

  let subjects;
  try {
    subjects = await getSubjects(branchSlug, semesterId);
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
          { label: branch.name, href: `/${courseSlug}/${branchSlug}` },
          { label: semester.label },
        ]}
      />

      <div>
        <h1 className="font-display text-display-lg font-light text-ink">Choose your subject</h1>
        <p className="mt-2 max-w-measure text-body-lg text-ink-soft">
          {branch.name} · {semester.label}
        </p>
      </div>

      {subjects.length === 0 ? (
        <EmptyState
          title="No subjects mapped for this semester yet."
          description="Content for this semester is still being built out. Check back soon."
        />
      ) : (
        <SubjectsGrid subjects={subjects} />
      )}
    </div>
  );
}
