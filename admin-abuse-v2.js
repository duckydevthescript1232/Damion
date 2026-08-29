(()=>{
  if(window.__dmAdminAbuseV2Loaded)return;window.__dmAdminAbuseV2Loaded=true;

  const css=document.createElement('style');
  css.id='dm-admin-abuse-v2-style';
  css.textContent=`
    @keyframes dmAdminSweep{0%{transform:translateX(-120%)}100%{transform:translateX(120%)}}
    @keyframes dmAdminPulse{0%,100%{box-shadow:0 18px 60px rgba(0,0,0,.55),0 0 0 rgba(239,63,85,0)}50%{box-shadow:0 20px 70px rgba(0,0,0,.62),0 0 34px rgba(239,63,85,.22)}}
    @keyframes dmAdminDrop{0%{opacity:0;transform:translate(-50%,-36px) scale(.96)}70%{opacity:1;transform:translate(-50%,5px) scale(1.01)}100%{opacity:1;transform:translate(-50%,0) scale(1)}}

    #dmAdminBroadcastSplash{position:fixed;left:50%;top:94px;z-index:2600;width:min(760px,calc(100vw - 28px));padding:1px;border-radius:18px;background:linear-gradient(110deg,#ff385a,#7d2033,#ff385a);opacity:0;pointer-events:none;transform:translate(-50%,-30px) scale(.97);transition:opacity .18s ease,transform .18s ease;filter:drop-shadow(0 26px 55px rgba(0,0,0,.55))}
    #dmAdminBroadcastSplash.open{opacity:1;transform:translate(-50%,0) scale(1);animation:dmAdminDrop .34s cubic-bezier(.2,.8,.2,1)}
    #dmAdminBroadcastSplash[data-type="giveaway"]{background:linear-gradient(110deg,#ffb52e,#ef3f55,#ffb52e)}
    #dmAdminBroadcastSplash[data-type="event"]{background:linear-gradient(110deg,#845cff,#ef3f55,#845cff)}
    .dm-admin-splash-inner{position:relative;overflow:hidden;border-radius:17px;background:radial-gradient(circle at 15% 0,rgba(239,63,85,.18),transparent 34%),linear-gradient(180deg,#171014,#090a0c);padding:18px 20px;color:#fff}
    .dm-admin-splash-inner:after{content:"";position:absolute;inset:0;width:42%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.08),transparent);animation:dmAdminSweep 2.4s linear infinite;pointer-events:none}
    .dm-admin-splash-top{display:flex;align-items:center;gap:9px;margin-bottom:7px}.dm-admin-splash-dot{width:8px;height:8px;border-radius:50%;background:#ff4664;box-shadow:0 0 16px rgba(255,70,100,.85)}
    .dm-admin-splash-label{font-size:10px;font-weight:950;letter-spacing:.16em;text-transform:uppercase;color:#ff8597}.dm-admin-splash-type{margin-left:auto;padding:5px 8px;border:1px solid rgba(255,255,255,.12);border-radius:999px;background:rgba(255,255,255,.04);font-size:9px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:#d8dbe1}
    .dm-admin-splash-title{font-size:clamp(21px,4vw,36px);line-height:1.04;font-weight:950;letter-spacing:-.045em}.dm-admin-splash-message{margin-top:8px;color:#c4c7cd;font-size:13px;line-height:1.55}

    #dmSiteEventBanner.dm-admin-abuse-banner{top:76px!important;width:min(880px,calc(100vw - 22px))!important;padding:0!important;border:1px solid rgba(255,80,105,.38)!important;border-radius:14px!important;background:linear-gradient(90deg,rgba(73,15,27,.98),rgba(13,13,16,.985) 38%,rgba(13,13,16,.985))!important;overflow:hidden!important;animation:dmAdminPulse 2.4s ease-in-out infinite!important}
    #dmSiteEventBanner.dm-admin-abuse-banner:before{content:"";position:absolute;left:0;top:0;bottom:0;width:4px;background:#ef3f55;box-shadow:0 0 18px rgba(239,63,85,.75)}
    #dmSiteEventBanner.dm-admin-abuse-banner[data-dm-type="giveaway"]:before{background:#ffb52e;box-shadow:0 0 18px rgba(255,181,46,.75)}
    #dmSiteEventBanner.dm-admin-abuse-banner .dm-event-inner{padding:12px 14px 12px 17px!important}.dm-admin-abuse-banner .dm-event-badge{font-size:9px!important;padding:6px 9px!important;background:rgba(239,63,85,.14)!important;border-color:rgba(255,95,120,.36)!important;color:#ff93a3!important}.dm-admin-abuse-banner[data-dm-type="giveaway"] .dm-event-badge{background:rgba(255,181,46,.12)!important;border-color:rgba(255,181,46,.35)!important;color:#ffd074!important}
    .dm-admin-abuse-banner .dm-event-copy b{font-size:13px!important;font-weight:900!important;letter-spacing:-.01em}.dm-admin-abuse-banner .dm-event-copy span{font-size:10px!important;color:#adb1b9!important}.dm-admin-abuse-banner .dm-event-time{font-size:10px!important;color:#78e6a8!important}

    .dm-admin-toolbox.dm-admin-abuse-toolbox{border-color:rgba(239,63,85,.28)!important;box-shadow:0 25px 85px rgba(0,0,0,.68),0 0 34px rgba(239,63,85,.08)!important}.dm-admin-abuse-toolbox .dm-at-head{background:linear-gradient(90deg,rgba(239,63,85,.12),transparent)!important}.dm-admin-abuse-toolbox .dm-at-brand span{color:#ff6f82!important}.dm-admin-abuse-preset-row{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:8px}.dm-admin-abuse-preset{min-height:31px;border:1px solid rgba(255,255,255,.08);border-radius:8px;background:#111318;color:#d9dce1;font-size:9px;font-weight:850;cursor:pointer}.dm-admin-abuse-preset:hover{border-color:rgba(239,63,85,.38);background:#181216}.dm-admin-abuse-hint{margin:7px 0 0;color:#7f848d;font-size:9px;line-height:1.45}.dm-admin-abuse-hint b{color:#ff7387}

    @media(max-width:720px){#dmAdminBroadcastSplash{top:72px}.dm-admin-splash-inner{padding:15px}.dm-admin-splash-message{font-size:11px}#dmSiteEventBanner.dm-admin-abuse-banner{top:64px!important}.dm-admin-abuse-preset-row{grid-template-columns:1fr}}
  `;
  document.head.appendChild(css);

  const splash=document.createElement('div');
  splash.id='dmAdminBroadcastSplash';
  splash.setAttribute('role','status');
  splash.setAttribute('aria-live','polite');
  splash.innerHTML=`<div class="dm-admin-splash-inner"><div class="dm-admin-splash-top"><i class="dm-admin-splash-dot"></i><span class="dm-admin-splash-label">ADMIN BROADCAST</span><span class="dm-admin-splash-type">LIVE</span></div><div class="dm-admin-splash-title"></div><div class="dm-admin-splash-message"></div></div>`;
  document.body.appendChild(splash);

  let lastSignature='';
  let splashTimer=null;
  const safeText=v=>String(v||'').trim();

  function showSplash(type,title,message){
    splash.dataset.type=type||'announcement';
    splash.querySelector('.dm-admin-splash-type').textContent=(type||'announcement').toUpperCase();
    splash.querySelector('.dm-admin-splash-title').textContent=title||'Damiønmusic broadcast';
    splash.querySelector('.dm-admin-splash-message').textContent=message||'A live site update was started by the owner.';
    splash.classList.remove('open');
    void splash.offsetWidth;
    splash.classList.add('open');
    if(splashTimer)clearTimeout(splashTimer);
    splashTimer=setTimeout(()=>splash.classList.remove('open'),5200);
  }

  function syncBanner(){
    const banner=document.getElementById('dmSiteEventBanner');
    if(!banner)return;
    banner.classList.add('dm-admin-abuse-banner');
    const type=safeText(document.getElementById('dmEventBadge')?.textContent).toLowerCase()||'announcement';
    const title=safeText(document.getElementById('dmEventTitle')?.textContent);
    const message=safeText(document.getElementById('dmEventMessage')?.textContent);
    banner.dataset.dmType=type;
    const active=document.documentElement.classList.contains('dm-event-on');
    const signature=active?`${type}|${title}|${message}`:'';
    if(active&&signature&&signature!==lastSignature){lastSignature=signature;showSplash(type,title,message)}
    if(!active)lastSignature='';
  }

  function patchToolbox(){
    const box=document.querySelector('.dm-admin-toolbox');
    if(!box||box.dataset.dmAbusePatched==='1')return;
    box.dataset.dmAbusePatched='1';
    box.classList.add('dm-admin-abuse-toolbox');
    const sub=box.querySelector('.dm-at-brand span');if(sub)sub.textContent='ADMIN ABUSE MODE';
    const eventForm=box.querySelector('#dmAdminEventForm');
    if(!eventForm)return;
    const section=eventForm.closest('.dm-at-section');
    const title=section?.querySelector('.dm-at-title b');if(title)title.textContent='Giveaway / broadcast';
    const submit=eventForm.querySelector('button[type="submit"]');if(submit)submit.textContent='Broadcast to everyone';
    const presets=document.createElement('div');
    presets.className='dm-admin-abuse-preset-row';
    presets.innerHTML='<button class="dm-admin-abuse-preset" type="button" data-preset="giveaway">🎁 Giveaway</button><button class="dm-admin-abuse-preset" type="button" data-preset="event">⚡ Event</button><button class="dm-admin-abuse-preset" type="button" data-preset="announcement">📣 Message</button>';
    eventForm.before(presets);
    const hint=document.createElement('div');hint.className='dm-admin-abuse-hint';hint.innerHTML='Everyone currently on the website will see the broadcast. Press <b>A</b> anytime to reopen this owner console.';presets.after(hint);
    presets.addEventListener('click',e=>{
      const btn=e.target.closest('[data-preset]');if(!btn)return;
      const type=btn.dataset.preset;
      eventForm.elements.event_type.value=type;
      const defaults={
        giveaway:['🎁 GIVEAWAY LIVE','A Damiønmusic giveaway announcement is live. Watch this banner for updates.'],
        event:['⚡ LIVE SITE EVENT','A special Damiønmusic site event is active right now.'],
        announcement:['📣 ADMIN BROADCAST','A new message from Damiønmusic is live for everyone on the site.']
      }[type];
      if(!eventForm.elements.title.value.trim())eventForm.elements.title.value=defaults[0];
      if(!eventForm.elements.message.value.trim())eventForm.elements.message.value=defaults[1];
    });
  }

  const observer=new MutationObserver(()=>{syncBanner();patchToolbox()});
  observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class']});
  syncBanner();patchToolbox();
  window.addEventListener('pagehide',()=>{observer.disconnect();if(splashTimer)clearTimeout(splashTimer)},{once:true});
})();
