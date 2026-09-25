import { getCollection, type CollectionEntry } from 'astro:content';
import { CATEGORIES, TOWNS, type CategoryKey, type TownKey } from '../data/taxonomy';
import { SITE } from '../site.config';

export type Listing = CollectionEntry<'listings'>;
export type Post = CollectionEntry<'posts'>;

const isFeaturedNow = (l: Listing) =>
  l.data.featured && (!l.data.featuredUntil || l.data.featuredUntil >= new Date());

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
