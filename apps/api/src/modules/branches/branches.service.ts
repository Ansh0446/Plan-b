import { Injectable, NotFoundException } from '@nestjs/common';
import type { Branch } from '@prisma/client';

import type { CoursesService } from '../courses/courses.service';

import type { BranchesRepository } from './branches.repository';
import type { BranchResponseDto } from './dto/branch-response.dto';

@Injectable()
export class BranchesService {
  constructor(
    private readonly branchesRepository: BranchesRepository,
    private readonly coursesService: CoursesService,
  ) {}

  /** Resolves the course by slug first (so an unknown course 404s clearly), then lists its branches. */
  async findByCourseSlug(courseSlug: string): Promise<BranchResponseDto[]> {
    const course = await this.coursesService.findBySlug(courseSlug);
    const branches = await this.branchesRepository.findByCourseId(course.id);
    return branches.map(toBranchResponseDto);
  }

  async findBySlug(slug: string): Promise<BranchResponseDto> {
    const branch = await this.branchesRepository.findBySlug(slug);
    if (!branch) {
      throw new NotFoundException(`No branch found for slug "${slug}".`);
    }
    return toBranchResponseDto(branch);
  }
}

function toBranchResponseDto(branch: Branch): BranchResponseDto {
  return {
    id: branch.id,
    courseId: branch.courseId,
    name: branch.name,
    slug: branch.slug,
    description: branch.description,
    status: branch.status,
    displayOrder: branch.displayOrder,
    subjectCount: branch.subjectCount,
  };
}
