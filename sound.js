/* Original soundscapes, adaptive score and recorded narration. Everything plays from files inside this folder; no sound service is called while playing. */
window.QuestSound=(()=>{
 const root='assets/audio/';
 let ready=false,enabled=true,musicOn=true,voiceOn=true,sfxOn=true,ambOn=true,mv=.3,vv=.95,sv=.55,av=.5,talking=false,voice=null,voiceId='',paused=false,serial=0;
 let loc='bc',rain=false,actionKind='',target=0,level=0,tension=0,spotTimer=0,mixTimer=0,lastSpot='',lastSpotAt=0;
 const mk=(loop=true)=>{const a=new Audio();a.loop=loop;a.preload='none';return a};
 const score=mk(),amb=mk(),rainBed=mk(),layers=[mk(),mk(),mk()];
 let effects=new Set();
 const SPOTS={
  bc:['gull','chirp','boat-horn','eagle','frog','gull'],kyoto:['chirp','bike-bell','temple-bell','chime','frog','chirp'],
  rome:['church-bell','scooter','car-horn','bike-bell','chirp','tram-bell'],cairo:['car-horn','camel-bell','ferry-horn','chirp','camel-bell'],
  cusco:['panpipe','llama','chirp','eagle','llama','thunder'],sydney:['kookaburra','cockatoo','ferry-horn','gull','kookaburra','boat-horn']};
 /* Three story-card cues for every story. Each cue is a sound a visitor might notice in that scene. */
 const CUES={'0-0':['gull','boat-horn','chirp'],'0-1':['chirp','gull','frog'],'0-2':['frog','chirp','eagle'],
  '1-0':['chime','chirp','bike-bell'],'1-1':['bike-bell','chime','temple-bell'],'1-2':['chirp','temple-bell','frog'],
  '2-0':['church-bell','scooter','chirp'],'2-1':['car-horn','bike-bell','church-bell'],'2-2':['chirp','scooter','tram-bell'],
  '3-0':['ferry-horn','camel-bell','car-horn'],'3-1':['camel-bell','chirp','car-horn'],'3-2':['chirp','camel-bell','ferry-horn'],
  '4-0':['panpipe','llama','eagle'],'4-1':['llama','chirp','panpipe'],'4-2':['chirp','eagle','llama'],
  '5-0':['ferry-horn','gull','cockatoo'],'5-1':['kookaburra','chirp','cockatoo'],'5-2':['gull','kookaburra','ferry-horn']};
 const RAIN={'0-2':1,'1-1':1,'4-2':1};
 const ease=(x,a,b)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)};
 const duck=()=>talking?1:0;
 function mix(){
  const on=ready&&enabled&&!document.hidden;
  const dk=talking?.28:1,adk=talking?.35:1,low=actionKind?.45:1;
  const m=on&&musicOn?mv:0;
  score.volume=actionKind?0:Math.min(1,m*.9*dk);
  const base=m*dk*(actionKind==='battle'?1.1:1);
  layers[0].volume=on&&actionKind?Math.min(1,base*(.55+.2*level)):0;
  layers[1].volume=on&&actionKind?Math.min(1,base*ease(level,.22,.55)*.9):0;
  layers[2].volume=on&&actionKind?Math.min(1,base*ease(level,.55,.88)):0;
  const ar=on&&ambOn?av:0;
  amb.volume=Math.min(1,ar*adk*low*(actionKind?.55:1));
  rainBed.volume=rain?Math.min(1,ar*adk*.9):0;
  const rate=actionKind?.94+.2*level:1;
  layers.forEach(l=>{if(Math.abs(l.playbackRate-rate)>.004)l.playbackRate=rate});
  if(voice)voice.volume=enabled&&voiceOn?vv:0;
 }
 function play(a){if(a.src&&a.paused)a.play().catch(()=>{})}
 function src(a,name){const u=root+name+'.mp3';if(!a.src.endsWith(u)){a.src=u;}}
 function sync(){
  mix();const on=ready&&enabled&&!document.hidden;
  if(!on){[score,amb,rainBed,...layers].forEach(a=>a.pause());clearTimeout(spotTimer);return}
  if(actionKind){score.pause();layers.forEach((l,i)=>{src(l,'score-'+actionKind+'-'+i);if(l.paused){if(i&&layers[0].currentTime)l.currentTime=layers[0].currentTime;play(l)}})}
  else{layers.forEach(l=>l.pause());if(musicOn){src(score,'score-'+loc);play(score)}else score.pause()}
  if(ambOn){src(amb,'amb-'+loc);play(amb)}else amb.pause();
  if(rain&&ambOn){src(rainBed,'amb-rain');play(rainBed)}else rainBed.pause();
  scheduleSpot();
 }
 function align(){if(!actionKind)return;const t=layers[0].currentTime;layers.slice(1).forEach(l=>{if(!l.paused&&Math.abs(l.currentTime-t)>.09)l.currentTime=t})}
 function tick(){level+=(target-level)*.16;if(Math.abs(target-level)<.003)level=target;tension=level;mix();align()}
 function setScene(id,opts={}){if(!SPOTS[id])id='bc';const changed=id!==loc||rain!==!!opts.rain;loc=id;rain=!!opts.rain;if(changed&&ready)sync()}
 function spot(name,vol=1){
  if(!ready||!enabled||!ambOn||document.hidden||!name)return;const a=new Audio(root+'spot-'+name+'.mp3');a.volume=Math.min(1,av*vol*(talking?.45:1)*1.35);effects.add(a);a.onended=a.onerror=()=>effects.delete(a);a.play().catch(()=>effects.delete(a));lastSpot=name;lastSpotAt=Date.now();
 }
 function scheduleSpot(){clearTimeout(spotTimer);if(!ready||!enabled||!ambOn||document.hidden)return;spotTimer=setTimeout(()=>{const l=SPOTS[loc]||SPOTS.bc;let n=l[Math.floor(Math.random()*l.length)];if(n===lastSpot)n=l[(l.indexOf(n)+1)%l.length];if(!talking&&!actionKind)spot(n,.9);else if(!talking&&actionKind&&Math.random()<.25)spot(n,.5);scheduleSpot()},9000+Math.random()*13000)}
 function cue(lv,n,page){const list=CUES[lv+'-'+n];if(!list)return;setScene(['bc','kyoto','rome','cairo','cusco','sydney'][lv]||'bc',{rain:!!RAIN[lv+'-'+n]&&page>=1});setTimeout(()=>spot(list[Math.max(0,Math.min(2,page))],1),500)}
 function theme(name='trail'){if(name==='trail')endAction();}
 function action(kind='dash',start=.18){if(!['dash','battle'].includes(kind))return;actionKind=kind;target=level=start;layers.forEach(l=>{l.currentTime=0});sync();clearInterval(mixTimer);mixTimer=setInterval(tick,100)}
 function endAction(){if(!actionKind&&!mixTimer)return;actionKind='';target=level=0;clearInterval(mixTimer);mixTimer=0;layers.forEach(l=>l.pause());sync()}
 function intensity(x){target=Math.max(0,Math.min(1,x))}
 function boot(){ready=true;sync()}
 function configure(o){if(o.enabled!==undefined)enabled=o.enabled;if(o.music!==undefined)musicOn=o.music;if(o.voice!==undefined)voiceOn=o.voice;if(o.sfx!==undefined)sfxOn=o.sfx;if(o.ambient!==undefined)ambOn=o.ambient;if(o.musicVolume!==undefined)mv=o.musicVolume;if(o.voiceVolume!==undefined)vv=o.voiceVolume;if(o.sfxVolume!==undefined)sv=o.sfxVolume;if(o.ambVolume!==undefined)av=o.ambVolume;if(!enabled||!voiceOn)stop();if(!enabled||!sfxOn){effects.forEach(a=>a.pause());effects.clear()}sync()}
 function ev(p){document.dispatchEvent(new CustomEvent('questvoice',{detail:p}))}
 function stop(){serial++;if(voice){voice.pause();voice.removeAttribute('src');voice.load();voice=null}voiceId='';talking=false;paused=false;mix();ev({playing:false})}
 function narrate(id,options={}){stop();if(!ready||!enabled||!voiceOn||document.hidden)return false;const token=serial;voice=new Audio(root+id+'.mp3');const a=voice;voiceId=id;a.volume=vv;a.preload='auto';talking=true;mix();ev({playing:true,id});a.ontimeupdate=()=>{if(token===serial)options.progress?.(a.duration?a.currentTime/a.duration:0)};
  const fin=cb=>()=>{if(token!==serial)return;voice=null;voiceId='';talking=false;mix();ev({playing:false});cb?.()};
  a.onended=fin(options.end);a.onerror=fin(options.error);
  a.play().catch(()=>{if(token!==serial)return;talking=false;mix();ev({playing:false});options.error?.()});return true}
 function pauseVoice(){if(!voice)return;paused=!paused;if(paused){voice.pause();talking=false}else{voice.play().catch(()=>{});talking=true}mix();return paused}
 function sfx(name,vol=1){if(!ready||!enabled||!sfxOn||document.hidden)return;const a=new Audio(root+'sfx-'+name+'.mp3');a.volume=Math.min(1,sv*vol);effects.add(a);a.onended=a.onerror=()=>effects.delete(a);a.play().catch(()=>effects.delete(a));if(effects.size>10){const old=effects.values().next().value;old.pause();effects.delete(old)}}
 /* Win sounds grow with the achievement. Tier 1 is a collect, 2 a key or word, 3 a level, 4 a badge or pet. */
 function celebrate(tier=2){sfx(tier>=3?'victory':'key',.9);if(tier>=2)setTimeout(()=>sfx('celebrate',tier>=4?1:.8),tier>=3?260:420);if(tier>=4)setTimeout(()=>sfx('victory',.7),1400);if(actionKind){target=Math.min(1,level+.1)}}
 function speak(text,o={}){stop();if(!ready||!enabled||!voiceOn||document.hidden||!('speechSynthesis' in window)){o.error?.();return false}try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.rate=o.rate||.9;u.volume=vv;u.onend=()=>{talking=false;mix();o.end?.()};u.onerror=()=>{talking=false;mix();o.error?.()};talking=true;mix();speechSynthesis.speak(u);return true}catch{o.error?.();return false}}
 function suspend(){[score,amb,rainBed,...layers].forEach(a=>a.pause());clearTimeout(spotTimer);stop();try{speechSynthesis.cancel()}catch{}effects.forEach(a=>a.pause());effects.clear()}
 document.addEventListener('visibilitychange',()=>{if(document.hidden)suspend();else if(ready)sync()});
 return {boot,configure,theme,scene:setScene,cue,spot,action,endAction,intensity,celebrate,narrate,speak,stop,pauseVoice,sfx,suspend,
  state:()=>({ready,enabled,music:musicOn,voice:voiceOn,sfx:sfxOn,ambient:ambOn,talking,paused,voiceId,scene:loc,rain,action:actionKind,level:+level.toFixed(2),rate:layers[0].playbackRate,musicVolume:score.volume,ambVolume:amb.volume,layerVolumes:layers.map(l=>+l.volume.toFixed(3)),voicePlaying:!!voice&&!voice.paused,musicPlaying:!score.paused,ambPlaying:!amb.paused,layersPlaying:layers.filter(l=>!l.paused).length,lastSpot,track:actionKind||loc})};
})();
