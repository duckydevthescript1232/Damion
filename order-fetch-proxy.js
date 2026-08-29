(()=>{
  if(window.__dmOrderFetchProxy)return;
  window.__dmOrderFetchProxy=true;
  const nativeFetch=window.fetch.bind(window);
  const direct='https://wutlhceqkioshepfbykf.supabase.co/functions/v1/damion-orders';

  window.fetch=(input,init={})=>{
    const url=typeof input==='string'?input:(input&&input.url)||'';
    if(url!==direct)return nativeFetch(input,init);

    const headers=new Headers(init.headers||{});
    headers.delete('apikey');
    headers.delete('authorization');
    headers.delete('cache-control');
    headers.set('Content-Type','application/json');

    return nativeFetch('/api/order',{...init,headers,cache:'no-store'});
  };
})();
