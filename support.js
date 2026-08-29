(()=>{
  if(window.__dmSupport)return;window.__dmSupport=true;
  const API='https://wutlhceqkioshepfbykf.supabase.co/functions/v1/damion-support';
  const ANON='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJIUzI1NiIsInJlZiI6Ind1dGxoY2Vxa2lvc2hlcGZieWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMDAxMDUsImV4cCI6MjEwMTU3NjEwNX0.Ad9wROEhZ2uKxKx9H5AHqCCmFa0nTezrBHkAn-Zwyws';
  const DRAFT='damion_support_draft';
  if(!document.querySelector('link[data-dm-support]')){const l=document.createElement('link');l.rel='stylesheet';l.href='/support.css?v=20260829-1';l.dataset.dmSupport='1';document.head.appendChild(l)}

  const read=()=>{try{return JSON.parse(localStorage.getItem(DRAFT)||'{}')}catch(_){return {}}};
  const save=data=>{try{localStorage.setItem(DRAFT,JSON.stringify(data))}catch(_){}};
  const clear=()=>{try{localStorage.removeItem(DRAFT)}catch(_){}};
  const draft=read();
  const categories=['Which service do I need?','Ask about pricing','Ask about my order','Custom project','Something else'];
  const button=document.createElement('button');
  button.type='button';button.className='dm-support-fab';button.setAttribute('aria-label','Open support');button.setAttribute('aria-expanded','false');
  button.innerHTML='<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 5.5h16v10.5H10l-5 3v-3.1H4z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M8 10h8M8 13h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  const panel=document.createElement('section');panel.className='dm-support-panel';panel.setAttribute('aria-label','Damiønmusic support');panel.setAttribute('aria-hidden','true');
  panel.innerHTML=`<div class="dm-support-head"><div><b>Need help?</b><p>Send a real message to Damiønmusic. No fake live status.</p></div><button class="dm-support-close" type="button" aria-label="Close support">×</button></div><div class="dm-support-body"><div class="dm-support-quick">${categories.map(c=>`<button type="button" class="dm-support-chip" data-category="${c}">${c}</button>`).join('')}</div><form class="dm-support-form"><div class="dm-support-grid"><label>Name<input name="name" maxlength="100" required autocomplete="name"></label><label>Email<input name="email" type="email" maxlength="254" required autocomplete="email"></label></div><label>Category<select name="category">${categories.map(c=>`<option>${c}</option>`).join('')}</select></label><label>Order number <span style="font-weight:400;color:#8f9295">(optional)</span><input name="orderNumber" maxlength="100" placeholder="DM-..."></label><label>Message<textarea name="message" maxlength="4000" required placeholder="Tell me what you need help with..."></textarea></label><input name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px"><button class="dm-support-submit" type="submit">Send message</button><div class="dm-support-status" aria-live="polite"></div><div class="dm-support-note">Your message is saved as a support ticket so it does not get lost while you browse.</div></form></div>`;
  document.body.append(button,panel);
  const form=panel.querySelector('form');const status=panel.querySelector('.dm-support-status');
  const fields=['name','email','category','orderNumber','message'];fields.forEach(k=>{const el=form.elements[k];if(el&&draft[k])el.value=draft[k]});
  const snapshot=()=>{const data={};fields.forEach(k=>data[k]=form.elements[k]?.value||'');return data};
  form.addEventListener('input',()=>save(snapshot()));
  panel.querySelectorAll('.dm-support-chip').forEach(chip=>chip.addEventListener('click',()=>{panel.querySelectorAll('.dm-support-chip').forEach(x=>x.classList.remove('active'));chip.classList.add('active');form.elements.category.value=chip.dataset.category;save(snapshot());form.elements.message.focus()}));
  const open=()=>{panel.classList.add('open');panel.setAttribute('aria-hidden','false');button.setAttribute('aria-expanded','true');setTimeout(()=>form.elements.message?.focus({preventScroll:true}),120)};
  const close=()=>{panel.classList.remove('open');panel.setAttribute('aria-hidden','true');button.setAttribute('aria-expanded','false')};
  button.addEventListener('click',()=>panel.classList.contains('open')?close():open());panel.querySelector('.dm-support-close').addEventListener('click',close);document.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel.classList.contains('open'))close()});
  window.openSupportChat=(category)=>{open();if(category){form.elements.category.value=category;save(snapshot())}};
  form.addEventListener('submit',async e=>{e.preventDefault();if(!form.reportValidity())return;const submit=form.querySelector('.dm-support-submit');submit.disabled=true;status.className='dm-support-status';status.textContent='Sending…';const data=snapshot();
    try{const res=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json','apikey':ANON,'Authorization':`Bearer ${ANON}`},body:JSON.stringify({...data,subject:data.category,currentPage:location.href,website:form.elements.website.value})});let out={};try{out=await res.json()}catch(_){}if(!res.ok)throw new Error(out.error||'We could not send your message.');status.className='dm-support-status success';status.textContent=`Thanks — your message was sent${out.ticket?` (${out.ticket})`:''}.`;form.elements.message.value='';form.elements.orderNumber.value='';clear();setTimeout(()=>close(),2200)}catch(err){status.className='dm-support-status error';status.textContent=err?.message||'We could not send your message. Please try again.'}finally{submit.disabled=false}}
  );
})();
