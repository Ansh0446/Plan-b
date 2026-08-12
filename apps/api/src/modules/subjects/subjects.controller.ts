import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';

import { AllExceptionsFilter } from '../../common/filters/all-exceptions.filter';
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor';

import type { SubjectDetailDto, SubjectListItemDto } from './dto/subject-response.dto';
import type { SubjectsService } from './subjects.service';

@Controller('v1/subjects')
@UseFilters(AllExceptionsFilter)
@UseInterceptors(ResponseInterceptor)
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Get()
  findAll(
    @Query('branchSlug') branchSlug?: string,
    @Query('semesterId') semesterId?: string,
  ): Promise<SubjectListItemDto[]> {
    if (!branchSlug || !semesterId) {
      throw new BadRequestException(
        'Query parameters "branchSlug" and "semesterId" are both required.',
      );
    }
    return this.subjectsService.findByBranchAndSemester(branchSlug, semesterId);
  }

  /** Backs the frontend's Subject preview panel (Milestone 3 brief). */
  @Get(':code')
  findOne(@Param('code') code: string): Promise<SubjectDetailDto> {
    return this.subjectsService.findByCode(code);
  }
}
