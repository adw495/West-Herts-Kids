// Link watch: checks every published listing's website and booking links.
// Flags dead pages, redirects to a different domain, and parked or hijacked domains.
//
//   npm run check:links            → markdown report on stdout
//   npm run check:links -- --json  → JSON on stdout (for the weekly scheduled task)
//
// Read-only: it never edits listings. The weekly task decides what to do with the findings
// (see docs/verification-process.md).

import fs from 'node:fs';
import path from 'node:path';

const DIR = new URL('../src/content/listings/', import.meta.url);
const TIMEOUT_MS = 15000;
// Words that suggest a domain has expired and been parked, sold or taken over.
const BAD_SIGNS = [
  /\bonline casino\b/i, /\bcasino (games|bonus)\b/i, /\bslot (machines?|games)\b/i, /\bfree spins\b/i, /\bsports? betting\b/i, /\bgambling\b/i,
  /domain (is )?for sale/i, /buy this domain/i, /this domain (may be|is) for sale/i,
  /parked (free|domain)/i, /domain parking/i, /hugedomains/i, /sedoparking/i, /dan\.com/i,
];

function frontMatter(file) {
  const text = fs.readFileSync(new URL(file, DIR), 'utf8');
  const fm = text.split(/^---$/m)[1] || '';
  const get = (key) => {
    const m = fm.match(new RegExp(`^${key}:\\s*['"]?([^'"\\n]+)['"]?\\s*$`, 'm'));
    return m ? m[1].trim() : undefined;
  };
  return { id: path.basename(file, '.md'), name: get('name'), draft: get('draft') === 'true', website: get('website'), bookingUrl: get('bookingUrl') };
}

const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return ''; } };

async function check(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      redirect: 'follow', signal: ctrl.signal,
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; WestHertsKidsLinkCheck/1.0; +https://westhertskids.co.uk/about/)', accept: 'text/html,*/*' },
    });
    const finalUrl = res.url || url;
    const body = (res.headers.get('content-type') || '').includes('text/html') ? (await res.text()).slice(0, 200000) : '';
    const issues = [];
    if (res.status === 404 || res.status === 410) issues.push(`page gone (${res.status})`);
    else if (res.status >= 500) issues.push(`server error (${res.status})`);
    else if (res.status === 403 || res.status === 429) issues.push(`blocked automated check (${res.status}) — check by hand`);
    else if (res.status >= 400) issues.push(`error (${res.status})`);
    if (host(finalUrl) && host(finalUrl) !== host(url)) issues.push(`redirects to another domain: ${host(finalUrl)}`);
    const bad = BAD_SIGNS.find((re) => re.test(body));
    if (bad) issues.push(`possible parked or hijacked domain (matched ${bad})`);
    return { status: res.status, finalUrl, issues };
  } catch (err) {
    return { status: 0, finalUrl: url, issues: [err.name === 'AbortError' ? 'timed out' : `unreachable (${err.cause?.code || err.message})`] };
  } finally {
    clearTimeout(timer);
  }
}

const listings = fs.readdirSync(DIR).filter((f) => f.endsWith('.md')).map(frontMatter).filter((l) => !l.draft);
const results = [];
for (const l of listings) {
  for (const field of ['website', 'bookingUrl']) {
    if (!l[field]) continue;
    const r = await check(l[field]);
    results.push({ id: l.id, name: l.name, field, url: l[field], ...r });
  }
}

const problems = results.filter((r) => r.issues.length);
if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ checked: results.length, listings: listings.length, problems }, null, 2));
} else {
  console.log(`# Link watch\n\nChecked ${results.length} links across ${listings.length} published listings. ${problems.length} need a look.\n`);
  if (problems.length) {
    console.log('| Listing | Link | Finding |\n| --- | --- | --- |');
    for (const p of problems) console.log(`| ${p.name} (${p.id}) | ${p.field} | ${p.issues.join('; ')} |`);
  }
}
