(()=>{
  if(window.__dmButtonFxReady) return;
  window.__dmButtonFxReady=true;

  const selector=[
    '.btn',
    'button:not(.dm-switch)',
    '.payment-choice',
    '.package',
    '.addon',
    '.service-row',
    '.browse-card',
    '.dm-builder-option',
    '.starter-card',
    '.tplay',
    '.dm-play',
    '.dm-side-link',
    '.mobilebar a'
  ].join(',');

  const mark=()=>{
    document.querySelectorAll(selector).forEach(el=>{
      if(el.closest('#paypalButtons')) return;
      el.classList.add('dm-btnfx');
    });
  };
  mark();
  new MutationObserver(mark).observe(document.body,{childList:true,subtree:true});

  function ripple(el,e){
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r=el.getBoundingClientRect();
    const x=(e.clientX||r.left+r.width/2)-r.left;
    const y=(e.clientY||r.top+r.height/2)-r.top;
    const dot=document.createElement('span');
    dot.className='dm-btn-ripple';
    dot.style.left=`${x}px`;
    dot.style.top=`${y}px`;
    el.appendChild(dot);
    setTimeout(()=>dot.remove(),500);
  }

  document.addEventListener('pointerdown',e=>{
    if(e.button!==0) return;
    const el=e.target.closest?.('.dm-btnfx');
    if(!el || el.disabled || el.getAttribute('aria-disabled')==='true') return;
    el.classList.add('dm-fx-down');
    ripple(el,e);
  },{passive:true});

  const release=e=>{
    const el=e.target.closest?.('.dm-btnfx');
    if(el) el.classList.remove('dm-fx-down');
  };
  document.addEventListener('pointerup',release,{passive:true});
  document.addEventListener('pointercancel',release,{passive:true});
  document.addEventListener('pointerout',e=>{
    const el=e.target.closest?.('.dm-btnfx');
    if(el && (!e.relatedTarget || !el.contains(e.relatedTarget))) el.classList.remove('dm-fx-down');
  },{passive:true});
})();
