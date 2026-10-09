import { getCollection, type CollectionEntry } from 'astro:content';
import { CATEGORIES, TOWNS, type CategoryKey, type TownKey } from '../data/taxonomy';
import { SITE } from '../site.config';

export type Listing = CollectionEntry<'listings'>;
export type Post = CollectionEntry<'posts'>;

const isFeaturedNow = (l: Listing) =>
  SITE.mode !== 'community' && l.data.featured && (!l.data.featuredUntil || l.data.featuredUntil >= new Date());

/** Published listings, featured first, then alphabetical. Names starting with a number (e.g. the nine
 *  "1st/2nd… Scouts" groups) go after lettered names, so they don't crowd the top of every town page. */
export async function getListings(): Promise<Listing[]> {
  const all = await getCollection('listings', ({ data }) => !data.draft);
  const numbered = (l: Listing) => Number(/^\d/.test(l.data.name));
  return all.sort((a, b) => {
    const f = Number(isFeaturedNow(b)) - Number(isFeaturedNow(a));
    if (f !== 0) return f;
    const n = numbered(a) - numbered(b);
    return n !== 0 ? n : a.data.name.localeCompare(b.data.name, 'en-GB');
  });
}

export async function getPosts(): Promise<Post[]> {
  const all = await getCollection('posts', ({ data }) => !data.draft);
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export { isFeaturedNow };

// Minimum listings before a town or category landing page is generated, to avoid thin pages.
export const MIN_FOR_COMBO_PAGE = 2;

// Town pages with fewer listings than this are kept out of search engines (noindex + left out of the sitemap).
export const MIN_TO_INDEX_TOWN = 2;

// Which towns are next to which, used to suggest "nearby" options on small town/activity pages.
export const NEAR: Record<TownKey, TownKey[]> = {
  'watford': ['bushey', 'abbots-langley', 'croxley-green', 'south-oxhey', 'kings-langley', 'rickmansworth'],
  'rickmansworth': ['croxley-green', 'chorleywood', 'south-oxhey', 'watford'],
  'croxley-green': ['rickmansworth', 'watford', 'chorleywood', 'south-oxhey'],
  'chorleywood': ['rickmansworth', 'croxley-green'],
  'abbots-langley': ['kings-langley', 'watford'],
  'kings-langley': ['abbots-langley', 'watford'],
  'bushey': ['watford', 'south-oxhey'],
  'south-oxhey': ['watford', 'bushey', 'rickmansworth', 'croxley-green'],
};

/** Up to n listings in the same category from neighbouring towns, nearest towns first. */
export function nearbyInCategory(all: Listing[], cat: CategoryKey, town: TownKey, n = 4): Listing[] {
  const out: Listing[] = [];
  for (const t of NEAR[town]) {
    for (const l of all) {
      if (out.length >= n) return out;
      if (l.data.categories.includes(cat) && l.data.towns.includes(t) && !l.data.towns.includes(town) && !out.includes(l)) out.push(l);
    }
  }
  return out;
}

/** Overall age span of a set of listings, e.g. "ages 4 to 16", "ages 5+", "from birth to 12" or "all ages". */
export function ageSpan(ls: Listing[]): string {
  const min = Math.min(...ls.map((l) => l.data.ageMin));
  const max = Math.max(...ls.map((l) => l.data.ageMax));
  const f = (n: number) => (n < 1 ? `${Math.round(n * 12)} months` : `${n}`);
  if (max >= 18) return min === 0 ? 'all ages' : `ages ${f(min)}+`;
  return min === 0 ? `from birth to ${max}` : `ages ${f(min)} to ${max}`;
}

/** schema.org BreadcrumbList from [name, path] pairs. */
export const breadcrumbLd = (crumbs: [string, string][]) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: crumbs.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `${SITE.url}${path}` })),
});

