// Tells IndexNow search engines (Bing, and through it DuckDuckGo, Yahoo, Ecosia and ChatGPT search; plus Yandex,
// Seznam, Naver and Yep) which pages changed, straight after Cloudflare Pages deploys them.
// Run by .github/workflows/indexnow.yml on every push to main. No secrets needed: the key is public by design
// and lives at /<key>.txt on the site.
//
//   node scripts/indexnow.mjs <before-sha> <after-sha>   submit pages changed between two commits
//   node scripts/indexnow.mjs --all                      submit every page in the sitemap (first run, or after a big change)
import { execSync } from 'node:child_process';

const SITE = 'https://westhertskids.co.uk';
const KEY = '4a34d8ba5fb00c2687c2eecb23c85927';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function sitemapUrls() {
  const index = await (await fetch(`${SITE}/sitemap-index.xml`)).text();
  const maps = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const urls = [];
  for (const m of maps) urls.push(...[...(await (await fetch(m)).text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((x) => x[1]));
  return urls;
}

function changedUrls(before, after) {
  let files = [];
  try {
    files = execSync(`git diff --name-only ${before} ${after}`, { encoding: 'utf8' }).split('\n').filter(Boolean);
  } catch {
    files = execSync(`git show --name-only --format= ${after}`, { encoding: 'utf8' }).split('\n').filter(Boolean);
  }
  const urls = new Set();
  for (const f of files) {
    let m;
    if ((m = f.match(/^src\/content\/posts\/(.+)\.md$/))) {
      urls.add(`${SITE}/whats-on/${m[1]}/`);
      urls.add(`${SITE}/whats-on/`);
      urls.add(`${SITE}/whats-on/this-weekend/`);
      urls.add(`${SITE}/`);
    } else if ((m = f.match(/^src\/content\/listings\/(.+)\.md$/))) {
      urls.add(`${SITE}/activities/${m[1]}/`);
      urls.add(`${SITE}/activities/`);
    } else if (f.startsWith('src/')) {
      urls.add(`${SITE}/`);
    }
  }
  return [...urls];
}

const args = process.argv.slice(2);
const all = args[0] === '--all';
const urls = all ? null : changedUrls(args[0], args[1]);
if (!all && urls.length === 0) { console.log('No page changes to submit.'); process.exit(0); }

// Wait for the deploy: the key file must be live, and (when submitting changed pages) the first page must answer 200.
const probe = all ? `${SITE}/` : urls[0];
for (let i = 0; ; i++) {
  const [k, p] = await Promise.all([fetch(`${SITE}/${KEY}.txt`).catch(() => null), fetch(probe).catch(() => null)]);
  const keyOk = k?.ok && (await k.text()).trim() === KEY;
  if (keyOk && (p?.ok || p?.status === 404)) break;
  if (i >= 20) { console.log('Site not ready after ~10 minutes; giving up quietly.'); process.exit(0); }
  await sleep(30_000);
}
await sleep(all ? 0 : 60_000); // give Cloudflare a moment to finish rolling out the new build

const urlList = (all ? await sitemapUrls() : urls).slice(0, 10_000);
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: ${res.status} ${res.statusText} for ${urlList.length} URL(s)`);
urlList.slice(0, 50).forEach((u) => console.log(' ', u));
// 200/202 = accepted. Anything else is logged but never fails the run: nothing here should ever need attention.
