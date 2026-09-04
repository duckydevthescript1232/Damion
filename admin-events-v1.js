(()=>{
if(window.__dmAdminEventsV1)return;window.__dmAdminEventsV1=true;
const ENDPOINT='https://wutlhceqkioshepfbykf.supabase.co/functions/v1/damion-site-events';
const SESSION_KEY='damion_site_session';
const LABELS={admin_drop:'Admin Drop',flash_sale:'Flash Sale',release:'New Release',giveaway:'Giveaway',maintenance:'Maintenance',live_session:'Live Session',announcement:'Announcement'};
const PRESETS={
admin_drop:{title:'Admin Drop',message:'A limited-time site event is live. Check it out before the timer ends.',cta_label:'Explore',cta_url:'/services'},
flash_sale:{title:'Flash Sale',message:'Limited-time pricing is live for a short window.',cta_label:'View services',cta_url:'/services'},
release:{title:'New Release',message:'Something new just dropped. Take a look while the event is live.',cta_label:'View now',cta_url:'/'},
giveaway:{title:'Giveaway',message:'A limited giveaway event is now open.',cta_label:'See details',cta_url:'/'},
maintenance:{title:'Scheduled Maintenance',message:'Some site features may be temporarily unavailable during this window.',cta_label:'Support',cta_url:'/support'},
live_session:{title:'Live Session',message:'A live session is happening now. Join before the timer ends.',cta_label:'Open',cta_url:'/'},
announcement:{title:'Site Announcement',message:'A new site update is available.',cta_label:'Learn more',cta_url:'/'}
};
let rows=[],offset=0,refreshing=false,tickTimer=0,refreshTimer=0;
const $=id=>document.getElementById(id);
const session=()=>{try{return localStorage.getItem(SESSION_KEY)||''}catch(_){return''}};
const now=()=>Date.now()+offset;
const esc=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function post(action,extra){
 const token=session();if(!token)throw new Error('Owner login required');
 const r=await fetch(ENDPOINT,{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.assign({action:action,ownerSession:token},extra||{}))});
 const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d&&d.error?d.error:'Event request failed');return d;
}
function localInput(d){const z=n=>String(n).padStart(2,'0');return d.getFullYear()+'-'+z(d.getMonth()+1)+'-'+z(d.getDate())+'T'+z(d.getHours())+':'+z(d.getMinutes())}
function parseInput(id){const v=$(id)&&$(id).value||'';const d=new Date(v);return Number.isFinite(d.getTime())?d:null}
function state(e){if(!e.active)return'disabled';const t=now(),s=new Date(e.starts_at).getTime(),en=new Date(e.ends_at).getTime();return t<s?'upcoming':t<en?'live':'ended'}
function countdown(e){const st=state(e),target=st==='upcoming'?new Date(e.starts_at).getTime():st==='live'?new Date(e.ends_at).getTime():0;if(!target)return'—';const sec=Math.max(0,Math.ceil((target-now())/1000)),d=Math.floor(sec/86400),h=Math.floor(sec%86400/3600),m=Math.floor(sec%3600/60),s=sec%60;if(d)return d+'d '+h+'h '+m+'m';if(h)return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')}
function when(e){return new Date(e.starts_at).toLocaleString([],{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}
function setStatus(msg,type){const el=$('dmEventAdminStatus');if(!el)return;el.textContent=msg||'';el.className='dm-event-admin-status'+(type?' '+type:'')}
function panelHtml(){
 return '<div class="dm-events-head"><div><h2>Events & timers</h2><p>Schedule real site-wide events with live start/end countdowns.</p></div><span class="dm-events-live-pill"><i></i><span id="dmEventsSummary">0 live · 0 upcoming</span></span></div>'+
 '<div class="dm-event-presets">'+
 '<button type="button" data-event-preset="admin_drop">Admin Drop</button><button type="button" data-event-preset="flash_sale">Flash Sale</button><button type="button" data-event-preset="release">New Release</button><button type="button" data-event-preset="giveaway">Giveaway</button><button type="button" data-event-preset="maintenance">Maintenance</button><button type="button" data-event-preset="live_session">Live Session</button><button type="button" data-event-preset="announcement">Announcement</button></div>'+
 '<form id="dmEventCreateForm" class="dm-event-form">'+
 '<label>Event type<select id="dmEventType"><option value="admin_drop">Admin Drop</option><option value="flash_sale">Flash Sale</option><option value="release">New Release</option><option value="giveaway">Giveaway</option><option value="maintenance">Maintenance</option><option value="live_session">Live Session</option><option value="announcement">Announcement</option></select></label>'+
 '<label class="wide">Title<input id="dmEventTitle" maxlength="100" required placeholder="New music drop"></label>'+
 '<label>Starts<input id="dmEventStart" type="datetime-local" required></label>'+
 '<label>Ends<input id="dmEventEnd" type="datetime-local" required></label>'+
 '<label class="full">Message<textarea id="dmEventMessage" maxlength="400" placeholder="Tell visitors what is happening..."></textarea></label>'+
 '<label>Button text<input id="dmEventCtaLabel" maxlength="40" placeholder="View services"></label>'+
 '<label class="wide">Button link<input id="dmEventCtaUrl" maxlength="300" placeholder="/services"></label>'+
 '<div class="dm-event-submit-row"><div class="dm-event-durations"><button type="button" data-event-now>Start now</button><button type="button" data-event-duration="15">15 min</button><button type="button" data-event-duration="30">30 min</button><button type="button" data-event-duration="60">1 hour</button><button type="button" data-event-duration="120">2 hours</button><button type="button" data-event-duration="1440">24 hours</button></div><button class="btn primary" type="submit">Schedule event</button></div></form>'+
 '<div id="dmEventAdminStatus" class="dm-event-admin-status"></div><div id="dmEventAdminList" class="dm-event-admin-list"><div class="dm-events-empty">No events loaded yet.</div></div>';
}
function ensurePanel(){
 if($('dmEventsAdmin'))return;
 const dash=$('dashboard');if(!dash)return;
 const card=document.createElement('div');card.id='dmEventsAdmin';card.className='admin-card dm-events-admin';card.innerHTML=panelHtml();
 const stats=dash.querySelector('.stats');if(stats&&stats.nextSibling)dash.insertBefore(card,stats.nextSibling);else dash.prepend(card);
 bind();defaults();
}
function defaults(){
 const start=$('dmEventStart'),end=$('dmEventEnd');if(!start||!end)return;
 const s=new Date();s.setSeconds(0,0);const e=new Date(s.getTime()+3600000);
 if(!start.value)start.value=localInput(s);if(!end.value)end.value=localInput(e);
 if(!$('dmEventTitle').value)applyPreset('admin_drop',false);
}
function applyPreset(type,overwrite){
 const p=PRESETS[type]||PRESETS.announcement;overwrite=overwrite!==false;$('dmEventType').value=type;
 if(overwrite||!$('dmEventTitle').value)$('dmEventTitle').value=p.title;
 if(overwrite||!$('dmEventMessage').value)$('dmEventMessage').value=p.message;
 if(overwrite||!$('dmEventCtaLabel').value)$('dmEventCtaLabel').value=p.cta_label;
 if(overwrite||!$('dmEventCtaUrl').value)$('dmEventCtaUrl').value=p.cta_url;
}
function setDuration(mins){const s=parseInput('dmEventStart')||new Date();$('dmEventEnd').value=localInput(new Date(s.getTime()+Number(mins)*60000))}
function render(){
 const host=$('dmEventAdminList');if(!host)return;
 const live=rows.filter(e=>state(e)==='live').length,upcoming=rows.filter(e=>state(e)==='upcoming').length;
 if($('dmEventsSummary'))$('dmEventsSummary').textContent=live+' live · '+upcoming+' upcoming';
 if(!rows.length){host.innerHTML='<div class="dm-events-empty">No events yet. Use a preset above or create your own.</div>';return}
 host.innerHTML=rows.map(e=>{
  const st=state(e),endText=new Date(e.ends_at).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
  const endBtn=(st==='live'||st==='upcoming')?'<button type="button" data-event-end="'+e.id+'">End now</button>':'';
  return '<article class="dm-event-admin-row '+st+'" data-event-id="'+e.id+'">'+
   '<div class="dm-event-admin-title"><b>'+esc(e.title)+'</b><small>'+esc(LABELS[e.event_type]||'Event')+' · '+esc(e.message||'No message')+'</small></div>'+
   '<div><span class="dm-event-admin-state '+st+'">'+st+'</span></div>'+
   '<div class="dm-event-admin-time"><b>'+esc(when(e))+'</b><small>'+(st==='live'?'ends '+endText:st==='upcoming'?'scheduled':'finished')+'</small></div>'+
   '<div class="dm-event-admin-count" data-event-count="'+e.id+'">'+countdown(e)+'</div>'+
   '<div class="dm-event-admin-actions"><button type="button" data-event-toggle="'+e.id+'" data-next="'+(e.active?'0':'1')+'" class="'+(e.active?'':'enable')+'">'+(e.active?'Disable':'Enable')+'</button>'+endBtn+'<button type="button" class="danger" data-event-delete="'+e.id+'">Delete</button></div></article>';
 }).join('');
}
async function refresh(){
 if(refreshing||!session())return;refreshing=true;
 try{const d=await post('admin_list');if(d.server_time){const t=new Date(d.server_time).getTime();if(Number.isFinite(t))offset=t-Date.now()}rows=Array.isArray(d.events)?d.events:[];render();setStatus('')}
 catch(err){setStatus(err&&err.message?err.message:'Could not load events','error')}finally{refreshing=false}
}
function tick(){
 document.querySelectorAll('[data-event-count]').forEach(el=>{const e=rows.find(r=>String(r.id)===el.dataset.eventCount);if(e)el.textContent=countdown(e)});
 const live=rows.filter(e=>state(e)==='live').length,upcoming=rows.filter(e=>state(e)==='upcoming').length;if($('dmEventsSummary'))$('dmEventsSummary').textContent=live+' live · '+upcoming+' upcoming';
}
function bind(){
 document.querySelectorAll('[data-event-preset]').forEach(b=>b.addEventListener('click',()=>applyPreset(b.dataset.eventPreset,true)));
 document.querySelectorAll('[data-event-duration]').forEach(b=>b.addEventListener('click',()=>setDuration(Number(b.dataset.eventDuration))));
 const nowBtn=document.querySelector('[data-event-now]');if(nowBtn)nowBtn.addEventListener('click',()=>{const s=new Date();s.setSeconds(0,0);$('dmEventStart').value=localInput(s);setDuration(30)});
 const form=$('dmEventCreateForm');if(form)form.addEventListener('submit',async e=>{
  e.preventDefault();if(!form.reportValidity())return;const btn=form.querySelector('button[type="submit"]');btn.disabled=true;setStatus('Scheduling event…');
  try{const start=parseInput('dmEventStart'),end=parseInput('dmEventEnd');if(!start||!end)throw new Error('Choose a valid start and end time');
   await post('admin_create',{event_type:$('dmEventType').value,title:$('dmEventTitle').value,message:$('dmEventMessage').value,starts_at:start.toISOString(),ends_at:end.toISOString(),cta_label:$('dmEventCtaLabel').value,cta_url:$('dmEventCtaUrl').value});
   setStatus('Event scheduled. Visitors will update automatically.','ok');const type=$('dmEventType').value;form.reset();defaults();applyPreset(type,true);await refresh();
  }catch(err){setStatus(err&&err.message?err.message:'Could not schedule event','error')}finally{btn.disabled=false}
 });
 const list=$('dmEventAdminList');if(list)list.addEventListener('click',async e=>{
  const t=e.target.closest('button');if(!t)return;const raw=t.dataset.eventToggle||t.dataset.eventEnd||t.dataset.eventDelete,id=Number(raw);if(!id)return;t.disabled=true;
  try{
   if(t.dataset.eventToggle)await post('admin_toggle',{id:id,active:t.dataset.next==='1'});
   else if(t.dataset.eventEnd)await post('admin_end_now',{id:id});
   else if(t.dataset.eventDelete){if(!confirm('Delete this event permanently?')){t.disabled=false;return}await post('admin_delete',{id:id})}
   await refresh();
  }catch(err){setStatus(err&&err.message?err.message:'Could not update event','error');t.disabled=false}
 });
 clearInterval(tickTimer);tickTimer=setInterval(tick,1000);clearInterval(refreshTimer);refreshTimer=setInterval(()=>{if(document.visibilityState==='visible')refresh()},10000);
}
function start(){ensurePanel();if(session())refresh()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
window.addEventListener('dm-owner-ready',()=>{ensurePanel();refresh()});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&session())refresh()});
})();