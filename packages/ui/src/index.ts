/**
 * @plan-b/ui
 *
 * Shared, framework-agnostic UI primitives consumed by `apps/web` (Phase 1
 * §4: Primitives/Base/Composite/Patterns hierarchy). This milestone only
 * wires the package so it builds and is importable — the primitive
 * components themselves (Button, Input, Badge, Icon, Chip, Card shell,
 * Modal, Drawer, Skeleton) are out of scope for repository setup and land
 * in a future milestone.
 */

/**
 * Placeholder marker type. Safe to remove the moment the first real
 * primitive component is added in a future milestone.
 */
export type UiPlaceholder = Record<string, never>;
