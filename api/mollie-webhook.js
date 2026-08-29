export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.status(200).send('ok');
    return;
  }

  const mollieKey = (process.env.MOLLIE_API_KEY || process.env.MOLLIE_LIVE_API_KEY || '').trim();
  if (!mollieKey) {
    res.status(500).send('Mollie is not configured on Vercel.');
    return;
  }

  const target = 'https://wutlhceqkioshepfbykf.supabase.co/functions/v1/damion-mollie-webhook';
  const contentType = req.headers['content-type'] || 'application/x-www-form-urlencoded';
  let body;

  if (typeof req.body === 'string') body = req.body;
  else if (contentType.includes('application/x-www-form-urlencoded')) body = new URLSearchParams(req.body || {}).toString();
  else body = JSON.stringify(req.body || {});

  try {
    const upstream = await fetch(target, {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
        'x-damion-mollie-key': mollieKey,
      },
      body,
    });
    const text = await upstream.text();
    res.status(upstream.status).send(text || 'ok');
  } catch (error) {
    console.error('Mollie webhook proxy error:', error);
    res.status(502).send('temporary error');
  }
}
