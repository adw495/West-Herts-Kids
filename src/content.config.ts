import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { TOWN_KEYS, CATEGORY_KEYS } from './data/taxonomy';

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

const listings = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/listings' }),
  schema: z.object({
    name: z.string(),
    summary: z.string().max(200),
    seoTitle: z.string().max(70).optional(), // hand-tuned <title> for pages close to page 1 (matches what people search)           // one-line summary used on cards and in meta descriptions
    categories: z.array(z.enum(CATEGORY_KEYS)).min(1),
    towns: z.array(z.enum(TOWN_KEYS)).min(1),

    // Ages in years. Use 0 for babies. ageMax 18 means "and up".
    ageMin: z.number().min(0).max(18),
    ageMax: z.number().min(0).max(18),

    season: z.array(z.enum(['term-time', 'holidays', 'year-round'])).default(['term-time']),
    schedule: z.array(z.object({
      day: z.enum(DAYS),
      start: z.string().optional(),  // "16:30"
      end: z.string().optional(),
      note: z.string().optional(),   // "Ages 4–6"
      price: z.string().optional(),  // "£8.50" — only when the provider states a per-session price
    })).default([]),

    // Practical visit info for venues, parks and days out. Only fields the provider (or council) states.
    visit: z.object({
      hours: z.string().optional(),        // "Mon–Fri 9am–6pm; Sat–Sun 9am–5pm"
      parking: z.string().optional(),      // "Free car park on site"
      station: z.string().optional(),      // "Watford Junction (10 min walk)"
      cafe: z.boolean().optional(),
      toilets: z.boolean().optional(),
      babyChange: z.boolean().optional(),
      buggy: z.string().optional(),        // "Buggy-friendly paths"
      visitLength: z.string().optional(),  // "Allow 2–3 hours"
      source: z.string().optional(),       // where the visit info came from
    }).default({}),

    // First-party tips from parents, sent in through the site and approved by the owner. Never copied from elsewhere.
    tips: z.array(z.object({
      text: z.string().max(400),
      name: z.string(),                    // first name and town, e.g. "Sarah, Croxley Green"
      date: z.coerce.date(),
    })).default([]),

    priceFrom: z.number().optional(),       // pounds
    priceUnit: z.enum(['session', 'week', 'term', 'month', 'day', 'year', 'entry']).optional(),
    priceNote: z.string().optional(),
    freeTrial: z.boolean().default(false),

    send: z.enum(['yes', 'no', 'unknown']).default('unknown'), // SEND-friendly
    sendNotes: z.string().optional(),

    venue: z.object({
      name: z.string().optional(),
      address: z.string().optional(),
      postcode: z.string().optional(),
      lat: z.number().optional(),
      lon: z.number().optional(),
    }).default({}),

    website: z.url().optional(),
    bookingUrl: z.url().optional(),
    email: z.email().optional(),
    phone: z.string().optional(),
    instagram: z.string().optional(),
    facebook: z.url().optional(),

    // Business-side flags
    featured: z.boolean().default(false),
    featuredUntil: z.coerce.date().optional(),
    claimed: z.boolean().default(false),     // provider has confirmed/claimed the listing
    verified: z.coerce.date().optional(),    // date details were last checked by us or the provider
    // Self-learning re-check schedule (see docs/verification-process.md). Days between checks; default 90.
    checkEvery: z.number().int().min(14).max(365).optional(),
    lastChanged: z.coerce.date().optional(), // date a re-check last found (and fixed) a difference
    source: z.string().optional(),           // where the data came from (e.g. "osm", "provider website")
    draft: z.boolean().default(false),       // drafts are not published
    updated: z.coerce.date().optional(),
  }).refine((d) => d.ageMax >= d.ageMin, { message: 'ageMax must be >= ageMin' }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(200),
    date: z.coerce.date(),
    type: z.enum(['whats-on', 'guide', 'comparison', 'news']).default('guide'),
    towns: z.array(z.enum(TOWN_KEYS)).default([]),
    categories: z.array(z.enum(CATEGORY_KEYS)).default([]),
    related: z.array(z.string()).default([]), // listing ids to link to
    updated: z.coerce.date().optional(),      // set when a guide is refreshed; shown to readers and to Google
    draft: z.boolean().default(false),
  }),
});

export const collections = { listings, posts };
