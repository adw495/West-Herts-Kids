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

  // Paste the form endpoints once the accounts exist (Tally, Formspree, MailerLite, Buttondown, etc.).
  // Until they're set, the forms fall back to a mailto: link.
  forms: {
    newsletterAction: '', // e.g. https://buttondown.com/api/emails/embed-subscribe/westhertskids
    listingAction: '',    // e.g. https://tally.so/r/xxxx or https://formspree.io/f/xxxx
  },

  // Featured listing pricing, shown on /advertise/
  pricing: {
    featuredMonthly: 25,
    featuredYearly: 240,
    newsletterSponsor: 40,
  },
};
