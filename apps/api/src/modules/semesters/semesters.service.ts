import { Injectable, NotFoundException } from '@nestjs/common';

import type { BranchesService } from '../branches/branches.service';

import type { SemesterResponseDto } from './dto/semester-response.dto';
import type { SemestersRepository } from './semesters.repository';
import { type SemesterWithSubjectCount } from './semesters.repository';

@Injectable()
export class SemestersService {
  constructor(
    private readonly semestersRepository: SemestersRepository,
    private readonly branchesService: BranchesService,
  ) {}

  /** Resolves the branch by slug first (so an unknown branch 404s clearly), then lists its populated semesters. */
  async findByBranchSlug(branchSlug: string): Promise<SemesterResponseDto[]> {
    const branch = await this.branchesService.findBySlug(branchSlug);
    const semesters = await this.semestersRepository.findByBranchId(branch.id);
    return semesters.map(toSemesterResponseDto);
  }

  async findById(id: string): Promise<SemesterResponseDto> {
    const semester = await this.semestersRepository.findById(id);
    if (!semester) {
      throw new NotFoundException(`No semester found for id "${id}".`);
    }
    return toSemesterResponseDto({ ...semester, subjectCount: 0 });
  }
}

function toSemesterResponseDto(semester: SemesterWithSubjectCount): SemesterResponseDto {
  return {
    id: semester.id,
    label: semester.label,
    displayOrder: semester.displayOrder,
    isPlacementTrack: semester.isPlacementTrack,
    subjectCount: semester.subjectCount,
  };
}
