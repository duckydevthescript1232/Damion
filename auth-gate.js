(()=>{
  /* Site-wide customer/admin login gate removed.
     The public website stays open. Private owner tools remain protected separately. */
  document.documentElement.classList.remove('dm-auth-locking');
  const gate=document.getElementById('dmAuthGate');
  if(gate)gate.remove();

  /* Presence runs for everyone so visits can be counted, but presence.js only
     renders the detailed live GUI when this browser has a valid owner session. */
  if(!document.querySelector('script[data-dm-presence]')){
    const s=document.createElement('script');
    s.src='/presence.js?v=20260829-6';
    s.defer=true;
    s.dataset.dmPresence='1';
    document.head.appendChild(s);
  }
})();
