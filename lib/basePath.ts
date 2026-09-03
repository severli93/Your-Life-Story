/**
 * lib/basePath.ts
 * ───────────────
 * next/link and next/image prepend `basePath` automatically, but plain
 * <img src>, <audio src> and fetch() URLs don't. Wrap those with withBase().
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBase(path: string): string {
  return `${BASE_PATH}${path}`;
}
