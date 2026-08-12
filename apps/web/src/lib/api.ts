import type { ApiErrorEnvelope, ApiListEnvelope, ApiSingleEnvelope } from '@plan-b/shared-types';

/**
 * The single place `apps/web` issues HTTP requests to the API (Phase 3
 * §1: "calls the API client (lib/)"). Every function here returns the
 * unwrapped `data` payload — callers never touch the envelope directly —
 * and throws `ApiError` on failure, carrying the backend's `code` so a
 * component can branch on it (Phase 3 §10) rather than string-matching a
 * message.
 */

export class ApiError extends Error {
  readonly code: string;
  readonly details?: unknown;
  readonly status: number;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function apiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    throw new Error('Missing required environment variable: NEXT_PUBLIC_API_URL');
  }
  return url;
}

async function request<T>(path: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl()}/api${path}`, {
      headers: { Accept: 'application/json' },
      // Course/Branch/Semester/Subject content changes rarely (Content Ops
      // action, not a per-request concern) — a short revalidation window
      // keeps the Academic Descent feeling instant on repeat navigation
      // without ever serving indefinitely stale data.
      next: { revalidate: 60 },
    });
  } catch {
    // Network failure (offline, DNS, connection refused) — Phase 3 §10
    // treats this as distinct from a server error the backend reported.
    throw new ApiError(0, 'network_error', "Couldn't reach the server. Check your connection.");
  }

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const errorBody = body as ApiErrorEnvelope | null;
    throw new ApiError(
      response.status,
      errorBody?.error?.code ?? 'error',
      errorBody?.error?.message ?? 'Something went wrong. Please try again.',
      errorBody?.error?.details,
    );
  }

  return (body as ApiSingleEnvelope<T> | ApiListEnvelope<T>).data as T;
}

export function get<T>(path: string): Promise<T> {
  return request<T>(path);
}
