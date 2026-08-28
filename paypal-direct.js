const DIRECT_PAYPAL_CLIENT_ID = "BAA6wn4RzBI6RFBOokMqSzQJCxrLjWFoLrYDbMHC_gVg-a6ySTfq8A3Yg_4TD8Jf9xmgY-Z0VeAOzKL63E";
let __directPayPalLoaded = false;
let __directPayPalRendered = false;

window.openCheckout = function(){
  if(!cart?.length){ toast("Add a service first"); return; }
  window.location.href = "/checkout";
};

async function loadDirectPayPalSdk(){
  if(window.paypal?.Buttons && __directPayPalLoaded) return;
  const old = document.querySelector('script[data-damion-paypal]');
  if(old) old.remove();
  try { delete window.paypal; } catch(_) { window.paypal = undefined; }
  await new Promise((resolve,reject)=>{
    const s=document.createElement('script');
    s.src=`https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(DIRECT_PAYPAL_CLIENT_ID)}&currency=EUR&intent=capture&components=buttons`;
    s.dataset.damionPaypal='1';
    s.async=true;
    s.onload=()=>{__directPayPalLoaded=true;resolve();};
    s.onerror=()=>reject(new Error('Secure payment could not load.'));
    document.head.appendChild(s);
  });
}

window.payWithPayPal = async function(){
  const form=byId('checkoutForm');
  if(!form || !cart.length){toast('Add a service first');return;}
  if(!form.reportValidity()) return;
  setPaymentChoice('paypal');
  const wrap=byId('paypalWrap');
  const container=byId('paypalButtons');
  if(!wrap || !container) return;
  wrap.hidden=false;
  try{
    setCheckoutStatus('Preparing secure payment…');
    await loadDirectPayPalSdk();
    if(!window.paypal?.Buttons) throw new Error('PayPal button did not load.');
    if(!__directPayPalRendered){
      container.innerHTML='';
      const buttons=window.paypal.Buttons({
        style:{layout:'vertical',shape:'rect',label:'paypal',height:48,tagline:false},
        createOrder:(data,actions)=>{
          const total=cart.reduce((sum,item)=>sum+Number(item.price||0),0).toFixed(2);
          return actions.order.create({purchase_units:[{description:'Damiøn music services',amount:{currency_code:'EUR',value:total}}]});
        },
        onApprove:async(data,actions)=>{
          try{
            setCheckoutStatus('Confirming your payment…');
            const details=await actions.order.capture();
            if(details?.status!=='COMPLETED') throw new Error('The payment was not completed.');
            const orderID=details.id||data.orderID;
            const amount=details?.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value||cart.reduce((s,x)=>s+Number(x.price||0),0).toFixed(2);
            cart=[];saveCart();closeModal('checkoutModal');showReceipt({status:'COMPLETED',orderID,amount,currency:'EUR'});
          }catch(err){
            console.error(err);setCheckoutStatus(err?.message||'Could not confirm payment.','error');
          }
        },
        onCancel:()=>setCheckoutStatus('Payment cancelled. Nothing was charged.','warn'),
        onError:err=>{console.error(err);setCheckoutStatus('PayPal could not complete checkout. Please try again.','error');}
      });
      if(typeof buttons.isEligible==='function' && !buttons.isEligible()) throw new Error('PayPal is not available right now.');
      await buttons.render('#paypalButtons');
      __directPayPalRendered=true;
    }
    setCheckoutStatus('Choose a payment option below.','ok');
  }catch(err){
    console.error(err);setCheckoutStatus(err?.message||'Secure payment is temporarily unavailable.','error');
  }
};
