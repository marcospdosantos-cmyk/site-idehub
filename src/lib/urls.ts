export function resolveLocalUrl(url?: string | null): string | null {
  if (!url) return null;

  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }

  if (!url.startsWith('/')) {
    return url;
  }

  const path = url.slice(1);
  const basePath = window.location.pathname.replace(/\/[^/]*$/, '/');

  if (basePath !== '/' && url.startsWith(basePath)) {
    return url;
  }

  return `${basePath}${path}`;
}
