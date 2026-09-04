(()=>{
  if(window.__dmAccountV4)return;
  window.__dmAccountV4=true;window.__dmAccountV3=true;window.__dmAccountV2=true;window.__dmAccountV1=true;

  const AUTH_API='https://wutlhceqkioshepfbykf.supabase.co/functions/v1/damion-site-auth';
  const CUSTOMER_KEY='damion_customer_session';
  const OWNER_KEY='damion_site_session';
  const AFTER_AUTH_KEY='dm_after_auth';
  const ADMIN_PATH='/admin-orders.html';
  let customer=null,owner=false,stateBusy=false;

  const read=k=>{try{return localStorage.getItem(k)||''}catch(_){return''}};
  const write=(k,v)=>{try{if(v)localStorage.setItem(k,v);else localStorage.removeItem(k)}catch(_){}};
  const clean=v=>String(v||'').trim();
  const readSession=k=>{try{return sessionStorage.getItem(k)||''}catch(_){return''}};
  const writeSession=(k,v)=>{try{if(v)sessionStorage.setItem(k,v);else sessionStorage.removeItem(k)}catch(_){}};
  const authApi=async(action,extra={})=>{
    const r=await fetch(AUTH_API,{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,...extra})});
    const d=await r.json().catch(()=>({}));
    if(!r.ok)throw new Error(d?.error||`Request failed (${r.status})`);
    return d;
  };
  const isAdminPage=()=>/^\/admin-orders(?:\.html)?\/?$/.test(location.pathname);
  const removeOldUI=()=>document.querySelectorAll('#dmAccountOpen,#dmAccountActions,#dmAccountFallback,#dmAccountSideSection,#dmAccountDialog').forEach(el=>el.remove());

  const setStatus=(message,error=false)=>{
    const el=document.getElementById('dmAccountStatus');if(!el)return;
    el.textContent=message||'';el.classList.toggle('error',Boolean(error));
  };

  const selectTab=tab=>{
    const d=document.getElementById('dmAccountDialog');if(!d)return;
    d.querySelectorAll('[data-tab]').forEach(btn=>btn.classList.toggle('active',btn.dataset.tab===tab));
    const login=d.querySelector('#dmAccountLoginForm'),register=d.querySelector('#dmAccountRegisterForm');
    if(login)login.hidden=tab!=='login';
    if(register)register.hidden=tab!=='register';
    setStatus('');
  };

  const ensureDialog=()=>{
    let d=document.getElementById('dmAccountDialog');if(d)return d;
    d=document.createElement('dialog');d.id='dmAccountDialog';
    d.innerHTML=`<div class="dm-account-card">
      <div class="dm-account-head"><div><small>CUSTOMER ACCOUNT</small><h2>Welcome to Damiønmusic</h2><p>Log in or create a normal customer account.</p></div><button class="dm-account-close" type="button" aria-label="Close">×</button></div>
      <div id="dmAccountState" class="dm-account-state" hidden></div>
      <div id="dmAccountAuth" class="dm-account-auth">
        <div class="dm-account-tabs"><button type="button" data-tab="login" class="active">Log in</button><button type="button" data-tab="register">Register</button></div>
        <form id="dmAccountLoginForm" class="dm-account-form">
          <label><span>Email</span><input name="email" type="email" autocomplete="email" required placeholder="you@example.com"></label>
          <label><span>Password</span><input name="password" type="password" autocomplete="current-password" minlength="8" maxlength="128" required placeholder="Your password"></label>
          <button class="dm-account-primary" type="submit">Log in</button>
        </form>
        <form id="dmAccountRegisterForm" class="dm-account-form" hidden>
          <label><span>Email</span><input name="email" type="email" autocomplete="email" required placeholder="you@example.com"></label>
          <label><span>Password</span><input name="password" type="password" autocomplete="new-password" minlength="8" maxlength="128" required placeholder="At least 8 characters"></label>
          <button class="dm-account-primary" type="submit">Create account</button>
        </form>
        <div id="dmAccountStatus" class="dm-account-status" aria-live="polite"></div>
      </div>
    </div>`;
    document.body.appendChild(d);

    const close=()=>{try{if(d.open)d.close();else d.removeAttribute('open')}catch(_){d.removeAttribute('open')}};
    d.querySelector('.dm-account-close')?.addEventListener('click',close);
    d.addEventListener('cancel',e=>{e.preventDefault();close()});
    d.querySelectorAll('[data-tab]').forEach(btn=>btn.addEventListener('click',()=>selectTab(btn.dataset.tab)));

    const login=d.querySelector('#dmAccountLoginForm'),register=d.querySelector('#dmAccountRegisterForm');
    login?.addEventListener('submit',async e=>{
      e.preventDefault();if(!login.reportValidity())return;
      const fd=new FormData(login);await authenticate('customer_login',clean(fd.get('email')).toLowerCase(),String(fd.get('password')||''),login);
    });
    register?.addEventListener('submit',async e=>{
      e.preventDefault();if(!register.reportValidity())return;
      const fd=new FormData(register);await authenticate('register',clean(fd.get('email')).toLowerCase(),String(fd.get('password')||''),register);
    });
    return d;
  };

  const open=mode=>{
    const d=ensureDialog();render();
    if(mode==='login'||mode==='register')selectTab(mode);
    try{if(!d.open)d.showModal()}catch(_){d.setAttribute('open','')}
    requestAnimationFrame(()=>d.querySelector('form:not([hidden]) input')?.focus?.({preventScroll:true}));
  };
  window.dmOpenAccount=open;

  const finishCustomer=(out,email)=>{
    if(out.is_owner)throw new Error('This account cannot use customer login.');
    write(CUSTOMER_KEY,out.session_token||'');
    customer={email:out.user?.email||email};
    render();
    document.dispatchEvent(new CustomEvent('dm-account-state',{detail:{customer,owner}}));
    const d=document.getElementById('dmAccountDialog');try{if(d?.open)d.close()}catch(_){}
    const target=readSession(AFTER_AUTH_KEY);
    if(target){writeSession(AFTER_AUTH_KEY,'');setTimeout(()=>location.href=target,120)}
  };

  const authenticate=async(action,email,password,form)=>{
    const btn=form.querySelector('button[type="submit"]');if(btn)btn.disabled=true;
    setStatus(action==='register'?'Creating account…':'Logging in…');
    try{
      const out=await authApi(action,{email,password});
      form.reset();setStatus('');finishCustomer(out,email);
    }catch(err){setStatus(err?.message||'Could not continue.',true)}finally{if(btn)btn.disabled=false}
  };

  const logoutCustomer=async()=>{
    const token=read(CUSTOMER_KEY);write(CUSTOMER_KEY,'');customer=null;render();
    try{if(token)await authApi('logout',{session_token:token})}catch(_){}
    document.dispatchEvent(new CustomEvent('dm-account-state',{detail:{customer:null,owner}}));
  };

  const findHeaderHost=()=>document.querySelector('.nav-actions')||document.querySelector('.checkout-topbar')||document.querySelector('.order-head')||document.querySelector('header .nav')||document.querySelector('header .wrap')||document.querySelector('header');

  const ensureActions=()=>{
    if(isAdminPage())return;
    let box=document.getElementById('dmAccountActions');
    if(!box){
      box=document.createElement('div');box.id='dmAccountActions';box.className='dm-account-actions';
      const host=findHeaderHost();if(host)host.appendChild(box);else{document.body.appendChild(box);box.classList.add('fallback')}
    }
    if(!box.isConnected)return;box.replaceChildren();
    if(owner){
      const a=document.createElement('a');a.className='btn dm-account-owner-button';a.href=ADMIN_PATH;a.textContent='Owner';box.appendChild(a);return;
    }
    if(customer){
      const a=document.createElement('a');a.className='btn dm-account-open';a.href='/account';a.textContent='Account';box.appendChild(a);return;
    }
    const login=document.createElement('button');login.type='button';login.className='btn dm-account-open';login.textContent='Log in';login.addEventListener('click',()=>open('login'));
    const register=document.createElement('button');register.type='button';register.className='btn primary dm-account-register-open';register.textContent='Register';register.addEventListener('click',()=>open('register'));
    box.append(login,register);
  };

  const ensureSidebar=()=>{
    const body=document.querySelector('.dm-side-body');if(!body)return;
    let section=document.getElementById('dmAccountSideSection');
    if(!section){section=document.createElement('div');section.id='dmAccountSideSection';body.appendChild(section)}
    if(owner){
      section.innerHTML='<div class="dm-side-section-label">Owner</div><div class="dm-side-links"><a class="dm-side-link" href="/admin-orders.html"><span class="dm-side-link-icon">◇</span><span class="dm-side-link-copy"><b>Owner dashboard</b><small>Private admin controls</small></span><span class="dm-side-link-arrow">›</span></a></div>';
      return;
    }
    if(customer){
      section.innerHTML=`<div class="dm-side-section-label">Account</div><div class="dm-side-links"><a class="dm-side-link" id="dmAccountSideManage" href="/account"><span class="dm-side-link-icon">◎</span><span class="dm-side-link-copy"><b>${String(customer.email||'Customer account')}</b><small>Manage account settings</small></span><span class="dm-side-link-arrow">›</span></a></div>`;
    }else{
      section.innerHTML='<div class="dm-side-section-label">Account</div><div class="dm-side-links"><button class="dm-side-link" id="dmAccountSideLogin" type="button"><span class="dm-side-link-icon">◎</span><span class="dm-side-link-copy"><b>Log in</b><small>Existing customer</small></span><span class="dm-side-link-arrow">›</span></button><button class="dm-side-link dm-side-primary" id="dmAccountSideRegister" type="button"><span class="dm-side-link-icon">＋</span><span class="dm-side-link-copy"><b>Register</b><small>Create a customer account</small></span><span class="dm-side-link-arrow">›</span></button></div>';
      section.querySelector('#dmAccountSideLogin')?.addEventListener('click',()=>open('login'));
      section.querySelector('#dmAccountSideRegister')?.addEventListener('click',()=>open('register'));
    }
  };

  const render=()=>{
    ensureActions();ensureSidebar();
    const d=document.getElementById('dmAccountDialog');if(!d)return;
    const state=d.querySelector('#dmAccountState'),auth=d.querySelector('#dmAccountAuth');
    if(customer){
      state.hidden=false;auth.hidden=true;
      state.innerHTML=`<div class="dm-account-signed"><div><small>SIGNED IN</small><b>${String(customer.email||'Customer')}</b><span>Customer account · no admin permissions</span></div><button type="button" id="dmCustomerLogout">Log out</button></div>`;
      state.querySelector('#dmCustomerLogout')?.addEventListener('click',logoutCustomer,{once:true});
    }else{state.hidden=true;auth.hidden=false}
  };

  const verifyState=async()=>{
    if(stateBusy)return;stateBusy=true;
    const customerToken=read(CUSTOMER_KEY),ownerToken=read(OWNER_KEY);
    try{
      const [c,o]=await Promise.all([
        customerToken?authApi('session',{session_token:customerToken}).catch(()=>null):Promise.resolve(null),
        ownerToken?authApi('session',{session_token:ownerToken}).catch(()=>null):Promise.resolve(null)
      ]);
      if(c?.authenticated&&!c.is_owner)customer={email:c.user?.email||''};else{customer=null;if(customerToken)write(CUSTOMER_KEY,'')}
      owner=Boolean(o?.authenticated&&o.is_owner);if(ownerToken&&!owner)write(OWNER_KEY,'');
      if(owner&&customer){write(CUSTOMER_KEY,'');customer=null}
      render();document.dispatchEvent(new CustomEvent('dm-account-state',{detail:{customer,owner}}));
    }finally{stateBusy=false}
  };

  const remount=()=>{
    if(isAdminPage())return;ensureDialog();
    const box=document.getElementById('dmAccountActions'),host=findHeaderHost();if(box&&host&&!host.contains(box))box.remove();
    ensureActions();ensureSidebar();
  };

  document.addEventListener('click',e=>{
    const a=e.target.closest?.('a[href]');if(!a||isAdminPage())return;
    let path='';try{path=new URL(a.href,location.href).pathname}catch(_){return}
    if(path!=='/browse-services')return;
    if(customer||owner||read(CUSTOMER_KEY)||read(OWNER_KEY))return;
    e.preventDefault();e.stopImmediatePropagation();writeSession(AFTER_AUTH_KEY,'/browse-services');open('login');setStatus('Log in or register first to browse services.');
  },true);

  const start=()=>{if(isAdminPage())return;removeOldUI();ensureDialog();remount();verifyState();setTimeout(remount,250);setTimeout(remount,900)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  document.addEventListener('dm:pagechange',()=>setTimeout(()=>{remount();verifyState()},0));
  window.addEventListener('storage',e=>{if(e.key===CUSTOMER_KEY||e.key===OWNER_KEY)verifyState()});
  new MutationObserver(()=>{if(!isAdminPage())requestAnimationFrame(remount)}).observe(document.documentElement,{childList:true,subtree:true});
})();
