#!/usr/bin/env node
// Usage: npm run new:listing -- "Provider Name"
// Creates src/content/listings/<slug>.md as a draft with every field stubbed.
import { writeFileSync, existsSync } from 'node:fs';
const name = process.argv.slice(2).join(' ').trim();
if (!name) { console.error('Usage: npm run new:listing -- "Provider Name"'); process.exit(1); }
const slug = name.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-').replace(/-+/g, '-');
const path = `src/content/listings/${slug}.md`;
if (existsSync(path)) { console.error(`Already exists: ${path}`); process.exit(1); }
const today = new Date().toISOString().slice(0, 10);
writeFileSync(path, `---
name: ${JSON.stringify(name)}
summary: "One sentence, under 200 characters, on what it is and who it's for."
categories: [baby-toddler]   # see src/data/taxonomy.ts
towns: [rickmansworth]       # see src/data/taxonomy.ts
ageMin: 0
ageMax: 5
season: [term-time]          # term-time | holidays | year-round
schedule: []                 # - { day: sat, start: "09:30", end: "10:15", note: "Ages 3-4" }
# priceFrom: 9
# priceUnit: session         # session | week | term | month | day | year | entry
# priceNote: ""
freeTrial: false
send: unknown                # yes | no | unknown
venue: {}                    # { name, address, postcode }
# website: https://
# email:
# phone:
source: "provider website"
verified: ${today}
draft: true                  # set to false once checked
---

Two or three short paragraphs of facts: what happens in a session, age groups, when and where, price, and anything parents should know. Only include facts from the provider's own information.
`);
console.log(`Created ${path}`);
