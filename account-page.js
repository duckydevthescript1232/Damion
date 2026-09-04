(()=>{
  const AUTH_API='https://wutlhceqkioshepfbykf.supabase.co/functions/v1/damion-site-auth';
  const CUSTOMER_KEY='damion_customer_session';
  const OWNER_KEY='damion_site_session';
  const root=document.getElementById('dmAccountPage');
  if(!root)return;

  const copy={
    en:{
      headerTitle:'Account',backHome:'Back home',kicker:'Customer account',title:'Your account.',subtitle:'Manage your sign-in, language and account settings in one place.',
      signedInAs:'Signed in as',profileLabel:'Profile',profileTitle:'Account access',profileCopy:'Your customer login is used for services and your private order experience.',
      emailLabel:'Email address',logout:'Log out',logoutHelp:'Sign out on this device.',languageLabel:'Language',languageTitle:'Choose your language',
      languageCopy:'This changes the language preference across Damiønmusic.',dangerLabel:'Danger zone',deleteTitle:'Delete account',
      deleteCopy:'Permanently remove your customer login. This cannot be undone.',deleteButton:'Delete account',deleteConfirmTitle:'Delete this account permanently?',
      deleteConfirmCopy:'Your login will be removed and you will be signed out everywhere on this site.',cancel:'Cancel',deleteFinal:'Delete permanently',
      signedOutKicker:'Account required',signedOutTitle:'You are not logged in.',signedOutCopy:'Log in or create a customer account to manage these settings.',
      login:'Log in',register:'Register',checking:'Checking',active:'Active',signedOut:'Signed out',checkingEmail:'Checking…',loggingOut:'Logging out…',
      loggedOut:'You are logged out.',deleting:'Deleting account…',deleted:'Your account has been deleted.',deleteFailed:'Could not delete your account.'
    },
    nl:{
      headerTitle:'Account',backHome:'Terug naar home',kicker:'Klantaccount',title:'Jouw account.',subtitle:'Beheer je login, taal en accountinstellingen op één plek.',
      signedInAs:'Ingelogd als',profileLabel:'Profiel',profileTitle:'Accounttoegang',profileCopy:'Je klantlogin wordt gebruikt voor diensten en je privé bestelervaring.',
      emailLabel:'E-mailadres',logout:'Uitloggen',logoutHelp:'Log uit op dit apparaat.',languageLabel:'Taal',languageTitle:'Kies je taal',
      languageCopy:'Dit wijzigt je taalvoorkeur voor Damiønmusic.',dangerLabel:'Gevarenzone',deleteTitle:'Account verwijderen',
      deleteCopy:'Verwijder je klantlogin permanent. Dit kan niet ongedaan worden gemaakt.',deleteButton:'Account verwijderen',deleteConfirmTitle:'Dit account permanent verwijderen?',
      deleteConfirmCopy:'Je login wordt verwijderd en je wordt overal op deze site uitgelogd.',cancel:'Annuleren',deleteFinal:'Permanent verwijderen',
      signedOutKicker:'Account vereist',signedOutTitle:'Je bent niet ingelogd.',signedOutCopy:'Log in of maak een klantaccount aan om deze instellingen te beheren.',
      login:'Inloggen',register:'Registreren',checking:'Controleren',active:'Actief',signedOut:'Uitgelogd',checkingEmail:'Controleren…',loggingOut:'Uitloggen…',
      loggedOut:'Je bent uitgelogd.',deleting:'Account verwijderen…',deleted:'Je account is verwijderd.',deleteFailed:'Je account kon niet worden verwijderd.'
    }
  };

  const read=k=>{try{return localStorage.getItem(k)||''}catch(_){return''}};
  const write=(k,v)=>{try{if(v)localStorage.setItem(k,v);else localStorage.removeItem(k)}catch(_){}};
  const getLang=()=>{const l=(read('damion_lang')||navigator.language||'en').toLowerCase();return l.startsWith('nl')?'nl':'en'};
  const t=k=>copy[getLang()][k]||copy.en[k]||k;
  const feedback=(message,error=false)=>{const el=document.getElementById('dmAccountFeedback');if(!el)return;el.textContent=message;el.classList.toggle('error',error);el.classList.add('show');clearTimeout(feedback.timer);feedback.timer=setTimeout(()=>el.classList.remove('show'),2600)};
  const api=async(action,extra={})=>{const r=await fetch(AUTH_API,{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,...extra})});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'Request failed');return d};

  const applyCopy=()=>{
    document.documentElement.lang=getLang();
    root.querySelectorAll('[data-copy]').forEach(el=>{const key=el.getAttribute('data-copy');el.textContent=t(key)});
    document.querySelectorAll('[data-account-lang]').forEach(btn=>btn.setAttribute('aria-pressed',String(btn.getAttribute('data-account-lang')===getLang())));
  };

  const setSignedOut=()=>{
    root.querySelector('.dm-account-page-hero').hidden=true;
    root.querySelector('.dm-account-grid').hidden=true;
    document.getElementById('dmSignedOutState').hidden=false;
    const pill=document.getElementById('dmAccountStatePill');if(pill)pill.textContent=t('signedOut');
  };

  const setSignedIn=email=>{
    root.querySelector('.dm-account-page-hero').hidden=false;
    root.querySelector('.dm-account-grid').hidden=false;
    document.getElementById('dmSignedOutState').hidden=true;
    document.getElementById('dmAccountEmail').textContent=email||'Customer';
    document.getElementById('dmAccountEmailRow').textContent=email||'Customer';
    const pill=document.getElementById('dmAccountStatePill');if(pill)pill.textContent=t('active');
  };

  const verify=async()=>{
    applyCopy();
    const token=read(CUSTOMER_KEY);
    if(!token){setSignedOut();return}
    try{
      const out=await api('session',{session_token:token});
      if(!out.authenticated||out.is_owner){write(CUSTOMER_KEY,'');setSignedOut();return}
      setSignedIn(out.user&&out.user.email?out.user.email:'Customer');
    }catch(_){write(CUSTOMER_KEY,'');setSignedOut()}
  };

  document.querySelectorAll('[data-account-lang]').forEach(btn=>btn.addEventListener('click',()=>{
    const lang=btn.getAttribute('data-account-lang');
    write('damion_lang',lang);
    if(typeof window.dmSetLanguage==='function')window.dmSetLanguage(lang);
    applyCopy();
  }));

  document.getElementById('dmLogoutBtn').addEventListener('click',async()=>{
    const token=read(CUSTOMER_KEY);
    feedback(t('loggingOut'));
    write(CUSTOMER_KEY,'');
    try{if(token)await api('logout',{session_token:token})}catch(_){}
    setSignedOut();feedback(t('loggedOut'));
    document.dispatchEvent(new CustomEvent('dm-account-state',{detail:{customer:null,owner:Boolean(read(OWNER_KEY))}}));
  });

  const confirmBox=document.getElementById('dmDeleteConfirm');
  document.getElementById('dmDeleteStart').addEventListener('click',()=>{confirmBox.hidden=false;document.getElementById('dmDeleteFinal').focus()});
  document.getElementById('dmDeleteCancel').addEventListener('click',()=>{confirmBox.hidden=true});

  document.getElementById('dmDeleteFinal').addEventListener('click',async()=>{
    const token=read(CUSTOMER_KEY);
    if(!token){setSignedOut();return}
    const button=document.getElementById('dmDeleteFinal');
    button.disabled=true;feedback(t('deleting'));
    try{
      await api('delete_account',{session_token:token});
      write(CUSTOMER_KEY,'');confirmBox.hidden=true;setSignedOut();feedback(t('deleted'));
      document.dispatchEvent(new CustomEvent('dm-account-state',{detail:{customer:null,owner:Boolean(read(OWNER_KEY))}}));
    }catch(err){feedback((err&&err.message)||t('deleteFailed'),true)}
    finally{button.disabled=false}
  });

  document.getElementById('dmAccountLoginPage').addEventListener('click',()=>{if(typeof window.dmOpenAccount==='function')window.dmOpenAccount('login');else location.href='/'});
  document.getElementById('dmAccountRegisterPage').addEventListener('click',()=>{if(typeof window.dmOpenAccount==='function')window.dmOpenAccount('register');else location.href='/'});
  document.addEventListener('dm:languagechange',applyCopy);
  document.addEventListener('dm-account-state',()=>setTimeout(verify,0));
  window.addEventListener('storage',e=>{if(e.key===CUSTOMER_KEY||e.key==='damion_lang')verify()});
  verify();
})();