(()=>{
  if(window.__dmNavCleanupV1)return;
  window.__dmNavCleanupV1=true;

  const clean=()=>{
    const body=document.body;
    if(!body)return;

    // Work page has been retired. Keep the real audio preview on Home instead.
    document.querySelectorAll('.navlinks a[href="/portfolio"],.mobilebar a[href="/portfolio"],footer a[href="/portfolio"]').forEach(a=>a.remove());
    document.querySelectorAll('a[href="/portfolio"],a[href="/portfolio.html"]').forEach(a=>{
      if(a.closest('.proof-copy')){
        a.href='#preview';
        a.innerHTML='Listen to current preview <span aria-hidden="true">→</span>';
      }
    });

    if(body.classList.contains('home')){
      // Home is now a clean entry point. Service browsing lives on its own page.
      document.querySelector('.home-popular')?.remove();

      const serviceCtas=document.querySelectorAll('.hero-cta a[href="/services"],.home-inline-actions a[href="/services"],.final-actions a[href="/services"],.mobile-project-cta a[href="/services"]');
      serviceCtas.forEach(a=>{
        a.href='/browse-services';
        a.textContent='Browse services';
      });

      // Remove question-style secondary buttons beside the main service CTAs.
      document.querySelectorAll('.home-inline-actions button[data-open-support],.final-actions button[data-open-support],.mobile-project-cta button[data-open-support]').forEach(btn=>btn.remove());

      const finalCopy=document.querySelector('.home-final p');
      if(finalCopy)finalCopy.textContent='Browse the services and choose the option that fits your track.';
    }

    if(body.classList.contains('services')&&!body.classList.contains('browse-services-page')){
      document.querySelectorAll('.page-hero .hero-cta button').forEach(btn=>btn.remove());
    }
  };

  // Deep service links from Browse must use a full load so ?service= reliably opens the configurator.
  document.addEventListener('click',e=>{
    const a=e.target.closest?.('.browse-services-page a[href*="/services?service="]');
    if(!a)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    location.href=a.href;
  },true);

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',clean,{once:true});
  else clean();
  document.addEventListener('dm:pagechange',()=>setTimeout(clean,0));
})();
