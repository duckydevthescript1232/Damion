(()=>{
  if(window.__dmReferralV1)return;
  window.__dmReferralV1=true;
  const API='https://wutlhceqkioshepfbykf.supabase.co/functions/v1/damion-site-auth';
  const CODE_KEY='damion_referral_code';
  const VISITOR_KEY='damion_referral_visitor';
  const SEEN_KEY='damion_referral_seen_at';
  const read=k=>{try{return localStorage.getItem(k)||''}catch(_){return''}};
  const write=(k,v)=>{try{if(v)localStorage.setItem(k,v);else localStorage.removeItem(k)}catch(_){}};
  const makeVisitor=()=>{try{return crypto.randomUUID()}catch(_){return 'v'+Date.now()+Math.random().toString(36).slice(2)}};
  const code=(()=>{
    try{
      const raw=(new URL(location.href).searchParams.get('ref')||'').trim().toUpperCase();
      return /^[A-Z0-9]{6,24}$/.test(raw)?raw:'';
    }catch(_){return''}
  })();
  if(!code)return;
  const visitor=read(VISITOR_KEY)||makeVisitor();
  write(VISITOR_KEY,visitor);write(CODE_KEY,code);write(SEEN_KEY,new Date().toISOString());
  fetch(API,{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'track_referral',referral_code:code,visitor_key:visitor})}).catch(()=>{});
  document.dispatchEvent(new CustomEvent('dm:referralcaptured',{detail:{code}}));
})();