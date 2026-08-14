import { Injectable } from '@nestjs/common';
import type { SubjectResource, SubjectResourceCategory } from '@prisma/client';

import type { PrismaService } from '../../database/prisma.service';

@Injectable()
export class SubjectResourcesRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** All resources for one Subject, optionally narrowed to one category (the tab filter on the Subject detail page). */
  findBySubjectId(
    subjectId: string,
    category?: SubjectResourceCategory,
  ): Promise<SubjectResource[]> {
    return this.prisma.subjectResource.findMany({
      where: { subjectId, ...(category ? { category } : {}) },
      orderBy: [{ category: 'asc' }, { createdAt: 'desc' }],
    });
  }

  /** Per-category counts for one Subject — powers the "resource counts" section of the Subject detail page header without five separate queries. */
  async countBySubjectId(subjectId: string): Promise<Record<SubjectResourceCategory, number>> {
    const grouped = await this.prisma.subjectResource.groupBy({
      by: ['category'],
      where: { subjectId },
      _count: { _all: true },
    });

    const counts: Record<SubjectResourceCategory, number> = {
      NOTES: 0,
      PYQ: 0,
      IMPORTANT: 0,
      VIDEO: 0,
      SYLLABUS: 0,
    };

    for (const row of grouped) {
      counts[row.category] = row._count._all;
    }

    return counts;
  }
}