/** schema.org ItemList of listing pages. */
export const itemListLd = (name: string, ls: Listing[]) => ({
  '@context': 'https://schema.org', '@type': 'ItemList', name, numberOfItems: ls.length,
  itemListElement: ls.map((l, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE.url}/activities/${l.id}/`, name: l.data.name })),
});

// A listing is overdue when its last check is older than its own interval plus a 30-day grace period.
export const DEFAULT_CHECK_DAYS = 90;
export function isOverdue(d: Listing['data'], now = new Date()): boolean {
  if (!d.verified) return true;
  const days = (now.getTime() - d.verified.getTime()) / 864e5;
  return days > (d.checkEvery ?? DEFAULT_CHECK_DAYS) + 30;
}

export const byCategory = (ls: Listing[], c: CategoryKey) => ls.filter((l) => l.data.categories.includes(c));
export const byTown = (ls: Listing[], t: TownKey) => ls.filter((l) => l.data.towns.includes(t));

export function ageLabel(min: number, max: number): string {
  const fmt = (n: number) => (n < 1 ? `${Math.round(n * 12)} months` : `${n}`);
  if (min === 0 && max <= 5) return max < 1 ? `0–${fmt(max)}` : `0–${max} years`;
  if (min === 0 && max >= 18) return 'All ages';
  if (max >= 18) return `${fmt(min)}+`;
  if (min < 1) return `${fmt(min)} to ${max} years`;
  return `${min}–${max} years`;
}

const UNIT: Record<string, string> = {
  session: 'per session', week: 'per week', term: 'per term', month: 'per month', day: 'per day', year: 'per year', entry: 'per entry',
};

export function priceLabel(d: Listing['data']): string | null {
  if (d.priceFrom === undefined) return null;
  if (d.priceFrom === 0) return 'Free';
  const p = Number.isInteger(d.priceFrom) ? `£${d.priceFrom}` : `£${d.priceFrom.toFixed(2)}`;
  return `From ${p}${d.priceUnit ? ' ' + UNIT[d.priceUnit] : ''}`;
}

const DAY_NAMES: Record<string, string> = { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun' };
export const dayName = (d: string) => DAY_NAMES[d] ?? d;

export const townNames = (keys: readonly TownKey[]) => keys.map((k) => TOWNS[k].name);
export const categoryNames = (keys: readonly CategoryKey[]) => keys.map((k) => CATEGORIES[k].name);

const FULL_DAYS: Record<string, string> = { mon: 'Mondays', tue: 'Tuesdays', wed: 'Wednesdays', thu: 'Thursdays', fri: 'Fridays', sat: 'Saturdays', sun: 'Sundays' };
const SEASON: Record<string, string> = { 'term-time': 'Term time', holidays: 'School holidays', 'year-round': 'All year' };

function fmtTime(t?: string) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const hh = h % 12 || 12;
  return m ? `${hh}:${String(m).padStart(2, '0')}` : `${hh}`;
}
function ampm(t?: string) { return t ? (Number(t.split(':')[0]) < 12 ? 'am' : 'pm') : ''; }

/** Short "when" summary for cards, from the schedule or the season. */
export function whenLabel(d: Listing['data']): string {
  const s = d.schedule;
  if (s.length === 1 && s[0].start) {
    const a = s[0];
    const range = a.end ? `${fmtTime(a.start)}${ampm(a.start) === ampm(a.end) ? '' : ampm(a.start)}–${fmtTime(a.end)}${ampm(a.end)}` : `${fmtTime(a.start)}${ampm(a.start)}`;
    return `${FULL_DAYS[a.day]}, ${range}`;
  }
  if (s.length > 0) {
    const days = [...new Set(s.map((x) => x.day))];
    if (days.length >= 5) return `${days.length} days a week`;
    return days.map((x) => DAY_NAMES[x]).join(', ');
  }
  return d.season.map((x) => SEASON[x]).join(' and ');
}

/** Short age range for big figures on cards, e.g. "5–12", "4+", "0–4". */
/** Lower-case the first letter for mid-sentence use, keeping acronyms like STEM intact. */
export const lc = (s: string) => s.replace(/^[A-Z](?![A-Z])/, (c) => c.toLowerCase());

export function ageShort(min: number, max: number): string {
  const f = (n: number) => (n > 0 && n < 1 ? `${Math.round(n * 12)}m` : `${n}`);
  if (max >= 18) return `${f(min)}+`;
  return `${f(min)}–${max}`;
}

/** Price figure and sub-line for cards. */
export function priceFact(d: Listing['data']): { label: string; value: string; sub?: string } | null {
  if (d.priceFrom !== undefined) {
    const value = d.priceFrom === 0 ? 'Free' : Number.isInteger(d.priceFrom) ? `£${d.priceFrom}` : `£${d.priceFrom.toFixed(2)}`;
    const unit = d.priceUnit ? { session: 'a session', week: 'a week', term: 'a term', month: 'a month', day: 'a day', year: 'a year', entry: 'per entry' }[d.priceUnit] : undefined;
    return { label: 'From', value, sub: d.freeTrial ? `${unit ?? ''}${unit ? ', ' : ''}free trial` : unit };
  }
  if (d.freeTrial) return { label: 'Try', value: 'Free', sub: 'taster session' };
  return null;
}

export function formatDate(d: Date) {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** schema.org JSON-LD for a listing page. */
export function listingJsonLd(l: Listing) {
  const d = l.data;
  const url = `${SITE.url}/activities/${l.id}/`;
  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': url,
    name: d.name,
    description: d.summary,
    url: d.website ?? url,
    areaServed: townNames(d.towns).map((name) => ({ '@type': 'Place', name })),
  };
  if (d.phone) ld.telephone = d.phone;
  if (d.email) ld.email = d.email;
  if (d.venue.address || d.venue.postcode) {
    ld.address = {
      '@type': 'PostalAddress',
      streetAddress: d.venue.address,
      postalCode: d.venue.postcode,
      addressCountry: 'GB',
    };
  }
  if (d.venue.lat && d.venue.lon) ld.geo = { '@type': 'GeoCoordinates', latitude: d.venue.lat, longitude: d.venue.lon };
  if (d.priceFrom !== undefined) {
    ld.makesOffer = {
      '@type': 'Offer',
      price: d.priceFrom,
      priceCurrency: 'GBP',
      description: priceLabel(d),
    };
  }
  const sameAs = [d.facebook, d.instagram && `https://www.instagram.com/${d.instagram.replace(/^@/, '')}/`].filter(Boolean);
  if (sameAs.length) ld.sameAs = sameAs;
  return ld;
}

// ---- Landing-page facts and FAQs (SEO) --------------------------------------------------------------
// Everything here is derived from the listings' own verified fields, so the text is never invented.

const DAY_ORDER = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
const DAY_FULL: Record<string, string> = { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' };
const PER: Record<string, string> = { session: 'a session', week: 'a week', term: 'a term', month: 'a month', day: 'a day', year: 'a year', entry: 'per entry' };
const startAge = (n: number) => (n === 0 ? 'birth' : n < 1 ? `${Math.round(n * 12)} months` : n % 1 ? `${Math.floor(n)}½ years` : `${n} ${n === 1 ? 'year' : 'years'}`);
const money = (n: number) => (n === 0 ? 'free' : Number.isInteger(n) ? `£${n}` : `£${n.toFixed(2)}`);
const joinAnd = (xs: string[]) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);

function dayRange(days: string[]): string {
  const idx = DAY_ORDER.map((d) => days.includes(d));
  const on = DAY_ORDER.filter((_, i) => idx[i]);
  if (on.length === 0) return '';
  const first = DAY_ORDER.indexOf(on[0]), last = DAY_ORDER.indexOf(on[on.length - 1]);
  if (on.length >= 3 && last - first + 1 === on.length) return `${DAY_FULL[on[0]]} to ${DAY_FULL[on[on.length - 1]]}`;
  return joinAnd(on.map((d) => DAY_FULL[d]));
}

export interface Glance { count: number; youngest: string; priceFrom: string | null; days: string; trials: number; send: number; checked: Date | null }

export function glance(items: Listing[]): Glance {
  const priced = items.filter((l) => l.data.priceFrom !== undefined).sort((a, b) => a.data.priceFrom! - b.data.priceFrom!);
  const cheapest = priced[0]?.data;
  const days = [...new Set(items.flatMap((l) => l.data.schedule.map((s) => s.day)))];
  const checked = items.map((l) => l.data.verified).filter(Boolean).sort((a, b) => b!.getTime() - a!.getTime())[0] ?? null;
  return {
    count: items.length,
    youngest: startAge(Math.min(...items.map((l) => l.data.ageMin))),
    priceFrom: cheapest ? `${money(cheapest.priceFrom!)}${cheapest.priceUnit && cheapest.priceFrom! > 0 ? ' ' + PER[cheapest.priceUnit] : ''}` : null,
    days: dayRange(days),
    trials: items.filter((l) => l.data.freeTrial).length,
    send: items.filter((l) => l.data.send === 'yes').length,
    checked,
  };
}

export function faqs(items: Listing[], q: string, place: string): { q: string; a: string }[] {
  const out: { q: string; a: string }[] = [];
  const priced = items.filter((l) => l.data.priceFrom !== undefined).sort((a, b) => a.data.priceFrom! - b.data.priceFrom!);
  if (priced.length) {
    const eg = priced.slice(0, 3).map((l) => `${money(l.data.priceFrom!)}${l.data.priceUnit && l.data.priceFrom! > 0 ? ' ' + PER[l.data.priceUnit] : ''} at ${l.data.name}`);
    const unpriced = items.length - priced.length;
    out.push({ q: `How much do ${q} cost in ${place}?`, a: `Prices we've found on providers' own websites start from ${joinAnd(eg)}.${unpriced ? ` ${unpriced === 1 ? 'One option doesn’t' : `${unpriced} options don’t`} publish prices online, so ask them directly.` : ''} Many charge by the term, so compare the cost per session.` });
  }
  const minAge = Math.min(...items.map((l) => l.data.ageMin));
  const youngest = items.filter((l) => l.data.ageMin === minAge).map((l) => l.data.name);
  out.push({ q: `What age can children start ${q} in ${place}?`, a: `From ${startAge(minAge)} at ${joinAnd(youngest.slice(0, 3))}. Age ranges are shown on each listing, and most providers group children by age or ability.` });
  const days = dayRange([...new Set(items.flatMap((l) => l.data.schedule.map((s) => s.day)))]);
  if (days) out.push({ q: `Which days do ${q} run in ${place}?`, a: `Between them, the providers listed here run sessions on ${days}. Times vary by age group, so check each listing for the exact timetable.` });
  const trials = items.filter((l) => l.data.freeTrial).map((l) => l.data.name);
  if (trials.length) out.push({ q: `Can we try ${q} for free first?`, a: `${joinAnd(trials)} ${trials.length === 1 ? 'offers' : 'offer'} a free trial or taster session, according to their websites.` });
  const send = items.filter((l) => l.data.send === 'yes').map((l) => l.data.name);
  if (send.length) out.push({ q: `Are there SEND-friendly ${q} in ${place}?`, a: `${joinAnd(send)} ${send.length === 1 ? 'says it welcomes' : 'say they welcome'} children with special educational needs and disabilities. Each listing has notes on what support is available.` });
  return out;
}

// ---- Town pages: intro facts and FAQs, again built only from listing fields ----------------------------

/** Category counts for a set of listings, biggest first, e.g. [['swimming', 6], ['music', 4]]. */
export function categoryCounts(items: Listing[]): [CategoryKey, number][] {
  const m = new Map<CategoryKey, number>();
  for (const l of items) for (const c of l.data.categories) m.set(c, (m.get(c) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

/** Town counts for a set of listings, biggest first. */
export function townCounts(items: Listing[]): [TownKey, number][] {
  const m = new Map<TownKey, number>();
  for (const l of items) for (const t of l.data.towns) m.set(t, (m.get(t) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

const names = (ls: Listing[], n = 4) => {
  const xs = ls.slice(0, n).map((l) => l.data.name);
  return ls.length > n ? `${xs.join(', ')} and ${ls.length - n} more` : joinAnd(xs);
};

/** One factual sentence summing up what a town has, e.g. "We list 41 … including 6 swimming lessons …". */
export function townIntro(items: Listing[], place: string): string {
  const top = categoryCounts(items).slice(0, 5).map(([c, n]) => `${n} ${c === 'tuition' ? 'tutoring and language classes' : CATEGORIES[c].q}`);
  const free = items.filter((l) => l.data.priceFrom === 0).length;
  const trials = items.filter((l) => l.data.freeTrial).length;
  const bits = [
    `We list ${items.length} ${items.length === 1 ? 'activity' : 'activities'} for children in and around ${place}${top.length > 1 ? `, including ${joinAnd(top)}` : ''}.`,
    free ? `${free} ${free === 1 ? 'is' : 'are'} free to visit.` : '',
    trials ? `${trials} ${trials === 1 ? 'offers' : 'offer'} a free trial or taster.` : '',
    'Every listing shows ages, prices and times taken from the provider’s own website, with the date we last checked.',
  ];
  return bits.filter(Boolean).join(' ');
}

export function townFaqs(items: Listing[], place: string): { q: string; a: string }[] {
  const out: { q: string; a: string }[] = [];
  const top = categoryCounts(items).slice(0, 6).map(([c, n]) => `${lc(CATEGORIES[c].name)} (${n})`);
  out.push({ q: `What is there to do with kids in ${place}?`, a: `Our ${place} listings cover ${joinAnd(top)}. Use the filters above to narrow them down by age, day or price.` });
  const free = items.filter((l) => l.data.priceFrom === 0);
  if (free.length) out.push({ q: `Are there free things to do with kids in ${place}?`, a: `Yes. ${names(free)} ${free.length === 1 ? 'is' : 'are'} free to visit, according to ${free.length === 1 ? 'its' : 'their'} own website${free.length === 1 ? '' : 's'}.` });
  const little = items.filter((l) => l.data.ageMin <= 1).sort((a, b) => Number(b.data.categories.includes('baby-toddler')) - Number(a.data.categories.includes('baby-toddler')));
  if (little.length) out.push({ q: `What can babies and toddlers do in ${place}?`, a: `${names(little)} ${little.length === 1 ? 'takes' : 'take'} children from ${startAge(Math.min(...little.map((l) => l.data.ageMin)))} or soon after. Each listing shows the exact age range.` });
  const camps = items.filter((l) => l.data.categories.includes('holiday-camps'));
  if (camps.length) out.push({ q: `Are there holiday clubs in ${place}?`, a: `${names(camps)} ${camps.length === 1 ? 'runs' : 'run'} school holiday camps or clubs. Dates and day prices are on each listing where the provider publishes them.` });
  const trials = items.filter((l) => l.data.freeTrial);
  if (trials.length) out.push({ q: `Which activities in ${place} have a free trial?`, a: `${names(trials, 6)} ${trials.length === 1 ? 'offers' : 'offer'} a free trial or taster session, according to their websites.` });
  const send = items.filter((l) => l.data.send === 'yes');
  if (send.length) out.push({ q: `Are there SEND-friendly activities in ${place}?`, a: `${names(send, 6)} ${send.length === 1 ? 'says it welcomes' : 'say they welcome'} children with special educational needs and disabilities.` });
  return out;
}

/** schema.org FAQPage from question/answer pairs. */
export const faqLd = (qa: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: qa.map((x) => ({ '@type': 'Question', name: x.q, acceptedAnswer: { '@type': 'Answer', text: x.a } })),
});

const WEEKLY = /^\d{4}-\d{2}-\d{2}-whats-on$/;
/** Guides that match a town and/or category, best match first (both > category > town). Weekly round-ups are left out. */
export function relatedGuides(posts: Post[], opts: { town?: TownKey; cat?: CategoryKey; exclude?: string; n?: number }): Post[] {
  const { town, cat, exclude, n = 6 } = opts;
  const score = (p: Post) => {
    const t = town ? p.data.towns.includes(town) : false;
    const c = cat ? p.data.categories.includes(cat) : false;
    if (town && cat) return t && c ? 3 : c ? 2 : 0;
    return t || c ? 1 : 0;
  };
  return posts
    .filter((p) => !WEEKLY.test(p.id) && p.id !== exclude)
    .map((p) => ({ p, s: score(p) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || b.p.data.date.getTime() - a.p.data.date.getTime())
    .slice(0, n)
    .map((x) => x.p);
}
