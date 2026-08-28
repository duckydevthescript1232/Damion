(()=>{
  const BRAND='Damiønmusic';
  const fixBrandText=v=>String(v||'').replaceAll('Damiønmusicmusic',BRAND).replace(/Damiøn(?!music)/g,BRAND);
  document.querySelectorAll('.brand-name').forEach(el=>el.textContent=BRAND);
  document.querySelectorAll('.footer-brand b').forEach(el=>el.textContent=BRAND);
  document.querySelectorAll('img[alt*="Damiøn"]').forEach(el=>el.alt='Damiønmusic logo');
  document.title=fixBrandText(document.title);
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);for(const n of nodes){if(n.nodeValue&&n.nodeValue.includes('Damiøn'))n.nodeValue=fixBrandText(n.nodeValue)}

  // Track order should live in the customer menu/order area, not twice in the main navigation.
  document.querySelectorAll('.nav-actions a[href="/order"], [data-orders-link]').forEach(el=>el.remove());

  const nav=document.querySelector('.nav-actions');
  if(nav&&!nav.querySelector('.dm-menu-btn')){
    const btn=document.createElement('button');btn.type='button';btn.className='btn dm-menu-btn';btn.setAttribute('aria-label','Open customer menu');btn.innerHTML='☰';nav.appendChild(btn);
    const backdrop=document.createElement('div');backdrop.className='dm-side-backdrop';
    const panel=document.createElement('aside');panel.className='dm-sidepanel';panel.setAttribute('aria-label','Customer menu');panel.innerHTML=`
      <div class="dm-side-head"><div><small style="color:#7f7f8a">Damiønmusic</small><br><b>Customer area</b></div><button class="dm-side-close" type="button" aria-label="Close menu">×</button></div>
      <div class="dm-side-links">
        <a class="dm-side-link" href="/order#messages"><span class="dm-side-icon">✉</span><span><b>Messages</b><small>Open your order conversation</small></span><span>›</span></a>
        <a class="dm-side-link" href="/order"><span class="dm-side-icon">◎</span><span><b>Track order</b><small>Status, progress and downloads</small></span><span>›</span></a>
        <button class="dm-side-link" id="dmSettingsOpen" type="button" style="width:100%;color:inherit;text-align:left"><span class="dm-side-icon">⚙</span><span><b>Settings</b><small>Control visual effects</small></span><span>›</span></button>
      </div>
      <div class="dm-side-settings" id="dmSettingsBox" hidden>
        <div style="font-weight:850;margin-bottom:12px">Visual settings</div>
        <div class="dm-toggle-row"><span>Smooth hover effects</span><button class="dm-switch on" id="dmMotionToggle" type="button" aria-label="Toggle smooth effects"><i></i></button></div>
      </div>`;
    document.body.append(backdrop,panel);
    const close=()=>{backdrop.classList.remove('open');panel.classList.remove('open');document.body.style.overflow=''};
    const open=()=>{backdrop.classList.add('open');panel.classList.add('open');document.body.style.overflow='hidden'};
    btn.addEventListener('click',open);backdrop.addEventListener('click',close);panel.querySelector('.dm-side-close').addEventListener('click',close);
    document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
    const settingsBtn=panel.querySelector('#dmSettingsOpen'),settingsBox=panel.querySelector('#dmSettingsBox'),toggle=panel.querySelector('#dmMotionToggle');
    settingsBtn.addEventListener('click',()=>{settingsBox.hidden=!settingsBox.hidden});
    const reduced=localStorage.getItem('damion_reduce_effects')==='1';document.body.classList.toggle('dm-reduced',reduced);toggle.classList.toggle('on',!reduced);
    toggle.addEventListener('click',()=>{const next=!document.body.classList.contains('dm-reduced');document.body.classList.toggle('dm-reduced',next);toggle.classList.toggle('on',!next);localStorage.setItem('damion_reduce_effects',next?'1':'0')});
  }

  const previewHost=document.getElementById('trackList');
  if(previewHost){
    previewHost.innerHTML='<div class="dm-preview-shell"><div class="dm-art">D</div><div><div class="dm-preview-title">Official Damiønmusic preview</div><div class="dm-preview-sub">One real preview only · from your uploaded track</div></div><div class="dm-player-controls"><button class="dm-play" type="button" aria-label="Play preview">▶</button><span class="dm-time">0:00 / 0:00</span><input class="dm-range" type="range" min="0" max="100" value="0" aria-label="Preview position"><span aria-hidden="true">🔊</span><input class="dm-volume" type="range" min="0" max="1" step="0.05" value="0.85" aria-label="Volume"></div></div>';
    const audio=new Audio('/assets/preview/damionmusic-preview.mp3?v=20260828-1');const play=previewHost.querySelector('.dm-play'),seek=previewHost.querySelector('.dm-range'),vol=previewHost.querySelector('.dm-volume'),time=previewHost.querySelector('.dm-time');audio.preload='metadata';audio.volume=.85;
    const fmt=s=>`${Math.floor((s||0)/60)}:${String(Math.floor((s||0)%60)).padStart(2,'0')}`;
    play.addEventListener('click',()=>audio.paused?audio.play().catch(()=>{}):audio.pause());audio.addEventListener('play',()=>play.textContent='Ⅱ');audio.addEventListener('pause',()=>play.textContent='▶');audio.addEventListener('ended',()=>{play.textContent='▶';seek.value='0'});audio.addEventListener('loadedmetadata',()=>time.textContent=`0:00 / ${fmt(audio.duration)}`);audio.addEventListener('timeupdate',()=>{seek.value=audio.duration?String(audio.currentTime/audio.duration*100):'0';time.textContent=`${fmt(audio.currentTime)} / ${fmt(audio.duration)}`});seek.addEventListener('input',()=>{if(audio.duration)audio.currentTime=Number(seek.value)/100*audio.duration});vol.addEventListener('input',()=>audio.volume=Number(vol.value));
  }

  // Premium spotlight/3D hover effect. Event delegation also catches service cards rendered later.
  const hoverSelector='.card,.starter-card,.service-row,.price-card,.dm-preview-shell,.compare-box,.soft-card';
  const mark=()=>document.querySelectorAll(hoverSelector).forEach(el=>el.classList.add('dm-hoverfx'));mark();
  new MutationObserver(mark).observe(document.body,{childList:true,subtree:true});
  document.addEventListener('pointermove',e=>{const el=e.target.closest?.(hoverSelector);if(!el||document.body.classList.contains('dm-reduced'))return;el.classList.add('dm-hoverfx');const r=el.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;el.style.setProperty('--mx',`${x}px`);el.style.setProperty('--my',`${y}px`);const ry=((x/r.width)-.5)*4,rx=((y/r.height)-.5)*-4;el.style.transform=`perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`});
  document.addEventListener('pointerout',e=>{const el=e.target.closest?.(hoverSelector);if(!el)return;if(e.relatedTarget&&el.contains(e.relatedTarget))return;el.style.transform=''});
})();