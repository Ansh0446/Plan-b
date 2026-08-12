import { Injectable } from '@nestjs/common';
import type { Course } from '@prisma/client';

import type { PrismaService } from '../../database/prisma.service';
import { excludeArchived } from '../../database/utils/soft-delete.util';

/**
 * Phase 1 §3: repositories are the only layer that talks to Prisma
 * directly. No business rules or authorization checks live here — just
 * scoped reads for the `Course` entity (Phase 2 §2).
 */
@Injectable()
export class CoursesRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** All non-archived courses, ordered the way the Course grid is meant to render (Part 3 §3). */
  findAll(): Promise<Course[]> {
    return this.prisma.course.findMany({
      where: excludeArchived(),
      orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
    });
  }

  findBySlug(slug: string): Promise<Course | null> {
    return this.prisma.course.findFirst({
      where: { slug, ...excludeArchived() },
    });
  }
}
