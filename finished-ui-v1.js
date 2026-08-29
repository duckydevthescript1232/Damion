(()=>{
  if(window.__dmFinishedUiV1)return;
  window.__dmFinishedUiV1=true;
  const root=document.documentElement;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  if(!reduced.matches)root.classList.add('dm-ui-motion');

  let observer;
  const revealNow=el=>requestAnimationFrame(()=>el.classList.add('is-visible'));
  const mountReveals=()=>{
    const targets=[...document.querySelectorAll('[data-reveal]:not([data-ui-bound]),[data-stagger]>*:not([data-ui-bound])')];
    if(!targets.length)return;
    targets.forEach((el,index)=>{
      el.dataset.uiBound='1';
      if(el.parentElement?.hasAttribute('data-stagger'))el.style.setProperty('--dm-delay',Math.min(index%8,7)*70+'ms');
      if(reduced.matches||!('IntersectionObserver'in window)){revealNow(el);return}
      observer?.observe(el);
    });
  };

  const setupObserver=()=>{
    observer?.disconnect();
    observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}
      });
    },{rootMargin:'0px 0px -9% 0px',threshold:.08});
  };

  let ticking=false;
  const updateHeader=()=>{
    document.querySelector('header')?.classList.toggle('dm-scrolled',window.scrollY>18);
    ticking=false;
  };
  window.addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(updateHeader)}},{passive:true});

  const mountTrailer=()=>{
    const frame=document.querySelector('.studio-trailer-frame');
    if(!frame||frame.dataset.tiltBound||reduced.matches||!window.matchMedia('(pointer:fine)').matches)return;
    frame.dataset.tiltBound='1';
    frame.addEventListener('pointermove',event=>{
      const box=frame.getBoundingClientRect();
      const x=(event.clientX-box.left)/box.width-.5;
      const y=(event.clientY-box.top)/box.height-.5;
      frame.style.setProperty('--dm-tilt-x',(x*1.3).toFixed(2)+'deg');
      frame.style.setProperty('--dm-tilt-y',(-y*.9).toFixed(2)+'deg');
      frame.style.setProperty('--dm-shift-y','-3px');
    });
    frame.addEventListener('pointerleave',()=>{
      frame.style.setProperty('--dm-tilt-x','0deg');
      frame.style.setProperty('--dm-tilt-y','0deg');
      frame.style.setProperty('--dm-shift-y','0');
    });
  };

  const syncDrawer=()=>{
    const drawer=document.getElementById('cartDrawer');
    if(!drawer||drawer.dataset.uiObserved)return;
    drawer.dataset.uiObserved='1';
    drawer.setAttribute('aria-label','Shopping cart');
    new MutationObserver(()=>document.body.classList.toggle('dm-cart-open',drawer.classList.contains('open'))).observe(drawer,{attributes:true,attributeFilter:['class']});
  };

  let mountTimer;
  const mount=()=>{
    clearTimeout(mountTimer);
    mountTimer=setTimeout(()=>{mountReveals();mountTrailer();syncDrawer();updateHeader()},20);
  };
  setupObserver();
  mount();
  new MutationObserver(mount).observe(document.body,{childList:true,subtree:true});
  reduced.addEventListener?.('change',()=>location.reload());
})();