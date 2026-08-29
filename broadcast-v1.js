(()=>{
  if(window.__dmBroadcastV2)return;
  window.__dmBroadcastV2=true;

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
    if(!layer){layer=document.createElement('div');layer.id='dmBroadcastLayer';layer.setAttribute('aria-live','polite');layer.setAttribute('aria-atomic','true');document.body.appendChild(layer)}
    return layer;
  };

  const showBroadcast=b=>{
    if(!b?.id||!b?.message)return;
    const id=String(b.id);if(id===seenId)return;
    seenId=id;try{sessionStorage.setItem(SEEN_KEY,id)}catch(_){}
    const expires=new Date(b.expires_at||0).getTime();
    const remaining=Number.isFinite(expires)?Math.max(1800,Math.min(9000,expires-Date.now())):7000;
    const layer=ensureLayer();layer.replaceChildren();
    const toast=document.createElement('div');toast.className='dm-broadcast-toast';toast.style.setProperty('--dm-broadcast-life',`${remaining}ms`);
    toast.innerHTML='<div class="dm-broadcast-head"><i class="dm-broadcast-dot"></i><span class="dm-broadcast-name"></span><span class="dm-broadcast-live">Studio broadcast</span></div><div class="dm-broadcast-message"></div><div class="dm-broadcast-progress"><i></i></div>';
    toast.querySelector('.dm-broadcast-name').textContent=b.sender_name||'Damiøn';
    toast.querySelector('.dm-broadcast-message').textContent=String(b.message).slice(0,160);
    layer.appendChild(toast);requestAnimationFrame(()=>toast.classList.add('show'));
    try{window.dmUISound?.('primary')}catch(_){}
    clearTimeout(hideTimer);hideTimer=setTimeout(()=>{toast.classList.remove('show');setTimeout(()=>toast.remove(),420)},remaining);
  };

  const removeOldSidebarComposer=()=>document.querySelectorAll('.dm-owner-broadcast').forEach(el=>el.remove());

  const ensureOwnerButton=()=>{
    removeOldSidebarComposer();
    if(!ownerSession()){
      document.getElementById('dmBroadcastAdminButton')?.remove();
      document.getElementById('dmBroadcastComposer')?.remove();
      return;
    }
    if(document.getElementById('dmBroadcastAdminButton'))return;

    const button=document.createElement('button');
    button.id='dmBroadcastAdminButton';button.type='button';button.textContent='A';button.title='Broadcast message';button.setAttribute('aria-label','Open broadcast message');
    document.body.appendChild(button);

    const modal=document.createElement('div');
    modal.id='dmBroadcastComposer';modal.setAttribute('aria-hidden','true');
    modal.innerHTML='<div class="dm-broadcast-composer-card" role="dialog" aria-modal="true" aria-label="Broadcast message"><div class="dm-broadcast-composer-head"><div><small>OWNER ONLY</small><b>Broadcast</b></div><button class="dm-broadcast-close" type="button" aria-label="Close">×</button></div><p>Send a short message to everyone who currently has the site open.</p><textarea maxlength="160" placeholder="Type your message…" aria-label="Broadcast message"></textarea><div class="dm-broadcast-composer-foot"><span class="dm-broadcast-count">0 / 160</span><button class="dm-broadcast-send" type="button">Send</button></div><div class="dm-broadcast-status" aria-live="polite"></div></div>';
    document.body.appendChild(modal);

    const input=modal.querySelector('textarea'),count=modal.querySelector('.dm-broadcast-count'),send=modal.querySelector('.dm-broadcast-send'),status=modal.querySelector('.dm-broadcast-status');
    const close=()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true')};
    const open=()=>{modal.classList.add('open');modal.setAttribute('aria-hidden','false');requestAnimationFrame(()=>input.focus())};
    button.addEventListener('click',open);
    modal.querySelector('.dm-broadcast-close').addEventListener('click',close);
    modal.addEventListener('click',e=>{if(e.target===modal)close()});
    input.addEventListener('input',()=>count.textContent=`${input.value.length} / 160`);
    input.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();send.click()}});
    send.addEventListener('click',async()=>{
      const message=input.value.trim();
      if(!message){status.textContent='Type a message first.';status.className='dm-broadcast-status error';return}
      const session=ownerSession();if(!session){status.textContent='Owner login required.';status.className='dm-broadcast-status error';return}
      send.disabled=true;status.textContent='Sending…';status.className='dm-broadcast-status';
      try{
        const d=await post({action:'broadcast_send',ownerSession:session,message});
        status.textContent='Sent to everyone online.';status.className='dm-broadcast-status ok';input.value='';count.textContent='0 / 160';if(d.broadcast)showBroadcast(d.broadcast);setTimeout(close,500);
      }catch(err){status.textContent=err?.message||'Could not send.';status.className='dm-broadcast-status error'}finally{send.disabled=false}
    });
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('open'))close()});
  };

  const poll=async()=>{
    if(polling||document.hidden)return;polling=true;
    try{const d=await post({action:'broadcast_latest'});if(d.broadcast)showBroadcast(d.broadcast)}catch(_){}finally{polling=false}
  };

  const start=()=>{ensureLayer();ensureOwnerButton();poll()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  document.addEventListener('dm:pagechange',()=>setTimeout(()=>{ensureOwnerButton();poll()},0));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){ensureOwnerButton();poll()}});
  window.addEventListener('storage',e=>{if(e.key===OWNER_KEY)ensureOwnerButton()});
  setInterval(()=>{ensureOwnerButton();poll()},2000);
})();