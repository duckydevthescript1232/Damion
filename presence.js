(()=>{
  const ENDPOINT='https://wutlhceqkioshepfbykf.supabase.co/functions/v1/damian-site-presence';
  const KEY='damian_presence_id';
  let id='';
  try{id=localStorage.getItem(KEY)||''}catch(_){}
  if(!id){
    id=(crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(36).slice(2)}`).replace(/[^a-zA-Z0-9_-]/g,'');
    try{localStorage.setItem(KEY,id)}catch(_){}
  }
  const ping=()=>fetch(ENDPOINT,{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'ping',visitor_id:id,path:location.pathname})}).catch(()=>{});
  ping();
  const timer=setInterval(()=>{if(document.visibilityState==='visible')ping()},30000);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')ping()});
  window.addEventListener('pagehide',()=>clearInterval(timer),{once:true});
})();
