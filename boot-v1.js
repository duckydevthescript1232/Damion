(()=>{
  const start=()=>{
    const boot=document.querySelector('.dm-boot');
    if(!boot)return;
    let finished=false;
    const finish=()=>{
      if(finished)return;
      finished=true;
      boot.classList.add('is-out');
      setTimeout(()=>boot.remove(),260);
    };
    /* Never wait for video/audio/network resources. */
    setTimeout(finish,1050);
    window.addEventListener('pageshow',()=>setTimeout(finish,80),{once:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
