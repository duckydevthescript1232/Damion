const DIRECT_PAYPAL_CLIENT_ID = "BAA36wrQNptWlEKeyk4yrNv52bL79vQNbMab71YlkMiokUQjVIq7C5cil3Er5rt3tAXuJeT3DhwEJ0pzhE";
let __directPayPalLoaded = false;
let __directPayPalRendered = false;

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
    s.onerror=()=>reject(new Error('PayPal SDK could not load.'));
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
    setCheckoutStatus('Loading PayPal Sandbox…');
    await loadDirectPayPalSdk();
    if(!window.paypal?.Buttons) throw new Error('PayPal button component did not load.');
    if(!__directPayPalRendered){
      container.innerHTML='';
      const buttons=window.paypal.Buttons({
        style:{layout:'vertical',shape:'rect',label:'paypal',height:48,tagline:false},
        createOrder:(data,actions)=>{
          const total=cart.reduce((sum,item)=>sum+Number(item.price||0),0).toFixed(2);
          return actions.order.create({
            purchase_units:[{
              description:'Damiøn music services',
              amount:{currency_code:'EUR',value:total}
            }]
          });
        },
        onApprove:async(data,actions)=>{
          try{
            setCheckoutStatus('Confirming PayPal Sandbox payment…');
            const details=await actions.order.capture();
            if(details?.status!=='COMPLETED') throw new Error('PayPal did not complete the payment.');
            const orderID=details.id||data.orderID;
            const amount=details?.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value||cart.reduce((s,x)=>s+Number(x.price||0),0).toFixed(2);
            cart=[];saveCart();closeModal('checkoutModal');
            showReceipt({status:'COMPLETED',orderID,amount,currency:'EUR'});
          }catch(err){
            console.error(err);
            setCheckoutStatus(err?.message||'Could not confirm PayPal payment.','error');
          }
        },
        onCancel:()=>setCheckoutStatus('PayPal checkout was cancelled. Nothing was charged.','warn'),
        onError:err=>{console.error(err);setCheckoutStatus('PayPal could not open or complete checkout.','error');}
      });
      if(typeof buttons.isEligible==='function' && !buttons.isEligible()) throw new Error('PayPal checkout is not eligible for this sandbox app/account.');
      await buttons.render('#paypalButtons');
      __directPayPalRendered=true;
    }
    setCheckoutStatus('PayPal Sandbox is ready. Click the PayPal button below.','ok');
  }catch(err){
    console.error(err);
    setCheckoutStatus(err?.message||'PayPal Sandbox is unavailable.','error');
  }
};
