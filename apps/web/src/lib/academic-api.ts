import type {
  BranchResponseDto,
  CourseResponseDto,
  SemesterResponseDto,
  SubjectDetailDto,
  SubjectListItemDto,
} from '@plan-b/shared-types';

import { get } from './api';

export function getCourses(): Promise<CourseResponseDto[]> {
  return get<CourseResponseDto[]>('/v1/courses');
}

export function getCourse(slug: string): Promise<CourseResponseDto> {
  return get<CourseResponseDto>(`/v1/courses/${encodeURIComponent(slug)}`);
}

export function getBranches(courseSlug: string): Promise<BranchResponseDto[]> {
  return get<BranchResponseDto[]>(`/v1/branches?courseSlug=${encodeURIComponent(courseSlug)}`);
}

export function getBranch(slug: string): Promise<BranchResponseDto> {
  return get<BranchResponseDto>(`/v1/branches/${encodeURIComponent(slug)}`);
}

export function getSemesters(branchSlug: string): Promise<SemesterResponseDto[]> {
  return get<SemesterResponseDto[]>(`/v1/semesters?branchSlug=${encodeURIComponent(branchSlug)}`);
}

export function getSemester(id: string): Promise<SemesterResponseDto> {
  return get<SemesterResponseDto>(`/v1/semesters/${encodeURIComponent(id)}`);
}

export function getSubjects(branchSlug: string, semesterId: string): Promise<SubjectListItemDto[]> {
  return get<SubjectListItemDto[]>(
    `/v1/subjects?branchSlug=${encodeURIComponent(branchSlug)}&semesterId=${encodeURIComponent(semesterId)}`,
  );
}

export function getSubject(code: string): Promise<SubjectDetailDto> {
  return get<SubjectDetailDto>(`/v1/subjects/${encodeURIComponent(code)}`);
}
