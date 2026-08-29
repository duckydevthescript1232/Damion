(()=>{
  if(window.__dmServiceOptionsV3)return;
  window.__dmServiceOptionsV3=true;
  if(typeof SERVICES==='undefined'||typeof ADDONS==='undefined')return;

  const SERVICE_ADDONS={
    'beat-feedback':[0,1],
    'mastering':[0,1,5],
    'midi':[0,1,7],
    'mixing':[0,1,2,3,4,5],
    'vocal':[0,1,2,4,5],
    'custom-beat':[0,1,5,6,7],
    'mix-master':[0,1,2,3,4,5],
    'instrumental':[0,1,5,6,7],
    'remix':[0,1,5,6,7],
    'full-production':[0,1,2,3,4,5,6,7]
  };

  const ADDON_META={
    'Priority delivery':['Faster turnaround','Move your project forward in the production queue where possible.'],
    'Additional revision':['One more revision','Adds one extra revision round after the included revisions.'],
    'Extra vocal tuning':['Extra vocal polish','Additional detailed tuning for vocal material in the project.'],
    'Instrumental export':['Instrumental version','Receive a version without the lead vocal.'],
    'Acapella export':['Acapella version','Receive a vocal-only export when the project allows it.'],
    'Radio edit':['Short edit','Receive a tighter radio/streaming-friendly edit.'],
    'Project stems':['Grouped stems','Receive separated grouped stems for later mixing or performance use.'],
    'Project file':['Project session','Receive the working project/session when available for the service.']
  };

  const packageLabel=(index,total)=>index===0?'Essential':index===total-1&&total>2?'Complete':index===1?'Most popular':'Enhanced';

  renderConfig=function(){
    if(!current)return;
    const pEl=byId('packages'),aEl=byId('addons'),tEl=byId('cfgTotal');
    const allowed=SERVICE_ADDONS[current.id]||[0,1];
    [...extras].forEach(i=>{if(!allowed.includes(i))extras.delete(i)});

    if(pEl)pEl.innerHTML=current.packages.map((p,i)=>`
      <button type="button" class="package ${i===pkg?'active':''}" data-package-index="${i}" aria-pressed="${i===pkg?'true':'false'}">
        <span class="dm-package-top"><span class="dm-package-badge">${packageLabel(i,current.packages.length)}</span><strong>${escapeHtml(p[0])}</strong><b>${eur(p[1])}</b></span>
        <span class="dm-package-copy">${escapeHtml(p[2])}</span>
      </button>`).join('');

    if(aEl)aEl.innerHTML=allowed.map(i=>{
      const a=ADDONS[i];if(!a)return'';
      const meta=ADDON_META[a[0]]||[a[0],'Optional addition for this service.'];
      return `<label class="addon ${extras.has(i)?'active':''}">
        <input type="checkbox" data-addon-index="${i}" ${extras.has(i)?'checked':''}>
        <span class="dm-addon-check" aria-hidden="true">✓</span>
        <span class="dm-addon-copy"><b>${escapeHtml(meta[0])}</b><small>${escapeHtml(meta[1])}</small></span>
        <strong>+${eur(a[1])}</strong>
      </label>`;
    }).join('');

    if(tEl)tEl.textContent=eur(current.packages[pkg][1]+[...extras].reduce((s,i)=>s+ADDONS[i][1],0));
  };

  const originalAdd=addConfigured;
  let addBusy=false,lastSignature='',lastAt=0;
  addConfigured=function(){
    if(!current||addBusy)return;
    const sig=[current.id,pkg,...[...extras].sort((a,b)=>a-b)].join('|');
    const now=Date.now();
    if(sig===lastSignature&&now-lastAt<900)return;
    addBusy=true;lastSignature=sig;lastAt=now;
    const btn=document.querySelector('#configModal .dm-config-add');
    if(btn){btn.disabled=true;btn.setAttribute('aria-busy','true');}
    try{originalAdd();}
    finally{
      setTimeout(()=>{addBusy=false;if(btn){btn.disabled=false;btn.removeAttribute('aria-busy');}},700);
    }
  };

  document.addEventListener('click',e=>{
    const pack=e.target.closest?.('#configModal .package[data-package-index]');
    if(!pack)return;
    const i=Number(pack.dataset.packageIndex);
    if(Number.isInteger(i)&&current&&current.packages[i]){pkg=i;renderConfig();}
  },true);
})();
