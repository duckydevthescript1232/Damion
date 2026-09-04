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
      loggedOut:'You are logged out.',deleting:'Deleting account…',deleted:'Your account has been deleted.',deleteFailed:'Could not delete your account.',
      referralLabel:'Referral program',referralTitle:'Invite friends. Earn rewards.',referralCopy:'Share your personal link. A new customer gets 10% off their first order, and after their first paid order you receive a personal €5 promo reward.',referralLinkLabel:'Your referral link',copy:'Copy',share:'Share',clicks:'Clicks',signups:'Signups',paidReferrals:'Paid referrals',rewardsEarned:'Rewards earned',rewardCodes:'Your reward promo codes',rewardCodesHint:'Created after successful referrals',noRewards:'No rewards yet.',copied:'Referral link copied.',rewardCopied:'Promo code copied.',shareText:'Get 10% off your first Damiønmusic order with my referral link:'
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
      loggedOut:'Je bent uitgelogd.',deleting:'Account verwijderen…',deleted:'Je account is verwijderd.',deleteFailed:'Je account kon niet worden verwijderd.',
      referralLabel:'Referralprogramma',referralTitle:'Nodig vrienden uit. Verdien beloningen.',referralCopy:'Deel je persoonlijke link. Een nieuwe klant krijgt 10% korting op de eerste bestelling en na de eerste betaalde bestelling ontvang jij een persoonlijke promo van €5.',referralLinkLabel:'Jouw referrallink',copy:'Kopiëren',share:'Delen',clicks:'Klikken',signups:'Registraties',paidReferrals:'Betaalde referrals',rewardsEarned:'Verdiende beloningen',rewardCodes:'Jouw beloningscodes',rewardCodesHint:'Aangemaakt na succesvolle referrals',noRewards:'Nog geen beloningen.',copied:'Referrallink gekopieerd.',rewardCopied:'Promocode gekopieerd.',shareText:'Krijg 10% korting op je eerste Damiønmusic-bestelling via mijn referrallink:'
    }
  };

  const read=k=>{try{return localStorage.getItem(k)||''}catch(_){return''}};
  const write=(k,v)=>{try{if(v)localStorage.setItem(k,v);else localStorage.removeItem(k)}catch(_){}};
  const getLang=()=>{const l=(read('damion_lang')||navigator.language||'en').toLowerCase();return l.startsWith('nl')?'nl':'en'};
  const t=k=>copy[getLang()][k]||copy.en[k]||k;
  const feedback=(message,error=false)=>{const el=document.getElementById('dmAccountFeedback');if(!el)return;el.textContent=message;el.classList.toggle('error',error);el.classList.add('show');clearTimeout(feedback.timer);feedback.timer=setTimeout(()=>el.classList.remove('show'),2600)};
  const api=async(action,extra={})=>{const r=await fetch(AUTH_API,{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,...extra})});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'Request failed');return d};
  const copyText=async value=>{try{await navigator.clipboard.writeText(value);return true}catch(_){const ta=document.createElement('textarea');ta.value=value;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();let ok=false;try{ok=document.execCommand('copy')}catch(__){}ta.remove();return ok}};
  let referralData=null;

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

  const renderReferral=()=>{
    const data=referralData;if(!data)return;
    const link=document.getElementById('dmReferralLink');if(link)link.value=data.link||'';
    const code=document.getElementById('dmReferralCode');if(code)code.textContent=data.code||'—';
    const stats=data.stats||{};
    const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=String(v)};
    set('dmReferralClicks',Number(stats.clicks||0));
    set('dmReferralSignups',Number(stats.signups||0));
    set('dmReferralPaid',Number(stats.paid_orders||0));
    set('dmReferralEarned','€'+Number(stats.lifetime_reward_eur||0).toFixed(2));
    const host=document.getElementById('dmReferralRewards');if(!host)return;
    const rewards=(data.rewards||[]).filter(x=>x&&x.active&&(x.max_uses==null||Number(x.uses_count||0)<Number(x.max_uses)));
    if(!rewards.length){host.innerHTML='<span class="dm-referral-empty" data-copy="noRewards">'+t('noRewards')+'</span>';return}
    host.innerHTML=rewards.map(r=>'<button type="button" class="dm-referral-reward" data-reward-code="'+String(r.code||'').replace(/"/g,'&quot;')+'"><span><b>'+String(r.code||'')+'</b><small>€'+Number(r.discount_value||0).toFixed(2)+' promo</small></span><em>'+t('copy')+'</em></button>').join('');
  };

  const loadReferral=async()=>{
    const token=read(CUSTOMER_KEY);if(!token)return;
    try{referralData=await api('referral_info',{session_token:token});renderReferral()}catch(err){console.warn('Referral info unavailable',err)}
  };

  const verify=async()=>{
    applyCopy();
    const token=read(CUSTOMER_KEY);
    if(!token){setSignedOut();return}
    try{
      const out=await api('session',{session_token:token});
      if(!out.authenticated||out.is_owner){write(CUSTOMER_KEY,'');setSignedOut();return}
      setSignedIn(out.user&&out.user.email?out.user.email:'Customer');
      await loadReferral();
    }catch(_){write(CUSTOMER_KEY,'');setSignedOut()}
  };

  document.querySelectorAll('[data-account-lang]').forEach(btn=>btn.addEventListener('click',()=>{
    const lang=btn.getAttribute('data-account-lang');
    write('damion_lang',lang);
    if(typeof window.dmSetLanguage==='function')window.dmSetLanguage(lang);
    applyCopy();
  }));

  document.getElementById('dmCopyReferral')?.addEventListener('click',async()=>{
    const link=document.getElementById('dmReferralLink')?.value||referralData?.link||'';
    if(link&&await copyText(link))feedback(t('copied'));
  });
  document.getElementById('dmShareReferral')?.addEventListener('click',async()=>{
    const link=document.getElementById('dmReferralLink')?.value||referralData?.link||'';
    if(!link)return;
    if(navigator.share){try{await navigator.share({title:'Damiønmusic',text:t('shareText'),url:link});return}catch(_){}}
    if(await copyText(link))feedback(t('copied'));
  });
  document.getElementById('dmReferralRewards')?.addEventListener('click',async e=>{
    const btn=e.target.closest?.('[data-reward-code]');if(!btn)return;
    const code=btn.getAttribute('data-reward-code')||'';if(code&&await copyText(code))feedback(t('rewardCopied'));
  });

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
  document.addEventListener('dm:languagechange',()=>{applyCopy();renderReferral()});
  document.addEventListener('dm-account-state',()=>setTimeout(verify,0));
  window.addEventListener('storage',e=>{if(e.key===CUSTOMER_KEY||e.key==='damion_lang')verify()});
  verify();
})();