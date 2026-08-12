import { Injectable, NotFoundException } from '@nestjs/common';
import type { Subject } from '@prisma/client';

import type { BranchesService } from '../branches/branches.service';

import type { SubjectDetailDto, SubjectListItemDto } from './dto/subject-response.dto';
import type { SubjectsRepository } from './subjects.repository';

@Injectable()
export class SubjectsService {
  constructor(
    private readonly subjectsRepository: SubjectsRepository,
    private readonly branchesService: BranchesService,
  ) {}

  /** Resolves the branch by slug first (so an unknown branch 404s clearly), then lists subjects for that branch+semester. */
  async findByBranchAndSemester(
    branchSlug: string,
    semesterId: string,
  ): Promise<SubjectListItemDto[]> {
    const branch = await this.branchesService.findBySlug(branchSlug);
    const subjects = await this.subjectsRepository.findByBranchAndSemester(branch.id, semesterId);
    return subjects.map(toSubjectListItemDto);
  }

  async findByCode(code: string): Promise<SubjectDetailDto> {
    const subject = await this.subjectsRepository.findByCode(code);
    if (!subject) {
      throw new NotFoundException(`No subject found for code "${code}".`);
    }
    return toSubjectDetailDto(subject);
  }
}

function toSubjectListItemDto(subject: Subject): SubjectListItemDto {
  return {
    id: subject.id,
    name: subject.name,
    code: subject.code,
    resourceCount: subject.resourceCount,
  };
}

function toSubjectDetailDto(subject: Subject): SubjectDetailDto {
  return {
    ...toSubjectListItemDto(subject),
    description: subject.description,
    aliases: subject.aliases,
  };
}
