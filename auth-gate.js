(()=>{
  /* Site-wide customer/admin login gate removed.
     The public website stays open. Private owner tools remain protected separately. */
  document.documentElement.classList.remove('dm-auth-locking');
  const gate=document.getElementById('dmAuthGate');
  if(gate)gate.remove();
})();
