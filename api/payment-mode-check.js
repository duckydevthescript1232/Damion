export default function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  const key=String(process.env.MOLLIE_API_KEY||process.env.MOLLIE_LIVE_API_KEY||'');
  const mode=key.startsWith('live_')?'live':key.startsWith('test_')?'test':'missing_or_unknown';
  return res.status(200).json({ok:true,mode,mail:{resend:Boolean(process.env.RESEND_API_KEY),from:Boolean(process.env.DAMION_EMAIL_FROM),owner:Boolean(process.env.OWNER_NOTIFY_EMAIL)}});
}
