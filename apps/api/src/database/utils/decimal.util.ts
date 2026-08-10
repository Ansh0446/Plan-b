import type { Prisma } from '@prisma/client';

/**
 * Every money field in the schema (Resource.price, Order.totalAmount,
 * Payment.amount, ...) is a Prisma `Decimal` backed by Postgres `numeric`
 * — chosen specifically over `Float`/`number` to avoid floating-point
 * rounding on financial values (Section 13's governance principles apply
 * transitively here: financial data is never allowed to be "close
 * enough"). These helpers are the one place `Decimal` is converted to a
 * JS `number` (for API responses) or formatted as a display string, so
 * that conversion logic never gets duplicated — and never silently
 * reintroduces float rounding — in a future service.
 */

/**
 * Converts a Prisma `Decimal` to a plain `number` for JSON serialization.
 * Safe for display/response purposes; never use the resulting `number` for
 * further monetary arithmetic — do that in `Decimal` space (Prisma re-
 * exports `Prisma.Decimal` for this) or keep it server-side only.
 */
export function decimalToNumber(value: Prisma.Decimal | number | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  return typeof value === 'number' ? value : value.toNumber();
}

/** Formats a money value as a fixed 2-decimal string, e.g. "49.00" — never a locale-formatted currency string (that's a presentation/i18n concern, not a database one). */
export function formatMoney(value: Prisma.Decimal | number | null | undefined): string | null {
  const num = decimalToNumber(value);
  return num === null ? null : num.toFixed(2);
}
