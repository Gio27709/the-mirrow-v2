// Hosts allowed in next.config.ts images.remotePatterns: only these can go
// through the Next.js image optimizer (resized + WebP/AVIF instead of ~800 KB PNGs).
const OPTIMIZABLE_HOSTS = [
  "cicvwajzdtgvfbsvuttx.supabase.co",
  "images.unsplash.com",
  "lh3.googleusercontent.com",
];

/** True when next/image may optimize this URL; otherwise pass `unoptimized`. */
export function canOptimize(src: string | null | undefined): boolean {
  if (!src) return false;
  if (src.startsWith("/")) return true;
  try {
    return OPTIMIZABLE_HOSTS.includes(new URL(src).hostname);
  } catch {
    return false;
  }
}
