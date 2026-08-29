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
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error('Resend send failed', response.status, body?.message || body?.name || 'unknown');
    return false;
  }
  return true;
}

function formatPaidAt(value) {
  try {
    return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Amsterdam' }).format(new Date(value || Date.now()));
  } catch (_) {
    return new Date().toISOString();
  }
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ ok: false });

  const mollieKey = (process.env.MOLLIE_API_KEY || process.env.MOLLIE_LIVE_API_KEY || '').trim();
  const resendKey = (process.env.RESEND_API_KEY || '').trim();
  const from = (process.env.DAMION_EMAIL_FROM || '').trim();
  if (!mollieKey) return res.status(500).json({ ok: false, error: 'mollie_not_configured' });

  const timestamp = String(req.headers['x-damion-timestamp'] || '');
  const signature = String(req.headers['x-damion-signature'] || '');
  const now = Date.now();
  const ts = Number(timestamp);
  if (!Number.isFinite(ts) || Math.abs(now - ts) > 5 * 60 * 1000) return res.status(401).json({ ok: false, error: 'expired_signature' });

  const payload = req.body && typeof req.body === 'object' ? req.body : {};
  const raw = JSON.stringify(payload);
  const expected = crypto.createHmac('sha256', mollieKey).update(`${timestamp}.${raw}`).digest('hex');
  if (!safeEqualHex(signature, expected)) return res.status(401).json({ ok: false, error: 'invalid_signature' });
  if (!resendKey || !from) return res.status(503).json({ ok: false, error: 'mail_not_configured' });

  const orderNumber = String(payload.order_number || '').trim();
  const customerEmail = String(payload.customer_email || '').trim().toLowerCase();
  const customerName = String(payload.customer_name || '').trim();
  const projectName = String(payload.project_name || '').trim();
  const serviceName = String(payload.service_name || '').trim();
  const packageName = String(payload.package_name || '').trim();
  const amount = Number(payload.amount_eur || 0);
  const accessToken = String(payload.access_token || '').trim();
  const paymentId = String(payload.payment_id || '').trim();
  const paidAt = formatPaidAt(payload.paid_at);

  if (!orderNumber || !customerEmail.includes('@') || !accessToken || !(amount > 0)) return res.status(400).json({ ok: false, error: 'invalid_payload' });

  const portal = `${SITE_URL}/order?token=${encodeURIComponent(accessToken)}`;
  const admin = `${SITE_URL}/admin-orders.html`;
  const receiptNumber = orderNumber;

  const buyerHtml = `<div style="margin:0;background:#f5f6f8;padding:28px 12px;font-family:Arial,sans-serif;color:#16171a">
    <div style="max-width:620px;margin:auto;background:#fff;border:1px solid #e4e6eb;border-radius:16px;overflow:hidden">
      <div style="padding:24px 26px;background:#0b0c0e;color:#fff"><div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#ff6b81;font-weight:800">Damiønmusic receipt</div><h1 style="font-size:24px;margin:8px 0 0">Payment confirmed ✓</h1></div>
      <div style="padding:24px 26px">
        <p style="margin-top:0">Hi ${esc(customerName || 'there')}, your iDEAL payment has been received. Your project is now waiting for studio review.</p>
        <div style="border:1px solid #e7e8ec;border-radius:12px;overflow:hidden;margin:20px 0">
          <div style="display:flex;justify-content:space-between;gap:14px;padding:11px 14px;border-bottom:1px solid #eceef1"><span style="color:#666">Order number</span><b>${esc(orderNumber)}</b></div>
          <div style="display:flex;justify-content:space-between;gap:14px;padding:11px 14px;border-bottom:1px solid #eceef1"><span style="color:#666">Receipt number</span><b>${esc(receiptNumber)}</b></div>
          <div style="display:flex;justify-content:space-between;gap:14px;padding:11px 14px;border-bottom:1px solid #eceef1"><span style="color:#666">Project</span><b>${esc(projectName)}</b></div>
          <div style="display:flex;justify-content:space-between;gap:14px;padding:11px 14px;border-bottom:1px solid #eceef1"><span style="color:#666">Service</span><b>${esc(serviceName)}</b></div>
          ${packageName ? `<div style="display:flex;justify-content:space-between;gap:14px;padding:11px 14px;border-bottom:1px solid #eceef1"><span style="color:#666">Package</span><b>${esc(packageName)}</b></div>` : ''}
          <div style="display:flex;justify-content:space-between;gap:14px;padding:11px 14px;border-bottom:1px solid #eceef1"><span style="color:#666">Payment method</span><b>iDEAL</b></div>
          <div style="display:flex;justify-content:space-between;gap:14px;padding:11px 14px;border-bottom:1px solid #eceef1"><span style="color:#666">Paid</span><b>${esc(paidAt)}</b></div>
          <div style="display:flex;justify-content:space-between;gap:14px;padding:14px;background:#fafafb"><span style="font-weight:700">Total paid</span><b style="font-size:18px">€${amount.toFixed(2)}</b></div>
        </div>
        <p><a href="${portal}" style="display:inline-block;padding:13px 18px;background:#ef3f55;color:#fff;text-decoration:none;border-radius:9px;font-weight:700">Open your private order room</a></p>
        <p style="color:#6c6f76;font-size:13px;line-height:1.5">Keep your private order-room link safe. You can use it for status updates, messages and final delivery.</p>
      </div>
    </div>
  </div>`;

  const ownerHtml = `<div style="font-family:Arial,sans-serif;max-width:650px;margin:auto;color:#111">
    <h2>New paid Damiønmusic order</h2>
    <p><b>${esc(orderNumber)}</b> is paid and ready for you to start.</p>
    <p><b>Customer:</b> ${esc(customerName)}<br><b>Email:</b> ${esc(customerEmail)}<br><b>Project:</b> ${esc(projectName)}<br><b>Service:</b> ${esc(serviceName)}${packageName ? `<br><b>Package:</b> ${esc(packageName)}` : ''}<br><b>Total paid:</b> €${amount.toFixed(2)}<br><b>Paid:</b> ${esc(paidAt)}${paymentId ? `<br><b>Mollie reference:</b> ${esc(paymentId)}` : ''}</p>
    <p><a href="${admin}" style="display:inline-block;padding:12px 18px;background:#ef3f55;color:#fff;text-decoration:none;border-radius:8px;font-weight:700">Open owner dashboard</a></p>
    <p style="color:#666;font-size:13px">This notification is only triggered after Mollie confirms the payment as Paid.</p>
  </div>`;

  const [buyerSent, ownerSent] = await Promise.all([
    sendResend({ apiKey: resendKey, from, to: customerEmail, subject: `${orderNumber} — payment receipt — Damiønmusic`, html: buyerHtml }),
    sendResend({ apiKey: resendKey, from, to: OWNER_EMAIL, subject: `New paid order — ${orderNumber}`, html: ownerHtml }),
  ]);

  res.status(buyerSent && ownerSent ? 200 : 502).json({ ok: buyerSent && ownerSent, buyer_sent: buyerSent, owner_sent: ownerSent });
}
