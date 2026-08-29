(()=>{
  'use strict';

  const STORAGE_KEY='damion_admin_studio_sandbox_v1';
  const $=(selector,root=document)=>root.querySelector(selector);
  const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
  const emptyState=message=>`<div class="empty-state">${escapeHtml(message)}</div>`;
  const now=()=>new Date().toISOString();
  const makeId=prefix=>`${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`;
  const escapeHtml=value=>String(value??'').replace(/[&<>"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[char]));
  const safeLink=value=>{
    const raw=String(value||'').trim();
    if(raw.startsWith('/')&&!raw.startsWith('//'))return raw;
    try{const url=new URL(raw);return /^https?:$/.test(url.protocol)?url.href:'#'}catch{return '#'}
  };
  const formatTime=value=>new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit'}).format(new Date(value));
  const plural=(count,one,many)=>`${count} ${count===1?one:many}`;

  const blankState=()=>({grants:[],announcements:[],extras:[],activity:[]});
  const loadState=()=>{
    try{
      const parsed=JSON.parse(sessionStorage.getItem(STORAGE_KEY)||'null');
      return parsed&&Array.isArray(parsed.grants)&&Array.isArray(parsed.announcements)&&Array.isArray(parsed.extras)&&Array.isArray(parsed.activity)?parsed:blankState();
    }catch{return blankState()}
  };
  let state=loadState();
  let toastTimer=0;

  const save=()=>{
    sessionStorage.setItem(STORAGE_KEY,JSON.stringify(state));
    renderAll();
  };
  const showToast=message=>{
    const toast=$('#toast');
    toast.textContent=message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>toast.classList.remove('is-visible'),2400);
  };
  const logActivity=(title,detail)=>{
    state.activity.unshift({id:makeId('activity'),title,detail,createdAt:now()});
    state.activity=state.activity.slice(0,20);
  };

  const switchPanel=id=>{
    $$('.panel').forEach(panel=>{
      const active=panel.id===id;
      panel.hidden=!active;
      panel.classList.toggle('is-active',active);
    });
    $$('.nav-item').forEach(button=>{
      const active=button.dataset.panelTarget===id;
      button.classList.toggle('is-active',active);
      if(active)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');
    });
    $('#workspace').focus({preventScroll:true});
    window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  };

  const renderStats=()=>{
    $('#grantCount').textContent=state.grants.length;
    $('#announcementCount').textContent=state.announcements.length;
    $('#extraCount').textContent=state.extras.length;
    $('#grantListCount').textContent=plural(state.grants.length,'record','records');
    $('#announcementListCount').textContent=plural(state.announcements.length,'draft','drafts');
    $('#extraListCount').textContent=plural(state.extras.length,'record','records');
  };

  const renderActivity=()=>{
    const host=$('#activityList');
    if(!state.activity.length){host.innerHTML=emptyState('No mock activity yet. Try one of the quick actions.');return}
    host.innerHTML=state.activity.slice(0,6).map(item=>`
      <article class="activity-item">
        <i></i>
        <div><b>${escapeHtml(item.title)}</b><p>${escapeHtml(item.detail)}</p></div>
        <time datetime="${escapeHtml(item.createdAt)}">${formatTime(item.createdAt)}</time>
      </article>`).join('');
  };

  const renderGrants=()=>{
    const host=$('#grantList');
    if(!state.grants.length){host.innerHTML=emptyState('No mock service grants. Create one above to test the workflow.');return}
    host.innerHTML=state.grants.map(item=>`
      <article class="record-row">
        <div class="record-main"><b>${escapeHtml(item.customerName)}</b><small>${escapeHtml(item.customerEmail)}</small></div>
        <div class="record-meta"><b>${escapeHtml(item.service)}</b><small>${escapeHtml(item.package)} · ${escapeHtml(item.expires)}</small></div>
        <span class="record-tag">${escapeHtml(item.status)}</span>
        <button class="record-remove" type="button" data-remove="grant" data-id="${escapeHtml(item.id)}" aria-label="Remove mock grant for ${escapeHtml(item.customerName)}">×</button>
      </article>`).join('');
  };

  const renderAnnouncements=()=>{
    const host=$('#announcementList');
    if(!state.announcements.length){host.innerHTML=emptyState('No saved mock announcements. Your drafts will appear here.');return}
    host.innerHTML=state.announcements.map(item=>`
      <article class="record-row">
        <div class="record-main"><b>${escapeHtml(item.headline)}</b><small>${escapeHtml(item.message.slice(0,110))}${item.message.length>110?'…':''}</small></div>
        <div class="record-meta"><b>${escapeHtml(item.audience)}</b><small>${escapeHtml(item.label)} · ${formatTime(item.createdAt)}</small></div>
        <span class="record-tag">Draft only</span>
        <button class="record-remove" type="button" data-remove="announcement" data-id="${escapeHtml(item.id)}" aria-label="Remove draft ${escapeHtml(item.headline)}">×</button>
      </article>`).join('');
  };

  const renderExtras=()=>{
    const host=$('#extraList');
    if(!state.extras.length){host.innerHTML=emptyState('No mock extras. Add one above to see how the record could look.');return}
    host.innerHTML=state.extras.map(item=>`
      <article class="record-row">
        <div class="record-main"><b>${escapeHtml(item.customer)}</b><small>${escapeHtml(item.reason||'No internal reason added')}</small></div>
        <div class="record-meta"><b>${escapeHtml(item.type)}</b><small>${escapeHtml(item.value)}</small></div>
        <span class="record-tag">Mock extra</span>
        <button class="record-remove" type="button" data-remove="extra" data-id="${escapeHtml(item.id)}" aria-label="Remove mock extra for ${escapeHtml(item.customer)}">×</button>
      </article>`).join('');
  };

  const renderAll=()=>{
    renderStats();
    renderActivity();
    renderGrants();
    renderAnnouncements();
    renderExtras();
  };

  const updateGrantPreview=()=>{
    const form=$('#grantForm');
    const data=new FormData(form);
    $('#grantPreviewTitle').textContent=data.get('service')||'Choose a service';
    $('#grantPreviewCustomer').textContent=data.get('customerName')?`Prepared for ${data.get('customerName')}.`:'Customer name will appear here.';
    $('#grantPreviewPackage').textContent=data.get('package')||'—';
    $('#grantPreviewExpires').textContent=data.get('expires')||'Never';
    $('.preview-status').textContent=data.get('status')||'Ready to use';
  };

  const updateAnnouncementPreview=()=>{
    const form=$('#announcementForm');
    const data=new FormData(form);
    const message=String(data.get('message')||'');
    $('#previewLabel').textContent=data.get('label')||'Studio update';
    $('#announcementPreviewHeading').textContent=data.get('headline')||'Your headline';
    $('#previewMessage').textContent=message||'Your message preview will appear here.';
    $('#previewButton').textContent=`${data.get('buttonText')||'Learn more'} →`;
    $('#previewButton').href=safeLink(data.get('buttonLink'));
    $('#messageCount').textContent=message.length;
    const preview=$('#announcementPreview');
    preview.classList.remove('is-studio','is-minimal','is-success');
    preview.classList.add(`is-${data.get('style')||'studio'}`);
  };

  $$('.nav-item').forEach(button=>button.addEventListener('click',()=>switchPanel(button.dataset.panelTarget)));
  $$('[data-go]').forEach(button=>button.addEventListener('click',()=>switchPanel(button.dataset.go)));

  $('#grantForm').addEventListener('input',updateGrantPreview);
  $('#grantForm').addEventListener('submit',event=>{
    event.preventDefault();
    const data=new FormData(event.currentTarget);
    const grant={
      id:makeId('grant'),customerName:String(data.get('customerName')).trim(),customerEmail:String(data.get('customerEmail')).trim(),service:String(data.get('service')),package:String(data.get('package')),expires:String(data.get('expires')),status:String(data.get('status')),note:String(data.get('note')).trim(),createdAt:now()
    };
    state.grants.unshift(grant);
    logActivity('Mock service granted',`${grant.service} · ${grant.package} for ${grant.customerName}`);
    save();
    event.currentTarget.reset();
    updateGrantPreview();
    showToast('Mock grant saved — no live changes made.');
  });

  $('#announcementForm').addEventListener('input',updateAnnouncementPreview);
  $('#announcementForm').addEventListener('submit',event=>{
    event.preventDefault();
    const data=new FormData(event.currentTarget);
    const announcement={
      id:makeId('announcement'),label:String(data.get('label')).trim(),headline:String(data.get('headline')).trim(),message:String(data.get('message')).trim(),audience:String(data.get('audience')),style:String(data.get('style')),buttonText:String(data.get('buttonText')).trim(),buttonLink:safeLink(data.get('buttonLink')),createdAt:now()
    };
    state.announcements.unshift(announcement);
    logActivity('Mock announcement saved',`${announcement.headline} · ${announcement.audience}`);
    save();
    showToast('Draft saved locally — nothing was published.');
  });

  $('#previewButton').addEventListener('click',event=>event.preventDefault());

  $('#extraForm').addEventListener('submit',event=>{
    event.preventDefault();
    const data=new FormData(event.currentTarget);
    const extra={id:makeId('extra'),customer:String(data.get('customer')).trim(),type:String(data.get('type')),value:String(data.get('value')).trim(),reason:String(data.get('reason')).trim(),createdAt:now()};
    state.extras.unshift(extra);
    logActivity('Mock customer extra saved',`${extra.type} for ${extra.customer}`);
    save();
    event.currentTarget.reset();
    showToast('Mock extra saved — no customer account changed.');
  });

  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-remove]');
    if(!button)return;
    const collection={grant:'grants',announcement:'announcements',extra:'extras'}[button.dataset.remove];
    if(!collection)return;
    state[collection]=state[collection].filter(item=>item.id!==button.dataset.id);
    logActivity('Mock record removed',`Removed from ${collection}.`);
    save();
    showToast('Mock record removed.');
  });

  $('#resetButton').addEventListener('click',()=>{
    if(!confirm('Reset all mock grants, messages, extras and activity from this browser session?'))return;
    state=blankState();
    sessionStorage.removeItem(STORAGE_KEY);
    renderAll();
    showToast('Sandbox reset.');
  });

  $('#exportButton').addEventListener('click',()=>{
    const payload={exportedAt:now(),mode:'sandbox',warning:'Contains mock data only. Do not import into production.',...state};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const link=document.createElement('a');
    link.href=url;
    link.download=`damion-admin-sandbox-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast('Mock data exported.');
  });

  $('#sessionDate').textContent=new Intl.DateTimeFormat('en-GB',{dateStyle:'medium',timeStyle:'short'}).format(new Date());
  updateGrantPreview();
  updateAnnouncementPreview();
  renderAll();
})();

