(function(){
  'use strict';

  const STORAGE_KEY='dm_admin_mini_live_ui_v1';
  const BROADCAST_API='https://wutlhceqkioshepfbykf.supabase.co/functions/v1/damian-site-presence';
  const OWNER_SESSION_KEY='damion_site_session';
  const $=id=>document.getElementById(id);
  const initialState={grants:[],messages:[],extras:[],activity:[]};
  let state=loadState();
  let toastTimer;

  function loadState(){
    try{
      const saved=JSON.parse(sessionStorage.getItem(STORAGE_KEY)||'null');
      return saved&&Array.isArray(saved.activity)?{...initialState,...saved}:structuredClone(initialState);
    }catch(_error){return structuredClone(initialState);}
  }

  function saveState(){
    try{sessionStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch(_error){}
  }

  function clean(value,max=120){
    return String(value||'').replace(/[<>]/g,'').trim().slice(0,max);
  }

  function timeLabel(){
    return new Intl.DateTimeFormat(undefined,{hour:'2-digit',minute:'2-digit'}).format(new Date());
  }

  function addActivity(title,detail){
    state.activity.unshift({title:clean(title,48),detail:clean(detail,100),time:timeLabel()});
    state.activity=state.activity.slice(0,8);
    saveState();
    render();
  }

  function showToast(message){
    const toast=$('dmMiniToast');
    if(!toast)return;
    toast.textContent=message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>toast.classList.remove('show'),2200);
  }

  function render(){
    if($('dmMiniGrantCount'))$('dmMiniGrantCount').textContent=state.grants.length;
    if($('dmMiniMessageCount'))$('dmMiniMessageCount').textContent=state.messages.length;
    if($('dmMiniExtraCount'))$('dmMiniExtraCount').textContent=state.extras.length;
    const activity=$('dmMiniActivity');
    if(!activity)return;
    activity.replaceChildren();
    if(!state.activity.length){
      const empty=document.createElement('div');
      empty.className='dm-mini-empty';
      empty.textContent='Your recent owner actions will appear here.';
      activity.append(empty);
      return;
    }
    state.activity.forEach(item=>{
      const row=document.createElement('div');
      row.className='dm-mini-activity-row';
      const dot=document.createElement('i');
      const copy=document.createElement('div');
      const title=document.createElement('b');
      const detail=document.createElement('p');
      const time=document.createElement('time');
      title.textContent=item.title;
      detail.textContent=item.detail;
      time.textContent=item.time;
      copy.append(title,detail);
      row.append(dot,copy,time);
      activity.append(row);
    });
  }

  function isOwnerDashboardOpen(){
    const dashboard=$('dashboard');
    return dashboard&&!dashboard.classList.contains('hidden');
  }

  function ownerSession(){
    try{return localStorage.getItem(OWNER_SESSION_KEY)||''}catch(_error){return''}
  }

  function openPanel(){
    if(!isOwnerDashboardOpen()){
      showToast('Sign in as the owner first.');
      return;
    }
    const overlay=$('dmMiniAdminOverlay');
    if(!overlay)return;
    overlay.hidden=false;
    document.body.dataset.dmMiniOverflow=document.body.style.overflow||'';
    document.body.style.overflow='hidden';
    $('dmMiniAdmin')?.classList.remove('is-minimized');
    $('dmMiniClose')?.focus();
    render();
  }

  function closePanel(){
    const overlay=$('dmMiniAdminOverlay');
    if(!overlay||overlay.hidden)return;
    overlay.hidden=true;
    document.body.style.overflow=document.body.dataset.dmMiniOverflow||'';
    delete document.body.dataset.dmMiniOverflow;
    $('miniAdminBtn')?.focus();
  }

  function openRequestedPanel(){
    if(location.hash==='#mini-panel'&&isOwnerDashboardOpen())openPanel();
  }

  function switchTab(name){
    document.querySelectorAll('[data-dm-mini-tab]').forEach(button=>{
      const active=button.dataset.dmMiniTab===name;
      button.classList.toggle('is-active',active);
      button.setAttribute('aria-selected',String(active));
    });
    document.querySelectorAll('.dm-mini-panel').forEach(panel=>{
      panel.hidden=panel.dataset.dmMiniPanel!==name;
    });
    const admin=$('dmMiniAdmin');
    admin?.classList.toggle('dm-mini-message-mode',name==='message');
    const stateEl=document.querySelector('.dm-mini-state');
    if(stateEl){
      stateEl.innerHTML='<i></i>'+(name==='message'?' LIVE':' MOCK');
      stateEl.classList.toggle('is-live',name==='message');
    }
    if(name==='message')requestAnimationFrame(()=>$('dmMiniMessageText')?.focus({preventScroll:true}));
  }

  function updateMessagePreview(){
    const input=$('dmMiniMessageText');
    const preview=$('dmMiniAbuseText');
    const count=$('dmMiniAbuseCount');
    if(preview){
      const value=String(input?.value||'').trim();
      preview.textContent=value||'Type your announcement…';
      preview.classList.toggle('is-empty',!value);
    }
    if(count)count.textContent=`${String(input?.value||'').length} / 160`;
  }

  function simplifyMessagePanel(){
    const title=$('dmMiniMessageTitle');
    title?.closest('label')?.remove();
    document.querySelector('.dm-mini-preview')?.remove();
    const panel=document.querySelector('[data-dm-mini-panel="message"]');
    const heading=panel?.querySelector('.dm-mini-heading');
    if(heading){
      const badge=heading.querySelector('span');
      const h2=heading.querySelector('h2');
      const p=heading.querySelector('p');
      if(badge)badge.textContent='ADMIN ABUSE';
      if(h2)h2.textContent='Screen message';
      if(p)p.textContent='Type it live. Everyone on the site sees the same big announcement.';
    }

    const oldPreview=$('dmMiniAbusePreview');
    oldPreview?.remove();
    if(panel&&heading){
      const preview=document.createElement('div');
      preview.id='dmMiniAbusePreview';
      preview.className='dm-mini-abuse-preview';
      preview.innerHTML='<div class="dm-mini-abuse-line"><span class="dm-mini-abuse-name">Damiøn <i>✓</i><em>:</em></span><span id="dmMiniAbuseText" class="dm-mini-abuse-text is-empty">Type your announcement…</span></div>';
      heading.insertAdjacentElement('afterend',preview);
    }

    const text=$('dmMiniMessageText');
    if(text){
      text.maxLength=160;
      text.rows=3;
      text.placeholder='Type the message everyone should see…';
      text.setAttribute('aria-label','Admin abuse screen message');
    }
    const form=$('dmMiniMessageForm');
    const button=form?.querySelector('button[type="submit"]');
    if(button)button.textContent='SEND TO EVERYONE';
    if(form&&!$('dmMiniAbuseMeta')){
      const meta=document.createElement('div');
      meta.id='dmMiniAbuseMeta';
      meta.className='dm-mini-abuse-meta';
      meta.innerHTML='<span>LIVE BROADCAST</span><span id="dmMiniAbuseCount">0 / 160</span><small>Ctrl + Enter to send</small>';
      if(button)form.insertBefore(meta,button);else form.appendChild(meta);
    }
    updateMessagePreview();
  }

  function saveGrant(customer,service,packageName){
    const entry={customer:clean(customer,80),service:clean(service,80),packageName:clean(packageName,60)};
    if(!entry.customer||!entry.service)return false;
    state.grants.unshift(entry);
    state.grants=state.grants.slice(0,20);
    if($('dmMiniLastGrant'))$('dmMiniLastGrant').textContent=`${entry.service} (${entry.packageName}) → ${entry.customer}`;
    addActivity('Mock service saved',`${entry.service} for ${entry.customer}`);
    showToast('Saved locally — not granted live.');
    return true;
  }

  async function publishMessage(message){
    const text=clean(message,160);
    if(!text)return false;
    const session=ownerSession();
    if(!session){showToast('Owner session required.');return false}
    try{
      const response=await fetch(BROADCAST_API,{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'broadcast_send',ownerSession:session,message:text})});
      const data=await response.json().catch(()=>({}));
      if(!response.ok)throw new Error(data?.error||'Could not send message');
      state.messages.unshift({title:'Live broadcast',message:text});
      state.messages=state.messages.slice(0,20);
      addActivity('Broadcast sent',text);
      showToast('Sent to everyone online.');
      return true;
    }catch(error){
      showToast(error?.message||'Could not send message.');
      return false;
    }
  }

  function saveExtra(customer,type,value){
    const entry={customer:clean(customer,80),type:clean(type,80),value:clean(value,80)};
    if(!entry.customer||!entry.type||!entry.value)return false;
    state.extras.unshift(entry);
    state.extras=state.extras.slice(0,20);
    if($('dmMiniLastExtra'))$('dmMiniLastExtra').textContent=`${entry.type}: ${entry.value} → ${entry.customer}`;
    addActivity('Mock extra saved',`${entry.type} for ${entry.customer}`);
    showToast('Saved locally — no order changed.');
    return true;
  }

  async function runCommand(){
    const input=$('dmMiniCommand');
    const command=clean(input?.value,180);
    if(!command)return;
    const [action,...parts]=command.split(/\s+/);
    const value=parts.join(' ');
    let worked=false;
    if(action.toLowerCase()==='say'&&value){
      worked=await publishMessage(value);
      if(worked){
        if($('dmMiniMessageText'))$('dmMiniMessageText').value='';
        updateMessagePreview();
        switchTab('message');
      }
    }else if(action.toLowerCase()==='give'&&parts.length>=2){
      worked=saveGrant(parts[0],parts.slice(1).join(' '),'Command mock');
      if(worked)switchTab('give');
    }else if(action.toLowerCase()==='extra'&&parts.length>=3){
      worked=saveExtra(parts[0],parts[1],parts.slice(2).join(' '));
      if(worked)switchTab('extras');
    }
    if(!worked&&action.toLowerCase()!=='say')showToast('Try: say ..., give email service, or extra email type value');
    if(input)input.value='';
  }

  function enableDrag(){
    const handle=$('dmMiniDrag');
    const panel=$('dmMiniAdmin');
    if(!handle||!panel)return;
    let drag=null;
    handle.addEventListener('pointerdown',event=>{
      if(window.innerWidth<701||event.target.closest('button'))return;
      const rect=panel.getBoundingClientRect();
      drag={x:event.clientX-rect.left,y:event.clientY-rect.top};
      panel.style.position='fixed';
      panel.style.margin='0';
      handle.setPointerCapture(event.pointerId);
    });
    handle.addEventListener('pointermove',event=>{
      if(!drag)return;
      const maxX=Math.max(8,window.innerWidth-panel.offsetWidth-8);
      const maxY=Math.max(8,window.innerHeight-panel.offsetHeight-8);
      panel.style.left=`${Math.min(maxX,Math.max(8,event.clientX-drag.x))}px`;
      panel.style.top=`${Math.min(maxY,Math.max(8,event.clientY-drag.y))}px`;
    });
    const stop=()=>{drag=null;};
    handle.addEventListener('pointerup',stop);
    handle.addEventListener('pointercancel',stop);
  }

  function init(){
    simplifyMessagePanel();
    $('miniAdminBtn')?.addEventListener('click',openPanel);
    window.addEventListener('dm-owner-ready',openRequestedPanel);
    $('dmMiniClose')?.addEventListener('click',closePanel);
    $('dmMiniScreenMessage')?.remove();
    $('dmMiniMinimize')?.addEventListener('click',()=>$('dmMiniAdmin')?.classList.toggle('is-minimized'));
    $('dmMiniAdminOverlay')?.addEventListener('click',event=>{if(event.target.id==='dmMiniAdminOverlay')closePanel();});
    document.querySelectorAll('[data-dm-mini-tab]').forEach(button=>button.addEventListener('click',()=>switchTab(button.dataset.dmMiniTab)));
    $('dmMiniGiveForm')?.addEventListener('submit',event=>{
      event.preventDefault();
      if(saveGrant($('dmMiniGiveCustomer')?.value,$('dmMiniGiveService')?.value,$('dmMiniGivePackage')?.value))event.currentTarget.reset();
    });
    const messageInput=$('dmMiniMessageText');
    messageInput?.addEventListener('input',updateMessagePreview);
    messageInput?.addEventListener('keydown',event=>{
      if((event.ctrlKey||event.metaKey)&&event.key==='Enter'){
        event.preventDefault();
        $('dmMiniMessageForm')?.requestSubmit();
      }
    });
    $('dmMiniMessageForm')?.addEventListener('submit',async event=>{
      event.preventDefault();
      const button=event.currentTarget.querySelector('button[type="submit"]');
      if(button)button.disabled=true;
      const worked=await publishMessage($('dmMiniMessageText')?.value);
      if(worked){event.currentTarget.reset();updateMessagePreview();$('dmMiniMessageText')?.focus({preventScroll:true})}
      if(button)button.disabled=false;
    });
    $('dmMiniExtraForm')?.addEventListener('submit',event=>{
      event.preventDefault();
      if(saveExtra($('dmMiniExtraCustomer')?.value,$('dmMiniExtraType')?.value,$('dmMiniExtraValue')?.value))event.currentTarget.reset();
    });
    $('dmMiniRun')?.addEventListener('click',runCommand);
    $('dmMiniCommand')?.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();runCommand()}});
    document.addEventListener('keydown',event=>{
      if(event.key==='Escape'&&!$('dmMiniAdminOverlay')?.hidden)closePanel();
    });
    enableDrag();
    render();
    updateMessagePreview();
    setTimeout(openRequestedPanel,0);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();