(()=>{
  window.__dmAuthGate=true;

  const ensureOrderProxy=()=>{
    if(!/^\/order(?:\.html)?\/?$/.test(location.pathname))return;
    if(window.__dmOrderFetchProxy)return;
    window.__dmOrderFetchProxy=true;
    const nativeFetch=window.fetch.bind(window);
    const direct='https://wutlhceqkioshepfbykf.supabase.co/functions/v1/damion-orders';
    window.fetch=(input,init={})=>{
      const url=typeof input==='string'?input:(input&&input.url)||'';
      if(url!==direct)return nativeFetch(input,init);
      const headers=new Headers(init.headers||{});
      headers.delete('apikey');
      headers.delete('authorization');
      headers.delete('cache-control');
      headers.set('Content-Type','application/json');
      return nativeFetch('/api/order',{...init,headers,cache:'no-store'});
    };
  };

  const clearLocks=()=>{
    document.documentElement.classList.remove('dm-auth-locking');
    document.body?.classList.remove('dm-auth-locking');
    document.getElementById('dmAuthGate')?.remove();
  };

  const ensureSafariCompat=()=>{
    if(document.querySelector('script[data-dm-safari-compat]'))return;
    const s=document.createElement('script');
    s.src='/safari-compat-v1.js?v=20260829-1';
    s.defer=true;
    s.dataset.dmSafariCompat='1';
    document.head.appendChild(s);
  };

  const ensureCartDrawerFix=()=>{
    if(!document.querySelector('link[data-dm-cart-fix]')){
      const l=document.createElement('link');
      l.rel='stylesheet';
      l.href='/cart-drawer-fix-v1.css?v=20260829-1';
      l.dataset.dmCartFix='1';
      document.head.appendChild(l);
    }
    if(!window.__dmCartDrawerFixV1&&!document.querySelector('script[data-dm-cart-fix]')){
      const s=document.createElement('script');
      s.src='/cart-drawer-fix-v1.js?v=20260829-1';
      s.defer=true;
      s.dataset.dmCartFix='1';
      document.head.appendChild(s);
    }
  };

  const ensureUISounds=()=>{
    if(window.__dmUISoundsV2||document.querySelector('script[data-dm-ui-sounds]'))return;
    const s=document.createElement('script');
    s.src='/ui-sounds-v1.js?v=20260829-2';
    s.defer=true;
    s.dataset.dmUiSounds='1';
    document.head.appendChild(s);
  };

  const ensureLanguageBase=()=>{
    if(!document.querySelector('link[data-dm-language-base]')){
      const l=document.createElement('link');
      l.rel='stylesheet';
      l.href='/language-v1.css?v=20260829-3';
      l.dataset.dmLanguageBase='1';
      document.head.appendChild(l);
    }
    if(window.__dmLanguageV1||document.querySelector('script[data-dm-language-base]'))return;
    const s=document.createElement('script');
    s.src='/language-v1.js?v=20260829-3';
    s.async=false;
    s.dataset.dmLanguageBase='1';
    document.head.appendChild(s);
  };

  const ensureLanguageFinal=()=>{
    if(document.querySelector('script[data-dm-language-final]'))return;
    const s=document.createElement('script');
    s.src='/language-final-v3.js?v=20260829-2';
    s.defer=true;
    s.dataset.dmLanguageFinal='1';
    document.head.appendChild(s);
  };

  const ensurePresence=()=>{
    if(window.__dmPresenceLoaded||document.querySelector('script[data-dm-presence]'))return;
    const s=document.createElement('script');
    s.src='/presence.js?v=20260829-7';
    s.defer=true;
    s.dataset.dmPresence='1';
    document.head.appendChild(s);
  };

  const ensureMaxUI=()=>{
    if(!document.querySelector('link[data-dm-max-ui]')){
      const l=document.createElement('link');
      l.rel='stylesheet';
      l.href='/max-ui-v1.css?v=20260829-1';
      l.dataset.dmMaxUi='1';
      document.head.appendChild(l);
    }
    if(window.__dmMaxUIV1||document.querySelector('script[data-dm-max-ui]'))return;
    const s=document.createElement('script');
    s.src='/max-ui-v1.js?v=20260829-1';
    s.defer=true;
    s.dataset.dmMaxUi='1';
    document.head.appendChild(s);
  };

  const ensureNavCleanup=()=>{
    if(window.__dmNavCleanupV1||document.querySelector('script[data-dm-nav-cleanup]'))return;
    const s=document.createElement('script');
    s.src='/nav-cleanup-v1.js?v=20260829-1';
    s.defer=true;
    s.dataset.dmNavCleanup='1';
    document.head.appendChild(s);
  };

  const ensureServiceControls=()=>{
    if(!document.getElementById('serviceList'))return;
    if(window.__dmServicesControlsV2){window.dmEnsureServicesModal?.();return;}
    if(document.querySelector('script[data-dm-services-controls]'))return;
    const s=document.createElement('script');
    s.src='/services-controls-v1.js?v=20260829-3';
    s.defer=true;
    s.dataset.dmServicesControls='1';
    s.onload=()=>window.dmEnsureServicesModal?.();
    document.body.appendChild(s);
  };

  ensureOrderProxy();
  ensureLanguageBase();
  ensureSafariCompat();
  ensureCartDrawerFix();
  ensureUISounds();
  ensurePresence();
  ensureMaxUI();
  ensureNavCleanup();
  setTimeout(ensureLanguageFinal,350);
  clearLocks();

  const refreshGlobalLayers=()=>{
    clearLocks();
    ensureLanguageBase();
    ensureServiceControls();
    ensureNavCleanup();
    ensureCartDrawerFix();
    ensureUISounds();
    ensurePresence();
    ensureMaxUI();
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refreshGlobalLayers,{once:true});
  else refreshGlobalLayers();
  document.addEventListener('dm:pagechange',()=>setTimeout(refreshGlobalLayers,0));
  setTimeout(clearLocks,250);
  setTimeout(clearLocks,1200);
  setTimeout(()=>document.dispatchEvent(new CustomEvent('dm:pagechange')),700);
  setTimeout(()=>document.dispatchEvent(new CustomEvent('dm:pagechange')),1500);
})();
