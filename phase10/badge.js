/* Phase 10a Badge Quest. A self-contained full-screen module launched from the wonder trail.
   It does not change the original six stops, state.done or the 0-29 Pokemon index scheme.
   Its own progress lives in state.g.bq10 (sanitised here); new Pokemon use QuestProgress.unlockPoke(30-39);
   reading skills go through QuestSkills (state.g.skills10). Local only: no network calls. */
window.BadgeQuest=(()=>{
'use strict';
const D=window.BQ_DATA,P10=window.PLAY10A||{};
const API=()=>window.GrowthAPI,ST=()=>API()?.state,SND=()=>window.QuestSound,SK=()=>window.QuestSkills;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const I=n=>`<i data-lucide="${n}"></i>`;
const STOP_IDS=D.STOPS.map(s=>s.id);
const stopById=id=>D.STOPS.find(s=>s.id===id);
const SCENE={barkley:'bc',honolulu:'sydney',paris:'rome'};
const PARTNER={barkley:32,honolulu:30,paris:31};
const SKILL={barkley:'cvc',honolulu:'magicE',paris:'vowelTeam'};
const rnd=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const wait=ms=>new Promise(r=>setTimeout(r,ms));

/* ---------- state ---------- */
const seen=new WeakSet();
function fresh(){return {v:1,q:{},lab:{},boss:{},badge:{},shiny:{},evo:{},karp:0,gyarados:false,eeveeEvolved:false,teaser:false,left:false,surfRound:0,lavaSet:0,mapHeard:false};}
function sanitize(x){
  const src=x&&typeof x==='object'&&!Array.isArray(x)?x:{},o=fresh();
  const n=(v,a,b)=>Number.isFinite(v)?Math.max(a,Math.min(b,Math.floor(v))):a;
  for(const id of STOP_IDS){
    o.q[id]=n(src.q?.[id],0,3);
    for(const k of ['lab','boss','badge'])o[k][id]=src[k]?.[id]===true;
  }
  for(const r of D.ROSTER){if(src.shiny?.[r.index]===true)o.shiny[r.index]=true;if(src.evo?.[r.index]===true)o.evo[r.index]=true;}
  o.karp=n(src.karp,0,1e6);o.surfRound=n(src.surfRound,0,1e6);o.lavaSet=n(src.lavaSet,0,1e6);
  for(const k of ['gyarados','eeveeEvolved','teaser','left','mapHeard'])o[k]=src[k]===true;
  return o;
}
function g(){const s=ST();if(!s.g)s.g={};return s.g;}
function bq(){const G=g();let b=G.bq10;if(!b||!seen.has(b)){b=G.bq10=sanitize(b);seen.add(b);}
  if(!['water','electric','fire',''].includes(G.eeveeChoice))G.eeveeChoice='';return b;}
function save(){try{window.Growth?.queueSave?.();}catch{}try{window.QuestProgress?.save?.();}catch{}}
function skills(){const sk=SK();if(sk&&ST()){try{sk.attach(ST());}catch{}}return sk;}
const unlocked=()=>(g().unlocked10||[]);
const owns=i=>unlocked().includes(i);
const bqKeys=()=>{const b=bq();return STOP_IDS.reduce((a,id)=>a+b.q[id],0);};
const stopDone=id=>{const b=bq();return b.boss[id]===true;};
function isOpen(id){const s=ST();if(id==='barkley')return true;if(id==='honolulu')return (s.done||0)>=3;if(id==='paris')return bq().badge.honolulu;return false;}
function lockText(id){return id==='honolulu'?'Earn 3 keys on the wonder trail to fly here.':id==='paris'?'Win the Water Badge in Honolulu to fly here.':'';}
function roster(i){return D.ROSTER.find(r=>r.index===i);}
function sprite(r){if(!r)return '';const b=bq();if(r.evo&&b.evo[r.index])return `assets/pokemon/${b.shiny[r.index]?'shiny/':''}${r.evo.id}.webp`;return `assets/pokemon/${b.shiny[r.index]?'shiny/':''}${r.id}.webp`;}
function pokeName(r){const b=bq();return r.evo&&b.evo[r.index]?r.evo.name:r.name;}

/* ---------- audio ---------- */
let hlTimer=0;
function say(id,text,o={}){
  const snd=SND();clearInterval(hlTimer);
  const fallback=()=>{snd?.speak?.(text,{rate:o.rate});if(o.progress){const words=text.split(/\s+/).length,dur=words*400,t0=Date.now();hlTimer=setInterval(()=>{const p=(Date.now()-t0)/dur;o.progress(Math.min(1,p));if(p>=1)clearInterval(hlTimer);},120);}};
  if(!snd)return;
  if(id){const ok=snd.narrate('bq/'+id,{progress:o.progress,error:fallback});if(ok)return;}
  fallback();
}
function speakWord(w,slow){SND()?.speak?.(w,{rate:slow?.7:.85});}
function sfx(n,v){try{SND()?.sfx?.(n,v);}catch{}}
function music(on){const s=SND();try{if(on)s?.action?.('dash',.2);else s?.endAction?.();}catch{}}
function confetti(){try{window.confetti?.({particleCount:90,spread:80,origin:{y:.6},zIndex:10001,disableForReducedMotion:true});}catch{}}

/* ---------- syllable colours ---------- */
function sylWord(w){const m=w.match(/^([^A-Za-zÀ-ÿʻ’']*)([A-Za-zÀ-ÿʻ’']+)(.*)$/);if(!m)return E(w);
  let parts=[m[2]];try{parts=window.Play?.split?.(m[2])||parts;}catch{}
  return E(m[1])+parts.map((p,i)=>`<span class="sy${i%2}">${E(p)}</span>`).join('')+E(m[3]);}
function sylText(t){return t.split(/\s+/).map((w,i)=>`<span class="bq-w" data-w="${i}">${sylWord(w)}</span>`).join(' ');}
function highlight(root,p){const ws=$$('.bq-w',root);if(!ws.length)return;const k=Math.min(ws.length-1,Math.floor(p*ws.length));ws.forEach((w,i)=>w.classList.toggle('on',i===k&&p<1));}

/* ---------- shell ---------- */
let root=null,stage=null,cleanup=null,current='map';
function build(){
  if(root)return;
  root=document.createElement('div');root.id='bq';root.className='bq';root.hidden=true;root.setAttribute('role','dialog');root.setAttribute('aria-label','Badge Quest');
  root.innerHTML=`<header class="bq-bar"><button class="bq-icon" data-bq="back" aria-label="Back">${I('arrow-left')}</button><h2 class="bq-title">Badge Quest</h2><span class="bq-stat" aria-label="Badge Quest keys">${I('key-round')}<strong id="bq-keys">0</strong><span>/ 9</span></span><button class="bq-icon" data-bq="close" aria-label="Close Badge Quest">${I('x')}</button></header><div class="bq-stage" id="bq-stage"></div>`;
  document.body.appendChild(root);stage=$('#bq-stage',root);
  root.addEventListener('click',onClick);
  document.addEventListener('keydown',e=>{if(!root.hidden&&e.key==='Escape'){e.stopPropagation();back();}},true);
}
function icons(){try{window.lucide?.createIcons?.();}catch{}try{API()?.icons?.();}catch{}}
function render(html,name){if(cleanup){try{cleanup();}catch{}cleanup=null;}current=name;stage.innerHTML=html;stage.scrollTop=0;$('#bq-keys',root).textContent=bqKeys();icons();}
let backTo=null;
function back(){if(backTo){const f=backTo;backTo=null;f();}else close();}
function open(where){build();bq();skills();API()?.closeModal?.();SND()?.stop?.();root.hidden=false;document.body.classList.add('bq-open');(where==='friends'?friends:where==='badges'?badgeCase:map)();}
function close(){if(cleanup){try{cleanup();}catch{}cleanup=null;}music(false);SND()?.stop?.();clearInterval(hlTimer);if(root)root.hidden=true;document.body.classList.remove('bq-open');try{SND()?.theme?.('trail');}catch{}decorate(true);}
const actions={};
function onClick(e){const b=e.target.closest('[data-bq]');if(!b||!root.contains(b))return;const a=b.dataset.bq;
  if(a==='back')return back();if(a==='close')return close();
  const f=actions[a];if(f){e.preventDefault();f(b.dataset.arg,b);}}

/* ---------- map ---------- */
function map(){
  backTo=null;const b=bq();SND()?.scene?.('bc');
  const games=[
    {id:'surf',name:'Sound Surf',art:'assets/pokemon/728.webp',open:b.q.honolulu>=1,hint:'Start Honolulu to play'},
    {id:'salmon',name:'Salmon Leap',art:'assets/pokemon/349.webp',open:b.q.barkley>=1,hint:'Start Barkley Sound to play'},
    {id:'forge',name:'Klefki’s Key Forge',art:'assets/pokemon/707.webp',open:b.q.paris>=1,hint:'Start Paris to play'},
    {id:'lava',name:'Lava Letters',art:'assets/pokemon/'+(owns(30)?'728':'278')+'.webp',open:b.lab.honolulu,hint:'Finish the Honolulu lava lab'},
    {id:'karp',name:'Magikarp’s Climb',art:'assets/pokemon/'+(b.gyarados?'130':'129')+'.webp',open:true,hint:''}
  ];
  render(`<section class="bq-map"><div class="bq-strip" role="list">${D.STOPS.map(s=>{const o=isOpen(s.id),q=b.q[s.id],done=stopDone(s.id);return `<button class="bq-stop ${o?'':'locked'} ${done?'done':''}" role="listitem" data-bq="${o?'fly':'locked'}" data-arg="${s.id}" style="--c:${s.color}"><img src="assets/bg-${s.id}.webp" alt="" loading="lazy"><span class="bq-stop-body"><span class="bq-eyebrow">${E(s.country)}</span><strong>${E(s.place)}</strong><span class="bq-keys-row">${[0,1,2].map(k=>`<span class="k ${k<q?'on':''}">${I('key-round')}</span>`).join('')}${done?`<span class="bq-pill">${s.badge?E(s.badge)+' Badge':'Stamp'}</span>`:''}</span>${o?'':`<span class="bq-lock">${I('lock-keyhole')} ${E(lockText(s.id))}</span>`}</span></button>`;}).join('')}</div>
  <h3 class="bq-h">Play</h3><div class="bq-games">${games.map(x=>`<button class="bq-game ${x.open?'':'locked'}" data-bq="${x.open?'game':'locked-game'}" data-arg="${x.id}"><img src="${x.art}" alt=""><strong>${E(x.name)}</strong>${x.open?'':`<span>${E(x.hint)}</span>`}</button>`).join('')}</div>
  <div class="bq-row"><button class="bq-btn" data-bq="badges">${I('award')} Badge case</button><button class="bq-btn" data-bq="friends">${I('paw-print')} Badge Quest friends</button>${stopDone('paris')?`<button class="bq-btn" data-bq="postcard">${I('mail')} Postcard from Yuki</button>`:''}</div></section>`,'map');
  if(!b.mapHeard){b.mapHeard=true;save();say('map',D.CLIPS.map);}
  setTimeout(checkEvolutions,400);
}
actions.locked=id=>{sfx('gentle',.6);say(null,lockText(id));API()?.toast?.(lockText(id));};
actions['locked-game']=()=>{sfx('gentle',.6);};
actions.fly=id=>hop(id);
actions.badges=()=>badgeCase();
actions.friends=()=>friends();
actions.postcard=()=>postcard();
actions.game=id=>{backTo=map;({surf:()=>soundSurf({}),salmon:()=>soundSurf({cvc:true}),forge:()=>keyForge({}),lava:()=>lavaLetters({}),karp:()=>magikarp()})[id]?.();};

/* ---------- travel hop (3 s, skippable) ---------- */
function hop(id){
  const s=stopById(id),boat=id==='barkley';backTo=map;
  render(`<section class="bq-hop" style="--c:${s.color}"><div class="bq-sky"><span class="bq-cloud c1"></span><span class="bq-cloud c2"></span><span class="bq-cloud c3"></span><span class="bq-craft ${boat?'boat':''}">${I(boat?'sailboat':'plane')}</span>${boat?'<span class="bq-sea"></span>':''}</div><p class="bq-hop-to">${boat?'Sailing':'Flying'} to <strong>${E(s.place)}</strong></p><button class="bq-btn" data-bq="skip" data-arg="${id}" data-initial-focus>Skip ${I('chevrons-right')}</button></section>`,'hop');
  sfx('move',.5);const t=setTimeout(()=>stopView(id),3000);cleanup=()=>clearTimeout(t);
}
actions.skip=id=>stopView(id);

/* ---------- stop scene ---------- */
const SPOT_POS=[{x:12,y:58},{x:82,y:30},{x:66,y:66}];
function stopView(id){
  const s=stopById(id),b=bq();backTo=map;SND()?.scene?.(SCENE[id]);
  const q=b.q[id],hasLab=!!D.LABS[id];
  const nodes=[0,1,2].map(i=>({kind:'quest',i,label:s.quests[i].stop,done:q>i,open:q===i}));
  if(hasLab)nodes.push({kind:'lab',label:D.LABS[id].title,done:b.lab[id],open:q>=3&&!b.lab[id]});
  nodes.push({kind:'boss',label:id==='paris'?'Key Forge boss':id==='barkley'?'Salmon Leap':'Surf boss',done:b.boss[id],open:q>=3&&(!hasLab||b.lab[id])&&!b.boss[id]});
  const spots=s.spotters.map((p,i)=>{const r=D.ROSTER.find(x=>x.id===p.id);if(!r)return '';const show=q>i,got=owns(r.index);const pos=SPOT_POS[i%3];return show&&!got?`<button class="bq-spot" data-bq="spot" data-arg="${r.index}" style="left:${pos.x}%;top:${pos.y}%" aria-label="Something is hiding here"><img src="assets/pokemon/${r.id}.webp" alt=""></button>`:'';}).join('');
  render(`<section class="bq-scene" style="--c:${s.color}"><div class="bq-bg"><img src="assets/bg-${id}.webp" alt="${E(s.place)}">${spots}<img class="bq-npc" src="assets/char-${id}.webp" alt="${E(s.npc)}, ${E(s.role)}"></div>
  <div class="bq-scene-card"><span class="bq-eyebrow">${E(s.country)}</span><h3>${E(s.place)}</h3><p>${sylText(s.summary)}</p>
  <ol class="bq-path">${nodes.map(n=>`<li><button class="bq-node ${n.done?'done':''} ${n.open?'next':''}" ${n.done||n.open?'':'disabled'} data-bq="node" data-arg="${id}:${n.kind}:${n.i??''}">${I(n.done?'check':n.kind==='lab'?'flask-conical':n.kind==='boss'?'swords':'book-open')}<span>${E(n.label)}</span></button></li>`).join('')}</ol>
  ${stopDone(id)?`<p class="bq-done-note">${I('badge-check')} ${E(s.place)} explored. ${s.fact?E(s.fact):'Come back any time to play the games again.'}</p>`:''}</div></section>`,'stop');
}
actions.node=arg=>{const [id,kind,i]=arg.split(':');if(kind==='quest')story(id,+i);else if(kind==='lab')lab(id);else boss(id);};
actions.spot=idx=>{const r=roster(+idx);if(!r)return;window.QuestProgress?.unlockPoke?.(r.index);sfx('collect',.8);confetti();
  showCard(`<img class="bq-big" src="${sprite(r)}" alt=""><h3>You found ${E(r.name)}</h3><p>${E(r.name)} was hiding in the scene. It wants to travel with you.</p>`,()=>stopView(r.stop));
  decorate(true);};

/* ---------- story and question ---------- */
function story(id,i){
  const s=stopById(id),Q=s.quests[i];backTo=()=>stopView(id);
  render(`<section class="bq-read"><div class="bq-card bq-story"><span class="bq-eyebrow">${E(Q.kind)} · ${E(Q.stop)}</span><h3>${E(Q.title)}</h3><p class="bq-passage" id="bq-passage">${sylText(Q.short)}</p>
  <div class="bq-row"><button class="bq-btn ghost" data-bq="replay" data-arg="${id}:${i}">${I('volume-2')} Hear it again</button><button class="bq-btn" data-bq="ask" data-arg="${id}:${i}" data-initial-focus>${I('arrow-right')} Next</button></div></div><img class="bq-side" src="assets/char-${id}.webp" alt=""></section>`,'story');
  const p=$('#bq-passage');say(`${id}-s${i}`,Q.short,{progress:x=>highlight(p,x)});cleanup=()=>{clearInterval(hlTimer);SND()?.stop?.();};
}
actions.replay=arg=>{const [id,i]=arg.split(':');const Q=stopById(id).quests[+i],p=$('#bq-passage');say(`${id}-s${i}`,Q.short,{progress:x=>highlight(p,x)});};
actions.ask=arg=>{const [id,i]=arg.split(':');question(id,+i);};
let qState=null;
function question(id,i){
  const s=stopById(id),Q=s.quests[i];backTo=()=>story(id,i);
  qState={id,i,wrong:0,times:[],t0:Date.now()};
  render(`<section class="bq-read"><div class="bq-card"><span class="bq-eyebrow">${E(Q.kind)}</span><h3 class="bq-qtext">${sylText(Q.question)}</h3>
  <div class="bq-opts">${Q.options.map((o,k)=>`<div class="bq-opt-row"><button class="bq-say" data-bq="sayopt" data-arg="${k}" aria-label="Hear ${E(o)}">${I('volume-2')}</button><button class="bq-opt" data-bq="answer" data-arg="${k}">${sylText(o)}</button></div>`).join('')}</div>
  <div class="bq-clue" id="bq-clue" hidden></div></div><img class="bq-side" src="assets/char-${id}.webp" alt=""></section>`,'question');
  say(`${id}-q${i}`,Q.question+' '+Q.options.join('. '));
}
actions.sayopt=k=>{const Q=stopById(qState.id).quests[qState.i];speakWord(Q.options[+k]);};
actions.answer=(k,btn)=>{
  const {id,i}=qState,s=stopById(id),Q=s.quests[i];k=+k;const now=Date.now();
  if(btn.classList.contains('nope'))return;
  if(k!==Q.answer){qState.wrong++;qState.times.push(now);btn.classList.add('nope');btn.setAttribute('aria-disabled','true');sfx('gentle',.6);
    const c=$('#bq-clue');c.hidden=false;c.innerHTML=`${I('search')} <span>Look back: ${sylText(Q.clue)}</span>`;icons();say(null,'Look back. '+Q.clue);return;}
  /* Correct. Wrong answers never cost anything. Grit only for real retries, not fast tapping through every button. */
  const cycling=qState.times.length>0&&qState.times.some((t,j)=>(j?t-qState.times[j-1]:t-qState.t0)<900);
  btn.classList.add('yes');sfx('match',.8);
  const b=bq();const first=b.q[id]===i;if(first){b.q[id]=i+1;save();}
  setTimeout(()=>keyReward(id,i,first,qState.wrong>0&&!cycling),600);
};
function keyReward(id,i,first,grit){
  const s=stopById(id);
  showCard(`<div class="bq-keydrop">${I('key-round')}</div><h3>${first?'You earned a key':'You found it again'}</h3><p>${E(s.quests[i].title)}. ${first?'Key '+(i+1)+' of 3 in '+E(s.place)+'.':''}</p>${grit?`<p class="bq-grit">${I('mountain')} That took grit. Trying again is how brains grow.</p>`:''}`,()=>stopView(id));
  SND()?.celebrate?.(2);if(grit)setTimeout(()=>say('grit',D.CLIPS.grit),900);
  try{window.Play?.addXP?.(10);}catch{}
  decorate(true);
}

/* ---------- generic card ---------- */
function showCard(html,next,label='Keep going'){
  const prev=current;render(`<section class="bq-center"><div class="bq-card bq-reward">${html}<button class="bq-btn" data-bq="cardnext" data-initial-focus>${E(label)} ${I('arrow-right')}</button></div></section>`,'card');
  actions.cardnext=()=>{actions.cardnext=null;next();};backTo=()=>next();void prev;
}

/* ---------- field labs ---------- */
function lab(id){
  backTo=()=>stopView(id);const L=D.LABS[id];
  if(id==='honolulu')return lavaLab(L);if(id==='paris')return towerLab(L);
}
function labDone(id,L){const b=bq();b.lab[id]=true;save();SND()?.celebrate?.(2);confetti();
  showCard(`<span class="bq-eyebrow">Field lab</span><h3>${E(L.title)}</h3><p>${sylText(L.done)}</p>`,()=>stopView(id));say(null,L.done);}
function lavaLab(L){
  const vents=[{x:47,y:22},{x:40,y:42},{x:55,y:58},{x:44,y:74}];let next=0;const order=shuffle([0,1,2,3]);
  render(`<section class="bq-lab"><div class="bq-card"><span class="bq-eyebrow">Field lab</span><h3>${E(L.title)}</h3><p>${sylText(L.mission)}</p></div>
  <div class="bq-volcano" id="bq-volc"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><rect x="0" y="80" width="100" height="20" fill="#3a8fd0"/><path d="M5 82 L48 12 L60 22 L96 82 Z" fill="#6b4a3a"/><path id="bq-lava" d="M48 14 L40 42 L55 58 L44 74 L40 86" stroke="#ff7a1a" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="100" stroke-dashoffset="100" pathLength="100"/><ellipse id="bq-land" cx="40" cy="86" rx="0" ry="3" fill="#2a2522"/></svg>
  ${order.map(k=>`<button class="bq-vent" data-bq="vent" data-arg="${k}" style="left:${vents[k].x}%;top:${vents[k].y}%" aria-label="Vent ${k+1}"><span></span></button>`).join('')}</div>
  <p class="bq-hint" id="bq-hint">Tap the vent nearest the top first.</p></section>`,'lab');
  say('lab-honolulu',L.mission);
  actions.vent=(k,btn)=>{k=+k;if(btn.classList.contains('open'))return;
    if(k!==next){btn.classList.add('steam');setTimeout(()=>btn.classList.remove('steam'),700);sfx('gentle',.5);$('#bq-hint').textContent='Puff of steam. Lava flows downhill, so start higher up the mountain.';return;}
    btn.classList.add('open');sfx('tap',.7);next++;const lv=$('#bq-lava');lv.style.strokeDashoffset=String(100-next*22);
    $('#bq-hint').textContent=next<4?'The lava is moving. Which vent is next, going down?':'Here it comes.';
    if(next===4){lv.style.strokeDashoffset='0';const land=$('#bq-land');let r=0;const t=setInterval(()=>{r+=1;land.setAttribute('rx',String(r));if(r>=14){clearInterval(t);labDone('honolulu',L);}},60);cleanup=()=>clearInterval(t);}
  };
}
function towerLab(L){
  const stack=[];
  const draw=()=>{$('#bq-tower').innerHTML=stack.map((s,i)=>`<span class="bq-piece ${s}" style="bottom:${i*18}%"></span>`).join('');$('#bq-count').textContent=`${stack.length} of 5`;};
  render(`<section class="bq-lab"><div class="bq-card"><span class="bq-eyebrow">Field lab</span><h3>${E(L.title)}</h3><p>${sylText(L.mission)}</p></div>
  <div class="bq-tower-wrap"><div class="bq-tower" id="bq-tower"></div><div class="bq-wind" id="bq-wind">${I('wind')}</div></div>
  <div class="bq-row center"><button class="bq-btn shape" data-bq="piece" data-arg="tri"><span class="bq-shape tri"></span> Triangle</button><button class="bq-btn shape" data-bq="piece" data-arg="sq"><span class="bq-shape sq"></span> Square</button><span class="bq-stat" id="bq-count">0 of 5</span></div>
  <p class="bq-hint" id="bq-hint">Pick a shape for the next level.</p></section>`,'lab');
  say('lab-paris',L.mission);let busy=false;
  actions.piece=async kind=>{if(busy||stack.length>=5)return;busy=true;stack.push(kind);draw();sfx('tap',.6);
    const t=$('#bq-tower'),w=$('#bq-wind');await wait(350);w.classList.add('blow');t.classList.add('gust');sfx('move',.4);await wait(900);w.classList.remove('blow');t.classList.remove('gust');
    if(kind==='sq'){const p=$$('.bq-piece',t).pop();p?.classList.add('fall');sfx('gentle',.5);$('#bq-hint').textContent='The square wobbled in the wind and slid off. Try the other shape.';await wait(600);stack.pop();draw();}
    else $('#bq-hint').textContent=stack.length<5?'The triangle held. Keep building.':'Five levels high, and steady in the wind.';
    busy=false;if(stack.length>=5)setTimeout(()=>labDone('paris',L),700);};
  draw();
}

/* ---------- boss, badge, partner ---------- */
function boss(id){backTo=()=>stopView(id);
  const win=()=>bossWon(id);
  if(id==='honolulu')soundSurf({boss:true,onWin:win});else if(id==='paris')keyForge({boss:true,onWin:win});else soundSurf({boss:true,cvc:true,onWin:win});}
async function bossWon(id){
  const b=bq(),s=stopById(id);const firstTime=!b.boss[id];b.boss[id]=true;if(s.badge)b.badge[id]=true;save();
  if(!firstTime)return stopView(id);
  if(s.badge)await badgeDrop(s);else await stampDrop(s);
  partnerJoins(id);
}
function badgeDrop(s){return new Promise(res=>{const meta=D.BADGES.find(x=>x.name===s.badge);
  render(`<section class="bq-center"><div class="bq-card bq-reward"><div class="bq-badge-drop" style="--b:${meta.color}"><span class="bq-medal big">${I('award')}</span></div><h3>${E(s.badge)} Badge</h3><p>It drops into your badge case.</p><button class="bq-btn" data-bq="cardnext">Keep going ${I('arrow-right')}</button></div></section>`,'badge');
  SND()?.celebrate?.(3);confetti();say('badge-'+s.badge.toLowerCase(),D.CLIPS['badge-'+s.badge.toLowerCase()]);actions.cardnext=()=>res();backTo=()=>res();decorate(true);});}
function stampDrop(s){return new Promise(res=>{render(`<section class="bq-center"><div class="bq-card bq-reward"><div class="bq-stamp">${I('stamp')}<span>${E(s.place)}</span></div><h3>Passport stamp</h3><p>${sylText(s.fact)}</p><button class="bq-btn" data-bq="cardnext">Keep going ${I('arrow-right')}</button></div></section>`,'stamp');
  SND()?.celebrate?.(3);confetti();say('stamp-barkley',D.CLIPS['stamp-barkley']);actions.cardnext=()=>res();backTo=()=>res();});}
function partnerJoins(id){
  const idx=PARTNER[id],r=roster(idx),b=bq();
  if(!owns(idx)){let ch=1/20;try{ch=skills()?.shinyChance?.()||ch;}catch{}if(Math.random()<ch)b.shiny[idx]=true;window.QuestProgress?.unlockPoke?.(idx);save();}
  const sh=b.shiny[idx];sfx('collect',.9);
  showCard(`<img class="bq-big ${sh?'shiny':''}" src="${sprite(r)}" alt=""><h3>${E(r.name)} joined your team</h3>${sh?'<p class="bq-shiny">A shiny one. Very rare, and it chose you.</p>':''}<p>Find ${E(r.name)} with your other Badge Quest friends.</p>`,()=>{if(id==='paris'&&!bq().teaser){bq().teaser=true;save();postcard(()=>stopView(id));}else stopView(id);});
  decorate(true);
}
function postcard(after){backTo=after||map;const T=D.TEASER;
  render(`<section class="bq-center"><div class="bq-card bq-postcard"><span class="bq-eyebrow">Postcard from ${E(T.place)}</span><h3>Snow is on the way</h3><p>${sylText(T.text)}</p><p class="bq-soon">${I('snowflake')} Sapporo is coming soon.</p><button class="bq-btn" data-bq="cardnext">${after?'Keep going':'Back to the map'} ${I('arrow-right')}</button></div></section>`,'postcard');
  say('teaser',T.text);actions.cardnext=()=>(after||map)();}

/* ---------- badge case ---------- */
function badgeCase(){backTo=map;const s=ST(),b=bq();
  const has=x=>x.src==='base'?!!s.badges?.[x.i]:x.src==='bq'?!!b.badge[x.stop]:false;
  render(`<section class="bq-case"><h3 class="bq-h">Badge case</h3><p class="bq-sub">${D.BADGES.filter(has).length} of 12 badges</p><div class="bq-badges">${D.BADGES.map(x=>`<div class="bq-slot ${has(x)?'on':''}" style="--b:${x.color}"><span class="bq-medal">${I(has(x)?'award':x.src==='soon'?'sparkles':'lock-keyhole')}</span><strong>${E(x.name)}</strong><span>${has(x)?'Earned':x.src==='soon'?'Coming soon':x.src==='base'?'Win an arena on the trail':'Badge Quest'}</span></div>`).join('')}</div></section>`,'case');}

/* ---------- friends and Eevee ---------- */
function friends(){backTo=map;const G=g();
  const newOnes=D.ROSTER;
  render(`<section class="bq-friends"><h3 class="bq-h">Eevee’s path</h3><p class="bq-sub">${sylText('Eevee can grow up three ways. Pick the one you like. You can change it any time.')}</p>
  <div class="bq-eevee">${D.EEVEE.map(e=>`<button class="bq-ev ${G.eeveeChoice===e.key?'on':''}" data-bq="eevee" data-arg="${e.key}" aria-pressed="${G.eeveeChoice===e.key}"><img src="assets/pokemon/${e.id}.webp" alt="" class="${bq().eeveeEvolved&&G.eeveeChoice===e.key?'':'sil'}"><strong>${e.key[0].toUpperCase()+e.key.slice(1)} path</strong>${bq().eeveeEvolved&&G.eeveeChoice===e.key?`<span>${E(e.name)}</span>`:''}</button>`).join('')}</div>
  <h3 class="bq-h">Badge Quest friends</h3><p class="bq-sub">${newOnes.filter(r=>owns(r.index)).length} of ${newOnes.length} found</p>
  <div class="bq-pals">${newOnes.map(r=>{const o=owns(r.index);return `<div class="bq-pal ${o?'':'locked'}"><img src="${o?sprite(r):'assets/pokemon/'+r.id+'.webp'}" class="${o?'':'sil'}" alt=""><strong>${o?E(pokeName(r)):'Mystery Pokémon'}</strong><span>${o?(bq().shiny[r.index]?'Shiny · ':'')+E(stopById(r.stop)?.place):r.kind==='partner'?'Partner in '+E(stopById(r.stop)?.place):'Hiding in '+E(stopById(r.stop)?.place)}</span></div>`;}).join('')}</div></section>`,'friends');
  if(!G.eeveeHeard){G.eeveeHeard=true;say('eevee',D.CLIPS.eevee);}
}
actions.eevee=k=>{if(bq().eeveeEvolved)return;g().eeveeChoice=k;save();sfx('tap',.6);friends();};

/* ---------- evolution cinematic ---------- */
function evolve(fromSrc,toSrc,fromName,toName){return new Promise(res=>{
  render(`<section class="bq-center bq-evo"><div class="bq-evo-stage"><img id="bq-evo-a" src="${fromSrc}" alt=""><img id="bq-evo-b" src="${toSrc}" alt="" class="hide"></div><h3 id="bq-evo-t">What? ${E(fromName)} is evolving.</h3><button class="bq-btn" data-bq="cardnext" hidden id="bq-evo-n">Wonderful ${I('arrow-right')}</button></section>`,'evo');
  const st=$('.bq-evo-stage'),a=$('#bq-evo-a'),b=$('#bq-evo-b');say('evolve',D.CLIPS.evolve);sfx('shield',.6);
  st.classList.add('white');let n=0,ms=420;const motion=ST()?.motion!==false;
  const tick=()=>{n++;a.classList.toggle('hide');b.classList.toggle('hide');ms=Math.max(90,ms*.84);if(n<(motion?16:2))tm=setTimeout(tick,ms);else reveal();};
  let tm=setTimeout(tick,900);
  const reveal=()=>{a.classList.add('hide');b.classList.remove('hide');st.classList.remove('white');st.classList.add('reveal');$('#bq-evo-t').textContent=`${fromName} evolved into ${toName}.`;SND()?.celebrate?.(4);confetti();$('#bq-evo-n').hidden=false;$('#bq-evo-n').focus();};
  cleanup=()=>clearTimeout(tm);actions.cardnext=()=>res();backTo=()=>res();});}
let evoBusy=false;
async function checkEvolutions(){
  if(evoBusy||current!=='map'||root.hidden)return;const b=bq(),s=ST(),sk=skills(),G=g();
  const todo=[];
  for(const [stop,idx] of Object.entries(PARTNER)){const r=roster(idx);if(owns(idx)&&!b.evo[idx]){let lv=1;try{lv=sk?._skill?.(SKILL[stop])?.level||1;}catch{}if(lv>=3)todo.push({kind:'p',r});}}
  if(G.eeveeChoice&&!b.eeveeEvolved&&s.badges?.[0]){let ready=false;try{ready=sk?.badgeReady?.('cvc');}catch{}if(ready)todo.push({kind:'e'});}
  if(!todo.length)return;evoBusy=true;
  for(const t of todo){if(t.kind==='p'){const sh=b.shiny[t.r.index]?'shiny/':'';await evolve(`assets/pokemon/${sh}${t.r.id}.webp`,`assets/pokemon/${sh}${t.r.evo.id}.webp`,t.r.name,t.r.evo.name);b.evo[t.r.index]=true;}
    else{const e=D.EEVEE.find(x=>x.key===G.eeveeChoice);await evolve('assets/pokemon/133.webp',`assets/pokemon/${e.id}.webp`,'Eevee',e.name);b.eeveeEvolved=true;}save();}
  evoBusy=false;map();
}

/* ---------- mini-game helpers ---------- */
function gameShell(title,intro,body,extraCls=''){
  return `<section class="bq-play ${extraCls}"><div class="bq-play-top"><h3>${E(title)}</h3><span class="bq-stat" id="bq-score"></span><button class="bq-btn ghost small" data-bq="hear" aria-label="Hear the sound again">${I('volume-2')} Hear it</button></div><p class="bq-sub">${sylText(intro)}</p>${body}</section>`;
}
function finish(o,html,again){music(false);SND()?.celebrate?.(3);confetti();try{window.Play?.addXP?.(15);}catch{}
  if(o.onWin){showCard(html,o.onWin,'Keep going');return;}
  render(`<section class="bq-center"><div class="bq-card bq-reward">${html}<div class="bq-row center"><button class="bq-btn ghost" data-bq="again">${I('rotate-ccw')} Play again</button><button class="bq-btn" data-bq="tomap">${I('map')} Map</button></div></div></section>`,'done');
  actions.again=again;actions.tomap=map;}
/* Anti-cycling: wrong taps made under 700 ms apart are not counted as retries, so they earn no Grit. */
function tapTracker(){let last=0,wrongs=0,real=0,t0=Date.now();return {wrong(){const n=Date.now();wrongs++;if(n-last>700)real++;last=n;},right(){const out={firstTry:wrongs===0,retries:real,ms:Date.now()-t0};wrongs=0;real=0;t0=Date.now();last=0;return out;}};}
function rec(skill,r){try{return skills()?.record?.(skill,r);}catch{return null;}}
function sup(skill){try{return skills()?.support?.(skill)||{};}catch{return {};}}

/* ---------- Sound Surf (magic e) and Salmon Leap (short vowels) ---------- */
function soundSurf(o){
  if(!o.onWin)backTo=map;
  const cvc=!!o.cvc,bank=cvc?D.CVC_SURF:P10.soundSurf,skill=bank.skill,S=sup(skill),b=bq();
  const round=bank.sounds[b.surfRound%bank.sounds.length];b.surfRound++;save();
  const label=cvc?round.phoneme:(D.SURF_SAY[round.phoneme]||round.phoneme);
  const target=o.boss?6:8,max=Math.max(3,Math.min(5,S.wordCount||4));
  const surfer=cvc?'349':'728';
  const title=cvc?'Salmon Leap':'Sound Surf';
  render(gameShell(title,(cvc?'Help the fish jump. ':'')+'Tap every wave with the sound: '+label+'.',`<div class="bq-surf ${cvc?'salmon':''}" id="bq-surf"><img class="bq-surfer" id="bq-surfer" src="assets/pokemon/${surfer}.webp" alt=""><div class="bq-lanes" id="bq-lanes"></div></div>`),'surf');
  music(true);say(cvc?'salmon-intro':'surf-intro',D.CLIPS[cvc?'salmon-intro':'surf-intro']);
  setTimeout(()=>say(null,'Listen for '+label),3600);
  actions.hear=()=>say(null,'Listen for '+label);
  let hits=0;const T=tapTracker(),lanes=$('#bq-lanes');const waves=[];let spawnT=0,last=performance.now(),raf=0,alive=true;
  const motion=ST()?.motion!==false,speed=(motion?9:0)*(S.slowAudio?.75:1);/* % per second */
  const score=()=>{$('#bq-score').innerHTML=`${I('waves')} ${hits} / ${target}`;icons();};score();
  let pool=[];const pick=()=>{if(!pool.length)pool=shuffle([...round.hits,...round.hits,...round.misses]);return pool.pop();};
  function spawn(){if(waves.length>=max)return;const lane=[0,1,2].find(l=>!waves.some(w=>w.lane===l&&w.x>60))??-1;if(lane<0)return;
    const word=pick(),el=document.createElement('button');el.className='bq-wave';el.innerHTML=`<span>${sylWord(word)}</span>`;el.setAttribute('aria-label',word);
    const w={el,word,lane,x:motion?104:15+waves.length*20,hit:round.hits.includes(word)};el.style.top=(8+lane*31)+'%';el.style.left=w.x+'%';
    el.addEventListener('click',()=>tap(w));lanes.appendChild(el);waves.push(w);}
  function remove(w){const i=waves.indexOf(w);if(i>=0)waves.splice(i,1);w.el.remove();}
  function tap(w){if(!alive||w.done)return;speakWord(w.word,S.slowAudio);
    if(w.hit){w.done=true;hits++;const r=T.right();rec(skill,r);w.el.classList.add('pop');sfx('jump',.7);const sf=$('#bq-surfer');sf.classList.remove('jump');void sf.offsetWidth;sf.classList.add('jump');score();setTimeout(()=>remove(w),400);
      if(hits>=target){alive=false;setTimeout(()=>finish(o,`<img class="bq-big" src="assets/pokemon/${surfer}.webp" alt=""><h3>${cvc?'The salmon made it home':'What a ride'}</h3><p>${target} waves with ${E(label)}.</p>`,()=>soundSurf(o)),700);}}
    else{T.wrong();w.el.classList.add('wobble');sfx('gentle',.4);setTimeout(()=>w.el.classList.remove('wobble'),500);}}
  function loop(t){if(!alive)return;const dt=Math.min(.1,(t-last)/1000);last=t;spawnT-=dt;if(spawnT<=0){spawn();spawnT=motion?1.5:.2;}
    for(const w of waves.slice()){if(w.done)continue;w.x-=speed*dt;w.el.style.left=w.x+'%';if(w.x<-22)remove(w);}raf=requestAnimationFrame(loop);}
  raf=requestAnimationFrame(loop);cleanup=()=>{alive=false;cancelAnimationFrame(raf);music(false);};
}

/* ---------- Klefki's Key Forge (vowel teams) ---------- */
const TEAMS=['ai','ee','oa','ea','ay','oo','ie','ue'];
function keyForge(o){
  if(!o.onWin)backTo=map;
  const bank=P10.keyForge,skill=bank.skill,S=sup(skill),target=o.boss?5:6;const words=shuffle(bank.words).slice(0,target);
  let n=0;const T=tapTracker();let wrongHere=0;
  render(gameShell('Klefki’s Key Forge','Pick the two letters that finish the word. Then the key fits the lock.',`<div class="bq-forge"><img class="bq-klefki" src="assets/pokemon/707.webp" alt=""><div class="bq-key" id="bq-key"></div><div class="bq-tiles" id="bq-tiles"></div><div class="bq-ring" id="bq-ring"></div></div>`),'forge');
  music(true);say('forge-intro',D.CLIPS['forge-intro']);
  const score=()=>{$('#bq-score').innerHTML=`${I('key-round')} ${n} / ${target}`;icons();};
  function show(){score();wrongHere=0;const w=words[n],m=w.missing,team=w.word.slice(m[0],m[m.length-1]+1);
    $('#bq-key').innerHTML=[...w.word].map((c,i)=>m.includes(i)?`<span class="slot"></span>`:`<span>${E(c)}</span>`).join('');
    const count=S.wordCount<=4?2:3;const dec=shuffle(TEAMS.filter(t=>t!==team)).slice(0,count-1);
    $('#bq-tiles').innerHTML=shuffle([team,...dec]).map(t=>`<button class="bq-tile" data-bq="tile" data-arg="${t}">${E(t)}</button>`).join('');
    actions.hear=()=>speakWord(w.word,S.slowAudio);setTimeout(()=>speakWord(w.word,S.slowAudio),n?300:4200);
    actions.tile=(t,btn)=>{if(btn.classList.contains('nope'))return;
      if(t!==team){T.wrong();wrongHere++;btn.classList.add('nope');sfx('gentle',.4);speakWord(w.word,true);if(wrongHere>=2||S.pictureCue)$$('.bq-tile').forEach(x=>{if(x.dataset.arg===team)x.classList.add('glow');});return;}
      rec(skill,T.right());$$('.slot').forEach((s,i)=>{s.textContent=team[i]||'';s.classList.add('fill');});sfx('key',.7);speakWord(w.word);
      $('#bq-ring').insertAdjacentHTML('beforeend',`<span class="bq-ring-key">${I('key-round')}<b>${E(w.word)}</b></span>`);icons();n++;
      setTimeout(()=>{if(n>=target)finish(o,`<img class="bq-big" src="assets/pokemon/707.webp" alt=""><h3>Klefki’s ring is jingling</h3><p>You forged ${target} keys: ${words.map(x=>E(x.word)).join(', ')}.</p>`,()=>keyForge(o));else show();},900);};}
  show();cleanup=()=>music(false);
}

/* ---------- Lava Letters (letter formation, tracing) ---------- */
const arc=(cx,cy,rx,ry,a0,a1,n=18)=>Array.from({length:n+1},(_,i)=>{const a=(a0+(a1-a0)*i/n)*Math.PI/180;return [cx+rx*Math.cos(a),cy+ry*Math.sin(a)];});
const ln=(x0,y0,x1,y1,n=8)=>Array.from({length:n+1},(_,i)=>[x0+(x1-x0)*i/n,y0+(y1-y0)*i/n]);
const BOWL=()=>arc(48,60,18,20,-10,-370);
const LETTERS={
  c:[arc(50,60,20,20,-45,-315)],o:[arc(50,60,20,20,-90,-450)],a:[BOWL(),ln(68,40,68,80)],d:[BOWL(),ln(68,10,68,80)],
  g:[BOWL(),[...ln(68,40,68,95),...arc(54,95,14,10,0,170)]],l:[ln(50,10,50,80)],t:[ln(50,15,50,80),ln(35,40,65,40)],
  i:[ln(50,42,50,80),ln(50,25,50,28,2)],h:[ln(35,10,35,80),[...arc(52,58,17,18,180,360),...ln(69,58,69,80,4)]],
  k:[ln(38,10,38,80),[...ln(66,40,38,64,5),...ln(38,64,68,80,5)]],b:[ln(35,10,35,80),arc(52,60,17,20,180,540)],
  p:[ln(35,40,35,105),arc(52,60,17,20,180,540)],q:[BOWL(),ln(68,40,68,105)],j:[[...ln(55,42,55,95),...arc(43,95,12,10,0,170)],ln(55,25,55,28,2)],
  y:[ln(35,40,52,78),ln(68,40,40,105)],s:[[...arc(50,50,15,10,-20,-270),...arc(50,70,15,10,-90,150)]],
  e:[[...ln(31,60,69,60,6),...arc(50,60,19,20,0,-320)]],n:[ln(35,40,35,80),[...arc(52,58,17,18,180,360),...ln(69,58,69,80,4)]],
  m:[ln(28,40,28,80),[...arc(40,55,12,15,180,360),...ln(52,55,52,80,4)],[...arc(64,55,12,15,180,360),...ln(76,55,76,80,4)]],
  r:[ln(38,40,38,80),arc(52,56,14,14,180,320)]
};
function lavaLetters(o){
  backTo=map;
  const b=bq(),sets=P10.lavaLetters.sets,set=sets[b.lavaSet%sets.length];b.lavaSet++;save();
  const skill='letterForm',S=sup(skill);let li=0,attempt=1;
  render(gameShell('Lava Letters','Start at the green dot and trace the glowing letter with your finger.',`<div class="bq-lava ${b.left?'left':''}"><div class="bq-lava-side"><div class="bq-lava-queue" id="bq-queue"></div><button class="bq-btn ghost small" data-bq="clear">${I('eraser')} Clear</button><button class="bq-btn ghost small" data-bq="hand" aria-pressed="${b.left}">${I('hand')} ${b.left?'Left hand':'Right hand'}</button></div><canvas id="bq-canvas" width="600" height="660" aria-label="Tracing area"></canvas></div>`),'lava');
  music(true);say('lava-intro',D.CLIPS['lava-intro']);
  const cv=$('#bq-canvas'),cx=cv.getContext('2d');let ink=[],cur=null,anim=0,dotT=0,alive=true;
  const SC=6;const P=([x,y])=>[x*SC,y*SC];const TOL=S.slowAudio?17:14;
  const strokes=()=>LETTERS[set[li]]||LETTERS.o;
  const checkpoints=()=>strokes().flat();
  const queue=()=>{$('#bq-queue').innerHTML=set.map((c,i)=>`<span class="${i<li?'done':i===li?'now':''}">${E(c)}</span>`).join('');};
  function draw(){cx.clearRect(0,0,cv.width,cv.height);
    cx.strokeStyle='#efe4cf';cx.lineWidth=2;[40,80].forEach(y=>{cx.beginPath();cx.setLineDash(y===40?[10,10]:[]);cx.moveTo(10,y*SC);cx.lineTo(590,y*SC);cx.stroke();});cx.setLineDash([]);
    cx.lineCap='round';cx.lineJoin='round';
    for(const s of strokes()){cx.strokeStyle='rgba(255,140,40,.28)';cx.lineWidth=TOL*SC*1.3;cx.beginPath();s.forEach((p,i)=>{const [x,y]=P(p);i?cx.lineTo(x,y):cx.moveTo(x,y);});cx.stroke();}
    cx.strokeStyle='#c2551b';cx.lineWidth=22;for(const s of ink){if(s.length<2)continue;cx.beginPath();s.forEach(([x,y],i)=>i?cx.lineTo(x,y):cx.moveTo(x,y));cx.stroke();}
    const covered=coverage();strokes().forEach((s,k)=>{const [sx,sy]=P(s[0]);cx.fillStyle='#2f9e57';cx.beginPath();cx.arc(sx,sy,18,0,7);cx.fill();cx.fillStyle='#fff';cx.font='bold 20px Nunito, sans-serif';cx.textAlign='center';cx.textBaseline='middle';cx.fillText(String(k+1),sx,sy+1);});
    /* moving guide dot along the first stroke not yet covered */
    const sIdx=strokes().findIndex(s=>s.some(p=>!near(p)));if(sIdx>=0){const s=strokes()[sIdx],t=(dotT%1),k=Math.floor(t*(s.length-1)),[gx,gy]=P(s[k]);cx.fillStyle='rgba(255,210,60,.95)';cx.beginPath();cx.arc(gx,gy,11,0,7);cx.fill();}
    void covered;}
  function near(p){const [x,y]=P(p),r=TOL*SC;for(const s of ink)for(const [a,b2] of s){if((a-x)**2+(b2-y)**2<r*r)return true;}return false;}
  function coverage(){const cp=checkpoints();return cp.filter(near).length/cp.length;}
  function pos(e){const r=cv.getBoundingClientRect();return [(e.clientX-r.left)*cv.width/r.width,(e.clientY-r.top)*cv.height/r.height];}
  cv.addEventListener('pointerdown',e=>{if(!alive)return;cv.setPointerCapture?.(e.pointerId);cur=[pos(e)];ink.push(cur);e.preventDefault();});
  cv.addEventListener('pointermove',e=>{if(!cur)return;cur.push(pos(e));e.preventDefault();});
  const check=()=>{if(alive&&coverage()>=.85)letterDone();};const up=()=>{if(!cur)return;cur=null;check();};
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
  function letterDone(){const c=set[li];rec(skill,{firstTry:attempt===1,retries:Math.min(3,attempt-1),ms:0});sfx('match',.8);speakWord(c);li++;attempt=1;ink=[];queue();
    if(li>=set.length){alive=false;finish(o,`<div class="bq-lava-done">${set.map(x=>`<span>${E(x)}</span>`).join('')}</div><h3>Hot letters</h3><p>You traced ${set.join(', ')}. Your hand is learning the shapes.</p>`,()=>lavaLetters(o));}}
  actions.clear=()=>{if(ink.length){attempt++;ink=[];}};
  actions.hand=()=>{b.left=!b.left;save();const w=$('.bq-lava');w.classList.toggle('left',b.left);const h=$('[data-bq="hand"]');h.setAttribute('aria-pressed',b.left);h.innerHTML=`${I('hand')} ${b.left?'Left hand':'Right hand'}`;icons();};
  actions.hear=()=>speakWord(set[li]);
  const loop=()=>{if(!alive)return;dotT+=ST()?.motion===false?0:.006;draw();anim=requestAnimationFrame(loop);};queue();loop();
  cleanup=()=>{alive=false;cancelAnimationFrame(anim);music(false);};
  /* test hook: lets automated checks trace the current letter exactly */
  api._strokes=()=>strokes();api._trace=()=>{ink=strokes().map(s=>s.map(P));check();};
}

/* ---------- Magikarp's Climb (review) ---------- */
function reviewPool(){const w=new Set();(P10.soundSurf?.sounds||[]).forEach(s=>s.hits.forEach(x=>w.add(x)));(P10.keyForge?.words||[]).forEach(x=>w.add(x.word));D.CVC_SURF.sounds.forEach(s=>s.hits.forEach(x=>w.add(x)));return [...w];}
function magikarp(){
  backTo=map;
  const b=bq(),skill='review',S=sup(skill),pool=reviewPool(),goal=P10.magikarp?.evolveAt||100,per=10;let jumps=0;const T=tapTracker();
  const form=b.gyarados?'130':'129';
  render(gameShell('Magikarp’s Climb','I say a word. You tap it. Magikarp jumps up the waterfall.',`<div class="bq-karp"><div class="bq-fall"><div class="bq-meter"><span id="bq-meter"></span></div><img id="bq-fish" class="bq-fish" src="assets/pokemon/${form}.webp" alt="${b.gyarados?'Gyarados':'Magikarp'}"></div><div><p class="bq-target" id="bq-target" aria-live="polite"></p><div class="bq-bubbles" id="bq-bubbles"></div><p class="bq-sub" id="bq-total"></p></div></div>`),'karp');
  music(true);say('karp-intro',D.CLIPS['karp-intro']);
  let word='';
  const upd=()=>{$('#bq-score').innerHTML=`${I('arrow-up')} ${jumps} / ${per}`;$('#bq-total').textContent=b.gyarados?`${b.karp} jumps so far. Gyarados is strong.`:`${b.karp} of ${goal} jumps to grow strong.`;$('#bq-meter').style.height=Math.min(100,b.karp/goal*100)+'%';$('#bq-fish').style.bottom=(4+jumps/per*70)+'%';icons();};
  function next(first){word=rnd(pool);const n=Math.min(4,Math.max(2,(S.wordCount||4)-2));const opts=shuffle([word,...shuffle(pool.filter(x=>x!==word)).slice(0,n-1)]);
    $('#bq-bubbles').innerHTML=opts.map(x=>`<button class="bq-bubble" data-bq="karp" data-arg="${E(x)}">${sylWord(x)}</button>`).join('');
    const spoken=!!(SND()?.state?.().voice&&('speechSynthesis' in window));$('#bq-target').innerHTML=spoken?`${I('ear')} Listen, then tap the word`:`Tap <strong>${E(word)}</strong>`;icons();
    setTimeout(()=>speakWord(word,S.slowAudio),first?4600:250);}
  actions.hear=()=>speakWord(word,S.slowAudio);
  actions.karp=(x,btn)=>{if(btn.classList.contains('nope'))return;
    if(x!==word){T.wrong();btn.classList.add('nope');sfx('gentle',.4);speakWord(x);setTimeout(()=>speakWord(word,true),700);return;}
    rec(skill,T.right());jumps++;b.karp++;save();sfx('jump',.8);const f=$('#bq-fish');f.classList.remove('hop');void f.offsetWidth;f.classList.add('hop');upd();
    if(b.karp%10===0){const k=Math.floor(b.karp/10)%4;say('karp-'+k,P10.magikarp?.lines?.[k]||'Every splash counts.');}
    if(!b.gyarados&&b.karp>=goal){b.gyarados=true;save();music(false);setTimeout(async()=>{await evolve('assets/pokemon/129.webp','assets/pokemon/130.webp','Magikarp','Gyarados');say('karp-evolve',D.CLIPS['karp-evolve']);magikarp();},700);return;}
    if(jumps>=per)setTimeout(()=>finish({},`<img class="bq-big" src="assets/pokemon/${b.gyarados?'130':'129'}.webp" alt=""><h3>Ten jumps higher</h3><p>${b.gyarados?b.karp+' jumps. Gyarados is roaring.':b.karp+' of '+goal+' jumps. Every splash counts.'}</p>`,()=>magikarp()),600);
    else setTimeout(()=>next(false),550);};
  upd();next(true);cleanup=()=>music(false);
  api._karpWord=()=>word;
}

/* ---------- integration with the main game ---------- */
function panelHtml(){const s=ST(),b=bq();const n=D.BADGES.filter(x=>x.src==='base'?!!s.badges?.[x.i]:x.src==='bq'?!!b.badge[x.stop]:false).length;
  return `<section class="bq-panel" aria-label="Badge Quest"><div class="bq-panel-art"><img src="assets/pokemon/${owns(30)?728:349}.webp" alt=""><img src="assets/pokemon/${owns(31)?653:707}.webp" alt=""></div><div class="bq-panel-text"><span class="bq-eyebrow">New adventure</span><h3>Badge Quest</h3><p>Barkley Sound, Honolulu and Paris. ${bqKeys()} of 9 keys · ${n} of 12 badges.</p></div><div class="bq-panel-actions"><button class="bq-btn" data-bqo="map">${I('plane')} Fly</button><button class="bq-btn ghost" data-bqo="badges">${I('award')} Badges</button></div></section>`;}
function topbar(){const s=ST();if(!s)return;const k=$('#key-count'),p=$('#pet-count'),np=$('#nav-pets');
  const keys=String((s.done||0)+bqKeys());let team=0;try{team=API().ownedTeam().length;}catch{}const pets=String(team+unlocked().length);
  if(k&&k.textContent!==keys)k.textContent=keys;if(p&&p.textContent!==pets)p.textContent=pets;if(np&&np.textContent!==pets)np.textContent=pets;
  const ks=k?.nextElementSibling,ps=p?.nextElementSibling;if(ks&&ks.textContent!=='/ 27')ks.textContent='/ 27';if(ps&&ps.textContent!=='/ 40')ps.textContent='/ 40';}
function petsSection(){const pals=D.ROSTER;return `<section class="bq-pets" aria-label="Badge Quest friends"><div class="bq-pets-head"><h2>Badge Quest friends</h2><button class="bq-btn ghost small" data-bqo="friends">${I('plane')} Open Badge Quest</button></div><div class="bq-pals">${pals.map(r=>{const o=owns(r.index);return `<div class="bq-pal ${o?'':'locked'}"><img src="${o?sprite(r):'assets/pokemon/'+r.id+'.webp'}" class="${o?'':'sil'}" alt=""><strong>${o?E(pokeName(r)):'Mystery Pokémon'}</strong><span>${E(stopById(r.stop)?.place)}</span></div>`;}).join('')}</div></section>`;}
function decorate(force){
  if(!ST())return;try{bq();}catch{return;}topbar();
  const main=$('#main');if(!main)return;
  const hub=$('.adv-hub',main),old=$('.bq-panel',main);
  if(hub&&(!old||force)){old?.remove();const strip=$('.growth-strip',main);if(strip)strip.insertAdjacentHTML('afterend',panelHtml());else hub.insertAdjacentHTML('beforebegin',panelHtml());icons();}
  const grid=$('.collection-grid',main);
  if(grid&&(!$('.bq-pets',main)||force)){$('.bq-pets',main)?.remove();grid.insertAdjacentHTML('afterend',petsSection());icons();
    $$('p',main).forEach(x=>{if(/of 30 Pokémon discovered/.test(x.textContent)){let team=0;try{team=API().ownedTeam().length;}catch{}x.textContent=x.textContent.replace(/\d+ of 30 Pokémon discovered/,`${team+unlocked().length} of 40 Pokémon discovered`);}});}
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-bqo]');if(!b)return;e.preventDefault();open(b.dataset.bqo==='map'?'':b.dataset.bqo);});
let pend=0;const mo=new MutationObserver(()=>{if(!pend)pend=requestAnimationFrame(()=>{pend=0;try{decorate(false);}catch(e){console.warn(e);}});});
function boot(){if(!window.GrowthAPI?.state||!D){setTimeout(boot,200);return;}bq();skills();build();mo.observe(document.body,{childList:true,subtree:true,characterData:true});decorate(false);}
const api={open,close,sanitize,state:()=>bq(),keys:bqKeys,_decorate:decorate};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
return api;
})();
