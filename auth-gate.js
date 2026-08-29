(()=>{
  /* Public website stays open. Private owner tools are protected separately. */
  document.documentElement.classList.remove('dm-auth-locking');
  const gate=document.getElementById('dmAuthGate');
  if(gate)gate.remove();

  if(!document.querySelector('script[data-dm-presence]')){
    const s=document.createElement('script');
    s.src='/presence.js?v=20260829-8';
    s.defer=true;
    s.dataset.dmPresence='1';
    document.head.appendChild(s);
  }
  if(!document.querySelector('script[data-dm-admin-toolbox]')){
    const s=document.createElement('script');
    s.src='/admin-toolbox.js?v=20260829-2';
    s.defer=true;
    s.dataset.dmAdminToolbox='1';
    document.head.appendChild(s);
  }
  if(!document.querySelector('script[data-dm-admin-abuse-v2]')){
    const s=document.createElement('script');
    s.src='/admin-abuse-v2.js?v=20260829-1';
    s.defer=true;
    s.dataset.dmAdminAbuseV2='1';
    document.head.appendChild(s);
  }
})();
