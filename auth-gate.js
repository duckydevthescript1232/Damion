(()=>{
  /* Public website must never be blocked by owner/admin tooling. */
  const clearLocks=()=>{
    document.documentElement.classList.remove('dm-auth-locking');
    document.body?.classList.remove('dm-auth-locking');
    document.getElementById('dmAuthGate')?.remove();
  };

  clearLocks();

  const loadScript=(src,key)=>new Promise(resolve=>{
    if(document.querySelector(`script[data-${key}]`)){resolve();return}
    const s=document.createElement('script');
    s.src=src;
    s.async=false;
    s.dataset[key.replace(/^dm-/, '').replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]='1';
    s.setAttribute(`data-${key}`,'1');
    s.onload=()=>resolve();
    s.onerror=()=>resolve();
    document.body.appendChild(s);
  });

  const start=async()=>{
    clearLocks();
    await loadScript('/presence.js?v=20260829-9','dm-presence');
    await loadScript('/admin-toolbox.js?v=20260829-3','dm-admin-toolbox');
    await loadScript('/admin-abuse-v2.js?v=20260829-2','dm-admin-abuse-v2');
    clearLocks();
  };

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',start,{once:true});
  }else{
    start();
  }

  /* Last-resort safety: owner tools may never leave a public page locked. */
  setTimeout(clearLocks,250);
  setTimeout(clearLocks,1200);
})();
