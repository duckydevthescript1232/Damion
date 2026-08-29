(()=>{
  if(window.__dmMotionV5)return;
  window.__dmMotionV5=true;
  history.scrollRestoration='auto';
  document.documentElement.classList.remove('dm-page-leaving','dm-motion-ready','dm-native-view','dm-soft-nav-active','dm-ui-motion');
  document.body?.classList.remove('dm-reduced');
  document.querySelectorAll('.dm-hoverfx').forEach(el=>el.classList.remove('dm-hoverfx'));
})();
