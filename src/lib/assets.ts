/**
 * Resolves a data-file asset path. Absolute URLs pass through; site-relative
 * paths are prefixed with the page's `root` ('./' for the main page, '../' for /plain/).
 */
export function resolveAsset(src: string, root: string): string {
  return /^(https?:)?\/\//.test(src) || src.startsWith('mailto:') ? src : `${root}${src}`;
}

export function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}

export function youtubeThumb(id: string): string {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

export function youtubeEmbed(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
}
