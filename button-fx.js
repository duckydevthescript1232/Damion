(()=>{
  if(window.__dmButtonFxReady) return;
  window.__dmButtonFxReady=true;

  const selector=[
    '.btn',
    'button:not(.dm-switch)',
    '.payment-choice',
    '.package',
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

  let audioCtx=null;
  function playPressSound(stronger=false){
    try{
      const AC=window.AudioContext||window.webkitAudioContext;
      if(!AC) return;
      if(!audioCtx) audioCtx=new AC();
      if(audioCtx.state==='suspended') audioCtx.resume();
      const now=audioCtx.currentTime;
      const out=audioCtx.createGain();
      out.gain.setValueAtTime(stronger?.034:.026,now);
      out.gain.exponentialRampToValueAtTime(.0001,now+.075);
      out.connect(audioCtx.destination);

      const low=audioCtx.createOscillator();
      low.type='sine';
      low.frequency.setValueAtTime(stronger?430:360,now);
      low.frequency.exponentialRampToValueAtTime(stronger?245:215,now+.065);
      low.connect(out);
      low.start(now);
      low.stop(now+.078);

      const highGain=audioCtx.createGain();
      highGain.gain.setValueAtTime(stronger?.012:.009,now);
      highGain.gain.exponentialRampToValueAtTime(.0001,now+.04);
      highGain.connect(audioCtx.destination);
      const high=audioCtx.createOscillator();
      high.type='triangle';
      high.frequency.setValueAtTime(stronger?840:720,now);
      high.frequency.exponentialRampToValueAtTime(stronger?560:470,now+.035);
      high.connect(highGain);
      high.start(now);
      high.stop(now+.045);
    }catch(_){ }
  }

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
    setTimeout(()=>dot.remove(),520);
  }

  document.addEventListener('pointerdown',e=>{
    if(e.button!==0) return;
    const el=e.target.closest?.('.dm-btnfx');
    if(!el || el.disabled || el.getAttribute('aria-disabled')==='true') return;
    el.classList.add('dm-fx-down');
    ripple(el,e);
    playPressSound(el.classList.contains('primary')||el.classList.contains('payment-choice'));
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
