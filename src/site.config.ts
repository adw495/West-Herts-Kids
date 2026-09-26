// Central settings. Change things here, not in the templates.
export const SITE = {
  name: 'West Herts Kids',
  domain: 'westhertskids.co.uk',
  url: 'https://westhertskids.co.uk',
  tagline: "Classes, clubs and things to do for kids across Watford, Rickmansworth, Croxley, Chorleywood and Abbots Langley",
  email: 'hello@westhertskids.co.uk',

  // Site-wide alert bar (email capture, as recommended in the video). Set enabled: false to hide.
  alertBar: {
    enabled: true,
    text: "Get the free weekly 'What's on for kids' email every Thursday",
    linkText: 'Sign me up',
    href: '/newsletter/',
  },

  // newsletterAction: our own Cloudflare Pages Function (functions/api/subscribe.js), which forwards to beehiiv.
  // listingAction: paste a Tally/Formspree endpoint once it exists; until then that form falls back to mailto:.
  forms: {
    newsletterAction: '/api/subscribe',
    listingAction: '',    // e.g. https://tally.so/r/xxxx or https://formspree.io/f/xxxx
  },

  // Money mode (see CLAUDE.md, "Low-stress rules"):
  //   'community'     – no paid features at all; /advertise/ just says listings are free. (current)
  //   'pocket-money'  – featured listings on sale, but total side income capped under £1,000 a tax year.
  mode: 'community' as 'community' | 'pocket-money',

  // Featured listing pricing, shown on /advertise/ in pocket-money mode only
  pricing: {
    featuredMonthly: 25,
    featuredYearly: 240,
    newsletterSponsor: 40,
  },
};
