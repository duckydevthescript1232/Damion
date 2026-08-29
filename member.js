(()=>{
  const API='/api/damion-paypal';
  const ANON='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dGxoY2Vxa2lvc2hlcGZieWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMDAxMDUsImV4cCI6MjEwMTU3NjEwNX0.Ad9wROEhZ2uKxKx9H5AHqCCmFa0nTezrBHkAn-Zwyws';
  const ACCESS_KEY='damion_plan_access';
  const BRIEFS_KEY='damion_member_briefs';
  const CHECK_KEY='damion_member_checklist';
  const $=id=>document.getElementById(id);
  let plan=null;

  async function api(payload){
    const res=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json','apikey':ANON,'Authorization':`Bearer ${ANON}`},body:JSON.stringify(payload)});
    let data={};try{data=await res.json()}catch(_){}
    if(!res.ok)throw new Error(data.error||'Could not verify plan access.');
    return data;
  }
  function getBriefs(){try{const x=JSON.parse(localStorage.getItem(BRIEFS_KEY)||'[]');return Array.isArray(x)?x:[]}catch(_){return []}}
  function setBriefs(x){localStorage.setItem(BRIEFS_KEY,JSON.stringify(x));renderBriefs()}
  function renderBriefs(){
    const list=$('briefList');if(!list||!plan)return;const items=getBriefs();
    list.innerHTML=items.length?items.map((b,i)=>`<div class="brief-item"><div><b>${escapeHtml(b.title||'Untitled project')}</b><small>${new Date(b.updated).toLocaleString()}</small></div><button class="btn" type="button" data-load="${i}">Open</button></div>`).join(''):'<div class="member-state">No saved project briefs yet.</div>';
    list.querySelectorAll('[data-load]').forEach(btn=>btn.onclick=()=>{const b=items[Number(btn.dataset.load)];if(!b)return;$('briefTitle').value=b.title||'';$('briefBody').value=b.body||'';$('briefTitle').dataset.edit=btn.dataset.load;window.scrollTo({top:document.querySelector('.brief-section').offsetTop-80,behavior:'smooth'})});
  }
  function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function setupChecklist(){
    let saved={};try{saved=JSON.parse(localStorage.getItem(CHECK_KEY)||'{}')}catch(_){}
    document.querySelectorAll('[data-check]').forEach(input=>{input.checked=Boolean(saved[input.dataset.check]);input.onchange=()=>{saved[input.dataset.check]=input.checked;localStorage.setItem(CHECK_KEY,JSON.stringify(saved))}});
  }
  function setupBriefs(){
    $('saveBrief').onclick=()=>{
      const title=$('briefTitle').value.trim(),body=$('briefBody').value.trim();if(!title&&!body){$('briefMessage').textContent='Add a project name or notes first.';return}
      const items=getBriefs();const edit=Number($('briefTitle').dataset.edit);const max=Number(plan.brief_limit||1);
      if(Number.isInteger(edit)&&edit>=0&&edit<items.length){items[edit]={title,body,updated:new Date().toISOString()}}else{if(items.length>=max){$('briefMessage').textContent=`Your ${plan.name} allows ${max} saved project brief${max===1?'':'s'}.`;return}items.unshift({title,body,updated:new Date().toISOString()})}
      delete $('briefTitle').dataset.edit;$('briefTitle').value='';$('briefBody').value='';$('briefMessage').textContent='Project brief saved.';setBriefs(items)
    };
    $('exportBrief').onclick=()=>{
      const title=$('briefTitle').value.trim()||'Damiønmusic Project Brief',body=$('briefBody').value.trim();if(!body){$('briefMessage').textContent='Write some project notes before exporting.';return}
      const text=`${title}\n${'='.repeat(title.length)}\n\n${body}\n\nCreated in Damiønmusic Member Hub`;
      const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=`${title.replace(/[^a-z0-9-_]+/gi,'-').replace(/^-|-$/g,'')||'project-brief'}.txt`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)
    };
  }
  async function init(){
    const token=localStorage.getItem(ACCESS_KEY);if(!token){$('memberLoading').hidden=true;$('memberLocked').hidden=false;$('memberIntro').textContent='Choose a plan to unlock member tools.';return}
    try{
      const result=await api({action:'plan_status',access_token:token});if(!result.active)throw new Error('No active plan found.');
      plan=result.plan;$('memberLoading').hidden=true;$('memberActive').hidden=false;$('memberPlanName').textContent=plan.name;$('memberPlanBadge').textContent=`${plan.id} · active`;$('memberExpiry').textContent=`Access active until ${new Date(result.expires_at).toLocaleDateString()}.`;$('memberIntro').textContent=`${plan.name} is active. Your member tools are ready.`;$('memberFeatures').innerHTML=(plan.features||[]).map(x=>`<li>${escapeHtml(x)}</li>`).join('');$('briefLimitText').textContent=`You can keep up to ${plan.brief_limit||1} saved project brief${Number(plan.brief_limit||1)===1?'':'s'} in this browser.`;$('memberSupport').textContent=plan.support||'Member support';$('memberSupport').href=`/support?plan=${encodeURIComponent(plan.id)}`;
      if(plan.id==='starter')$('exportBrief').hidden=true;
      setupChecklist();setupBriefs();renderBriefs();
    }catch(err){console.error(err);localStorage.removeItem(ACCESS_KEY);$('memberLoading').hidden=true;$('memberLocked').hidden=false;$('memberIntro').textContent='Your plan could not be verified.'}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
