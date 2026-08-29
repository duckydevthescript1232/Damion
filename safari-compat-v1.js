(()=>{
  if(window.__dmSafariCompatV1)return;
  window.__dmSafariCompatV1=true;

  const ua=navigator.userAgent||'';
  const isSafari=/Safari/i.test(ua)&&!/Chrome|Chromium|CriOS|FxiOS|EdgiOS|OPiOS|Android/i.test(ua);
  if(!isSafari)return;

  document.documentElement.classList.add('dm-safari');

  window.addEventListener('pageshow',()=>{
    document.documentElement.classList.remove('dm-page-leaving','dm-soft-nav-active','dm-auth-locking');
    document.body?.classList.remove('dm-auth-locking');
    document.getElementById('dmAuthGate')?.remove();
  });

  window.addEventListener('click',e=>{
    const target=e.target instanceof Element?e.target:e.target?.parentElement;
    const a=target?.closest?.('a[href]');
    if(!a||a.target==='_blank'||a.hasAttribute('download'))return;
    const raw=a.getAttribute('href')||'';
    if(!raw||raw.startsWith('#')||raw.startsWith('mailto:')||raw.startsWith('tel:')||raw.startsWith('javascript:'))return;
    let url;try{url=new URL(a.href,location.href)}catch(_){return}
    if(url.origin!==location.origin)return;
    if(url.pathname===location.pathname&&url.search===location.search&&url.hash)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    location.href=url.href;
  },true);

  document.addEventListener('click',e=>{
    const target=e.target instanceof Element?e.target:e.target?.parentElement;
    const button=target?.closest?.('.dm-lang-switch button[data-lang]');
    if(!button)return;
    requestAnimationFrame(()=>{
      try{window.dmSetLanguage?.(button.dataset.lang);}catch(_){}
      document.dispatchEvent(new CustomEvent('dm:pagechange'));
    });
  });
})();
