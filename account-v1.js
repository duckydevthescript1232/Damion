(()=>{
  if(window.__dmAccountV1)return;
  window.__dmAccountV1=true;

  const AUTH_API='https://wutlhceqkioshepfbykf.supabase.co/functions/v1/damion-site-auth';
  const SUPABASE_URL='https://wutlhceqkioshepfbykf.supabase.co';
  const CUSTOMER_KEY='damion_customer_session';
  const OWNER_KEY='damion_site_session';
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

  const stripOAuthUrl=()=>{
    try{
      const u=new URL(location.href);
      u.hash='';
      u.searchParams.delete('dm_auth');
      u.searchParams.delete('error');
      u.searchParams.delete('error_code');
      u.searchParams.delete('error_description');
      history.replaceState(null,'',u.pathname+(u.search||''));
    }catch(_){}
  };

  const ensureDialog=()=>{
    let dialog=document.getElementById('dmAccountDialog');
    if(dialog)return dialog;
    dialog=document.createElement('dialog');
    dialog.id='dmAccountDialog';
    dialog.innerHTML=`<div class="dm-account-card">
      <div class="dm-account-head"><div><small>CUSTOMER ACCOUNT</small><h2>Welcome to Damiønmusic</h2></div><button class="dm-account-close" type="button" aria-label="Close">×</button></div>
      <div class="dm-account-state" id="dmAccountState" hidden></div>
      <div class="dm-account-auth" id="dmAccountAuth">
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
          <button class="dm-account-primary" type="submit">Create account</button>
        </form>
        <div class="dm-account-status" id="dmAccountStatus" aria-live="polite"></div>
      </div>
      <div class="dm-account-owner"><span>Owner / admin?</span><a href="/admin-orders.html">Open separate admin login →</a></div>
    </div>`;
    document.body.appendChild(dialog);

    const close=()=>{try{dialog.close()}catch(_){dialog.removeAttribute('open')}};
    dialog.querySelector('.dm-account-close').addEventListener('click',close);
    dialog.addEventListener('cancel',e=>{e.preventDefault();close()});
    dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close()});

    const tabs=[...dialog.querySelectorAll('[data-tab]')];
    const login=dialog.querySelector('#dmAccountLoginForm');
    const register=dialog.querySelector('#dmAccountRegisterForm');
    tabs.forEach(btn=>btn.addEventListener('click',()=>{
      tabs.forEach(x=>x.classList.toggle('active',x===btn));
      const reg=btn.dataset.tab==='register';
      login.hidden=reg;register.hidden=!reg;
      setStatus('');
    }));

    dialog.querySelectorAll('[data-oauth]').forEach(btn=>btn.addEventListener('click',()=>startOAuth(btn.dataset.oauth)));
    login.addEventListener('submit',async e=>{
      e.preventDefault();if(!login.reportValidity())return;
      const fd=new FormData(login);await customerAuth('customer_login',clean(fd.get('email')).toLowerCase(),String(fd.get('password')||''),login);
    });
    register.addEventListener('submit',async e=>{
      e.preventDefault();if(!register.reportValidity())return;
      const fd=new FormData(register);await customerAuth('register',clean(fd.get('email')).toLowerCase(),String(fd.get('password')||''),register);
    });
    render();
    return dialog;
  };

  const setStatus=(message,error=false)=>{
    const el=document.getElementById('dmAccountStatus');
    if(!el)return;
    el.textContent=message||'';
    el.classList.toggle('error',Boolean(error));
  };

  const open=()=>{
    const dialog=ensureDialog();
    render();
    try{if(!dialog.open)dialog.showModal()}catch(_){dialog.setAttribute('open','')}
  };
  window.dmOpenAccount=open;

  const customerAuth=async(action,email,password,form)=>{
    const button=form.querySelector('button[type="submit"]');
    button.disabled=true;setStatus(action==='register'?'Creating account…':'Logging in…');
    try{
      const out=await authApi(action,{email,password});
      if(out.is_owner)throw new Error('Owner accounts use the separate admin login.');
      write(CUSTOMER_KEY,out.session_token||'');
      customer={email:out.user?.email||email};
      form.reset();
      setStatus('');
      render();
      document.dispatchEvent(new CustomEvent('dm-account-state',{detail:{customer,owner}}));
    }catch(err){setStatus(err?.message||'Could not continue.',true)}finally{button.disabled=false}
  };

  const logoutCustomer=async()=>{
    const token=read(CUSTOMER_KEY);write(CUSTOMER_KEY,'');customer=null;render();
    try{if(token)await authApi('logout',{session_token:token})}catch(_){}
    document.dispatchEvent(new CustomEvent('dm-account-state',{detail:{customer:null,owner}}));
  };

  const startOAuth=provider=>{
    const supported=['google','facebook'];
    if(!supported.includes(provider))return;
    const redirect='https://damionmusic.nl/?dm_auth=oauth';
    const url=`${SUPABASE_URL}/auth/v1/authorize?provider=${encodeURIComponent(provider)}&redirect_to=${encodeURIComponent(redirect)}`;
    location.assign(url);
  };

  const handleOAuth=async()=>{
    const hash=new URLSearchParams(location.hash.replace(/^#/,''));
    const query=new URLSearchParams(location.search);
    const error=hash.get('error_description')||query.get('error_description')||hash.get('error')||query.get('error');
    const access=hash.get('access_token');
    if(error){
      ensureDialog();open();setStatus(decodeURIComponent(String(error).replace(/\+/g,' ')),true);stripOAuthUrl();return;
    }
    if(!access)return;
    ensureDialog();open();setStatus('Finishing social login…');
    try{
      const out=await authApi('oauth_session',{access_token:access});
      write(CUSTOMER_KEY,out.session_token||'');
      customer={email:out.user?.email||''};
      setStatus('');
      render();
      document.dispatchEvent(new CustomEvent('dm-account-state',{detail:{customer,owner}}));
    }catch(err){setStatus(err?.message||'Social login could not be completed.',true)}finally{stripOAuthUrl()}
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
      owner=Boolean(o?.authenticated&&o.is_owner);
      if(ownerToken&&!owner)write(OWNER_KEY,'');
      render();
      document.dispatchEvent(new CustomEvent('dm-account-state',{detail:{customer,owner}}));
    }finally{stateBusy=false}
  };

  const ensureHeaderButton=()=>{
    if(/^\/admin-orders(?:\.html)?\/?$/.test(location.pathname))return;
    if(document.getElementById('dmAccountOpen'))return;
    let host=document.querySelector('.nav-actions');
    if(!host)host=document.querySelector('.checkout-topbar,.order-head');
    if(!host)return;
    const btn=document.createElement('button');
    btn.id='dmAccountOpen';btn.type='button';btn.className='btn dm-account-open';
    btn.textContent=customer?'Account':'Log in';
    btn.addEventListener('click',e=>{e.preventDefault();open()});
    host.appendChild(btn);
  };

  const ensureSidebarCards=()=>{
    const body=document.querySelector('.dm-side-body');
    if(!body)return;
    let section=document.getElementById('dmAccountSideSection');
    if(!section){
      section=document.createElement('div');section.id='dmAccountSideSection';
      section.innerHTML=`<div class="dm-side-section-label">Account</div><div class="dm-side-links"><button class="dm-side-link" id="dmAccountSideCard" type="button"><span class="dm-side-link-icon" aria-hidden="true">◎</span><span class="dm-side-link-copy"><b>Log in / Register</b><small>Customer account</small></span><span class="dm-side-link-arrow">›</span></button><a class="dm-side-link" href="/admin-orders.html"><span class="dm-side-link-icon" aria-hidden="true">◇</span><span class="dm-side-link-copy"><b>Owner / Admin</b><small>Separate private login</small></span><span class="dm-side-link-arrow">›</span></a></div>`;
      body.appendChild(section);
      section.querySelector('#dmAccountSideCard').addEventListener('click',open);
    }

    const card=section.querySelector('#dmAccountSideCard');
    const b=card?.querySelector('b'),small=card?.querySelector('small');
    if(customer){if(b)b.textContent=customer.email||'Customer account';if(small)small.textContent='Signed in · click to manage'}
    else{if(b)b.textContent='Log in / Register';if(small)small.textContent='Email, Google or Facebook'}

    const bookingLabel=[...body.querySelectorAll('.dm-side-section-label')].find(x=>x.textContent.trim().toLowerCase()==='booking');
    const bookingLinks=bookingLabel?.nextElementSibling?.classList?.contains('dm-side-links')?bookingLabel.nextElementSibling:null;
    if(bookingLinks){
      let broadcast=document.getElementById('dmBroadcastSideCard');
      if(owner&&!broadcast){
        broadcast=document.createElement('button');broadcast.id='dmBroadcastSideCard';broadcast.type='button';broadcast.className='dm-side-link';
        broadcast.innerHTML='<span class="dm-side-link-icon" aria-hidden="true">✦</span><span class="dm-side-link-copy"><b>Broadcast message</b><small>Owner verified · send live message</small></span><span class="dm-side-link-arrow">›</span>';
        broadcast.addEventListener('click',()=>{if(typeof window.dmOpenBroadcast==='function')window.dmOpenBroadcast();else setTimeout(()=>window.dmOpenBroadcast?.(),250)});
        bookingLinks.appendChild(broadcast);
      }else if(!owner&&broadcast)broadcast.remove();
    }
  };

  const render=()=>{
    ensureHeaderButton();ensureSidebarCards();
    const header=document.getElementById('dmAccountOpen');if(header)header.textContent=customer?'Account':'Log in';
    const dialog=document.getElementById('dmAccountDialog');if(!dialog)return;
    const state=dialog.querySelector('#dmAccountState'),auth=dialog.querySelector('#dmAccountAuth');
    if(customer){
      state.hidden=false;auth.hidden=true;
      state.innerHTML=`<div class="dm-account-signed"><div><small>SIGNED IN</small><b>${String(customer.email||'Customer')}</b><span>Customer account</span></div><button type="button" id="dmCustomerLogout">Log out</button></div>`;
      state.querySelector('#dmCustomerLogout').addEventListener('click',logoutCustomer,{once:true});
    }else{state.hidden=true;auth.hidden=false}
  };

  const start=()=>{
    ensureDialog();ensureHeaderButton();ensureSidebarCards();handleOAuth();verifyState();
    setTimeout(()=>{ensureHeaderButton();ensureSidebarCards()},500);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  document.addEventListener('dm:pagechange',()=>setTimeout(()=>{ensureHeaderButton();ensureSidebarCards();verifyState()},0));
  window.addEventListener('storage',e=>{if(e.key===CUSTOMER_KEY||e.key===OWNER_KEY)verifyState()});
  setInterval(()=>{ensureHeaderButton();ensureSidebarCards()},2500);
})();