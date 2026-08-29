(()=>{
  if(window.__dmMotionV5)return;
  window.__dmMotionV5=true;

  const hoverSelector='.service-row,.starter-card,.price-card,.card,.dm-preview-shell,.hero-studio-shot,.brand';
  const mark=()=>document.querySelectorAll(hoverSelector).forEach(el=>el.classList.add('dm-hoverfx'));
  mark();
  new MutationObserver(mark).observe(document.body,{childList:true,subtree:true});

  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const parser=new DOMParser();
  const cache=new Map();
  let navigating=false;

  const canonicalPath=value=>{
    const u=value instanceof URL?value:new URL(value,location.href);
    let p=u.pathname.replace(/\/+$/,'')||'/';
    if(p==='/index.html')p='/';
    p=p.replace(/\.html$/,'');
    return p||'/';
  };

  const softPaths=new Set(['/','/services','/portfolio','/pricing','/how-it-works','/contact','/about','/faq','/terms','/privacy','/refund']);
  const canSoftNavigate=url=>url.origin===location.origin&&softPaths.has(canonicalPath(url));

  const ensureStyles=(doc,baseUrl)=>{
    document.querySelectorAll('style[data-dm-route-style]').forEach(el=>el.remove());
    doc.head.querySelectorAll('style').forEach(src=>{
      const style=document.createElement('style');
      style.dataset.dmRouteStyle='1';
      style.textContent=src.textContent||'';
      document.head.appendChild(style);
    });

    doc.head.querySelectorAll('link[rel="stylesheet"][href]').forEach(src=>{
      let href;
      try{href=new URL(src.getAttribute('href'),baseUrl).href}catch(_){return}
      const exists=[...document.querySelectorAll('link[rel="stylesheet"][href]')].some(l=>{
        try{return new URL(l.href,location.href).href===href}catch(_){return false}
      });
      if(!exists){
        const link=document.createElement('link');
        link.rel='stylesheet';
        link.href=href;
        link.dataset.dmSoftStyle='1';
        document.head.appendChild(link);
      }
    });
  };

  const ensureScript=src=>new Promise(resolve=>{
    const absolute=new URL(src,location.href).href;
    const existing=[...document.scripts].find(s=>s.src===absolute);
    if(existing){resolve();return}
    const s=document.createElement('script');
    s.src=absolute;
    s.onload=()=>resolve();
    s.onerror=()=>resolve();
    document.body.appendChild(s);
  });

  const mountTrackPreview=()=>{
    const host=document.getElementById('trackList');
    if(!host||host.children.length)return;
    host.innerHTML=`<div class="card" style="padding:16px;display:grid;grid-template-columns:auto minmax(0,1fr) minmax(120px,180px);gap:14px;align-items:center">
      <button class="btn icon dm-soft-play" type="button" aria-label="Play preview">▶</button>
      <div style="min-width:0"><b style="display:block;margin-bottom:8px">Official audio preview</b><input class="dm-soft-seek" type="range" min="0" max="100" value="0" aria-label="Track position" style="width:100%"><small class="dm-soft-time" style="display:block;margin-top:5px;color:var(--muted)">0:00 / 0:00</small></div>
      <label style="display:grid;gap:6px;color:var(--muted);font-size:10px">VOLUME<input class="dm-soft-volume" type="range" min="0" max="1" step="0.05" value="0.85" aria-label="Volume"></label>
    </div>`;
    const audio=new Audio('/assets/preview/damionmusic-preview.mp3?v=20260828-1');
    audio.preload='metadata';audio.volume=.85;
    const play=host.querySelector('.dm-soft-play'),seek=host.querySelector('.dm-soft-seek'),vol=host.querySelector('.dm-soft-volume'),time=host.querySelector('.dm-soft-time');
    const fmt=s=>`${Math.floor((s||0)/60)}:${String(Math.floor((s||0)%60)).padStart(2,'0')}`;
    play.addEventListener('click',()=>audio.paused?audio.play().catch(()=>{}):audio.pause());
    audio.addEventListener('play',()=>play.textContent='Ⅱ');
    audio.addEventListener('pause',()=>play.textContent='▶');
    audio.addEventListener('loadedmetadata',()=>time.textContent=`${fmt(audio.currentTime)} / ${fmt(audio.duration)}`);
    audio.addEventListener('timeupdate',()=>{seek.value=audio.duration?String(audio.currentTime/audio.duration*100):'0';time.textContent=`${fmt(audio.currentTime)} / ${fmt(audio.duration)}`});
    audio.addEventListener('ended',()=>{play.textContent='▶';seek.value='0'});
    seek.addEventListener('input',()=>{if(audio.duration)audio.currentTime=Number(seek.value)/100*audio.duration});
    vol.addEventListener('input',()=>audio.volume=Number(vol.value));
  };

  const updateActiveNav=url=>{
    const target=canonicalPath(url);
    document.querySelectorAll('.navlinks a[href]').forEach(a=>{
      let active=false;
      try{active=canonicalPath(new URL(a.href,location.href))===target}catch(_){}
      a.classList.toggle('active',active);
    });
  };

  const reinitPage=async doc=>{
    window.closeCart?.();
    window.renderCart?.();
    window.renderServiceRows?.('serviceList');
    window.renderPricing?.();
    window.buildBars?.();
    window.setupHeroPlayer?.();
    window.setupContact?.();

    if(document.getElementById('serviceBuilderOptions')){
      await ensureScript('/service-builder.js?v=20260829-1');
      setTimeout(()=>document.querySelectorAll('.service-configure').forEach(btn=>btn.textContent='Choose options'),0);
    }

    mountTrackPreview();
    document.querySelectorAll('.brand-name').forEach(el=>el.textContent='Damiønmusic');
    document.querySelectorAll('.footer-brand b').forEach(el=>el.textContent='Damiønmusic');
    mark();
    document.dispatchEvent(new CustomEvent('dm:pagechange'));
  };

  const fetchPage=async url=>{
    const key=url.href.split('#')[0];
    if(cache.has(key))return cache.get(key);
    const promise=fetch(key,{credentials:'same-origin',cache:'force-cache',headers:{'X-Damion-Navigation':'soft'}})
      .then(r=>{if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.text()})
      .then(html=>parser.parseFromString(html,'text/html'));
    cache.set(key,promise);
    try{return await promise}catch(err){cache.delete(key);throw err}
  };

  const applyPage=async(url,{push=true}={})=>{
    if(navigating)return;
    navigating=true;
    try{
      const doc=await fetchPage(url);
      const incoming=doc.querySelector('main');
      if(!incoming)throw new Error('No main content');

      ensureStyles(doc,url);
      const current=document.querySelector('main');
      if(!current)throw new Error('No current main content');
      const newMain=document.importNode(incoming,true);
      const preservedReduced=document.body.classList.contains('dm-reduced');

      const swap=()=>{
        current.replaceWith(newMain);
        document.title=doc.title||document.title;
        const meta=doc.querySelector('meta[name="description"]')?.getAttribute('content');
        if(meta){
          let currentMeta=document.querySelector('meta[name="description"]');
          if(!currentMeta){currentMeta=document.createElement('meta');currentMeta.name='description';document.head.appendChild(currentMeta)}
          currentMeta.setAttribute('content',meta);
        }
        document.body.className=doc.body.className||'';
        if(preservedReduced)document.body.classList.add('dm-reduced');
        updateActiveNav(url);
        if(push)history.pushState({dmSoft:true},'',url.href);
      };

      if(!reduced&&document.startViewTransition){
        document.documentElement.classList.add('dm-soft-nav-active');
        const transition=document.startViewTransition(swap);
        await transition.updateCallbackDone.catch(()=>{});
        await reinitPage(doc);
        await transition.finished.catch(()=>{});
        document.documentElement.classList.remove('dm-soft-nav-active');
      }else{
        swap();
        await reinitPage(doc);
      }

      requestAnimationFrame(()=>{
        if(url.hash){document.querySelector(url.hash)?.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'})}
        else window.scrollTo({top:0,left:0,behavior:'auto'});
      });
    }catch(err){
      console.warn('Soft navigation fallback',err);
      location.href=url.href;
    }finally{
      navigating=false;
    }
  };

  document.addEventListener('click',e=>{
    if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    const a=e.target.closest?.('a[href]');
    if(!a||a.target==='_blank'||a.hasAttribute('download'))return;
    const raw=a.getAttribute('href')||'';
    if(!raw||raw.startsWith('#')||raw.startsWith('mailto:')||raw.startsWith('tel:')||raw.startsWith('javascript:'))return;
    let url;try{url=new URL(a.href,location.href)}catch(_){return}
    if(!canSoftNavigate(url))return;
    if(canonicalPath(url)===canonicalPath(location.href)&&url.search===location.search){return}
    e.preventDefault();
    applyPage(url,{push:true});
  },true);

  const warm=a=>{
    if(!a||a.target==='_blank'||a.hasAttribute('download'))return;
    let url;try{url=new URL(a.href,location.href)}catch(_){return}
    if(canSoftNavigate(url)&&canonicalPath(url)!==canonicalPath(location.href))fetchPage(url).catch(()=>{});
  };
  document.addEventListener('pointerover',e=>warm(e.target.closest?.('a[href]')),{passive:true});
  document.addEventListener('focusin',e=>warm(e.target.closest?.('a[href]')));

  history.scrollRestoration='manual';
  window.addEventListener('popstate',()=>{
    const url=new URL(location.href);
    if(canSoftNavigate(url))applyPage(url,{push:false});
    else location.reload();
  });

  document.documentElement.classList.remove('dm-page-leaving','dm-motion-ready','dm-native-view');
})();
