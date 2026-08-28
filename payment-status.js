(()=>{
  const update=()=>{
    const hint=document.getElementById('paymentMethodHint');
    const ideal=document.getElementById('idealCheckout');
    const paypal=document.getElementById('paypalCheckoutButtons');
    if(!hint)return;

    let text='Checking available payment methods…';
    if(ideal&&!ideal.hidden){
      text='Pay with iDEAL, PayPal or another supported PayPal checkout option.';
    }else if(paypal&&!paypal.hidden){
      text='Pay with PayPal or another available option. iDEAL will appear here once PayPal enables it for this merchant.';
    }

    if(hint.textContent!==text)hint.textContent=text;
  };

  document.addEventListener('DOMContentLoaded',()=>{
    update();
    const root=document.getElementById('paymentSection')||document.body;
    const observer=new MutationObserver(update);
    observer.observe(root,{subtree:true,attributes:true,attributeFilter:['hidden']});
    setTimeout(update,1200);
    setTimeout(update,3000);
  });
})();