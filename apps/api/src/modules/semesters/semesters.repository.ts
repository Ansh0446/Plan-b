import { Injectable } from '@nestjs/common';
import type { Semester } from '@prisma/client';

import type { PrismaService } from '../../database/prisma.service';

export interface SemesterWithSubjectCount extends Semester {
  subjectCount: number;
}

@Injectable()
export class SemestersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<Semester | null> {
    return this.prisma.semester.findUnique({ where: { id } });
  }

  /**
   * Semesters that actually have at least one live subject mapped for this
   * Branch (Phase 2 §2's Branch–Semester–Subject Mapping), each annotated
   * with a subject count scoped to that one Branch — a Branch with sparse
   * content should only ever show the semesters it genuinely has content
   * for, not every globally-defined Semester row.
   */
  async findByBranchId(branchId: string): Promise<SemesterWithSubjectCount[]> {
    const grouped = await this.prisma.branchSemesterSubject.groupBy({
      by: ['semesterId'],
      where: { branchId, archivedAt: null },
      _count: { _all: true },
    });

    if (grouped.length === 0) return [];

    const countBySemesterId = new Map(grouped.map((row) => [row.semesterId, row._count._all]));

    const semesters = await this.prisma.semester.findMany({
      where: { id: { in: grouped.map((row) => row.semesterId) } },
      orderBy: [{ displayOrder: 'asc' }],
    });

    return semesters.map((semester) => ({
      ...semester,
      subjectCount: countBySemesterId.get(semester.id) ?? 0,
    }));
  }
}
