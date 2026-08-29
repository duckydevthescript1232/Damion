(()=>{
  if(window.__dmBroadcastV6)return;
  window.__dmBroadcastV6=true;
  window.__dmBroadcastV5=true;

  const ENDPOINT='https://wutlhceqkioshepfbykf.supabase.co/functions/v1/damian-site-presence';
  const OWNER_KEY='damion_site_session';
  const SEEN_KEY='dm_broadcast_seen_v1';
  let seenId='';
  let hideTimer=0;
  let polling=false;
  try{seenId=sessionStorage.getItem(SEEN_KEY)||''}catch(_){}

  const ownerSession=()=>{try{return localStorage.getItem(OWNER_KEY)||''}catch(_){return''}};
  const post=async body=>{
    const r=await fetch(ENDPOINT,{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    const d=await r.json().catch(()=>({}));
    if(!r.ok)throw new Error(d?.error||`Request failed (${r.status})`);
    return d;
  };

  const ensureLayer=()=>{
    let layer=document.getElementById('dmBroadcastLayer');
    if(!layer){
      layer=document.createElement('div');
      layer.id='dmBroadcastLayer';
      layer.setAttribute('aria-live','polite');
      layer.setAttribute('aria-atomic','true');
      document.body.appendChild(layer);
    }
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
    const line=document.createElement('div');
    line.className='dm-broadcast-line';

    const name=document.createElement('span');
    name.className='dm-broadcast-name';
    name.append(document.createTextNode('Damiøn'));
    const check=document.createElement('span');
    check.className='dm-broadcast-check';
    check.textContent='✓';
    check.setAttribute('aria-hidden','true');
    const colon=document.createElement('span');
    colon.className='dm-broadcast-colon';
    colon.textContent=':';
    name.append(check,colon);

    const message=document.createElement('span');
    message.className='dm-broadcast-message';
    message.textContent=String(b.message).slice(0,160);

    line.append(name,message);
    toast.appendChild(line);
    layer.appendChild(toast);
    requestAnimationFrame(()=>toast.classList.add('show'));
    try{window.dmUISound?.('primary')}catch(_){}
    clearTimeout(hideTimer);
    hideTimer=setTimeout(()=>{
      toast.classList.remove('show');
      setTimeout(()=>toast.remove(),460);
    },remaining);
  };

  const removeLegacyUI=()=>{
    document.querySelectorAll('.dm-owner-broadcast').forEach(el=>el.remove());
    document.getElementById('dmBroadcastAdminButton')?.remove();
    const old=document.getElementById('dmBroadcastComposer');
    if(old&&old.tagName!=='DIALOG')old.remove();
  };

  const closeComposer=()=>{
    const dialog=document.getElementById('dmBroadcastComposer');
    if(!dialog)return;
    try{if(dialog.open)dialog.close()}catch(_){dialog.removeAttribute('open')}
  };

  const ensureComposer=()=>{
    removeLegacyUI();
    if(!ownerSession()){
      document.getElementById('dmBroadcastComposer')?.remove();
      return null;
    }
    let dialog=document.getElementById('dmBroadcastComposer');
    if(dialog)return dialog;

    dialog=document.createElement('dialog');
    dialog.id='dmBroadcastComposer';
    dialog.innerHTML='<div class="dm-broadcast-composer-card"><div class="dm-broadcast-composer-head"><div><small>OWNER ONLY</small><b>Send a message</b></div><button class="dm-broadcast-close" type="button" aria-label="Close">×</button></div><textarea maxlength="160" placeholder="Type the message everyone should see…" aria-label="Broadcast message"></textarea><div class="dm-broadcast-composer-foot"><span class="dm-broadcast-count">0 / 160</span><button class="dm-broadcast-send" type="button">Send</button></div><div class="dm-broadcast-status" aria-live="polite"></div></div>';
    document.body.appendChild(dialog);

    const input=dialog.querySelector('textarea');
    const count=dialog.querySelector('.dm-broadcast-count');
    const send=dialog.querySelector('.dm-broadcast-send');
    const status=dialog.querySelector('.dm-broadcast-status');
    dialog.querySelector('.dm-broadcast-close').addEventListener('click',closeComposer);
    dialog.addEventListener('cancel',e=>{e.preventDefault();closeComposer()});
    input.addEventListener('input',()=>count.textContent=`${input.value.length} / 160`);
    input.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();send.click()}});
    send.addEventListener('click',async()=>{
      const message=input.value.trim();
      if(!message){status.textContent='Type a message first.';status.className='dm-broadcast-status error';return}
      const session=ownerSession();
      if(!session){status.textContent='Owner login required.';status.className='dm-broadcast-status error';return}
      send.disabled=true;status.textContent='Sending…';status.className='dm-broadcast-status';
      try{
        const d=await post({action:'broadcast_send',ownerSession:session,message});
        status.textContent='Sent.';status.className='dm-broadcast-status ok';
        input.value='';count.textContent='0 / 160';
        if(d.broadcast)showBroadcast(d.broadcast);
      }catch(err){status.textContent=err?.message||'Could not send.';status.className='dm-broadcast-status error'}finally{send.disabled=false}
    });
    return dialog;
  };

  const openComposer=()=>{
    if(!ownerSession()){location.href='/admin-orders.html';return}
    const dialog=ensureComposer();
    if(!dialog)return;
    try{if(!dialog.open)dialog.showModal()}catch(_){dialog.setAttribute('open','')}
    requestAnimationFrame(()=>dialog.querySelector('textarea')?.focus?.({preventScroll:true}));
  };
  window.dmOpenBroadcast=openComposer;

  const poll=async()=>{
    if(polling||document.hidden)return;
    polling=true;
    try{const d=await post({action:'broadcast_latest'});if(d.broadcast)showBroadcast(d.broadcast)}catch(_){}finally{polling=false}
  };

  const start=()=>{ensureLayer();ensureComposer();poll()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  document.addEventListener('dm:pagechange',()=>setTimeout(()=>{ensureComposer();poll()},0));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){ensureComposer();poll()}});
  window.addEventListener('storage',e=>{if(e.key===OWNER_KEY)ensureComposer()});
  setInterval(()=>{ensureComposer();poll()},2000);
})();