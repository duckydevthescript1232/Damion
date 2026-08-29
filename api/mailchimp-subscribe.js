const EMAIL_RE=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req,res){
  if(req.method!=='POST'){
    res.setHeader('Allow','POST');
    return res.status(405).json({message:'Method not allowed.'});
  }

  try{
    const body=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});
    const email=String(body.email||'').trim().toLowerCase();
    const consent=body.consent===true;
    const honeypot=String(body.website||'').trim();

    if(honeypot)return res.status(200).json({message:'Check your inbox to confirm your subscription.'});
    if(!EMAIL_RE.test(email))return res.status(400).json({message:'Please enter a valid email address.'});
    if(!consent)return res.status(400).json({message:'Consent is required for marketing emails.'});

    const apiKey=process.env.MAILCHIMP_API_KEY;
    const audienceId=process.env.MAILCHIMP_AUDIENCE_ID;
    const serverPrefix=process.env.MAILCHIMP_SERVER_PREFIX||(apiKey&&apiKey.includes('-')?apiKey.split('-').pop():'');

    if(!apiKey||!audienceId||!serverPrefix){
      console.error('Mailchimp environment variables are not configured.');
      return res.status(503).json({message:'Email signup is being connected. Please try again soon.'});
    }

    const mcResponse=await fetch(`https://${serverPrefix}.api.mailchimp.com/3.0/lists/${encodeURIComponent(audienceId)}/members`,{
      method:'POST',
      headers:{
        'Authorization':`Basic ${Buffer.from(`damionmusic:${apiKey}`).toString('base64')}`,
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        email_address:email,
        status:'pending',
        tags:['Website signup']
      })
    });

    const data=await mcResponse.json().catch(()=>({}));

    if(mcResponse.ok){
      return res.status(200).json({message:'Check your inbox to confirm your subscription.'});
    }

    if(data.title==='Member Exists'){
      return res.status(200).json({message:'You are already on the list or have a confirmation waiting in your inbox.'});
    }

    console.error('Mailchimp signup failed',mcResponse.status,data.title||'',data.detail||'');
    return res.status(502).json({message:'Could not join the list right now. Please try again later.'});
  }catch(error){
    console.error('Newsletter signup error',error);
    return res.status(500).json({message:'Could not join the list right now. Please try again later.'});
  }
}
