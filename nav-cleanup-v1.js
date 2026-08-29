(()=>{
  if(window.__dmNavCleanupV1)return;
  window.__dmNavCleanupV1=true;

  const AUTH_API='https://wutlhceqkioshepfbykf.supabase.co/functions/v1/damion-site-auth';
  const OWNER_KEY='damion_site_session';
  let ownerCheck=null;
  let ownerCheckedAt=0;

  const ownerToken=()=>{try{return localStorage.getItem(OWNER_KEY)||''}catch(_){return''}};

  const verifyOwner=async(force=false)=>{
    const token=ownerToken();
    if(!token)return false;
    if(!force&&ownerCheck&&Date.now()-ownerCheckedAt<30000)return ownerCheck;
    ownerCheckedAt=Date.now();
    ownerCheck=(async()=>{
      try{
        const response=await fetch(AUTH_API,{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'session',session_token:token})});
        const data=await response.json().catch(()=>({}));
        return Boolean(response.ok&&data?.authenticated&&data?.is_owner);
      }catch(_){return false}
    })();
    return ownerCheck;
  };

  const broadcastIcon=()=>'<span class="dm-side-link-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M4.5 6.5h15v9h-8l-4.5 3v-3H4.5z M8 10h8 M8 13h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';

  const updateBroadcastCard=async(card)=>{
    if(!card?.isConnected)return;
    const copy=card.querySelector('small');
    if(copy)copy.textContent='Checking owner access…';
    const owner=await verifyOwner();
    if(!card.isConnected)return;
    card.dataset.ownerVerified=owner?'1':'0';
    if(copy)copy.textContent=owner?'Owner verified · send to everyone online':'Owner sign-in required';
  };

  const openBroadcastFromSidebar=async(card)=>{
    if(card.dataset.busy==='1')return;
    card.dataset.busy='1';
    const copy=card.querySelector('small');
    const original=copy?.textContent||'';
    if(copy)copy.textContent='Checking owner access…';
    const owner=await verifyOwner(true);
    card.dataset.busy='0';
    if(!owner){
      if(copy)copy.textContent='Owner sign-in required';
      location.href='/admin-orders.html';
      return;
    }
    if(copy)copy.textContent='Owner verified · opening broadcast…';
    if(typeof window.dmOpenBroadcast==='function'){
      window.dmOpenBroadcast();
      setTimeout(()=>{if(copy&&card.isConnected)copy.textContent='Owner verified · send to everyone online'},300);
      return;
    }
    let tries=0;
    const wait=setInterval(()=>{
      tries++;
      if(typeof window.dmOpenBroadcast==='function'){
        clearInterval(wait);
        window.dmOpenBroadcast();
        if(copy&&card.isConnected)copy.textContent='Owner verified · send to everyone online';
      }else if(tries>=12){
        clearInterval(wait);
        if(copy&&card.isConnected)copy.textContent=original||'Broadcast is loading — try again';
      }
    },100);
  };

  const ensureBroadcastCard=()=>{
    if(!document.getElementById('dmHideLegacyBroadcastButton')){
      const style=document.createElement('style');
      style.id='dmHideLegacyBroadcastButton';
      style.textContent='#dmBroadcastAdminButton{display:none!important}';
      document.head.appendChild(style);
    }

    const panel=document.querySelector('.dm-sidepanel');
    if(!panel)return;
    let card=panel.querySelector('#dmSidebarBroadcast');
    if(card){updateBroadcastCard(card);return}

    const labels=[...panel.querySelectorAll('.dm-side-section-label')];
    const bookingLabel=labels.find(el=>String(el.textContent||'').trim().toLowerCase()==='booking');
    const links=bookingLabel?.nextElementSibling;
    if(!links?.classList.contains('dm-side-links'))return;

    card=document.createElement('button');
    card.id='dmSidebarBroadcast';
    card.type='button';
    card.className='dm-side-link';
    card.innerHTML=`${broadcastIcon()}<span class="dm-side-link-copy"><b>Broadcast message</b><small>Checking owner access…</small></span><span class="dm-side-link-arrow">›</span>`;
    card.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();openBroadcastFromSidebar(card)});
    links.appendChild(card);
    updateBroadcastCard(card);
  };

  const clean=()=>{
    const body=document.body;
    if(!body)return;

    // Work page has been retired. Keep the real audio preview on Home instead.
    document.querySelectorAll('.navlinks a[href="/portfolio"],.mobilebar a[href="/portfolio"],footer a[href="/portfolio"]').forEach(a=>a.remove());
    document.querySelectorAll('a[href="/portfolio"],a[href="/portfolio.html"]').forEach(a=>{
      if(a.closest('.proof-copy')){
        a.href='#preview';
        a.innerHTML='Listen to current preview <span aria-hidden="true">→</span>';
      }
    });

    if(body.classList.contains('home')){
      // Home is now a clean entry point. Service browsing lives on its own page.
      document.querySelector('.home-popular')?.remove();

      const serviceCtas=document.querySelectorAll('.hero-cta a[href="/services"],.home-inline-actions a[href="/services"],.final-actions a[href="/services"],.mobile-project-cta a[href="/services"]');
      serviceCtas.forEach(a=>{
        a.href='/browse-services';
        a.textContent='Browse services';
      });

      // Remove question-style secondary buttons beside the main service CTAs.
      document.querySelectorAll('.home-inline-actions button[data-open-support],.final-actions button[data-open-support],.mobile-project-cta button[data-open-support]').forEach(btn=>btn.remove());

      const finalCopy=document.querySelector('.home-final p');
      if(finalCopy)finalCopy.textContent='Browse the services and choose the option that fits your track.';
    }

    if(body.classList.contains('services')&&!body.classList.contains('browse-services-page')){
      document.querySelectorAll('.page-hero .hero-cta button').forEach(btn=>btn.remove());
    }

    ensureBroadcastCard();
  };

  // Deep service links from Browse must use a full load so ?service= reliably opens the configurator.
  document.addEventListener('click',e=>{
    const a=e.target.closest?.('.browse-services-page a[href*="/services?service="]');
    if(!a)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    location.href=a.href;
  },true);

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',clean,{once:true});
  else clean();
  document.addEventListener('dm:pagechange',()=>setTimeout(clean,0));
  window.addEventListener('storage',e=>{if(e.key===OWNER_KEY){ownerCheck=null;ownerCheckedAt=0;setTimeout(clean,0)}});
  new MutationObserver(records=>{
    if(records.some(r=>[...r.addedNodes].some(n=>n.nodeType===1&&(n.classList?.contains('dm-sidepanel')||n.querySelector?.('.dm-sidepanel')))))setTimeout(clean,0);
  }).observe(document.documentElement,{childList:true,subtree:true});
})();
