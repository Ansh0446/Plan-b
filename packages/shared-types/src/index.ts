/**
 * @plan-b/shared-types
 *
 * The single legal definition of every cross-boundary data shape shared
 * between `apps/web` and `apps/api` (Phase 1 §1). No domain contracts are
 * defined yet — Milestone 1 only wires the package so it builds, type-checks,
 * and is importable from both apps. Resource/Order/User/etc. contracts land
 * in later milestones, per Phase 2 (Database Bible) and Phase 3 (Technical
 * Specification).
 */

/**
 * Placeholder marker type. Safe to remove the moment the first real shared
 * contract is added in a future milestone.
 */
export type SharedTypesPlaceholder = Record<string, never>;
