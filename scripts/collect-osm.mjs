#!/usr/bin/env node
// Pulls kid-relevant venues from OpenStreetMap (free, ODbL licence) for the West Herts bounding box
// and writes data/osm-candidates.json. These are CANDIDATES to research, not listings.
// Attribution: data © OpenStreetMap contributors.
import { writeFileSync, mkdirSync } from 'node:fs';
const BBOX = '51.60,-0.53,51.72,-0.33'; // S,W,N,E: Watford, Rickmansworth, Chorleywood, Abbots Langley
const q = `[out:json][timeout:90];(
  nwr["leisure"~"sports_centre|indoor_play|trampoline_park|water_park"](${BBOX});
  nwr["amenity"~"dancing_school|music_school|theatre"](${BBOX});
  nwr["sport"~"martial_arts|karate|taekwondo|judo|gymnastics|trampoline|climbing"]["name"](${BBOX});
  nwr["club"~"scout|sport|youth"]["name"](${BBOX});
  nwr["tourism"~"attraction|museum|zoo"]["name"](${BBOX});
  nwr["amenity"="community_centre"]["name"](${BBOX});
);out center tags;`;
const res = await fetch('https://overpass-api.de/api/interpreter', {
  method: 'POST', headers: { 'User-Agent': 'westhertskids-collector/0.1' }, body: new URLSearchParams({ data: q }),
});
const json = await res.json();
const out = json.elements.filter((e) => e.tags?.name).map((e) => ({
  osm: `${e.type}/${e.id}`, name: e.tags.name,
  kind: e.tags.leisure || e.tags.amenity || e.tags.club || e.tags.tourism || e.tags.sport,
  sport: e.tags.sport, website: e.tags.website || e.tags['contact:website'],
  postcode: e.tags['addr:postcode'], lat: e.lat ?? e.center?.lat, lon: e.lon ?? e.center?.lon,
}));
mkdirSync('data', { recursive: true });
writeFileSync('data/osm-candidates.json', JSON.stringify(out, null, 2));
console.log(`${out.length} candidates written to data/osm-candidates.json`);
