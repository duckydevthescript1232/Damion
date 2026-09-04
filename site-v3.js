(()=>{
  if(!document.querySelector('script[data-dm-auth-gate]')){const s=document.createElement('script');s.src='/auth-gate.js?v=20260904-4';s.async=false;s.dataset.dmAuthGate='1';document.head.appendChild(s)}
  if(!document.querySelector('link[data-dm-brandfx]')){const l=document.createElement('link');l.rel='stylesheet';l.href='/brandfx.css?v=20260828-1';l.dataset.dmBrandfx='1';document.head.appendChild(l)}
  if(!document.querySelector('link[data-dm-buttonfx]')){const l=document.createElement('link');l.rel='stylesheet';l.href='/button-fx.css?v=20260830-1';l.dataset.dmButtonfx='1';document.head.appendChild(l)}
  if(!document.querySelector('link[data-dm-headerv6]')){const l=document.createElement('link');l.rel='stylesheet';l.href='/header-polish-v6.css?v=20260829-1';l.dataset.dmHeaderv6='1';document.head.appendChild(l)}
  if(!document.querySelector('link[data-dm-sidebarv7]')){const l=document.createElement('link');l.rel='stylesheet';l.href='/sidebar-v7.css?v=20260829-1';l.dataset.dmSidebarv7='1';document.head.appendChild(l)}
  if(!document.querySelector('script[data-dm-buttonfx]')){const s=document.createElement('script');s.src='/button-fx.js?v=20260830-1';s.defer=true;s.dataset.dmButtonfx='1';document.head.appendChild(s)}
  if(!document.querySelector('script[data-dm-headerv6]')){const s=document.createElement('script');s.src='/header-polish-v6.js?v=20260829-1';s.defer=true;s.dataset.dmHeaderv6='1';document.head.appendChild(s)}
  if(!document.querySelector('script[data-dm-support]')){const s=document.createElement('script');s.src='/support.js?v=20260829-3';s.defer=true;s.dataset.dmSupport='1';document.head.appendChild(s)}

  const BRAND='Damiønmusic';
  const AUDIO='https://wutlhceqkioshepfbykf.supabase.co/storage/v1/object/public/service-media/site/damianmusic-preview-full.mp3?v=20260828-full-1';
  const fixBrandText=v=>String(v||'').replace(/Damiønmusicmusic/gi,BRAND).replace(/DamianMusic/gi,BRAND).replace(/DamionMusic/gi,BRAND);

  document.querySelectorAll('.brand-name').forEach(el=>el.textContent=BRAND);
  document.querySelectorAll('.footer-brand b').forEach(el=>el.textContent=BRAND);
  document.querySelectorAll('img[src*="/assets/logo.svg"],img[alt*="Damiøn"],img[alt*="Damian"]').forEach(el=>el.alt='Damiønmusic logo');
  document.title=fixBrandText(document.title);

  const navLinks=document.querySelector('.navlinks');
  if(navLinks&&!navLinks.querySelector('a[href="/support"],a[href="support.html"]')){
    const contact=[...navLinks.querySelectorAll('a[href]')].find(a=>/\/contact(?:\.html)?$/.test(new URL(a.href,location.href).pathname));
    if(contact){contact.href='/support';contact.textContent='Support'}
  }
  document.querySelectorAll('.nav-actions a[href="/order"], [data-orders-link]').forEach(el=>el.remove());

  const nav=document.querySelector('.nav-actions');
  if(nav&&!nav.querySelector('.dm-menu-btn')){
    const btn=document.createElement('button');
    btn.type='button';btn.className='btn dm-menu-btn';btn.setAttribute('aria-label','Open customer menu');btn.setAttribute('aria-expanded','false');btn.innerHTML='<span aria-hidden="true">☰</span>';nav.appendChild(btn);
    const backdrop=document.createElement('div');backdrop.className='dm-side-backdrop';
    const icon=path=>`<span class="dm-side-link-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="${path}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`;
    let ownerShortcut='';
    try{if(localStorage.getItem('damion_site_session'))ownerShortcut=`<div class="dm-side-section-label">Owner tools</div><div class="dm-side-links"><a class="dm-side-link dm-side-primary" href="/admin-orders.html#mini-panel">${icon('M7 10V7.5a5 5 0 0 1 10 0V10 M5.5 10h13v9h-13z M12 13.5v2')}<span class="dm-side-link-copy"><b>Open mini admin</b><small>Orders, support and owner controls</small></span><span class="dm-side-link-arrow">›</span></a></div>`}catch(_error){}

    const panel=document.createElement('aside');
    panel.className='dm-sidepanel';panel.setAttribute('aria-label','Customer menu');panel.setAttribute('aria-hidden','true');
    panel.innerHTML=`<div class="dm-side-head"><div class="dm-side-brand"><img src="/assets/logo.svg" alt=""><div class="dm-side-brand-copy"><b>Damiønmusic</b><small>Your studio hub</small></div></div><button class="dm-side-close" type="button" aria-label="Close menu">×</button></div><div class="dm-side-body"><div class="dm-side-intro"><span class="dm-side-kicker">Customer area</span><h3>Everything for your project.</h3><p>Track an order, message the studio or start something new from one clean place.</p></div><div class="dm-side-section-label">Orders & support</div><div class="dm-side-links"><a class="dm-side-link" href="/order">${icon('M5 5.5h14v13H5z M8 9h8 M8 12h5')}<span class="dm-side-link-copy"><b>Track your order</b><small>Progress, delivery and downloads</small></span><span class="dm-side-link-arrow">›</span></a><a class="dm-side-link" href="/order#messages">${icon('M4.5 5.5h15v10h-8l-4.5 3v-3H4.5z')}<span class="dm-side-link-copy"><b>Messages</b><small>Keep support connected to your project</small></span><span class="dm-side-link-arrow">›</span></a><a class="dm-side-link" href="/support">${icon('M12 4.5a7.5 7.5 0 1 0 0 15 M8.5 10.5h7 M8.5 13.5h4')}<span class="dm-side-link-copy"><b>Contact support</b><small>Ask a question before or after booking</small></span><span class="dm-side-link-arrow">›</span></a></div><div class="dm-side-section-label">Booking</div><div class="dm-side-links"><a class="dm-side-link dm-side-primary" href="/services">${icon('M12 4.5v15 M4.5 12h15')}<span class="dm-side-link-copy"><b>Start a new project</b><small>Browse services and build your order</small></span><span class="dm-side-link-arrow">›</span></a></div>${ownerShortcut}</div><div class="dm-side-foot">Secure checkout · Order tracking · Direct studio support</div>`;
    document.body.append(backdrop,panel);

    const close=()=>{backdrop.classList.remove('open');panel.classList.remove('open');panel.setAttribute('aria-hidden','true');btn.setAttribute('aria-expanded','false');document.body.style.overflow=''};
    const open=()=>{backdrop.classList.add('open');panel.classList.add('open');panel.setAttribute('aria-hidden','false');btn.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';panel.querySelector('.dm-side-close')?.focus({preventScroll:true})};
    btn.addEventListener('click',open);backdrop.addEventListener('click',close);panel.querySelector('.dm-side-close').addEventListener('click',close);
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel.classList.contains('open')){close();btn.focus({preventScroll:true})}});
  }

  const previewHost=document.getElementById('trackList');
  if(previewHost){
    previewHost.innerHTML=`<div class="dm-preview-shell"><div class="dm-preview-copy"><span class="dm-preview-label">Damiønmusic / preview</span><div class="dm-preview-title">Official audio preview</div><div class="dm-preview-sub">Full supplied track.</div></div><div class="dm-player-controls"><button class="dm-play" type="button" aria-label="Play audio" disabled>▶</button><div class="dm-seek-wrap"><input class="dm-range" type="range" min="0" max="100" value="0" aria-label="Track position" disabled><div class="dm-time">Loading audio…</div></div><label class="dm-volume-wrap"><span>VOL</span><input class="dm-volume" type="range" min="0" max="1" step="0.05" value="0.85" aria-label="Volume"></label></div></div>`;
    const audio=new Audio(AUDIO),play=previewHost.querySelector('.dm-play'),seek=previewHost.querySelector('.dm-range'),vol=previewHost.querySelector('.dm-volume'),time=previewHost.querySelector('.dm-time');
    audio.preload='metadata';audio.volume=.85;
    const fmt=s=>`${Math.floor((s||0)/60)}:${String(Math.floor((s||0)%60)).padStart(2,'0')}`;
    const ready=()=>{play.disabled=false;seek.disabled=false;time.textContent=`${fmt(audio.currentTime)} / ${fmt(audio.duration)}`};
    play.addEventListener('click',()=>audio.paused?audio.play().catch(()=>{time.textContent='Could not play audio'}):audio.pause());
    audio.addEventListener('loadedmetadata',ready);audio.addEventListener('canplay',ready);audio.addEventListener('error',()=>{play.disabled=true;seek.disabled=true;time.textContent='Full preview is being updated…'});audio.addEventListener('play',()=>play.textContent='Ⅱ');audio.addEventListener('pause',()=>play.textContent='▶');audio.addEventListener('ended',()=>{play.textContent='▶';seek.value='0'});audio.addEventListener('timeupdate',()=>{seek.value=audio.duration?String(audio.currentTime/audio.duration*100):'0';time.textContent=`${fmt(audio.currentTime)} / ${fmt(audio.duration)}`});seek.addEventListener('input',()=>{if(audio.duration)audio.currentTime=Number(seek.value)/100*audio.duration});vol.addEventListener('input',()=>audio.volume=Number(vol.value));audio.load();
  }
})();
