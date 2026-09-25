# CLAUDE.md: West Herts Kids

Local directory of children's activities in West Herts (Watford, Rickmansworth, Croxley Green, Chorleywood, Abbots Langley). Astro 7 static site.

## Rules
- **UK English** everywhere (colour, organise, programme, centre).
- **Never invent facts** about a provider. Ages, prices, days, venues and phone numbers must come from the provider's own pages or another named public source. If a field is unknown, leave it out. Record where the data came from in `source` and the check date in `verified`.
- New or unconfirmed listings start as `draft: true`.
- Don't scrape Google Maps. Use provider websites, OpenStreetMap (`npm run collect:osm`) or Companies House.
- Don't link to expired or hijacked domains. Check what a URL actually serves before adding it (e.g. the old Chorleywood Community Arts Centre domain now serves a casino site).
- Descriptions: 2–3 short factual paragraphs, parent-focused, no hype, no claims we can't back up.
- Featured listings must stay clearly labelled.

## Commands
- `npm run dev`: local server
- `npm run build`: must pass before committing (the schema validates every listing)
- `npm run new:listing -- "Name"`: scaffold a draft listing
- `npm run collect:osm`: refresh OSM candidates in `data/osm-candidates.json`

## Where things live
- Listing schema: `src/content.config.ts`
- Towns and categories: `src/data/taxonomy.ts`
- Site settings, forms and pricing: `src/site.config.ts`
- Weekly what's-on prompt: `docs/weekly-whats-on.md`
- Providers still to verify: `docs/verification-queue.md`
