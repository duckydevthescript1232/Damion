(()=>{
  if(window.__dmMaxUIV1)return;
  window.__dmMaxUIV1=true;
  document.documentElement.classList.add('dm-max-ui');

  const getLang=()=>{try{return (localStorage.getItem('damion_lang')||window.dmGetLanguage?.()||document.documentElement.lang||'en').toLowerCase().startsWith('nl')?'nl':'en'}catch(_){return'en'}};

  const ensureLangSwitcher=()=>document.querySelectorAll('.dm-lang-switch').forEach(el=>el.remove());

  const updateSwitcher=()=>document.querySelectorAll('.dm-lang-switch').forEach(el=>el.remove());

  const applyInstantLanguage=next=>{
    if(next!=='en'&&next!=='nl')return;
    try{localStorage.setItem('damion_lang',next)}catch(_){}
    document.documentElement.lang=next;
    document.body?.setAttribute('data-language',next);

    if(typeof window.dmSetLanguage==='function'){
      window.dmSetLanguage(next);
    }else{
      document.dispatchEvent(new CustomEvent('dm:languagechange',{detail:{lang:next}}));
    }

    updateSwitcher();
    applyPresenceLanguage();

    // Dynamic UI can be re-rendered by other site layers after the language event.
    // A second event on the next frame catches content inserted in the same click.
    requestAnimationFrame(()=>{
      document.dispatchEvent(new CustomEvent('dm:languagechange',{detail:{lang:next}}));
      updateSwitcher();
      applyPresenceLanguage();
    });
  };

  document.addEventListener('click',e=>{
    const btn=e.target?.closest?.('.dm-lang-switch button[data-lang]');
    if(!btn)return;
    const next=btn.dataset.lang;
    if(next!=='en'&&next!=='nl')return;
    e.preventDefault();
    e.stopImmediatePropagation();
    applyInstantLanguage(next);
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

  const mo=new MutationObserver(records=>{
    let relevant=false;
    for(const r of records){for(const n of r.addedNodes){if(n.nodeType===1&&(n.id==='dmLiveVisitors'||n.querySelector?.('#dmLiveVisitors')||n.classList?.contains('dm-lang-switch'))){relevant=true;break}}if(relevant)break}
    if(relevant){ensureLangSwitcher();updateSwitcher();forcePresenceVisible()}
  });
  mo.observe(document.documentElement,{childList:true,subtree:true});
})();
