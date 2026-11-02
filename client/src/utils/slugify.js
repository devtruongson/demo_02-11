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

export function createResourceSlug(id, title) {
  const cleanTitle = slugify(title);
  return `${id}-${cleanTitle}`;
}

export function parseIdFromSlug(slug) {
  if (!slug) return null;
  // Match leading numbers before dash, or just number
  const match = slug.match(/^(\d+)/);
  return match ? Number(match[1]) : null;
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
