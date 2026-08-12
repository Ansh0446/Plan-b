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

import type { BranchesService } from './branches.service';
import type { BranchResponseDto } from './dto/branch-response.dto';

@Controller('v1/branches')
@UseFilters(AllExceptionsFilter)
@UseInterceptors(ResponseInterceptor)
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  /**
   * Phase 3 §3: "a small, explicit, per-endpoint allow-list of filterable
   * fields" — `courseSlug` is the one filter this endpoint accepts, and it
   * is required (a Branch list is always scoped to a Course, mirroring the
   * Academic Descent — there is no unscoped "all branches" view).
   */
  @Get()
  findAll(@Query('courseSlug') courseSlug?: string): Promise<BranchResponseDto[]> {
    if (!courseSlug) {
      throw new BadRequestException('Query parameter "courseSlug" is required.');
    }
    return this.branchesService.findByCourseSlug(courseSlug);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string): Promise<BranchResponseDto> {
    return this.branchesService.findBySlug(slug);
  }
}
