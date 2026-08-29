(()=>{
  if(window.__dmServicesControlsV2){window.dmEnsureServicesModal?.();return;}
  window.__dmServicesControlsV2=true;

  const ensureModal=()=>{
    let modal=document.getElementById('configModal');
    if(modal)return modal;
    modal=document.createElement('div');
    modal.id='configModal';
    modal.className='modal-bg';
    modal.innerHTML=`<div class="modal"><div class="modal-head"><div><div class="kicker">Package options</div><h3 id="cfgTitle" style="margin:7px 0 0"></h3></div><button class="btn icon dm-config-close" type="button" aria-label="Close">×</button></div><div class="modal-body"><p id="cfgDesc" style="color:var(--muted);line-height:1.65"></p><h4>1. Choose package</h4><div id="packages" class="packages"></div><h4>2. Optional extras</h4><div id="addons" class="addons"></div><div class="total" style="margin-top:18px"><span>Total</span><span id="cfgTotal">€0.00</span></div><button class="btn primary dm-config-add" type="button" style="width:100%">Add to cart</button></div></div>`;
    document.body.appendChild(modal);
    return modal;
  };
  window.dmEnsureServicesModal=ensureModal;

  const serviceIdForButton=btn=>{
    const label=(btn.getAttribute('aria-label')||'').replace(/^Choose\s+/i,'').trim();
    try{
      if(typeof SERVICES!=='undefined'&&Array.isArray(SERVICES)){
        const byName=SERVICES.find(s=>s.name===label);
        if(byName)return byName.id;
        const row=btn.closest('.service-row');
        const rowName=row?.querySelector('.title b')?.textContent?.trim()||'';
        const byRow=SERVICES.find(s=>s.name===rowName);
        if(byRow)return byRow.id;
        const buttons=[...document.querySelectorAll('.service-configure')];
        const index=buttons.indexOf(btn);
        if(index>=0&&SERVICES[index])return SERVICES[index].id;
      }
    }catch(_){}
    return '';
  };

  const openService=id=>{
    const modal=ensureModal();
    try{if(id&&typeof configure==='function')configure(id)}catch(err){console.error('Service configure failed',err)}
    modal.classList.add('open');
  };

  document.addEventListener('click',e=>{
    const choose=e.target.closest?.('.service-configure');
    if(choose){
      e.preventDefault();
      e.stopImmediatePropagation();
      openService(serviceIdForButton(choose));
      return;
    }

    const modal=e.target.closest?.('#configModal');
    if(modal&&e.target===modal){e.preventDefault();modal.classList.remove('open');return;}
    const close=e.target.closest?.('#configModal .dm-config-close');
    if(close){e.preventDefault();document.getElementById('configModal')?.classList.remove('open');return;}

    const pack=e.target.closest?.('#configModal .package');
    if(pack){
      e.preventDefault();
      e.stopImmediatePropagation();
      const all=[...pack.parentElement.querySelectorAll('.package')];
      const index=all.indexOf(pack);
      if(index>=0&&typeof renderConfig==='function'){pkg=index;renderConfig();}
      return;
    }

    const add=e.target.closest?.('#configModal .dm-config-add, #configModal button[onclick*="addConfigured"]');
    if(add){
      e.preventDefault();
      e.stopImmediatePropagation();
      if(typeof addConfigured==='function')addConfigured();
    }
  },true);

  document.addEventListener('change',e=>{
    const input=e.target.closest?.('#addons input[type="checkbox"]');
    if(!input)return;
    e.stopImmediatePropagation();
    const inputs=[...document.querySelectorAll('#addons input[type="checkbox"]')];
    const index=inputs.indexOf(input);
    if(index>=0&&typeof toggleExtra==='function')toggleExtra(index);
  },true);

  document.addEventListener('dm:pagechange',()=>{
    if(document.getElementById('serviceList'))ensureModal();
  });

  if(document.getElementById('serviceList'))ensureModal();
})();
