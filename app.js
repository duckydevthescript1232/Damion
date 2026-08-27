const SERVICES = [
{id:"mixing",name:"Mixing",desc:"Professional stereo mixing with balance, vocal processing, FX and automation.",from:79,tags:["3–5 days","2 revisions"],packages:[["Basic Mix",79,"Up to 12 stems"],["Professional Mix",109,"Up to 25 stems"],["Premium Mix",149,"Up to 50 stems"]]},
{id:"mastering",name:"Mastering",desc:"Final polish, loudness and tonal balance for a release-ready stereo master.",from:49,tags:["2–3 days","WAV + MP3"],packages:[["Streaming Master",49,"Balanced streaming master"],["Club Master",59,"Higher-impact alternate master"],["Complete Package",79,"Streaming + club versions"]]},
{id:"mix-master",name:"Mixing + Mastering",desc:"One complete workflow from multitrack mix to finished release master.",from:129,tags:["Most popular","4–6 days"],packages:[["Essential",129,"Up to 20 stems"],["Professional",169,"Up to 35 stems"],["Premium",219,"Up to 55 stems"]]},
{id:"custom-beat",name:"Custom Beat Production",desc:"An original beat developed around your genre, mood and reference direction.",from:99,tags:["Custom direction","Commercial options"],packages:[["Core",99,"Basic custom beat"],["Artist",159,"Expanded production"],["Exclusive",239,"Full premium package"]]},
{id:"instrumental",name:"Custom Instrumental",desc:"A complete instrumental written and produced around your song idea.",from:149,tags:["Arrangement","Stems option"],packages:[["Basic",149,"Core instrumental"],["Studio",219,"Full arrangement"],["Premium",299,"Detailed full production"]]},
{id:"vocal",name:"Vocal Production",desc:"Cleanup, timing, tuning and creative processing for polished modern vocals.",from:69,tags:["Tuning","FX"],packages:[["Clean",69,"Lead vocal cleanup"],["Produced",109,"Lead + doubles"],["Full",159,"Full vocal stack"]]},
{id:"remix",name:"Remix Production",desc:"Rebuild your song in a new style while keeping the identity of the original.",from:179,tags:["New direction","Arrangement"],packages:[["Remix",179,"Core remix"],["Extended",229,"Full extended production"],["Premium",299,"Detailed remix package"]]},
{id:"midi",name:"MIDI / Melody Production",desc:"Original melodies, chords, basslines and arrangement ideas delivered as MIDI.",from:49,tags:["MIDI","Creative ideas"],packages:[["Melody",49,"Melody MIDI"],["Melody + Chords",79,"Two-part idea"],["Idea Pack",119,"Full MIDI concept"]]},
{id:"full-production",name:"Full Song Production",desc:"Take a vocal, demo or idea and turn it into a complete, polished record.",from:249,tags:["Flagship service","5–10 days"],packages:[["Foundation",249,"Core production"],["Artist",349,"Advanced full production"],["Signature",499,"Complete premium package"]]}
];
const ADDONS = [["Priority delivery",35],["Additional revision",20],["Vocal tuning",25],["Instrumental export",15],["Acapella export",15],["Radio edit",20],["Project stems",25],["Project file",35]];
const TRACKS = [
["Midnight Drive","House · Production",0],
["Lowlight","Pop · Mix direction",1],
["Afterhours","EDM · Production",2]
];
function makeDemoAudio(seed=0){
  const sampleRate=11025, seconds=4, count=sampleRate*seconds;
  const buf=new ArrayBuffer(44+count*2), v=new DataView(buf);
  const put=(o,t)=>{ for(let i=0;i<t.length;i++) v.setUint8(o+i,t.charCodeAt(i)); };
  put(0,"RIFF"); v.setUint32(4,36+count*2,true); put(8,"WAVEfmt "); v.setUint32(16,16,true); v.setUint16(20,1,true); v.setUint16(22,1,true); v.setUint32(24,sampleRate,true); v.setUint32(28,sampleRate*2,true); v.setUint16(32,2,true); v.setUint16(34,16,true); put(36,"data"); v.setUint32(40,count*2,true);
  const chords=[ [110,138.59,164.81], [98,123.47,146.83], [130.81,164.81,196] ];
  const chord=chords[seed%chords.length];
  for(let i=0;i<count;i++){
    const t=i/sampleRate, beat=(t*2)%1, bar=Math.floor(t*2)%4;
    let x=0;
    for(let n=0;n<chord.length;n++) x+=Math.sin(2*Math.PI*chord[(n+bar)%chord.length]*t)*(0.10/(n+1));
    const kickEnv=Math.exp(-beat*10), kickFreq=58+55*Math.exp(-beat*14);
    x+=Math.sin(2*Math.PI*kickFreq*t)*kickEnv*0.28;
    const pulse=(Math.sin(2*Math.PI*(220+seed*25)*t)>0?1:-1)*0.025*(0.35+0.65*Math.sin(Math.PI*beat));
    x+=pulse;
    x=Math.max(-0.95,Math.min(0.95,x));
    v.setInt16(44+i*2,Math.round(x*32767),true);
  }
  return URL.createObjectURL(new Blob([buf],{type:"audio/wav"}));
}
const AUDIO_SRCS = [0,1,2].map(makeDemoAudio);
const BACKEND = {
  functionsBase: "https://wutlhceqkioshepfbykf.supabase.co/functions/v1",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dGxoY2Vxa2lvc2hlcGZieWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMDAxMDUsImV4cCI6MjEwMTU3NjEwNX0.Ad9wROEhZ2uKxKx9H5AHqCCmFa0nTezrBHkAn-Zwyws"
};

