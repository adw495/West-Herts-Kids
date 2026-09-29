# Listing accuracy and growth process

The rules the weekly scheduled task follows (and anyone checking listings by hand). Goal: every listing
matches the provider's own website, nothing stale sits on the site unflagged, and the directory keeps
growing until it is THE place parents check for kids' activities in West Herts.

Hard rules from CLAUDE.md still apply: never invent facts, provider's own pages (or a named official
source) only, no Google Maps scraping, **no contacting providers** (no cold outreach), UK English.

## Weekly run (Mondays)

1. **Link watch** — `npm run check:links -- --json`. Every website/booking link: dead, redirected to another
   domain, parked or hijacked. Sites that return 403/429 block automated checks: open them in the owner's
   Chrome instead.
2. **Due list** — `npm run check:due -- --json` (add `--holidays` in the two weeks before any school holiday,
   so holiday camps are always fresh). Check up to 12 due listings per run, most overdue first.
3. **Re-verify each due listing** against the provider's own pages: ages, days, times, prices, venue,
   postcode, SEND notes, season, and whether it still runs at all.
4. **Discover new activities** (growth — see below): up to 5 new, verified listings per run.
5. **Write results** as ONE branch + pull request `auto-verify-YYYY-MM-DD` (see "Output").

## What to do with each finding

| Finding | Action |
| --- | --- |
| Details unchanged | Set `verified` to today. Apply the learning rule (below). |
| A detail changed | Update the field(s) from the provider's page, set `verified` and `lastChanged` to today, add a line to `docs/verification-log.md` with the source URL. |
| Site gone, parked or hijacked, or provider says it has closed | Set `draft: true`, add a one-line reason at the top of the body, log it. Never delete the file. |
| Can't confirm (site blocks checks, details only inside a booking app) | Leave the fields as they are, do NOT refresh `verified`, list it in the report for a manual look. |
| Provider has moved outside our towns | `draft: true` with the reason, log it. |

## Self-learning schedule

Each listing has `checkEvery` (days, default 90) and `lastChanged`.

- Something changed at this check → `checkEvery = 30`.
- Nothing changed → multiply `checkEvery` by 1.5 (round to whole days), max 180.
- Holiday camps and seasonal activities: max 60, and always re-checked in the 2 weeks before each school holiday.
- Unconfirmable twice in a row → flag in the report as "needs the owner's eyes" rather than retrying forever.

The site shows a warning on any listing more than 30 days past its interval, so an ignored week never
leaves parents with silently stale details.

## Growth: finding new activities

Every run, look for providers in Watford, Rickmansworth, Croxley Green, Chorleywood, Abbots Langley,
Kings Langley, Bushey and South Oxhey that we don't list yet. Good sources (use them to FIND leads, then
verify every detail on the provider's own site; never copy their text):

- OpenStreetMap candidates: `npm run collect:osm` → `data/osm-candidates.json`
- Class finders of national brands with local franchises (e.g. Stagecoach, Tumble Tots, Little Kickers,
  Monkey Music, Kumon, Water Babies, Rugbytots, Scouts/Guides group finders)
- Happity, ClassForKids, Club Hub UK, All4Kids (lead lists only)
- Hertfordshire Directory and the SEND Local Offer; Watford and Three Rivers council activity pages
- Local venues' own "what's on" pages (leisure centres, libraries, Watford Palace Theatre, Cassiobury Park)

Priorities: categories and towns with the fewest listings first (check the town × activity pages with
only 2 listings, and South Oxhey). New listings go in as full listings (not drafts) only when ages, days
or season, and venue are confirmed on the provider's own site; otherwise `draft: true` with a note, and add
the lead to `docs/verification-queue.md`.

## Output

- One branch `auto-verify-YYYY-MM-DD` with all listing edits, the log lines and any new listings, and a pull
  request titled `Weekly check: N re-verified, N updated, N hidden, N new`. `npm run build` must pass first.
- The PR description = a short report: changes (with source links), hidden listings and why, new
  listings, anything needing the owner's eyes, and link-watch findings.
- Never merge. The owner approves with one click.
