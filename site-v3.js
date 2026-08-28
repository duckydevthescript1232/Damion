(()=>{
  const BRAND='Damiønmusic';
  const fixBrandText=value=>String(value||'').replaceAll('Damiønmusicmusic',BRAND).replace(/Damiøn(?!music)/g,BRAND);
  document.querySelectorAll('.brand-name').forEach(el=>el.textContent=BRAND);
  document.querySelectorAll('.footer-brand b').forEach(el=>el.textContent=BRAND);
  document.querySelectorAll('img[alt*="Damiøn"]').forEach(el=>el.alt='Damiønmusic logo');
  document.title=fixBrandText(document.title);
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);for(const n of nodes){if(n.nodeValue&&n.nodeValue.includes('Damiøn'))n.nodeValue=fixBrandText(n.nodeValue)}
  const nav=document.querySelector('.nav-actions');if(nav&&!nav.querySelector('[data-orders-link]')){const a=document.createElement('a');a.href='/order';a.className='btn';a.dataset.ordersLink='1';a.textContent='Track order';nav.prepend(a)}

  const previewHost=document.getElementById('trackList');
  if(previewHost){
    previewHost.innerHTML='<div class="dm-preview-shell"><div class="dm-art">D</div><div><div class="dm-preview-title">Official Damiønmusic preview</div><div class="dm-preview-sub">One real preview only · from your uploaded track</div></div><div class="dm-player-controls"><button class="dm-play" type="button" aria-label="Play preview">▶</button><span class="dm-time">0:00 / 0:00</span><input class="dm-range" type="range" min="0" max="100" value="0" aria-label="Preview position"><span aria-hidden="true">🔊</span><input class="dm-volume" type="range" min="0" max="1" step="0.05" value="0.85" aria-label="Volume"></div></div>';
    const audio=new Audio('/assets/preview/damionmusic-preview.mp3?v=20260828-1');
    const play=previewHost.querySelector('.dm-play'),seek=previewHost.querySelector('.dm-range'),vol=previewHost.querySelector('.dm-volume'),time=previewHost.querySelector('.dm-time');
    audio.preload='metadata';audio.volume=.85;
    const fmt=s=>`${Math.floor((s||0)/60)}:${String(Math.floor((s||0)%60)).padStart(2,'0')}`;
    play.addEventListener('click',()=>{audio.paused?audio.play().catch(()=>{}):audio.pause()});
    audio.addEventListener('play',()=>play.textContent='Ⅱ');audio.addEventListener('pause',()=>play.textContent='▶');audio.addEventListener('ended',()=>{play.textContent='▶';seek.value='0'});
    audio.addEventListener('loadedmetadata',()=>time.textContent=`0:00 / ${fmt(audio.duration)}`);
    audio.addEventListener('timeupdate',()=>{seek.value=audio.duration?String(audio.currentTime/audio.duration*100):'0';time.textContent=`${fmt(audio.currentTime)} / ${fmt(audio.duration)}`});
    seek.addEventListener('input',()=>{if(audio.duration)audio.currentTime=Number(seek.value)/100*audio.duration});vol.addEventListener('input',()=>audio.volume=Number(vol.value));
  }
})();