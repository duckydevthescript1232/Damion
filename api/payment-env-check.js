export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ ok:false });
  return res.status(200).json({ ok:true, mollie:Boolean(process.env.MOLLIE_API_KEY) });
}
