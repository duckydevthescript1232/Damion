export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const mollieKey = (process.env.MOLLIE_API_KEY || process.env.MOLLIE_LIVE_API_KEY || '').trim();
  if (!mollieKey) {
    res.status(500).json({ error: 'Mollie is not configured on Vercel.' });
    return;
  }

  const target = 'https://wutlhceqkioshepfbykf.supabase.co/functions/v1/damion-mollie-create';

  try {
    const upstream = await fetch(target, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers.authorization ? { Authorization: req.headers.authorization } : {}),
        ...(req.headers.apikey ? { apikey: req.headers.apikey } : {}),
        'x-damion-mollie-key': mollieKey,
      },
      body: JSON.stringify(req.body || {}),
    });

    const text = await upstream.text();
    res.status(upstream.status);
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
    res.send(text);
  } catch (error) {
    console.error('Mollie create proxy error:', error);
    res.status(502).json({ error: 'Payment server could not reach Supabase.' });
  }
}
