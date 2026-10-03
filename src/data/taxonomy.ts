// `search` is the phrase parents actually type (used in titles and headings); `q` is its lower-case form for prose.
// Towns and categories are defined once here and drive the schema, the filters and the landing pages.

export const TOWNS = {
  'rickmansworth': { name: 'Rickmansworth', blurb: 'Classes, clubs and activities for children in and around Rickmansworth town centre, Mill End and Batchworth.' },
  'croxley-green': { name: 'Croxley Green', blurb: "Kids' activities in Croxley Green, from baby groups to after-school sport." },
  'chorleywood': { name: 'Chorleywood', blurb: 'Things to do for children and families in Chorleywood and Loudwater.' },
  'watford': { name: 'Watford', blurb: "Kids' classes, clubs, holiday camps and days out across Watford, Oxhey and Garston." },
  'abbots-langley': { name: 'Abbots Langley', blurb: 'Activities for children in Abbots Langley, Bedmond and Leavesden.' },
  'kings-langley': { name: 'Kings Langley', blurb: 'Children’s activities in and around Kings Langley.' },
  'bushey': { name: 'Bushey', blurb: 'Classes and clubs for kids in Bushey and Bushey Heath.' },
  'south-oxhey': { name: 'South Oxhey & Carpenders Park', blurb: "Kids' activities in South Oxhey and Carpenders Park." },
} as const;

export const CATEGORIES = {
  'baby-toddler': { name: 'Baby & toddler', emoji: '🍼', blurb: 'Baby groups, sensory classes, music and movement for under-5s.', search: 'Baby and toddler classes', q: 'baby and toddler classes' },
  'swimming': { name: 'Swimming', emoji: '🏊', blurb: 'Swimming lessons and water confidence classes.', search: 'Swimming lessons', q: 'swimming lessons' },
  'football-sport': { name: 'Football & team sports', emoji: '⚽', blurb: 'Football, rugby, cricket, netball and multi-sport clubs.', search: 'Football and sports clubs', q: 'football and sports clubs' },
  'gymnastics-trampolining': { name: 'Gymnastics & trampolining', emoji: '🤸', blurb: 'Gymnastics, tumbling, trampolining and parkour.', search: 'Gymnastics and trampolining classes', q: 'gymnastics and trampolining classes' },
  'martial-arts': { name: 'Martial arts', emoji: '🥋', blurb: 'Karate, taekwondo, judo, jiu-jitsu and kickboxing for kids.', search: 'Karate and martial arts classes', q: 'martial arts classes' },
  'dance-drama': { name: 'Dance & drama', emoji: '💃', blurb: 'Ballet, street dance, musical theatre and drama schools.', search: 'Dance and drama classes', q: 'dance and drama classes' },
  'music': { name: 'Music', emoji: '🎵', blurb: 'Music lessons, choirs, bands and early-years music.', search: 'Music lessons and classes', q: 'music lessons and classes' },
  'arts-crafts': { name: 'Arts & crafts', emoji: '🎨', blurb: 'Art classes, pottery, crafts and creative clubs.', search: 'Art and craft classes', q: 'art classes' },
  'stem-coding': { name: 'STEM & coding', emoji: '🤖', blurb: 'Coding, robotics, science and maths clubs.', search: 'Coding and STEM clubs', q: 'coding and STEM clubs' },
  'tuition': { name: 'Tuition & languages', emoji: '📚', blurb: 'Tutoring, 11+ preparation and language classes.', search: 'Tutoring and language classes', q: 'tutoring' },
  'holiday-camps': { name: 'Holiday camps', emoji: '🏕️', blurb: 'Half-term and school holiday clubs and camps.', search: 'Holiday camps and clubs', q: 'holiday camps' },
  'outdoor-nature': { name: 'Outdoor & nature', emoji: '🌳', blurb: 'Forest school, outdoor adventure, youth groups and nature activities.', search: 'Outdoor activities and Scouts', q: 'outdoor activities' },
  'play-parties': { name: 'Soft play & parties', emoji: '🎈', blurb: 'Soft play, play centres and party venues.', search: 'Soft play and party venues', q: 'soft play and party venues' },
  'days-out': { name: 'Days out', emoji: '🚂', blurb: 'Farms, parks, museums and attractions for families.', search: 'Family days out', q: 'days out' },
} as const;

export type TownKey = keyof typeof TOWNS;
export type CategoryKey = keyof typeof CATEGORIES;
export const TOWN_KEYS = Object.keys(TOWNS) as [TownKey, ...TownKey[]];
export const CATEGORY_KEYS = Object.keys(CATEGORIES) as [CategoryKey, ...CategoryKey[]];
