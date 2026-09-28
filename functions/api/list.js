// Cloudflare Pages Function: POST /api/list
// Receives the "List your activity" form and emails it to the owner, so providers
// never have to open their own email app.
//
// Pages Functions can't send email directly, so this hands the checked submission to a
// tiny Worker ("whk-listing-mailer", source in workers/listing-mailer/) through a
// service binding. Setup (one-off, Cloudflare dashboard):
//   Workers & Pages → westhertskids → Settings → Bindings → Add → Service binding
//     Variable name: MAILER    Service: whk-listing-mailer    (Production)
//
// Works with and without JavaScript:
//   - fetch() with "Accept: application/json" gets JSON back ({ ok, code, message })
//   - a plain HTML form post is redirected to /list-your-activity/thanks/ or /list-your-activity/?error=…
//
// If the binding isn't set up (or the mailer fails), the visitor sees a friendly message
// with the hello@ address, so nothing breaks if this is left alone.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LIMITS = { contact_name: 120, contact_email: 254, business: 160, website: 300, category: 60, town: 60, details: 4000, claim: 120 };

export async function onRequestPost({ request, env }) {
  const wantsJson = (request.headers.get('accept') || '').includes('application/json');
  const origin = new URL(request.url).origin;

  const reply = (ok, code, message) => {
    if (wantsJson) {
      return new Response(JSON.stringify({ ok, code, message }), {
        status: ok ? 200 : code === 'invalid' ? 400 : code === 'unavailable' ? 503 : 502,
        headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
      });
    }
    const target = ok ? '/list-your-activity/thanks/' : `/list-your-activity/?error=${code}`;
    return Response.redirect(origin + target, 303);
  };

  let form;
  try {
    form = await request.formData();
  } catch {
    return reply(false, 'invalid', 'Please fill in the required fields.');
  }

  // Honeypot: a hidden field real people never see or fill in. Pretend success for bots.
  if ((form.get('fax_number') || '').toString().trim() !== '') return reply(true, 'ok', 'Thanks!');

  const data = {};
  for (const [key, max] of Object.entries(LIMITS)) {
    data[key] = (form.get(key) || '').toString().trim().slice(0, max);
  }
  data.contact_email = data.contact_email.toLowerCase();
  const consent = form.get('consent') != null;

  if (!data.contact_name || !data.business || !consent || !EMAIL_RE.test(data.contact_email)) {
    return reply(false, 'invalid', 'Please fill in your name, a valid email, the activity name and tick the box.');
  }

  if (!env.MAILER) {
    console.error('list: MAILER service binding not set');
    return reply(false, 'unavailable', 'The form is not switched on yet.');
  }

  try {
    const res = await env.MAILER.fetch('https://mailer.internal/send', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...data, submitted: new Date().toISOString(), page: origin + '/list-your-activity/' }),
    });
    if (!res.ok) {
      console.error('list: mailer returned', res.status, await res.text().catch(() => ''));
      return reply(false, 'failed', 'Something went wrong.');
    }
  } catch (err) {
    console.error('list: mailer error', err);
    return reply(false, 'failed', 'Something went wrong.');
  }

  return reply(true, 'ok', "Thanks! We'll check your details and add or update the listing.");
}
