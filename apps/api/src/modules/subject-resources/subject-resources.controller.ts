import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import type { SubjectResourceCategory } from '@prisma/client';

import { AllExceptionsFilter } from '../../common/filters/all-exceptions.filter';
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor';

import type { SubjectResourceResponseDto } from './dto/subject-resource-response.dto';
import type { SubjectResourcesService } from './subject-resources.service';

const VALID_CATEGORIES: SubjectResourceCategory[] = [
  'NOTES',
  'PYQ',
  'IMPORTANT',
  'VIDEO',
  'SYLLABUS',
];

/**
 * Nested under `/v1/subjects/:code/resources` rather than a top-level
 * `/v1/resources` — every resource in this milestone's scope is always
 * reached in the context of one Subject (Milestone 4 brief), so there is
 * no unscoped "all resources" listing, matching the same pattern
 * `BranchesController`/`SemestersController`/`SubjectsController` already
 * use for their own scoped list endpoints.
 */
@Controller('v1/subjects/:code/resources')
@UseFilters(AllExceptionsFilter)
@UseInterceptors(ResponseInterceptor)
export class SubjectResourcesController {
  constructor(private readonly subjectResourcesService: SubjectResourcesService) {}

  @Get()
  findAll(
    @Param('code') code: string,
    @Query('category') category?: string,
  ): Promise<SubjectResourceResponseDto[]> {
    if (category && !VALID_CATEGORIES.includes(category as SubjectResourceCategory)) {
      throw new BadRequestException(
        `Query parameter "category" must be one of: ${VALID_CATEGORIES.join(', ')}.`,
      );
    }
    return this.subjectResourcesService.findBySubjectCode(
      code,
      category as SubjectResourceCategory | undefined,
    );
  }
}
