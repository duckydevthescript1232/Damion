import crypto from 'node:crypto';

const OWNER_EMAIL = (process.env.OWNER_NOTIFY_EMAIL || 'damianschenk234@gmail.com').trim();
const SITE_URL = 'https://damionmusic.nl';

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c] || c));
}

function safeEqualHex(a, b) {
  try {
    const aa = Buffer.from(String(a || ''), 'hex');
    const bb = Buffer.from(String(b || ''), 'hex');
    return aa.length === bb.length && aa.length > 0 && crypto.timingSafeEqual(aa, bb);
  } catch (_) {
    return false;
  }
}

async function sendResend({ apiKey, from, to, subject, html }) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error('Resend send failed', response.status, body?.message || body?.name || 'unknown');
    return false;
  }
  return true;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false });
    return;
  }

  const mollieKey = (process.env.MOLLIE_API_KEY || process.env.MOLLIE_LIVE_API_KEY || '').trim();
  const resendKey = (process.env.RESEND_API_KEY || '').trim();
  const from = (process.env.DAMION_EMAIL_FROM || '').trim();
  if (!mollieKey) {
    res.status(500).json({ ok: false, error: 'mollie_not_configured' });
    return;
  }

  const timestamp = String(req.headers['x-damion-timestamp'] || '');
  const signature = String(req.headers['x-damion-signature'] || '');
  const now = Date.now();
  const ts = Number(timestamp);
  if (!Number.isFinite(ts) || Math.abs(now - ts) > 5 * 60 * 1000) {
    res.status(401).json({ ok: false, error: 'expired_signature' });
    return;
  }

  const payload = req.body && typeof req.body === 'object' ? req.body : {};
  const raw = JSON.stringify(payload);
  const expected = crypto.createHmac('sha256', mollieKey).update(`${timestamp}.${raw}`).digest('hex');
  if (!safeEqualHex(signature, expected)) {
    res.status(401).json({ ok: false, error: 'invalid_signature' });
    return;
  }

  if (!resendKey || !from) {
    res.status(503).json({ ok: false, error: 'mail_not_configured' });
    return;
  }

  const orderNumber = String(payload.order_number || '').trim();
  const customerEmail = String(payload.customer_email || '').trim().toLowerCase();
  const customerName = String(payload.customer_name || '').trim();
  const projectName = String(payload.project_name || '').trim();
  const serviceName = String(payload.service_name || '').trim();
  const packageName = String(payload.package_name || '').trim();
  const amount = Number(payload.amount_eur || 0);
  const accessToken = String(payload.access_token || '').trim();
  const paymentId = String(payload.payment_id || '').trim();

  if (!orderNumber || !customerEmail.includes('@') || !accessToken || !(amount > 0)) {
    res.status(400).json({ ok: false, error: 'invalid_payload' });
    return;
  }

  const portal = `${SITE_URL}/order?token=${encodeURIComponent(accessToken)}`;
  const admin = `${SITE_URL}/admin-orders.html`;

  const buyerHtml = `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#111">
    <h2>Payment confirmed</h2>
    <p>Hi ${esc(customerName || 'there')}, your iDEAL payment was received and your Damiønmusic project is now in the studio queue.</p>
    <p><b>Order:</b> ${esc(orderNumber)}<br><b>Project:</b> ${esc(projectName)}<br><b>Service:</b> ${esc(serviceName)}${packageName ? `<br><b>Package:</b> ${esc(packageName)}` : ''}<br><b>Total:</b> €${amount.toFixed(2)}</p>
    <p><a href="${portal}" style="display:inline-block;padding:12px 18px;background:#ef3f55;color:#fff;text-decoration:none;border-radius:8px;font-weight:700">Open your private order room</a></p>
    <p style="color:#666;font-size:13px">Keep this link private. You can use the order room for status updates, messages and final delivery.</p>
  </div>`;

  const ownerHtml = `<div style="font-family:Arial,sans-serif;max-width:650px;margin:auto;color:#111">
    <h2>New paid Damiønmusic order</h2>
    <p><b>${esc(orderNumber)}</b> is paid and ready for you to start.</p>
    <p><b>Customer:</b> ${esc(customerName)}<br><b>Email:</b> ${esc(customerEmail)}<br><b>Project:</b> ${esc(projectName)}<br><b>Service:</b> ${esc(serviceName)}${packageName ? `<br><b>Package:</b> ${esc(packageName)}` : ''}<br><b>Total:</b> €${amount.toFixed(2)}${paymentId ? `<br><b>Payment:</b> ${esc(paymentId)}` : ''}</p>
    <p><a href="${admin}" style="display:inline-block;padding:12px 18px;background:#ef3f55;color:#fff;text-decoration:none;border-radius:8px;font-weight:700">Open owner dashboard</a></p>
    <p style="color:#666;font-size:13px">This email is only triggered after Mollie confirms the payment as Paid.</p>
  </div>`;

  const [buyerSent, ownerSent] = await Promise.all([
    sendResend({ apiKey: resendKey, from, to: customerEmail, subject: `${orderNumber} — Damiønmusic payment confirmed`, html: buyerHtml }),
    sendResend({ apiKey: resendKey, from, to: OWNER_EMAIL, subject: `New paid order — ${orderNumber}`, html: ownerHtml }),
  ]);

  res.status(buyerSent && ownerSent ? 200 : 502).json({ ok: buyerSent && ownerSent, buyer_sent: buyerSent, owner_sent: ownerSent });
}
