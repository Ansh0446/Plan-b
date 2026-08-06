/**
 * The single place `process.env` is read on the frontend (Phase 1 §7).
 * Every environment-dependent value the client needs is validated and
 * exposed here as a typed object — components/pages import `env`, never
 * `process.env` directly. The app fails fast on boot if a required
 * variable is missing.
 *
 * No secrets live here: only `NEXT_PUBLIC_*` values are ever read, since
 * anything in this file is bundled into client JavaScript.
 */

function requireEnv(name: string, value: string | undefined): string {
  if (!value || value.length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  NEXT_PUBLIC_APP_URL: requireEnv('NEXT_PUBLIC_APP_URL', process.env.NEXT_PUBLIC_APP_URL),
  NEXT_PUBLIC_API_URL: requireEnv('NEXT_PUBLIC_API_URL', process.env.NEXT_PUBLIC_API_URL),
} as const;
