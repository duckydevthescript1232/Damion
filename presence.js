(()=>{
  if(window.__dmPresenceLoaded)return;
  window.__dmPresenceLoaded=true;

  const ENDPOINT='https://wutlhceqkioshepfbykf.supabase.co/functions/v1/damian-site-presence';
  const VISITOR_KEY='damian_presence_id';
  const OWNER_KEY='dm_admin_key';
  const OWNER_SAVED_KEY='dm_admin_key_saved';
  const SUPPORT_PROFILE_KEY='damion_support_profile';

  let id='';
  try{id=localStorage.getItem(VISITOR_KEY)||''}catch(_){}
  if(!id){
    id=(crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(36).slice(2)}`).replace(/[^a-zA-Z0-9_-]/g,'');
    try{localStorage.setItem(VISITOR_KEY,id)}catch(_){}
  }

  const ownerKey=()=>{let key='';try{key=sessionStorage.getItem(OWNER_KEY)||''}catch(_){}if(!key){try{key=localStorage.getItem(OWNER_SAVED_KEY)||''}catch(_){}}return key};
  const clearOwnerKey=()=>{try{sessionStorage.removeItem(OWNER_KEY)}catch(_){}try{localStorage.removeItem(OWNER_SAVED_KEY)}catch(_){}};
  const displayName=()=>{try{const p=JSON.parse(localStorage.getItem(SUPPORT_PROFILE_KEY)||'{}');return String(p?.name||'').trim().slice(0,80)}catch(_){return''}};
  const detectDevice=()=>{const ua=navigator.userAgent||'';if(/iPad|Tablet|PlayBook|Silk/i.test(ua)||(/Android/i.test(ua)&&!/Mobile/i.test(ua)))return'Tablet';if(/Mobi|Android|iPhone|iPod/i.test(ua))return'Mobile';return'Desktop'};
  const detectBrowser=()=>{const ua=navigator.userAgent||'';if(/Edg\//.test(ua))return'Edge';if(/OPR\//.test(ua))return'Opera';if(/Firefox\//.test(ua))return'Firefox';if(/Chrome\//.test(ua))return'Chrome';if(/Safari\//.test(ua))return'Safari';return'Browser'};
  const referrerHost=()=>{try{return document.referrer?new URL(document.referrer).hostname.replace(/^www\./,''):''}catch(_){return''}};
  const meta=()=>({timezone:Intl.DateTimeFormat().resolvedOptions().timeZone||'',language:navigator.language||'',device:detectDevice(),browser:detectBrowser(),referrer_host:referrerHost(),display_name:displayName()});

  const ping=()=>fetch(ENDPOINT,{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'ping',visitor_id:id,path:location.pathname,...meta()})}).catch(()=>{});

  const addGui=()=>{
    if(document.getElementById('dmLiveVisitors'))return;
    document.documentElement.classList.add('dm-owner-live');
    const style=document.createElement('style');style.id='dm-live-visitors-style';style.textContent=`
      #dmLiveVisitors{position:fixed;right:20px;bottom:88px;z-index:1195;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#f5f5f7}
      #dmLiveVisitors *{box-sizing:border-box}.dm-live-pill{display:flex;align-items:center;gap:8px;border:1px solid rgba(255,255,255,.11);background:linear-gradient(180deg,rgba(19,20,24,.97),rgba(11,12,15,.97));color:#f5f5f7;border-radius:13px;padding:10px 13px;box-shadow:0 14px 36px rgba(0,0,0,.38),0 0 20px rgba(220,35,61,.08);backdrop-filter:blur(14px);cursor:pointer;font:800 12px/1 system-ui,-apple-system,"Segoe UI",sans-serif;transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease}.dm-live-pill:hover{transform:translateY(-2px);border-color:rgba(239,79,95,.36);box-shadow:0 18px 42px rgba(0,0,0,.44),0 0 24px rgba(220,35,61,.13)}
      .dm-live-dot{width:7px;height:7px;border-radius:50%;background:#55dc86;box-shadow:0 0 9px rgba(85,220,134,.7);flex:0 0 auto}.dm-live-count{font-size:12px;color:#fff;min-width:10px;text-align:center}.dm-live-label{font-size:10px;color:#8d9199;font-weight:750}.dm-live-panel{position:absolute;right:74px;bottom:0;width:340px;max-height:min(600px,72vh);overflow:auto;padding:14px;border:1px solid rgba(255,255,255,.11);border-radius:16px;background:linear-gradient(180deg,rgba(14,15,18,.985),rgba(8,9,11,.985));box-shadow:0 24px 64px rgba(0,0,0,.55),0 0 30px rgba(197,18,47,.07);backdrop-filter:blur(18px);opacity:0;transform:translateY(8px) scale(.98);pointer-events:none;transition:opacity .18s ease,transform .18s ease}#dmLiveVisitors.open .dm-live-panel{opacity:1;transform:none;pointer-events:auto}
      .dm-live-head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:2px 2px 10px;border-bottom:1px solid rgba(255,255,255,.08)}.dm-live-head b{font-size:12px}.dm-live-head span{font-size:9px;color:#ef5368;font-weight:900;letter-spacing:.1em;text-transform:uppercase}.dm-live-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:10px 0}.dm-live-stat{border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.025);border-radius:11px;padding:9px}.dm-live-stat span{display:block;font-size:9px;color:#777782;text-transform:uppercase;letter-spacing:.07em}.dm-live-stat strong{display:block;margin-top:4px;font-size:18px;color:#fff}.dm-live-section-title{display:flex;justify-content:space-between;align-items:center;padding:7px 2px 8px;color:#9b9ba5;font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;border-top:1px solid rgba(255,255,255,.07)}
      .dm-visitor{padding:9px 8px;border:1px solid rgba(255,255,255,.06);border-radius:11px;background:rgba(255,255,255,.022);margin-bottom:7px}.dm-visitor-top{display:flex;align-items:center;justify-content:space-between;gap:10px}.dm-visitor-name{font-size:11px;font-weight:900}.dm-visitor-name.named:after{content:' known';margin-left:6px;font-size:8px;color:#ef6577;text-transform:uppercase;letter-spacing:.07em}.dm-visitor-place{font-size:10px;color:#6fdfa0}.dm-visitor-meta,.dm-visitor-path{font-size:9px;color:#85858f;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.dm-visitor-path{color:#b8b8c1}.dm-live-empty{padding:10px 4px;color:#777782;font-size:10px}.dm-live-updated{padding:9px 2px 0;color:#666670;font-size:9px;text-align:right}
      @media(max-width:760px){#dmLiveVisitors{right:16px;bottom:158px}.dm-live-panel{right:0;bottom:54px;width:min(340px,calc(100vw - 24px));max-height:calc(100vh - 250px)}.dm-live-pill{padding:9px 11px}}@media(prefers-reduced-motion:reduce){.dm-live-pill,.dm-live-panel{transition:none!important;transform:none!important}}
    `;document.head.appendChild(style);
    const root=document.createElement('div');root.id='dmLiveVisitors';root.innerHTML=`<div class="dm-live-panel" aria-label="Private live visitor panel"><div class="dm-live-head"><b>Who’s online</b><span>Owner only</span></div><div class="dm-live-grid"><div class="dm-live-stat"><span>Online now</span><strong id="dmOnlineNow">—</strong></div><div class="dm-live-stat"><span>Active 5 min</span><strong id="dmActiveFive">—</strong></div><div class="dm-live-stat"><span>Today</span><strong id="dmTodayVisitors">—</strong></div><div class="dm-live-stat"><span>Total</span><strong id="dmTotalVisitors">—</strong></div></div><div class="dm-live-section-title"><span>Online visitors</span><span>Name · device · page</span></div><div id="dmRecentVisitors"><div class="dm-live-empty">Loading…</div></div><div class="dm-live-updated" id="dmLiveUpdated">Connecting…</div></div><button class="dm-live-pill" type="button" aria-label="Open private live visitor stats" aria-expanded="false"><i class="dm-live-dot"></i><span class="dm-live-count" id="dmLiveCount">—</span><span class="dm-live-label">online</span></button>`;
    document.body.appendChild(root);const btn=root.querySelector('.dm-live-pill');btn.addEventListener('click',()=>{const open=root.classList.toggle('open');btn.setAttribute('aria-expanded',open?'true':'false')});document.addEventListener('pointerdown',e=>{if(!root.contains(e.target)){root.classList.remove('open');btn.setAttribute('aria-expanded','false')}});
  };

  const setText=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value};
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const countryName=code=>{if(!code)return'';try{return new Intl.DisplayNames([navigator.language||'en'],{type:'region'}).of(code)||code}catch(_){return code}};
  const shortAgo=iso=>{const s=Math.max(0,Math.round((Date.now()-new Date(iso).getTime())/1000));if(s<10)return'now';if(s<60)return`${s}s ago`;return`${Math.max(1,Math.round(s/60))}m ago`};
  const isOnline=v=>{const t=new Date(v?.last_seen||0).getTime();return Number.isFinite(t)&&Date.now()-t<=90000};
  const renderRecent=recent=>{const host=document.getElementById('dmRecentVisitors');if(!host)return;const list=Array.isArray(recent)?recent.filter(isOnline):[];if(!list.length){host.innerHTML='<div class="dm-live-empty">Nobody else is active right now.</div>';return}host.innerHTML=list.map(v=>{const place=countryName(v.country_code)||v.timezone||'Location unavailable';const tech=[v.device,v.browser].filter(Boolean).join(' · ');const source=v.referrer_host?` · from ${v.referrer_host}`:'';return`<div class="dm-visitor"><div class="dm-visitor-top"><span class="dm-visitor-name${v.named?' named':''}">${esc(v.visitor||'Anonymous visitor')}</span><span class="dm-visitor-place">${esc(place)}</span></div><div class="dm-visitor-meta">${esc(tech||'Unknown device')}${esc(source)} · ${esc(shortAgo(v.last_seen))}</div><div class="dm-visitor-path">On ${esc(v.path||'/')}</div></div>`}).join('')};
  const loadStats=async()=>{const key=ownerKey();if(!key)return;try{const r=await fetch(ENDPOINT,{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'stats',adminKey:key})});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d?.error||'stats unavailable');setText('dmLiveCount',d.online_now??0);setText('dmOnlineNow',d.online_now??0);setText('dmActiveFive',d.active_5m??0);setText('dmTodayVisitors',d.visitors_today??0);setText('dmTotalVisitors',d.total_visitors??0);renderRecent(d.recent||[]);setText('dmLiveUpdated','Updated '+new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}))}catch(err){if(String(err?.message||'').toLowerCase().includes('admin')){clearOwnerKey();document.getElementById('dmLiveVisitors')?.remove();document.documentElement.classList.remove('dm-owner-live')}else{setText('dmLiveUpdated','Reconnecting…')}}};

  const start=async()=>{await ping();if(ownerKey()){addGui();loadStats()}};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  const pingTimer=setInterval(()=>{if(document.visibilityState==='visible')ping()},30000);const statsTimer=setInterval(()=>{if(document.visibilityState==='visible'&&ownerKey())loadStats()},10000);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){ping();if(ownerKey())loadStats()}});window.addEventListener('pagehide',()=>{clearInterval(pingTimer);clearInterval(statsTimer)},{once:true});
})();
