(()=>{
  if(window.__dmPresenceHumanV1)return;
  window.__dmPresenceHumanV1=true;

  const ENDPOINT='https://wutlhceqkioshepfbykf.supabase.co/functions/v1/damian-site-presence';
  const SESSION_KEY='damion_site_session';
  const VISITOR_KEY='damian_presence_id';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const session=()=>{try{return localStorage.getItem(SESSION_KEY)||''}catch(_){return''}};
  const myId=()=>{try{return localStorage.getItem(VISITOR_KEY)||''}catch(_){return''}};
  const isOnline=v=>{const t=new Date(v?.last_seen||0).getTime();return Number.isFinite(t)&&Date.now()-t<=90000};
  const countryName=code=>{if(!code)return'';try{return new Intl.DisplayNames([navigator.language||'en'],{type:'region'}).of(code)||code}catch(_){return code}};
  const shortAgo=iso=>{const s=Math.max(0,Math.round((Date.now()-new Date(iso).getTime())/1000));if(s<10)return'now';if(s<60)return`${s}s ago`;return`${Math.max(1,Math.round(s/60))}m ago`};

  const style=()=>{
    if(document.getElementById('dm-human-style'))return;
    const s=document.createElement('style');s.id='dm-human-style';s.textContent=`
      .dm-human-summary{display:none;grid-template-columns:repeat(3,1fr);gap:6px;margin:9px 0 10px}.owner .dm-human-summary{display:grid}.dm-human-stat{padding:8px 9px;border:1px solid rgba(255,255,255,.07);border-radius:10px;background:rgba(255,255,255,.025)}.dm-human-stat span{display:block;font-size:7px;color:#777c85;font-weight:900;text-transform:uppercase;letter-spacing:.05em}.dm-human-stat b{display:block;margin-top:4px;font-size:15px}.dm-human-stat.real b{color:#72e39b}.dm-human-stat.bot b{color:#ff6b7e}.dm-human-stat.unknown b{color:#c5c9d1}.dm-human-list{display:grid;gap:6px}.dm-human-row{padding:8px 9px;border:1px solid rgba(255,255,255,.06);border-radius:10px;background:rgba(255,255,255,.02)}.dm-human-top{display:flex;align-items:center;justify-content:space-between;gap:8px}.dm-human-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:10px;font-weight:900;color:#eee}.dm-human-badge{flex:0 0 auto;padding:4px 6px;border-radius:999px;font-size:7px;font-weight:950;text-transform:uppercase;letter-spacing:.04em;border:1px solid}.dm-human-badge.real{color:#75e49f;border-color:rgba(117,228,159,.26);background:rgba(117,228,159,.07)}.dm-human-badge.bot{color:#ff7285;border-color:rgba(255,114,133,.28);background:rgba(255,114,133,.07)}.dm-human-badge.unknown{color:#b6bbc4;border-color:rgba(182,187,196,.2);background:rgba(182,187,196,.05)}.dm-human-meta{margin-top:4px;color:#777d86;font-size:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.dm-human-note{margin-top:7px;color:#666b74;font-size:7px;line-height:1.4}.dm-live-human{display:none;margin-top:6px;color:#72e39b;font-size:8px;font-weight:850}.owner .dm-live-human{display:block}@media(max-width:760px){.dm-human-summary{grid-template-columns:1fr 1fr 1fr}}
    `;document.head.appendChild(s);
  };

  const ensureUi=()=>{
    style();
    const root=document.getElementById('dmLiveVisitors');if(!root)return false;
    const pill=root.querySelector('.dm-live-pill');
    if(pill&&!pill.querySelector('.dm-live-human')){const line=document.createElement('span');line.className='dm-live-human';line.id='dmLiveHumanLine';line.textContent='Checking real visitors…';pill.insertBefore(line,pill.querySelector('.dm-live-hint'))}
    const ownerSection=root.querySelector('.dm-owner-only');
    if(ownerSection&&!document.getElementById('dmHumanVerify')){
      const box=document.createElement('div');box.id='dmHumanVerify';box.innerHTML=`<div class="dm-live-section-title"><span>Visitor verification</span><small>Best-effort browser check</small></div><div class="dm-human-summary"><div class="dm-human-stat real"><span>Likely real</span><b id="dmHumanReal">—</b></div><div class="dm-human-stat bot"><span>Bots</span><b id="dmHumanBots">—</b></div><div class="dm-human-stat unknown"><span>Unknown</span><b id="dmHumanUnknown">—</b></div></div><div id="dmHumanList" class="dm-human-list"><div class="dm-live-empty">Checking active visitors…</div></div><div class="dm-human-note">“Likely real” means the browser signals look human. It is not identity verification and cannot be 100% certain.</div>`;
      ownerSection.prepend(box);
    }
    return true;
  };

  const render=d=>{
    if(!ensureUi())return;
    const all=Array.isArray(d?.recent)?d.recent.filter(isOnline):[];
    const real=all.filter(v=>v.visitor_kind==='likely_real').length;
    const bots=all.filter(v=>v.visitor_kind==='bot').length;
    const unknown=Math.max(0,all.length-real-bots);
    const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=String(v)};
    set('dmHumanReal',real);set('dmHumanBots',bots);set('dmHumanUnknown',unknown);
    const line=document.getElementById('dmLiveHumanLine');if(line)line.textContent=`${d?.likely_real_online??real} likely real · ${d?.bot_online??bots} bots`;
    const host=document.getElementById('dmHumanList');if(!host)return;
    if(!all.length){host.innerHTML='<div class="dm-live-empty">No active visitors to classify.</div>';return}
    host.innerHTML=all.map(v=>{
      const kind=v.visitor_kind==='likely_real'?'real':v.visitor_kind==='bot'?'bot':'unknown';
      const label=kind==='real'?'Likely real':kind==='bot'?'Bot / crawler':'Unknown';
      const place=countryName(v.country_code)||v.timezone||'Location unavailable';
      const tech=[v.device,v.browser,place].filter(Boolean).join(' · ');
      const reason=v.bot_reason?` · ${v.bot_reason}`:'';
      return `<div class="dm-human-row"><div class="dm-human-top"><span class="dm-human-name">${esc(v.visitor||'Visitor')}</span><span class="dm-human-badge ${kind}">${label}</span></div><div class="dm-human-meta">${esc(tech||'Unknown browser')} · ${esc(shortAgo(v.last_seen))}${esc(reason)}</div></div>`;
    }).join('');
  };

  let timer=0;
  const load=async()=>{
    if(!session())return;
    ensureUi();
    try{
      const r=await fetch(ENDPOINT,{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'stats',ownerSession:session()})});
      const d=await r.json().catch(()=>({}));if(r.ok)render(d);
    }catch(_){}
  };
  const start=()=>{ensureUi();load();clearInterval(timer);timer=setInterval(load,12000)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  document.addEventListener('dm:pagechange',()=>setTimeout(start,0));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)load()});
})();
