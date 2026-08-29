const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dGxoY2Vxa2lvc2hlcGZieWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMDAxMDUsImV4cCI6MjEwMTU3NjEwNX0.Ad9wROEhZ2uKxKx9H5AHqCCmFa0nTezrBHkAn-Zwyws';

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
        'Authorization': `Bearer ${SUPABASE_ANON}`,
        'apikey': SUPABASE_ANON,
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
