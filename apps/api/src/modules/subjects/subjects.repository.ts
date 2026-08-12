import { Injectable } from '@nestjs/common';
import type { Subject } from '@prisma/client';

import type { PrismaService } from '../../database/prisma.service';
import { excludeArchived } from '../../database/utils/soft-delete.util';

@Injectable()
export class SubjectsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Subjects mapped to one Branch+Semester pair (Phase 2 §2's Mapping entity — the exact query Part 2's Subject Selection screen runs). */
  async findByBranchAndSemester(branchId: string, semesterId: string): Promise<Subject[]> {
    const mappings = await this.prisma.branchSemesterSubject.findMany({
      where: { branchId, semesterId, archivedAt: null },
      include: { subject: true },
      orderBy: { subject: { name: 'asc' } },
    });

    return mappings
      .map((mapping) => mapping.subject)
      .filter((subject) => subject.archivedAt === null);
  }

  /**
   * Subject codes are stored as authored (e.g. "DSA-301"), but the public
   * URL segment is lowercase (Part 1 §8: `/btech/ai-ds/sem-4/dsa-301`), so
   * this lookup is case-insensitive rather than requiring the frontend to
   * guess the stored casing.
   */
  findByCode(code: string): Promise<Subject | null> {
    return this.prisma.subject.findFirst({
      where: { code: { equals: code, mode: 'insensitive' }, ...excludeArchived() },
    });
  }
}
