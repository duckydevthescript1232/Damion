(()=>{
  if(window.__dmBroadcastV1)return;
  window.__dmBroadcastV1=true;

  const ENDPOINT='https://wutlhceqkioshepfbykf.supabase.co/functions/v1/damian-site-presence';
  const OWNER_KEY='damion_site_session';
  const SEEN_KEY='dm_broadcast_seen_v1';
  let seenId='';
  let hideTimer=0;
  let polling=false;
  try{seenId=sessionStorage.getItem(SEEN_KEY)||''}catch(_){seenId=''}

  const ownerSession=()=>{try{return localStorage.getItem(OWNER_KEY)||''}catch(_){return''}};
  const post=async body=>{
    const r=await fetch(ENDPOINT,{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    const d=await r.json().catch(()=>({}));
    if(!r.ok)throw new Error(d?.error||`Request failed (${r.status})`);
    return d;
  };

  const ensureLayer=()=>{
    let layer=document.getElementById('dmBroadcastLayer');
    if(layer)return layer;
    layer=document.createElement('div');
    layer.id='dmBroadcastLayer';
    layer.setAttribute('aria-live','polite');
    layer.setAttribute('aria-atomic','true');
    document.body.appendChild(layer);
    return layer;
  };

  const showBroadcast=b=>{
    if(!b?.id||!b?.message)return;
    const id=String(b.id);
    if(id===seenId)return;
    seenId=id;
    try{sessionStorage.setItem(SEEN_KEY,id)}catch(_){}

    const expires=new Date(b.expires_at||0).getTime();
    const remaining=Number.isFinite(expires)?Math.max(1800,Math.min(9000,expires-Date.now())):7000;
    const layer=ensureLayer();
    layer.replaceChildren();
    const toast=document.createElement('div');
    toast.className='dm-broadcast-toast';
    toast.style.setProperty('--dm-broadcast-life',`${remaining}ms`);

    const head=document.createElement('div');head.className='dm-broadcast-head';
    const dot=document.createElement('i');dot.className='dm-broadcast-dot';
    const name=document.createElement('span');name.className='dm-broadcast-name';name.textContent=b.sender_name||'Damiøn';
    const live=document.createElement('span');live.className='dm-broadcast-live';live.textContent='Studio broadcast';
    head.append(dot,name,live);
    const message=document.createElement('div');message.className='dm-broadcast-message';message.textContent=String(b.message).slice(0,160);
    const progress=document.createElement('div');progress.className='dm-broadcast-progress';progress.innerHTML='<i></i>';
    toast.append(head,message,progress);
    layer.appendChild(toast);
    requestAnimationFrame(()=>toast.classList.add('show'));
    try{window.dmUISound?.('primary')}catch(_){}
    clearTimeout(hideTimer);
    hideTimer=setTimeout(()=>{
      toast.classList.remove('show');
      setTimeout(()=>{if(toast.isConnected)toast.remove()},420);
    },remaining);
  };

  const ensureOwnerComposer=()=>{
    if(!ownerSession())return;
    if(document.querySelector('.dm-owner-broadcast'))return;
    const host=document.querySelector('.dm-sidepanel .dm-side-body');
    if(!host)return;
    const intro=host.querySelector('.dm-side-intro');
    const box=document.createElement('section');
    box.className='dm-owner-broadcast';
    box.innerHTML=`<div class="dm-owner-broadcast-label">Owner only</div><div class="dm-owner-broadcast-title">Broadcast message</div><div class="dm-owner-broadcast-copy">Send one short announcement to everyone who currently has the site open.</div><textarea maxlength="160" placeholder="Type an announcement…" aria-label="Broadcast message"></textarea><div class="dm-owner-broadcast-actions"><span class="dm-owner-broadcast-count">0 / 160</span><button class="dm-owner-broadcast-send" type="button">Send to everyone</button></div><div class="dm-owner-broadcast-status" aria-live="polite"></div>`;
    if(intro?.nextSibling)host.insertBefore(box,intro.nextSibling);else host.prepend(box);
    const input=box.querySelector('textarea');
    const count=box.querySelector('.dm-owner-broadcast-count');
    const button=box.querySelector('.dm-owner-broadcast-send');
    const status=box.querySelector('.dm-owner-broadcast-status');
    const updateCount=()=>{count.textContent=`${input.value.length} / 160`};
    input.addEventListener('input',updateCount);
    input.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();button.click()}});
    button.addEventListener('click',async()=>{
      const message=input.value.trim();
      if(!message){status.textContent='Type a message first.';status.className='dm-owner-broadcast-status error';return}
      const session=ownerSession();
      if(!session){status.textContent='Owner login required.';status.className='dm-owner-broadcast-status error';return}
      button.disabled=true;status.textContent='Sending…';status.className='dm-owner-broadcast-status';
      try{
        const d=await post({action:'broadcast_send',ownerSession:session,message});
        status.textContent='Broadcast sent to everyone online.';status.className='dm-owner-broadcast-status ok';
        input.value='';updateCount();
        if(d.broadcast)showBroadcast(d.broadcast);
      }catch(err){status.textContent=err?.message||'Could not send broadcast.';status.className='dm-owner-broadcast-status error'}
      finally{button.disabled=false}
    });
  };

  const poll=async()=>{
    if(polling||document.hidden)return;
    polling=true;
    try{
      const d=await post({action:'broadcast_latest'});
      if(d.broadcast)showBroadcast(d.broadcast);
    }catch(_){}
    finally{polling=false}
  };

  const start=()=>{
    ensureLayer();
    ensureOwnerComposer();
    poll();
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  document.addEventListener('dm:pagechange',()=>setTimeout(()=>{ensureOwnerComposer();poll()},0));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){ensureOwnerComposer();poll()}});
  window.addEventListener('storage',e=>{if(e.key===OWNER_KEY)ensureOwnerComposer()});
  new MutationObserver(records=>{
    if(records.some(r=>[...r.addedNodes].some(n=>n.nodeType===1&&(n.classList?.contains('dm-sidepanel')||n.querySelector?.('.dm-sidepanel')))))ensureOwnerComposer();
  }).observe(document.documentElement,{childList:true,subtree:true});
  setInterval(()=>{ensureOwnerComposer();poll()},2000);
})();