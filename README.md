# West Herts Kids

A hyper-local directory of children's activities across Watford, Rickmansworth, Croxley Green, Chorleywood and Abbots Langley.
It's built with [Astro](https://astro.build) as a static site. Every listing is a Markdown file, and it's designed to be run with Claude Code.

- **Domain (to register):** westhertskids.co.uk (and .com). Both were free on 25 Sep 2026.
- **Hosting (planned):** Cloudflare Pages (free tier)

---

## 1. Move the project to your Mac

You need **Node 22.12 or newer** (`brew install node` or use fnm/nvm) and **git**.

```bash
# 1. Unzip westhertskids.zip into ~/Projects (or wherever you keep code)
cd ~/Projects/westhertskids

# 2. Install dependencies (node_modules isn't in the zip)
npm install

# 3. Run it locally
npm run dev          # http://localhost:4321

# 4. Put it on GitHub (private repo). With the GitHub CLI:
gh repo create westhertskids --private --source=. --push
```

Once it's on GitHub, Claude Code and scheduled tasks can open pull requests, and Cloudflare deploys automatically on every push.

## 2. Go live on Cloudflare Pages

We host on Cloudflare Pages rather than Vercel. Vercel's free Hobby plan is for personal, non-commercial use only, and this site may take a little income from featured listings later, which would mean Vercel's $20/month Pro plan. Cloudflare's free plan covers our needs, including the `/functions` newsletter endpoint.


1. Register `westhertskids.co.uk` and `.com` (Cloudflare Registrar sells at cost).
2. In Cloudflare, go to **Workers & Pages → Create → Pages → Connect to Git** and pick the repo.
3. Build settings: framework **Astro**, build command `npm run build`, output directory `dist`.
4. Add the custom domain `westhertskids.co.uk` and redirect `.com` and `www` to it.
5. Turn on **Cloudflare Web Analytics**, which is free and cookie-free. That's why the privacy page says there are no tracking cookies.

## 3. Day-to-day

| Task | How |
|---|---|
| Add a listing | `npm run new:listing -- "Provider Name"`, fill it in, set `draft: false` |
| Mark a paid featured listing (pocket-money mode only) | `featured: true` and `featuredUntil: 2027-01-31` in the listing |
| Provider claims a listing | Update the details, then set `claimed: true` and today's `verified` date |
| Removal request | Delete the file (and reply within 7 days, as the privacy notice promises) |
| New article / what's on | Add a Markdown file to `src/content/posts/`, and link listings via `related:` |
| Find new candidates | `npm run collect:osm`, then research `data/osm-candidates.json` |
| Check everything builds | `npm run build` |

Towns and categories live in `src/data/taxonomy.ts`. Add a key there and every filter, landing page and footer updates.
Town-and-category pages (e.g. `/towns/rickmansworth/swimming/`) only generate once there are 2 or more listings, so there are no thin pages.

## 4. Settings to fill in (`src/site.config.ts`)

- `forms.newsletterAction`: already set to `/api/subscribe`, our Cloudflare Pages Function that forwards to **beehiiv**. Setup steps: `docs/newsletter.md`
- `forms.listingAction`: a Tally or Formspree endpoint for the "List your activity" form
- `mode`: `community` (no paid features, the current setting) or `pocket-money` (capped featured listings). See the low-stress rules in `CLAUDE.md`
- `pricing`: featured listing prices, shown on `/advertise/` in pocket-money mode only

Until the beehiiv keys are set in Cloudflare, the newsletter form shows a polite "not switched on yet" message. Until the listing form endpoint is set, that form falls back to a `mailto:` link.

## 5. Compliance checklist before launch

- [ ] Review the privacy page (it's marked as a draft template) and decide on ICO registration (the data protection fee)
- [ ] **PECR:** cold marketing emails are fine to limited companies (with an opt-out), but sole traders need prior consent. Check business type before any outreach.
- [ ] Label featured listings clearly (already done with the "★ Featured" badge) to meet ASA/CMA rules on ads
- [ ] Keep the OpenStreetMap attribution in the footer (ODbL)
- [ ] Get your own email on the domain (e.g. Cloudflare Email Routing to your inbox)

## Project structure

```
src/
  content/listings/*.md   one file per provider (schema in src/content.config.ts)
  content/posts/*.md      what's-on round-ups and guides
  data/taxonomy.ts        towns and categories
  lib/listings.ts         helpers: sorting, labels, schema.org JSON-LD
  pages/                  routes (activities, category, towns, whats-on, ...)
  site.config.ts          name, forms, pricing, alert bar
functions/api/subscribe.js  newsletter sign-up endpoint (Cloudflare Pages Function → beehiiv API)
scripts/                  new-listing, collect-osm
data/seed.py              the original 39 seeded listings (source of truth for the first batch)
docs/                     automation prompts, verification queue
```
