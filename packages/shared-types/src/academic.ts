/**
 * Academic Descent contracts (Milestone 3): Course → Branch → Semester →
 * Subject. `apps/api`'s controllers/services and `apps/web`'s API client
 * both import these — never redefine them locally — so the two sides can
 * never silently drift (Phase 1 §1's reason this package exists at all).
 */

export type LifecycleStatus = 'ACTIVE' | 'COMING_SOON';

export interface CourseResponseDto {
  id: string;
  name: string;
  slug: string;
  category: string;
  status: LifecycleStatus;
  displayOrder: number;
}

/**
 * Public/product-facing term for this shape is "Specialization"
 * (Milestone 3 brief); the underlying entity is `Branch`, exactly as
 * locked in Phase 2 §2 — no schema rename, just the public vocabulary.
 */
export interface BranchResponseDto {
  id: string;
  courseId: string;
  name: string;
  slug: string;
  description: string | null;
  status: LifecycleStatus;
  displayOrder: number;
  subjectCount: number;
}

export interface SemesterResponseDto {
  id: string;
  label: string;
  displayOrder: number;
  isPlacementTrack: boolean;
  /** Scoped to whichever Branch this list was requested for — see apps/api's SemestersService. */
  subjectCount: number;
}

export interface SubjectListItemDto {
  id: string;
  name: string;
  code: string;
  resourceCount: number;
}

/** Backs the frontend's Subject preview panel. */
export interface SubjectDetailDto extends SubjectListItemDto {
  description: string | null;
  aliases: string[];
}

// =============================================================================
// API response envelopes (Phase 3 §3)
// =============================================================================

export interface ApiMeta {
  requestId: string;
}

export interface ApiSingleEnvelope<T> {
  data: T;
  meta: ApiMeta;
}

export interface ApiListEnvelope<T> {
  data: T[];
  pagination: { nextCursor: string | null };
  meta: ApiMeta;
}

export interface ApiErrorEnvelope {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta: ApiMeta;
}
export type SubjectResourceCategory = 'NOTES' | 'PYQ' | 'IMPORTANT' | 'VIDEO' | 'SYLLABUS';

export interface SubjectResourceResponseDto {
  id: string;
  subjectId: string;
  category: SubjectResourceCategory;
  title: string;
  description: string | null;
  fileUrl: string | null;
  externalUrl: string | null;
  createdAt: string;
  updatedAt: string;
}
