// /llms.txt: a plain-text map of the site for AI assistants (the llmstxt.org convention). Built from the same
// content as the pages, so it never goes stale. Cheap to provide; search engines ignore it.
import type { APIRoute } from 'astro';
import { getPosts } from '../lib/listings';
import { SITE } from '../site.config';
import { TOWNS, CATEGORIES } from '../data/taxonomy';

const WEEKLY = /^\d{4}-\d{2}-\d{2}-whats-on$/;

export const GET: APIRoute = async () => {
  const posts = await getPosts();
  const guides = posts.filter((p) => !WEEKLY.test(p.id));
  const line = (title: string, url: string, note?: string) => `- [${title}](${url})${note ? `: ${note}` : ''}`;
  const body = `# ${SITE.name}

> ${SITE.tagline}. A free, independent, non-commercial guide for parents in West Hertfordshire, England. Ages, prices, days and venues are checked against each provider's own website, and every listing shows the date it was last checked.

How we check facts: ${SITE.url}/how-we-check/
School holidays calendar (.ics): ${SITE.url}/calendar/herts-school-holidays.ics

## Guides
${guides.map((p) => line(p.data.title, `${SITE.url}/whats-on/${p.id}/`, p.data.answer && !p.data.answer.startsWith('auto:') ? p.data.answer : p.data.description)).join('\n')}

## What's on
${line("This weekend's family events", `${SITE.url}/whats-on/this-weekend/`, 'updated every week')}
${line('School holiday planner', `${SITE.url}/whats-on/school-holiday-planner/`)}

## Activities by type
${Object.entries(CATEGORIES).map(([k, c]) => line(c.search, `${SITE.url}/category/${k}/`, c.blurb)).join('\n')}

## Activities by town
${Object.entries(TOWNS).map(([k, t]) => line(t.name, `${SITE.url}/towns/${k}/`, t.blurb)).join('\n')}

## Optional
- [All activities](${SITE.url}/activities/)
- [About](${SITE.url}/about/)
- [RSS feed](${SITE.url}/rss.xml)
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
