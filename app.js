const SERVICES = [
  {id:"mixing",name:"Mixing",desc:"Clean, punchy and balanced mixing for vocals, beats and full productions.",from:39,tags:["3–5 days","2 revisions"],packages:[["Starter Mix",39,"Up to 12 stems"],["Pro Mix",59,"Up to 25 stems"],["Full Mix",79,"Up to 50 stems"]]},
  {id:"mastering",name:"Mastering",desc:"Final loudness, tone and polish for a release-ready stereo master.",from:25,tags:["2–3 days","WAV + MP3"],packages:[["Streaming Master",25,"Balanced streaming master"],["Club Master",35,"Higher-impact alternate master"],["Complete Master",49,"Streaming + club versions"]]},
  {id:"mix-master",name:"Mixing + Mastering",desc:"A complete finishing workflow from raw stems to final release master.",from:59,tags:["Most popular","4–6 days"],packages:[["Essential",59,"Up to 20 stems"],["Professional",79,"Up to 35 stems"],["Premium",109,"Up to 55 stems"]]},
  {id:"custom-beat",name:"Custom Beat Production",desc:"An original beat built around your genre, references and vocal direction.",from:49,tags:["Original","Commercial use"],packages:[["Starter",49,"Core custom beat"],["Artist",79,"Expanded arrangement"],["Exclusive",119,"Full premium beat package"]]},
  {id:"instrumental",name:"Custom Instrumental",desc:"A complete instrumental written and produced around your song idea.",from:69,tags:["Arrangement","Stems option"],packages:[["Basic",69,"Core instrumental"],["Studio",99,"Full arrangement"],["Premium",149,"Detailed full production"]]},
  {id:"vocal",name:"Vocal Production",desc:"Cleanup, timing, tuning and creative processing for polished modern vocals.",from:35,tags:["Tuning","FX"],packages:[["Clean",35,"Lead vocal cleanup"],["Produced",55,"Lead + doubles"],["Full",79,"Full vocal stack"]]},
  {id:"remix",name:"Remix Production",desc:"Rebuild your song in a fresh direction while keeping its strongest identity.",from:79,tags:["New direction","Arrangement"],packages:[["Remix",79,"Core remix"],["Extended",119,"Full extended production"],["Premium",159,"Detailed remix package"]]},
  {id:"midi",name:"MIDI / Melody Creation",desc:"Original melodies, chords and musical ideas delivered as editable MIDI.",from:25,tags:["Editable MIDI","Fast delivery"],packages:[["Melody",25,"Melody MIDI"],["Melody + Chords",39,"Two-part idea"],["Idea Pack",59,"Full MIDI concept"]]},
  {id:"full-production",name:"Full Song Production",desc:"Turn a vocal, demo or idea into a complete, polished record.",from:129,tags:["Flagship service","5–10 days"],packages:[["Foundation",129,"Core production"],["Artist",179,"Advanced full production"],["Signature",249,"Complete premium package"]]}
];

const ADDONS = [
  ["Priority delivery",15],["Additional revision",10],["Vocal tuning",12],["Instrumental export",8],
  ["Acapella export",8],["Radio edit",10],["Project stems",12],["Project file",15]
];

const TRACKS = [
  ["Midnight Drive","House · Production",0],
  ["Lowlight","Pop · Mix direction",1],
  ["Afterhours","EDM · Production",2]
];

const BACKEND = {
  functionsBase:"https://wutlhceqkioshepfbykf.supabase.co/functions/v1",
  anonKey:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dGxoY2Vxa2lvc2hlcGZieWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMDAxMDUsImV4cCI6MjEwMTU3NjEwNX0.Ad9wROEhZ2uKxKx9H5AHqCCmFa0nTezrBHkAn-Zwyws"
};

let cart=[];
try{ cart=JSON.parse(localStorage.getItem("damion_cart")||"[]"); }catch(_){ cart=[]; }
let current=null,pkg=0,extras=new Set(),paypalConfig=null,paypalRendered=false;
const eur=n=>"€"+Number(n).toFixed(2);
const byId=id=>document.getElementById(id);
const escapeHtml=v=>String(v??"").replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));

