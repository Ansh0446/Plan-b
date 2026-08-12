import { Injectable } from '@nestjs/common';
import type { Branch } from '@prisma/client';

import type { PrismaService } from '../../database/prisma.service';
import { excludeArchived } from '../../database/utils/soft-delete.util';

@Injectable()
export class BranchesRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Branches for one course. Part 3 §4: active branches ordered by content depth, inactive grouped after. */
  findByCourseId(courseId: string): Promise<Branch[]> {
    return this.prisma.branch.findMany({
      where: { courseId, ...excludeArchived() },
      // `status: 'asc'` relies on 'ACTIVE' sorting before 'COMING_SOON'
      // alphabetically, which happens to match Part 3 §4's "active
      // branches first" ordering — noted explicitly since that's an
      // implicit dependency on enum member spelling, not just a
      // convenient default.
      orderBy: [{ status: 'asc' }, { displayOrder: 'asc' }, { name: 'asc' }],
    });
  }

  findBySlug(slug: string): Promise<Branch | null> {
    return this.prisma.branch.findFirst({
      where: { slug, ...excludeArchived() },
    });
  }
}
