import { getCollection, type CollectionEntry } from 'astro:content';
import { CATEGORIES, TOWNS, type CategoryKey, type TownKey } from '../data/taxonomy';
import { SITE } from '../site.config';

export type Listing = CollectionEntry<'listings'>;
export type Post = CollectionEntry<'posts'>;

const isFeaturedNow = (l: Listing) =>
  SITE.mode !== 'community' && l.data.featured && (!l.data.featuredUntil || l.data.featuredUntil >= new Date());

/** Published listings, featured first, then alphabetical. */
export async function getListings(): Promise<Listing[]> {
  const all = await getCollection('listings', ({ data }) => !data.draft);
  return all.sort((a, b) => {
    const f = Number(isFeaturedNow(b)) - Number(isFeaturedNow(a));
    return f !== 0 ? f : a.data.name.localeCompare(b.data.name, 'en-GB');
  });
}

export async function getPosts(): Promise<Post[]> {
  const all = await getCollection('posts', ({ data }) => !data.draft);
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export { isFeaturedNow };

// Minimum listings before a town or category landing page is generated, to avoid thin pages.
export const MIN_FOR_COMBO_PAGE = 2;

export const byCategory = (ls: Listing[], c: CategoryKey) => ls.filter((l) => l.data.categories.includes(c));
export const byTown = (ls: Listing[], t: TownKey) => ls.filter((l) => l.data.towns.includes(t));

export function ageLabel(min: number, max: number): string {
  const fmt = (n: number) => (n < 1 ? `${Math.round(n * 12)} months` : `${n}`);
  if (min === 0 && max <= 5) return max < 1 ? `0–${fmt(max)}` : `0–${max} years`;
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
export function ageShort(min: number, max: number): string {
  const f = (n: number) => (n < 1 ? `${Math.round(n * 12)}m` : `${n}`);
  if (max >= 18) return `${f(min)}+`;
  return `${f(min)}–${max}`;
}

/** Price figure and sub-line for cards. */
export function priceFact(d: Listing['data']): { label: string; value: string; sub?: string } | null {
  if (d.priceFrom !== undefined) {
    const value = d.priceFrom === 0 ? 'Free' : Number.isInteger(d.priceFrom) ? `£${d.priceFrom}` : `£${d.priceFrom.toFixed(2)}`;
    const unit = d.priceUnit ? { session: 'a session', week: 'a week', term: 'a term', month: 'a month', day: 'a day', year: 'a year', entry: 'per ride or entry' }[d.priceUnit] : undefined;
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
