(()=>{
  if(window.__dmLanguageExtraV2)return;window.__dmLanguageExtraV2=true;

  const EXACT=new Map([
    ['From idea to finished record.','Van idee naar een afgewerkte track.'],
    ['Independent music producer · direct support','Onafhankelijke muziekproducer · directe support'],
    ['Your song deserves to sound finished.','Jouw nummer verdient een professionele afwerking.'],
    ['Send me your vocals, stems, demo or song idea. I work personally on mixing, mastering, custom beats, remixes and full productions.','Stuur me je vocals, stems, demo of songidee. Ik werk persoonlijk aan mixing, mastering, custom beats, remixes en volledige producties.'],
    ['Listen to my work','Luister naar mijn werk'],
    ['Listen before you order','Luister voordat je bestelt'],
    ['Play the official preview below before you choose a service.','Speel hieronder de officiële preview af voordat je een dienst kiest.'],
    ['Cinematic Damiønmusic trailer — press play to watch with sound.','Cinematische Damiønmusic-trailer — druk op afspelen om met geluid te kijken.'],
    ['Independent music production with clear services and real audio previews.','Onafhankelijke muziekproductie met duidelijke diensten en echte audiopreviews.'],
    ['Explore','Ontdek'],['Help','Hulp'],['Saved','Opgeslagen'],
    ['Continue to order','Ga door naar bestellen'],['Choose','Kiezen'],['Add to cart','Toevoegen aan winkelwagen'],['Add a service first','Voeg eerst een dienst toe'],

    ['Damiønmusic services','Damiønmusic diensten'],
    ['Pick a service.','Kies een dienst.'],['See the price clearly.','Zie direct de prijs.'],
    ['Choose the service that matches your project, compare the package options and add only the extras you actually want. If you are unsure, ask me before ordering.','Kies de dienst die bij je project past, vergelijk de pakketten en voeg alleen extra’s toe die je echt wilt. Twijfel je? Vraag het me dan voordat je bestelt.'],
    ['Browse services','Bekijk diensten'],['Lower starting prices.','Lagere vanafprijzen.'],
    ['I simplified the options so there is a cheaper entry point for smaller projects, while the higher packages still include more stems, revisions or delivery options.','Ik heb de opties eenvoudiger gemaakt zodat kleinere projecten goedkoper kunnen starten, terwijl grotere pakketten nog steeds meer stems, revisies of leveropties bevatten.'],
    ['Choose what fits your project.','Kies wat bij jouw project past.'],
    ['Every service shows a starting price. Click Choose to compare the available packages and optional extras before anything is added to your cart.','Elke dienst toont een vanafprijs. Klik op Kiezen om de beschikbare pakketten en optionele extra’s te vergelijken voordat er iets aan je winkelwagen wordt toegevoegd.'],
    ['Starting price','Vanafprijs'],['The cheapest package for that service.','Het goedkoopste pakket voor die dienst.'],
    ['Higher packages','Uitgebreidere pakketten'],['Useful when you need more stems, revisions or a more detailed production.','Handig wanneer je meer stems, revisies of een uitgebreidere productie nodig hebt.'],
    ['Not sure?','Twijfel je?'],['Use Support and explain what you have. You do not need to know technical production terms.','Gebruik Support en leg uit wat je al hebt. Je hoeft geen technische productietermen te kennen.'],
    ['After ordering','Na het bestellen'],['Your project stays organized.','Je project blijft overzichtelijk.'],
    ['Your order request stays connected to one private project room instead of being scattered across different apps.','Je bestelling blijft gekoppeld aan één privé projectruimte in plaats van verspreid te raken over verschillende apps.'],
    ['01 · Saved','01 · Opgeslagen'],['02 · Pending payment','02 · Wacht op betaling'],['03 · Project','03 · Project'],
    ['You get an order number, status and private tracking link after submitting the order request.','Na het versturen van je bestelling krijg je een bestelnummer, status en privé trackinglink.'],
    ['Payment comes later','Betaling volgt later'],['The project stays pending until a payment method is connected and payment is confirmed.','Het project blijft wachten op betaling totdat iDEAL is gekoppeld en de betaling is bevestigd.'],
    ['Your project details and messages stay connected to the exact service you selected.','Je projectgegevens en berichten blijven gekoppeld aan de dienst die je hebt gekozen.'],
    ['Package options','Pakketopties'],['1. Choose package','1. Kies pakket'],['2. Optional extras','2. Optionele extra’s'],

    ['My work','Mijn werk'],['Listen before you book.','Luister voordat je bestelt.'],
    ['This is the real audio preview currently available on the site. No fake A/B comparison, no made-up client examples — just one clean place to hear the sound before choosing a service.','Dit is de echte audiopreview die nu op de site staat. Geen neppe A/B-vergelijking en geen verzonnen klantvoorbeelden — gewoon één duidelijke plek om de sound te horen voordat je een dienst kiest.'],
    ['Damiønmusic · production preview','Damiønmusic · productiepreview'],['Hear the sound behind the services.','Hoor de sound achter de diensten.'],
    ['Use the player below to hear the current Damiønmusic preview. This is a better way to judge the style than a wall of marketing text.','Gebruik de speler hieronder om de huidige Damiønmusic-preview te horen. Zo kun je de stijl beter beoordelen dan met alleen marketingtekst.'],
    ['What this shows','Wat dit laat horen'],['A real example, kept simple.','Een echt voorbeeld, simpel gehouden.'],
    ['The preview gives you a feel for the production direction and overall finish before you spend anything.','De preview geeft je een indruk van de productierichting en afwerking voordat je iets uitgeeft.'],
    ['Modern production and arrangement','Moderne productie en arrangement'],['Clean, polished overall balance','Strakke, gepolijste balans'],['Direct work with one producer','Direct samenwerken met één producer'],['Useful starting point before choosing a service','Handig startpunt voordat je een dienst kiest'],
    ['More real work can be added later.','Later kan er meer echt werk worden toegevoegd.'],['When there are client-approved releases or real before/after files, they can be added here without pretending examples already exist.','Wanneer er door klanten goedgekeurde releases of echte voor/na-bestanden zijn, kunnen die hier worden toegevoegd zonder voorbeelden te verzinnen.'],

    ['Direct support','Directe support'],['Just ask something.','Stel gewoon je vraag.'],
    ['You do not need to choose a category or fill in a long support form. Open the chat, type your question, add your name and email once, and send it. When I reply, the answer appears in the same chat.','Je hoeft geen categorie te kiezen of een lang supportformulier in te vullen. Open de chat, typ je vraag, vul één keer je naam en e-mail in en verstuur hem. Wanneer ik antwoord, verschijnt dat in dezelfde chat.'],
    ['Ask something','Stel een vraag'],['View services','Bekijk diensten'],['Private conversation','Privégesprek'],['Replies stay in your chat','Antwoorden blijven in je chat'],['Email reply notification','Melding per e-mail bij antwoord'],
    ['Open support chat','Supportchat openen'],['Damiønmusic chat','Damiønmusic chat'],['Ask Damiønmusic','Vraag Damiønmusic'],['Ask anything about your music or an order. I can reply here.','Vraag alles over je muziek of een bestelling. Ik kan hier antwoorden.'],['Close chat','Chat sluiten'],
    ['What can I help with?','Waar kan ik mee helpen?'],['Write your question below. No complicated support form.','Schrijf hieronder je vraag. Geen ingewikkeld supportformulier.'],['Your question','Jouw vraag'],['Ask something...','Stel je vraag...'],['Send question','Vraag versturen'],['Your chat stays on this browser. When Damiønmusic replies, it appears here.','Je chat blijft in deze browser staan. Wanneer Damiønmusic antwoordt, verschijnt het hier.'],
    ['Sending…','Versturen…'],['Could not send your question.','Je vraag kon niet worden verstuurd.'],['Support chat','Supportchat'],['Damiønmusic replied','Damiønmusic heeft geantwoord'],['Closed','Gesloten'],['Waiting for reply','Wachten op antwoord'],['New chat','Nieuwe chat'],['You','Jij'],['No messages yet.','Nog geen berichten.'],['Write a message...','Schrijf een bericht...'],['Send','Versturen'],['Start a new support chat?','Een nieuwe supportchat starten?'],['Could not send.','Kon niet versturen.'],['Could not connect to support.','Kon geen verbinding maken met support.'],

    ['Order request','Bestelling'],['Finish your booking.','Rond je bestelling af.'],['Tell me about your project and save the order. Payment is not taken yet.','Vertel me over je project en sla de bestelling op. Er wordt nog geen betaling afgeschreven.'],['No payment today','Nog geen betaling'],['iDEAL checkout will be added separately','iDEAL wordt als betaalmethode gekoppeld'],
    ['Choose a music service first, then come back here to complete your order.','Kies eerst een muziekdienst en kom daarna hier terug om je bestelling af te ronden.'],
    ['These details will be saved to your private order room.','Deze gegevens worden opgeslagen in je privé bestelruimte.'],['Audio files — WAV / MP3 / stems','Audiobestanden — WAV / MP3 / stems'],['FL Studio project + audio','FL Studio-project + audio'],['Not sure — discuss in order chat','Niet zeker — bespreek het in de bestelchat'],
    ['What sound are you going for? Add references, deadlines or anything important.','Welke sound zoek je? Voeg referenties, deadlines of andere belangrijke informatie toe.'],['Payment status: Pending','Betaalstatus: Wacht op betaling'],['This creates your order request only. No money is charged.','Hiermee maak je alleen je bestelling aan. Er wordt geen geld afgeschreven.'],['Place order request','Bestelling plaatsen'],['Quoted total','Totaalbedrag'],['Your project details and messages stay together.','Je projectgegevens en berichten blijven bij elkaar.'],['No payment provider is loaded on this page.','Op deze pagina wordt geen betaalprovider geladen.'],
    ['Order request saved','Bestelling opgeslagen'],['Your project is in the system.','Je project staat in het systeem.'],['Your order request was saved. No payment was taken.','Je bestelling is opgeslagen. Er is nog geen betaling afgeschreven.'],['Open your order room','Open je bestelruimte'],['Status stays Pending payment until a payment method is connected and payment is confirmed.','De status blijft Wacht op betaling totdat iDEAL is gekoppeld en de betaling is bevestigd.'],

    ['Customer order room','Bestelruimte klant'],['Track your project.','Volg je project.'],['See your current status, send messages to the studio, download completed files and leave a review after delivery.','Bekijk je huidige status, stuur berichten naar de studio, download voltooide bestanden en laat na oplevering een beoordeling achter.'],['Paste your private order access code','Plak je privé toegangscode voor de bestelling'],['Open order','Bestelling openen'],['Open your order','Open je bestelling'],['Use the private link you received after checkout, or paste the access code above.','Gebruik de privélink die je na het bestellen kreeg, of plak hierboven de toegangscode.'],['Project review','Projectcontrole'],['Files and notes are being checked.','Bestanden en notities worden gecontroleerd.'],['In production','In productie'],['Your service is actively being worked on.','Er wordt actief aan je dienst gewerkt.'],['Final checks','Laatste controle'],['Quality control and exports.','Kwaliteitscontrole en exports.'],['Completed','Voltooid'],['Your delivery is ready.','Je oplevering staat klaar.'],['Delivery format','Leverformaat'],['Final delivery','Definitieve oplevering'],['Your download unlocks when the order is completed.','Je download wordt beschikbaar zodra de bestelling is voltooid.'],['Order-linked chat','Chat gekoppeld aan bestelling'],['Write a message about this order…','Schrijf een bericht over deze bestelling…'],['Order details','Bestelgegevens'],['Customer','Klant'],['Ordered','Besteld'],['Payment reference','Betaalreferentie'],['After delivery','Na oplevering'],['Leave a review','Laat een beoordeling achter'],['Reviews unlock when the order is completed.','Beoordelingen worden beschikbaar wanneer de bestelling is voltooid.'],['How was your experience?','Hoe was je ervaring?'],['Submit review','Beoordeling versturen'],

    ['About','Over'],['Music production built around the artist.','Muziekproductie rondom de artiest.'],['Damiøn combines a modern production workflow with clear communication, transparent packages and a focus on making every track feel finished rather than over-processed.','Damiøn combineert een moderne productieworkflow met duidelijke communicatie, transparante pakketten en een focus op een afgewerkte track zonder hem te overprocessen.'],['References, genre, emotion and the role of each element come before technical processing. The goal is a result that supports the song and the artist’s identity.','Referenties, genre, emotie en de rol van elk element komen vóór technische verwerking. Het doel is een resultaat dat het nummer en de identiteit van de artiest ondersteunt.'],['Projects can cover anything from a focused master or vocal cleanup to a complete custom production.','Projecten kunnen variëren van een gerichte master of vocal cleanup tot een volledige custom productie.'],['Packages and optional extras make the price and deliverables understandable before checkout.','Pakketten en optionele extra’s maken de prijs en oplevering vooraf duidelijk.'],['Project focused','Projectgericht'],

    ['Questions before you book?','Vragen voordat je bestelt?'],['Quick answers about payments, files, revisions and project delivery.','Snelle antwoorden over betalingen, bestanden, revisies en oplevering.'],['How do I place an order?','Hoe plaats ik een bestelling?'],['What files should I send?','Welke bestanden moet ik sturen?'],['How do revisions work?','Hoe werken revisies?'],['How long does delivery take?','Hoe lang duurt de oplevering?'],['Are payments secure?','Zijn betalingen veilig?'],['What happens after payment?','Wat gebeurt er na betaling?'],['Can I ask which package fits my song?','Kan ik vragen welk pakket bij mijn nummer past?'],

    ['Tell me about your project, genre, current stage, references, deadline and what you want help with.','Vertel me over je project, genre, huidige fase, referenties, deadline en waar je hulp bij wilt.'],['Website','Website'],['Send message','Bericht versturen'],['Message sent successfully.','Bericht succesvol verstuurd.'],['Message sent','Bericht verstuurd'],['Could not send your message.','Je bericht kon niet worden verstuurd.'],

    ['Process','Werkwijze'],['A clear project flow from order to delivery.','Een duidelijk proces van bestelling tot oplevering.'],['Know what happens at every stage, from choosing a package to receiving your final files.','Weet wat er bij elke stap gebeurt, van het kiezen van een pakket tot het ontvangen van je definitieve bestanden.'],['Choose your service','Kies je dienst'],['Select the service, package and optional extras that best fit your track.','Selecteer de dienst, het pakket en de optionele extra’s die het beste bij jouw track passen.'],['Send your brief','Stuur je briefing'],['Add the project name, references, goals and any notes that help define the direction.','Voeg de projectnaam, referenties, doelen en notities toe die helpen de richting te bepalen.'],['Production and revisions','Productie en revisies'],['The work is completed according to the selected package, with included revisions used for focused changes.','Het werk wordt uitgevoerd volgens het gekozen pakket, waarbij inbegrepen revisies worden gebruikt voor gerichte wijzigingen.'],['Receive the final files and formats included with the service you purchased.','Ontvang de definitieve bestanden en formaten die bij je gekozen dienst horen.'],

    ['Within 24 hours','Binnen 24 uur'],['Written feedback','Geschreven feedback'],['Arrangement pointers','Tips voor arrangement'],['3 priority fixes','3 belangrijkste verbeterpunten'],['Quick Feedback','Snelle feedback'],['Full Beat Review','Volledige beat-review'],['Release Master','Release-master'],['Master + Alternate','Master + alternatieve versie'],['Editable MIDI','Bewerkbare MIDI'],['Key information','Toonsoortinformatie'],['1 revision','1 revisie'],['Melody Idea','Melodie-idee'],['Melody + Chords','Melodie + akkoorden'],['Idea Pack','Ideepakket'],['Level + EQ balance','Niveau + EQ-balans'],['Compression + space','Compressie + ruimte'],['Starter Mix','Starter mix'],['Artist Mix','Artist mix'],['Detailed Mix','Uitgebreide mix'],['Cleanup','Opschoning'],['Tuning','Tuning'],['Vocal FX chain','Vocal FX-keten'],['Lead Vocal','Lead vocal'],['Full Vocal Stack','Volledige vocal stack'],['Vocal Production','Vocalproductie'],['Original production','Originele productie'],['Full arrangement','Volledig arrangement'],['WAV export','WAV-export'],['Artist Beat','Artist beat'],['Full Beat Package','Volledig beatpakket'],['Full mix','Volledige mix'],['Final master','Definitieve master'],['Artist Mix + Master','Artist mix + master'],['Full Mix + Master','Volledige mix + master'],['Original composition','Originele compositie'],['Arrangement','Arrangement'],['Instrumental + Stems','Instrumental + stems'],['Full Instrumental Pack','Volledig instrumental-pakket'],['New arrangement','Nieuw arrangement'],['New production','Nieuwe productie'],['Extended Remix','Extended remix'],['Remix + Stems','Remix + stems'],['Production','Productie'],['Mix-ready export','Mixklare export'],['Starter Production','Starter productie'],['Artist Production','Artist productie'],['Complete Song Package','Compleet songpakket'],
    ['Priority delivery','Snellere levering'],['Additional revision','Extra revisie'],['Extra vocal tuning','Extra vocal tuning'],['Instrumental export','Instrumental-export'],['Acapella export','Acapella-export'],['Radio edit','Radio-edit'],['Project stems','Projectstems'],['Project file','Projectbestand']
  ]);

  const PARTS=[...EXACT.entries()]
    .filter(([en])=>en.length>=4)
    .sort((a,b)=>b[0].length-a[0].length);
  const originals=new WeakMap();
  const attrOriginals=new WeakMap();
  const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
  const currentLang=()=>typeof window.dmGetLanguage==='function'?window.dmGetLanguage():(localStorage.getItem('damion_lang')||'en');
  const skip=node=>node.parentElement?.closest('script,style,noscript,svg,code,pre,[data-dm-no-translate]');

  function translateString(value){
    const key=clean(value);if(!key)return value;
    if(EXACT.has(key))return EXACT.get(key);
    let out=key,changed=false;
    for(const [en,nl] of PARTS){if(out.includes(en)){out=out.split(en).join(nl);changed=true}}
    return changed?out:value;
  }
  function nodeApply(node){
    if(!node||node.nodeType!==3||skip(node))return;
    if(!originals.has(node))originals.set(node,node.nodeValue||'');
    const original=originals.get(node)||'';
    if(currentLang()!=='nl'){if(node.nodeValue!==original)node.nodeValue=original;return}
    const translated=translateString(original);if(translated===original)return;
    const lead=(original.match(/^\s*/)||[''])[0],trail=(original.match(/\s*$/)||[''])[0];
    node.nodeValue=lead+translated.trim()+trail;
  }
  function attrApply(el){
    if(!(el instanceof Element)||el.closest('[data-dm-no-translate]'))return;
    let saved=attrOriginals.get(el);if(!saved){saved={};attrOriginals.set(el,saved)}
    for(const name of ['placeholder','aria-label','title']){
      if(!el.hasAttribute(name))continue;
      if(!(name in saved))saved[name]=el.getAttribute(name)||'';
      const original=saved[name];el.setAttribute(name,currentLang()==='nl'?translateString(original):original);
    }
  }
  function apply(root=document){
    if(root.nodeType===3){nodeApply(root);return}
    const scope=root instanceof Element||root instanceof Document||root instanceof DocumentFragment?root:document;
    const walker=document.createTreeWalker(scope,NodeFilter.SHOW_TEXT);while(walker.nextNode())nodeApply(walker.currentNode);
    if(scope instanceof Element)attrApply(scope);
    scope.querySelectorAll?.('[placeholder],[aria-label],[title]').forEach(attrApply);
  }
  const start=()=>apply(document);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  new MutationObserver(records=>{for(const r of records)for(const n of r.addedNodes)if(n.nodeType===1||n.nodeType===3)apply(n)}).observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('dm:languagechange',()=>requestAnimationFrame(()=>apply(document)));
  document.addEventListener('dm:pagechange',()=>requestAnimationFrame(()=>apply(document)));
})();
