(()=>{
  if(window.__dmButtonFxReady)return;
  window.__dmButtonFxReady=true;

  const selector=['.btn','button:not(.dm-switch)','.payment-choice','.package','.addon','.service-row','.browse-card','.dm-builder-option','.starter-card','.tplay','.dm-play','.dm-side-link','.mobilebar a'].join(',');
  const resolve=target=>{
    const el=target?.closest?.(selector);
    if(!el||el.closest('#paypalButtons'))return null;
    el.classList.add('dm-btnfx');
    return el;
  };
  const mark=()=>document.querySelectorAll(selector).forEach(el=>{if(!el.closest('#paypalButtons'))el.classList.add('dm-btnfx')});

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mark,{once:true});else mark();
  document.addEventListener('dm:pagechange',()=>requestAnimationFrame(mark));

  document.addEventListener('pointerdown',e=>{
    if(e.button!==0)return;
    const el=resolve(e.target);
    if(!el||el.disabled||el.getAttribute('aria-disabled')==='true')return;
    el.classList.add('dm-fx-down');
  },{passive:true});

  const release=e=>resolve(e.target)?.classList.remove('dm-fx-down');
  document.addEventListener('pointerup',release,{passive:true});
  document.addEventListener('pointercancel',release,{passive:true});
  document.addEventListener('pointerover',e=>{resolve(e.target)},{passive:true});
})();
