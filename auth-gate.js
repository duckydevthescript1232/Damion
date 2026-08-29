(()=>{
  window.__dmAuthGate=true;
  const clearLocks=()=>{
    document.documentElement.classList.remove('dm-auth-locking');
    document.body?.classList.remove('dm-auth-locking');
    document.getElementById('dmAuthGate')?.remove();
  };
  clearLocks();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',clearLocks,{once:true});
  setTimeout(clearLocks,250);
  setTimeout(clearLocks,1200);
})();
