(()=>{
  if(window.__dmSupport)return;window.__dmSupport=true;
  const API='https://wutlhceqkioshepfbykf.supabase.co/functions/v1/damion-support';
  const ANON='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dGxoY2Vxa2lvc2hlcGZieWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMDAxMDUsImV4cCI6MjEwMTU3NjEwNX0.Ad9wROEhZ2uKxKx9H5AHqCCmFa0nTezrBHkAn-Zwyws';
  const TOKEN_KEY='damion_support_chat_token';
  const PROFILE_KEY='damion_support_profile';
  let token='';let pollTimer=null;let chat=null;

  if(!document.querySelector('link[data-dm-support]')){const l=document.createElement('link');l.rel='stylesheet';l.href='/support.css?v=20260829-3';l.dataset.dmSupport='1';document.head.appendChild(l)}
  try{token=localStorage.getItem(TOKEN_KEY)||''}catch(_){}
  try{const u=new URL(location.href);const q=u.searchParams.get('support');if(q){token=q;localStorage.setItem(TOKEN_KEY,q);u.searchParams.delete('support');history.replaceState({},'',u.pathname+u.search+u.hash)}}catch(_){}

  const button=document.createElement('button');
  button.type='button';button.className='dm-support-fab';button.setAttribute('aria-label','Open support chat');button.setAttribute('aria-expanded','false');
  button.innerHTML='<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 5.5h16v10.5H10l-5 3v-3.1H4z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M8 10h8M8 13h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg><span class="dm-support-badge" hidden>1</span>';

  const panel=document.createElement('section');panel.className='dm-support-panel';panel.setAttribute('aria-label','Damiønmusic chat');panel.setAttribute('aria-hidden','true');
  panel.innerHTML=`
    <div class="dm-support-head"><div><b>Ask Damiønmusic</b><p>Ask anything about your music or an order. I can reply here.</p></div><button class="dm-support-close" type="button" aria-label="Close chat">×</button></div>
    <div class="dm-support-chat" id="dmSupportChat"></div>
  `;
  document.body.append(button,panel);
  const host=panel.querySelector('#dmSupportChat');
  const badge=button.querySelector('.dm-support-badge');
  let lastStaffCount=0;

  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const headers={'Content-Type':'application/json','apikey':ANON,'Authorization':`Bearer ${ANON}`};
  async function call(action,extra={}){const r=await fetch(API,{method:'POST',cache:'no-store',headers,body:JSON.stringify({action,...extra})});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'Could not connect to support.');return d}
  const readProfile=()=>{try{return JSON.parse(localStorage.getItem(PROFILE_KEY)||'{}')}catch(_){return {}}};
  const saveProfile=p=>{try{localStorage.setItem(PROFILE_KEY,JSON.stringify(p))}catch(_){}};

  function renderStart(error=''){
    const p=readProfile();
    host.innerHTML=`<div class="dm-chat-start"><div class="dm-chat-intro"><span class="dm-chat-live-dot"></span><div><strong>What can I help with?</strong><small>Write your question below. No complicated support form.</small></div></div><form id="dmChatStartForm" class="dm-chat-start-form"><label class="dm-chat-question">Your question<textarea name="message" maxlength="4000" required placeholder="Ask something..."></textarea></label><div class="dm-chat-person"><label>Name<input name="name" maxlength="100" required autocomplete="name" value="${esc(p.name||'')}"></label><label>Email<input name="email" type="email" maxlength="254" required autocomplete="email" value="${esc(p.email||'')}"></label></div><input name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px"><button class="dm-support-submit" type="submit">Send question</button><div class="dm-support-status${error?' error':''}" aria-live="polite">${esc(error)}</div><div class="dm-support-note">Your chat stays on this browser. When Damiønmusic replies, it appears here.</div></form></div>`;
    const form=host.querySelector('#dmChatStartForm');
    form.addEventListener('submit',async e=>{e.preventDefault();if(!form.reportValidity())return;const btn=form.querySelector('button');const status=form.querySelector('.dm-support-status');btn.disabled=true;status.className='dm-support-status';status.textContent='Sending…';const data=Object.fromEntries(new FormData(form).entries());try{const out=await call('create',{...data,currentPage:location.href});token=out.token||'';if(token)localStorage.setItem(TOKEN_KEY,token);saveProfile({name:data.name,email:data.email});chat=out;renderThread();startPolling()}catch(err){status.className='dm-support-status error';status.textContent=err.message||'Could not send your question.'}finally{btn.disabled=false}});
    setTimeout(()=>form.elements.message?.focus({preventScroll:true}),80);
  }

  function renderThread(){
    if(!chat?.chat){renderStart();return}
    const messages=Array.isArray(chat.messages)?chat.messages:[];
    const staffCount=messages.filter(m=>m.sender==='staff').length;
    if(staffCount>lastStaffCount&&!panel.classList.contains('open')){badge.hidden=false;badge.textContent=String(Math.min(9,staffCount-lastStaffCount))}
    lastStaffCount=staffCount;
    host.innerHTML=`<div class="dm-chat-thread-head"><div><strong>${esc(chat.chat.ticket_number||'Support chat')}</strong><small>${chat.chat.status==='answered'?'Damiønmusic replied':chat.chat.status==='closed'?'Closed':'Waiting for reply'}</small></div><button id="dmNewChat" type="button">New chat</button></div><div class="dm-chat-messages" id="dmChatMessages">${messages.map(m=>`<div class="dm-chat-bubble ${m.sender==='staff'?'staff':'customer'}"><span>${m.sender==='staff'?'Damiønmusic':'You'}</span><p>${esc(m.message).replace(/\n/g,'<br>')}</p><small>${new Date(m.created_at).toLocaleString([],{hour:'2-digit',minute:'2-digit',day:'numeric',month:'short'})}</small></div>`).join('')||'<div class="dm-chat-empty">No messages yet.</div>'}</div><form id="dmChatReplyForm" class="dm-chat-reply"><textarea name="message" maxlength="4000" required placeholder="Write a message..."></textarea><button class="dm-support-submit" type="submit">Send</button><div class="dm-support-status" aria-live="polite"></div></form>`;
    const list=host.querySelector('#dmChatMessages');list.scrollTop=list.scrollHeight;
    host.querySelector('#dmNewChat').addEventListener('click',()=>{if(!confirm('Start a new support chat?'))return;token='';chat=null;try{localStorage.removeItem(TOKEN_KEY)}catch(_){}stopPolling();renderStart()});
    const form=host.querySelector('#dmChatReplyForm');form.addEventListener('submit',async e=>{e.preventDefault();if(!form.reportValidity())return;const btn=form.querySelector('button'),status=form.querySelector('.dm-support-status'),message=form.elements.message.value;btn.disabled=true;status.textContent='Sending…';try{chat=await call('message',{token,message});form.elements.message.value='';renderThread()}catch(err){status.className='dm-support-status error';status.textContent=err.message||'Could not send.'}finally{btn.disabled=false}});
  }

  async function refresh(silent=false){if(!token)return;try{const next=await call('get',{token});chat=next;renderThread()}catch(err){if(!silent){token='';try{localStorage.removeItem(TOKEN_KEY)}catch(_){}renderStart(err.message)}}}
  function startPolling(){stopPolling();if(!token)return;pollTimer=setInterval(()=>{if(document.visibilityState==='visible')refresh(true)},12000)}
  function stopPolling(){if(pollTimer){clearInterval(pollTimer);pollTimer=null}}
  const open=()=>{panel.classList.add('open');panel.setAttribute('aria-hidden','false');button.setAttribute('aria-expanded','true');badge.hidden=true;if(token)refresh(true);setTimeout(()=>host.querySelector('textarea')?.focus({preventScroll:true}),100)};
  const close=()=>{panel.classList.remove('open');panel.setAttribute('aria-hidden','true');button.setAttribute('aria-expanded','false')};
  button.addEventListener('click',()=>panel.classList.contains('open')?close():open());panel.querySelector('.dm-support-close').addEventListener('click',close);document.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel.classList.contains('open'))close()});
  window.openSupportChat=()=>open();

  if(token){refresh(false).then(startPolling)}else renderStart();
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&token)refresh(true)});
  window.addEventListener('pagehide',stopPolling,{once:true});
})();
