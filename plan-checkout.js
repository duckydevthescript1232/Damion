(()=>{
  const API='/api/damion-paypal';
  const ANON='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dGxoY2Vxa2lvc2hlcGZieWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMDAxMDUsImV4cCI6MjEwMTU3NjEwNX0.Ad9wROEhZ2uKxKx9H5AHqCCmFa0nTezrBHkAn-Zwyws';
  const ACCESS_KEY='damion_plan_access';
  const PLANS={
    starter:{name:'Starter Plan',price:'€4.99',copy:'Simple member access for producers who want the useful basics.',features:['Member Hub access','Production checklist','Save 1 project brief','Member support']},
    artist:{name:'Artist Plan',price:'€9.99',copy:'More tools for artists who are actively working on several projects.',features:['Everything in Starter','Save up to 3 project briefs','Export project briefs','Priority support']},
    pro:{name:'Pro Plan',price:'€19.99',copy:'The highest access level for producers who want the most room and support.',features:['Everything in Artist','Save up to 10 project briefs','Advanced release checklist','Top-priority support']}
  };
  const $=id=>document.getElementById(id);
  const planId=(new URLSearchParams(location.search).get('plan')||'').toLowerCase();
  const plan=PLANS[planId];

  async function api(payload){
    const res=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json','apikey':ANON,'Authorization':`Bearer ${ANON}`},body:JSON.stringify(payload)});
    let data={};try{data=await res.json()}catch(_){}
    if(!res.ok)throw new Error(data.error||data.details||`Request failed (${res.status})`);
    return data;
  }
  function status(text,type=''){
    const el=$('paymentStatus');if(!el)return;el.textContent=text||'';el.className=`payment-status ${type}`.trim();
  }
  function fail(message){
    $('planLoading').hidden=true;$('planCheckout').hidden=true;$('planSuccess').hidden=true;$('planError').hidden=false;$('planErrorText').textContent=message||'Checkout could not be loaded.';
  }
  function renderPlan(){
    if(!plan)return fail('This plan does not exist. Go back and choose a valid plan.');
    $('planBadge').textContent=planId;$('planName').textContent=plan.name;$('planPrice').textContent=plan.price;$('planCopy').textContent=plan.copy;$('planFeatures').innerHTML=plan.features.map(x=>`<li>${x}</li>`).join('');
  }
  function loadSdk(clientId){
    return new Promise((resolve,reject)=>{
      if(window.paypal?.Buttons)return resolve();
      const s=document.createElement('script');
      s.src=`https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=EUR&intent=capture&components=buttons`;
      s.async=true;s.onload=resolve;s.onerror=()=>reject(new Error('PayPal could not be loaded. Please refresh and try again.'));document.head.appendChild(s);
    });
  }
  async function init(){
    renderPlan();if(!plan)return;
    try{
      const config=await api({action:'config'});
      if(!config.configured||!config.clientId)throw new Error('PayPal is not fully configured yet.');
      await loadSdk(config.clientId);
      $('planLoading').hidden=true;$('planCheckout').hidden=false;
      const buttons=window.paypal.Buttons({
        style:{layout:'vertical',shape:'rect',height:48,label:'paypal',tagline:false},
        createOrder:async()=>{
          status('Creating secure PayPal checkout…');
          const created=await api({action:'plan_create',plan_id:planId});
          return created.orderID;
        },
        onApprove:async data=>{
          status('Verifying your payment and activating access…');
          const result=await api({action:'plan_capture',orderID:data.orderID});
          if(!result.access_token)throw new Error('Payment was approved, but access could not be activated.');
          localStorage.setItem(ACCESS_KEY,result.access_token);
          localStorage.setItem('damion_plan_last',JSON.stringify({plan:result.plan,expires_at:result.expires_at,orderID:result.orderID}));
          $('planCheckout').hidden=true;$('planError').hidden=true;$('planSuccess').hidden=false;
          $('successText').textContent=`${result.plan?.name||plan.name} is active until ${new Date(result.expires_at).toLocaleDateString()}.`;
          window.scrollTo({top:0,behavior:'smooth'});
        },
        onCancel:()=>status('Payment cancelled. Nothing was charged.','error'),
        onError:err=>{console.error(err);status(err?.message||'The payment could not be completed. Please try again.','error')}
      });
      await buttons.render('#paypalButtons');
      status(config.environment==='sandbox'?'PayPal test mode is active.':'Secure PayPal checkout is ready.','ok');
    }catch(err){console.error(err);fail(err?.message||'Checkout could not be loaded.');}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
