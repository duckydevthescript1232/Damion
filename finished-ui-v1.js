(()=>{
  if(window.__dmFinishedUiV1)return;
  window.__dmFinishedUiV1=true;

  const root=document.documentElement;
  root.classList.remove('dm-ui-motion');

  const revealAll=()=>{
    document.querySelectorAll('[data-reveal],[data-stagger]>*').forEach(el=>{
      el.classList.add('is-visible');
      el.style.removeProperty('--dm-delay');
    });
  };

  const openSupport=trigger=>{
    const panel=document.querySelector('.dm-support-panel');
    const fab=document.querySelector('.dm-support-fab');
    if(panel&&fab){
      panel.classList.add('open');
      panel.setAttribute('aria-hidden','false');
      fab.setAttribute('aria-expanded','true');
      setTimeout(()=>panel.querySelector('textarea')?.focus({preventScroll:true}),50);
      return;
    }
    if(typeof window.openSupportChat==='function')window.openSupportChat(trigger?.dataset?.openSupport||'');
    else document.querySelector('.dm-support-fab')?.click();
  };

  document.addEventListener('click',event=>{
    const trigger=event.target.closest?.('[data-open-support]');
    if(!trigger)return;
    event.preventDefault();
    openSupport(trigger);
  });

  let ticking=false;
  const updateHeader=()=>{
    document.querySelector('header')?.classList.toggle('dm-scrolled',window.scrollY>18);
    ticking=false;
  };
  window.addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(updateHeader)}},{passive:true});

  const syncDrawer=()=>{
    const drawer=document.getElementById('cartDrawer');
    if(!drawer||drawer.dataset.uiObserved)return;
    drawer.dataset.uiObserved='1';
    drawer.setAttribute('aria-label','Shopping cart');
    const sync=()=>document.body.classList.toggle('dm-cart-open',drawer.classList.contains('open'));
    sync();
    new MutationObserver(sync).observe(drawer,{attributes:true,attributeFilter:['class']});
  };

  const mount=()=>{revealAll();syncDrawer();updateHeader()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
  document.addEventListener('dm:pagechange',()=>requestAnimationFrame(mount));
})();
