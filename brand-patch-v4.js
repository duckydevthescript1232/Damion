(()=>{
  const BRAND='Damiønmusic';
  document.querySelectorAll('.brand-name').forEach(el=>el.textContent=BRAND);
  document.querySelectorAll('.footer-brand b').forEach(el=>el.textContent=BRAND);
  document.querySelectorAll('img[src*="/assets/logo.svg"]').forEach(el=>el.alt=`${BRAND} logo`);
  document.title=document.title.replace(/DamianMusic|Damiøn(?:music)?/gi,BRAND);

  const replacements=[
    ['DamianMusic studio services','Damiønmusic studio services'],
    ['Hear the DamianMusic sound.','Hear the Damiønmusic sound.'],
    ['DamianMusic / preview','Damiønmusic / preview']
  ];
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  const nodes=[];
  while(walker.nextNode()) nodes.push(walker.currentNode);
  for(const node of nodes){
    let value=node.nodeValue||'';
    for(const [from,to] of replacements) value=value.replaceAll(from,to);
    if(value==='DamianMusic') value=BRAND;
    node.nodeValue=value;
  }
})();
