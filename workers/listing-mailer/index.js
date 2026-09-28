// whk-listing-mailer: a tiny Cloudflare Worker that emails "List your activity" submissions.
//
// It is only called by the Pages Function functions/api/list.js through a service binding,
// so it has no public route. Keep "workers.dev" and "Preview URLs" switched OFF for this Worker.
//
// Bindings and variables (Cloudflare dashboard → Workers & Pages → whk-listing-mailer → Settings):
//   EMAIL       Send Email binding (Email Routing). Sending to a VERIFIED destination address is free.
//   LISTING_TO  Text variable: the verified Email Routing destination address that should receive submissions.
//   LISTING_FROM (optional) Text variable, defaults to listings@westhertskids.co.uk
//
// Deploy: paste this file into the Worker's online editor, or `npx wrangler deploy` from this folder.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clean = (v, max = 200) => String(v ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, max);

export default {
  async fetch(request, env) {
    if (request.method !== 'POST' || new URL(request.url).pathname !== '/send') {
      return new Response('Not found', { status: 404 });
    }
    if (!env.EMAIL || !env.LISTING_TO) {
      return new Response('Mailer not configured', { status: 503 });
    }

    let d;
    try {
      d = await request.json();
    } catch {
      return new Response('Bad request', { status: 400 });
    }

    const email = clean(d.contact_email, 254).toLowerCase();
    const business = clean(d.business, 160);
    if (!business || !EMAIL_RE.test(email)) return new Response('Bad request', { status: 400 });

    const kind = d.claim ? `Claim/update: ${clean(d.claim, 120)}` : 'New listing';
    const lines = [
      `${kind} request from the West Herts Kids website.`,
      '',
      `Name:      ${clean(d.contact_name, 120)}`,
      `Email:     ${email}`,
      `Business:  ${business}`,
      `Website:   ${clean(d.website, 300) || '(none given)'}`,
      `Type:      ${clean(d.category, 60)}`,
      `Town:      ${clean(d.town, 60)}`,
      d.claim ? `Listing:   ${clean(d.claim, 120)}` : null,
      '',
      'Ages, days, times and prices:',
      String(d.details ?? '').slice(0, 4000).trim() || '(none given)',
      '',
      `They confirmed they're authorised to list this business and are happy to be emailed about it.`,
      `Sent ${clean(d.submitted, 40)} from ${clean(d.page, 200)}`,
      '',
      'Reply to this email to answer them directly. Remember: check every detail against their own website before publishing.',
    ].filter((l) => l !== null);

    try {
      await env.EMAIL.send({
        to: env.LISTING_TO,
        from: { email: env.LISTING_FROM || 'listings@westhertskids.co.uk', name: 'West Herts Kids listings' },
        replyTo: email,
        subject: `[WHK] ${kind}: ${business}`,
        text: lines.join('\n'),
      });
    } catch (err) {
      console.error('send failed', err && err.code, err && err.message);
      return new Response('Send failed', { status: 502 });
    }
    return new Response('ok');
  },
};