let cart = JSON.parse(localStorage.getItem("damion_cart") || "[]");
let current = null, pkg = 0, extras = new Set();
let paypalConfig = null;
let paypalRendered = false;
const eur = n => "€" + Number(n).toFixed(2);

function byId(x){ return document.getElementById(x); }
function escapeHtml(v){ return String(v ?? "").replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c])); }
function toast(msg){ const t=byId("toast"); if(!t) return; t.textContent=msg; t.classList.add("show"); setTimeout(()=>t.classList.remove("show"),2200); }
function openModal(id){ byId(id)?.classList.add("open"); }
function closeModal(id){ byId(id)?.classList.remove("open"); }
function openCart(){ renderCart(); byId("drawerBg")?.classList.add("open"); byId("cartDrawer")?.classList.add("open"); }
function closeCart(){ byId("drawerBg")?.classList.remove("open"); byId("cartDrawer")?.classList.remove("open"); }
function saveCart(){ localStorage.setItem("damion_cart", JSON.stringify(cart)); renderCart(); }

async function apiCall(fn, body){
  const res = await fetch(`${BACKEND.functionsBase}/${fn}`, {
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "apikey":BACKEND.anonKey,
      "Authorization":`Bearer ${BACKEND.anonKey}`
    },
    body:JSON.stringify(body)
  });
  let data={};
  try { data = await res.json(); } catch(_) {}
  if(!res.ok) throw new Error(data?.error || "Request failed");
  return data;
}

function renderCart(){
 const count=byId("cartCount"); if(count) count.textContent = cart.length;
 const items=byId("cartItems"), total=byId("cartTotal");
 if(items) items.innerHTML = cart.length ? cart.map((x,i)=>`
   <div class="cartitem"><h4>${escapeHtml(x.name)}</h4><p>${escapeHtml(x.package)}${x.addons.length?" · "+x.addons.map(escapeHtml).join(", "):""}</p>
   <div class="row"><b>${eur(x.price)}</b><button class="remove" onclick="removeItem(${i})">Remove</button></div></div>`).join("") : `<p style="color:var(--muted)">Your cart is empty.</p>`;
 if(total) total.textContent = eur(cart.reduce((s,x)=>s+x.price,0));
}
function removeItem(i){ cart.splice(i,1); saveCart(); }

