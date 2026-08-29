export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});

  const challengeId=String(req.body?.challenge_id||'').trim();
  const email=String(req.body?.email||'').trim().toLowerCase();
  const code=String(req.body?.code||'').trim();
  const mailToken=String(req.body?.mail_token||'').trim();
  if(!challengeId||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!/^\d{6}$/.test(code)||!mailToken){
    return res.status(400).json({error:'Invalid verification request'});
  }

  try{
    const validation=await fetch('https://wutlhceqkioshepfbykf.supabase.co/functions/v1/damion-site-auth',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({action:'registration_mail_validate',challenge_id:challengeId,email,mail_token:mailToken})
    });
    const valid=await validation.json().catch(()=>({}));
    if(!validation.ok||!valid?.ok)return res.status(403).json({error:'Verification request rejected'});

    const resendKey=process.env.RESEND_API_KEY;
    const from=process.env.DAMION_EMAIL_FROM;
    if(!resendKey||!from)return res.status(503).json({error:'Email service is not configured'});

    const sent=await fetch('https://api.resend.com/emails',{
      method:'POST',
      headers:{'Authorization':`Bearer ${resendKey}`,'Content-Type':'application/json'},
      body:JSON.stringify({
        from,
        to:[email],
        subject:`${code} — verify your Damiønmusic account`,
        text:`Your Damiønmusic verification code is ${code}. It expires in 10 minutes. If you did not try to create an account, you can ignore this email.`,
        html:`<!doctype html><html><body style="margin:0;background:#09090b;color:#f5f5f7;font-family:Arial,sans-serif"><div style="max-width:560px;margin:0 auto;padding:34px 18px"><div style="background:#111318;border:1px solid #252830;border-radius:18px;padding:28px"><div style="font-size:12px;letter-spacing:.12em;color:#ff667d;font-weight:700">DAMIØNMUSIC</div><h1 style="margin:10px 0 8px;font-size:27px">Verify your account</h1><p style="margin:0 0 22px;color:#a4a8b0;line-height:1.6">Enter this 6-digit code on the website to finish creating your customer account.</p><div style="font-size:38px;letter-spacing:.22em;font-weight:800;background:#090a0d;border:1px solid #2b2e35;border-radius:14px;text-align:center;padding:18px 12px">${code}</div><p style="margin:20px 0 0;color:#777c85;font-size:12px;line-height:1.6">This code expires in 10 minutes. If you did not request this, you can ignore the email.</p></div></div></body></html>`
      })
    });
    const data=await sent.json().catch(()=>({}));
    if(!sent.ok)return res.status(502).json({error:data?.message||'Could not send verification email'});
    return res.status(200).json({ok:true});
  }catch(error){
    console.error(error);
    return res.status(500).json({error:'Could not send verification email'});
  }
}
