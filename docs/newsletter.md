# Newsletter: beehiiv setup

The site's sign-up forms post to our own endpoint, `/api/subscribe` (`functions/api/subscribe.js`, a Cloudflare Pages Function). That endpoint adds the email to beehiiv using the API.
The API key lives only in Cloudflare's encrypted settings and never reaches the browser.

## One-off setup (about 20 minutes)

### In beehiiv
1. Sign up at beehiiv.com on the free **Launch** plan (up to 2,500 subscribers). Publication name: **West Herts Kids**.
2. **Settings → Publication:** add the logo, and set the sender name to "West Herts Kids" and the reply-to address to hello@westhertskids.co.uk.
3. **Settings → Subscribe forms / Audience:** turn **double opt-in ON** (best practice under UK GDPR, and it keeps the list clean).
4. **Settings → Emails → Welcome email:** paste the draft below.
5. Optional: **Settings → Domains:** point `news.westhertskids.co.uk` at the web archive (via Cloudflare DNS).
6. **Settings → API:** copy the **Publication ID** (starts `pub_`) and **create an API key**. Copy the key once and keep it in your password manager.

### In Cloudflare (once the site is on Cloudflare Pages)
Workers & Pages → the project → **Settings → Variables and Secrets** → add, for **Production** (and Preview if you want to test there):

| Name | Type | Value |
|---|---|---|
| `BEEHIIV_API_KEY` | **Secret** | the key from step 6 |
| `BEEHIIV_PUBLICATION_ID` | Text | `pub_…` |

Redeploy (Deployments → ⋯ → Retry deployment). Then test: sign up on `/newsletter/` with your own email and check it appears in beehiiv → Subscribers.

Until those two values are set, the form shows "Sign-ups are not switched on yet" rather than failing silently.

## How it behaves
- **With JavaScript:** the form submits in place and shows a message.
- **Without JavaScript:** it redirects to `/newsletter/thanks/`, or back to `/newsletter/` with an error message.
- **Spam protection:** a hidden "honeypot" field. Bots that fill it are quietly ignored.
- **Tracking:** each sign-up is tagged with `utm_campaign` for where it happened (`newsletter-page`, `article-band`), so beehiiv shows which forms work best.
- **Testing locally:** `npx wrangler pages dev -- npm run dev` runs the function locally. Put the two values in a `.dev.vars` file, which is git-ignored.

---

## Draft: welcome email

**Subject:** You're in: here's how West Herts Kids works

Hi there,

Thanks for signing up to **What's on for kids**, the free weekly email for families around Watford, Rickmansworth, Croxley Green, Chorleywood and Abbots Langley.

Every **Thursday** you'll get:
- **This weekend:** family events, workshops and days out nearby
- **Coming up:** holiday camps and courses worth booking early
- **New on the site:** classes and clubs we've just added

Everything on westhertskids.co.uk is checked against the provider's own information, and every listing shows when it was last checked. If you spot something out of date, just reply to this email.

**Start here:**
- [Browse all activities by age and town](https://westhertskids.co.uk/activities/)
- [Swimming lessons: your local options](https://westhertskids.co.uk/whats-on/swimming-lessons-watford-rickmansworth/)
- [Run a class? Listing is free](https://westhertskids.co.uk/list-your-activity/)

Speak soon,
West Herts Kids

*You're getting this because you signed up at westhertskids.co.uk. Unsubscribe any time using the link below.*

---

## Template: weekly issue

**Subject line formula:** `[Main thing] + 3 more things for kids this week` (e.g. "Half-term camps still with spaces + 3 more things this week")

1. **One-line intro** (a local, human note: the weather, the half-term countdown).
2. **This weekend** (3–5 items): **Name**, venue, town, day and time, price if known, one line on what it is, and a link.
3. **Book now** (1–3 items): camps or courses that fill up.
4. **New on West Herts Kids** (1–2 listings), linked to the site.
5. **Sponsor slot** (later): "This week's issue is supported by [local provider]". Always clearly labelled.
6. **Footer:** "Know something we've missed? Reply and tell us."

The weekly scheduled task already drafts the items; paste them into this template in beehiiv.
