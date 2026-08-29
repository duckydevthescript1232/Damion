(()=>{
  if(window.__dmHeaderPolishV6)return;
  window.__dmHeaderPolishV6=true;

  const cartSvg=`<svg class="dm-cart-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3.5 4.5h2l1.7 9.2a2 2 0 0 0 2 1.65h7.95a2 2 0 0 0 1.92-1.44L20.5 8H7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 19a1.25 1.25 0 1 1-2.5 0A1.25 1.25 0 0 1 10 19Zm8 0a1.25 1.25 0 1 1-2.5 0A1.25 1.25 0 0 1 18 19Z" fill="currentColor"/></svg>`;

  const cleanHeader=()=>{
    document.querySelectorAll('a[href="/pricing"],a[href="/pricing.html"],a[href="pricing.html"]').forEach(a=>a.remove());

    const navlinks=document.querySelector('.navlinks');
    if(navlinks){
      const links=[...navlinks.querySelectorAll('a[href]')];
      const support=links.find(a=>/\/support(?:\.html)?$/.test(new URL(a.href,location.href).pathname)||a.textContent.trim().toLowerCase()==='support');
      const contacts=links.filter(a=>/\/contact(?:\.html)?$/.test(new URL(a.href,location.href).pathname)||a.textContent.trim().toLowerCase()==='contact');
      if(support)contacts.forEach(a=>a.remove());
      else if(contacts[0]){contacts[0].href='/support';contacts[0].textContent='Support';contacts.slice(1).forEach(a=>a.remove())}
    }

    /* Keep the header focused: navigation, cart, language and menu only.
       Booking/support CTAs already exist in the page content. */
    document.querySelectorAll('.nav-actions > a.btn').forEach(a=>a.remove());
  };

  const apply=()=>{
    cleanHeader();
    document.querySelectorAll('button[aria-label="Cart"]').forEach(btn=>{
      if(btn.classList.contains('dm-cart-button'))return;
      const count=btn.querySelector('.count');
      btn.classList.add('dm-cart-button');
      btn.innerHTML=cartSvg;
      if(count)btn.appendChild(count);
    });
  };

  apply();
  new MutationObserver(apply).observe(document.body,{childList:true,subtree:true});
})();