function toast(msg){const t=byId("toast");if(!t)return;t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
function openModal(id){byId(id)?.classList.add("open")}
function closeModal(id){byId(id)?.classList.remove("open")}
function openCart(){renderCart();byId("drawerBg")?.classList.add("open");byId("cartDrawer")?.classList.add("open")}
function closeCart(){byId("drawerBg")?.classList.remove("open");byId("cartDrawer")?.classList.remove("open")}
function saveCart(){localStorage.setItem("damion_cart",JSON.stringify(cart));renderCart()}

async function apiCall(fn,body){
  const res=await fetch(`${BACKEND.functionsBase}/${fn}?t=${Date.now()}`,{
    method:"POST",
    cache:"no-store",
    headers:{"Content-Type":"application/json","apikey":BACKEND.anonKey,"Authorization":`Bearer ${BACKEND.anonKey}`,"Cache-Control":"no-cache"},
    body:JSON.stringify(body)
  });
  let data={};
  try{data=await res.json()}catch(_){}
  if(!res.ok)throw new Error(data?.error||data?.details||`Request failed (${res.status})`);
  return data;
}

function renderCart(){
  const count=byId("cartCount");if(count)count.textContent=cart.length;
  const items=byId("cartItems"),total=byId("cartTotal");
  if(items)items.innerHTML=cart.length?cart.map((x,i)=>`<div class="cartitem"><h4>${escapeHtml(x.name)}</h4><p>${escapeHtml(x.package)}${x.addons?.length?" · "+x.addons.map(escapeHtml).join(", "):""}</p><div class="row"><b>${eur(x.price)}</b><button class="remove" onclick="removeItem(${i})">Remove</button></div></div>`).join(""):`<p style="color:var(--muted)">Your cart is empty.</p>`;
  if(total)total.textContent=eur(cart.reduce((s,x)=>s+Number(x.price||0),0));
}
function removeItem(i){cart.splice(i,1);saveCart()}

function renderServiceRows(targetId){
  const el=byId(targetId);if(!el)return;
  el.innerHTML=SERVICES.map((s,i)=>`<article class="service-row"><div class="no">${String(i+1).padStart(2,"0")}</div><div class="title"><b>${escapeHtml(s.name)}</b><span>${escapeHtml(s.desc)}</span></div><div class="tags">${s.tags.map(x=>`<span class="tag">${escapeHtml(x)}</span>`).join("")}</div><div class="price"><small>from</small><b>${eur(s.from)}</b></div><button class="btn" onclick="configure('${s.id}')">Choose</button></article>`).join("");
}

function renderPricing(){
  const el=byId("pricingGrid");if(!el)return;
  const picks=[SERVICES.find(x=>x.id==="mastering"),SERVICES.find(x=>x.id==="mix-master"),SERVICES.find(x=>x.id==="full-production")];
  el.innerHTML=picks.map((s,i)=>`<article class="price-card ${i===1?"pop":""}">${i===1?'<span class="pop">Popular</span>':""}<div class="kicker">${i===0?"Quick finish":i===1?"Best value":"Full build"}</div><h3>${escapeHtml(s.name)}</h3><p>${escapeHtml(s.desc)}</p><div class="bigprice">${eur(s.from)}</div><ul>${s.packages.slice(0,3).map(p=>`<li>${escapeHtml(p[0])} available</li>`).join("")}<li>Secure PayPal checkout</li></ul><a class="btn ${i===1?"primary":""}" href="/services#start">Choose service</a></article>`).join("");
}

function configure(id){
  current=SERVICES.find(s=>s.id===id);if(!current)return;pkg=0;extras.clear();
  if(byId("cfgTitle"))byId("cfgTitle").textContent=current.name;
  if(byId("cfgDesc"))byId("cfgDesc").textContent=current.desc;
  renderConfig();openModal("configModal");
}
function renderConfig(){
  if(!current)return;
  const pEl=byId("packages"),aEl=byId("addons"),tEl=byId("cfgTotal");
  if(pEl)pEl.innerHTML=current.packages.map((p,i)=>`<div class="package ${i===pkg?"active":""}" onclick="pkg=${i};renderConfig()"><b>${escapeHtml(p[0])} · ${eur(p[1])}</b><span>${escapeHtml(p[2])}</span></div>`).join("");
  if(aEl)aEl.innerHTML=ADDONS.map((a,i)=>`<div class="addon"><label><input type="checkbox" ${extras.has(i)?"checked":""} onchange="toggleExtra(${i})">${escapeHtml(a[0])}</label><b>+${eur(a[1])}</b></div>`).join("");
  if(tEl)tEl.textContent=eur(current.packages[pkg][1]+[...extras].reduce((s,i)=>s+ADDONS[i][1],0));
}
function toggleExtra(i){extras.has(i)?extras.delete(i):extras.add(i);renderConfig()}
function addConfigured(){
  if(!current)return;const p=current.packages[pkg],ex=[...extras].map(i=>ADDONS[i]);
  cart.push({key:Date.now()+Math.random(),id:current.id,name:current.name,package:p[0],addons:ex.map(x=>x[0]),price:p[1]+ex.reduce((s,x)=>s+x[1],0)});
  saveCart();closeModal("configModal");openCart();toast("Added to cart");
}

function openCheckout(){
  if(!cart.length){toast("Add a service first");return}
  closeCart();resetCheckoutPayment();
  const s=byId("checkoutSummary"),t=byId("checkoutTotal");
  if(s)s.innerHTML=cart.map(x=>`<div class="summary-line"><span>${escapeHtml(x.name)}<br><small style="color:var(--muted)">${escapeHtml(x.package)}</small></span><b>${eur(x.price)}</b></div>`).join("");
  if(t)t.textContent=eur(cart.reduce((a,b)=>a+b.price,0));
  openModal("checkoutModal");
}

function checkoutDetails(){return{customer:{first_name:byId("first")?.value||"",last_name:byId("last")?.value||"",email:byId("email")?.value||"",artist_name:byId("artist")?.value||"",country:byId("country")?.value||""},project_name:byId("projectName")?.value||"",notes:byId("notes")?.value||""}}
function setCheckoutStatus(msg,type=""){const el=byId("checkoutStatus");if(!el)return;el.textContent=msg;el.className=`checkout-status ${type}`.trim()}

async function loadPayPal(){
  paypalConfig=await apiCall("damion-paypal",{action:"config"});
  if(!paypalConfig?.hasClientId&&!paypalConfig?.clientId)throw new Error("PayPal Client ID is missing in the connected Supabase project.");
  if(window.paypal)return;
  await new Promise((resolve,reject)=>{
    const old=document.querySelector('script[data-damion-paypal]');if(old)old.remove();
    const s=document.createElement("script");
    s.src=`https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(paypalConfig.clientId)}&currency=EUR&intent=capture&components=buttons`;
    s.dataset.damionPaypal="1";s.async=true;
    s.onload=resolve;s.onerror=()=>reject(new Error("PayPal could not load. Check that the Client ID belongs to a Live REST app."));
    document.head.appendChild(s);
  });
}

async function showPayPalButtons(){
  const wrap=byId("paypalWrap"),buttons=byId("paypalButtons"),continueBtn=byId("checkoutContinue");
  if(!wrap||!buttons)return;
  try{
    setCheckoutStatus("Connecting to PayPal…");if(continueBtn)continueBtn.disabled=true;
    await loadPayPal();
    wrap.hidden=false;
    if(paypalConfig.environment!=="live")setCheckoutStatus("PayPal is connected to Sandbox. Use Live credentials for real payments.","warn");
    else if(!paypalConfig.hasClientSecret)setCheckoutStatus("PayPal button loaded, but the Live Client Secret is missing in Supabase.","error");
    else setCheckoutStatus("PayPal Live is connected. Choose PayPal below to continue.","ok");
    if(paypalRendered)return;paypalRendered=true;
    window.paypal.Buttons({
      style:{layout:"vertical",shape:"rect",label:"paypal",height:46},
      createOrder:async()=>{
        try{
          setCheckoutStatus("Creating secure PayPal order…");
          const result=await apiCall("damion-paypal",{action:"create",cart,...checkoutDetails()});
          setCheckoutStatus("PayPal order ready.","ok");
          return result.orderID;
        }catch(err){setCheckoutStatus(err?.message||"Could not create PayPal order.","error");throw err}
      },
      onApprove:async data=>{
        try{
          setCheckoutStatus("Confirming payment…");
          const result=await apiCall("damion-paypal",{action:"capture",orderID:data.orderID});
          if(result.status!=="COMPLETED")throw new Error("Payment was not completed.");
          cart=[];saveCart();closeModal("checkoutModal");showReceipt(result);
        }catch(err){setCheckoutStatus(err?.message||"Could not confirm payment.","error")}
      },
      onCancel:()=>setCheckoutStatus("Payment cancelled. Nothing was charged.","warn"),
      onError:err=>{console.error(err);if(!byId("checkoutStatus")?.textContent?.includes("PayPal"))setCheckoutStatus("PayPal could not complete the payment. Please try again.","error")}
    }).render("#paypalButtons");
  }catch(err){console.error(err);setCheckoutStatus(err?.message||"Payments are temporarily unavailable.","error");if(continueBtn)continueBtn.disabled=false}
}

function resetCheckoutPayment(){
  const wrap=byId("paypalWrap"),buttons=byId("paypalButtons"),btn=byId("checkoutContinue"),f=byId("checkoutForm");
  if(wrap)wrap.hidden=true;if(buttons)buttons.innerHTML="";if(btn)btn.disabled=false;
  if(f)Array.from(f.elements).forEach(el=>{if(el.tagName==="INPUT"||el.tagName==="TEXTAREA"||el.tagName==="SELECT")el.disabled=false});
  paypalRendered=false;setCheckoutStatus("");
}

function setupCheckoutForm(){
  const f=byId("checkoutForm");if(!f)return;
  f.addEventListener("submit",async e=>{e.preventDefault();if(!cart.length){toast("Your cart is empty");return}if(!f.reportValidity())return;await showPayPalButtons()});
}

function showReceipt(result){
  const title=byId("genericTitle"),body=byId("genericBody");
  if(title)title.textContent="Payment received";
  if(body)body.innerHTML=`<div class="success-panel"><div class="success-mark">✓</div><h3>Thank you — your project is booked.</h3><p>Your PayPal payment was confirmed successfully.</p><div class="receipt-row"><span>Order</span><b>${escapeHtml(result.orderID||"Confirmed")}</b></div>${result.amount?`<div class="receipt-row"><span>Paid</span><b>€${escapeHtml(result.amount)}</b></div>`:""}<p class="small-muted">Keep your PayPal receipt. Your submitted project details are stored with the order.</p></div>`;
  openModal("genericModal");
}

function makeDemoAudio(seed=0){
  const sampleRate=8000,seconds=3,count=sampleRate*seconds,buf=new ArrayBuffer(44+count*2),v=new DataView(buf);
  const put=(o,t)=>{for(let i=0;i<t.length;i++)v.setUint8(o+i,t.charCodeAt(i))};put(0,"RIFF");v.setUint32(4,36+count*2,true);put(8,"WAVEfmt ");v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,sampleRate,true);v.setUint32(28,sampleRate*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);put(36,"data");v.setUint32(40,count*2,true);
  const notes=[[110,138.59,164.81],[98,123.47,146.83],[130.81,164.81,196]][seed%3];
  for(let i=0;i<count;i++){const t=i/sampleRate,beat=(t*2)%1;let x=0;notes.forEach((n,j)=>x+=Math.sin(2*Math.PI*n*t)*(.09/(j+1)));x+=Math.sin(2*Math.PI*58*t)*Math.exp(-beat*9)*.22;x=Math.max(-.9,Math.min(.9,x));v.setInt16(44+i*2,Math.round(x*32767),true)}
  return URL.createObjectURL(new Blob([buf],{type:"audio/wav"}));
}
const AUDIO_SRCS=[0,1,2].map(makeDemoAudio);

