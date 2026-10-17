/* Play layer: Adventure Pass, Daily Missions, Focus Combo, celebrations, Syllable Colors,
   Focus mode, Play Zone mini-games (Syllable Smash, Mirror Monsters, Rune Trace) and Pokémon Moves breaks.
   Built for short bursts, no timers, voice for every instruction, and no lost points. */
window.Play=(()=>{
const A=()=>window.GrowthAPI,S=()=>window.QuestSound;
const st=()=>A()?.state||{},g=()=>st().g||{};
const $=(q,r=document)=>r.querySelector(q),$$=(q,r=document)=>[...r.querySelectorAll(q)];
const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const I=n=>`<i data-lucide="${n}" aria-hidden="true"></i>`;
const icons=()=>{try{A()?.icons()}catch{}};
const toast=m=>{try{A()?.toast(m)}catch{}};
const save=()=>{try{window.Growth?.save()}catch{}};
const D=window.ADVENTURE_DATA||{cards:{}};
const TAPS=window.ADVENTURE_TAPS||{};
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const motionOff=()=>document.body.classList.contains('no-motion')||matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- State ---------- */
function P(){const x=g();if(!x.play||typeof x.play!=='object')x.play={};const p=x.play;
 p.xp=p.xp||0;p.claimed=p.claimed||0;p.tickets=p.tickets||0;p.stickers=p.stickers||[];p.days=p.days||[];p.best=p.best||0;p.combo=p.combo||0;
 p.syl=!!p.syl;p.focus=!!p.focus;p.stats=p.stats||{};p.questsSinceBreak=p.questsSinceBreak||0;
 if(!p.day||p.day.date!==today())p.day={date:today(),c:{},done:[],chest:false};
 if(!p.days.includes(today())){p.days.push(today());p.days=p.days.slice(-60);}
 return p;}

/* ---------- Voice ---------- */
function say(id){const s=S();if(s?.narrate&&s.narrate('play/'+id))return true;return false;}
function sayWord(word){const s=S();const id=TAPS['spark:'+word.toLowerCase()];if(id&&s?.narrate&&s.narrate('tap/'+id))return true;try{if(!window.speechSynthesis)return false;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(word);u.rate=.8;speechSynthesis.speak(u);return true;}catch{return false}}
const sfx=(n,v)=>{try{S()?.sfx?.(n,v)}catch{}};

/* ---------- Celebration ---------- */
const COLORS=['#2f8f6a','#f0a94e','#e8634a','#6b5bd2','#3a9ad9','#ffd34d'];
function burst(power=1,origin){if(motionOff()||typeof window.confetti!=='function')return;try{const o=origin||{x:.5,y:.6};window.confetti({particleCount:Math.round(50*power),spread:60+20*power,startVelocity:30+8*power,origin:o,colors:COLORS,disableForReducedMotion:true,zIndex:9999,scalar:.9});if(power>=2){setTimeout(()=>window.confetti({particleCount:60,angle:60,spread:55,origin:{x:0,y:.7},colors:COLORS,zIndex:9999}),180);setTimeout(()=>window.confetti({particleCount:60,angle:120,spread:55,origin:{x:1,y:.7},colors:COLORS,zIndex:9999}),300);}}catch{}}
function originOf(el){if(!el)return null;const r=el.getBoundingClientRect();return {x:(r.left+r.width/2)/innerWidth,y:(r.top+r.height/2)/innerHeight};}
function pop(text,el){const d=document.createElement('div');d.className='pz-pop';d.textContent=text;document.body.appendChild(d);const r=el?.getBoundingClientRect?.();if(r){d.style.left=Math.min(innerWidth-120,Math.max(10,r.left+r.width/2-50))+'px';d.style.top=Math.max(10,r.top-10)+'px';}setTimeout(()=>d.remove(),1400);}

/* ---------- Adventure Pass ---------- */
const TIER=150,MAXT=30;
const STICKERS=[25,1,4,7,133,143,39,54,172,152,155,158,27,37,58,63,79,92,104,129,130,131,134,147,149,151,175,258,393,6];
const TITLES={5:'Trail Spotter',10:'Word Tracker',15:'Story Detective',20:'Atlas Ranger',25:'Wonder Captain',30:'World Quest Legend'};
function tierOf(xp){return Math.min(MAXT,Math.floor(xp/TIER));}
function reward(t){const r={sticker:STICKERS[(t-1)%STICKERS.length]};if(t%3===0)r.ticket=1;if(TITLES[t])r.title=TITLES[t];return r;}
function title(){const t=tierOf(P().xp);let best='Trail Rookie';for(const k of Object.keys(TITLES))if(t>=+k)best=TITLES[k];return best;}
function addXP(n,why,el){if(!n)return;const p=P();const before=tierOf(p.xp);p.xp+=n;const after=tierOf(p.xp);pop('+'+n+' Pass XP',el||$('.pz-panel')||$('.modal'));
 for(let t=before+1;t<=after;t++){const r=reward(t);p.stickers.includes(r.sticker)||p.stickers.push(r.sticker);if(r.ticket)p.tickets+=1;p.claimed=t;
  setTimeout(()=>{say('pass-up');burst(1.5);toast(`Adventure Pass level ${t}: new sticker${r.ticket?' + 1 TV ticket':''}${r.title?` + title "${r.title}"`:''}.`);},400);}
 save();refresh();}

/* ---------- Daily Missions ---------- */
const MISSIONS={
 quest:{label:'Finish 1 quest',need:1,icon:'key-round'},
 cards:{label:'Read 3 story cards',need:3,icon:'book-open'},
 right:{label:'Get 3 answers right',need:3,icon:'check-circle-2'},
 spark:{label:'Catch 2 Word Sparks',need:2,icon:'sparkles'},
 smash:{label:'Smash 4 syllable rocks',need:4,icon:'drum'},
 mirror:{label:'Catch 8 mirror monsters',need:8,icon:'scan-eye'},
 rune:{label:'Charge 2 runes',need:2,icon:'pen-tool'},
 move:{label:'Do 1 Pokémon Moves break',need:1,icon:'activity'},
 win:{label:'Win a battle or race',need:1,icon:'swords'}};
function hash(s){let h=7;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return h;}
function todays(){const h=hash(today());const quest=['quest','cards','right','spark'],play=['smash','mirror','rune'],extra=['move','win','spark','cards'];
 const a=quest[h%4],b=play[(h>>3)%3];let c=extra[(h>>6)%4];if(c===a)c='move';return [a,b,c];}
function bump(kind,n=1){const p=P();const day=p.day;day.c[kind]=(day.c[kind]||0)+n;p.stats[kind]=(p.stats[kind]||0)+n;
 const list=todays();if(list.includes(kind)&&!day.done.includes(kind)&&day.c[kind]>=MISSIONS[kind].need){day.done.push(kind);setTimeout(()=>{say('dm-done');burst(1.2);toast(`Mission complete: ${MISSIONS[kind].label}.`);addXP(30,'mission');},500);}
 if(!day.chest&&list.every(k=>day.done.includes(k))){day.chest=true;p.tickets+=1;setTimeout(()=>{burst(2.2);toast('All three missions done. Treasure chest: +1 TV ticket and +50 Pass XP.');addXP(50,'chest');},1600);}
 save();refresh();}

/* ---------- Hub panel ---------- */
function panelHtml(){const p=P();const t=tierOf(p.xp);const into=t>=MAXT?TIER:p.xp%TIER;const list=todays();const next=t<MAXT?reward(t+1):null;
 const wk=[...Array(7)].map((_,i)=>{const d=new Date();d.setDate(d.getDate()-6+i);const k=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');return p.days.includes(k);});
 return `<section class="pz-panel" aria-label="Today's play">
 <div class="pz-pass"><div class="pz-ring" style="--pct:${into/TIER*100}%"><b>${t}</b><small>level</small></div><div class="pz-pass-copy"><span class="pz-tag">${I('ticket')} ADVENTURE PASS · ${E(title())}</span><div class="pz-bar"><i style="width:${into/TIER*100}%"></i></div><small>${t>=MAXT?'Pass complete. Legend status.':`${TIER-into} XP to level ${t+1}: <img src="assets/pokemon/${next.sticker}.webp" alt="" class="pz-mini"> sticker${next.ticket?' + TV ticket':''}`}</small><div class="pz-week" aria-label="Adventure days this week">${wk.map(on=>`<span class="${on?'on':''}"></span>`).join('')}<em>${wk.filter(Boolean).length} adventure day${wk.filter(Boolean).length===1?'':'s'} this week</em></div></div><button class="btn btn-plain pz-stick-btn" data-play="stickers">${I('sticker')} Stickers ${p.stickers.length}/30</button></div>
 <div class="pz-missions"><div class="pz-mhead"><b>${I('target')} Today's missions</b><button class="adv-say" data-play="say-missions" aria-label="Hear today's missions">${I('volume-2')}</button></div>${list.map(k=>{const m=MISSIONS[k];const c=Math.min(m.need,p.day.c[k]||0);const done=p.day.done.includes(k);return `<div class="pz-mission ${done?'done':''}">${I(done?'check-circle-2':m.icon)}<span>${E(m.label)}</span><small>${c}/${m.need}</small><div class="pz-mbar"><i style="width:${c/m.need*100}%"></i></div></div>`}).join('')}<small class="pz-chest ${p.day.chest?'open':''}">${I(p.day.chest?'gift':'lock-keyhole')} ${p.day.chest?'Treasure chest opened today':'Finish all 3 to open the treasure chest'}</small></div>
 <div class="pz-actions"><button class="pz-big" data-play="zone">${I('gamepad-2')}<b>Play Zone</b><small>3 quick games · no timer</small></button><button class="pz-big move" data-play="move">${I('activity')}<b>Pokémon Moves</b><small>Stand up and power up</small></button></div></section>`;}
function decorateMain(){const main=$('#main');if(!main)return;const hub=$('.adv-hub',main);if(!hub)return;const old=$('.pz-panel',main);if(old)return;hub.insertAdjacentHTML('beforebegin',panelHtml());icons();}
function refresh(){const old=$('#main .pz-panel');if(old){old.outerHTML=panelHtml();icons();}}

/* ---------- Story hooks: combo, syllables, focus ---------- */
let snap=null;
function snapshot(){const L=g().ledger||{};const o={};for(const [id,r] of Object.entries(L))o[id]={ev:(r.events||[]).length,seen:(r.seen||[]).length,stage:r.stage};return o;}
function watch(){const L=g().ledger||{};if(!snap){snap=snapshot();snap.__sparks=Object.keys(g().sparks||{}).length;return;}
 for(const [id,r] of Object.entries(L)){const o=snap[id]||{ev:0,seen:0,stage:''};const ev=r.events||[];
  if(ev.length>o.ev){for(let i=o.ev;i<ev.length;i++)onEvent(ev[i],ev[i-1]);}
  const seen=(r.seen||[]).length;if(seen>o.seen)bump('cards',seen-o.seen);
  if(r.stage==='done'&&o.stage&&o.stage!=='done')onQuestDone();
  snap[id]={ev:ev.length,seen,stage:r.stage};}
 const sp=Object.keys(g().sparks||{}).length;if(sp>(snap.__sparks||0)){bump('spark',sp-snap.__sparks);addXP(5*(sp-snap.__sparks),'spark');}snap.__sparks=sp;}
function onEvent(e,prev){const p=P();if(e.correct){const first=!prev||prev.correct;bump('right');addXP(10,'answer',$('.modal .g-task-title')||$('.modal'));
  if(first){p.combo++;p.best=Math.max(p.best,p.combo);if(p.combo>=2)addXP(Math.min(10,2*p.combo),'combo');if(p.combo===3||p.combo%5===0){setTimeout(()=>say('combo'),900);}burst(Math.min(1.4,.5+p.combo*.15),{x:.5,y:.45});}
  else{burst(.5,{x:.5,y:.45});}
  sfxCombo();}
 else{if(p.combo>=2)toast('Combo paused. Take a breath, look back, and start a new one.');p.combo=0;}
 save();comboBadge();}
function sfxCombo(){const c=P().combo;if(c>=2)sfx('key',.25);}
function onQuestDone(){const p=P();bump('quest');addXP(40,'quest');burst(2.4);p.questsSinceBreak++;save();if(p.questsSinceBreak>=2)setTimeout(offerBreak,4200);}
function comboBadge(){const m=$('.modal.growth-story');const bar=m&&$('.g-focus-bar',m);let b=m&&$('.pz-combo',m);const c=P().combo;if(!bar){return;}if(!c&&!$('.g-task-title',m)){b?.remove();return;}if(!b){bar.insertAdjacentHTML('afterend',`<div class="pz-combo" aria-live="polite"></div>`);b=$('.pz-combo',m);}if(b.dataset.k===String(c))return;b.dataset.k=String(c);b.className='pz-combo'+(c>=2?' hot':'')+(c>=5?' blaze':'');b.innerHTML=c?`${I('flame')}<b>Focus combo x${c}</b><small>${c>=2?`+${Math.min(10,2*c)} bonus XP each first-try answer`:'Get the next one right on the first try to start a combo'}</small>`:`${I('flame')}<small>First-try answers build a Focus combo. Looking back is always free.</small>`;icons();}

/* Syllable Colors via Hypher (BSD) with en-us patterns */
let hy=null;function hyph(){if(hy)return hy;try{hy=window.Hypher?.languages?.['en-us']||null;if(hy){hy.leftMin=1;hy.rightMin=2;}}catch{}return hy;}
const sparkSyl=(()=>{const m={};for(const c of Object.values(D.cards||{}))for(const s of c.sparks||[])m[s.word.toLowerCase()]=s.syl.split(/[·\-]/);return m;})();
function split(word){const low=word.toLowerCase();if(sparkSyl[low]&&sparkSyl[low].join('')===low){let i=0;return sparkSyl[low].map(p=>{const s=word.slice(i,i+p.length);i+=p.length;return s;});}const h=hyph();if(!h||word.length<4)return [word];try{return h.hyphenate(word);}catch{return [word]}}
function sylNode(root){if(!root||root.dataset.pzSyl)return;root.dataset.pzSyl='1';const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 for(const n of nodes){if(!n.nodeValue.trim()||n.parentElement.closest('.sy,button.adv-say,svg'))continue;const frag=document.createDocumentFragment();n.nodeValue.split(/([A-Za-zÀ-ÿ’']+)/).forEach((part,i)=>{if(i%2===0){if(part)frag.appendChild(document.createTextNode(part));return;}const parts=split(part);if(parts.length<2){frag.appendChild(document.createTextNode(part));return;}parts.forEach((s,k)=>{const sp=document.createElement('span');sp.className='sy sy'+(k%2);sp.textContent=s;frag.appendChild(sp);});});n.parentNode.replaceChild(frag,n);}}
function applySyl(){if(!P().syl)return;$$('.modal .g-passage').forEach(sylNode);const h=$('.modal .g-task-title h3');if(h)sylNode(h);}
function chipsExtra(){const c=$('.modal .adv-chips');if(!c||$('[data-play="syl"]',c))return;const p=P();c.insertAdjacentHTML('beforeend',`<button class="adv-chip ${p.syl?'on':''}" data-play="syl" aria-pressed="${p.syl}">${I('palette')} Syllable colors ${p.syl?'on':'off'}</button><button class="adv-chip ${p.focus?'on':''}" data-play="focus" aria-pressed="${p.focus}">${I('focus')} Focus mode ${p.focus?'on':'off'}</button>`);icons();}
function applyBody(){const p=P();document.body.classList.toggle('pz-syl',p.syl);document.body.classList.toggle('pz-focus',p.focus);}

/* ---------- Brain break offer ---------- */
function offerBreak(){if($('.pz-offer')||$('.pz-modal'))return;const d=document.createElement('div');d.className='pz-offer';d.innerHTML=`<img src="assets/pokemon/25.webp" alt=""><div><b>Brain break time?</b><small>Pikachu wants to move for 30 seconds.</small></div><button class="btn btn-primary" data-play="move">${I('activity')} Let's move</button><button class="btn btn-plain" data-play="later">Later</button>`;document.body.appendChild(d);icons();setTimeout(()=>d.remove(),20000);}

/* ---------- Modal shell ---------- */
function open(title,eyebrow,body,cls=''){A().showModal(`<section class="modal growth-modal adv-modal pz-modal ${cls}" role="dialog" aria-modal="true" aria-labelledby="pz-title">${A().closeButton()}<div class="g-head"><span class="eyebrow">${E(eyebrow)}</span><h2 id="pz-title">${E(title)}</h2></div><div class="g-body">${body}</div></section>`,'adventure');icons();}
const back=`<button class="btn btn-plain pz-back" data-play="zone">${I('arrow-left')} Play Zone</button>`;

function zone(){say('pz-intro');const s=P().stats;open('Play Zone','QUICK GAMES · NO TIMER · NO LOST POINTS',`<p class="pz-lead">Pick a game. Each one takes about a minute. ${'<button class="adv-say" data-play="say" data-id="pz-intro" aria-label="Hear this">'+I('volume-2')+'</button>'}</p><div class="pz-games">
 <button class="pz-game smash" data-play="smash">${I('drum')}<b>Syllable Smash</b><small>Hear a word, clap the beats, smash the rock.</small><em>${s.smash||0} rocks smashed</em></button>
 <button class="pz-game mirror" data-play="mirror">${I('scan-eye')}<b>Mirror Monsters</b><small>Catch the b, d, p and q tricksters.</small><em>${s.mirror||0} monsters caught</em></button>
 <button class="pz-game rune" data-play="rune">${I('pen-tool')}<b>Rune Trace</b><small>Follow the glowing path with your finger.</small><em>${s.rune||0} runes charged</em></button>
 <button class="pz-game move" data-play="move">${I('activity')}<b>Pokémon Moves</b><small>A 30-second power-up break.</small><em>${s.move||0} breaks done</em></button></div>`,'pz-zone');}

/* ---------- Syllable Smash ---------- */
let ss=null;
function smashPool(){const done=st().done||0;const out=[];for(const [id,c] of Object.entries(D.cards||{})){const [l,n]=id.split('-').map(Number);if(l*3+n<=done)for(const s of c.sparks)out.push(s);}
 const got=g().sparks||{};out.sort((a,b)=>(got[b.word.toLowerCase()]?1:0)-(got[a.word.toLowerCase()]?1:0));return out.length>=6?out:Object.values(D.cards||{}).flatMap(c=>c.sparks);}
function smash(){const pool=shuffle(smashPool()).slice(0,6);ss={list:pool,i:0,first:0,tried:false};say('ss-intro');drawSmash();}
function drawSmash(){const w=ss.list[ss.i];if(!w)return smashDone();const parts=w.syl.split(/[·\-]/);open('Syllable Smash',`ROCK ${ss.i+1} OF ${ss.list.length}`,`<div class="pz-smash">
 <button class="pz-rock" data-play="ss-hear" aria-label="Hear the word">${I('volume-2')}<span class="pz-rock-word">${parts.map((p,k)=>`<span class="sy sy${k%2} pz-chunk">${E(p)}</span>`).join('')}</span><small>Tap the rock to hear it</small></button>
 <button class="btn btn-plain pz-clap" data-play="ss-clap">${I('hand')} Clap it with me</button>
 <p class="pz-q">How many beats?</p><div class="pz-beats">${(parts.length>4?[2,3,4,5]:[1,2,3,4]).map(n=>`<button class="pz-beat" data-play="ss-pick" data-n="${n}">${'<i class="pz-dot"></i>'.repeat(n)}<b>${n}</b></button>`).join('')}</div>
 <p class="pz-meaning">${E(w.mean)}</p>${back}</div>`,'pz-smash-m');setTimeout(()=>sayWord(w.word),ss.i?250:3600);}
function clap(){const chunks=$$('.pz-chunk');chunks.forEach((c,k)=>setTimeout(()=>{c.classList.add('beat');sfx('tap',.6);setTimeout(()=>c.classList.remove('beat'),380);},k*520));}
function pickBeats(n,b){const w=ss.list[ss.i];const need=w.syl.split(/[·\-]/).length;if(n===need){if(!ss.tried)ss.first++;sfx('match',.7);$('.pz-rock')?.classList.add('smashed');burst(.9,originOf($('.pz-rock')));say('ss-right');bump('smash');addXP(ss.tried?5:8,'smash',b);ss.i++;ss.tried=false;setTimeout(drawSmash,1500);}
 else{ss.tried=true;b.classList.add('nope');sfx('gentle');say('ss-again');setTimeout(clap,1900);}}
function smashDone(){say('ss-done');burst(1.6);open('Rocks smashed','SYLLABLE SMASH',`<div class="pz-result"><img src="assets/pokemon/143.webp" alt=""><p><b>${ss.list.length} rocks smashed.</b> ${ss.first} on the first listen.</p><p class="pz-tip">Beats help you read big words: say each part, then push them together.</p><div class="g-actions"><button class="btn btn-primary" data-play="smash">${I('rotate-ccw')} Smash more</button>${back}</div></div>`);}

/* ---------- Mirror Monsters ---------- */
let mm=null;
const TRICK={b:'The bat comes first, then the ball.',d:'The drum comes first, then the stick.',p:'The stick drops down below the line, and the ball sits on top.',q:'The ball comes first, and the tail drops down below the line.'};
function letterSvg(L){const stick={b:'M30 8 L30 92',d:'M70 8 L70 92',p:'M30 40 L30 124',q:'M70 40 L70 124'}[L];const ball={b:'M30 66 a20 20 0 1 0 40 0 a20 20 0 1 0 -40 0',d:'M30 66 a20 20 0 1 0 40 0 a20 20 0 1 0 -40 0',p:'M30 62 a20 20 0 1 0 40 0 a20 20 0 1 0 -40 0',q:'M30 62 a20 20 0 1 0 40 0 a20 20 0 1 0 -40 0'}[L];const first=L==='b'||L==='p'?'stick':'ball';
 return `<svg viewBox="0 0 100 130" class="pz-trick" aria-hidden="true"><line x1="0" y1="92" x2="100" y2="92" class="base"/><path d="${stick}" class="stk ${first==='stick'?'one':'two'}"/><path d="${ball}" class="bal ${first==='ball'?'one':'two'}"/></svg>`;}
function mirror(){mm={order:shuffle(['b','d','p','q']),r:0,caught:0,oops:false};say('mm-intro');setTimeout(drawMirror,200);}
function drawMirror(){const L=mm.order[mm.r];if(!L)return mirrorDone();const tricks=['b','d','p','q'].filter(x=>x!==L);const n=4+Math.min(2,mm.r);const bubbles=shuffle([...Array(n).fill(L),...[...Array(10-n)].map((_,i)=>tricks[i%3])]);mm.left=n;mm.oops=false;
 open('Mirror Monsters',`ROUND ${mm.r+1} OF 4`,`<div class="pz-mirror"><div class="pz-target"><span class="pz-big-letter">${L}</span>${letterSvg(L)}<p>${E(TRICK[L])} <button class="adv-say" data-play="say" data-id="mm-${L}" aria-label="Hear the trick">${I('volume-2')}</button></p></div>
 <div class="pz-bubbles">${bubbles.map((x,i)=>`<button class="pz-bubble" data-play="mm-tap" data-l="${x}" style="--d:${(i%5)*.35}s">${x}</button>`).join('')}</div><p class="pz-count">Find <b>${n}</b> more</p>${back}</div>`,'pz-mirror-m');setTimeout(()=>say('mm-'+L),mm.r?150:4200);}
function tapBubble(b){const L=mm.order[mm.r];if(b.classList.contains('got'))return;if(b.dataset.l===L){b.classList.add('got');sfx('tap',.7);burst(.35,originOf(b));mm.left--;mm.caught++;bump('mirror');addXP(3,'mirror',b);const c=$('.pz-count b');if(c)c.textContent=mm.left;if(mm.left<=0){say('mm-right');setTimeout(()=>{mm.r++;drawMirror();},1100);}}
 else{b.classList.remove('nope');void b.offsetWidth;b.classList.add('nope');sfx('gentle',.5);if(!mm.oops){mm.oops=true;say('mm-oops');}$('.pz-target')?.classList.add('flash');setTimeout(()=>$('.pz-target')?.classList.remove('flash'),900);}}
function mirrorDone(){say('mm-done');burst(1.6);open('Monsters caught','MIRROR MONSTERS',`<div class="pz-result"><img src="assets/pokemon/92.webp" alt=""><p><b>${mm.caught} mirror monsters caught.</b></p><p class="pz-tip">Trick to keep: make a "bed" with your hands. Left thumb up is b, right thumb up is d.</p><div class="g-actions"><button class="btn btn-primary" data-play="mirror">${I('rotate-ccw')} Play again</button>${back}</div></div>`);}

/* ---------- Rune Trace ---------- */
const RUNES={
 c:['M78 74 C68 58 34 58 28 84 C22 112 56 128 80 110'],
 o:['M52 60 C26 60 22 120 52 120 C80 120 80 60 52 60'],
 a:['M76 74 C66 56 28 60 28 92 C28 124 70 124 76 92','M76 60 L76 120'],
 e:['M28 90 L78 90 C78 58 30 56 28 88 C26 122 62 128 80 110'],
 s:['M74 68 C62 56 32 58 34 76 C36 92 72 86 72 106 C72 126 38 126 28 112'],
 b:['M30 10 L30 120','M30 92 C36 60 80 60 80 92 C80 124 36 124 30 100'],
 d:['M76 76 C66 58 26 60 26 92 C26 124 68 124 76 100','M76 10 L76 120'],
 p:['M30 60 L30 164','M30 82 C38 56 80 58 80 88 C80 120 40 120 30 100'],
 q:['M76 76 C66 58 26 60 26 90 C26 122 68 122 76 98','M76 60 L76 164']};
const RUNE_TIP={b:'Bat first, then the ball.',d:'Drum first, then the stick.',p:'Stick goes down, then the ball on top.',q:'Ball first, then the tail goes down.',a:'Round first, then the stick.',c:'Start at the top and curve around.',o:'Start at the top and go all the way around.',e:'Straight across, then curl around.',s:'Curve one way, then curve back.'};
let rt=null;
function rune(){const set=shuffle(['b','d','a','c','o','e','s','p','q']).slice(0,3);rt={set,i:0,first:0};say('rt-intro');drawRune();}
function drawRune(){const L=rt.set[rt.i];if(!L)return runeDone();const strokes=RUNES[L];
 open('Rune Trace',`RUNE ${rt.i+1} OF ${rt.set.length}`,`<div class="pz-rune"><p class="pz-q">Trace the letter <b class="pz-rune-l">${L}</b>. ${E(RUNE_TIP[L])} <button class="adv-say" data-play="say" data-id="rt-intro" aria-label="Hear how">${I('volume-2')}</button></p>
 <svg class="pz-pad" viewBox="0 0 110 176" role="img" aria-label="Tracing pad for the letter ${L}"><line x1="4" y1="10" x2="106" y2="10" class="gl top"/><line x1="4" y1="60" x2="106" y2="60" class="gl mid"/><line x1="4" y1="120" x2="106" y2="120" class="gl base"/><line x1="4" y1="164" x2="106" y2="164" class="gl top"/>
 ${strokes.map((d,k)=>`<path d="${d}" class="rt-guide" data-k="${k}"/><path d="${d}" class="rt-ink" data-k="${k}"/>`).join('')}<circle class="rt-start" r="7"/><circle class="rt-finger" r="5" cx="-50" cy="-50"/></svg>
 <div class="pz-rune-bar"><i></i></div><p class="pz-rune-hint">Start on the green dot. Go slow and steady.</p>${back}</div>`,'pz-rune-m');setupRune();}
function setupRune(){const svg=$('.pz-pad');if(!svg)return;const inks=$$('.rt-ink',svg);const guides=$$('.rt-guide',svg);const pts=guides.map(p=>{const L=p.getTotalLength();const a=[];for(let s=0;s<=L;s+=3){const q=p.getPointAtLength(s);a.push({x:q.x,y:q.y,s});}return {L,a};});
 inks.forEach((p,k)=>{p.style.strokeDasharray=pts[k].L;p.style.strokeDashoffset=pts[k].L;});
 const run={k:0,i:0,down:false};const start=$('.rt-start',svg),fin=$('.rt-finger',svg);
 const place=()=>{const q=pts[run.k]?.a[run.i];if(q){start.setAttribute('cx',q.x);start.setAttribute('cy',q.y);}guides.forEach((g2,k)=>g2.classList.toggle('now',k===run.k));};place();
 const total=pts.reduce((a,p)=>a+p.a.length,0);const bar=$('.pz-rune-bar i');
 const toSvg=e=>{const m=svg.getScreenCTM();if(!m)return null;const pt=svg.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;return pt.matrixTransform(m.inverse());};
 const advance=e=>{const p=toSvg(e);if(!p)return;fin.setAttribute('cx',p.x);fin.setAttribute('cy',p.y);const seg=pts[run.k];if(!seg)return;let best=-1;for(let j=run.i;j<Math.min(seg.a.length,run.i+14);j++){const q=seg.a[j];if(Math.hypot(q.x-p.x,q.y-p.y)<16)best=j;}
  if(best>=run.i){run.i=best;inks[run.k].style.strokeDashoffset=Math.max(0,seg.L-seg.a[run.i].s);const doneSoFar=pts.slice(0,run.k).reduce((a,q)=>a+q.a.length,0)+run.i;if(bar)bar.style.width=(doneSoFar/total*100)+'%';
   if(run.i>=seg.a.length-3){inks[run.k].style.strokeDashoffset=0;sfx('tap',.7);run.k++;run.i=0;if(run.k>=pts.length){finishRune();return;}place();}}};
 svg.addEventListener('pointerdown',e=>{run.down=true;svg.setPointerCapture?.(e.pointerId);e.preventDefault();advance(e);});
 svg.addEventListener('pointermove',e=>{if(run.down)advance(e);});
 const up=()=>{run.down=false;};svg.addEventListener('pointerup',up);svg.addEventListener('pointercancel',up);
 rt.svg=svg;}
function finishRune(){const svg=rt.svg;svg?.classList.add('charged');sfx('match',.8);burst(1,originOf(svg));say('rt-done');bump('rune');addXP(12,'rune',svg);rt.i++;setTimeout(drawRune,1700);}
function runeDone(){burst(1.6);open('Runes charged','RUNE TRACE',`<div class="pz-result"><img src="assets/pokemon/63.webp" alt=""><p><b>${rt.set.length} runes charged: ${rt.set.join(', ')}.</b></p><p class="pz-tip">Same start, same path, every time. That is how hands remember letters.</p><div class="g-actions"><button class="btn btn-primary" data-play="rune">${I('rotate-ccw')} Trace more</button>${back}</div></div>`);}

/* ---------- Pokémon Moves break ---------- */
const MOVES=[{id:'pika',img:25,name:'Pikachu jumps',text:'Jump 5 times, light as a spark.',n:5},{id:'squirtle',img:7,name:'Squirtle swims',text:'Make 5 big arm circles.',n:5},{id:'snorlax',img:143,name:'Snorlax stretches',text:'Reach up high and hold it. Tap 5 times while you hold.',n:5},{id:'bulba',img:1,name:'Bulbasaur breathes',text:'Smell the flower, blow out the candle. 3 times.',n:3},{id:'charmander',img:4,name:'Charmander stomps',text:'5 strong stomps, left then right.',n:5},{id:'eevee',img:133,name:'Eevee shakes it out',text:'Wiggle your hands and feet. Tap 5 times.',n:5}];
let mv=null;
function move(){document.querySelector('.pz-offer')?.remove();const set=shuffle(MOVES).slice(0,2);mv={set,i:0,c:0};say('bb-intro');drawMove(true);}
function drawMove(first){const m=mv.set[mv.i];if(!m)return moveDone();mv.c=0;open(m.name,`POKÉMON MOVES · ${mv.i+1} OF ${mv.set.length}`,`<div class="pz-move"><img class="pz-move-img ${m.id}" src="assets/pokemon/${m.img}.webp" alt=""><p class="pz-move-text">${E(m.text)} <button class="adv-say" data-play="say" data-id="bb-${m.id}" aria-label="Hear the move">${I('volume-2')}</button></p><button class="pz-count-btn" data-play="mv-tap"><b>0</b><small>of ${m.n} · tap each time</small></button><div class="pz-move-dots">${'<i></i>'.repeat(m.n)}</div>${back}</div>`,'pz-move-m');setTimeout(()=>say('bb-'+m.id),first?4600:200);}
function moveTap(b){const m=mv.set[mv.i];if(mv.c>=m.n)return;mv.c++;sfx('tap',.6);b.querySelector('b').textContent=mv.c;$$('.pz-move-dots i')[mv.c-1]?.classList.add('on');$('.pz-move-img')?.classList.remove('hop');void $('.pz-move-img')?.offsetWidth;$('.pz-move-img')?.classList.add('hop');if(mv.c>=m.n){sfx('match',.7);burst(.8,originOf(b));mv.i++;setTimeout(()=>drawMove(false),1100);}}
function moveDone(){const p=P();p.questsSinceBreak=0;bump('move');addXP(10,'move');say('bb-done');burst(1.4);open('Powered up','POKÉMON MOVES',`<div class="pz-result"><img src="assets/pokemon/25.webp" alt=""><p><b>Great moving.</b> Your brain is ready for the next adventure.</p><div class="g-actions"><button class="btn btn-primary" data-play="close-go">${I('map')} Back to my adventure</button>${back}</div></div>`);}

/* ---------- Sticker book ---------- */
function stickers(){const p=P();open('Sticker Book','ADVENTURE PASS REWARDS',`<p class="pz-lead">Every pass level adds a sticker. Earn Pass XP from quests, missions, Word Sparks and Play Zone games.</p><div class="pz-stickers">${STICKERS.map((n,i)=>{const got=p.stickers.includes(n);return `<div class="pz-sticker ${got?'got':''}"><img src="assets/pokemon/${n}.webp" alt="" loading="lazy"><small>${got?'Collected':'Level '+(i+1)}</small></div>`}).join('')}</div>`,'pz-stick-m');}

/* ---------- Clicks ---------- */
document.addEventListener('click',e=>{const b=e.target.closest('[data-play]');if(!b)return;const a=b.dataset.play;e.preventDefault();
 if(a==='zone')return zone();if(a==='smash')return smash();if(a==='mirror')return mirror();if(a==='rune')return rune();if(a==='move')return move();if(a==='stickers')return stickers();
 if(a==='later'){$('.pz-offer')?.remove();P().questsSinceBreak=0;save();return;}
 if(a==='say'){say(b.dataset.id);return;}
 if(a==='say-missions'){say('missions');return;}
 if(a==='ss-hear'){sayWord(ss.list[ss.i].word);return;}
 if(a==='ss-clap'){clap();return;}
 if(a==='ss-pick'){pickBeats(+b.dataset.n,b);return;}
 if(a==='mm-tap'){tapBubble(b);return;}
 if(a==='mv-tap'){moveTap(b);return;}
 if(a==='close-go'){try{A().closeModal()}catch{$('.modal [data-action=close]')?.click()}return;}
 if(a==='syl'){const p=P();p.syl=!p.syl;save();applyBody();$$('.modal [data-play="syl"],.modal [data-play="focus"]').forEach(x=>x.remove());if(p.syl)applySyl();chipsExtra();toast(p.syl?'Syllable colors on: each word is split into colored beats.':'Syllable colors off.');return;}
 if(a==='focus'){const p=P();p.focus=!p.focus;save();applyBody();$$('.modal [data-play="syl"],.modal [data-play="focus"]').forEach(x=>x.remove());chipsExtra();toast(p.focus?'Focus mode on: extra panels are tucked away.':'Focus mode off.');return;}
},true);

/* ---------- Wrap sounds to catch wins ---------- */
let lastWin=0;function wrapSound(){const s=S();if(!s||s.__pz)return;s.__pz=1;const orig=s.sfx?.bind(s);if(orig)s.sfx=(n,...r)=>{if(n==='victory'&&Date.now()-lastWin>4000&&!$('.pz-modal')){lastWin=Date.now();bump('win');addXP(20,'win');burst(1.8);}return orig(n,...r);};}

/* ---------- Loop ---------- */
let pend=0;const mo=new MutationObserver(()=>{if(!pend)pend=requestAnimationFrame(scan);});
function scan(){pend=0;try{decorateMain();chipsExtra();applySyl();comboBadge();}catch(e){console.warn(e)}}
function boot(){try{hyph();P();applyBody();wrapSound();}catch{}mo.observe(document.body,{childList:true,subtree:true});scan();setInterval(()=>{try{watch()}catch{}},600);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else setTimeout(boot,0);
return {zone,smash,mirror,rune,move,stickers,addXP,bump,state:()=>P(),todays,split};
})();
