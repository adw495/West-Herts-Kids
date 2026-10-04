// Central settings. Change things here, not in the templates.
export const SITE = {
  name: 'West Herts Kids',
  // Registered 27 Sep 2026 (Cloudflare Registrar, auto-renew). westhertskids.pages.dev and www. redirect here
  // via functions/_middleware.js. If this ever changes, also update astro.config.mjs `site` and public/robots.txt.
  domain: 'westhertskids.co.uk',
  url: 'https://westhertskids.co.uk',
  tagline: "Classes, clubs and things to do for kids across Watford, Rickmansworth, Croxley, Chorleywood and Abbots Langley",
  email: 'hello@westhertskids.co.uk',
  // The West Herts Kids Facebook Page (no username yet; swap to facebook.com/westhertskids once Facebook allows one).
  facebook: 'https://www.facebook.com/profile.php?id=61594792004406',

  // Site-wide alert bar (email capture, as recommended in the video). Set enabled: false to hide.
  alertBar: {
    enabled: true,
    text: "Get the free 'What's on for kids' email, most Thursdays in term time",
    linkText: 'Sign me up',
    href: '/newsletter/',
  },

  // newsletterAction: our own Cloudflare Pages Function (functions/api/subscribe.js), which forwards to beehiiv.
  // listingAction: our own Pages Function (functions/api/list.js), which emails submissions via the
  //   whk-listing-mailer Worker (workers/listing-mailer/).
  forms: {
    newsletterAction: '/api/subscribe',
    listingAction: '/api/list',
  },

  // Money mode (see CLAUDE.md, "Low-stress and money rules"):
  //   'community'     – no paid features at all; /advertise/ just says listings are free. (current)
  //   'pocket-money'  – Phase 1: inbound featured listings and labelled affiliate links. Switch only when
  //                     the traffic trigger in CLAUDE.md is met and the owner says yes.
  mode: 'community' as 'community' | 'pocket-money',

  // Featured listing pricing, shown on /advertise/ in pocket-money mode only
  pricing: {
    featuredMonthly: 8,
    featuredYearly: 80,
    newsletterSponsor: 40,
  },
};
