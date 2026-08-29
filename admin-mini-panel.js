(function(){
  'use strict';

  const STORAGE_KEY='dm_admin_mini_live_ui_v1';
  const $=id=>document.getElementById(id);
  const initialState={grants:[],messages:[],extras:[],activity:[]};
  let state=loadState();
  let toastTimer;
  let screenMessageTimer;

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

  function showScreenMessage(message){
    const banner=$('dmMiniScreenMessage');
    const copy=$('dmMiniScreenMessageText');
    if(!banner||!copy)return;
    copy.textContent=clean(message,240);
    banner.classList.add('show');
    clearTimeout(screenMessageTimer);
    screenMessageTimer=setTimeout(()=>banner.classList.remove('show'),6500);
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
      empty.textContent='Your local mock actions will appear here. Nothing is published or sent.';
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

  function switchTab(name){
    document.querySelectorAll('[data-dm-mini-tab]').forEach(button=>{
      const active=button.dataset.dmMiniTab===name;
      button.classList.toggle('is-active',active);
      button.setAttribute('aria-selected',String(active));
    });
    document.querySelectorAll('.dm-mini-panel').forEach(panel=>{
      panel.hidden=panel.dataset.dmMiniPanel!==name;
    });
  }

  function updateMessagePreview(){
    const title=clean($('dmMiniMessageTitle')?.value,70)||'Your announcement title';
    const text=clean($('dmMiniMessageText')?.value,240)||'Write a short message for your visitors.';
    if($('dmMiniPreviewTitle'))$('dmMiniPreviewTitle').textContent=title;
    if($('dmMiniPreviewText'))$('dmMiniPreviewText').textContent=text;
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

  function saveMessage(title,message){
    const entry={title:clean(title,70),message:clean(message,240)};
    if(!entry.title||!entry.message)return false;
    state.messages.unshift(entry);
    state.messages=state.messages.slice(0,20);
    addActivity('Mock message saved',entry.title);
    showScreenMessage(entry.message);
    showToast('Saved locally — not published live.');
    return true;
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

  function runCommand(){
    const input=$('dmMiniCommand');
    const command=clean(input?.value,180);
    if(!command)return;
    const [action,...parts]=command.split(/\s+/);
    const value=parts.join(' ');
    let worked=false;
    if(action.toLowerCase()==='say'&&value){
      worked=saveMessage(value,value);
      if(worked){
        if($('dmMiniMessageTitle'))$('dmMiniMessageTitle').value=value;
        if($('dmMiniMessageText'))$('dmMiniMessageText').value=value;
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
    if(!worked)showToast('Try: say ..., give email service, or extra email type value');
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
    $('miniAdminBtn')?.addEventListener('click',openPanel);
    $('dmMiniClose')?.addEventListener('click',closePanel);
    $('dmMiniScreenMessageClose')?.addEventListener('click',()=>$('dmMiniScreenMessage')?.classList.remove('show'));
    $('dmMiniMinimize')?.addEventListener('click',()=>$('dmMiniAdmin')?.classList.toggle('is-minimized'));
    $('dmMiniAdminOverlay')?.addEventListener('click',event=>{if(event.target.id==='dmMiniAdminOverlay')closePanel();});
    document.querySelectorAll('[data-dm-mini-tab]').forEach(button=>button.addEventListener('click',()=>switchTab(button.dataset.dmMiniTab)));
    $('dmMiniMessageTitle')?.addEventListener('input',updateMessagePreview);
    $('dmMiniMessageText')?.addEventListener('input',updateMessagePreview);
    $('dmMiniGiveForm')?.addEventListener('submit',event=>{
      event.preventDefault();
      if(saveGrant($('dmMiniGiveCustomer')?.value,$('dmMiniGiveService')?.value,$('dmMiniGivePackage')?.value))event.currentTarget.reset();
    });
    $('dmMiniMessageForm')?.addEventListener('submit',event=>{
      event.preventDefault();
      if(saveMessage($('dmMiniMessageTitle')?.value,$('dmMiniMessageText')?.value))event.currentTarget.reset();
      updateMessagePreview();
    });
    $('dmMiniExtraForm')?.addEventListener('submit',event=>{
      event.preventDefault();
      if(saveExtra($('dmMiniExtraCustomer')?.value,$('dmMiniExtraType')?.value,$('dmMiniExtraValue')?.value))event.currentTarget.reset();
    });
    $('dmMiniRun')?.addEventListener('click',runCommand);
    $('dmMiniCommand')?.addEventListener('keydown',event=>{if(event.key==='Enter')runCommand();});
    document.addEventListener('keydown',event=>{
      if(event.key==='Escape'&&!$('dmMiniAdminOverlay')?.hidden)closePanel();
    });
    enableDrag();
    updateMessagePreview();
    render();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();

