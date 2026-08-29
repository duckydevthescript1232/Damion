(()=>{
  if(typeof SERVICES==='undefined'||!Array.isArray(SERVICES))return;

  const updates={
    'beat-feedback':{
      from:2.99,
      turnaround:'Within 24 hours',
      included:['Written feedback','Arrangement pointers','3 priority fixes'],
      packages:[['Quick Feedback',2.99,'A short, focused review with the three biggest improvements to make first.'],['Full Beat Review',5.99,'More detailed feedback on mix, arrangement, sound choice and overall direction.']]
    },
    mastering:{
      from:7.99,
      included:['WAV master','MP3 master','Streaming-ready level'],
      packages:[['Release Master',7.99,'One polished stereo master ready for release.'],['Master + Alternate',11.99,'Main master plus one alternate loudness version for extra flexibility.']]
    },
    midi:{
      from:6.99,
      included:['Editable MIDI','Key information','1 revision'],
      packages:[['Melody Idea',6.99,'One original melody delivered as editable MIDI.'],['Melody + Chords',11.99,'Original melody plus a matching chord progression as MIDI.'],['Idea Pack',16.99,'Three different melody/chord ideas so you can choose your favorite direction.']]
    },
    mixing:{
      from:11.99,
      included:['Level + EQ balance','Compression + space','1 revision'],
      packages:[['Starter Mix',11.99,'Up to 12 stems with clean balancing, EQ, compression and space.'],['Artist Mix',19.99,'Up to 30 stems with deeper vocal, drum and FX work.'],['Detailed Mix',27.99,'Up to 50 stems, more detailed automation and two revisions.']]
    },
    vocal:{
      from:9.99,
      included:['Cleanup','Tuning','Vocal FX chain'],
      packages:[['Lead Vocal',9.99,'Cleanup, tuning and processing for one main vocal.'],['Full Vocal Stack',17.99,'Lead, doubles and supporting vocal layers processed together.'],['Vocal Production',24.99,'Full vocal stack plus extra creative FX, transitions and two revisions.']]
    },
    'custom-beat':{
      from:22.99,
      included:['Original production','Full arrangement','WAV export'],
      packages:[['Custom Beat',22.99,'Original beat with a complete song-ready arrangement.'],['Artist Beat',32.99,'More detailed production with grouped stems included.'],['Full Beat Package',44.99,'Detailed production, stems, WAV/MP3 exports and two revisions.']]
    },
    'mix-master':{
      from:24.99,
      included:['Full mix','Final master','WAV + MP3'],
      packages:[['Mix + Master',24.99,'Up to 25 stems, one revision and the final release master.'],['Artist Mix + Master',34.99,'Up to 45 stems, deeper detail and two revisions.'],['Full Mix + Master',44.99,'Up to 60 stems, detailed automation, two revisions and alternate master.']]
    },
    instrumental:{
      from:29.99,
      included:['Original composition','Arrangement','WAV export'],
      packages:[['Custom Instrumental',29.99,'Original instrumental with a complete arrangement.'],['Instrumental + Stems',39.99,'Full arrangement plus grouped stems for later mixing.'],['Full Instrumental Pack',49.99,'Detailed arrangement, stems, alternate version and two revisions.']]
    },
    remix:{
      from:29.99,
      included:['New arrangement','New production','WAV export'],
      packages:[['Remix',29.99,'A complete new direction built from your existing song or vocal.'],['Extended Remix',39.99,'More detailed production with an extended arrangement.'],['Remix + Stems',49.99,'Full remix, extended version, grouped stems and two revisions.']]
    },
    'full-production':{
      from:39.99,
      included:['Production','Arrangement','Mix-ready export'],
      packages:[['Starter Production',39.99,'Turn your vocal, demo or idea into a complete arranged production.'],['Artist Production',59.99,'Detailed production with stems, creative transitions and two revisions.'],['Complete Song Package',79.99,'Full production, detailed arrangement, stems, project delivery options and three revisions.']]
    }
  };

  for(const service of SERVICES){
    const next=updates[service.id];
    if(next)Object.assign(service,next);
  }

  if(typeof ADDONS!=='undefined'&&Array.isArray(ADDONS)){
    ADDONS.splice(0,ADDONS.length,
      ['Priority delivery',5.99],
      ['Additional revision',3.99],
      ['Extra vocal tuning',4.99],
      ['Instrumental export',2.99],
      ['Acapella export',2.99],
      ['Radio edit',3.99],
      ['Project stems',4.99],
      ['Project file',5.99]
    );
  }

  try{if(typeof renderServiceRows==='function')renderServiceRows('serviceList')}catch(_){}
  try{if(typeof renderPricing==='function')renderPricing()}catch(_){}
  try{if(typeof renderCart==='function')renderCart()}catch(_){}
})();
