(()=>{
  if(window.__dmMotionV5)return;
  window.__dmMotionV5=true;

  const hoverSelector='.service-row,.starter-card,.price-card,.card,.dm-preview-shell,.hero-studio-shot,.brand';
  const mark=()=>document.querySelectorAll(hoverSelector).forEach(el=>el.classList.add('dm-hoverfx'));
  mark();
  new MutationObserver(mark).observe(document.body,{childList:true,subtree:true});

  /* Navigation is handled only by CSS cross-document View Transitions now.
     No click delays, no fake exit class, no second animation fighting it. */
  document.documentElement.classList.remove('dm-page-leaving','dm-motion-ready','dm-native-view');

  /* Warm internal pages before the click so the real navigation transition has less work to wait for. */
  const prefetched=new Set();
  const warm=a=>{
    if(!a||a.target==='_blank'||a.hasAttribute('download'))return;
    const raw=a.getAttribute('href')||'';
    if(!raw||raw.startsWith('#')||raw.startsWith('mailto:')||raw.startsWith('tel:')||raw.startsWith('javascript:'))return;
    let url;
    try{url=new URL(a.href,location.href)}catch(_){return}
    if(url.origin!==location.origin)return;
    url.hash='';
    if(url.href===location.href.split('#')[0]||prefetched.has(url.href))return;
    prefetched.add(url.href);
    const link=document.createElement('link');
    link.rel='prefetch';
    link.as='document';
    link.href=url.href;
    document.head.appendChild(link);
  };

  document.addEventListener('pointerover',e=>warm(e.target.closest?.('a[href]')),{passive:true});
  document.addEventListener('focusin',e=>warm(e.target.closest?.('a[href]')));

  const warmNav=()=>document.querySelectorAll('.navlinks a[href],.nav-actions a[href]').forEach(warm);
  if('requestIdleCallback' in window)requestIdleCallback(warmNav,{timeout:1200});
  else setTimeout(warmNav,500);
})();