function renderTracks(id){const el=byId(id);if(!el)return;el.innerHTML=TRACKS.map((t,i)=>`<div class="track-card"><div class="num">${String(i+1).padStart(2,"0")}</div><div><b>${t[0]}</b><br><span>Audio preview</span></div><div class="kind"><span>${t[1]}</span></div><button id="tp${i}" class="tplay" onclick="toggleTrack(${i})" aria-label="Play ${t[0]}">▶</button></div>`).join("")}
function toggleTrack(i){TRACKS.forEach((_,j)=>{if(j!==i){byId("a"+j)?.pause();const b=byId("tp"+j);if(b)b.textContent="▶"}});const a=byId("a"+i),b=byId("tp"+i);if(!a||!b)return;if(a.paused){a.play().catch(()=>{});b.textContent="Ⅱ"}else{a.pause();b.textContent="▶"}}
function buildBars(){const meter=byId("compareBars");if(meter)meter.innerHTML=Array.from({length:34},(_,i)=>`<i style="--h:${18+Math.abs(Math.sin(i*.71))*52+(i%4)*5}%"></i>`).join("")}
function setCompare(mode){const bb=byId("beforeBtn"),ab=byId("afterBtn"),title=byId("compareTitle"),text=byId("compareText"),bars=byId("compareBars"),audio=byId("compareAudio");if(!bb||!ab||!title||!text||!bars)return;bb.classList.toggle("active",mode==="before");ab.classList.toggle("active",mode==="after");bars.className="bars "+(mode==="after"?"after":"");title.textContent=mode==="before"?"Before — raw balance":"After — refined direction";text.textContent=mode==="before"?"A rawer balance used to demonstrate the comparison player.":"A more focused balance with stronger control and impact.";if(audio)audio.src=mode==="before"?AUDIO_SRCS[1]:AUDIO_SRCS[0]}
function toggleCompare(){const a=byId("compareAudio");if(a)a.paused?a.play().catch(()=>{}):a.pause()}
function setupHeroPlayer(){const a=byId("heroAudio"),play=byId("heroPlay"),prog=byId("heroProg"),time=byId("heroTime");if(!a||!play||!prog||!time)return;play.onclick=()=>{if(a.paused){a.play().catch(()=>{});play.textContent="Ⅱ"}else{a.pause();play.textContent="▶"}};a.addEventListener("timeupdate",()=>{prog.style.width=(a.currentTime/(a.duration||1)*100)+"%";time.textContent=Math.floor(a.currentTime/60)+":"+String(Math.floor(a.currentTime%60)).padStart(2,"0")});a.addEventListener("ended",()=>play.textContent="▶")}

