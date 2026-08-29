(()=>{
  const API='https://wutlhceqkioshepfbykf.supabase.co/functions/v1/damion-orders';
  const ANON='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJIUzI1NiIsInJlZiI6Ind1dGxoY2Vxa2lvc2hlcGZieWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMDAxMDUsImV4cCI6MjEwMTU3NjEwNX0.Ad9wROEhZ2uKxKx9H5AHqCCmFa0nTezrBHkAn-Zwyws';
  const SESSION_KEY='dm_admin_key';
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const eur=v=>new Intl.NumberFormat('nl-NL',{style:'currency',currency:'EUR'}).format(Number(v||0));
  let adminKey='';let timer=null;let known=new Set();

  async function call(action,extra={}){
    const res=await fetch(API,{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json','apikey':ANON,'Authorization':`Bearer ${ANON}`},body:JSON.stringify({action,adminKey,...extra})});
    const data=await res.json().catch(()=>({}));
    if(!res.ok)throw new Error(data.error||'Request failed');
    return data;
  }

  function renderOrders(orders){
    const host=$('orders');if(!host)return;
    if(!orders.length){host.innerHTML='<div class="empty">No orders yet.</div>';return}
    host.innerHTML=orders.map(o=>`<article class="order-row" data-ref="${esc(o.order_number)}"><div><span class="order-id">${esc(o.order_number)}</span><small>${new Date(o.created_at).toLocaleString()}</small></div><div><span class="order-project">${esc(o.project_name)}</span><small>${esc(o.customer_name)} · ${esc(o.customer_email)}</small></div><div><b>${esc(o.service_name)}</b><small>${esc(o.package_name||'')}</small></div><div class="order-total">${eur(o.amount_eur)}</div><div class="order-status">${esc(o.status||'Paid')}</div></article>`).join('');
  }

  function stats(orders){
    $('statTotal').textContent=orders.length;
    $('statActive').textContent=orders.filter(o=>!['Completed','Cancelled','Refunded'].includes(o.status)).length;
    $('statDone').textContent=orders.filter(o=>o.status==='Completed').length;
    $('statRevenue').textContent=eur(orders.reduce((s,o)=>s+Number(o.amount_eur||0),0));
  }

  function notifyNew(orders){
    const fresh=orders.filter(o=>!known.has(o.order_number));
    if(known.size&&fresh.length){
      try{const audio=new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=');audio.play().catch(()=>{})}catch(_){}
      if(Notification?.permission==='granted')new Notification('New Damiønmusic order',{body:`${fresh[0].order_number} · ${fresh[0].project_name}`});
    }
    known=new Set(orders.map(o=>o.order_number));
  }

  async function refresh(){
    if(!adminKey)return;
    $('dashStatus').textContent='Refreshing…';
    try{
      const data=await call('admin_list');const orders=data.orders||[];
      notifyNew(orders);stats(orders);renderOrders(orders);
      $('dashStatus').textContent='';$('lastCheck').textContent='Updated '+new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});$('liveText').textContent='Private dashboard active';
    }catch(err){$('dashStatus').textContent=err.message||'Could not load orders';$('dashStatus').classList.add('error')}
  }

  async function login(key){
    adminKey=String(key||'').trim();if(!adminKey)return;
    $('loginStatus').textContent='Checking…';
    try{
      await call('admin_list');
      try{sessionStorage.setItem(SESSION_KEY,adminKey)}catch(_){}
      $('loginCard').classList.add('hidden');$('dashboard').classList.remove('hidden');$('viewSiteBtn')?.classList.remove('hidden');$('logoutBtn')?.classList.remove('hidden');$('loginStatus').textContent='';
      await refresh();timer=setInterval(refresh,20000);
    }catch(err){adminKey='';try{sessionStorage.removeItem(SESSION_KEY)}catch(_){}$('loginStatus').textContent=err.message||'Admin key is incorrect';$('loginStatus').classList.add('error')}
  }

  $('loginForm')?.addEventListener('submit',e=>{e.preventDefault();login($('adminKey').value)});
  $('refreshBtn')?.addEventListener('click',refresh);
  $('notifyBtn')?.addEventListener('click',async()=>{if(!('Notification'in window))return alert('Browser notifications are not supported here.');const p=await Notification.requestPermission();$('notifyBtn').textContent=p==='granted'?'Notifications enabled':'Notifications blocked'});
  $('logoutBtn')?.addEventListener('click',()=>{try{sessionStorage.removeItem(SESSION_KEY)}catch(_){}location.reload()});
  window.addEventListener('pagehide',()=>{if(timer)clearInterval(timer)},{once:true});

  let saved='';try{saved=sessionStorage.getItem(SESSION_KEY)||''}catch(_){}
  if(saved){$('adminKey').value=saved;login(saved)}
})();
