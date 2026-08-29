(()=>{
  window.__dmAuthGate=true;
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

  ensureSafariCompat();
  clearLocks();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{clearLocks();ensureServiceControls()},{once:true});
  else ensureServiceControls();
  document.addEventListener('dm:pagechange',()=>setTimeout(ensureServiceControls,0));
  setTimeout(clearLocks,250);
  setTimeout(clearLocks,1200);
})();