function setupContact(){
  const f=byId("contactForm");if(!f)return;const btn=f.querySelector('button[type="submit"]');
  const service=new URLSearchParams(location.search).get("service");if(service&&byId("cs"))byId("cs").value=`Project inquiry — ${service}`;
  f.addEventListener("submit",async e=>{e.preventDefault();if(!f.reportValidity())return;const original=btn?.textContent||"Send message";if(btn){btn.disabled=true;btn.textContent="Sending…"}const status=byId("contactStatus");if(status){status.textContent="";status.className="checkout-status"}try{await apiCall("damion-contact",{name:byId("cn")?.value||"",email:byId("ce")?.value||"",subject:byId("cs")?.value||"Project inquiry",message:byId("cm")?.value||"",website:byId("cw")?.value||""});f.reset();if(status){status.textContent="Message sent successfully.";status.className="checkout-status ok"}toast("Message sent")}catch(err){if(status){status.textContent=err?.message||"Could not send your message.";status.className="checkout-status error"}}finally{if(btn){btn.disabled=false;btn.textContent=original}}});
}

window.addEventListener("DOMContentLoaded",()=>{
  [0,1,2].forEach(i=>{const a=byId("a"+i);if(a)a.src=AUDIO_SRCS[i]});
  renderCart();renderServiceRows("serviceList");renderPricing();renderTracks("trackList");buildBars();setCompare("before");setupCheckoutForm();setupHeroPlayer();setupContact();
});
