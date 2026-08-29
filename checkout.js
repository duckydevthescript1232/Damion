const CART_KEY = "damion_cart";
const DETAILS_KEY = "damion_checkout_details";
const MOLLIE_CREATE_API = "/api/mollie-create";
const ORDER_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJIUzI1NiIsInJlZiI6Ind1dGxoY2Vxa2lvc2hlcGZieWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMDAxMDUsImV4cCI6MjEwMTU3NjEwNX0.Ad9wROEhZ2uKxKx9H5AHqCCmFa0nTezrBHkAn-Zwyws";

var checkoutCart = [];
var $ = function(id){ return document.getElementById(id); };
var eur = function(n){ return "€" + Number(n || 0).toFixed(2); };
var escapeHtml = function(value){ return String(value == null ? "" : value).replace(/[&<>'"]/g,function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]; }); };
var isNL = function(){ try{return (window.dmGetLanguage && window.dmGetLanguage()) === "nl";}catch(_){return document.documentElement.lang === "nl";} };
var tr = function(en,nl){ return isNL() ? nl : en; };

var COUNTRIES = ["Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo, Democratic Republic of the","Congo, Republic of the","Costa Rica","Côte d’Ivoire","Croatia","Cuba","Cyprus","Czechia","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","São Tomé and Príncipe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Türkiye","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"];

function populateCountries(){
  var select=$("coCountry");
  if(!select || select.options.length > 1)return;
  COUNTRIES.forEach(function(country){var o=document.createElement("option");o.value=country;o.textContent=country;select.appendChild(o);});
}
function readCart(){
  try{checkoutCart=JSON.parse(localStorage.getItem(CART_KEY)||"[]");}catch(_){checkoutCart=[];}
  if(!Array.isArray(checkoutCart))checkoutCart=[];
}
function orderTotal(){return checkoutCart.reduce(function(sum,item){return sum+Number(item.price||0);},0);}
function renderOrder(){
  var content=$("checkoutContent"),empty=$("emptyCheckout");
  if(!checkoutCart.length){if(content)content.hidden=true;if(empty)empty.hidden=false;return;}
  if(content)content.hidden=false;if(empty)empty.hidden=true;
  var items=$("checkoutItems");
  if(items)items.innerHTML=checkoutCart.map(function(item){
    var addons=(item.addons && item.addons.length)?" · "+item.addons.map(escapeHtml).join(", "):"";
    return '<div class="checkout-item"><div><b>'+escapeHtml(item.name||"Music service")+'</b><small>'+escapeHtml(item.package||"Selected package")+addons+'</small></div><strong>'+eur(item.price)+'</strong></div>';
  }).join("");
  if($("checkoutPageTotal"))$("checkoutPageTotal").textContent=eur(orderTotal());
}
function saveDetails(){
  var data={first:$("coFirst")?$("coFirst").value:"",last:$("coLast")?$("coLast").value:"",email:$("coEmail")?$("coEmail").value:"",artist:$("coArtist")?$("coArtist").value:"",country:$("coCountry")?$("coCountry").value:"",project:$("coProject")?$("coProject").value:"",delivery:$("coDelivery")?$("coDelivery").value:"Audio files (WAV/MP3/Stems)",notes:$("coNotes")?$("coNotes").value:""};
  try{localStorage.setItem(DETAILS_KEY,JSON.stringify(data));}catch(_){}
  return data;
}
function restoreDetails(){
  try{
    var data=JSON.parse(localStorage.getItem(DETAILS_KEY)||"{}");
    [["coFirst","first"],["coLast","last"],["coEmail","email"],["coArtist","artist"],["coCountry","country"],["coProject","project"],["coDelivery","delivery"],["coNotes","notes"]].forEach(function(pair){var el=$(pair[0]);if(el&&data[pair[1]])el.value=data[pair[1]];});
  }catch(_){}
}
function setMessage(text,type){var el=$("checkoutMessage");if(!el)return;el.textContent=text||"";el.className=("checkout-message "+(type||"")).trim();}
function safeCartForServer(){return checkoutCart.map(function(item){return {id:String(item.id||""),package:String(item.package||""),addons:Array.isArray(item.addons)?item.addons.slice(0,20):[]};});}

async function startIdealPayment(){
  var form=$("checkoutPageForm");
  if(!form || !form.reportValidity() || !checkoutCart.length)return;
  var d=saveDetails();
  var submit=$("continuePayment");
  if(submit)submit.disabled=true;
  setMessage(tr("Preparing secure iDEAL payment…","Veilige iDEAL-betaling voorbereiden…"));
  try{
    var response=await fetch(MOLLIE_CREATE_API,{
      method:"POST",cache:"no-store",headers:{"Content-Type":"application/json","apikey":ORDER_ANON,"Authorization":"Bearer "+ORDER_ANON,"Cache-Control":"no-cache"},
      body:JSON.stringify({email:d.email,first_name:d.first,last_name:d.last,artist_name:d.artist,country:d.country,project_name:d.project,delivery_format:d.delivery,notes:d.notes,cart:safeCartForServer()})
    });
    var result={};try{result=await response.json();}catch(_){}
    if(!response.ok)throw new Error(result.error||tr("Could not start iDEAL payment.","iDEAL-betaling kon niet worden gestart."));
    if(!result.checkout_url || !/^https:\/\//i.test(result.checkout_url))throw new Error(tr("Mollie did not return a secure checkout link.","Mollie heeft geen veilige betaallink teruggestuurd."));
    try{
      if(result.order&&result.order.access_token)localStorage.setItem("damion_order_token",result.order.access_token);
      if(result.order&&result.order.order_number)localStorage.setItem("damion_pending_order",result.order.order_number);
    }catch(_){}
    setMessage(tr("Opening Mollie iDEAL…","Mollie iDEAL openen…"));
    window.location.assign(result.checkout_url);
  }catch(err){
    console.error(err);
    setMessage((err&&err.message)||tr("Could not start iDEAL payment.","iDEAL-betaling kon niet worden gestart."),"error");
    if(submit)submit.disabled=false;
  }
}

window.addEventListener("DOMContentLoaded",function(){
  populateCountries();readCart();renderOrder();restoreDetails();
  var form=$("checkoutPageForm");if(form)form.addEventListener("submit",function(e){e.preventDefault();startIdealPayment();});
});
document.addEventListener("dm:languagechange",function(){renderOrder();});
