const CART_KEY = "damion_cart";
const DETAILS_KEY = "damion_checkout_details";
const ORDER_REQUEST_API = "https://wutlhceqkioshepfbykf.supabase.co/functions/v1/damion-order-request";
const ORDER_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dGxoY2Vxa2lvc2hlcGZieWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMDAxMDUsImV4cCI6MjEwMTU3NjEwNX0.Ad9wROEhZ2uKxKx9H5AHqCCmFa0nTezrBHkAn-Zwyws";

let checkoutCart = [];
const $ = id => document.getElementById(id);
const eur = n => `€${Number(n || 0).toFixed(2)}`;
const escapeHtml = value => String(value ?? "").replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));

const COUNTRIES = [
"Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo, Democratic Republic of the","Congo, Republic of the","Costa Rica","Côte d’Ivoire","Croatia","Cuba","Cyprus","Czechia","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","São Tomé and Príncipe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Türkiye","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"
];

function populateCountries(){
  const select=$("coCountry");
  if(!select)return;
  const current=select.value;
  COUNTRIES.forEach(country=>{const o=document.createElement('option');o.value=country;o.textContent=country;select.appendChild(o)});
  if(current)select.value=current;
}
function readCart(){
  try{checkoutCart=JSON.parse(localStorage.getItem(CART_KEY)||"[]")}catch(_){checkoutCart=[]}
  if(!Array.isArray(checkoutCart))checkoutCart=[];
}
function orderTotal(){return checkoutCart.reduce((sum,item)=>sum+Number(item.price||0),0)}
function renderOrder(){
  const content=$("checkoutContent"),empty=$("emptyCheckout");
  if(!checkoutCart.length){if(content)content.hidden=true;if(empty)empty.hidden=false;return}
  if(content)content.hidden=false;if(empty)empty.hidden=true;
  const items=$("checkoutItems");
  if(items)items.innerHTML=checkoutCart.map(item=>`<div class="checkout-item"><div><b>${escapeHtml(item.name||"Music service")}</b><small>${escapeHtml(item.package||"Selected package")}${item.addons?.length?` · ${item.addons.map(escapeHtml).join(", ")}`:""}</small></div><strong>${eur(item.price)}</strong></div>`).join("");
  if($("checkoutPageTotal"))$("checkoutPageTotal").textContent=eur(orderTotal());
}
function saveDetails(){
  const data={first:$("coFirst")?.value||"",last:$("coLast")?.value||"",email:$("coEmail")?.value||"",artist:$("coArtist")?.value||"",country:$("coCountry")?.value||"",project:$("coProject")?.value||"",delivery:$("coDelivery")?.value||"Audio files (WAV/MP3/Stems)",notes:$("coNotes")?.value||""};
  localStorage.setItem(DETAILS_KEY,JSON.stringify(data));
  return data;
}
function restoreDetails(){
  try{
    const data=JSON.parse(localStorage.getItem(DETAILS_KEY)||"{}");
    [["coFirst","first"],["coLast","last"],["coEmail","email"],["coArtist","artist"],["coCountry","country"],["coProject","project"],["coDelivery","delivery"],["coNotes","notes"]].forEach(([id,key])=>{const el=$(id);if(el&&data[key])el.value=data[key]});
  }catch(_){}
}
function setMessage(text,type=""){
  const el=$("checkoutMessage");if(!el)return;
  el.textContent=text||"";el.className=`checkout-message ${type}`.trim();
}

async function createPendingOrder(){
  const form=$("checkoutPageForm");
  if(!form||!form.reportValidity()||!checkoutCart.length)return;
  const d=saveDetails();
  const submit=$("continuePayment");
  if(submit)submit.disabled=true;
  setMessage("Saving your order request…");
  try{
    const response=await fetch(ORDER_REQUEST_API,{
      method:"POST",
      cache:"no-store",
      headers:{"Content-Type":"application/json","apikey":ORDER_ANON,"Authorization":`Bearer ${ORDER_ANON}`},
      body:JSON.stringify({
        email:d.email,
        customer_name:`${d.first} ${d.last}`.trim(),
        project_name:d.project,
        service_name:checkoutCart.map(x=>x.name||"Music service").join(" + "),
        package_name:checkoutCart.map(x=>x.package||"").filter(Boolean).join(" + "),
        amount_eur:orderTotal(),
        delivery_format:d.delivery,
        notes:d.notes,
        website:""
      })
    });
    let result={};try{result=await response.json()}catch(_){}
    if(!response.ok)throw new Error(result.error||"Could not save your order request.");

    localStorage.removeItem(CART_KEY);
    if(result?.order?.access_token)localStorage.setItem("damion_order_token",result.order.access_token);
    document.querySelector(".checkout-intro")?.setAttribute("hidden","");
    if($("checkoutContent"))$("checkoutContent").hidden=true;
    if($("checkoutSuccess"))$("checkoutSuccess").hidden=false;
    if($("successOrderId"))$("successOrderId").textContent=result?.order?.order_number||"Saved";
    if($("successTrackOrder"))$("successTrackOrder").href=result?.portal_url||"/order";
    if($("successText"))$("successText").textContent=result?.email_sent?"Your order request is saved as Pending payment. No payment was taken. Your private order link was also sent by email.":"Your order request is saved as Pending payment. No payment was taken. Use the button below to open your private order room.";
    window.scrollTo({top:0,behavior:"smooth"});
  }catch(err){
    console.error(err);
    setMessage(err?.message||"Could not save your order request.","error");
    if(submit)submit.disabled=false;
  }
}

window.addEventListener("DOMContentLoaded",()=>{
  populateCountries();
  readCart();
  renderOrder();
  restoreDetails();
  $("checkoutPageForm")?.addEventListener("submit",e=>{e.preventDefault();createPendingOrder()});
});
