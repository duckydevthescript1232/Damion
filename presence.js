(()=>{
  if(window.__dmPresenceLoaded)return;
  window.__dmPresenceLoaded=true;

  const ENDPOINT='https://wutlhceqkioshepfbykf.supabase.co/functions/v1/damian-site-presence';
  const KEY='damian_presence_id';
  let id='';
  try{id=localStorage.getItem(KEY)||''}catch(_){}
  if(!id){
    id=(crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(36).slice(2)}`).replace(/[^a-zA-Z0-9_-]/g,'');
    try{localStorage.setItem(KEY,id)}catch(_){}
  }

  const ping=()=>fetch(ENDPOINT,{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'ping',visitor_id:id,path:location.pathname})}).catch(()=>{});

  const addGui=()=>{
    if(document.getElementById('dmLiveVisitors'))return;
    const style=document.createElement('style');
    style.id='dm-live-visitors-style';
    style.textContent=`
      #dmLiveVisitors{position:fixed;right:18px;bottom:18px;z-index:999999;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#f5f5f7}
      #dmLiveVisitors *{box-sizing:border-box}
      .dm-live-pill{display:flex;align-items:center;gap:9px;border:1px solid rgba(255,255,255,.12);background:rgba(10,10,13,.92);color:#f5f5f7;border-radius:999px;padding:10px 14px;box-shadow:0 14px 42px rgba(0,0,0,.42),0 0 28px rgba(255,35,73,.10);backdrop-filter:blur(16px);cursor:pointer;font:800 12px/1 system-ui,-apple-system,"Segoe UI",sans-serif;transition:transform .16s ease,border-color .16s ease,box-shadow .16s ease}
      .dm-live-pill:hover{transform:translateY(-2px);border-color:rgba(255,63,94,.5);box-shadow:0 18px 48px rgba(0,0,0,.48),0 0 30px rgba(255,35,73,.18)}
      .dm-live-dot{width:8px;height:8px;border-radius:50%;background:#55dc86;box-shadow:0 0 12px rgba(85,220,134,.9);flex:0 0 auto}
      .dm-live-count{font-size:13px;color:#fff;min-width:10px;text-align:center}
      .dm-live-label{color:#a5a5ae;font-weight:750}
      .dm-live-panel{position:absolute;right:0;bottom:50px;width:230px;padding:14px;border:1px solid rgba(255,255,255,.11);border-radius:16px;background:rgba(9,9,12,.97);box-shadow:0 22px 60px rgba(0,0,0,.52),0 0 34px rgba(255,35,73,.08);backdrop-filter:blur(18px);opacity:0;transform:translateY(8px) scale(.98);pointer-events:none;transition:opacity .16s ease,transform .16s ease}
      #dmLiveVisitors.open .dm-live-panel{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}
      .dm-live-head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:2px 2px 10px;border-bottom:1px solid rgba(255,255,255,.08)}
      .dm-live-head b{font-size:12px;letter-spacing:.01em}.dm-live-head span{font-size:10px;color:#ff526d;font-weight:900;letter-spacing:.1em;text-transform:uppercase}
      .dm-live-row{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:10px 2px;border-bottom:1px solid rgba(255,255,255,.055);font-size:11px;color:#8f8f99}
      .dm-live-row:last-of-type{border-bottom:0}.dm-live-row strong{font-size:15px;color:#fff;letter-spacing:-.02em}
      .dm-live-updated{padding:8px 2px 0;color:#666670;font-size:9px;text-align:right}
      @media(max-width:760px){#dmLiveVisitors{right:12px;bottom:82px}.dm-live-panel{width:218px}.dm-live-pill{padding:9px 12px}}
      @media(prefers-reduced-motion:reduce){.dm-live-pill,.dm-live-panel{transition:none!important}}
    `;
    document.head.appendChild(style);

    const root=document.createElement('div');
    root.id='dmLiveVisitors';
    root.innerHTML=`
      <div class="dm-live-panel" role="status" aria-live="polite">
        <div class="dm-live-head"><b>Live website stats</b><span>Live</span></div>
        <div class="dm-live-row"><span>Online now</span><strong id="dmOnlineNow">—</strong></div>
        <div class="dm-live-row"><span>Active 5 min</span><strong id="dmActiveFive">—</strong></div>
        <div class="dm-live-row"><span>Visitors today</span><strong id="dmTodayVisitors">—</strong></div>
        <div class="dm-live-row"><span>Total tracked</span><strong id="dmTotalVisitors">—</strong></div>
        <div class="dm-live-updated" id="dmLiveUpdated">Connecting…</div>
      </div>
      <button class="dm-live-pill" type="button" aria-label="Show live visitor stats" aria-expanded="false">
        <i class="dm-live-dot" aria-hidden="true"></i><span class="dm-live-count" id="dmLiveCount">—</span><span class="dm-live-label">online</span>
      </button>`;
    document.body.appendChild(root);

    const btn=root.querySelector('.dm-live-pill');
    btn.addEventListener('click',()=>{
      const open=root.classList.toggle('open');
      btn.setAttribute('aria-expanded',open?'true':'false');
    });
    document.addEventListener('pointerdown',e=>{if(!root.contains(e.target)){root.classList.remove('open');btn.setAttribute('aria-expanded','false')}});
  };

  const setText=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value};
  const loadStats=async()=>{
    try{
      const r=await fetch(`${ENDPOINT}?action=stats&t=${Date.now()}`,{cache:'no-store'});
      const d=await r.json();
      if(!r.ok)throw new Error(d?.error||'stats unavailable');
      setText('dmLiveCount',d.online_now??0);
      setText('dmOnlineNow',d.online_now??0);
      setText('dmActiveFive',d.active_5m??0);
      setText('dmTodayVisitors',d.visitors_today??0);
      setText('dmTotalVisitors',d.total_visitors??0);
      setText('dmLiveUpdated','Updated '+new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}));
    }catch(_){
      setText('dmLiveCount','—');
      setText('dmLiveUpdated','Reconnecting…');
    }
  };

  const start=async()=>{
    addGui();
    await ping();
    loadStats();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();

  const pingTimer=setInterval(()=>{if(document.visibilityState==='visible')ping()},30000);
  const statsTimer=setInterval(()=>{if(document.visibilityState==='visible')loadStats()},10000);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){ping();loadStats()}});
  window.addEventListener('pagehide',()=>{clearInterval(pingTimer);clearInterval(statsTimer)},{once:true});
})();
