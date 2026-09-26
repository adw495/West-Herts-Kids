// Cloudflare Pages Function: POST /api/subscribe
// Adds an email to the beehiiv newsletter without exposing the API key to the browser.
//
// Set these in Cloudflare → Workers & Pages → west-herts-kids → Settings → Variables and Secrets:
//   BEEHIIV_API_KEY         (type: Secret)  – beehiiv → Settings → API → Create new key
//   BEEHIIV_PUBLICATION_ID  (type: Text)    – beehiiv → Settings → API, starts with "pub_"
//
// Works with and without JavaScript:
//   - fetch() with "Accept: application/json" gets JSON back ({ ok, message })
//   - a plain HTML form post gets redirected to /newsletter/thanks/ or /newsletter/?error=…

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function onRequestPost({ request, env }) {
  const wantsJson = (request.headers.get('accept') || '').includes('application/json');
  const origin = new URL(request.url).origin;

  const reply = (ok, code, message) => {
    if (wantsJson) {
      return new Response(JSON.stringify({ ok, code, message }), {
        status: ok ? 200 : code === 'invalid' ? 400 : 502,
        headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
      });
    }
    const target = ok ? '/newsletter/thanks/' : `/newsletter/?error=${code}`;
    return Response.redirect(origin + target, 303);
  };

  let form;
  try {
    form = await request.formData();
  } catch {
    return reply(false, 'invalid', 'Please enter a valid email address.');
  }

  // Honeypot: real people never fill the hidden "website" field. Pretend success for bots.
  if ((form.get('website') || '').toString().trim() !== '') return reply(true, 'ok', 'Thanks!');

  const email = (form.get('email') || '').toString().trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return reply(false, 'invalid', 'Please enter a valid email address.');
  }

  if (!env.BEEHIIV_API_KEY || !env.BEEHIIV_PUBLICATION_ID) {
    console.error('subscribe: BEEHIIV_API_KEY or BEEHIIV_PUBLICATION_ID not set');
    return reply(false, 'unavailable', 'Sign-ups are not switched on yet. Please try again soon.');
  }

  const source = (form.get('source') || 'website').toString().slice(0, 60);
  const body = {
    email,
    reactivate_existing: false,
    send_welcome_email: true,
    utm_source: 'westhertskids.co.uk',
    utm_medium: 'website',
    utm_campaign: source,
    referring_site: origin,
  };

  try {
    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${encodeURIComponent(env.BEEHIIV_PUBLICATION_ID)}/subscriptions`,
      {
        method: 'POST',
        headers: { authorization: `Bearer ${env.BEEHIIV_API_KEY}`, 'content-type': 'application/json' },
        body: JSON.stringify(body),
      },
    );
    if (res.ok) return reply(true, 'ok', "You're in! Check your inbox to confirm.");
    console.error('subscribe: beehiiv responded', res.status, await res.text().catch(() => ''));
    return reply(false, 'failed', 'Something went wrong. Please try again in a minute.');
  } catch (err) {
    console.error('subscribe: request failed', err);
    return reply(false, 'failed', 'Something went wrong. Please try again in a minute.');
  }
}

// Anything other than POST gets a polite 405.
export async function onRequest() {
  return new Response('Method not allowed', { status: 405, headers: { allow: 'POST' } });
}
