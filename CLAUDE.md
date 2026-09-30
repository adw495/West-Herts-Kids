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

## Low-stress and money rules (the owner's constraints; don't propose plans that break them)
This is a **passive, low-stress side project**, but the owner approved a phased revenue plan on 30 Sep 2026 and wants it to earn, eventually **more than £1,000 a year**. He will take professional advice on tax. Give factual information with a "not an accountant" caveat, never tax advice.
- **Money mode** is set in `src/site.config.ts` → `mode`:
  - `community` (**current**): no paid features. Featured flags are ignored, `/advertise/` just says listing is free, and there are no Buy buttons.
  - `pocket-money` (**Phase 1**): switch only when the trigger is met (**1,500 visits a month for 2 months running, or 250 newsletter subscribers**) AND the owner says yes. Allowed: inbound featured listings (clearly labelled, free listings keep their normal order) and clearly labelled affiliate links on guides.
  - **Phase 2**: only when Phase 1 income is heading past £1,000 a tax year, or at 5,000 visits a month and 1,000 subscribers, AND the owner says yes. Adds one clearly marked newsletter sponsor per issue, seasonal guide sponsorship and the beehiiv Ad Network.
- **Income log:** keep a running total of gross side income per tax year (6 April to 5 April) in `docs/income-log.md`. At £750, remind the owner that going past £1,000 means registering for Self Assessment by 5 October after that tax year ends, and that he planned to take professional advice. Don't switch anything off; he decides.
- **Never:** charge to be listed at all, add display ads (AdSense), or sell data or email addresses. Money never changes what is listed or how it is described.
- **No cold outreach.** Don't email, DM or chase providers or sponsors. They come to us through the claim form and `/advertise/`.
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
- Accuracy and growth rules (weekly re-check, self-learning schedule, finding new activities): `docs/verification-process.md`
- What each re-check changed: `docs/verification-log.md`
- Side income running total (per tax year): `docs/income-log.md`
- `npm run check:links` (dead/hijacked links) and `npm run check:due` (listings due a re-check)
