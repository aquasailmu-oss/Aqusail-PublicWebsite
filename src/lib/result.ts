export type Result<T, E = string> =
  { ok: true; data: T } | { ok: false; error: E; fieldErrors?: Record<string, string> };

export const ok = <T>(data: T): Result<T, never> => ({ ok: true, data });
export const fail = (error: string, fieldErrors?: Record<string, string>): Result<never> => ({
  ok: false,
  error,
  fieldErrors,
});
