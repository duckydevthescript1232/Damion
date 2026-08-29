(()=>{
  if(window.__dmUISoundsV1)return;
  window.__dmUISoundsV1=true;

  const AudioCtx=window.AudioContext||window.webkitAudioContext;
  if(!AudioCtx)return;

  let ctx=null;
  let unlocked=false;
  let lastHover=0;
  let lastClick=0;

  const getCtx=()=>{
    if(!ctx){
      try{ctx=new AudioCtx({latencyHint:'interactive'});}catch(_){try{ctx=new AudioCtx();}catch(__){return null;}}
    }
    return ctx;
  };

  const unlock=()=>{
    const c=getCtx();
    if(!c)return;
    if(c.state==='suspended')c.resume().catch(()=>{});
    unlocked=true;
  };

  const tone=(freq=520,duration=.055,volume=.018,type='sine',endFreq=null)=>{
    const c=getCtx();
    if(!c||!unlocked)return;
    const now=c.currentTime;
    const osc=c.createOscillator();
    const gain=c.createGain();
    osc.type=type;
    osc.frequency.setValueAtTime(freq,now);
    if(endFreq)osc.frequency.exponentialRampToValueAtTime(Math.max(40,endFreq),now+duration);
    gain.gain.setValueAtTime(.0001,now);
    gain.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),now+.008);
    gain.gain.exponentialRampToValueAtTime(.0001,now+duration);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(now);
    osc.stop(now+duration+.012);
  };

  const clickSound=(kind='normal')=>{
    const now=performance.now();
    if(now-lastClick<45)return;
    lastClick=now;
    if(kind==='primary'){
      tone(470,.07,.020,'sine',650);
      setTimeout(()=>tone(720,.045,.010,'sine',790),28);
      return;
    }
    if(kind==='close'){
      tone(390,.06,.015,'triangle',280);
      return;
    }
    if(kind==='select'){
      tone(560,.05,.014,'sine',640);
      return;
    }
    tone(430,.05,.013,'sine',500);
  };

  const soundTarget=target=>target?.closest?.('button, a.btn, .package, .addon, .service-configure, .checkout-continue, .checkout-back');
  const kindFor=el=>{
    if(el.matches('.dm-config-close,[aria-label*="Close" i],.checkout-back'))return 'close';
    if(el.matches('.package,.addon,input[type="checkbox"]'))return 'select';
    if(el.matches('.primary,.checkout-continue,[type="submit"]'))return 'primary';
    return 'normal';
  };

  document.addEventListener('pointerdown',e=>{
    unlock();
    const el=soundTarget(e.target);
    if(!el||el.matches(':disabled,[aria-disabled="true"]')||el.closest('[data-dm-sound="off"]'))return;
    clickSound(kindFor(el));
  },{capture:true,passive:true});

  document.addEventListener('keydown',e=>{
    if(e.key!=='Enter'&&e.key!==' ')return;
    const el=soundTarget(e.target);
    if(!el||el.matches(':disabled,[aria-disabled="true"]')||el.closest('[data-dm-sound="off"]'))return;
    unlock();
    clickSound(kindFor(el));
  },true);

  if(matchMedia('(hover:hover) and (pointer:fine)').matches){
    document.addEventListener('pointerover',e=>{
      if(!unlocked)return;
      const el=soundTarget(e.target);
      if(!el||el.contains(e.relatedTarget)||el.matches(':disabled,[aria-disabled="true"]')||el.closest('[data-dm-sound="off"]'))return;
      const now=performance.now();
      if(now-lastHover<85)return;
      lastHover=now;
      tone(680,.032,.0045,'sine',735);
    },{passive:true});
  }

  window.dmUISound=(kind='normal')=>{unlock();clickSound(kind);};
})();
