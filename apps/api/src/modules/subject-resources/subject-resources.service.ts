import { Injectable } from '@nestjs/common';
import type { SubjectResource, SubjectResourceCategory } from '@prisma/client';

import type { SubjectsService } from '../subjects/subjects.service';

import type { SubjectResourceResponseDto } from './dto/subject-resource-response.dto';
import type { SubjectResourcesRepository } from './subject-resources.repository';

@Injectable()
export class SubjectResourcesService {
  constructor(
    private readonly subjectResourcesRepository: SubjectResourcesRepository,
    private readonly subjectsService: SubjectsService,
  ) {}

  /** Resolves the subject by code first (so an unknown subject 404s clearly, reusing SubjectsService.findByCode), then lists its resources. */
  async findBySubjectCode(
    code: string,
    category?: SubjectResourceCategory,
  ): Promise<SubjectResourceResponseDto[]> {
    const subject = await this.subjectsService.findByCode(code);
    const resources = await this.subjectResourcesRepository.findBySubjectId(subject.id, category);
    return resources.map(toSubjectResourceResponseDto);
  }
}

function toSubjectResourceResponseDto(resource: SubjectResource): SubjectResourceResponseDto {
  return {
    id: resource.id,
    subjectId: resource.subjectId,
    category: resource.category,
    title: resource.title,
    description: resource.description,
    fileUrl: resource.fileUrl,
    externalUrl: resource.externalUrl,
    createdAt: resource.createdAt.toISOString(),
    updatedAt: resource.updatedAt.toISOString(),
  };
}
