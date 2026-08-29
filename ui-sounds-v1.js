(()=>{
  if(window.__dmUISoundsV2)return;
  window.__dmUISoundsV2=true;

  const AudioCtx=window.AudioContext||window.webkitAudioContext;
  if(!AudioCtx)return;

  let ctx=null;
  let unlocked=false;
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

  const noiseTick=(volume=.018,duration=.026,cutoff=1300)=>{
    const c=getCtx();
    if(!c||!unlocked)return;
    const frames=Math.max(1,Math.floor(c.sampleRate*duration));
    const buffer=c.createBuffer(1,frames,c.sampleRate);
    const data=buffer.getChannelData(0);
    for(let i=0;i<frames;i++){
      const env=1-(i/frames);
      data[i]=(Math.random()*2-1)*env;
    }
    const src=c.createBufferSource();
    const hp=c.createBiquadFilter();
    const gain=c.createGain();
    hp.type='highpass';
    hp.frequency.value=cutoff;
    hp.Q.value=.45;
    const now=c.currentTime;
    gain.gain.setValueAtTime(volume,now);
    gain.gain.exponentialRampToValueAtTime(.0001,now+duration);
    src.buffer=buffer;
    src.connect(hp);hp.connect(gain);gain.connect(c.destination);
    src.start(now);
  };

  const lowTap=(freq=180,volume=.0045,duration=.032)=>{
    const c=getCtx();
    if(!c||!unlocked)return;
    const now=c.currentTime;
    const osc=c.createOscillator();
    const gain=c.createGain();
    osc.type='sine';
    osc.frequency.setValueAtTime(freq,now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(70,freq*.72),now+duration);
    gain.gain.setValueAtTime(volume,now);
    gain.gain.exponentialRampToValueAtTime(.0001,now+duration);
    osc.connect(gain);gain.connect(c.destination);
    osc.start(now);osc.stop(now+duration+.01);
  };

  const clickSound=(kind='normal')=>{
    const now=performance.now();
    if(now-lastClick<65)return;
    lastClick=now;

    if(kind==='primary'){
      noiseTick(.016,.028,1150);
      lowTap(165,.0048,.035);
      return;
    }
    if(kind==='close'){
      noiseTick(.011,.022,950);
      lowTap(135,.0032,.028);
      return;
    }
    if(kind==='select'){
      noiseTick(.013,.022,1500);
      return;
    }
    noiseTick(.0115,.021,1350);
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

  window.dmUISound=(kind='normal')=>{unlock();clickSound(kind);};
})();
