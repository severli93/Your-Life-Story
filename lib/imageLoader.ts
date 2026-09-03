/**
 * lib/imageLoader.ts
 * ──────────────────
 * Custom next/image loader for the static export. Cloudflare Pages has no
 * image optimizer, and the default "unoptimized" mode drops basePath, so we
 * just return the original file prefixed with /lifestory.
 */
import { withBase } from "./basePath";

export default function imageLoader({ src }: { src: string }): string {
  return src.startsWith("http") ? src : withBase(src);
}
