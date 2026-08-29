const REAL_AUDIO = "/assets/preview/damionmusic-preview.mp3?v=20260828-1";

const SERVICES = [
  {id:"beat-feedback",name:"Beat Feedback",desc:"Clear, practical feedback on your beat before you spend money on a full service.",from:4.99,turnaround:"Within 24 hours",included:["Written mix notes","Arrangement pointers","3 priority fixes"],tags:["Low-cost entry","24h"],packages:[["Beat Feedback",4.99,"Focused written feedback with the most important improvements first."]]},
  {id:"mastering",name:"Mastering",desc:"Final loudness, tone and polish for a finished stereo mix.",from:9.99,turnaround:"1–2 days",included:["WAV master","MP3 master","Streaming-ready level"],tags:["1–2 days","WAV + MP3"],packages:[["Mastering",9.99,"One release-ready stereo master."],["Master + Alternate",14.99,"Main master plus one alternate loudness version."]]},
  {id:"midi",name:"MIDI / Melody Creation",desc:"Original melody or chord ideas delivered as editable MIDI for your project.",from:9.99,turnaround:"1–2 days",included:["Editable MIDI","Key information","One revision"],tags:["Editable MIDI","Fast"],packages:[["Melody MIDI",9.99,"One original melody idea as MIDI."],["Melody + Chords",14.99,"Melody and matching chord progression as MIDI."]]},
  {id:"mixing",name:"Mixing",desc:"A clean, balanced mix with stronger vocals, drums and overall impact.",from:14.99,turnaround:"2–4 days",included:["Level + EQ balance","Compression + space","1 revision"],tags:["2–4 days","1 revision"],packages:[["Basic Mix",14.99,"Up to 12 stems. Clean balance, EQ, compression and space."],["Professional Mix",24.99,"Up to 28 stems with deeper vocal, drum and FX work."]]},
  {id:"vocal",name:"Vocal Processing",desc:"Cleanup, timing, tuning and modern effects for recorded vocals.",from:14.99,turnaround:"1–3 days",included:["Cleanup","Tuning","Vocal FX chain"],tags:["Tuning","Vocal FX"],packages:[["Vocal Process",14.99,"Lead vocal cleanup, tuning and processing."],["Full Vocal Stack",24.99,"Lead, doubles and supporting vocal layers."]]},
  {id:"custom-beat",name:"Custom Beat",desc:"An original beat built around your references, genre and vocal direction.",from:29.99,turnaround:"3–5 days",included:["Original production","Full arrangement","WAV export"],tags:["Original","3–5 days"],packages:[["Custom Beat",29.99,"Original beat with a complete song-ready arrangement."],["Artist Beat",39.99,"More detailed production with stems included."],["Premium Beat",54.99,"Extended production, stems and two revisions."]]},
  {id:"mix-master",name:"Mix + Master",desc:"A complete finishing service from raw stems to the final release master.",from:34.99,turnaround:"3–5 days",included:["Full mix","Final master","WAV + MP3"],tags:["Most popular","3–5 days"],packages:[["Mix + Master",34.99,"Up to 25 stems with one revision and final master."],["Advanced Mix + Master",44.99,"Up to 45 stems with deeper detail and two revisions."]]},
  {id:"instrumental",name:"Custom Instrumental",desc:"A complete instrumental written and produced around your song idea.",from:39.99,turnaround:"3–6 days",included:["Original composition","Arrangement","WAV export"],tags:["Original","Arrangement"],packages:[["Instrumental",39.99,"Original instrumental with full arrangement."],["Instrumental + Stems",49.99,"Full arrangement plus grouped stems."]]},
  {id:"remix",name:"Remix Production",desc:"A fresh production direction built from your existing song or vocal.",from:39.99,turnaround:"4–7 days",included:["New arrangement","New production","WAV export"],tags:["New direction","4–7 days"],packages:[["Remix",39.99,"Core remix with a complete new direction."],["Extended Remix",54.99,"More detailed production and extended arrangement."]]},
  {id:"full-production",name:"Full Track Production",desc:"Turn a vocal, demo or idea into a complete song-ready production.",from:49.99,turnaround:"5–8 days",included:["Production","Arrangement","Mix-ready export"],tags:["Full build","5–8 days"],packages:[["Starter Production",49.99,"Core production and full song arrangement."],["Artist Production",69.99,"Detailed production with stems and two revisions."],["Complete Production",89.99,"Full production package with stems and project delivery options."]]}
];

