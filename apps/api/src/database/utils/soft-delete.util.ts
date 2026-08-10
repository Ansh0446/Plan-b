import { ResourceStatus, type Prisma } from '@prisma/client';

/**
 * Section 9 (Soft Delete Strategy) uses three different shapes across the
 * schema, deliberately not unified into one column, because the Bible
 * itself distinguishes them by meaning, not just mechanism:
 *
 *   1. `status` enum carrying a `DELETED`/`CLOSED` value (Resource, User)
 *      — deletion is one state among several in an already-modeled status
 *      machine (Section 7), so it belongs in that enum, not a parallel
 *      timestamp.
 *   2. `archivedAt` timestamp (University, Course, Branch, Subject,
 *      ResourceType, BranchSemesterSubject) — structural nodes that are
 *      "archived," never truly deleted (Section 9).
 *   3. `deletedAt` timestamp (Review) — a simple removed/not-removed flag
 *      with no accompanying status machine.
 *
 * These helpers build the Prisma `where` fragment for each shape so every
 * future repository excludes soft-deleted rows identically, rather than
 * every module re-deriving its own `where: { archivedAt: null }` clause.
 */

/** Shape 1 — Resource: excluded via its own status enum, not a timestamp. */
export function excludeDeletedResourceStatus(): Prisma.ResourceWhereInput {
  return { status: { not: ResourceStatus.DELETED } };
}

/** Shape 2 — archivedAt-based entities (University, Course, Branch, Subject, ResourceType, BranchSemesterSubject). */
export function excludeArchived(): { archivedAt: null } {
  return { archivedAt: null };
}

/** Shape 3 — deletedAt-based entities (Review). */
export function excludeSoftDeleted(): { deletedAt: null } {
  return { deletedAt: null };
}

/** User's soft delete is `status: CLOSED` (Section 9), same shape as Resource's enum-based approach. */
export function excludeClosedUsers(): Prisma.UserWhereInput {
  return { status: { not: 'CLOSED' } };
}

/**
 * Narrows an "ownership" check to the single live condition Section 5.2
 * defines: an Order Item's parent Order is `PAID` and has never become
 * `REFUNDED`. Expressed here as a reusable `where` fragment so every
 * future repository/service that needs an ownership check builds it from
 * one place, per Section 5.2's "checked fresh on every request... never
 * cached" rule — this helper does not cache anything, it only shapes the
 * query.
 */
export function ownedResourceOrderWhere(): Prisma.OrderWhereInput {
  return { status: 'PAID' };
}
