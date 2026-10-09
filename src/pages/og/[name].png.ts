// Social preview images for guides, town pages and activity pages, generated at build time.
import type { APIRoute, GetStaticPaths } from 'astro';
import { getPosts } from '../../lib/listings';
import { ogPng, type OgSpec } from '../../lib/og';
import { TOWNS, CATEGORIES, type TownKey, type CategoryKey } from '../../data/taxonomy';

const TYPE: Record<string, string> = { guide: 'Guide', comparison: 'Compared', news: 'News', 'whats-on': 'What’s on' };

export const getStaticPaths = (async () => {
  const paths: { params: { name: string }; props: OgSpec }[] = [];
  for (const p of await getPosts()) {
    if (/^\d{4}-\d{2}-\d{2}-whats-on$/.test(p.id)) continue; // weekly round-ups use the default image
    paths.push({ params: { name: `guide-${p.id}` }, props: { kicker: TYPE[p.data.type] ?? 'Guide', title: p.data.title.replace(/'/g, '’'), sub: 'Every detail checked at the source' } });
  }
  for (const t of Object.keys(TOWNS) as TownKey[]) {
    paths.push({ params: { name: `town-${t}` }, props: { kicker: 'Town guide', title: `Things to do with kids in ${TOWNS[t].name}`, sub: 'Classes, clubs, holiday camps and days out' } });
  }
  for (const c of Object.keys(CATEGORIES) as CategoryKey[]) {
    paths.push({ params: { name: `category-${c}` }, props: { kicker: 'Compare', title: `${CATEGORIES[c].search} for kids in West Herts`, sub: 'Watford · Rickmansworth · Three Rivers' } });
  }
  return paths;
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) =>
  new Response(new Uint8Array(await ogPng(props as OgSpec)), { headers: { 'Content-Type': 'image/png' } });
