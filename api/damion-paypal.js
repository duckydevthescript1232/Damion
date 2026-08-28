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

  const target = 'https://wutlhceqkioshepfbykf.supabase.co/functions/v1/damion-paypal';

  try {
    const upstream = await fetch(target, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers.authorization ? { Authorization: req.headers.authorization } : {}),
        ...(req.headers.apikey ? { apikey: req.headers.apikey } : {}),
      },
      body: JSON.stringify(req.body || {}),
    });

    const text = await upstream.text();
    res.status(upstream.status);
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
    res.send(text);
  } catch (error) {
    console.error('PayPal proxy error:', error);
    res.status(502).json({
      error: 'Payment server could not reach Supabase.',
      details: error instanceof Error ? error.message : 'Unknown proxy error',
    });
  }
}
