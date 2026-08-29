(()=>{
  const boot=document.querySelector('.dm-boot');
  if(!boot)return;
  let internal=false;
  try{internal=!!document.referrer&&new URL(document.referrer).origin===location.origin}catch(_){}
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const delay=internal?60:(reduced?220:1550);
  const finish=()=>{
    if(!boot.isConnected||boot.classList.contains('is-out'))return;
    boot.classList.add('is-out');
    setTimeout(()=>boot.remove(),760);
  };
  if(document.readyState==='complete')setTimeout(finish,delay);
  else window.addEventListener('load',()=>setTimeout(finish,delay),{once:true});
  setTimeout(finish,3400);
})();
