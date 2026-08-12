'use client';

import type { SubjectListItemDto } from '@plan-b/shared-types';
import { useState } from 'react';

import { SubjectCard } from '../../../../components/composite/subject-card';
import { SubjectPreviewPanel } from '../../../../components/composite/subject-preview-panel';
import { ListGrid } from '../../../../components/patterns/grid';

/**
 * Owns the one piece of client state this milestone needs: which subject
 * (if any) has its preview panel open. Everything else on this page is
 * server-fetched and passed down as plain props.
 */
export function SubjectsGrid({ subjects }: { subjects: SubjectListItemDto[] }) {
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  return (
    <>
      <ListGrid>
        {subjects.map((subject) => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            selected={selectedCode === subject.code}
            onSelect={() => setSelectedCode(subject.code)}
          />
        ))}
      </ListGrid>

      {selectedCode && (
        <SubjectPreviewPanel code={selectedCode} onClose={() => setSelectedCode(null)} />
      )}
    </>
  );
}