function renderServiceRows(targetId){
 const el = byId(targetId); if(!el) return;
 el.innerHTML = SERVICES.map((s,i)=>`
   <article class="service-row">
     <div class="no">${String(i+1).padStart(2,"0")}</div>
     <div class="title"><b>${s.name}</b><span>${s.desc}</span></div>
     <div class="tags">${s.tags.map(x=>`<span class="tag">${x}</span>`).join("")}</div>
     <div class="price"><small>from</small><b>${eur(s.from)}</b></div>
     <button class="btn" onclick="configure('${s.id}')">Configure</button>
   </article>`).join("");
}
function configure(id){
 current = SERVICES.find(s=>s.id===id); pkg = 0; extras.clear();
 byId("cfgTitle").textContent = current.name; byId("cfgDesc").textContent = current.desc; renderConfig(); openModal("configModal");
}
function renderConfig(){
 byId("packages").innerHTML = current.packages.map((p,i)=>`<div class="package ${i===pkg?"active":""}" onclick="pkg=${i};renderConfig()"><b>${p[0]} · ${eur(p[1])}</b><span>${p[2]}</span></div>`).join("");
 byId("addons").innerHTML = ADDONS.map((a,i)=>`<div class="addon"><label><input type="checkbox" ${extras.has(i)?"checked":""} onchange="toggleExtra(${i})">${a[0]}</label><b>+${eur(a[1])}</b></div>`).join("");
 byId("cfgTotal").textContent = eur(current.packages[pkg][1] + [...extras].reduce((s,i)=>s+ADDONS[i][1],0));
}
function toggleExtra(i){ extras.has(i) ? extras.delete(i) : extras.add(i); renderConfig(); }
function addConfigured(){
 const p = current.packages[pkg], ex=[...extras].map(i=>ADDONS[i]);
 cart.push({key:Date.now()+Math.random(),id:current.id,name:current.name,package:p[0],addons:ex.map(x=>x[0]),price:p[1]+ex.reduce((s,x)=>s+x[1],0)});
 saveCart(); closeModal("configModal"); openCart(); toast("Added to cart");
}
function openCheckout(){
 if(!cart.length){ toast("Add a service first"); return; }
 closeCart(); resetCheckoutPayment();
 const s=byId("checkoutSummary"), t=byId("checkoutTotal");
 if(s) s.innerHTML = cart.map(x=>`<div class="summary-line"><span>${escapeHtml(x.name)}<br><small style="color:var(--muted)">${escapeHtml(x.package)}</small></span><b>${eur(x.price)}</b></div>`).join("");
 if(t) t.textContent = eur(cart.reduce((a,b)=>a+b.price,0));
 openModal("checkoutModal");
}

function checkoutDetails(){
  return {
    customer:{
      first_name:byId("first")?.value || "",
      last_name:byId("last")?.value || "",
      email:byId("email")?.value || "",
      artist_name:byId("artist")?.value || "",
      country:byId("country")?.value || ""
    },
    project_name:byId("projectName")?.value || "",
    notes:byId("notes")?.value || ""
  };
}

function setCheckoutStatus(msg,type=""){
 const el=byId("checkoutStatus"); if(!el) return;
 el.textContent=msg; el.className=`checkout-status ${type}`.trim();
}

async function loadPayPal(){
 if(window.paypal) return;
 if(!paypalConfig){
   paypalConfig = await apiCall("damion-paypal", {action:"config"});
 }
 if(!paypalConfig?.configured || !paypalConfig?.clientId) throw new Error("Payments are temporarily unavailable.");
 await new Promise((resolve,reject)=>{
   const existing=document.querySelector('script[data-damion-paypal]');
   if(existing){ existing.addEventListener("load",resolve,{once:true}); existing.addEventListener("error",reject,{once:true}); return; }
   const s=document.createElement("script");
   s.src=`https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(paypalConfig.clientId)}&currency=EUR&intent=capture`;
   s.dataset.damionPaypal="1";
   s.onload=resolve; s.onerror=()=>reject(new Error("Unable to load PayPal."));
   document.head.appendChild(s);
 });
}

