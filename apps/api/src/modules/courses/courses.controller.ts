import { Controller, Get, Param, UseFilters, UseInterceptors } from '@nestjs/common';

import { AllExceptionsFilter } from '../../common/filters/all-exceptions.filter';
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor';

import type { CoursesService } from './courses.service';
import type { CourseResponseDto } from './dto/course-response.dto';

/**
 * Public, unauthenticated read API (Phase 3 §3/§4 — "guest-eligible
 * routes" for the Academic Descent, Part 3's "entire journey through
 * Course → Branch → Semester → Subject... is available fully logged-out").
 * `@UseFilters`/`@UseInterceptors` are applied per-controller rather than
 * globally in `main.ts` so Milestone 1's Health module (and its existing
 * e2e test) is left completely untouched.
 */
@Controller('v1/courses')
@UseFilters(AllExceptionsFilter)
@UseInterceptors(ResponseInterceptor)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  findAll(): Promise<CourseResponseDto[]> {
    return this.coursesService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string): Promise<CourseResponseDto> {
    return this.coursesService.findBySlug(slug);
  }
}
