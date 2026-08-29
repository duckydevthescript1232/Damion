(()=>{
  if(window.__dmMaxUIV1)return;
  window.__dmMaxUIV1=true;
  document.documentElement.classList.add('dm-max-ui');

  const getLang=()=>{try{return (localStorage.getItem('damion_lang')||window.dmGetLanguage?.()||document.documentElement.lang||'en').toLowerCase().startsWith('nl')?'nl':'en'}catch(_){return' en'.trim()}};

  const ensureLangSwitcher=()=>{
    if(document.querySelector('.dm-lang-switch'))return;
    const host=document.querySelector('.nav-actions')||document.querySelector('.checkout-topbar')||document.querySelector('header .nav')||document.querySelector('header');
    if(!host)return;
    const box=document.createElement('div');
    box.className='dm-lang-switch';
    box.dataset.dmNoTranslate='';
    box.setAttribute('aria-label','Language');
    box.innerHTML='<button type="button" data-lang="en">EN</button><button type="button" data-lang="nl">NL</button>';
    host.appendChild(box);
  };

  const updateSwitcher=()=>{
    const lang=getLang();
    document.querySelectorAll('.dm-lang-switch button[data-lang]').forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.lang===lang)));
  };

  // Full reload after changing language is intentional: every legacy/dynamic translation layer
  // starts from the original English HTML, preventing half-English/half-Dutch UI states.
  document.addEventListener('click',e=>{
    const btn=e.target?.closest?.('.dm-lang-switch button[data-lang]');
    if(!btn)return;
    const next=btn.dataset.lang;
    if(next!=='en'&&next!=='nl')return;
    e.preventDefault();
    e.stopImmediatePropagation();
    try{localStorage.setItem('damion_lang',next)}catch(_){}
    document.documentElement.lang=next;
    document.documentElement.classList.add('dm-lang-changing');
    updateSwitcher();
    setTimeout(()=>location.reload(),90);
  },true);

  const liveText={
    en:{online:'online now',today:'visitors today',places:'Checking locations…',details:'Click for details',head:'Live visitor details',now:'Online now',five:'Active 5 min',todayTitle:'Visitors today',total:'Total visitors',rightNow:'Online right now',where:'How many · where',country:'Country breakdown',connecting:'Connecting…'},
    nl:{online:'nu online',today:'bezoekers vandaag',places:'Locaties controleren…',details:'Klik voor details',head:'Live bezoekers',now:'Nu online',five:'Actief 5 min',todayTitle:'Bezoekers vandaag',total:'Totaal bezoekers',rightNow:'Nu online',where:'Aantal · locatie',country:'Per land',connecting:'Verbinden…'}
  };

  const applyPresenceLanguage=()=>{
    const root=document.getElementById('dmLiveVisitors');if(!root)return;
    const t=liveText[getLang()]||liveText.en;
    const label=root.querySelector('.dm-live-label');if(label)label.textContent=t.online;
    const today=root.querySelector('.dm-live-today span');if(today)today.textContent=t.today;
    const places=document.getElementById('dmLivePlaces');if(places&&/Checking locations|Locaties controleren/i.test(places.textContent||''))places.textContent=t.places;
    const hint=root.querySelector('.dm-live-hint');if(hint)hint.textContent=t.details;
    const head=root.querySelector('.dm-live-head b');if(head)head.textContent=t.head;
    const stats=root.querySelectorAll('.dm-live-stat span');
    [t.now,t.five,t.todayTitle,t.total].forEach((txt,i)=>{if(stats[i])stats[i].textContent=txt});
    const sections=root.querySelectorAll('.dm-live-section-title');
    if(sections[0]){sections[0].querySelector('span')&&(sections[0].querySelector('span').textContent=t.rightNow);sections[0].querySelector('small')&&(sections[0].querySelector('small').textContent=t.where)}
    if(sections[1]){sections[1].querySelector('span')&&(sections[1].querySelector('span').textContent=t.todayTitle);sections[1].querySelector('small')&&(sections[1].querySelector('small').textContent=t.country)}
  };

  const forcePresenceVisible=()=>{
    const root=document.getElementById('dmLiveVisitors');if(!root)return;
    root.style.setProperty('display','block','important');
    applyPresenceLanguage();
  };

  const start=()=>{
    ensureLangSwitcher();
    updateSwitcher();
    forcePresenceVisible();
    requestAnimationFrame(()=>{ensureLangSwitcher();updateSwitcher();forcePresenceVisible()});
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  document.addEventListener('dm:pagechange',()=>setTimeout(start,0));
  document.addEventListener('dm:languagechange',()=>setTimeout(()=>{updateSwitcher();applyPresenceLanguage()},0));

  // Presence is injected asynchronously; watch only for its root and stop doing extra work otherwise.
  const mo=new MutationObserver(records=>{
    let relevant=false;
    for(const r of records){for(const n of r.addedNodes){if(n.nodeType===1&&(n.id==='dmLiveVisitors'||n.querySelector?.('#dmLiveVisitors')||n.classList?.contains('dm-lang-switch'))){relevant=true;break}}if(relevant)break}
    if(relevant){ensureLangSwitcher();updateSwitcher();forcePresenceVisible()}
  });
  mo.observe(document.documentElement,{childList:true,subtree:true});
})();
