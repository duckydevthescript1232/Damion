export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ ok:false });
  res.status(200).json({
    ok:true,
    mollie: Boolean(process.env.MOLLIE_API_KEY || process.env.MOLLIE_LIVE_API_KEY || process.env.MOLLIE_LIVE_KEY),
    supabaseService: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY),
    supabaseUrl: Boolean(process.env.SUPABASE_URL)
  });
}
