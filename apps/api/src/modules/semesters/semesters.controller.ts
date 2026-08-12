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

import type { SemesterResponseDto } from './dto/semester-response.dto';
import type { SemestersService } from './semesters.service';

@Controller('v1/semesters')
@UseFilters(AllExceptionsFilter)
@UseInterceptors(ResponseInterceptor)
export class SemestersController {
  constructor(private readonly semestersService: SemestersService) {}

  @Get()
  findAll(@Query('branchSlug') branchSlug?: string): Promise<SemesterResponseDto[]> {
    if (!branchSlug) {
      throw new BadRequestException('Query parameter "branchSlug" is required.');
    }
    return this.semestersService.findByBranchSlug(branchSlug);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<SemesterResponseDto> {
    return this.semestersService.findById(id);
  }
}
