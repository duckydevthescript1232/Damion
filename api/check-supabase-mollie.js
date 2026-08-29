export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ ok:false });
  try {
    const r = await fetch('https://wutlhceqkioshepfbykf.supabase.co/functions/v1/damion-mollie-env-check', { cache:'no-store' });
    const data = await r.json().catch(() => ({}));
    return res.status(r.status).json(data);
  } catch (e) {
    return res.status(502).json({ ok:false, error:'check_failed' });
  }
}
