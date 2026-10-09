// Branded social preview images (Open Graph, 1200x630), drawn at build time with satori (layout + text to SVG)
// and sharp (SVG to PNG). Served from /og/<name>.png by src/pages/og/[name].png.ts.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';

const NM = join(process.cwd(), 'node_modules');
const font = (pkg: string, file: string) => readFileSync(join(NM, pkg, 'files', file));
let fonts: any[] | null = null;
const loadFonts = () => (fonts ??= [
  { name: 'Fraunces', data: font('@fontsource/fraunces', 'fraunces-latin-700-normal.woff'), weight: 700, style: 'normal' },
  { name: 'Fraunces', data: font('@fontsource/fraunces', 'fraunces-latin-600-italic.woff'), weight: 600, style: 'italic' },
  { name: 'Figtree', data: font('@fontsource/figtree', 'figtree-latin-600-normal.woff'), weight: 600, style: 'normal' },
]);

// Site palette (src/styles/global.css)
const C = { paper: '#F6F1E6', paper2: '#EFE8D8', moss: '#4A6547', deep: '#1F4E4A', brick: '#A8432A' };
const logo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle cx="28" cy="28" r="20" fill="#8FB3BF" opacity="0.45"/><path d="M18 28.5 C 22 32.5 30 33.5 34 31.5 C 30 27.5 24 26.5 18 28.5 Z" fill="#B8573A" opacity="0.85"/><path d="M17 23 C 19 18 26 16 31 19.5 C 28 21 22 22 17 23 Z" fill="#1F4E4A" opacity="0.8"/><g fill="none" stroke="#1F4E4A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M25 4.5 C 38 4 48 14 47.5 26 C 47 39 37 48 25 47.5 C 13 47 4.5 38 5 26 C 5.5 14 13 5 25 4.5"/><path d="M16 23 C 18 17 26 15 31 19 C 35 22 37 27 40 33 L 34 32 C 30 34 22 33 18 29"/><path d="M16 23 L 7 24.5 L 16.5 25.8"/><path d="M22 36 L 21 40.5 M 27 35.5 L 27 40.5"/><path d="M11 41.5 C 20 40.5 30 41 40 42"/></g><circle cx="20.5" cy="22.4" r="1.3" fill="#23262A"/></svg>`;
const route = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 150"><path d="M0 40 C 300 0 700 70 1200 25 L1200 150 L0 150 Z" fill="${C.paper2}"/><path d="M80 98 C 260 108 380 72 560 78 C 740 84 860 112 1120 82" fill="none" stroke="${C.deep}" stroke-width="9" stroke-linecap="round"/>${[[120, 101], [400, 82], [700, 88], [960, 99]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="13" fill="${C.paper}" stroke="${C.deep}" stroke-width="7"/>`).join('')}</svg>`;
const uri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
const h = (type: string, style: Record<string, unknown>, children?: unknown) => ({ type, props: { style, children } });

export interface OgSpec { kicker: string; title: string; sub: string }

function card({ kicker, title, sub }: OgSpec) {
  // Shrink long titles so they fit in three lines.
  const size = title.length > 70 ? 60 : title.length > 48 ? 70 : 82;
  return h('div', { width: 1200, height: 630, display: 'flex', flexDirection: 'column', background: C.paper, fontFamily: 'Figtree', position: 'relative' }, [
    h('div', { display: 'flex', alignItems: 'center', gap: 16, padding: '56px 80px 0' }, [
      { type: 'img', props: { src: uri(logo), width: 60, height: 60 } },
      h('div', { fontFamily: 'Fraunces', fontWeight: 700, fontSize: 32, color: C.deep }, 'West Herts Kids'),
      h('div', { marginLeft: 'auto', fontSize: 22, fontWeight: 600, color: C.moss, letterSpacing: 2, textTransform: 'uppercase' }, kicker),
    ]),
    h('div', { display: 'flex', flexDirection: 'column', padding: '44px 80px 0', maxWidth: 1120 }, [
      h('div', { fontFamily: 'Fraunces', fontWeight: 700, fontSize: size, lineHeight: 1.08, color: C.deep, letterSpacing: -1 }, title),
      h('div', { fontFamily: 'Fraunces', fontStyle: 'italic', fontWeight: 600, fontSize: 30, color: C.brick, marginTop: 22 }, sub),
    ]),
    { type: 'img', props: { src: uri(route), width: 1200, height: 150, style: { position: 'absolute', left: 0, bottom: 0 } } },
  ]);
}

export async function ogPng(spec: OgSpec): Promise<Buffer> {
  const svg = await satori(card(spec) as any, { width: 1200, height: 630, fonts: loadFonts() });
  return sharp(Buffer.from(svg)).png({ palette: true, colours: 64, compressionLevel: 9 }).toBuffer();
}
