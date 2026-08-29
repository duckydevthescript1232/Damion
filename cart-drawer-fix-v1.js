(()=>{
  if(window.__dmCartDrawerFixV2)return;
  window.__dmCartDrawerFixV2=true;

  const getParts=()=>({
    bg:document.getElementById('drawerBg'),
    drawer:document.getElementById('cartDrawer')
  });

  const moveToTopLayer=()=>{
    const {bg,drawer}=getParts();
    if(bg&&bg.parentElement!==document.body)document.body.appendChild(bg);
    if(drawer&&drawer.parentElement!==document.body)document.body.appendChild(drawer);
    return {bg,drawer};
  };

  const unlockPage=()=>{
    document.body.classList.remove('dm-cart-scroll-lock');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('position');
    document.body.style.removeProperty('touch-action');
    document.documentElement.style.removeProperty('overflow');
  };

  const open=()=>{
    const {bg,drawer}=moveToTopLayer();
    if(!bg||!drawer)return false;
    try{window.renderCart?.();}catch(_){}
    unlockPage();
    bg.classList.add('open');
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden','false');
    document.body.classList.add('cart-open');
    const body=drawer.querySelector('.drawer-body');
    if(body)body.scrollTop=0;
    requestAnimationFrame(()=>drawer.querySelector('.drawer-head .btn.icon,[data-close-cart]')?.focus?.({preventScroll:true}));
    return true;
  };

  const close=()=>{
    const {bg,drawer}=getParts();
    bg?.classList.remove('open');
    drawer?.classList.remove('open');
    drawer?.setAttribute('aria-hidden','true');
    document.body.classList.remove('cart-open');
    unlockPage();
    return true;
  };

  const install=()=>{
    moveToTopLayer();
    unlockPage();

    window.openCart=open;
    window.closeCart=close;

    const {bg,drawer}=getParts();
    if(bg&&!bg.dataset.dmCartClose){
      bg.dataset.dmCartClose='1';
      bg.addEventListener('click',e=>{
        if(e.target===bg)close();
      });
    }

    if(drawer&&!drawer.dataset.dmCartClose){
      drawer.dataset.dmCartClose='1';
      drawer.addEventListener('click',e=>{
        const closeBtn=e.target.closest?.('.drawer-head .btn.icon,[data-close-cart]');
        if(!closeBtn)return;
        e.preventDefault();
        e.stopPropagation();
        close();
      });
    }
  };

  document.addEventListener('click',e=>{
    const target=e.target instanceof Element?e.target:e.target?.parentElement;
    if(!target)return;
    const cartButton=target.closest('button[aria-label="Cart"],button[aria-label*="cart" i],[data-open-cart]');
    if(cartButton){
      e.preventDefault();
      open();
    }
  },true);

  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&document.getElementById('cartDrawer')?.classList.contains('open'))close();
  });

  document.addEventListener('dm:pagechange',()=>setTimeout(install,0));
  window.addEventListener('pageshow',()=>{close();setTimeout(install,0)});

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
  setTimeout(install,300);
})();
