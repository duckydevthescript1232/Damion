const SUPABASE_AUTH_URL = 'https://wutlhceqkioshepfbykf.supabase.co/functions/v1/damion-site-auth';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const upstream = await fetch(SUPABASE_AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body || {}),
    });

    const text = await upstream.text();
    res.status(upstream.status);
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
    res.send(text);
  } catch (error) {
    console.error('Auth proxy error:', error);
    res.status(502).json({ error: 'Login server could not be reached. Please try again.' });
  }
}
