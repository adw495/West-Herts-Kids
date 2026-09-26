# CLAUDE.md: West Herts Kids

Local directory of children's activities in West Herts (Watford, Rickmansworth, Croxley Green, Chorleywood, Abbots Langley). Astro 7 static site.

## Rules
- **UK English** everywhere (colour, organise, programme, centre).
- **Never invent facts** about a provider. Ages, prices, days, venues and phone numbers must come from the provider's own pages or another named public source. If a field is unknown, leave it out. Record where the data came from in `source` and the check date in `verified`.
- New or unconfirmed listings start as `draft: true`.
- Don't scrape Google Maps. Use provider websites, OpenStreetMap (`npm run collect:osm`) or Companies House.
- Don't link to expired or hijacked domains. Check what a URL actually serves before adding it (e.g. the old Chorleywood Community Arts Centre domain now serves a casino site).
- Descriptions: 2–3 short factual paragraphs, parent-focused, no hype, no claims we can't back up.
- Featured listings (pocket-money mode only) must stay clearly labelled.

## Low-stress rules (the owner's hard constraints; don't propose plans that break them)
This is a **passive, low-stress side project. The owner does NOT want to register a business or file Self Assessment for it.**
- **Money mode** is set in `src/site.config.ts` → `mode`:
  - `community` (**current**): no paid features. Featured flags are ignored, `/advertise/` just says listing is free, and there are no Buy buttons.
  - `pocket-money`: only if the owner explicitly asks to switch. Paid featured listings are allowed, but **total gross side income across all his side projects must stay under £1,000 a tax year (6 April to 5 April)** (the UK trading allowance). Keep a running total in `docs/income-log.md`; warn him at £750 and switch off every Buy button before £1,000.
- **Never suggest** registering a business, Self Assessment, VAT, a limited company, hiring, or income growth targets. If the site outgrows the cap, the options to offer are: stay capped, sell the site, or hand it over.
- **No cold outreach.** Don't email, DM or chase providers or sponsors. Providers come to us through the claim form. No selling of newsletter sponsorships.
- **Built to be ignored:** nothing may break or become urgent if the owner doesn't touch the site for a month. Scheduled tasks produce drafts that simply wait; featured listings expire automatically.
- The owner's time budget is **about an hour a week, optional**. Prefer automation plus a quick "approve" over anything that needs his ongoing attention.

## Commands
- `npm run dev`: local server
- `npm run build`: must pass before committing (the schema validates every listing)
- `npm run new:listing -- "Name"`: scaffold a draft listing
- `npm run collect:osm`: refresh OSM candidates in `data/osm-candidates.json`

## Where things live
- Listing schema: `src/content.config.ts`
- Towns and categories: `src/data/taxonomy.ts`
- Site settings, money mode, forms and pricing: `src/site.config.ts`
- Weekly what's-on prompt: `docs/weekly-whats-on.md`
- Providers still to verify: `docs/verification-queue.md`
