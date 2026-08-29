(()=>{
  if(window.__dmMotionV5)return;
  window.__dmMotionV5=true;

  const hoverSelector='.service-row,.starter-card,.price-card,.card,.dm-preview-shell,.hero-studio-shot,.brand';
  const mark=()=>document.querySelectorAll(hoverSelector).forEach(el=>el.classList.add('dm-hoverfx'));
  mark();
  new MutationObserver(mark).observe(document.body,{childList:true,subtree:true});

  /* Page navigation is CSS/native only. No click delays and no fake exit animation. */
  document.documentElement.classList.remove('dm-page-leaving','dm-motion-ready','dm-native-view');

  /* Chrome/Opera can prerender a nav target while the pointer is considering it.
     That makes the next document ready before the click and keeps the real transition fluid. */
  try{
    if(HTMLScriptElement.supports?.('speculationrules')&&!document.querySelector('script[data-dm-speculation]')){
      const rules=document.createElement('script');
      rules.type='speculationrules';
      rules.dataset.dmSpeculation='1';
      rules.textContent=JSON.stringify({
        prerender:[{where:{selector_matches:'.navlinks a[href]'},eagerness:'moderate'}],
        prefetch:[{where:{selector_matches:'a[href]'},eagerness:'conservative'}]
      });
      document.head.appendChild(rules);
    }
  }catch(err){console.debug('Speculation rules unavailable',err)}

  /* Fallback warming for browsers without speculation rules. */
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
