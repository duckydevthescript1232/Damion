(()=>{
  const boot=document.querySelector('.dm-boot');
  if(!boot)return;
  let internal=false;
  try{internal=!!document.referrer&&new URL(document.referrer).origin===location.origin}catch(_){}
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const delay=internal?40:(reduced?180:920);
  const finish=()=>{
    boot.classList.add('is-out');
    setTimeout(()=>boot.remove(),420);
  };
  if(document.readyState==='complete')setTimeout(finish,delay);
  else window.addEventListener('load',()=>setTimeout(finish,delay),{once:true});
  setTimeout(finish,2200);
})();
