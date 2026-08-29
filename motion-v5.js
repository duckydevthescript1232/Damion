(()=>{
  if(window.__dmMotionV5)return;
  window.__dmMotionV5=true;

  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hoverSelector='.service-row,.starter-card,.price-card,.card,.dm-preview-shell,.hero-studio-shot,.brand';
  const mark=()=>document.querySelectorAll(hoverSelector).forEach(el=>el.classList.add('dm-hoverfx'));
  mark();
  new MutationObserver(mark).observe(document.body,{childList:true,subtree:true});

  const nativeView=!reduced && ('startViewTransition' in document) && !!window.CSS?.supports?.('view-transition-name: root');
  if(nativeView)document.documentElement.classList.add('dm-native-view');
  requestAnimationFrame(()=>document.documentElement.classList.add('dm-motion-ready'));

  if(reduced||nativeView)return;

  /* Fallback only: tiny fade/glide before normal same-origin navigation. */
  document.addEventListener('click',e=>{
    if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    const a=e.target.closest?.('a[href]');
    if(!a)return;
    if(a.target&&a.target!=='_self')return;
    if(a.hasAttribute('download'))return;

    const raw=a.getAttribute('href')||'';
    if(!raw||raw.startsWith('#')||raw.startsWith('javascript:')||raw.startsWith('mailto:')||raw.startsWith('tel:'))return;

    let url;
    try{url=new URL(a.href,location.href)}catch(_){return}
    if(url.origin!==location.origin)return;
    if(url.pathname===location.pathname&&url.search===location.search&&url.hash)return;

    e.preventDefault();
    document.documentElement.classList.add('dm-page-leaving');
    setTimeout(()=>{location.href=url.href},225);
  });

  window.addEventListener('pageshow',()=>document.documentElement.classList.remove('dm-page-leaving'));
})();
