(()=>{
  if(window.__dmAdminPaidAlertV1)return;
  window.__dmAdminPaidAlertV1=true;

  const style=document.createElement('style');
  style.textContent=`
    .dm-paid-alert{display:none;margin:0 0 18px;padding:17px 18px;border:1px solid rgba(255,74,101,.34);border-radius:16px;background:linear-gradient(135deg,rgba(80,15,27,.62),rgba(31,12,17,.82));box-shadow:0 16px 38px rgba(0,0,0,.24),inset 0 1px 0 rgba(255,255,255,.04)}
    .dm-paid-alert.show{display:flex;align-items:center;justify-content:space-between;gap:18px}.dm-paid-alert-copy{min-width:0}.dm-paid-alert-kicker{font-size:10px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:#ff7f92}.dm-paid-alert strong{display:block;margin-top:5px;font-size:18px}.dm-paid-alert p{margin:5px 0 0;color:#b9aeb1;font-size:12px;line-height:1.55}.dm-paid-alert-count{display:grid;place-items:center;min-width:48px;height:48px;border-radius:14px;background:#ef3f55;color:#fff;font-size:20px;font-weight:950;box-shadow:0 10px 28px rgba(239,63,85,.28)}
    .order-row.dm-needs-work{border-color:rgba(255,76,103,.32);box-shadow:inset 3px 0 0 #ef3f55}.order-row.dm-needs-work .order-status{color:#ff8294;border-color:rgba(255,76,103,.32);background:rgba(239,63,85,.08)}
    @media(max-width:640px){.dm-paid-alert.show{align-items:flex-start}.dm-paid-alert-count{min-width:42px;height:42px}}
  `;
  document.head.appendChild(style);

  const dashboard=document.getElementById('dashboard');
  if(!dashboard)return;
  const alert=document.createElement('div');
  alert.id='dmPaidActionAlert';
  alert.className='dm-paid-alert';
  alert.innerHTML='<div class="dm-paid-alert-copy"><div class="dm-paid-alert-kicker">Owner action needed</div><strong id="dmPaidActionTitle">Paid order waiting</strong><p id="dmPaidActionCopy">A customer has paid. Open Latest orders below and start the requested service.</p></div><div class="dm-paid-alert-count" id="dmPaidActionCount">0</div>';
  dashboard.insertBefore(alert,dashboard.firstChild);

  const seenKey='dm_owner_seen_paid_orders_v1';
  let seen=new Set();
  try{seen=new Set(JSON.parse(localStorage.getItem(seenKey)||'[]'))}catch(_){seen=new Set()}

  const scan=()=>{
    const rows=[...document.querySelectorAll('#orders .order-row')];
    const paid=[];
    for(const row of rows){
      const status=row.querySelector('.order-status');
      const raw=(status?.textContent||'').trim();
      const isPaid=raw==='Paid'||raw==='Paid · Needs work';
      row.classList.toggle('dm-needs-work',isPaid);
      if(isPaid){
        if(status)status.textContent='Paid · Needs work';
        paid.push(row);
      }
    }

    if(!paid.length){alert.classList.remove('show');return}
    alert.classList.add('show');
    const count=document.getElementById('dmPaidActionCount');
    const title=document.getElementById('dmPaidActionTitle');
    const copy=document.getElementById('dmPaidActionCopy');
    if(count)count.textContent=String(paid.length);
    if(title)title.textContent=paid.length===1?'1 paid order is waiting for you':`${paid.length} paid orders are waiting for you`;
    const first=paid[0];
    const ref=(first.querySelector('.order-id')?.textContent||'').trim();
    const project=(first.querySelector('.order-project')?.textContent||'').trim();
    if(copy)copy.textContent=ref?`${ref}${project?` · ${project}`:''} — payment confirmed. Start this service from Latest orders below.`:'Payment confirmed. Start the requested service from Latest orders below.';

    const unseen=paid.map(r=>(r.querySelector('.order-id')?.textContent||'').trim()).filter(Boolean).filter(ref=>!seen.has(ref));
    if(unseen.length&&'Notification'in window&&Notification.permission==='granted'){
      const row=paid.find(r=>unseen.includes((r.querySelector('.order-id')?.textContent||'').trim()));
      const ref=(row?.querySelector('.order-id')?.textContent||unseen[0]).trim();
      const project=(row?.querySelector('.order-project')?.textContent||'New paid project').trim();
      try{new Notification('Paid Damiønmusic order — start work',{body:`${ref} · ${project}`})}catch(_){}
    }
    unseen.forEach(ref=>seen.add(ref));
    try{localStorage.setItem(seenKey,JSON.stringify([...seen].slice(-100)))}catch(_){}
  };

  const orders=document.getElementById('orders');
  if(orders)new MutationObserver(()=>requestAnimationFrame(scan)).observe(orders,{childList:true,subtree:true,characterData:true});
  scan();
})();
