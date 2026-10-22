export function publicSiteUrl(value: string | undefined): URL | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    const localHttp = url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
    return (url.protocol === 'https:' || localHttp) && !url.username && !url.password && !url.search && !url.hash && url.pathname === '/'
      ? url
      : null;
  } catch {
    return null;
  }
}
