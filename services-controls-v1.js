(()=>{
  if(window.__dmServicesControlsV1)return;
  window.__dmServicesControlsV1=true;

  const serviceIdForButton=btn=>{
    const label=(btn.getAttribute('aria-label')||'').replace(/^Choose\s+/i,'').trim();
    try{
      if(typeof SERVICES!=='undefined'&&Array.isArray(SERVICES)){
        const byName=SERVICES.find(s=>s.name===label);
        if(byName)return byName.id;
        const buttons=[...document.querySelectorAll('.service-configure')];
        const index=buttons.indexOf(btn);
        if(index>=0&&SERVICES[index])return SERVICES[index].id;
      }
    }catch(_){}
    return '';
  };

  document.addEventListener('click',e=>{
    const choose=e.target.closest?.('.service-configure');
    if(choose){
      e.preventDefault();
      e.stopImmediatePropagation();
      const id=serviceIdForButton(choose);
      if(id&&typeof configure==='function')configure(id);
      return;
    }

    const pack=e.target.closest?.('#configModal .package');
    if(pack){
      e.preventDefault();
      e.stopImmediatePropagation();
      const all=[...pack.parentElement.querySelectorAll('.package')];
      const index=all.indexOf(pack);
      if(index>=0&&typeof renderConfig==='function'){
        pkg=index;
        renderConfig();
      }
      return;
    }

    const add=e.target.closest?.('#configModal button[onclick*="addConfigured"]');
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
})();
