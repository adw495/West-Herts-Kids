// RSS feed of guides and what's-on posts. Feed readers, Bing and Pinterest (auto-publish from RSS) use it.
// Each item carries the page's branded preview image (/og/guide-<id>.png) so Pinterest can make a pin from it.
import type { APIRoute } from 'astro';
import { getPosts } from '../lib/listings';
import { SITE } from '../site.config';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const WEEKLY = /^\d{4}-\d{2}-\d{2}-whats-on$/;

export const GET: APIRoute = async () => {
  const posts = (await getPosts()).slice(0, 50);
  const items = posts.map((p) => {
    const url = `${SITE.url}/whats-on/${p.id}/`;
    const img = `${SITE.url}${WEEKLY.test(p.id) ? '/og.png' : `/og/guide-${p.id}.png`}`;
    const date = (p.data.updated ?? p.data.date).toUTCString();
    return `    <item>
      <title>${esc(p.data.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${date}</pubDate>
      <description>${esc(p.data.description)}</description>
      <enclosure url="${img}" type="image/png" length="0" />
      <media:content url="${img}" medium="image" type="image/png" width="1200" height="630" />
    </item>`;
  }).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${esc(SITE.name)}: guides and what's on</title>
    <link>${SITE.url}/</link>
    <atom:link href="${SITE.url}/rss.xml" rel="self" type="application/rss+xml" />
    <description>${esc(SITE.tagline)}</description>
    <language>en-gb</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