async function showPayPalButtons(){
  const wrap=byId("paypalWrap"), buttons=byId("paypalButtons"), continueBtn=byId("checkoutContinue");
  if(!wrap||!buttons) return;
  try{
    setCheckoutStatus("Loading secure payment…");
    if(continueBtn) continueBtn.disabled=true;
    await loadPayPal();
    wrap.hidden=false;
    setCheckoutStatus(paypalConfig?.environment === "sandbox" ? "PayPal sandbox is connected for testing." : "PayPal is ready. Complete payment below.", paypalConfig?.environment === "sandbox" ? "warn" : "ok");
    if(paypalRendered) return;
    paypalRendered=true;
    window.paypal.Buttons({
      style:{layout:"vertical",shape:"rect",label:"paypal"},
      createOrder:async()=>{
        const details=checkoutDetails();
        const result=await apiCall("damion-paypal", {action:"create",cart,...details});
        return result.orderID;
      },
      onApprove:async(data)=>{
        setCheckoutStatus("Confirming payment…");
        const result=await apiCall("damion-paypal", {action:"capture",orderID:data.orderID});
        if(result.status!=="COMPLETED") throw new Error("Payment was not completed.");
        cart=[]; saveCart();
        closeModal("checkoutModal");
        showReceipt(result);
      },
      onCancel:()=>setCheckoutStatus("Payment cancelled. You can try again.","warn"),
      onError:(err)=>{ console.error(err); setCheckoutStatus("PayPal could not complete the payment. Please try again.","error"); }
    }).render("#paypalButtons");
  }catch(err){
    console.error(err);
    setCheckoutStatus(err?.message || "Payments are temporarily unavailable.","error");
    if(continueBtn) continueBtn.disabled=false;
  }
}

function resetCheckoutPayment(){
  const wrap=byId("paypalWrap"), buttons=byId("paypalButtons"), btn=byId("checkoutContinue"), f=byId("checkoutForm");
  if(wrap) wrap.hidden=true;
  if(buttons) buttons.innerHTML="";
  if(btn) btn.disabled=false;
  if(f) Array.from(f.elements).forEach(el=>{ if(el.tagName==="INPUT"||el.tagName==="TEXTAREA") el.readOnly=false; });
  paypalRendered=false;
  setCheckoutStatus("");
}

function setupCheckoutForm(){
 const f = byId("checkoutForm"); if(!f) return;
 f.addEventListener("submit", async e=>{
   e.preventDefault();
   if(!cart.length){ toast("Your cart is empty"); return; }
   if(!f.reportValidity()) return;
   Array.from(f.elements).forEach(el=>{ if((el.tagName==="INPUT"||el.tagName==="TEXTAREA") && el.id!=="checkoutContinue") el.readOnly=true; });
   await showPayPalButtons();
 });
}

function showReceipt(result){
 const title=byId("genericTitle"), body=byId("genericBody");
 if(title) title.textContent="Payment received";
 if(body) body.innerHTML=`<div class="success-panel"><div class="success-mark">✓</div><h3>Thank you — your project is booked.</h3><p>Your PayPal payment was confirmed successfully.</p><div class="receipt-row"><span>Order</span><b>${escapeHtml(result.orderID || "Confirmed")}</b></div>${result.amount?`<div class="receipt-row"><span>Paid</span><b>€${escapeHtml(result.amount)}</b></div>`:""}<p class="small-muted">Keep your PayPal receipt. Your submitted project details are stored with the order.</p></div>`;
 openModal("genericModal");
}

function renderTracks(id){
 const el=byId(id); if(!el) return;
 el.innerHTML = TRACKS.map((t,i)=>`<div class="track-card">
   <div class="num">${String(i+1).padStart(2,"0")}</div>
   <div><b>${t[0]}</b><br><span>Audio preview</span></div>
   <div class="kind"><span>${t[1]}</span></div>
   <button id="tp${i}" class="tplay" onclick="toggleTrack(${i})" aria-label="Play ${t[0]}">▶</button>
 </div>`).join("");
}
function toggleTrack(i){
 TRACKS.forEach((_,j)=>{ if(j!==i){ byId("a"+j)?.pause(); const b=byId("tp"+j); if(b) b.textContent="▶"; } });
 const a = byId("a"+i), b = byId("tp"+i); if(!a||!b) return;
 if(a.paused){ a.play().catch(()=>{}); b.textContent="Ⅱ"; } else { a.pause(); b.textContent="▶"; }
}

