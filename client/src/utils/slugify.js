// Slug utility for SEO and clean URL routing

export function slugify(str) {
  if (!str) return '';
  return str
    .toString()
    .toLowerCase()
    .normalize('NFD') // separate accent marks
    .replace(/[\u0300-\u036f]/g, '') // remove accent marks
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '') // remove special chars
    .trim()
    .replace(/\s+/g, '-') // replace space with -
    .replace(/-+/g, '-'); // collapse dashes
}

export function createResourceSlug(first, second) {
  let id = first;
  let title = second;
  // Handle both (id, title) and (title, id) gracefully
  if (typeof first === 'string' && (typeof second === 'number' || (!isNaN(Number(second)) && String(second).trim() !== ''))) {
    id = second;
    title = first;
  }
  const cleanTitle = slugify(title);
  return `${id}-${cleanTitle}`;
}

export function parseIdFromSlug(slug) {
  if (!slug) return null;
  const decoded = decodeURIComponent(slug).trim();
  // Match leading numbers before dash: e.g. "12-trong-dong"
  const leadingMatch = decoded.match(/^(\d+)/);
  if (leadingMatch) return Number(leadingMatch[1]);
  // Match trailing numbers after dash: e.g. "trong-dong-12"
  const trailingMatch = decoded.match(/-(\d+)$/);
  if (trailingMatch) return Number(trailingMatch[1]);
  // Pure numeric slug: e.g. "12"
  if (!isNaN(Number(decoded)) && decoded !== '') return Number(decoded);
  return null;
}

export function formatYouTubeEmbedUrl(url) {
  if (!url) return null;
  const trimmed = url.trim();

  // Already embed url
  if (trimmed.includes('youtube.com/embed/')) {
    const id = trimmed.split('embed/')[1]?.split('?')[0];
    return id ? `https://www.youtube.com/embed/${id}` : trimmed;
  }

  // Standard watch URL: youtube.com/watch?v=ID
  if (trimmed.includes('watch?v=')) {
    const id = trimmed.split('watch?v=')[1]?.split('&')[0];
    return id ? `https://www.youtube.com/embed/${id}` : trimmed;
  }

  // Short URL: youtu.be/ID
  if (trimmed.includes('youtu.be/')) {
    const id = trimmed.split('youtu.be/')[1]?.split('?')[0];
    return id ? `https://www.youtube.com/embed/${id}` : trimmed;
  }

  // Raw 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return `https://www.youtube.com/embed/${trimmed}`;
  }

  return trimmed;
}
