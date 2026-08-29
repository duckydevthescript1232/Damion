(()=>{
  if(window.__dmOwnerAccess)return;window.__dmOwnerAccess=true;
  const API='https://wutlhceqkioshepfbykf.supabase.co/functions/v1/damion-orders';
  const ANON='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dGxoY2Vxa2lvc2hlcGZieWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMDAxMDUsImV4cCI6MjEwMTU3NjEwNX0.Ad9wROEhZ2uKxKx9H5AHqCCmFa0nTezrBHkAn-Zwyws';
  const SESSION_KEY='dm_admin_key';
  const SAVED_KEY='dm_admin_key_saved';
  const getKey=()=>{let k='';try{k=sessionStorage.getItem(SESSION_KEY)||''}catch(_){}if(!k){try{k=localStorage.getItem(SAVED_KEY)||''}catch(_){}}return k};
  const saveKey=k=>{try{sessionStorage.setItem(SESSION_KEY,k)}catch(_){}try{localStorage.setItem(SAVED_KEY,k)}catch(_){}};
  const clearKey=()=>{try{sessionStorage.removeItem(SESSION_KEY)}catch(_){}try{localStorage.removeItem(SAVED_KEY)}catch(_){}};

  const style=document.createElement('style');style.textContent=`
    .dm-owner-btn{font-size:11px!important;padding-inline:11px!important;opacity:.82}.dm-owner-btn:hover{opacity:1}.dm-owner-menu-wrap{margin-top:16px;padding-top:14px;border-top:1px solid rgba(255,255,255,.07)}.dm-owner-menu-btn{width:100%;min-height:44px;border:1px solid rgba(255,255,255,.08);border-radius:11px;background:#121417;color:#d9dce1;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 12px;cursor:pointer;font:800 11px/1.2 Inter,system-ui}.dm-owner-menu-btn:hover{border-color:rgba(239,79,95,.28);background:#17191d}.dm-owner-menu-btn small{color:#777c84;font-size:9px;font-weight:700}
    .dm-owner-modal-bg{position:fixed;inset:0;z-index:1900;background:rgba(0,0,0,.68);backdrop-filter:blur(8px);display:grid;place-items:center;padding:18px;opacity:0;pointer-events:none;transition:opacity .18s ease}.dm-owner-modal-bg.open{opacity:1;pointer-events:auto}.dm-owner-modal{width:min(390px,100%);border:1px solid rgba(255,255,255,.11);border-radius:18px;background:linear-gradient(180deg,#141519,#0d0e11);box-shadow:0 28px 80px rgba(0,0,0,.58);padding:20px;color:#fff;transform:translateY(8px) scale(.985);transition:transform .2s cubic-bezier(.22,1,.36,1)}.dm-owner-modal-bg.open .dm-owner-modal{transform:none}.dm-owner-modal-head{display:flex;justify-content:space-between;gap:14px;align-items:start}.dm-owner-modal h3{margin:0;font-size:22px}.dm-owner-modal p{margin:7px 0 16px;color:#92969d;font-size:12px;line-height:1.5}.dm-owner-close{width:34px;height:34px;border-radius:9px;border:1px solid rgba(255,255,255,.1);background:#191a1e;color:#fff;cursor:pointer;font-size:19px}.dm-owner-form{display:grid;gap:10px}.dm-owner-form input{width:100%;min-height:46px;border:1px solid rgba(255,255,255,.1);border-radius:10px;background:#17191c;color:#fff;padding:0 12px;font:inherit;outline:none}.dm-owner-form input:focus{border-color:rgba(236,67,91,.45);box-shadow:0 0 0 3px rgba(236,67,91,.07)}.dm-owner-status{min-height:17px;color:#8f939a;font-size:11px}.dm-owner-status.error{color:#ff899a}.dm-owner-hint{margin-top:12px;color:#6f747c;font-size:10px;line-height:1.45}@media(max-width:760px){.dm-owner-btn{display:none!important}}
  `;document.head.appendChild(style);

  const act=()=>{if(getKey())location.href='/admin-orders';else openModal()};
  function addButton(){
    if(!document.querySelector('.dm-owner-btn')){const nav=document.querySelector('.nav-actions');if(nav){const btn=document.createElement('button');btn.type='button';btn.className='btn dm-owner-btn';btn.textContent=getKey()?'Admin':'Owner login';btn.addEventListener('click',act);nav.prepend(btn)}}
    if(!document.querySelector('.dm-owner-menu-wrap')){const body=document.querySelector('.dm-side-body');if(body){const wrap=document.createElement('div');wrap.className='dm-owner-menu-wrap';wrap.innerHTML=`<button class="dm-owner-menu-btn" type="button"><span>${getKey()?'Open admin dashboard':'Owner login'}</span><small>${getKey()?'Private':'Admin only'}</small></button>`;wrap.querySelector('button').addEventListener('click',act);body.appendChild(wrap)}}
  }

  let bg=null;
  function openModal(){
    if(!bg){
      bg=document.createElement('div');bg.className='dm-owner-modal-bg';bg.innerHTML=`<section class="dm-owner-modal" role="dialog" aria-modal="true" aria-label="Owner login"><div class="dm-owner-modal-head"><div><h3>Owner login</h3><p>Use the same private admin key as your existing dashboard.</p></div><button class="dm-owner-close" type="button" aria-label="Close">×</button></div><form class="dm-owner-form"><input name="key" type="password" autocomplete="off" placeholder="Admin key" required><button class="btn primary" type="submit">Log in</button><div class="dm-owner-status" aria-live="polite"></div></form><div class="dm-owner-hint">After login, this browser can see your private Who’s online GUI and support/admin dashboard.</div></section>`;document.body.appendChild(bg);
      const close=()=>bg.classList.remove('open');bg.addEventListener('pointerdown',e=>{if(e.target===bg)close()});bg.querySelector('.dm-owner-close').addEventListener('click',close);document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
      const form=bg.querySelector('form'),status=bg.querySelector('.dm-owner-status');form.addEventListener('submit',async e=>{e.preventDefault();const key=String(form.elements.key.value||'').trim();if(!key)return;const submit=form.querySelector('button[type="submit"]');submit.disabled=true;status.className='dm-owner-status';status.textContent='Checking…';try{const r=await fetch(API,{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json','apikey':ANON,'Authorization':`Bearer ${ANON}`},body:JSON.stringify({action:'admin_list',adminKey:key})});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'Admin key is incorrect');saveKey(key);status.textContent='Owner access enabled.';setTimeout(()=>location.reload(),220)}catch(err){clearKey();status.className='dm-owner-status error';status.textContent=err.message||'Could not log in'}finally{submit.disabled=false}});
    }
    bg.classList.add('open');setTimeout(()=>bg.querySelector('input')?.focus({preventScroll:true}),80);
  }

  const start=()=>{addButton();setTimeout(addButton,250)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
