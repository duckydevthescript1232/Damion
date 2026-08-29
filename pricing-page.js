(()=>{
  if(window.__dmPricingPage)return;window.__dmPricingPage=true;

  const getService=id=>Array.isArray(window.SERVICES)?window.SERVICES.find(s=>s.id===id):(typeof SERVICES!=='undefined'?SERVICES.find(s=>s.id===id):null);
  const readCart=()=>{try{const c=JSON.parse(localStorage.getItem('damion_cart')||'[]');return Array.isArray(c)?c:[]}catch(_){return []}};
  const writeCart=c=>localStorage.setItem('damion_cart',JSON.stringify(c));

  const buyBaseService=id=>{
    const s=getService(id);if(!s||!Array.isArray(s.packages)||!s.packages.length)return;
    const p=s.packages[0],cart=readCart();
    cart.push({key:Date.now()+Math.random(),id:s.id,name:s.name,package:p[0],addons:[],price:Number(p[1]||s.from||0)});
    writeCart(cart);location.href='/checkout';
  };
  window.dmBuyBaseService=buyBaseService;

  const ids=['mastering','mix-master','full-production'];
  const patchPopularCards=()=>{
    const grid=document.getElementById('pricingGrid');if(!grid)return;
    const cards=[...grid.querySelectorAll(':scope > .price-card')];
    cards.forEach((card,i)=>{
      const id=ids[i],service=getService(id);if(!service)return;
      card.classList.remove('pop');
      if(i===1)card.classList.add('featured');
      const oldBadge=card.querySelector(':scope > .pop');
      if(oldBadge){oldBadge.className='price-pop-badge';oldBadge.textContent='Popular choice'}
      const oldAction=card.querySelector(':scope > a.btn');
      if(oldAction)oldAction.remove();
      if(!card.querySelector('.price-actions')){
        const actions=document.createElement('div');actions.className='price-actions';
        actions.innerHTML=`<a class="btn" href="/services?service=${encodeURIComponent(id)}">Choose options</a><button class="btn ${i===1?'primary':''}" type="button" data-buy-base="${id}">Order base package</button>`;
        card.appendChild(actions);
      }
    });
    grid.querySelectorAll('[data-buy-base]').forEach(btn=>btn.addEventListener('click',()=>buyBaseService(btn.dataset.buyBase)));
  };

  const PLANS=[
    {id:'starter',name:'Starter Studio Pass',price:14.99,limit:11.99,services:['beat-feedback','mastering','midi','vocal','mixing'],copy:'For smaller jobs and quick finishing work.',bonus:'One extra revision included'},
    {id:'artist',name:'Artist Studio Pass',price:27.99,limit:24.99,services:['beat-feedback','mastering','midi','vocal','mixing','custom-beat','mix-master'],copy:'For artists who need a fuller production service without jumping to the biggest package.',bonus:'One extra revision included'},
    {id:'pro',name:'Pro Studio Pass',price:43.99,limit:39.99,services:['beat-feedback','mastering','midi','vocal','mixing','custom-beat','mix-master','instrumental','remix','full-production'],copy:'For bigger projects including full-production level work.',bonus:'One extra revision included'}
  ];
  let activePlan=null;

  const renderPlans=()=>{
    const host=document.getElementById('studioPlans');if(!host)return;
    host.innerHTML=PLANS.map((p,i)=>`<article class="studio-plan ${i===1?'recommended':''}"><span class="plan-label">${i===1?'Best balance':'One-time studio pass'}</span><h3>${p.name}</h3><div class="plan-price">€${p.price.toFixed(2)}<small>one-time</small></div><p>${p.copy}</p><ul><li>Choose one eligible service</li><li>Service value up to €${p.limit.toFixed(2)}</li><li>${p.bonus}</li><li>No automatic renewal</li></ul><button class="btn ${i===1?'primary':''}" type="button" data-plan="${p.id}">Choose this pass</button></article>`).join('');
    host.querySelectorAll('[data-plan]').forEach(btn=>btn.addEventListener('click',()=>openPlan(btn.dataset.plan)));
  };

  const openPlan=id=>{
    const plan=PLANS.find(p=>p.id===id),modal=document.getElementById('planModal');if(!plan||!modal)return;
    activePlan=plan;
    const title=document.getElementById('planModalTitle'),summary=document.getElementById('planModalSummary'),select=document.getElementById('planService');
    if(title)title.textContent=plan.name;
    if(summary)summary.innerHTML=`<b>€${plan.price.toFixed(2)} one-time</b><span>Choose one included service before placing your order. ${plan.bonus}. This is not a recurring subscription.</span>`;
    if(select){
      const options=plan.services.map(id=>getService(id)).filter(Boolean).filter(s=>Number(s.from)<=plan.limit+0.001);
      select.innerHTML=options.map(s=>`<option value="${s.id}">${s.name} — base value €${Number(s.from).toFixed(2)}</option>`).join('');
    }
    modal.classList.add('open');
  };
  window.dmClosePlan=()=>document.getElementById('planModal')?.classList.remove('open');
  window.dmCheckoutPlan=()=>{
    const select=document.getElementById('planService');if(!activePlan||!select)return;
    const service=getService(select.value);if(!service)return;
    const cart=readCart();
    cart.push({key:Date.now()+Math.random(),id:`studio-pass-${activePlan.id}`,name:service.name,package:`${activePlan.name} — ${service.packages?.[0]?.[0]||'Base service'}`,addons:['Additional revision included'],price:activePlan.price,studioPass:activePlan.id,selectedService:service.id});
    writeCart(cart);location.href='/checkout';
  };

  const init=()=>{patchPopularCards();renderPlans()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,0));else setTimeout(init,0);
})();
