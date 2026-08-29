(()=>{
  'use strict';
  const KEY='dm_mini_admin_sandbox_v2';
  const $=(selector,root=document)=>root.querySelector(selector);
  const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
  const clean=value=>String(value||'').trim();
  const blank=()=>({grants:[],messages:[],extras:[],activity:[]});
  const load=()=>{try{const data=JSON.parse(sessionStorage.getItem(KEY)||'null');return data&&data.activity?data:blank()}catch{return blank()}};
  let state=load();
  let toastTimer=0;

  const save=()=>{sessionStorage.setItem(KEY,JSON.stringify(state));render()};
  const log=(title,detail)=>{state.activity.unshift({title,detail,time:new Date().toISOString()});state.activity=state.activity.slice(0,8)};
  const toast=message=>{const node=$('#toast');node.textContent=message;node.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>node.classList.remove('show'),1800)};
  const time=value=>new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit'}).format(new Date(value));
  const escapeHtml=value=>String(value).replace(/[&<>"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[char]));

  const openTab=id=>{
    $$('.tab-panel').forEach(panel=>{const active=panel.id===`tab-${id}`;panel.hidden=!active;panel.classList.toggle('is-active',active)});
    $$('.mini-tab').forEach(button=>{const active=button.dataset.tab===id;button.classList.toggle('is-active',active);active?button.setAttribute('aria-current','page'):button.removeAttribute('aria-current')});
  };

  const render=()=>{
    $('#grantCount').textContent=state.grants.length;
    $('#messageCount').textContent=state.messages.length;
    $('#extraCount').textContent=state.extras.length;
    const host=$('#activityList');
    host.innerHTML=state.activity.length?state.activity.slice(0,5).map(item=>`<div class="activity-row"><i></i><div><b>${escapeHtml(item.title)}</b><p>${escapeHtml(item.detail)}</p></div><time>${time(item.time)}</time></div>`).join(''):'<div class="empty">No mock actions yet.<br>Use Give, Message or Extras.</div>';
  };

  $$('.mini-tab').forEach(button=>button.addEventListener('click',()=>openTab(button.dataset.tab)));

  $('#giveForm').addEventListener('submit',event=>{
    event.preventDefault();
    const data=new FormData(event.currentTarget);
    const grant={customer:clean(data.get('customer')),service:clean(data.get('service')),package:clean(data.get('package'))};
    state.grants.unshift(grant);log('Service given',`${grant.service} · ${grant.package} → ${grant.customer}`);save();
    $('#lastGrant').textContent=`${grant.service} (${grant.package}) → ${grant.customer}`;
    event.currentTarget.reset();toast('Mock service granted');
  });

  const updateMessagePreview=()=>{const form=$('#messageForm');const data=new FormData(form);$('#previewTitle').textContent=clean(data.get('title'))||'Your title';$('#previewText').textContent=clean(data.get('text'))||'Your message'};
  $('#messageForm').addEventListener('input',updateMessagePreview);
  $('#messageForm').addEventListener('submit',event=>{
    event.preventDefault();const data=new FormData(event.currentTarget);const message={title:clean(data.get('title')),text:clean(data.get('text'))};
    state.messages.unshift(message);log('Message saved',message.title);save();toast('Mock message saved');
  });

  $('#extraForm').addEventListener('submit',event=>{
    event.preventDefault();const data=new FormData(event.currentTarget);const extra={customer:clean(data.get('customer')),type:clean(data.get('type')),value:clean(data.get('value'))};
    state.extras.unshift(extra);log('Extra added',`${extra.type} → ${extra.customer}`);save();
    $('#lastExtra').textContent=`${extra.type}: ${extra.value} → ${extra.customer}`;
    event.currentTarget.reset();toast('Mock extra added');
  });

  const runCommand=()=>{
    const input=$('#commandInput');const command=clean(input.value);if(!command)return;
    const [name,...rest]=command.split(/\s+/);const value=rest.join(' ');
    if(name.toLowerCase()==='say'&&value){$('#messageForm [name="title"]').value=value;updateMessagePreview();openTab('message');toast('Message preview updated')}
    else if(name.toLowerCase()==='give'&&value){openTab('give');$('#giveForm [name="customer"]').value=value;toast('Customer filled in')}
    else if(name.toLowerCase()==='extra'&&value){openTab('extras');$('#extraForm [name="customer"]').value=value;toast('Customer filled in')}
    else toast('Try: say Hi guys');
    input.value='';
  };
  $('#runCommand').addEventListener('click',runCommand);
  $('#commandInput').addEventListener('keydown',event=>{if(event.key==='Enter')runCommand()});

  const windowNode=$('#adminWindow');const launcher=$('#launcher');
  $('#minimizeButton').addEventListener('click',()=>{windowNode.classList.toggle('is-minimized');$('#minimizeButton').textContent=windowNode.classList.contains('is-minimized')?'+':'−'});
  $('#closeButton').addEventListener('click',()=>{windowNode.classList.add('is-closed');setTimeout(()=>launcher.hidden=false,160)});
  launcher.addEventListener('click',()=>{launcher.hidden=true;windowNode.classList.remove('is-closed','is-minimized');$('#minimizeButton').textContent='−'});

  let dragging=false,startX=0,startY=0,offsetX=0,offsetY=0,baseX=0,baseY=0,startRect=null;
  const handle=$('#dragHandle');
  handle.addEventListener('pointerdown',event=>{
    if(event.target.closest('button')||innerWidth<701)return;
    dragging=true;startX=event.clientX;startY=event.clientY;baseX=offsetX;baseY=offsetY;startRect=windowNode.getBoundingClientRect();handle.setPointerCapture(event.pointerId);
  });
  handle.addEventListener('pointermove',event=>{
    if(!dragging)return;
    const dx=event.clientX-startX,dy=event.clientY-startY;
    const minDx=10-startRect.left,maxDx=innerWidth-10-startRect.right,minDy=10-startRect.top,maxDy=innerHeight-10-startRect.bottom;
    offsetX=baseX+Math.max(minDx,Math.min(maxDx,dx));offsetY=baseY+Math.max(minDy,Math.min(maxDy,dy));
    windowNode.style.transform=`translate3d(${offsetX}px,${offsetY}px,0)`;
  });
  const stopDrag=()=>{dragging=false};handle.addEventListener('pointerup',stopDrag);handle.addEventListener('pointercancel',stopDrag);
  addEventListener('resize',()=>{if(innerWidth<701){offsetX=offsetY=0;windowNode.style.transform=''}});

  updateMessagePreview();render();
})();

