(()=>{
  if(window.__dmMotionV5)return;
  window.__dmMotionV5=true;

  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hoverSelector='.service-row,.starter-card,.price-card,.card,.browse-card,.dm-preview-shell,.hero-studio-shot,.brand';

  const mark=()=>{
    document.querySelectorAll(hoverSelector).forEach(el=>el.classList.add('dm-hoverfx'));
  };

  const enter=()=>{
    mark();
    const main=document.querySelector('main');
    if(!main||reduced||document.body.classList.contains('dm-reduced')||typeof main.animate!=='function')return;
    main.animate([
      {opacity:.985,transform:'translate3d(0,2px,0)'},
      {opacity:1,transform:'translate3d(0,0,0)'}
    ],{
      duration:90,
      easing:'cubic-bezier(.2,.8,.2,1)',
      fill:'both'
    });
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enter,{once:true});
  else enter();

  new MutationObserver(records=>{
    let needsMark=false;
    for(const record of records){
      if(record.addedNodes.length){needsMark=true;break;}
    }
    if(needsMark)requestAnimationFrame(mark);
  }).observe(document.documentElement,{childList:true,subtree:true});

  document.addEventListener('dm:pagechange',()=>requestAnimationFrame(mark));
  history.scrollRestoration='auto';

  document.documentElement.classList.remove('dm-page-leaving','dm-motion-ready','dm-native-view','dm-soft-nav-active');
})();
