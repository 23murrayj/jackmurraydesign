// Contact form endpoint.
//
// The previous host provisioned this invisibly from the form's own markup, so
// there was nothing to read: the behaviour lived in a vendor's deploy-time
// HTML parser. Here it is an actual function, which is more code but no longer
// a black box - the honeypot rule, the validation and the failure modes are
// all visible below.
//
// Resend's shared sender (onboarding@resend.dev) may only deliver to the
// address on the Resend account itself; any other recipient is a 403. That
// restriction happens to cost nothing here, because the only recipient this
// form ever has is Jack. It does mean the Resend account has to be the one
// registered to TO below - if those two disagree, every send 403s.
//
// Upgrade path, once jackmurraydesign.com is verified in Resend: change FROM
// to something on the domain (contact@jackmurraydesign.com) and the sandbox
// restriction disappears along with the resend.dev sender.

const TO = '23jmurr@gmail.com';
const FROM = 'Portfolio contact <onboarding@resend.dev>';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method not allowed' });
  }

  // Vercel parses urlencoded and JSON bodies into an object, but a string can
  // still arrive depending on the content type the client chose, so handle both
  // rather than trusting one shape.
  const body =
    typeof req.body === 'string'
      ? Object.fromEntries(new URLSearchParams(req.body))
      : req.body || {};

  // Honeypot: a field real visitors never see, so anything in it is a bot.
  // Answer 200 anyway - a distinct error would tell the bot which field
  // betrayed it, and there is nothing to gain from being honest here.
  if (body._honeypot) return res.status(200).json({ ok: true });

  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim();
  const message = String(body.message || '').trim();

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email and message are all required' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'that email address does not look valid' });
  }
  // Not a security boundary, just a cap: the form is for a message, not a
  // payload, and Resend will reject genuinely huge bodies anyway.
  if (message.length > 5000) {
    return res.status(400).json({ error: 'message is too long' });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    // Logged rather than returned: the visitor cannot act on this, and the
    // response should not advertise how the backend is wired.
    console.error('RESEND_API_KEY is not set - cannot send contact mail');
    return res.status(500).json({ error: 'the contact form is not configured' });
  }

  try {
    const sent = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        // So that hitting reply in Gmail goes to the visitor and not to
        // Resend's sender, which nobody reads.
        reply_to: email,
        subject: `Portfolio enquiry from ${name}`,
        text: `${message}\n\n---\nFrom: ${name} <${email}>\nSent from the contact form on jackmurraydesign.com`
      })
    });

    if (!sent.ok) {
      console.error('resend rejected the send', sent.status, await sent.text());
      return res.status(502).json({ error: 'could not send the message' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('resend request failed', err);
    return res.status(502).json({ error: 'could not send the message' });
  }
};
