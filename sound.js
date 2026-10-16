/* Original game score, effects and recorded narration. No voice service is called while playing. */
window.QuestSound=(()=>{
 const root='assets/audio/';let ready=false,enabled=true,musicOn=true,voiceOn=true,sfxOn=true,mv=.55,vv=.95,sv=.8,track='trail',talking=false,voice=null,voiceId='',paused=false,serial=0,wasMusic=false;
 const music=new Audio();music.loop=true;music.preload='none';let effects=new Set();
 function sync(){music.volume=enabled&&musicOn?(talking?mv*.16:mv):0;if(!enabled||!musicOn||document.hidden)music.pause();else if(ready&&music.src)music.play().catch(()=>{});if(voice)voice.volume=enabled&&voiceOn?vv:0}
 function theme(name='trail'){if(track===name&&music.src){sync();return}track=name;music.src=root+'music-'+name+'.mp3';sync()}
 function boot(){ready=true;theme(track);sync()}
 function configure(o){if(o.enabled!==undefined)enabled=o.enabled;if(o.music!==undefined)musicOn=o.music;if(o.voice!==undefined)voiceOn=o.voice;if(o.sfx!==undefined)sfxOn=o.sfx;if(o.musicVolume!==undefined)mv=o.musicVolume;if(o.voiceVolume!==undefined)vv=o.voiceVolume;if(o.sfxVolume!==undefined)sv=o.sfxVolume;if(!enabled||!voiceOn)stop();if(!enabled||!sfxOn){effects.forEach(a=>a.pause());effects.clear()}sync()}
 function stop(){serial++;if(voice){voice.pause();voice.removeAttribute('src');voice.load();voice=null}voiceId='';talking=false;paused=false;sync();document.dispatchEvent(new CustomEvent('questvoice',{detail:{playing:false}}))}
 function narrate(id,options={}){stop();if(!ready||!enabled||!voiceOn||document.hidden)return false;const token=serial;voice=new Audio(root+id+'.mp3');const a=voice;voiceId=id;a.volume=vv;a.preload='auto';talking=true;sync();document.dispatchEvent(new CustomEvent('questvoice',{detail:{playing:true,id}}));a.ontimeupdate=()=>{if(token===serial)options.progress?.(a.duration?a.currentTime/a.duration:0)};
 a.onended=()=>{if(token!==serial)return;voice=null;voiceId='';talking=false;sync();document.dispatchEvent(new CustomEvent('questvoice',{detail:{playing:false}}));options.end?.()};
 a.onerror=()=>{if(token!==serial)return;voice=null;voiceId='';talking=false;sync();document.dispatchEvent(new CustomEvent('questvoice',{detail:{playing:false}}));options.error?.()};
 a.play().catch(()=>{if(token!==serial)return;talking=false;sync();document.dispatchEvent(new CustomEvent('questvoice',{detail:{playing:false}}));options.error?.()});return true}
 function pauseVoice(){if(!voice)return;paused=!paused;if(paused){voice.pause();talking=false}else{voice.play().catch(()=>{});talking=true}sync();return paused}
 function sfx(name){if(!ready||!enabled||!sfxOn||document.hidden)return;const a=new Audio(root+'sfx-'+name+'.mp3');a.volume=sv;effects.add(a);a.onended=()=>effects.delete(a);a.onerror=()=>effects.delete(a);a.play().catch(()=>effects.delete(a));if(effects.size>8){const old=effects.values().next().value;old.pause();effects.delete(old)}}
 function speak(text,o={}){stop();if(!ready||!enabled||!voiceOn||document.hidden||!('speechSynthesis' in window)){o.error?.();return false}try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.rate=o.rate||.9;u.volume=vv;u.onend=()=>{talking=false;sync();o.end?.()};u.onerror=()=>{talking=false;sync();o.error?.()};talking=true;sync();speechSynthesis.speak(u);return true}catch{o.error?.();return false}}
 function suspend(){music.pause();stop();try{speechSynthesis.cancel()}catch{}effects.forEach(a=>a.pause());effects.clear()}
 document.addEventListener('visibilitychange',()=>{if(document.hidden)suspend()});
 return {boot,configure,theme,narrate,speak,stop,pauseVoice,sfx,suspend,state:()=>({ready,enabled,music:musicOn,voice:voiceOn,sfx:sfxOn,talking,paused,voiceId,track,musicVolume:music.volume,voicePlaying:!!voice&&!voice.paused,musicPlaying:!music.paused})};
})();
