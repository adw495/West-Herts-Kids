// Send visitors on the old addresses to the real domain, keeping the path and query.
// Preview branches (e.g. design-c.westhertskids.pages.dev) are left alone.
const CANONICAL = 'westhertskids.co.uk';
const REDIRECT_HOSTS = new Set(['westhertskids.pages.dev', 'www.westhertskids.co.uk']);

export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  if (REDIRECT_HOSTS.has(url.hostname)) {
    url.hostname = CANONICAL;
    url.protocol = 'https:';
    return Response.redirect(url.toString(), 301);
  }
  return next();
}
