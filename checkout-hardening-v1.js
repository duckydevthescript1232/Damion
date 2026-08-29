(()=>{
  if(window.__dmCheckoutHardeningV1)return;
  window.__dmCheckoutHardeningV1=true;

  let busy=false;
  const setBusy=value=>{
    busy=value;
    const btn=document.getElementById('continuePayment');
    if(btn){btn.disabled=value;btn.setAttribute('aria-busy',value?'true':'false');}
  };

  const firstInvalid=form=>form?.querySelector(':invalid');

  startIdealPayment=async function(){
    if(busy)return;
    const form=document.getElementById('checkoutPageForm');
    if(!form||!checkoutCart.length)return;
    if(!form.checkValidity()){
      const bad=firstInvalid(form);
      try{bad?.focus({preventScroll:true});}catch(_){bad?.focus();}
      try{bad?.scrollIntoView({behavior:'smooth',block:'center'});}catch(_){}
      try{form.reportValidity();}catch(_){}
      return;
    }

    const d=saveDetails();
    setBusy(true);
    setMessage(tr('Preparing secure iDEAL payment…','Veilige iDEAL-betaling voorbereiden…'));
    try{
      const controller=typeof AbortController!=='undefined'?new AbortController():null;
      const timeout=controller?setTimeout(()=>controller.abort(),20000):null;
      let response;
      try{
        response=await fetch(MOLLIE_CREATE_API,{
          method:'POST',
          cache:'no-store',
          credentials:'same-origin',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({email:d.email,first_name:d.first,last_name:d.last,artist_name:d.artist,country:d.country,project_name:d.project,delivery_format:d.delivery,notes:d.notes,cart:safeCartForServer()}),
          signal:controller?.signal
        });
      }finally{if(timeout)clearTimeout(timeout);}

      let result={};try{result=await response.json();}catch(_){}
      if(!response.ok)throw new Error(result.error||tr('Could not start iDEAL payment.','iDEAL-betaling kon niet worden gestart.'));
      if(!result.checkout_url||!/^https:\/\//i.test(result.checkout_url))throw new Error(tr('Mollie did not return a secure checkout link.','Mollie heeft geen veilige betaallink teruggestuurd.'));

      try{
        if(result.order?.access_token)localStorage.setItem('damion_order_token',result.order.access_token);
        if(result.order?.order_number)localStorage.setItem('damion_pending_order',result.order.order_number);
      }catch(_){}

      setMessage(tr('Opening Mollie iDEAL…','Mollie iDEAL openen…'));
      const url=result.checkout_url;
      window.location.href=url;
      setTimeout(()=>{try{window.location.assign(url);}catch(_){}},700);
    }catch(err){
      console.error('Checkout payment failed',err);
      const timeoutError=err?.name==='AbortError';
      setMessage(timeoutError?tr('Payment server took too long. Please try again.','De betaalserver reageerde te langzaam. Probeer het opnieuw.'):(err?.message||tr('Could not start iDEAL payment.','iDEAL-betaling kon niet worden gestart.')),'error');
      setBusy(false);
    }
  };

  window.addEventListener('pageshow',()=>setBusy(false));
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&!document.hidden)setBusy(false);});
})();
