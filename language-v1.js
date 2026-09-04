(()=>{
  if(window.__dmLanguageV1)return;
  window.__dmLanguageV1=true;

  const T=new Map([
    ['Home','Home'],['Services','Diensten'],['Work','Werk'],['Portfolio','Portfolio'],['Pricing','Prijzen'],['Process','Werkwijze'],['How It Works','Hoe het werkt'],['About','Over'],['FAQ','FAQ'],['Contact','Contact'],
    ['Book a service','Boek een dienst'],['Start a Project','Start een project'],['Start a project','Start een project'],['Explore services','Bekijk diensten'],['See all services','Bekijk alle diensten'],['Ask before booking','Vraag eerst advies'],['Ask a question','Stel een vraag'],['Choose what you need','Kies wat je nodig hebt'],['Choose exactly what I need','Kies precies wat ik nodig heb'],['Choose what I need →','Kies wat ik nodig heb →'],
    ['Your track.','Jouw track.'],['Release ready.','Klaar voor release.'],['Damiønmusic studio services','Damiønmusic studio diensten'],['Mixing, mastering, vocal processing, custom beats and full track production for independent artists — with affordable pricing and a clear path from order to delivery.','Mixing, mastering, vocal processing, custom beats en volledige trackproductie voor onafhankelijke artiesten — met betaalbare prijzen en een duidelijk proces van bestelling tot oplevering.'],
    ['Affordable pricing','Betaalbare prijzen'],['Clear pricing before checkout','Duidelijke prijzen vóór het afrekenen'],['Order tracking','Bestelling volgen'],['See progress after payment','Bekijk de voortgang na betaling'],['Direct messages','Direct contact'],['Support inside your order page','Support binnen je bestelpagina'],['Secure checkout','Veilig afrekenen'],['PayPal-powered payments','Betalingen via PayPal'],
    ['Everything your track needs.','Alles wat jouw track nodig heeft.'],['Choose a focused service or a complete production. Each order shows what is included, turnaround time and the exact price before checkout.','Kies een gerichte dienst of een complete productie. Bij elke bestelling zie je wat inbegrepen is, de levertijd en de exacte prijs vóór het afrekenen.'],
    ['Official preview','Officiële preview'],['Hear the Damiønmusic sound.','Hoor de Damiønmusic sound.'],['One supplied audio track only. Play, pause, scrub and control the volume below.','Eén officiële audiotrack. Speel af, pauzeer, scrub en regel hieronder het volume.'],['Official audio preview','Officiële audio preview'],['Full supplied track.','Volledige aangeleverde track.'],['Play preview','Preview afspelen'],['Track position','Trackpositie'],['Volume','Volume'],
    ['After checkout','Na het afrekenen'],['Follow the project','Volg het project'],['Your paid order gets a private page with status, progress and delivery information.','Je betaalde bestelling krijgt een privépagina met status, voortgang en informatie over de oplevering.'],['Support','Support'],['Message the studio','Stuur de studio een bericht'],['Questions stay connected to the project you actually ordered.','Vragen blijven gekoppeld aan het project dat je hebt besteld.'],['Delivery','Oplevering'],['Receive your files','Ontvang je bestanden'],['When your work is complete, the agreed audio files or FL Studio project can be delivered through your order page.','Wanneer het werk klaar is, worden de afgesproken audiobestanden of het FL Studio-project via je bestelpagina geleverd.'],
    ['Choose exactly what','Kies precies wat'],['your track needs.','jouw track nodig heeft.'],['DamianMusic services','Damiønmusic diensten'],['Not sure which service name fits? Use the guided chooser, pick your goal, then select the package and extras you actually want.','Weet je niet welke dienst bij je past? Gebruik de keuzehulp, kies je doel en selecteer daarna het pakket en de extra’s die je echt nodig hebt.'],['Guided service builder','Persoonlijke keuzehulp'],['Tell us the result you want.','Vertel welk resultaat je wilt.'],['Choose your goal first. We’ll then show the matching service with package levels, delivery options and extras so you can build the order exactly the way you want it.','Kies eerst je doel. Daarna laten we de passende dienst zien met pakketten, leveropties en extra’s, zodat je jouw bestelling precies kunt samenstellen.'],['Choose by goal','Kies op basis van je doel'],['No confusing service names','Geen verwarrende dienstnamen'],['Pick your level','Kies je niveau'],['Compare package options','Vergelijk pakketopties'],['Add only what you need','Voeg alleen toe wat je nodig hebt'],['Optional extras stay optional','Extra opties blijven optioneel'],['Upfront total','Direct totaalprijs'],['See the exact price before checkout','Zie de exacte prijs vóór het afrekenen'],['All services','Alle diensten'],['Or browse everything.','Of bekijk alles.'],['If you already know what you need, choose a service below and configure its exact package and extras.','Weet je al wat je nodig hebt? Kies hieronder een dienst en stel het pakket en de extra’s precies samen.'],['After payment','Na betaling'],['One clear project journey.','Eén duidelijk projectproces.'],['Track the work without chasing updates across different apps.','Volg het werk zonder updates via verschillende apps te hoeven zoeken.'],['Your order room opens','Je bestelruimte wordt geopend'],['You get an order number, status and private tracking link after successful payment.','Na succesvolle betaling krijg je een bestelnummer, status en privé trackinglink.'],['In progress','In uitvoering'],['Ask questions and keep support connected to the exact project you purchased.','Stel vragen en houd support gekoppeld aan het project dat je hebt gekocht.'],['Delivered','Opgeleverd'],['Download + review','Download + beoordeling'],['When finished, your delivery link unlocks and you can leave a review.','Wanneer het project klaar is, wordt je downloadlink beschikbaar en kun je een beoordeling achterlaten.'],
    ['Simple prices.','Duidelijke prijzen.'],['No giant packages.','Geen enorme pakketten.'],['Start with the service you actually need. These are lower launch prices, with optional upgrades available only when they make sense for your project.','Begin met de dienst die je echt nodig hebt. Dit zijn lagere introductieprijzen, met optionele upgrades alleen wanneer die bij jouw project passen.'],['See every service','Bekijk alle diensten'],['Ask what fits my track','Vraag wat bij mijn track past'],['Popular choices','Populaire keuzes'],['Three easy starting points.','Drie eenvoudige startpunten.'],['More options','Meer opties'],['Need something smaller?','Iets kleiners nodig?'],['Configure a service','Stel een dienst samen'],
    ['Listen before you book.','Luister voordat je boekt.'],['Selected audio','Geselecteerde audio'],['A/B comparison','A/B-vergelijking'],['Before','Voor'],['After','Na'],['Play comparison','Vergelijking afspelen'],
    ['A clear project flow from order to delivery.','Een duidelijk proces van bestelling tot oplevering.'],['Know what happens at every stage, from choosing a package to receiving your final files.','Weet bij elke stap wat er gebeurt, van het kiezen van een pakket tot het ontvangen van je definitieve bestanden.'],['Choose your service','Kies je dienst'],['Select the service, package and optional extras that best fit your track.','Selecteer de dienst, het pakket en de optionele extra’s die het beste bij jouw track passen.'],['Send your brief','Stuur je briefing'],['Add the project name, references, goals and any notes that help define the direction.','Voeg de projectnaam, referenties, doelen en opmerkingen toe die helpen om de richting te bepalen.'],['Secure payment','Veilige betaling'],['Production and revisions','Productie en revisies'],['Final delivery','Definitieve oplevering'],['Receive the final files and formats included with the service you purchased.','Ontvang de definitieve bestanden en formaten die bij de gekozen dienst horen.'],['Choose a service','Kies een dienst'],
    ['Tell me what your track needs.','Vertel wat jouw track nodig heeft.'],['Send your genre, current stage, deadline, references and the service you are interested in. Messages are sent through the site.','Stuur je genre, huidige fase, deadline, referenties en de dienst waarin je geïnteresseerd bent. Berichten worden via de site verzonden.'],['Project inquiry','Projectaanvraag'],['Start with the details.','Begin met de details.'],['Tell me what you already have, what you want the result to sound like and what service you think you need. If you are unsure, I can help you choose before you pay.','Vertel wat je al hebt, hoe je wilt dat het eindresultaat klinkt en welke dienst je denkt nodig te hebben. Twijfel je? Dan kan ik je helpen kiezen voordat je betaalt.'],['Name','Naam'],['Email','E-mail'],['Subject','Onderwerp'],['Message','Bericht'],['Send project inquiry','Verstuur projectaanvraag'],
    ['Music production built around the artist.','Muziekproductie rondom de artiest.'],['Approach','Aanpak'],['Direction first.','Eerst de richting.'],['Clear scope','Duidelijke afspraken'],['Secure checkout','Veilig afrekenen'],['Project focused','Projectgericht'],
    ['Your cart','Je winkelwagen'],['Cart','Winkelwagen'],['Your cart is empty.','Je winkelwagen is leeg.'],['Total','Totaal'],['Continue to checkout','Ga naar afrekenen'],['Continue on Services','Ga verder bij Diensten'],['Remove','Verwijderen'],['Added to cart','Toegevoegd aan winkelwagen'],['Choose options','Kies opties'],['Order','Bestellen'],['Includes','Inbegrepen'],['Turnaround','Levertijd'],['from','vanaf'],
    ['Mastering','Mastering'],['Mixing','Mixing'],['Mix + Master','Mix + Master'],['Vocal Processing','Vocal Processing'],['Custom Beat','Custom Beat'],['Custom Instrumental','Custom Instrumental'],['Remix Production','Remixproductie'],['MIDI / Melody Creation','MIDI / melodie maken'],['Full Track Production','Volledige trackproductie'],['Beat Feedback','Beat feedback'],
    ['Final loudness, tone and polish for a finished stereo mix.','Definitieve luidheid, klank en polish voor een afgeronde stereomix.'],['A clean, balanced mix with stronger vocals, drums and overall impact.','Een strakke, gebalanceerde mix met sterkere vocals, drums en meer impact.'],['A complete finishing service from raw stems to the final release master.','Een complete afwerking van ruwe stems tot de definitieve release-master.'],['Cleanup, timing, tuning and modern effects for recorded vocals.','Opschoning, timing, tuning en moderne effecten voor opgenomen vocals.'],['An original beat built around your references, genre and vocal direction.','Een originele beat gebouwd rondom jouw referenties, genre en vocalrichting.'],['A complete instrumental written and produced around your song idea.','Een complete instrumental geschreven en geproduceerd rondom jouw songidee.'],['A fresh production direction built from your existing song or vocal.','Een frisse productierichting gebouwd vanuit je bestaande song of vocal.'],['Original melody or chord ideas delivered as editable MIDI for your project.','Originele melodie- of akkoordideeën geleverd als bewerkbare MIDI voor je project.'],['Turn a vocal, demo or idea into a complete song-ready production.','Verander een vocal, demo of idee in een complete songklare productie.'],['Clear, practical feedback on your beat before you spend money on a full service.','Duidelijke, praktische feedback op je beat voordat je geld uitgeeft aan een volledige dienst.'],
    ['Secure checkout','Veilig afrekenen'],['Finish your booking.','Rond je boeking af.'],['Tell us about your project, choose your preferred delivery format and pay securely.','Vertel ons over je project, kies je gewenste leverformaat en betaal veilig.'],['Protected payment','Beschermde betaling'],['Available methods are shown at checkout','Beschikbare betaalmethoden worden bij het afrekenen getoond'],['Your project','Jouw project'],['These details stay connected to your order room after payment.','Deze gegevens blijven na betaling gekoppeld aan je bestelruimte.'],['First name','Voornaam'],['Last name','Achternaam'],['Email address','E-mailadres'],['Artist name','Artiestennaam'],['Optional','Optioneel'],['Country','Land'],['Select your country','Selecteer je land'],['Project name','Projectnaam'],['Preferred delivery','Gewenste levering'],['Project notes','Projectnotities'],['Continue to payment','Ga door naar betaling'],['Payment','Betaling'],['Checking available payment methods…','Beschikbare betaalmethoden controleren…'],['Preparing secure payment…','Veilige betaling voorbereiden…'],['This usually takes a moment.','Dit duurt meestal maar even.'],['Dutch bank payment','Nederlandse bankbetaling'],['Pay with iDEAL','Betaal met iDEAL'],['or use PayPal / card','of gebruik PayPal / kaart'],['Edit project details','Projectgegevens aanpassen'],['Your order','Jouw bestelling'],['Order summary','Besteloverzicht'],['Edit','Aanpassen'],['Private order room','Privé bestelruimte'],['Track progress and message support after payment.','Volg de voortgang en stuur support een bericht na betaling.'],['Final delivery','Definitieve oplevering'],['Your completed files appear inside your order page.','Je voltooide bestanden verschijnen op je bestelpagina.'],['Booking confirmed','Boeking bevestigd'],["You're booked.",'Je boeking is rond.'],['Track your order','Volg je bestelling'],['Get support','Neem contact op'],
    ['Navigate','Navigatie'],['Legal','Juridisch'],['Terms','Voorwaarden'],['Privacy','Privacy'],['Refund Policy','Restitutiebeleid'],['Refund policy','Restitutiebeleid']
  ]);

  const originals=new WeakMap();
  const attrOriginals=new WeakMap();
  let lang=(localStorage.getItem('damion_lang')||'').toLowerCase();
  if(lang!=='nl'&&lang!=='en')lang=(navigator.language||'en').toLowerCase().startsWith('nl')?'nl':'en';

  const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
  const skip=node=>node.parentElement?.closest('script,style,noscript,svg,code,pre,[data-dm-no-translate]');

  const translateNode=node=>{
    if(!node||node.nodeType!==3||skip(node))return;
    if(!originals.has(node))originals.set(node,node.nodeValue||'');
    const original=originals.get(node)||'';
    if(lang==='en'){if(node.nodeValue!==original)node.nodeValue=original;return}
    const key=clean(original);if(!key)return;
    const translated=T.get(key);if(!translated)return;
    const lead=(original.match(/^\s*/)||[''])[0],trail=(original.match(/\s*$/)||[''])[0];
    node.nodeValue=lead+translated+trail;
  };

  const translateAttrs=el=>{
    if(!(el instanceof Element)||el.closest('[data-dm-no-translate]'))return;
    const attrs=['placeholder','aria-label','title'];
    let saved=attrOriginals.get(el);if(!saved){saved={};attrOriginals.set(el,saved)}
    attrs.forEach(name=>{
      if(!el.hasAttribute(name))return;
      if(!(name in saved))saved[name]=el.getAttribute(name)||'';
      const original=saved[name];
      if(lang==='en'){el.setAttribute(name,original);return}
      const translated=T.get(clean(original));if(translated)el.setAttribute(name,translated);
    });
  };

  const apply=(root=document)=>{
    if(root.nodeType===3){translateNode(root);return}
    const scope=root instanceof Element||root instanceof Document||root instanceof DocumentFragment?root:document;
    const walker=document.createTreeWalker(scope,NodeFilter.SHOW_TEXT);while(walker.nextNode())translateNode(walker.currentNode);
    if(scope instanceof Element)translateAttrs(scope);
    scope.querySelectorAll?.('[placeholder],[aria-label],[title]').forEach(translateAttrs);
    document.documentElement.lang=lang==='nl'?'nl':'en';
    document.body?.setAttribute('data-language',lang);
    updateSwitcher();
  };

  const ensureSwitcher=()=>document.querySelectorAll('.dm-lang-switch').forEach(el=>el.remove());

  const updateSwitcher=()=>document.querySelectorAll('.dm-lang-switch').forEach(el=>el.remove());
  const setLang=next=>{if(next!=='en'&&next!=='nl')return;lang=next;localStorage.setItem('damion_lang',lang);apply(document);document.dispatchEvent(new CustomEvent('dm:languagechange',{detail:{lang}}))};
  window.dmSetLanguage=setLang;
  window.dmGetLanguage=()=>lang;

  const start=()=>{ensureSwitcher();apply(document)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();

  const observer=new MutationObserver(records=>{
    for(const record of records)for(const node of record.addedNodes){if(node.nodeType===1||node.nodeType===3)apply(node)}
    ensureSwitcher();
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('dm:pagechange',()=>requestAnimationFrame(()=>{ensureSwitcher();apply(document)}));
})();
