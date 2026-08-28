const CHECKOUT_PAYPAL_CLIENT_ID = "BAA6wn4RzBI6RFBOokMqSzQJCxrLjWFoLrYDbMHC_gVg-a6ySTfq8A3Yg_4TD8Jf9xmgY-Z0VeAOzKL63E";
const CART_KEY = "damion_cart";
const DETAILS_KEY = "damion_checkout_details";
const ORDER_API = "https://wutlhceqkioshepfbykf.supabase.co/functions/v1/damion-orders";
const ORDER_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dGxoY2Vxa2lvc2hlcGZieWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMDAxMDUsImV4cCI6MjEwMTU3NjEwNX0.Ad9wROEhZ2uKxKx9H5AHqCCmFa0nTezrBHkAn-Zwyws";
let checkoutCart = [];
let paypalSdkPromise = null;
let paypalButtonsRendered = false;
const $ = id => document.getElementById(id);
const eur = n => `€${Number(n || 0).toFixed(2)}`;
const escapeHtml = value => String(value ?? "").replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));

const COUNTRIES = [
"Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo, Democratic Republic of the","Congo, Republic of the","Costa Rica","Côte d’Ivoire","Croatia","Cuba","Cyprus","Czechia","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","São Tomé and Príncipe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Türkiye","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"
];
function populateCountries(){const select=$("coCountry");if(!select)return;const current=select.value;COUNTRIES.forEach(country=>{const o=document.createElement('option');o.value=country;o.textContent=country;select.appendChild(o)});if(current)select.value=current}
function readCart(){ try{ checkoutCart = JSON.parse(localStorage.getItem(CART_KEY) || "[]"); }catch(_){ checkoutCart = []; } if(!Array.isArray(checkoutCart)) checkoutCart = []; }
function orderTotal(){ return checkoutCart.reduce((sum,item)=>sum + Number(item.price || 0), 0); }
function renderOrder(){
  const content=$("checkoutContent"),empty=$("emptyCheckout");
  if(!checkoutCart.length){ if(content)content.hidden=true;if(empty)empty.hidden=false;return; }
  if(content)content.hidden=false;if(empty)empty.hidden=true;
  const items=$("checkoutItems");
  if(items)items.innerHTML=checkoutCart.map(item=>`<div class="checkout-item"><div><b>${escapeHtml(item.name||"Music service")}</b><small>${escapeHtml(item.package||"Selected package")}${item.addons?.length?` · ${item.addons.map(escapeHtml).join(", ")}`:""}</small></div><strong>${eur(item.price)}</strong></div>`).join("");
  if($("checkoutPageTotal"))$("checkoutPageTotal").textContent=eur(orderTotal());
}
function saveDetails(){
  const data={first:$("coFirst")?.value||"",last:$("coLast")?.value||"",email:$("coEmail")?.value||"",artist:$("coArtist")?.value||"",country:$("coCountry")?.value||"",project:$("coProject")?.value||"",delivery:$("coDelivery")?.value||"Audio files (WAV/MP3/Stems)",notes:$("coNotes")?.value||""};
  localStorage.setItem(DETAILS_KEY,JSON.stringify(data));return data;
}
function restoreDetails(){try{const data=JSON.parse(localStorage.getItem(DETAILS_KEY)||"{}");[["coFirst","first"],["coLast","last"],["coEmail","email"],["coArtist","artist"],["coCountry","country"],["coProject","project"],["coDelivery","delivery"],["coNotes","notes"]].forEach(([id,key])=>{const el=$(id);if(el&&data[key])el.value=data[key]})}catch(_){}}
function setMessage(text,type=""){const el=$("checkoutMessage");if(!el)return;el.textContent=text||"";el.className=`checkout-message ${type}`.trim()}
function loadPayPalSdk(){
  if(window.paypal?.Buttons)return Promise.resolve();if(paypalSdkPromise)return paypalSdkPromise;
  paypalSdkPromise=new Promise((resolve,reject)=>{const script=document.createElement("script");script.src=`https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(CHECKOUT_PAYPAL_CLIENT_ID)}&currency=EUR&intent=capture&components=buttons`;script.async=true;script.onload=resolve;script.onerror=()=>reject(new Error("Secure payment could not be loaded. Please refresh the page and try again."));document.head.appendChild(script)});return paypalSdkPromise;
}
async function createTrackingOrder(paypalOrderId){
  const d=saveDetails();
  const response=await fetch(ORDER_API,{method:"POST",headers:{"Content-Type":"application/json","apikey":ORDER_ANON,"Authorization":`Bearer ${ORDER_ANON}`},body:JSON.stringify({action:"create",email:d.email,customer_name:`${d.first} ${d.last}`.trim(),project_name:d.project,service_name:checkoutCart.map(x=>x.name||"Music service").join(" + "),package_name:checkoutCart.map(x=>x.package||"").filter(Boolean).join(" + "),paypal_order_id:paypalOrderId,amount_eur:orderTotal(),delivery_format:d.delivery})});
  let result={};try{result=await response.json()}catch(_){}
  if(!response.ok)throw new Error(result.error||"Could not create your tracking page");return result;
}
async function revealPayment(){
  const form=$("checkoutPageForm");if(!form||!form.reportValidity())return;saveDetails();const section=$("paymentSection"),loader=$("paymentLoading"),buttons=$("paypalCheckoutButtons");if(section)section.hidden=false;if(loader)loader.hidden=false;if(buttons)buttons.hidden=true;setMessage("");section?.scrollIntoView({behavior:"smooth",block:"start"});
  try{
    await loadPayPalSdk();if(!window.paypal?.Buttons)throw new Error("Secure payment could not be loaded. Please try again.");
    if(!paypalButtonsRendered){const rendered=window.paypal.Buttons({style:{layout:"vertical",shape:"rect",height:48,tagline:false},createOrder:(data,actions)=>{if(!form.reportValidity())return Promise.reject(new Error("Please check your project details."));saveDetails();return actions.order.create({purchase_units:[{description:"Damiønmusic production services",amount:{currency_code:"EUR",value:orderTotal().toFixed(2)}}]})},onApprove:async(data,actions)=>{
      try{
        setMessage("Confirming your payment…");const details=await actions.order.capture();if(details?.status!=="COMPLETED")throw new Error("The payment was not completed.");
        let tracking=null;try{tracking=await createTrackingOrder(details.id||data.orderID)}catch(orderErr){console.error(orderErr)}
        localStorage.removeItem(CART_KEY);const intro=document.querySelector(".checkout-intro");if(intro)intro.hidden=true;if($("checkoutContent"))$("checkoutContent").hidden=true;if($("checkoutSuccess"))$("checkoutSuccess").hidden=false;
        if(tracking?.order){$("successOrderId").textContent=tracking.order.order_number;$("successTrackOrder").href=tracking.portal_url;localStorage.setItem("damion_order_token",tracking.order.access_token);$("successText").textContent=tracking.email_sent?"Payment complete. Your private order room is ready and a confirmation email has been sent.":"Payment complete. Your private order room is ready — use the button below to track progress, message support and receive your files."}else{$("successOrderId").textContent=details.id||data.orderID||"Confirmed";$("successTrackOrder").href="/contact";$("successTrackOrder").textContent="Contact support";$("successText").textContent="Your payment succeeded, but the tracking room could not be created automatically. Keep your PayPal receipt and contact support so we can link your order."}
        window.scrollTo({top:0,behavior:"smooth"});
      }catch(err){console.error(err);setMessage(err?.message||"We couldn't confirm the payment. Please try again.","error")}
    },onCancel:()=>setMessage("Payment cancelled. Nothing was charged.","warn"),onError:err=>{console.error(err);setMessage("PayPal couldn't complete the checkout. Please try again.","error")}});if(typeof rendered.isEligible==="function"&&!rendered.isEligible())throw new Error("This payment option is not available right now.");await rendered.render("#paypalCheckoutButtons");paypalButtonsRendered=true}
    if(loader)loader.hidden=true;if(buttons)buttons.hidden=false;
  }catch(err){console.error(err);if(loader)loader.hidden=true;setMessage(err?.message||"Secure payment is temporarily unavailable.","error")}
}
function editDetails(){if($("paymentSection"))$("paymentSection").hidden=true;$("coFirst")?.focus();window.scrollTo({top:Math.max(0,($("checkoutPageForm")?.getBoundingClientRect().top||0)+window.scrollY-110),behavior:"smooth"})}
window.addEventListener("DOMContentLoaded",()=>{populateCountries();readCart();renderOrder();restoreDetails();$("checkoutPageForm")?.addEventListener("submit",e=>{e.preventDefault();revealPayment()});$("editDetails")?.addEventListener("click",editDetails);if(checkoutCart.length)loadPayPalSdk().catch(()=>{})});