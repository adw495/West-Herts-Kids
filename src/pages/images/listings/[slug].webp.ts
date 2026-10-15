// Listing photos, built at deploy time from their freely licensed originals (listing `photo.sourceImage`,
// e.g. a Geograph CC BY-SA photo), resized and converted to WebP. Keeps binary files out of git.
// If the original can't be fetched, a plain placeholder is served so the build never fails.
import type { APIRoute, GetStaticPaths } from 'astro';
import sharp from 'sharp';
import { getListings } from '../../../lib/listings';

export const getStaticPaths = (async () =>
  (await getListings())
    .filter((l) => l.data.photo?.sourceImage && l.data.photo.src === `/images/listings/${l.id}.webp`)
    .map((l) => ({ params: { slug: l.id }, props: { url: l.data.photo!.sourceImage!, w: l.data.photo!.width, h: l.data.photo!.height } }))) satisfies GetStaticPaths;

async function fetchWithRetry(url: string, tries = 3): Promise<Buffer | null> {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': 'westhertskids.co.uk site build (photo credited, CC BY-SA)' }, signal: AbortSignal.timeout(20000) });
      if (r.ok) return Buffer.from(await r.arrayBuffer());
    } catch { /* retry */ }
    await new Promise((res) => setTimeout(res, 1500 * (i + 1)));
  }
  return null;
}

export const GET: APIRoute = async ({ props }) => {
  const { url, w, h } = props as { url: string; w: number; h: number };
  const src = await fetchWithRetry(url);
  const out = src
    ? await sharp(src).resize(w, h, { fit: 'cover' }).webp({ quality: 72 }).toBuffer()
    : (console.warn(`[photos] could not fetch ${url}; using a placeholder`),
      await sharp({ create: { width: w, height: h, channels: 3, background: '#e9e1cf' } }).webp().toBuffer());
  return new Response(new Uint8Array(out), { headers: { 'Content-Type': 'image/webp' } });
};
