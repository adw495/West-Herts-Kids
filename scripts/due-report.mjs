// Which listings are due for re-verification, oldest first.
//
//   npm run check:due                 → markdown report
//   npm run check:due -- --json       → JSON (for the weekly scheduled task)
//   npm run check:due -- --holidays   → also treat holiday-camp listings as due (run before each school holiday)
//
// A listing is due when today is past verified + checkEvery (default 90 days).
// It is overdue (and the site shows a warning) 30 days after that.

import fs from 'node:fs';
import path from 'node:path';

const DIR = new URL('../src/content/listings/', import.meta.url);
const DEFAULT = 90, GRACE = 30;
const today = new Date();
const holidays = process.argv.includes('--holidays');

const rows = fs.readdirSync(DIR).filter((f) => f.endsWith('.md')).map((f) => {
  const fm = fs.readFileSync(new URL(f, DIR), 'utf8').split(/^---$/m)[1] || '';
  const get = (k) => (fm.match(new RegExp(`^${k}:\\s*['"]?([^'"\\n]+)['"]?\\s*$`, 'm')) || [])[1]?.trim();
  const cats = (fm.match(/^categories:\s*\[([^\]]*)\]/m)?.[1] ?? fm.match(/^categories:\s*\n((?:\s*-\s*.+\n?)+)/m)?.[1] ?? '')
    .split(/[,\n]/).map((x) => x.replace(/^\s*-\s*/, '').trim()).filter(Boolean);
  const verified = get('verified') ? new Date(get('verified')) : null;
  const every = Number(get('checkEvery')) || DEFAULT;
  const age = verified ? Math.floor((today - verified) / 864e5) : Infinity;
  const holidayCamp = cats.includes('holiday-camps');
  return {
    id: path.basename(f, '.md'), name: get('name'), draft: get('draft') === 'true', website: get('website'),
    verified: get('verified') ?? null, checkEvery: every, ageDays: age, holidayCamp,
    due: age >= every || (holidays && holidayCamp), overdue: age > every + GRACE,
  };
}).filter((r) => !r.draft).sort((a, b) => (b.ageDays - b.checkEvery) - (a.ageDays - a.checkEvery));

const due = rows.filter((r) => r.due);
if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ today: today.toISOString().slice(0, 10), published: rows.length, due }, null, 2));
} else {
  console.log(`# Re-verification due\n\n${due.length} of ${rows.length} published listings are due (${due.filter((r) => r.overdue).length} overdue).\n`);
  if (due.length) {
    console.log('| Listing | Last checked | Interval (days) | Status |\n| --- | --- | --- | --- |');
    for (const r of due) console.log(`| ${r.name} (${r.id}) | ${r.verified ?? 'never'} | ${r.checkEvery} | ${r.overdue ? 'OVERDUE' : 'due'}${r.holidayCamp ? ', holiday camp' : ''} |`);
  }
}