function buildBars(){
 const meter = byId("compareBars"); if(!meter) return;
 meter.innerHTML = Array.from({length:34},(_,i)=>`<i style="--h:${18+Math.abs(Math.sin(i*.71))*52+(i%4)*5}%"></i>`).join("");
}
function setCompare(mode){
 const bb=byId("beforeBtn"), ab=byId("afterBtn"), title=byId("compareTitle"), text=byId("compareText"), bars=byId("compareBars");
 if(!bb||!ab||!title||!text||!bars) return;
 bb.classList.toggle("active", mode==="before");
 ab.classList.toggle("active", mode==="after");
 bars.className = "bars " + (mode==="after" ? "after" : "");
 title.textContent = mode==="before" ? "Before — raw balance" : "After — refined direction";
 text.textContent = mode==="before" ? "A rawer balance used to demonstrate the comparison player." : "A more focused balance with stronger control and impact.";
 byId("compareAudio").src = mode==="before" ? AUDIO_SRCS[1] : AUDIO_SRCS[0];
}
function toggleCompare(){ const a=byId("compareAudio"); if(!a) return; a.paused ? a.play().catch(()=>{}) : a.pause(); }

function setupHeroPlayer(){
 const a=byId("heroAudio"), play=byId("heroPlay"), prog=byId("heroProg"), time=byId("heroTime");
 if(!a||!play||!prog||!time) return;
 play.onclick = ()=>{ if(a.paused){ a.play().catch(()=>{}); play.textContent="Ⅱ"; } else { a.pause(); play.textContent="▶"; } };
 a.addEventListener("timeupdate",()=>{ prog.style.width=(a.currentTime/(a.duration||1)*100)+"%"; time.textContent=Math.floor(a.currentTime/60)+":"+String(Math.floor(a.currentTime%60)).padStart(2,"0"); });
 a.addEventListener("ended",()=>play.textContent="▶");
 const seek = byId("heroSeek");
 if(seek) seek.addEventListener("click",e=>{ const r=seek.getBoundingClientRect(); a.currentTime=((e.clientX-r.left)/r.width)*(a.duration||0); });
}

function setupContact(){
 const f=byId("contactForm"); if(!f) return;
 const btn=f.querySelector('button[type="submit"]');
 f.addEventListener("submit",async e=>{
   e.preventDefault(); if(!f.reportValidity()) return;
   const original=btn?.textContent || "Send message";
   if(btn){ btn.disabled=true; btn.textContent="Sending…"; }
   const status=byId("contactStatus"); if(status){ status.textContent=""; status.className="checkout-status"; }
   try{
     await apiCall("damion-contact", {name:byId("cn").value,email:byId("ce").value,subject:byId("cs").value,message:byId("cm").value,website:byId("cw")?.value || ""});
     f.reset();
     if(byId("cs")) byId("cs").value="Project inquiry";
     if(status){ status.textContent="Message sent successfully. I’ll get back to you as soon as possible."; status.className="checkout-status ok"; }
     toast("Message sent");
   }catch(err){
     if(status){ status.textContent=err?.message || "Could not send your message."; status.className="checkout-status error"; }
   }finally{ if(btn){ btn.disabled=false; btn.textContent=original; } }
 });
}

window.addEventListener("DOMContentLoaded",()=>{
 [0,1,2].forEach(i=>{ const a=byId("a"+i); if(a) a.src=AUDIO_SRCS[i]; });
 renderCart(); renderServiceRows("serviceList"); renderTracks("trackList"); buildBars(); setCompare("before"); setupCheckoutForm(); setupHeroPlayer(); setupContact();
});
