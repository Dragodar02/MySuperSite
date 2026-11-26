/**
 * Resolves media paths safely for local dev and production (import.meta.env.BASE_URL, '/' on 3dartist.dev).
 * Supports relative public paths ('renders/foo.webp'), leading-slash paths ('/renders/foo.webp'),
 * Vite ES module imports, and external URLs.
 */
export function resolveAssetPath(src: string | null | undefined): string | null {
  if (!src) return null;
  const trimmed = src.trim();
  if (!trimmed) return null;

  if (/^(https?:\/\/|data:|blob:)/i.test(trimmed)) {
    return trimmed;
  }

  const base = import.meta.env.BASE_URL || '/';
  if (base !== '/' && trimmed.startsWith(base)) {
    return trimmed;
  }

  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const normalizedPath = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed;
  return `${normalizedBase}${normalizedPath}`;
}

export function isVideoSource(src: string): boolean {
  return /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(src);
}
