(()=>{
  if(window.__dmCartDrawerFixV1)return;
  window.__dmCartDrawerFixV1=true;

  const moveToTopLayer=()=>{
    const bg=document.getElementById('drawerBg');
    const drawer=document.getElementById('cartDrawer');
    if(bg&&bg.parentElement!==document.body)document.body.appendChild(bg);
    if(drawer&&drawer.parentElement!==document.body)document.body.appendChild(drawer);
    return {bg,drawer};
  };

  const forceOpen=()=>{
    const {bg,drawer}=moveToTopLayer();
    if(!bg||!drawer)return false;
    try{window.renderCart?.();}catch(_){}
    bg.classList.add('open');
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden','false');
    document.body.classList.add('cart-open');
    requestAnimationFrame(()=>drawer.querySelector('.drawer-head button,.drawer-head .btn')?.focus?.({preventScroll:true}));
    return true;
  };

  const forceClose=()=>{
    const bg=document.getElementById('drawerBg');
    const drawer=document.getElementById('cartDrawer');
    bg?.classList.remove('open');
    drawer?.classList.remove('open');
    drawer?.setAttribute('aria-hidden','true');
    document.body.classList.remove('cart-open');
  };

  const install=()=>{
    moveToTopLayer();

    if(typeof window.openCart==='function'&&!window.openCart.__dmFixed){
      const original=window.openCart;
      const fixed=function(){
        try{original.apply(this,arguments);}catch(_){}
        forceOpen();
      };
      fixed.__dmFixed=true;
      window.openCart=fixed;
    }

    if(typeof window.closeCart==='function'&&!window.closeCart.__dmFixed){
      const original=window.closeCart;
      const fixed=function(){
        try{original.apply(this,arguments);}catch(_){}
        forceClose();
      };
      fixed.__dmFixed=true;
      window.closeCart=fixed;
    }
  };

  document.addEventListener('click',e=>{
    const target=e.target instanceof Element?e.target:e.target?.parentElement;
    if(!target)return;

    const cartButton=target.closest('button[aria-label="Cart"],button[aria-label*="cart" i],[data-open-cart]');
    if(cartButton){
      requestAnimationFrame(()=>{install();forceOpen();});
      return;
    }

    if(target.closest('#drawerBg,#cartDrawer .drawer-head .btn.icon,[data-close-cart]')){
      if(target.id==='drawerBg'||target.closest('#drawerBg,#cartDrawer .drawer-head .btn.icon,[data-close-cart]'))forceClose();
    }
  },true);

  document.addEventListener('keydown',e=>{if(e.key==='Escape')forceClose();});
  document.addEventListener('dm:pagechange',()=>setTimeout(install,0));
  window.addEventListener('pageshow',()=>{forceClose();setTimeout(install,0);});

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
  setTimeout(install,350);
  setTimeout(install,1200);
})();
