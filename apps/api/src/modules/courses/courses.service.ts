import { Injectable, NotFoundException } from '@nestjs/common';
import type { Course } from '@prisma/client';

import type { CoursesRepository } from './courses.repository';
import type { CourseResponseDto } from './dto/course-response.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly coursesRepository: CoursesRepository) {}

  async findAll(): Promise<CourseResponseDto[]> {
    const courses = await this.coursesRepository.findAll();
    return courses.map(toCourseResponseDto);
  }

  async findBySlug(slug: string): Promise<CourseResponseDto> {
    const course = await this.coursesRepository.findBySlug(slug);
    if (!course) {
      throw new NotFoundException(`No course found for slug "${slug}".`);
    }
    return toCourseResponseDto(course);
  }
}

function toCourseResponseDto(course: Course): CourseResponseDto {
  return {
    id: course.id,
    name: course.name,
    slug: course.slug,
    category: course.category,
    status: course.status,
    displayOrder: course.displayOrder,
  };
}
