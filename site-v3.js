(()=>{
  if(!document.querySelector('link[data-dm-brandfx]')){const l=document.createElement('link');l.rel='stylesheet';l.href='/brandfx.css?v=20260828-1';l.dataset.dmBrandfx='1';document.head.appendChild(l)}
  const BRAND='DamianMusic';
  const AUDIO='https://wutlhceqkioshepfbykf.supabase.co/storage/v1/object/public/service-media/site/damianmusic-preview-full.mp3?v=20260828-full-1';
  const fixBrandText=v=>String(v||'').replaceAll('Damiønmusicmusic',BRAND).replaceAll('Damiønmusic',BRAND).replaceAll('DAMIØNMUSIC','DAMIANMUSIC').replaceAll('Damiøn',BRAND).replaceAll('DAMIØN','DAMIANMUSIC');

  document.querySelectorAll('.brand-name').forEach(el=>el.textContent=BRAND);
  document.querySelectorAll('.footer-brand b').forEach(el=>el.textContent=BRAND);
  document.querySelectorAll('img[src*="/assets/logo.svg"],img[alt*="Damiøn"],img[alt*="Damian"]').forEach(el=>el.alt='DamianMusic logo');
  document.title=fixBrandText(document.title);
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);for(const n of nodes){if(n.nodeValue&&(n.nodeValue.includes('Damiøn')||n.nodeValue.includes('DAMIØN')))n.nodeValue=fixBrandText(n.nodeValue)}

  document.querySelectorAll('.nav-actions a[href="/order"], [data-orders-link]').forEach(el=>el.remove());

  const nav=document.querySelector('.nav-actions');
  if(nav&&!nav.querySelector('.dm-menu-btn')){
    const btn=document.createElement('button');btn.type='button';btn.className='btn dm-menu-btn';btn.setAttribute('aria-label','Open customer menu');btn.innerHTML='<span aria-hidden="true">☰</span>';nav.appendChild(btn);
    const backdrop=document.createElement('div');backdrop.className='dm-side-backdrop';
    const panel=document.createElement('aside');panel.className='dm-sidepanel';panel.setAttribute('aria-label','Customer menu');panel.innerHTML=`
      <div class="dm-side-head"><div><small>DamianMusic</small><br><b>Customer area</b></div><button class="dm-side-close" type="button" aria-label="Close menu">×</button></div>
      <div class="dm-side-links">
        <a class="dm-side-link" href="/order#messages"><span><b>Messages</b><small>Open your order conversation</small></span><span>↗</span></a>
        <a class="dm-side-link" href="/order"><span><b>Track order</b><small>Status, progress and downloads</small></span><span>↗</span></a>
        <button class="dm-side-link" id="dmSettingsOpen" type="button"><span><b>Settings</b><small>Motion preference</small></span><span>+</span></button>
      </div>
      <div class="dm-side-settings" id="dmSettingsBox" hidden><div class="dm-toggle-row"><span>Smooth hover effects</span><button class="dm-switch on" id="dmMotionToggle" type="button" aria-label="Toggle smooth effects"><i></i></button></div></div>`;
    document.body.append(backdrop,panel);
    const close=()=>{backdrop.classList.remove('open');panel.classList.remove('open');document.body.style.overflow=''};
    const open=()=>{backdrop.classList.add('open');panel.classList.add('open');document.body.style.overflow='hidden'};
    btn.addEventListener('click',open);backdrop.addEventListener('click',close);panel.querySelector('.dm-side-close').addEventListener('click',close);document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
    const settingsBtn=panel.querySelector('#dmSettingsOpen'),settingsBox=panel.querySelector('#dmSettingsBox'),toggle=panel.querySelector('#dmMotionToggle');settingsBtn.addEventListener('click',()=>{settingsBox.hidden=!settingsBox.hidden});
    const reduced=localStorage.getItem('damion_reduce_effects')==='1';document.body.classList.toggle('dm-reduced',reduced);toggle.classList.toggle('on',!reduced);toggle.addEventListener('click',()=>{const next=!document.body.classList.contains('dm-reduced');document.body.classList.toggle('dm-reduced',next);toggle.classList.toggle('on',!next);localStorage.setItem('damion_reduce_effects',next?'1':'0')});
  }

  const previewHost=document.getElementById('trackList');
  if(previewHost){
    previewHost.innerHTML=`<div class="dm-preview-shell">
      <div class="dm-preview-copy"><span class="dm-preview-label">DamianMusic / preview</span><div class="dm-preview-title">Official audio preview</div><div class="dm-preview-sub">Full supplied track.</div></div>
      <div class="dm-player-controls"><button class="dm-play" type="button" aria-label="Play audio" disabled>▶</button><div class="dm-seek-wrap"><input class="dm-range" type="range" min="0" max="100" value="0" aria-label="Track position" disabled><div class="dm-time">Loading audio…</div></div><label class="dm-volume-wrap"><span>VOL</span><input class="dm-volume" type="range" min="0" max="1" step="0.05" value="0.85" aria-label="Volume"></label></div>
    </div>`;
    const audio=new Audio(AUDIO);const play=previewHost.querySelector('.dm-play'),seek=previewHost.querySelector('.dm-range'),vol=previewHost.querySelector('.dm-volume'),time=previewHost.querySelector('.dm-time');audio.preload='metadata';audio.volume=.85;
    const fmt=s=>`${Math.floor((s||0)/60)}:${String(Math.floor((s||0)%60)).padStart(2,'0')}`;
    const ready=()=>{play.disabled=false;seek.disabled=false;time.textContent=`${fmt(audio.currentTime)} / ${fmt(audio.duration)}`};
    play.addEventListener('click',()=>audio.paused?audio.play().catch(()=>{time.textContent='Could not play audio'}):audio.pause());audio.addEventListener('loadedmetadata',ready);audio.addEventListener('canplay',ready);audio.addEventListener('error',()=>{play.disabled=true;seek.disabled=true;time.textContent='Full preview is being updated…'});audio.addEventListener('play',()=>play.textContent='Ⅱ');audio.addEventListener('pause',()=>play.textContent='▶');audio.addEventListener('ended',()=>{play.textContent='▶';seek.value='0'});audio.addEventListener('timeupdate',()=>{seek.value=audio.duration?String(audio.currentTime/audio.duration*100):'0';time.textContent=`${fmt(audio.currentTime)} / ${fmt(audio.duration)}`});seek.addEventListener('input',()=>{if(audio.duration)audio.currentTime=Number(seek.value)/100*audio.duration});vol.addEventListener('input',()=>audio.volume=Number(vol.value));audio.load();
  }

  const hoverSelector='.service-row,.starter-card,.price-card,.dm-preview-shell,.hero-studio-shot,.brand';
  const mark=()=>document.querySelectorAll(hoverSelector).forEach(el=>el.classList.add('dm-hoverfx'));mark();new MutationObserver(mark).observe(document.body,{childList:true,subtree:true});
  document.addEventListener('pointermove',e=>{const el=e.target.closest?.(hoverSelector);if(!el||document.body.classList.contains('dm-reduced'))return;const r=el.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;el.style.setProperty('--mx',`${x}px`);el.style.setProperty('--my',`${y}px`);if(el.classList.contains('brand')){const ry=((x/r.width)-.5)*4,rx=((y/r.height)-.5)*-3;el.style.transform=`perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-1px)`}else if(el.classList.contains('hero-studio-shot')){const ry=((x/r.width)-.5)*2.6,rx=((y/r.height)-.5)*-2.6;el.style.transform=`perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`}else{const ry=((x/r.width)-.5)*1.6,rx=((y/r.height)-.5)*-1.6;el.style.transform=`perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`}});
  document.addEventListener('pointerout',e=>{const el=e.target.closest?.(hoverSelector);if(!el)return;if(e.relatedTarget&&el.contains(e.relatedTarget))return;el.style.transform=''});
})();