const ADDONS = [
  ["Priority delivery",7.99],["Additional revision",4.99],["Extra vocal tuning",6.99],["Instrumental export",3.99],
  ["Acapella export",3.99],["Radio edit",4.99],["Project stems",5.99],["Project file",7.99]
];

const BACKEND = {
  functionsBase:"https://wutlhceqkioshepfbykf.supabase.co/functions/v1",
  anonKey:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dGxoY2Vxa2lvc2hlcGZieWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMDAxMDUsImV4cCI6MjEwMTU3NjEwNX0.Ad9wROEhZ2uKxKx9H5AHqCCmFa0nTezrBHkAn-Zwyws"
};

let cart=[];
try{cart=JSON.parse(localStorage.getItem("damion_cart")||"[]")}catch(_){cart=[]}
if(!Array.isArray(cart))cart=[];
let current=null,pkg=0,extras=new Set();

const eur=n=>`€${Number(n||0).toFixed(2)}`;
const byId=id=>document.getElementById(id);
const escapeHtml=v=>String(v??"").replace(/[&<>'\"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'\"':"&quot;"}[c]));

function toast(msg){const t=byId("toast");if(!t)return;t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
function openModal(id){byId(id)?.classList.add("open")}
function closeModal(id){byId(id)?.classList.remove("open")}
function openCart(){
  renderCart();
  const bg=byId("drawerBg"),drawer=byId("cartDrawer");
  bg?.classList.add("open");drawer?.classList.add("open");
  document.body.classList.add("cart-open");
}
function closeCart(){
  const bg=byId("drawerBg"),drawer=byId("cartDrawer");
  bg?.classList.remove("open");drawer?.classList.remove("open");
  document.body.classList.remove("cart-open");
  document.body.style.removeProperty("overflow");
}
function saveCart(){localStorage.setItem("damion_cart",JSON.stringify(cart));renderCart()}
function removeItem(i){cart.splice(i,1);saveCart()}

async function apiCall(fn,body){
  const res=await fetch(`${BACKEND.functionsBase}/${fn}?t=${Date.now()}`,{method:"POST",cache:"no-store",headers:{"Content-Type":"application/json","apikey":BACKEND.anonKey,"Authorization":`Bearer ${BACKEND.anonKey}`,"Cache-Control":"no-cache"},body:JSON.stringify(body)});
  let data={};try{data=await res.json()}catch(_){}
  if(!res.ok)throw new Error(data?.error||data?.details||`Request failed (${res.status})`);
  return data;
}

function renderCart(){
  const count=byId("cartCount");if(count)count.textContent=cart.length;
  const items=byId("cartItems"),total=byId("cartTotal");
  if(items)items.innerHTML=cart.length?cart.map((x,i)=>`<div class="cartitem"><h4>${escapeHtml(x.name)}</h4><p>${escapeHtml(x.package)}${x.addons?.length?" · "+x.addons.map(escapeHtml).join(", "):""}</p><div class="row"><b>${eur(x.price)}</b><button class="remove" type="button" onclick="removeItem(${i})">Remove</button></div></div>`).join(""):`<p style="color:var(--muted)">Your cart is empty.</p>`;
  if(total)total.textContent=eur(cart.reduce((s,x)=>s+Number(x.price||0),0));
}

function renderServiceRows(targetId){
  const el=byId(targetId);if(!el)return;
  const requested=(el.dataset.serviceIds||"").split(",").map(id=>id.trim()).filter(Boolean);
  const source=requested.length?requested.map(id=>SERVICES.find(service=>service.id===id)).filter(Boolean):SERVICES;
  el.innerHTML=source.map((s,i)=>`<article class="service-row"><div class="no">${String(i+1).padStart(2,"0")}</div><div class="title"><b>${escapeHtml(s.name)}</b><span>${escapeHtml(s.desc)}</span></div><div class="service-included"><small>Includes</small><span>${s.included.map(escapeHtml).join(" · ")}</span></div><div class="service-turn"><small>Turnaround</small><b>${escapeHtml(s.turnaround)}</b></div><div class="price"><small>from</small><b>${eur(s.from)}</b></div><button class="btn service-configure" type="button" aria-label="Choose ${escapeHtml(s.name)}" onclick="configure('${s.id}')">Choose</button></article>`).join("");
}

function renderPricing(){
  const el=byId("pricingGrid");if(!el)return;
  const picks=[SERVICES.find(x=>x.id==="mastering"),SERVICES.find(x=>x.id==="mix-master"),SERVICES.find(x=>x.id==="full-production")];
  el.innerHTML=picks.map((s,i)=>`<article class="price-card ${i===1?"pop":""}">${i===1?'<span class="pop">Most ordered</span>':""}<div class="kicker">${i===0?"Quick finish":i===1?"Complete finish":"Full production"}</div><h3>${escapeHtml(s.name)}</h3><p>${escapeHtml(s.desc)}</p><div class="bigprice">${eur(s.from)}</div><ul>${s.included.map(x=>`<li>${escapeHtml(x)}</li>`).join("")}<li>${escapeHtml(s.turnaround)}</li></ul><a class="btn ${i===1?"primary":""}" href="/services#start">Order service</a></article>`).join("");
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
function openCheckout(){if(!cart.length){toast("Add a service first");return}closeCart();location.href="/checkout"}

function buildBars(){const meter=byId("compareBars");if(meter)meter.innerHTML=Array.from({length:34},(_,i)=>`<i style="--h:${18+Math.abs(Math.sin(i*.71))*52+(i%4)*5}%"></i>`).join("")}
function setCompare(mode){
  const bb=byId("beforeBtn"),ab=byId("afterBtn"),title=byId("compareTitle"),text=byId("compareText"),bars=byId("compareBars"),audio=byId("compareAudio");
  if(bb)bb.classList.toggle("active",mode==="before");if(ab)ab.classList.toggle("active",mode==="after");if(bars)bars.className="bars "+(mode==="after"?"after":"");
  if(title)title.textContent=mode==="before"?"Reference view":"Finished view";if(text)text.textContent="The website uses only the single supplied Damiøn audio preview.";if(audio&&!audio.src)audio.src=REAL_AUDIO;
}
function toggleCompare(){const a=byId("compareAudio");if(a){if(!a.src)a.src=REAL_AUDIO;a.paused?a.play().catch(()=>{}):a.pause()}}
function setupHeroPlayer(){const a=byId("heroAudio"),play=byId("heroPlay"),prog=byId("heroProg"),time=byId("heroTime");if(!a||!play||!prog||!time)return;a.src=REAL_AUDIO;play.onclick=()=>{if(a.paused){a.play().catch(()=>{});play.textContent="Ⅱ"}else{a.pause();play.textContent="▶"}};a.addEventListener("timeupdate",()=>{prog.style.width=(a.currentTime/(a.duration||1)*100)+"%";time.textContent=Math.floor(a.currentTime/60)+":"+String(Math.floor(a.currentTime%60)).padStart(2,"0")});a.addEventListener("ended",()=>play.textContent="▶")}

function setupContact(){
  const f=byId("contactForm");if(!f)return;const btn=f.querySelector('button[type="submit"]');const service=new URLSearchParams(location.search).get("service");if(service&&byId("cs"))byId("cs").value=`Project inquiry — ${service}`;
  f.addEventListener("submit",async e=>{e.preventDefault();if(!f.reportValidity())return;const original=btn?.textContent||"Send message";if(btn){btn.disabled=true;btn.textContent="Sending…"}const status=byId("contactStatus");if(status){status.textContent="";status.className="checkout-status"}try{await apiCall("damion-contact",{name:byId("cn")?.value||"",email:byId("ce")?.value||"",subject:byId("cs")?.value||"Project inquiry",message:byId("cm")?.value||"",website:byId("cw")?.value||""});f.reset();if(status){status.textContent="Message sent successfully.";status.className="checkout-status ok"}toast("Message sent")}catch(err){if(status){status.textContent=err?.message||"Could not send your message.";status.className="checkout-status error"}}finally{if(btn){btn.disabled=false;btn.textContent=original}}});
}

function setupCartSafety(){
  closeCart();
  const bg=byId("drawerBg"),drawer=byId("cartDrawer");
  bg?.addEventListener("click",closeCart);
  drawer?.querySelector('.drawer-head .btn.icon')?.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();closeCart()});
  document.addEventListener("keydown",e=>{if(e.key==="Escape")closeCart()});
  document.addEventListener("click",e=>{
    const closeButton=e.target.closest?.('[data-close-cart], .drawer-head .btn.icon');
    if(closeButton){e.preventDefault();e.stopPropagation();closeCart();}
  },true);
}

window.addEventListener("DOMContentLoaded",()=>{setupCartSafety();renderCart();renderServiceRows("serviceList");renderPricing();buildBars();setupHeroPlayer();setupContact()});

