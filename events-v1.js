(()=>{
  if(window.__dmEventsV1)return;
  window.__dmEventsV1=true;

  const ENDPOINT='https://wutlhceqkioshepfbykf.supabase.co/functions/v1/damion-site-events';
  const LABELS={admin_drop:'Admin Drop',flash_sale:'Flash Sale',release:'New Release',giveaway:'Giveaway',maintenance:'Maintenance',live_session:'Live Session',announcement:'Announcement'};
  let events=[],serverOffset=0,polling=false,lastMode='';

  const now=()=>Date.now()+serverOffset;
  const post=async body=>{
    const r=await fetch(ENDPOINT,{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    const d=await r.json().catch(()=>({}));
    if(!r.ok)throw new Error(d?.error||'Could not load events');
    return d;
  };
  const escUrl=v=>{const s=String(v||'').trim();if(!s)return'';if(s.startsWith('/'))return s;try{const u=new URL(s);return /^https?:$/.test(u.protocol)?u.toString():''}catch(_){return''}};
  const status=e=>{if(!e?.active)return'disabled';const t=now(),s=new Date(e.starts_at).getTime(),end=new Date(e.ends_at).getTime();return t<s?'upcoming':t<end?'live':'ended'};
  const rank=e=>status(e)==='live'?0:status(e)==='upcoming'?1:2;
  const pick=()=>events.filter(e=>['live','upcoming'].includes(status(e))).sort((a,b)=>rank(a)-rank(b)||new Date(a.starts_at)-new Date(b.starts_at))[0]||null;
  const duration=ms=>{
    const total=Math.max(0,Math.ceil(ms/1000)),d=Math.floor(total/86400),h=Math.floor(total%86400/3600),m=Math.floor(total%3600/60),s=total%60;
    if(d>0)return`${d}d ${String(h).padStart(2,'0')}h ${String(m).padStart(2,'0')}m`;
    if(h>0)return`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    return`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  };
  const ensure=()=>{
    let root=document.getElementById('dmEventHub');
    if(root)return root;
    root=document.createElement('aside');root.id='dmEventHub';root.hidden=true;root.setAttribute('aria-live','polite');
    root.innerHTML='<div class="dm-event-card"><div class="dm-event-top"><span class="dm-event-badge"><i></i><b></b></span><span class="dm-event-type"></span></div><div class="dm-event-body"><h3 class="dm-event-title"></h3><p class="dm-event-message"></p><div class="dm-event-bottom"><div class="dm-event-clock"><span></span><strong></strong></div><span class="dm-event-more"></span><a class="dm-event-cta" hidden></a></div></div></div>';
    document.body.appendChild(root);return root;
  };
  const render=()=>{
    document.getElementById('dmLiveEvent')?.remove();
    const root=ensure(),e=pick();
    if(!e){root.hidden=true;lastMode='';return}
    const mode=status(e),card=root.querySelector('.dm-event-card'),start=new Date(e.starts_at).getTime(),end=new Date(e.ends_at).getTime();
    card.dataset.type=e.event_type||'announcement';card.dataset.status=mode;
    root.querySelector('.dm-event-badge b').textContent=mode==='live'?'LIVE NOW':'UPCOMING';
    root.querySelector('.dm-event-type').textContent=(LABELS[e.event_type]||'Event').toUpperCase();
    root.querySelector('.dm-event-title').textContent=String(e.title||'Site event').slice(0,100);
    const msg=root.querySelector('.dm-event-message');msg.textContent=String(e.message||'').slice(0,400);msg.hidden=!msg.textContent;
    root.querySelector('.dm-event-clock span').textContent=mode==='live'?'Ends in':'Starts in';
    root.querySelector('.dm-event-clock strong').textContent=duration((mode==='live'?end:start)-now());
    const other=events.filter(x=>x.id!==e.id&&['live','upcoming'].includes(status(x))).length;
    const more=root.querySelector('.dm-event-more');more.textContent=other?(`+${other} more`):'';
    const cta=root.querySelector('.dm-event-cta'),url=escUrl(e.cta_url);
    if(e.cta_label&&url){cta.hidden=false;cta.textContent=String(e.cta_label).slice(0,40);cta.href=url}else{cta.hidden=true;cta.removeAttribute('href')}
    root.hidden=false;
    if(lastMode&&lastMode!==mode)poll();lastMode=mode;
  };
  async function poll(){
    if(polling||document.hidden)return;polling=true;
    try{
      const d=await post({action:'public_list'});
      if(d.server_time){const t=new Date(d.server_time).getTime();if(Number.isFinite(t))serverOffset=t-Date.now()}
      events=Array.isArray(d.events)?d.events:[];
      render();
    }catch(_){ }finally{polling=false}
  }
  const start=()=>{ensure();document.getElementById('dmLiveEvent')?.remove();poll();render()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  document.addEventListener('dm:pagechange',()=>setTimeout(()=>{render();poll()},0));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)poll()});
  setInterval(render,1000);setInterval(poll,12000);
})();