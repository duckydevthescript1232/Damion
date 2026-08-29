(()=>{
  if(window.__dmLanguageFinalV3)return;
  window.__dmLanguageFinalV3=true;

  const T=new Map([
    ['Secure checkout','Veilig afrekenen'],
    ['Tell me about your project, then continue to a secure iDEAL payment with Mollie.','Vertel me over je project en ga daarna door naar een veilige iDEAL-betaling via Mollie.'],
    ['iDEAL payment handled securely by Mollie','iDEAL-betaling veilig verwerkt door Mollie'],
    ['You will be redirected to Mollie to complete the payment with iDEAL.','Je wordt doorgestuurd naar Mollie om de betaling met iDEAL af te ronden.'],
    ['iDEAL via Mollie','iDEAL via Mollie'],
    ['Your payment is confirmed server-side before the order becomes Paid.','Je betaling wordt server-side bevestigd voordat de bestelling op Betaald komt te staan.'],
    ['Preparing secure iDEAL payment…','Veilige iDEAL-betaling voorbereiden…'],
    ['Opening Mollie iDEAL…','Mollie iDEAL openen…'],
    ['Could not start iDEAL payment.','iDEAL-betaling kon niet worden gestart.'],
    ['Mollie did not return a secure checkout link.','Mollie heeft geen veilige betaallink teruggestuurd.'],
    ['Waiting for iDEAL payment','Wachten op iDEAL-betaling'],
    ['Order received','Bestelling ontvangen'],
    ['Your order is saved.','Je bestelling is opgeslagen.'],
    ['Payment received','Betaling ontvangen'],
    ['Your iDEAL payment is confirmed.','Je iDEAL-betaling is bevestigd.'],
    ['Paid','Betaald'],
    ['Pending payment','Wacht op betaling'],
    ['Payment failed','Betaling mislukt'],
    ['Package','Pakket'],
    ['Service','Dienst'],
    ['Download','Downloaden'],
    ['Messages','Berichten'],
    ['Total','Totaal'],

    ['Quick Feedback','Snelle feedback'],
    ['Full Beat Review','Volledige beatreview'],
    ['Release Master','Release-master'],
    ['Master + Alternate','Master + alternatieve versie'],
    ['Melody Idea','Melodie-idee'],
    ['Melody + Chords','Melodie + akkoorden'],
    ['Idea Pack','Ideeënpakket'],
    ['Starter Mix','Starter mix'],
    ['Artist Mix','Artiestenmix'],
    ['Detailed Mix','Gedetailleerde mix'],
    ['Lead Vocal','Lead vocal'],
    ['Full Vocal Stack','Volledige vocal stack'],
    ['Vocal Production','Vocal productie'],
    ['Artist Beat','Artiestenbeat'],
    ['Full Beat Package','Volledig beatpakket'],
    ['Artist Mix + Master','Artiestenmix + master'],
    ['Full Mix + Master','Volledige mix + master'],
    ['Instrumental + Stems','Instrumental + stems'],
    ['Full Instrumental Pack','Volledig instrumental-pakket'],
    ['Extended Remix','Uitgebreide remix'],
    ['Remix + Stems','Remix + stems'],
    ['Starter Production','Starter productie'],
    ['Artist Production','Artiestenproductie'],
    ['Complete Song Package','Compleet songpakket'],

    ['A short, focused review with the three biggest improvements to make first.','Een korte, gerichte review met de drie belangrijkste verbeteringen om als eerste te doen.'],
    ['More detailed feedback on mix, arrangement, sound choice and overall direction.','Uitgebreidere feedback op mix, arrangement, soundkeuze en de algemene richting.'],
    ['One polished stereo master ready for release.','Eén gepolijste stereo-master die klaar is voor release.'],
    ['Main master plus one alternate loudness version for extra flexibility.','De hoofdmaster plus één alternatieve loudness-versie voor extra flexibiliteit.'],
    ['One original melody delivered as editable MIDI.','Eén originele melodie geleverd als bewerkbare MIDI.'],
    ['Original melody plus a matching chord progression as MIDI.','Originele melodie plus een passende akkoordprogressie als MIDI.'],
    ['Three different melody/chord ideas so you can choose your favorite direction.','Drie verschillende melodie-/akkoordideeën zodat je jouw favoriete richting kunt kiezen.'],
    ['Up to 12 stems with clean balancing, EQ, compression and space.','Tot 12 stems met nette balans, EQ, compressie en ruimte.'],
    ['Up to 30 stems with deeper vocal, drum and FX work.','Tot 30 stems met uitgebreidere bewerking van vocals, drums en FX.'],
    ['Up to 50 stems, more detailed automation and two revisions.','Tot 50 stems, uitgebreidere automation en twee revisies.'],
    ['Cleanup, tuning and processing for one main vocal.','Opschoning, tuning en processing voor één hoofdvocal.'],
    ['Lead, doubles and supporting vocal layers processed together.','Lead, doubles en ondersteunende vocal-lagen samen verwerkt.'],
    ['Full vocal stack plus extra creative FX, transitions and two revisions.','Volledige vocal stack plus extra creatieve FX, transities en twee revisies.'],
    ['Original beat with a complete song-ready arrangement.','Originele beat met een compleet songklaar arrangement.'],
    ['More detailed production with grouped stems included.','Uitgebreidere productie met gegroepeerde stems inbegrepen.'],
    ['Detailed production, stems, WAV/MP3 exports and two revisions.','Gedetailleerde productie, stems, WAV/MP3-exports en twee revisies.'],
    ['Up to 25 stems, one revision and the final release master.','Tot 25 stems, één revisie en de definitieve release-master.'],
    ['Up to 45 stems, deeper detail and two revisions.','Tot 45 stems, meer detail en twee revisies.'],
    ['Up to 60 stems, detailed automation, two revisions and alternate master.','Tot 60 stems, gedetailleerde automation, twee revisies en een alternatieve master.'],
    ['Original instrumental with a complete arrangement.','Originele instrumental met een compleet arrangement.'],
    ['Full arrangement plus grouped stems for later mixing.','Volledig arrangement plus gegroepeerde stems voor latere mixing.'],
    ['Detailed arrangement, stems, alternate version and two revisions.','Gedetailleerd arrangement, stems, alternatieve versie en twee revisies.'],
    ['A complete new direction built from your existing song or vocal.','Een compleet nieuwe richting gebouwd vanuit je bestaande song of vocal.'],
    ['More detailed production with an extended arrangement.','Uitgebreidere productie met een langer arrangement.'],
    ['Full remix, extended version, grouped stems and two revisions.','Volledige remix, extended versie, gegroepeerde stems en twee revisies.'],
    ['Turn your vocal, demo or idea into a complete arranged production.','Verander je vocal, demo of idee in een complete gearrangeerde productie.'],
    ['Detailed production with stems, creative transitions and two revisions.','Gedetailleerde productie met stems, creatieve transities en twee revisies.'],
    ['Full production, detailed arrangement, stems, project delivery options and three revisions.','Volledige productie, gedetailleerd arrangement, stems, projectleveropties en drie revisies.'],

    ['Priority delivery','Snellere levering'],
    ['Additional revision','Extra revisie'],
    ['Extra vocal tuning','Extra vocal tuning'],
    ['Instrumental export','Instrumental-export'],
    ['Acapella export','Acapella-export'],
    ['Radio edit','Radio-edit'],
    ['Project stems','Projectstems'],
    ['Project file','Projectbestand'],
    ['Within 24 hours','Binnen 24 uur'],
    ['1–2 days','1–2 dagen'],
    ['1–3 days','1–3 dagen'],
    ['2–4 days','2–4 dagen'],
    ['3–5 days','3–5 dagen'],
    ['3–6 days','3–6 dagen'],
    ['4–7 days','4–7 dagen'],
    ['5–8 days','5–8 dagen'],

    ['Your studio hub','Jouw studiohub'],
    ['Customer area','Klantomgeving'],
    ['Everything for your project.','Alles voor jouw project.'],
    ['Track an order, message the studio or start something new from one clean place.','Volg een bestelling, stuur de studio een bericht of start een nieuw project vanuit één overzichtelijke plek.'],
    ['Orders & support','Bestellingen & support'],
    ['Track your order','Volg je bestelling'],
    ['Progress, delivery and downloads','Voortgang, oplevering en downloads'],
    ['Keep support connected to your project','Houd support gekoppeld aan je project'],
    ['Contact support','Neem contact op met support'],
    ['Ask a question before or after booking','Stel een vraag vóór of na het bestellen'],
    ['Booking','Bestellen'],
    ['Start a new project','Start een nieuw project'],
    ['Browse services and build your order','Bekijk diensten en stel je bestelling samen'],
    ['Motion settings','Animatie-instellingen'],
    ['Turn smooth hover effects on or off','Zet vloeiende hover-effecten aan of uit'],
    ['Smooth interface motion','Vloeiende interface-animaties'],
    ['Secure checkout · Order tracking · Direct studio support','Veilig afrekenen · Bestelling volgen · Directe studiosupport'],
    ['Open customer menu','Open klantmenu'],
    ['Close menu','Menu sluiten'],
    ['Toggle smooth effects','Vloeiende effecten aan/uit'],
    ['Selected package','Gekozen pakket'],
    ['Music service','Muziekdienst']
  ]);

  const originals=new WeakMap();
  const attrOriginals=new WeakMap();
  const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
  const getLang=()=>{try{return window.dmGetLanguage?window.dmGetLanguage():(document.documentElement.lang||'en')}catch(_){return document.documentElement.lang||'en'}};
  const skip=node=>node.parentElement&&node.parentElement.closest('script,style,noscript,svg,code,pre,[data-dm-no-translate]');

  function textNode(node){
    if(!node||node.nodeType!==3||skip(node))return;
    if(!originals.has(node))originals.set(node,node.nodeValue||'');
    const original=originals.get(node)||'';
    const lang=getLang();
    if(lang!=='nl'){if(node.nodeValue!==original)node.nodeValue=original;return;}
    const translated=T.get(clean(original));if(!translated)return;
    const lead=(original.match(/^\s*/)||[''])[0],trail=(original.match(/\s*$/)||[''])[0];
    node.nodeValue=lead+translated+trail;
  }
  function attrs(el){
    if(!(el instanceof Element)||el.closest('[data-dm-no-translate]'))return;
    let saved=attrOriginals.get(el);if(!saved){saved={};attrOriginals.set(el,saved)}
    ['placeholder','aria-label','title'].forEach(name=>{
      if(!el.hasAttribute(name))return;
      if(!(name in saved))saved[name]=el.getAttribute(name)||'';
      const original=saved[name];
      if(getLang()!=='nl'){el.setAttribute(name,original);return;}
      const translated=T.get(clean(original));if(translated)el.setAttribute(name,translated);
    });
  }
  function apply(root=document){
    const scope=(root instanceof Element||root instanceof Document||root instanceof DocumentFragment)?root:document;
    if(root&&root.nodeType===3){textNode(root);return;}
    const walker=document.createTreeWalker(scope,NodeFilter.SHOW_TEXT);while(walker.nextNode())textNode(walker.currentNode);
    if(scope instanceof Element)attrs(scope);
    if(scope.querySelectorAll)scope.querySelectorAll('[placeholder],[aria-label],[title]').forEach(attrs);
  }
  function start(){apply(document)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  new MutationObserver(records=>{records.forEach(r=>r.addedNodes.forEach(n=>{if(n.nodeType===1||n.nodeType===3)apply(n)}))}).observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('dm:languagechange',()=>requestAnimationFrame(()=>apply(document)));
  document.addEventListener('dm:pagechange',()=>requestAnimationFrame(()=>apply(document)));
})();
