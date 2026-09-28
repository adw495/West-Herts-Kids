// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';

// Pages marked noindex must stay out of the sitemap too, or search engines get mixed signals.
const NOINDEX_PATHS = ['/advertise/', '/newsletter/thanks/', '/list-your-activity/thanks/', '/404/'];

// Town pages with fewer than MIN_TO_INDEX_TOWN published listings are noindex (see src/lib/listings.ts).
// Work out which ones those are from the listing files, so the sitemap matches automatically.
const MIN_TO_INDEX_TOWN = 2;
function thinTownPaths() {
  const dir = new URL('./src/content/listings/', import.meta.url);
  const counts = {};
  for (const f of fs.readdirSync(dir).filter((n) => n.endsWith('.md'))) {
    const fm = fs.readFileSync(new URL(f, dir), 'utf8').split(/^---$/m)[1] || '';
    if (/^draft:\s*true\s*$/m.test(fm)) continue;
    const inline = fm.match(/^towns:\s*\[([^\]]*)\]/m);
    const block = fm.match(/^towns:\s*\n((?:\s*-\s*.+\n?)+)/m);
    const towns = inline
      ? inline[1].split(',')
      : block
        ? block[1].split('\n').map((l) => l.replace(/^\s*-\s*/, ''))
        : [];
    for (const t of towns.map((x) => x.trim().replace(/['"]/g, '')).filter(Boolean)) counts[t] = (counts[t] || 0) + 1;
  }
  return Object.entries(counts).filter(([, n]) => n < MIN_TO_INDEX_TOWN).map(([t]) => `/towns/${t}/`);
}
const EXCLUDE = new Set([...NOINDEX_PATHS, ...thinTownPaths()]);

export default defineConfig({
  site: 'https://westhertskids.co.uk', // keep in step with SITE.url in src/site.config.ts
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !EXCLUDE.has(new URL(page).pathname) })],
});
