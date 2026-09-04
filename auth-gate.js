(()=>{
  window.__dmAuthGate=true;

  const isAdminPage=()=>/^\/admin-orders(?:\.html)?\/?$/.test(location.pathname);
  const has=(selector)=>Boolean(document.querySelector(selector));

  const ensureOrderProxy=()=>{
    if(!/^\/order(?:\.html)?\/?$/.test(location.pathname)||window.__dmOrderFetchProxy)return;
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
    document.documentElement.classList.remove('dm-auth-locking','dm-page-leaving','dm-motion-ready','dm-native-view','dm-soft-nav-active','dm-ui-motion');
    document.body?.classList.remove('dm-auth-locking','dm-reduced');
    document.getElementById('dmAuthGate')?.remove();
    document.querySelectorAll('.dm-boot').forEach(el=>el.remove());
  };

  const removeBuggyNav=()=>document.querySelectorAll('.navlinks').forEach(el=>el.remove());
  const removeMotionSettings=()=>{
    document.getElementById('dmSettingsOpen')?.remove();
    document.getElementById('dmSettingsBox')?.remove();
  };

  const ensureStyle=(marker,href)=>{
    if(has(`link[${marker}]`))return;
    const l=document.createElement('link');l.rel='stylesheet';l.href=href;l.setAttribute(marker,'1');document.head.appendChild(l);
  };
  const ensureScript=(marker,src,guard,onload)=>{
    if((guard&&window[guard])||has(`script[${marker}]`))return;
    const s=document.createElement('script');s.src=src;s.defer=true;s.setAttribute(marker,'1');if(onload)s.onload=onload;document.head.appendChild(s);
  };

  const ensureUnifiedTheme=()=>ensureStyle('data-dm-unified-theme','/theme-unify-v2.css?v=20260829-1');
  const ensurePerformance=()=>ensureStyle('data-dm-performance','/performance-v1.css?v=20260830-1');
  const ensureLogoHover=()=>ensureStyle('data-dm-logo-hover','/logo-hover-v1.css?v=20260904-1');

  const ensureSiteShell=()=>{
    if(isAdminPage()||has('.dm-sidepanel')||!has('.nav-actions')||[...document.scripts].some(s=>String(s.src||'').includes('/site-v3.js')))return;
    ensureScript('data-dm-site-shell','/site-v3.js?v=20260830-1',null,()=>{
      removeMotionSettings();
      document.dispatchEvent(new CustomEvent('dm:pagechange'));
    });
  };

  const ensureAccountUI=()=>{
    if(isAdminPage())return;
    ensureStyle('data-dm-account-ui','/account-v1.css?v=20260904-4');
    ensureScript('data-dm-account-ui','/account-v1.js?v=20260904-4','__dmAccountV1');
  };

  const ensureInteraction=()=>{
    ensureStyle('data-dm-interaction-v2','/interaction-v2.css?v=20260829-1');
    ensureStyle('data-dm-buttonfx','/button-fx.css?v=20260830-1');
    ensureScript('data-dm-buttonfx','/button-fx.js?v=20260830-1','__dmButtonFxReady');
  };

  const ensureSafariCompat=()=>ensureScript('data-dm-safari-compat','/safari-compat-v1.js?v=20260829-1');

  const ensureCartDrawerFix=()=>{
    ensureStyle('data-dm-cart-fix','/cart-drawer-fix-v1.css?v=20260829-1');
    ensureScript('data-dm-cart-fix','/cart-drawer-fix-v1.js?v=20260829-1','__dmCartDrawerFixV1');
  };

  const ensureUISounds=()=>ensureScript('data-dm-ui-sounds-v3','/ui-sounds-v1.js?v=20260829-3','__dmUISoundsV3');

  const ensureLanguageBase=()=>{
    ensureStyle('data-dm-language-base','/language-v1.css?v=20260829-3');
    if(window.__dmLanguageV1||has('script[data-dm-language-base]'))return;
    const s=document.createElement('script');s.src='/language-v1.js?v=20260904-4';s.async=false;s.dataset.dmLanguageBase='1';document.head.appendChild(s);
  };

  const ensureLanguageFinal=()=>ensureScript('data-dm-language-final','/language-final-v3.js?v=20260829-2');
  const ensurePresence=()=>ensureScript('data-dm-presence','/presence.js?v=20260829-7','__dmPresenceLoaded');

  const ensureBroadcast=()=>{
    ensureStyle('data-dm-broadcast','/broadcast-v1.css?v=20260829-5');
    ensureScript('data-dm-broadcast','/broadcast-v1.js?v=20260829-5','__dmBroadcastV5');
  };

  const ensureMaxUI=()=>{
    ensureStyle('data-dm-max-ui','/max-ui-v1.css?v=20260829-1');
    ensureScript('data-dm-max-ui','/max-ui-v1.js?v=20260829-2','__dmMaxUIV1');
  };

  const ensureNavCleanup=()=>ensureScript('data-dm-nav-cleanup','/nav-cleanup-v1.js?v=20260829-2','__dmNavCleanupV1');

  const ensureServiceControls=()=>{
    if(!document.getElementById('serviceList'))return;
    if(window.__dmServicesControlsV2){window.dmEnsureServicesModal?.();return;}
    if(has('script[data-dm-services-controls]'))return;
    const s=document.createElement('script');s.src='/services-controls-v1.js?v=20260829-3';s.defer=true;s.dataset.dmServicesControls='1';s.onload=()=>window.dmEnsureServicesModal?.();document.body.appendChild(s);
  };

  ensureOrderProxy();
  ensureUnifiedTheme();
  ensurePerformance();
  ensureLogoHover();
  clearLocks();

  let refreshQueued=false;
  const refreshGlobalLayers=()=>{
    if(refreshQueued)return;
    refreshQueued=true;
    requestAnimationFrame(()=>{
      refreshQueued=false;
      clearLocks();
      removeBuggyNav();
      removeMotionSettings();
      ensureUnifiedTheme();
      ensurePerformance();
      ensureLogoHover();
      ensureLanguageBase();
      ensureServiceControls();
      ensureNavCleanup();
      ensureCartDrawerFix();
      ensurePresence();
      ensureBroadcast();
      ensureMaxUI();
      ensureInteraction();
      ensureUISounds();
      ensureSiteShell();
      ensureAccountUI();
      setTimeout(removeMotionSettings,80);
    });
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{refreshGlobalLayers();setTimeout(ensureLanguageFinal,120)},{once:true});
  else{refreshGlobalLayers();setTimeout(ensureLanguageFinal,120)}

  document.addEventListener('dm:pagechange',refreshGlobalLayers);
  setTimeout(removeBuggyNav,50);
  setTimeout(clearLocks,250);
})();
