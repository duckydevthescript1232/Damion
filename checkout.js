const CHECKOUT_PAYPAL_CLIENT_ID = "BAA6wn4RzBI6RFBOokMqSzQJCxrLjWFoLrYDbMHC_gVg-a6ySTfq8A3Yg_4TD8Jf9xmgY-Z0VeAOzKL63E";
const CART_KEY = "damion_cart";
const DETAILS_KEY = "damion_checkout_details";
let checkoutCart = [];
let paypalSdkPromise = null;
let paypalButtonsRendered = false;

const $ = id => document.getElementById(id);
const eur = n => `€${Number(n || 0).toFixed(2)}`;
const escapeHtml = value => String(value ?? "").replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));

function readCart(){
  try{ checkoutCart = JSON.parse(localStorage.getItem(CART_KEY) || "[]"); }
  catch(_){ checkoutCart = []; }
  if(!Array.isArray(checkoutCart)) checkoutCart = [];
}

function orderTotal(){
  return checkoutCart.reduce((sum,item)=>sum + Number(item.price || 0), 0);
}

function renderOrder(){
  const content = $("checkoutContent");
  const empty = $("emptyCheckout");
  if(!checkoutCart.length){
    if(content) content.hidden = true;
    if(empty) empty.hidden = false;
    return;
  }
  if(content) content.hidden = false;
  if(empty) empty.hidden = true;
  const items = $("checkoutItems");
  if(items){
    items.innerHTML = checkoutCart.map(item => `
      <div class="checkout-item">
        <div><b>${escapeHtml(item.name || "Music service")}</b><small>${escapeHtml(item.package || "Selected package")}${item.addons?.length ? ` · ${item.addons.map(escapeHtml).join(", ")}` : ""}</small></div>
        <strong>${eur(item.price)}</strong>
      </div>`).join("");
  }
  if($("checkoutPageTotal")) $("checkoutPageTotal").textContent = eur(orderTotal());
}

function saveDetails(){
  const data = {
    first: $("coFirst")?.value || "",
    last: $("coLast")?.value || "",
    email: $("coEmail")?.value || "",
    artist: $("coArtist")?.value || "",
    country: $("coCountry")?.value || "",
    project: $("coProject")?.value || "",
    notes: $("coNotes")?.value || ""
  };
  localStorage.setItem(DETAILS_KEY, JSON.stringify(data));
  return data;
}

function restoreDetails(){
  try{
    const data = JSON.parse(localStorage.getItem(DETAILS_KEY) || "{}");
    [["coFirst","first"],["coLast","last"],["coEmail","email"],["coArtist","artist"],["coCountry","country"],["coProject","project"],["coNotes","notes"]].forEach(([id,key])=>{
      const el=$(id); if(el && data[key]) el.value=data[key];
    });
  }catch(_){}
}

function setMessage(text,type=""){
  const el=$("checkoutMessage");
  if(!el) return;
  el.textContent = text || "";
  el.className = `checkout-message ${type}`.trim();
}

function loadPayPalSdk(){
  if(window.paypal?.Buttons) return Promise.resolve();
  if(paypalSdkPromise) return paypalSdkPromise;
  paypalSdkPromise = new Promise((resolve,reject)=>{
    const script=document.createElement("script");
    script.src=`https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(CHECKOUT_PAYPAL_CLIENT_ID)}&currency=EUR&intent=capture&components=buttons`;
    script.async=true;
    script.onload=()=>resolve();
    script.onerror=()=>reject(new Error("Secure payment could not be loaded. Please refresh the page and try again."));
    document.head.appendChild(script);
  });
  return paypalSdkPromise;
}

async function revealPayment(){
  const form=$("checkoutPageForm");
  if(!form || !form.reportValidity()) return;
  saveDetails();
  const section=$("paymentSection");
  const loader=$("paymentLoading");
  const buttons=$("paypalCheckoutButtons");
  if(section) section.hidden=false;
  if(loader) loader.hidden=false;
  if(buttons) buttons.hidden=true;
  setMessage("");
  section?.scrollIntoView({behavior:"smooth",block:"start"});

  try{
    await loadPayPalSdk();
    if(!window.paypal?.Buttons) throw new Error("Secure payment could not be loaded. Please try again.");
    if(!paypalButtonsRendered){
      const rendered = window.paypal.Buttons({
        style:{layout:"vertical",shape:"rect",height:48,tagline:false},
        createOrder:(data,actions)=>{
          if(!form.reportValidity()) return Promise.reject(new Error("Please check your project details."));
          saveDetails();
          const total=orderTotal().toFixed(2);
          return actions.order.create({
            purchase_units:[{
              description:"Damiøn music services",
              amount:{currency_code:"EUR",value:total}
            }]
          });
        },
        onApprove:async(data,actions)=>{
          try{
            setMessage("Confirming your payment…");
            const details=await actions.order.capture();
            if(details?.status!=="COMPLETED") throw new Error("The payment was not completed.");
            localStorage.removeItem(CART_KEY);
            const intro=document.querySelector(".checkout-intro");
            if(intro) intro.hidden=true;
            if($("checkoutContent")) $("checkoutContent").hidden=true;
            if($("checkoutSuccess")) $("checkoutSuccess").hidden=false;
            if($("successOrderId")) $("successOrderId").textContent=details.id || data.orderID || "Confirmed";
            window.scrollTo({top:0,behavior:"smooth"});
          }catch(err){
            console.error(err);
            setMessage(err?.message || "We couldn't confirm the payment. Please try again.","error");
          }
        },
        onCancel:()=>setMessage("Payment cancelled. Nothing was charged.","warn"),
        onError:err=>{
          console.error(err);
          setMessage("PayPal couldn't complete the checkout. Please try again.","error");
        }
      });
      if(typeof rendered.isEligible === "function" && !rendered.isEligible()) throw new Error("This payment option is not available right now.");
      await rendered.render("#paypalCheckoutButtons");
      paypalButtonsRendered=true;
    }
    if(loader) loader.hidden=true;
    if(buttons) buttons.hidden=false;
  }catch(err){
    console.error(err);
    if(loader) loader.hidden=true;
    setMessage(err?.message || "Secure payment is temporarily unavailable.","error");
  }
}

function editDetails(){
  if($("paymentSection")) $("paymentSection").hidden=true;
  $("coFirst")?.focus();
  window.scrollTo({top:Math.max(0,($("checkoutPageForm")?.getBoundingClientRect().top || 0)+window.scrollY-110),behavior:"smooth"});
}

window.addEventListener("DOMContentLoaded",()=>{
  readCart();
  renderOrder();
  restoreDetails();
  $("checkoutPageForm")?.addEventListener("submit",e=>{e.preventDefault();revealPayment();});
  $("editDetails")?.addEventListener("click",editDetails);
  if(checkoutCart.length) loadPayPalSdk().catch(()=>{});
});
