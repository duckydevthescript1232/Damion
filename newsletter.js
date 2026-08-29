// Deployment refresh after Mailchimp environment configuration.
(()=>{
  const form=document.getElementById('newsletterForm');
  if(!form)return;

  const email=form.querySelector('input[name="email"]');
  const consent=form.querySelector('input[name="consent"]');
  const button=form.querySelector('button[type="submit"]');
  const status=document.getElementById('newsletterStatus');

  const setStatus=(message,type='')=>{
    status.textContent=message;
    status.className='newsletter-status'+(type?` is-${type}`:'');
  };

  form.addEventListener('submit',async(event)=>{
    event.preventDefault();
    setStatus('');

    const address=email.value.trim();
    if(!address){setStatus('Enter your email address.','error');email.focus();return;}
    if(!consent.checked){setStatus('Please confirm that you want to receive email updates.','error');consent.focus();return;}

    const original=button.textContent;
    button.disabled=true;
    button.textContent='Joining…';

    try{
      const response=await fetch('/api/mailchimp-subscribe',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          email:address,
          consent:true,
          website:form.querySelector('input[name="website"]')?.value||''
        })
      });
      const data=await response.json().catch(()=>({}));
      if(!response.ok)throw new Error(data.message||'Could not join the list right now.');
      setStatus(data.message||'Check your inbox to confirm your subscription.','success');
      form.reset();
    }catch(error){
      setStatus(error.message||'Something went wrong. Please try again.','error');
    }finally{
      button.disabled=false;
      button.textContent=original;
    }
  });
})();
