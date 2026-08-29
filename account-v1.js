(()=>{
  if(window.__dmAccountV2)return;
  window.__dmAccountV2=true;
  window.__dmAccountV1=true;

  const AUTH_API='https://wutlhceqkioshepfbykf.supabase.co/functions/v1/damion-site-auth';
  const SUPABASE_URL='https://wutlhceqkioshepfbykf.supabase.co';
  const CUSTOMER_KEY='damion_customer_session';
  const OWNER_KEY='damion_site_session';
  const ADMIN_PATH='/admin-orders.html';
  let customer=null;
  let owner=false;
  let stateBusy=false;

  const read=k=>{try{return localStorage.getItem(k)||''}catch(_){return''}};
  const write=(k,v)=>{try{if(v)localStorage.setItem(k,v);else localStorage.removeItem(k)}catch(_){}};
  const clean=v=>String(v||'').trim();
  const authApi=async(action,extra={})=>{
    const r=await fetch(AUTH_API,{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,...extra})});
    const d=await r.json().catch(()=>({}));
    if(!r.ok)throw new Error(d?.error||`Request failed (${r.status})`);
    return d;
  };

  const isAdminPage=()=>/^\/admin-orders(?:\.html)?\/?$/.test(location.pathname);
  const removeOldUI=()=>{
    document.querySelectorAll('#dmAccountOpen,#dmAccountActions,#dmAccountFallback,#dmAccountSideSection').forEach(el=>el.remove());
  };

  const setStatus=(message,error=false)=>{
    const el=document.getElementById('dmAccountStatus');
    if(!el)return;
    el.textContent=message||'';
    el.classList.toggle('error',Boolean(error));
  };

  const selectTab=tab=>{
    const dialog=document.getElementById('dmAccountDialog');
    if(!dialog)return;
    dialog.querySelectorAll('[data-tab]').forEach(btn=>btn.classList.toggle('active',btn.dataset.tab===tab));
    const login=dialog.querySelector('#dmAccountLoginForm');
    const register=dialog.querySelector('#dmAccountRegisterForm');
    if(login)login.hidden=tab!=='login';
    if(register)register.hidden=tab!=='register';
    setStatus('');
  };

  const stripOAuthUrl=()=>{
    try{
      const u=new URL(location.href);
      u.hash='';
      ['dm_auth','error','error_code','error_description'].forEach(k=>u.searchParams.delete(k));
      history.replaceState(null,'',u.pathname+(u.search||''));
    }catch(_){}
  };

  const ensureDialog=()=>{
    let dialog=document.getElementById('dmAccountDialog');
    if(dialog)return dialog;
    dialog=document.createElement('dialog');
    dialog.id='dmAccountDialog';
    dialog.innerHTML=`<div class="dm-account-card">
      <div class="dm-account-head"><div><small>CUSTOMER ACCOUNT</small><h2>Welcome to Damiønmusic</h2><p>Every public account is a normal customer account.</p></div><button class="dm-account-close" type="button" aria-label="Close">×</button></div>
      <div id="dmAccountState" class="dm-account-state" hidden></div>
      <div id="dmAccountAuth" class="dm-account-auth">
        <div class="dm-account-tabs"><button type="button" data-tab="login" class="active">Log in</button><button type="button" data-tab="register">Register</button></div>
        <div class="dm-social-grid"><button type="button" data-oauth="google"><span class="dm-google-g">G</span>Continue with Google</button><button type="button" data-oauth="facebook"><span class="dm-facebook-f">f</span>Continue with Facebook</button></div>
        <div class="dm-account-divider"><span>or use email</span></div>
        <form id="dmAccountLoginForm" class="dm-account-form">
          <label><span>Email</span><input name="email" type="email" autocomplete="email" required placeholder="you@example.com"></label>
          <label><span>Password</span><input name="password" type="password" autocomplete="current-password" minlength="8" maxlength="128" required placeholder="Your password"></label>
          <button class="dm-account-primary" type="submit">Log in</button>
        </form>
        <form id="dmAccountRegisterForm" class="dm-account-form" hidden>
          <label><span>Email</span><input name="email" type="email" autocomplete="email" required placeholder="you@example.com"></label>
          <label><span>Password</span><input name="password" type="password" autocomplete="new-password" minlength="8" maxlength="128" required placeholder="At least 8 characters"></label>
          <button class="dm-account-primary" type="submit">Create customer account</button>
        </form>
        <div id="dmAccountStatus" class="dm-account-status" aria-live="polite"></div>
      </div>
    </div>`;
    document.body.appendChild(dialog);

    const close=()=>{try{if(dialog.open)dialog.close();else dialog.removeAttribute('open')}catch(_){dialog.removeAttribute('open')}};
    dialog.querySelector('.dm-account-close').addEventListener('click',close);
    dialog.addEventListener('cancel',e=>{e.preventDefault();close()});
    dialog.querySelectorAll('[data-tab]').forEach(btn=>btn.addEventListener('click',()=>selectTab(btn.dataset.tab)));
    dialog.querySelectorAll('[data-oauth]').forEach(btn=>btn.addEventListener('click',()=>startOAuth(btn.dataset.oauth)));

    const login=dialog.querySelector('#dmAccountLoginForm');
    const register=dialog.querySelector('#dmAccountRegisterForm');
    login.addEventListener('submit',async e=>{
      e.preventDefault();if(!login.reportValidity())return;
      const fd=new FormData(login);
      await customerAuth('customer_login',clean(fd.get('email')).toLowerCase(),String(fd.get('password')||''),login);
    });
    register.addEventListener('submit',async e=>{
      e.preventDefault();if(!register.reportValidity())return;
      const fd=new FormData(register);
      await customerAuth('register',clean(fd.get('email')).toLowerCase(),String(fd.get('password')||''),register);
    });
    return dialog;
  };

  const open=mode=>{
    const dialog=ensureDialog();
    render();
    if(mode==='login'||mode==='register')selectTab(mode);
    try{if(!dialog.open)dialog.showModal()}catch(_){dialog.setAttribute('open','')}
    requestAnimationFrame(()=>dialog.querySelector('input:not([hidden])')?.focus?.({preventScroll:true}));
  };
  window.dmOpenAccount=open;

  const customerAuth=async(action,email,password,form)=>{
    const button=form.querySelector('button[type="submit"]');
    button.disabled=true;
    setStatus(action==='register'?'Creating your customer account…':'Logging in…');
    try{
      const out=await authApi(action,{email,password});
      if(out.is_owner)throw new Error('This account cannot use customer login.');
      write(CUSTOMER_KEY,out.session_token||'');
      customer={email:out.user?.email||email};
      form.reset();
      setStatus('');
      render();
      document.dispatchEvent(new CustomEvent('dm-account-state',{detail:{customer,owner}}));
    }catch(err){setStatus(err?.message||'Could not continue.',true)}finally{button.disabled=false}
  };

  const logoutCustomer=async()=>{
    const token=read(CUSTOMER_KEY);
    write(CUSTOMER_KEY,'');customer=null;render();
    try{if(token)await authApi('logout',{session_token:token})}catch(_){}
    document.dispatchEvent(new CustomEvent('dm-account-state',{detail:{customer:null,owner}}));
  };

  const startOAuth=provider=>{
    if(!['google','facebook'].includes(provider))return;
    const redirect='https://damionmusic.nl/?dm_auth=oauth';
    location.assign(`${SUPABASE_URL}/auth/v1/authorize?provider=${encodeURIComponent(provider)}&redirect_to=${encodeURIComponent(redirect)}`);
  };

  const handleOAuth=async()=>{
    const hash=new URLSearchParams(location.hash.replace(/^#/,''));
    const query=new URLSearchParams(location.search);
    const error=hash.get('error_description')||query.get('error_description')||hash.get('error')||query.get('error');
    const access=hash.get('access_token');
    if(error){open('login');setStatus(decodeURIComponent(String(error).replace(/\+/g,' ')),true);stripOAuthUrl();return}
    if(!access)return;
    open('login');setStatus('Finishing social login…');
    try{
      const out=await authApi('oauth_session',{access_token:access});
      if(out.is_owner)throw new Error('Owner accounts use the private admin login.');
      write(CUSTOMER_KEY,out.session_token||'');
      customer={email:out.user?.email||''};
      setStatus('');render();
    }catch(err){setStatus(err?.message||'Social login could not be completed.',true)}finally{stripOAuthUrl()}
  };

  const findHeaderHost=()=>document.querySelector('.nav-actions')||document.querySelector('.checkout-topbar')||document.querySelector('.order-head')||document.querySelector('header .nav')||document.querySelector('header .wrap')||document.querySelector('header');

  const ensureActions=()=>{
    if(isAdminPage())return;
    let box=document.getElementById('dmAccountActions');
    if(!box){
      box=document.createElement('div');
      box.id='dmAccountActions';
      box.className='dm-account-actions';
      const host=findHeaderHost();
      if(host){host.appendChild(box);box.classList.remove('fallback')}
      else{document.body.appendChild(box);box.classList.add('fallback')}
    }
    if(!box.isConnected)return;
    box.replaceChildren();

    if(owner){
      const admin=document.createElement('a');
      admin.className='btn dm-account-owner-button';admin.href=ADMIN_PATH;admin.textContent='Owner';
      box.appendChild(admin);
      return;
    }
    if(customer){
      const account=document.createElement('button');
      account.type='button';account.className='btn dm-account-open';account.textContent='Account';
      account.addEventListener('click',()=>open('login'));
      box.appendChild(account);
      return;
    }
    const login=document.createElement('button');
    login.type='button';login.className='btn dm-account-open';login.textContent='Log in';
    login.addEventListener('click',()=>open('login'));
    const register=document.createElement('button');
    register.type='button';register.className='btn primary dm-account-register-open';register.textContent='Register';
    register.addEventListener('click',()=>open('register'));
    box.append(login,register);
  };

  const ensureSidebar=()=>{
    const body=document.querySelector('.dm-side-body');
    if(!body)return;
    let section=document.getElementById('dmAccountSideSection');
    if(!section){
      section=document.createElement('div');section.id='dmAccountSideSection';
      body.appendChild(section);
    }
    if(owner){
      section.innerHTML='<div class="dm-side-section-label">Owner</div><div class="dm-side-links"><a class="dm-side-link" href="/admin-orders.html"><span class="dm-side-link-icon" aria-hidden="true">◇</span><span class="dm-side-link-copy"><b>Owner dashboard</b><small>Private admin controls</small></span><span class="dm-side-link-arrow">›</span></a></div>';
      return;
    }
    if(customer){
      section.innerHTML=`<div class="dm-side-section-label">Account</div><div class="dm-side-links"><button class="dm-side-link" id="dmAccountSideManage" type="button"><span class="dm-side-link-icon" aria-hidden="true">◎</span><span class="dm-side-link-copy"><b>${String(customer.email||'Customer account')}</b><small>Signed in as customer</small></span><span class="dm-side-link-arrow">›</span></button></div>`;
      section.querySelector('#dmAccountSideManage')?.addEventListener('click',()=>open('login'));
    }else{
      section.innerHTML='<div class="dm-side-section-label">Account</div><div class="dm-side-links"><button class="dm-side-link" id="dmAccountSideLogin" type="button"><span class="dm-side-link-icon" aria-hidden="true">◎</span><span class="dm-side-link-copy"><b>Log in</b><small>Existing customer</small></span><span class="dm-side-link-arrow">›</span></button><button class="dm-side-link dm-side-primary" id="dmAccountSideRegister" type="button"><span class="dm-side-link-icon" aria-hidden="true">＋</span><span class="dm-side-link-copy"><b>Register</b><small>Create a customer account</small></span><span class="dm-side-link-arrow">›</span></button></div>';
      section.querySelector('#dmAccountSideLogin')?.addEventListener('click',()=>open('login'));
      section.querySelector('#dmAccountSideRegister')?.addEventListener('click',()=>open('register'));
    }
  };

  const render=()=>{
    ensureActions();ensureSidebar();
    const dialog=document.getElementById('dmAccountDialog');
    if(!dialog)return;
    const state=dialog.querySelector('#dmAccountState');
    const auth=dialog.querySelector('#dmAccountAuth');
    if(customer){
      state.hidden=false;auth.hidden=true;
      state.innerHTML=`<div class="dm-account-signed"><div><small>SIGNED IN</small><b>${String(customer.email||'Customer')}</b><span>Customer account · no admin permissions</span></div><button type="button" id="dmCustomerLogout">Log out</button></div>`;
      state.querySelector('#dmCustomerLogout')?.addEventListener('click',logoutCustomer,{once:true});
    }else{
      state.hidden=true;auth.hidden=false;
    }
  };

  const verifyState=async()=>{
    if(stateBusy)return;stateBusy=true;
    const customerToken=read(CUSTOMER_KEY),ownerToken=read(OWNER_KEY);
    try{
      const [c,o]=await Promise.all([
        customerToken?authApi('session',{session_token:customerToken}).catch(()=>null):Promise.resolve(null),
        ownerToken?authApi('session',{session_token:ownerToken}).catch(()=>null):Promise.resolve(null)
      ]);
      if(c?.authenticated&&!c.is_owner)customer={email:c.user?.email||''};
      else{customer=null;if(customerToken)write(CUSTOMER_KEY,'')}
      owner=Boolean(o?.authenticated&&o.is_owner);
      if(ownerToken&&!owner)write(OWNER_KEY,'');
      if(owner&&customer){write(CUSTOMER_KEY,'');customer=null}
      render();
      document.dispatchEvent(new CustomEvent('dm-account-state',{detail:{customer,owner}}));
    }finally{stateBusy=false}
  };

  const remount=()=>{
    if(isAdminPage())return;
    ensureDialog();
    const box=document.getElementById('dmAccountActions');
    const host=findHeaderHost();
    if(box&&host&&!host.contains(box)){box.remove();}
    ensureActions();ensureSidebar();
  };

  const start=()=>{
    if(isAdminPage())return;
    removeOldUI();
    ensureDialog();
    remount();
    handleOAuth();
    verifyState();
    setTimeout(remount,250);
    setTimeout(remount,900);
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  document.addEventListener('dm:pagechange',()=>setTimeout(()=>{remount();verifyState()},0));
  window.addEventListener('storage',e=>{if(e.key===CUSTOMER_KEY||e.key===OWNER_KEY)verifyState()});
  new MutationObserver(()=>{if(!isAdminPage())requestAnimationFrame(remount)}).observe(document.documentElement,{childList:true,subtree:true});
})();