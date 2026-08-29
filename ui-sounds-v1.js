(()=>{
  if(window.__dmUISoundsV3)return;
  window.__dmUISoundsV3=true;

  const AudioCtx=window.AudioContext||window.webkitAudioContext;
  if(!AudioCtx)return;

  let ctx=null;
  let unlocked=false;
  let lastClick=0;
  let lastHover=0;

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

  const makeNoise=(duration=.045)=>{
    const c=getCtx();
    if(!c)return null;
    const frames=Math.max(1,Math.floor(c.sampleRate*duration));
    const buffer=c.createBuffer(1,frames,c.sampleRate);
    const data=buffer.getChannelData(0);
    for(let i=0;i<frames;i++){
      const x=i/frames;
      const env=Math.pow(1-x,1.8);
      data[i]=(Math.random()*2-1)*env;
    }
    const src=c.createBufferSource();
    src.buffer=buffer;
    return src;
  };

  const swoosh=(volume=.0085,duration=.048,from=850,to=2200)=>{
    const c=getCtx();
    if(!c||!unlocked)return;
    const src=makeNoise(duration);if(!src)return;
    const bp=c.createBiquadFilter();
    const gain=c.createGain();
    const now=c.currentTime;
    bp.type='bandpass';bp.Q.value=.65;
    bp.frequency.setValueAtTime(from,now);
    bp.frequency.exponentialRampToValueAtTime(to,now+duration);
    gain.gain.setValueAtTime(.0001,now);
    gain.gain.linearRampToValueAtTime(volume,now+.009);
    gain.gain.exponentialRampToValueAtTime(.0001,now+duration);
    src.connect(bp);bp.connect(gain);gain.connect(c.destination);
    src.start(now);
  };

  const softBody=(freq=150,volume=.0042,duration=.052)=>{
    const c=getCtx();
    if(!c||!unlocked)return;
    const now=c.currentTime;
    const osc=c.createOscillator();
    const gain=c.createGain();
    osc.type='sine';
    osc.frequency.setValueAtTime(freq,now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(72,freq*.63),now+duration);
    gain.gain.setValueAtTime(volume,now);
    gain.gain.exponentialRampToValueAtTime(.0001,now+duration);
    osc.connect(gain);gain.connect(c.destination);
    osc.start(now);osc.stop(now+duration+.01);
  };

  const clickSound=(kind='normal')=>{
    const now=performance.now();
    if(now-lastClick<70)return;
    lastClick=now;
    if(kind==='primary'){
      swoosh(.012,.055,720,1800);softBody(158,.0052,.058);return;
    }
    if(kind==='close'){
      swoosh(.0065,.038,1350,700);softBody(118,.0028,.038);return;
    }
    if(kind==='select'){
      swoosh(.0078,.038,1100,1900);return;
    }
    swoosh(.0075,.042,900,1700);softBody(142,.0027,.04);
  };

  const hoverSound=()=>{
    if(!unlocked||!window.matchMedia('(hover:hover) and (pointer:fine)').matches)return;
    const now=performance.now();
    if(now-lastHover<240)return;
    lastHover=now;
    swoosh(.0026,.032,1150,1750);
  };

  const soundTarget=target=>target?.closest?.('button, a.btn, .package, .addon, .service-configure, .checkout-continue, .checkout-back, .dm-side-link, .service-row, .browse-card');
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

  document.addEventListener('pointerover',e=>{
    const el=soundTarget(e.target);
    if(!el||el.matches(':disabled,[aria-disabled="true"]')||el.closest('[data-dm-sound="off"]'))return;
    if(e.relatedTarget&&el.contains(e.relatedTarget))return;
    hoverSound();
  },{capture:true,passive:true});

  document.addEventListener('keydown',e=>{
    if(e.key!=='Enter'&&e.key!==' ')return;
    const el=soundTarget(e.target);
    if(!el||el.matches(':disabled,[aria-disabled="true"]')||el.closest('[data-dm-sound="off"]'))return;
    unlock();clickSound(kindFor(el));
  },true);

  window.dmUISound=(kind='normal')=>{unlock();clickSound(kind);};
})();
