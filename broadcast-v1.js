(()=>{
  if(window.__dmBroadcastV7)return;
  window.__dmBroadcastV7=true;window.__dmBroadcastV6=true;window.__dmBroadcastV5=true;

  const ENDPOINT='https://wutlhceqkioshepfbykf.supabase.co/functions/v1/damian-site-presence';
  const OWNER_KEY='damion_site_session',CUSTOMER_KEY='damion_customer_session',VISITOR_KEY='damian_presence_id';
  const BCAST_SEEN='dm_broadcast_seen_v1',HINT_SEEN='dm_hint_seen_v1';
  let seenBroadcast='',seenHint='',polling=false,broadcastTimer=0,hintTimer=0,currentEvent=null,lastPollSignature='',lastWarning='';
  try{seenBroadcast=sessionStorage.getItem(BCAST_SEEN)||'';seenHint=sessionStorage.getItem(HINT_SEEN)||''}catch(_){}

  const read=k=>{try{return localStorage.getItem(k)||''}catch(_){return''}};
  const writeSession=(k,v)=>{try{sessionStorage.setItem(k,v)}catch(_){}};
  const ownerSession=()=>read(OWNER_KEY),customerSession=()=>read(CUSTOMER_KEY);
  const visitorId=()=>{let id=read(VISITOR_KEY);if(!/^[a-zA-Z0-9_-]{8,80}$/.test(id)){id=`v_${crypto.randomUUID().replace(/-/g,'')}`;try{localStorage.setItem(VISITOR_KEY,id)}catch(_){}}return id};
  const post=async body=>{const r=await fetch(ENDPOINT,{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d?.error||`Request failed (${r.status})`);return d};

  const ensureLayer=()=>{let layer=document.getElementById('dmBroadcastLayer');if(!layer){layer=document.createElement('div');layer.id='dmBroadcastLayer';layer.setAttribute('aria-live','polite');layer.setAttribute('aria-atomic','true');document.body.appendChild(layer)}return layer};

  function showBroadcast(b){
    if(!b?.id||!b?.message)return;const id=String(b.id);if(id===seenBroadcast)return;seenBroadcast=id;writeSession(BCAST_SEEN,id);
    const expires=new Date(b.expires_at||0).getTime(),remaining=Number.isFinite(expires)?Math.max(1600,Math.min(9000,expires-Date.now())):7000;
    const layer=ensureLayer();layer.replaceChildren();const toast=document.createElement('div');toast.className='dm-broadcast-toast';const line=document.createElement('div');line.className='dm-broadcast-line';
    const name=document.createElement('span');name.className='dm-broadcast-name';name.append(document.createTextNode('Damiøn'));const check=document.createElement('span');check.className='dm-broadcast-check';check.textContent='✓';check.setAttribute('aria-hidden','true');const colon=document.createElement('span');colon.className='dm-broadcast-colon';colon.textContent=':';name.append(check,colon);
    const message=document.createElement('span');message.className='dm-broadcast-message';message.textContent=String(b.message).slice(0,160);line.append(name,message);toast.appendChild(line);layer.appendChild(toast);requestAnimationFrame(()=>toast.classList.add('show'));try{window.dmUISound?.('primary')}catch(_){}
    clearTimeout(broadcastTimer);broadcastTimer=setTimeout(()=>{toast.classList.remove('show');setTimeout(()=>toast.remove(),470)},remaining);
  }

  function showHint(h){
    if(!h?.id||!h?.message)return;const id=String(h.id);if(id===seenHint)return;seenHint=id;writeSession(HINT_SEEN,id);
    let el=document.getElementById('dmSiteHint');if(!el){el=document.createElement('div');el.id='dmSiteHint';el.setAttribute('role','status');const b=document.createElement('b');b.textContent='SERVER:';const span=document.createElement('span');el.append(b,span);document.body.appendChild(el)}
    el.querySelector('span').textContent=String(h.message).slice(0,140);requestAnimationFrame(()=>el.classList.add('show'));clearTimeout(hintTimer);const expires=new Date(h.expires_at||0).getTime(),remaining=Number.isFinite(expires)?Math.max(1500,Math.min(8000,expires-Date.now())):6000;hintTimer=setTimeout(()=>el.classList.remove('show'),remaining);
  }

  function formatRemaining(ms){if(ms<=0)return'00:00';const total=Math.max(0,Math.ceil(ms/1000)),m=Math.floor(total/60),s=total%60;return`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`}
  function renderEvent(event){
    currentEvent=event||null;let el=document.getElementById('dmLiveEvent');if(!event){if(el)el.hidden=true;return}
    if(!el){el=document.createElement('aside');el.id='dmLiveEvent';el.innerHTML='<div class="dm-live-event-top"><i class="dm-live-event-dot"></i><strong class="dm-live-event-title"></strong><span class="dm-live-event-time"></span></div><div class="dm-live-event-message"></div>';document.body.appendChild(el)}
    el.hidden=false;el.querySelector('.dm-live-event-title').textContent=String(event.title||'LIVE EVENT').slice(0,80);el.querySelector('.dm-live-event-message').textContent=String(event.message||'').slice(0,160);updateEventClock();
  }
  function updateEventClock(){const el=document.getElementById('dmLiveEvent');if(!el||el.hidden||!currentEvent?.ends_at)return;const left=new Date(currentEvent.ends_at).getTime()-Date.now();if(left<=0){el.hidden=true;currentEvent=null;return}el.querySelector('.dm-live-event-time').textContent=formatRemaining(left)}

  async function votePoll(pollId,index){
    try{const d=await post({action:'poll_vote',poll_id:Number(pollId),option_index:Number(index),visitor_id:visitorId()});if(d.poll){lastPollSignature='';renderPoll(d.poll)}}catch(_){}
  }
  function renderPoll(p){
    let el=document.getElementById('dmLivePoll');if(!p){if(el)el.hidden=true;lastPollSignature='';return}
    const signature=JSON.stringify([p.id,p.counts,p.voted_option,p.expires_at]);if(signature===lastPollSignature&&el&&!el.hidden)return;lastPollSignature=signature;
    if(!el){el=document.createElement('section');el.id='dmLivePoll';document.body.appendChild(el)}el.hidden=false;el.replaceChildren();
    const kicker=document.createElement('div');kicker.className='dm-poll-kicker';const left=document.createElement('span');left.textContent='LIVE POLL';const right=document.createElement('span');const timeLeft=new Date(p.expires_at||0).getTime()-Date.now();right.textContent=`${p.total_votes||0} votes · ${Math.max(1,Math.ceil(timeLeft/60000))}m`;kicker.append(left,right);
    const q=document.createElement('div');q.className='dm-poll-question';q.textContent=String(p.question||'').slice(0,120);const options=document.createElement('div');options.className='dm-poll-options';const total=Math.max(1,Number(p.total_votes)||0),voted=p.voted_option!==null&&p.voted_option!==undefined;
    (Array.isArray(p.options)?p.options:[]).forEach((text,i)=>{const count=Number(p.counts?.[i]||0),pct=Math.round((count/total)*100);const btn=document.createElement('button');btn.type='button';btn.className='dm-poll-option'+(Number(p.voted_option)===i?' selected':'');btn.disabled=voted;const fill=document.createElement('i');fill.className='dm-poll-fill';fill.style.width=`${voted?pct:0}%`;const label=document.createElement('span');label.textContent=String(text).slice(0,50);const result=document.createElement('b');result.textContent=voted?`${pct}%`:'';btn.append(fill,label,result);btn.addEventListener('click',()=>votePoll(p.id,i));options.appendChild(btn)});
    const meta=document.createElement('div');meta.className='dm-poll-meta';meta.innerHTML=`<span>${voted?'Vote recorded':'Tap an option to vote'}</span><span>${voted?'Results update live':'One vote per browser'}</span>`;el.append(kicker,q,options,meta);
  }

  function showWarning(user){
    if(!user?.warning_text)return;const key=String(user.warning_at||user.warning_text);if(key===lastWarning)return;lastWarning=key;
    let d=document.getElementById('dmUserWarning');if(!d){d=document.createElement('dialog');d.id='dmUserWarning';d.innerHTML='<div class="dm-user-warning-card"><small>MESSAGE FROM OWNER</small><h3>Account warning</h3><p></p><button type="button">Got it</button></div>';document.body.appendChild(d);d.querySelector('button').addEventListener('click',async()=>{try{await post({action:'warning_seen',customerSession:customerSession()})}catch(_){}try{d.close()}catch(_){d.removeAttribute('open')}})}
    d.querySelector('p').textContent=String(user.warning_text).slice(0,180);try{if(!d.open)d.showModal()}catch(_){d.setAttribute('open','')}
  }

  function forceCustomerLogout(){
    if(!customerSession())return;try{localStorage.removeItem(CUSTOMER_KEY)}catch(_){}document.dispatchEvent(new CustomEvent('dm-account-state',{detail:{customer:null,owner:Boolean(ownerSession())}}));
    let el=document.getElementById('dmSiteHint');if(!el){el=document.createElement('div');el.id='dmSiteHint';el.innerHTML='<b>ACCOUNT:</b><span></span>';document.body.appendChild(el)}el.querySelector('span').textContent='Your session was ended by the site owner.';el.classList.add('show');setTimeout(()=>location.reload(),1400);
  }

  const removeLegacyUI=()=>{document.querySelectorAll('.dm-owner-broadcast').forEach(el=>el.remove());document.getElementById('dmBroadcastAdminButton')?.remove();const old=document.getElementById('dmBroadcastComposer');if(old&&old.tagName!=='DIALOG')old.remove()};
  const closeComposer=()=>{const d=document.getElementById('dmBroadcastComposer');if(!d)return;try{if(d.open)d.close()}catch(_){d.removeAttribute('open')}};
  function ensureComposer(){
    removeLegacyUI();if(!ownerSession()){document.getElementById('dmBroadcastComposer')?.remove();return null}let d=document.getElementById('dmBroadcastComposer');if(d)return d;
    d=document.createElement('dialog');d.id='dmBroadcastComposer';d.innerHTML='<div class="dm-broadcast-composer-card"><div class="dm-broadcast-composer-head"><div><small>OWNER ONLY</small><b>Send a message</b></div><button class="dm-broadcast-close" type="button" aria-label="Close">×</button></div><textarea maxlength="160" placeholder="Type the message everyone should see…" aria-label="Broadcast message"></textarea><div class="dm-broadcast-composer-foot"><span class="dm-broadcast-count">0 / 160</span><button class="dm-broadcast-send" type="button">Send</button></div><div class="dm-broadcast-status" aria-live="polite"></div></div>';document.body.appendChild(d);
    const input=d.querySelector('textarea'),count=d.querySelector('.dm-broadcast-count'),send=d.querySelector('.dm-broadcast-send'),status=d.querySelector('.dm-broadcast-status');d.querySelector('.dm-broadcast-close').addEventListener('click',closeComposer);d.addEventListener('cancel',e=>{e.preventDefault();closeComposer()});input.addEventListener('input',()=>count.textContent=`${input.value.length} / 160`);input.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();send.click()}});
    send.addEventListener('click',async()=>{const message=input.value.trim();if(!message){status.textContent='Type a message first.';status.className='dm-broadcast-status error';return}const session=ownerSession();if(!session){status.textContent='Owner login required.';status.className='dm-broadcast-status error';return}send.disabled=true;status.textContent='Sending…';status.className='dm-broadcast-status';try{const out=await post({action:'broadcast_send',ownerSession:session,message});status.textContent='Sent.';status.className='dm-broadcast-status ok';input.value='';count.textContent='0 / 160';if(out.broadcast)showBroadcast(out.broadcast)}catch(err){status.textContent=err?.message||'Could not send.';status.className='dm-broadcast-status error'}finally{send.disabled=false}});return d;
  }
  const openComposer=()=>{if(!ownerSession()){location.href='/admin-orders.html';return}const d=ensureComposer();if(!d)return;try{if(!d.open)d.showModal()}catch(_){d.setAttribute('open','')}requestAnimationFrame(()=>d.querySelector('textarea')?.focus?.({preventScroll:true}))};window.dmOpenBroadcast=openComposer;

  async function poll(){
    if(polling||document.hidden)return;polling=true;
    try{const d=await post({action:'live_state',visitor_id:visitorId(),customerSession:customerSession()});if(d.force_logout){forceCustomerLogout();return}if(d.broadcast)showBroadcast(d.broadcast);if(d.hint)showHint(d.hint);document.getElementById('dmLiveEvent')?.remove();renderPoll(d.poll||null);if(d.user)showWarning(d.user)}catch(_){}finally{polling=false}
  }
  const start=()=>{ensureLayer();ensureComposer();poll()};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();document.addEventListener('dm:pagechange',()=>setTimeout(()=>{ensureComposer();poll()},0));document.addEventListener('visibilitychange',()=>{if(!document.hidden){ensureComposer();poll()}});window.addEventListener('storage',e=>{if(e.key===OWNER_KEY)ensureComposer()});setInterval(()=>{ensureComposer();poll()},2000);setInterval(updateEventClock,1000);
})();
