(()=>{
  const choices=[
    {id:'mix-master',icon:'🎚️',title:'Finish my recorded song',desc:'I already have vocals/instruments and want the complete mix + master.'},
    {id:'mixing',icon:'🎛️',title:'Mix my track',desc:'Balance, clean up and process my stems without mastering.'},
    {id:'mastering',icon:'💿',title:'Master my finished mix',desc:'Make my final stereo mix louder, cleaner and release-ready.'},
    {id:'vocal',icon:'🎤',title:'Make my vocals sound pro',desc:'Cleanup, tuning, timing and vocal effects.'},
    {id:'custom-beat',icon:'🥁',title:'Make me a beat',desc:'Create an original beat around my style, references and vocals.'},
    {id:'instrumental',icon:'🎹',title:'Make me an instrumental',desc:'Write and produce a complete instrumental around my idea.'},
    {id:'midi',icon:'🎼',title:'Create melody / chords / MIDI',desc:'Give me editable melody or chord ideas for my own project.'},
    {id:'remix',icon:'🔁',title:'Remix my song',desc:'Turn my existing track or vocal into a new production direction.'},
    {id:'full-production',icon:'✨',title:'Build my whole song',desc:'Take my vocal, demo or idea and produce the complete track.'},
    {id:'beat-feedback',icon:'💬',title:'I only want feedback',desc:'Tell me what to improve before I buy a bigger service.'}
  ];

  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const getService=id=>(window.SERVICES||[]).find?.(s=>s.id===id) || (typeof SERVICES!=='undefined'?SERVICES.find(s=>s.id===id):null);

  function renderBuilder(){
    const host=document.getElementById('serviceBuilderOptions');
    if(!host)return;
    host.innerHTML=choices.map((choice,i)=>{
      const service=getService(choice.id);
      const price=service?`From €${Number(service.from).toFixed(2)}`:'';
      const time=service?.turnaround||'';
      return `<button class="dm-builder-option" type="button" onclick="chooseBuilderService('${choice.id}')">
        <span class="dm-builder-icon" aria-hidden="true">${choice.icon}</span>
        <span class="dm-builder-copy"><b>${esc(choice.title)}</b><small>${esc(choice.desc)}</small><em>${esc(price)}${time?` · ${esc(time)}`:''}</em></span>
        <span class="dm-builder-arrow" aria-hidden="true">→</span>
      </button>`;
    }).join('');
  }

  window.openServiceBuilder=()=>{
    renderBuilder();
    if(typeof openModal==='function')openModal('builderModal');
    else document.getElementById('builderModal')?.classList.add('open');
  };

  window.chooseBuilderService=id=>{
    if(typeof closeModal==='function')closeModal('builderModal');
    else document.getElementById('builderModal')?.classList.remove('open');
    setTimeout(()=>{if(typeof configure==='function')configure(id)},70);
  };

  const polishButtons=()=>document.querySelectorAll('.service-configure').forEach(btn=>{btn.textContent='Choose options';btn.setAttribute('aria-label','Choose service options')});

  const start=()=>{renderBuilder();polishButtons();setTimeout(polishButtons,100)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
