/* Adventure layer: easy reading support, read-along, Word Sparks, Explorer TV prizes, and Mystery Eggs. */
window.Adventure=(()=>{
const D=window.ADVENTURE_DATA,V=window.EXPEDITION_VIDEOS||[],W=window.WORLDS||[];
const A=()=>window.GrowthAPI,S=()=>window.QuestSound,X=()=>window.Expedition;
const st=()=>A()?.state||{},g=()=>st().g||{};
const $=(q,r=document)=>r.querySelector(q),$$=(q,r=document)=>[...r.querySelectorAll(q)];
const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const I=n=>`<i data-lucide="${n}" aria-hidden="true"></i>`;
const save=()=>{try{window.Growth?.save()}catch{}};
const icons=()=>{try{A()?.icons()}catch{}};
const toast=m=>{try{A()?.toast(m)}catch{}};
const thumb=id=>`https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg`;
const prizeIds=()=>{const L=window.EXPEDITION_DATA?.labs||[];return L.map(row=>row.map(l=>l.video));};
const allVideos=()=>V.flatMap((row,L)=>row.map(v=>({...v,L})));
const easyOn=()=>g().easyRead!==false;
const keyOf=w=>w.toLowerCase().replace(/[^a-zà-ÿ'’-]/g,'').replace(/[’']s$/,'');

/* ---------- Counters ---------- */
function counts(){const x=g();const spotted=Object.keys(x.spotted||{}).length,patience=Object.keys(x.patience||{}).length,gratitude=Object.keys(x.gratitude||{}).length,sparks=Object.keys(x.sparks||{}).length;
 const tickets=Math.max(0,patience+gratitude+spotted-(x.tvBought||[]).length);
 const warmth=(st().done||0)+spotted*2+patience+gratitude+Math.floor(sparks/3);
 const hatched=x.hatched||[];const ready=D.eggs.map((e,i)=>!hatched.includes(i)&&warmth>=e.need).filter(Boolean).length;
 return {spotted,patience,gratitude,sparks,tickets,warmth,hatched,ready};}
function totalSparks(){return Object.values(D.cards).reduce((a,c)=>a+c.sparks.length,0);}

/* ---------- Read-along timing ---------- */
let along=null,raf=0;
function weights(words){let t=0;return words.map(w=>{const len=w.textContent.length;let wt=len+1.5;if(/[.!?]["”’]?$/.test(w.textContent))wt+=7;else if(/[,;:]["”’]?$/.test(w.textContent))wt+=3;t+=wt;return t;}).map(v=>v/t);}
function beginAlong(id){stopAlong();let m=/^g-(\d)-(\d)-(\d)$/.exec(id);if(m){const pas=$(`.g-passage[data-page="${m[3]}"]`);if(!pas)return;const words=$$('.w',pas);if(!words.length)return;along={kind:'story',words,cum:weights(words),x:0,rate:0,t:performance.now(),id,pas};pas.classList.add('adv-reading');}
 else if((m=/^gq-(\d)-(\d)-(\d)$/.exec(id))){const h=$('.g-task-title h3')||$('.battle-question-head + h3');const opts=$$('.g-options .g-option');if(!h||opts.length<3)return;const parts=[h,...opts];const lens=parts.map(p=>p.textContent.length+6);let t=0;const tot=lens.reduce((a,b)=>a+b,0);along={kind:'question',parts,cum:lens.map(v=>(t+=v)/tot),x:0,rate:0,t:performance.now(),id};}
 else return;
 const tick=()=>{if(!along)return;const now=performance.now();const x=Math.min(1,along.x+along.rate*(now-along.t));paint(x);raf=requestAnimationFrame(tick);};raf=requestAnimationFrame(tick);}
function onProgress(id,x){if(!along||along.id!==id){beginAlong(id);if(!along)return;}const now=performance.now();if(along.x>0&&x>along.x){const dt=now-along.t;if(dt>0)along.rate=(x-along.x)/dt;}along.x=x;along.t=now;}
function paint(x){if(!along)return;if(along.kind==='story'){let i=along.cum.findIndex(c=>c>=x);if(i<0)i=along.words.length-1;along.words.forEach((w,k)=>{w.classList.toggle('now',k===i);w.classList.toggle('done',k<i)});}
 else{let i=along.cum.findIndex(c=>c>=x);if(i<0)i=along.parts.length-1;along.parts.forEach((p,k)=>p.classList.toggle('adv-now',k===i));}}
function stopAlong(done){cancelAnimationFrame(raf);if(!along)return;if(along.kind==='story'){along.words.forEach(w=>{w.classList.remove('now');if(done)w.classList.add('done')});along.pas?.classList.remove('adv-reading');}else along.parts.forEach(p=>p.classList.remove('adv-now'));along=null;}

/* Narration ended on a story card: glow the next button, optionally turn the page. */
let turnTimer=0;
function cardEnded(id){if(!/^g-\d-\d-\d$/.test(id))return;const next=$('[data-growth="next-page"]')||$('[data-growth="reread-next"]');if(!next)return;next.classList.add('adv-ready');
 if(g().autoTurn&&$('[data-growth="next-page"]')){clearTimeout(turnTimer);next.classList.add('adv-counting');next.style.setProperty('--adv-count','3s');turnTimer=setTimeout(()=>{if(document.contains(next)&&next.classList.contains('adv-counting'))next.click();},3200);}}
function cancelTurn(){clearTimeout(turnTimer);$$('.adv-counting').forEach(b=>b.classList.remove('adv-counting'));}

function wrapNarrate(){const s=S();if(!s||s.__adv)return;s.__adv=true;const orig=s.narrate.bind(s);
 s.narrate=(id,o={})=>{stopAlong();cancelTurn();const ok=orig(id,{...o,progress:x=>{o.progress?.(x);onProgress(id,x)},end:()=>{stopAlong(true);cardEnded(id);o.end?.()},error:()=>{stopAlong();o.error?.()}});if(ok)setTimeout(()=>{if(!along)beginAlong(id)},60);return ok;};
 const os=s.stop?.bind(s);if(os)s.stop=()=>{stopAlong();os()};}

/* ---------- Decorate story cards ---------- */
function storyId(){try{return window.Growth.textState().growth.story?.id||null}catch{return null}}
function decoratePassage(pas){if(pas.dataset.advDone)return;pas.dataset.advDone='1';const id=storyId();const card=id&&D.cards[id];const page=+pas.dataset.page;const sparks=new Map((card?.sparks||[]).map(s=>[keyOf(s.word),s]));
 $$('p',pas).forEach(p=>{const words=p.textContent.split(/\s+/).filter(Boolean);p.innerHTML=words.map(w=>{const k=keyOf(w);const sp=sparks.get(k);return `<span class="w${sp?' spark':''}" ${sp?`data-spark="${E(k)}"`:''}>${E(w)}</span>`}).join(' ');});
 if(card){const q=card.quick[page];if(q&&!pas.previousElementSibling?.classList?.contains('adv-quick'))pas.insertAdjacentHTML('beforebegin',`<div class="adv-quick"><span class="adv-quick-tag">${I('eye')} QUICK LOOK</span><b>${E(q)}</b><button class="adv-hear" data-adv="say" data-text="${E(q)}" aria-label="Hear the quick look">${I('volume-2')}</button></div>`);}
 const meta=pas.parentElement?.querySelector('.g-chunk-meta');if(meta&&!meta.nextElementSibling?.classList?.contains('adv-chips'))meta.insertAdjacentHTML('afterend',chips());
 icons();}
function chips(){const c=counts();return `<div class="adv-chips"><button class="adv-chip ${easyOn()?'on':''}" data-adv="easy" aria-pressed="${easyOn()}">${I('type')} Easy Read ${easyOn()?'on':'off'}</button><button class="adv-chip ${g().autoTurn?'on':''}" data-adv="autoturn" aria-pressed="${!!g().autoTurn}">${I('book-open')} Auto-turn pages ${g().autoTurn?'on':'off'}</button>${saveChip()}<span class="adv-chip info">${I('sparkles')} Tap a glowing word for a Word Spark · ${c.sparks}/${totalSparks()}</span></div>`;}

function decorateQuestion(){const t=$('.g-task-title');if(!t||t.dataset.advDone)return;t.dataset.advDone='1';const kind=($('.g-qtype',t)?.textContent||'WHAT').trim();const lk=D.look[kind]||D.look.WHAT;$('h3',t)?.insertAdjacentHTML('afterend',`<div class="adv-look">${I(lk[0])}<span>${E(lk[1])}</span><small>Tap any answer to hear it.</small></div>`);icons();
 const btn=$('.g-tools [data-growth="speak"][data-audio^="gq-"]');if(btn&&st().autoRead!==false&&st().sound!==false&&st().voice!==false){const key=btn.dataset.audio;if(lastQ!==key){lastQ=key;setTimeout(()=>{if(document.contains(btn))btn.click()},450);}}}
let lastQ='';

/* ---------- Discovery prize card and next-time teaser ---------- */
function decoratePrize(){const box=$('.exp-video-teaser');if(!box||box.dataset.advDone)return;box.dataset.advDone='1';const b=$('[data-growth="exp-tv"]',box);const id=b?.dataset.id;const v=id&&allVideos().find(x=>x.id===id);const watch=$('p',box)?.textContent||'';
 if(v){box.classList.add('adv-prize');box.innerHTML=`<button class="adv-prize-thumb" data-adv="watch" data-id="${E(id)}" data-lv="${E(b.dataset.lv)}" data-n="${E(b.dataset.n)}" style="background-image:url('${thumb(id)}')" aria-label="Watch your prize: ${E(v.title)}"><span class="adv-play">${I('play')}</span></button><div class="adv-prize-copy"><span class="adv-ribbon">${I('trophy')} PRIZE UNLOCKED · EXPLORER TV</span><h4>${E(v.title)}</h4><small>${E(v.by)} · real-world clip</small><p><b>Spotter mission:</b> ${E(watch)}</p><div class="adv-prize-actions"><button class="btn btn-primary" data-adv="watch" data-id="${E(id)}" data-lv="${E(b.dataset.lv)}" data-n="${E(b.dataset.n)}">${I('play')} Watch my prize</button><button class="btn btn-plain" data-adv="vault">${I('tv')} Prize Vault</button></div><small class="adv-fine">Spot the clue to earn a Spotter Stamp, a Kindness Berry, and egg warmth.</small></div>`;}
 const id2=storyId();const card=id2&&D.cards[id2];const rw=box.closest('.g-reward')||box.parentElement;if(card&&rw&&!$('.adv-teaser',rw))box.insertAdjacentHTML('afterend',`<div class="adv-teaser">${I('compass')}<div><b>${E(card.teaser.replace(/^Next time:\s*/,''))}</b><small>NEXT TIME ON AIDEN’S WORLD QUEST</small></div><button class="adv-hear" data-adv="say" data-text="${E(card.teaser)}" aria-label="Hear what happens next">${I('volume-2')}</button></div>`);
 const c=counts();if(c.ready&&rw&&!$('.adv-egg-note',rw))rw.insertAdjacentHTML('beforeend',`<button class="adv-egg-note" data-adv="nest">${I('egg')} A Mystery Egg is wobbling. Tap to open the Egg Nest.</button>`);
 icons();}

/* ---------- Explorer TV player extras ---------- */
/* ---------- Video access: only won prize clips and science or nature bonus clips ---------- */
const SCIENCE=new Set(['80Fh1LmQDMM','iPoyANP3EeU','C0mYpPROb5Y','6Vlj-0lCdjY','Iln136eMl4g','tj-4WeOXKco','eBcxeUVLEsw','74Z0HtrTgJM','LjotUMpJ3Zg','bWpLRvcnpx8','U2vZN3WcnbQ','L18dbrCz03c','glxYZuNshwI','Hcc3eU40JpY','61RzwbaSoeU','QKO3sqic5fc','pTd-mIEwoec']);
function canWatch(id){const pz=prizeIds(),done=st().done||0;for(let L=0;L<pz.length;L++){const qi=(pz[L]||[]).indexOf(id);if(qi>=0)return L*3+qi<done||!!g().ledger?.[L+'-'+qi]?.key||!!g().discoveries?.[L+'-'+qi];}return (g().tvBought||[]).includes(id)&&SCIENCE.has(id);}
function lockLibrary(){$$('[data-growth="exp-tv"][data-id]').forEach(b=>{if(b.dataset.advLock)return;b.dataset.advLock='1';if(!canWatch(b.dataset.id)){b.disabled=true;b.innerHTML=`${I('lock-keyhole')} Win it first`;b.classList.add('adv-locked-open');}});$$('.modal a[href*="youtube.com/watch"]').forEach(a=>{if(!a.closest('.exp-parent-only')&&!/Preview/.test(a.textContent))a.remove();});}
function ytPost(fr,o){try{fr.contentWindow.postMessage(JSON.stringify(o),'*')}catch{}}
function guardPlayer(p,fr){if(fr.dataset.advGuard)return;fr.dataset.advGuard='1';p.classList.add('adv-guarded');p.insertAdjacentHTML('beforeend','<div class="adv-yt-shield top" aria-hidden="true"></div><div class="adv-yt-shield logo" aria-hidden="true"></div><div class="adv-yt-pause" hidden><button class="btn btn-primary" data-adv="yt-play">'+I('play')+' Keep watching my prize</button></div>');icons();
 const hello=()=>{ytPost(fr,{event:'listening',id:'adv',channel:'widget'});ytPost(fr,{event:'command',func:'addEventListener',args:['onStateChange'],id:'adv',channel:'widget'});};fr.addEventListener('load',()=>{hello();setTimeout(hello,800);});}
function ytState(n){const p=$('#exp-player');if(!p)return;const pause=$('.adv-yt-pause',p);if(n===2&&pause){pause.hidden=false;}else if(n===1&&pause){pause.hidden=true;}
 else if(n===0){const id=(/embed\/([^?]+)/.exec($('iframe',p)?.src||'')||[])[1]||'';p.classList.remove('adv-guarded');p.innerHTML=`<div class="adv-yt-done">${I('trophy')}<h3>Prize clip complete</h3><p>Great watching. Did you spot the clue? Stamp it below, then head back to your adventure.</p><div class="g-actions"><button class="btn btn-plain" data-growth="exp-load" data-id="${E(id)}">${I('rotate-ccw')} Watch it again</button></div></div>`;icons();}}
window.addEventListener('message',e=>{if(!/youtube(-nocookie)?\.com$/.test(new URL(e.origin||'http://x').hostname))return;let d=e.data;try{if(typeof d==='string')d=JSON.parse(d)}catch{return}if(!d)return;if(d.event==='onStateChange')ytState(+d.info);else if(d.event==='infoDelivery'&&d.info&&d.info.playerState!==undefined)ytState(+d.info.playerState);});
function decoratePlayer(){lockLibrary();const p=$('#exp-player');if(!p)return;const fr=$('iframe',p);if(fr)guardPlayer(p,fr);if(!fr){if(!p.dataset.advPoster){const b=$('[data-growth="exp-load"]',p);const id=b?.dataset.id;if(id){p.dataset.advPoster='1';p.classList.add('adv-poster');p.style.backgroundImage=`linear-gradient(#183d2ecc,#183d2ecc),url('${thumb(id)}')`;}}return;}
 const id=(/embed\/([^?]+)/.exec(fr.src)||[])[1];if(!id||$('.adv-spotter'))return;const done=!!g().spotted?.[id];p.insertAdjacentHTML('afterend',`<div class="adv-spotter ${done?'done':''}" data-id="${E(id)}">${spotterInner(id,done)}</div>`);icons();}
function spotterInner(id,done){return done?`${I('badge-check')}<div><b>Spotter Stamp collected</b><small>Nice noticing. Your eggs got warmer.</small></div><button class="btn btn-plain" data-adv="vault">${I('tv')} Prize Vault</button>`:`${I('scan-eye')}<div><b>Spotter mission</b><small>Watch closely for the clue above. When you spot it, stamp it.</small></div><button class="btn btn-primary" data-adv="spot" data-id="${E(id)}">${I('stamp')} I spotted it</button>`;}

/* ---------- Hubs on camp, trail, pets ---------- */
function hubHtml(){const c=counts();const prizes=prizeIds();const won=prizes.flat().filter((id,i)=>i<(st().done||0)).length;return `<section class="adv-hub" aria-label="Prizes and eggs"><button class="adv-hub-card tv" data-adv="vault"><span>${I('tv')}</span><div><b>Explorer TV Prize Vault</b><small>${won}/18 prize clips won · ${c.tickets} TV ${c.tickets===1?'ticket':'tickets'} · ${c.spotted} Spotter Stamps</small></div></button><button class="adv-hub-card egg ${c.ready?'wobble':''}" data-adv="nest"><span>${I('egg')}</span><div><b>Mystery Egg Nest</b><small>${c.ready?`${c.ready} egg${c.ready>1?'s':''} ready to hatch`:`${c.hatched.length}/6 hatched · warmth ${c.warmth}`}</small></div></button><button class="adv-hub-card spark" data-adv="sparks"><span>${I('sparkles')}</span><div><b>Word Sparks</b><small>${c.sparks}/${totalSparks()} glowing words collected</small></div></button></section>`;}
function decorateMain(){const main=$('#main');if(!main)return;const at=$('.g-camp-hero',main)||$('.growth-strip',main)||$('.pet-note',main);if(at&&!$('.adv-hub',main)){at.insertAdjacentHTML('afterend',hubHtml());icons();}}

/* ---------- Modals ---------- */
function modal(title,eyebrow,body,cls=''){A().showModal(`<section class="modal growth-modal adv-modal ${cls}" role="dialog" aria-modal="true" aria-labelledby="adv-title">${A().closeButton()}<div class="g-head"><span class="eyebrow">${E(eyebrow)}</span><h2 id="adv-title">${E(title)}</h2></div><div class="g-body">${body}</div></section>`,'adventure');icons();}
function vault(){const c=counts(),done=st().done||0,pz=prizeIds(),x=g();const bought=x.tvBought||[];const tvOff=!x.tvEnabled;
 const rows=V.map((row,L)=>{const prize=pz[L]||[];const ordered=[...row].sort((a,b)=>{const ia=prize.indexOf(a.id),ib=prize.indexOf(b.id);return (ia<0?9:ia)-(ib<0?9:ib)});const cards=ordered.filter(v=>prize.includes(v.id)||SCIENCE.has(v.id)).map(v=>{const qi=prize.indexOf(v.id);const isPrize=qi>=0;const won=isPrize?L*3+qi<done:bought.includes(v.id);const reach=L*3<=done;const spotted=!!x.spotted?.[v.id];
  const tag=isPrize?`SCENE ${qi+1} PRIZE`:'BONUS CLIP';const state=won?(spotted?`${I('badge-check')} Stamped`:`${I('play')} Watch`):isPrize?`${I('lock-keyhole')} Finish scene ${qi+1}`:reach?`${I('ticket')} Use 1 ticket`:`${I('lock-keyhole')} Reach ${E(W[L]?.country||'')}`;
  const act=won?`data-adv="watch" data-id="${E(v.id)}" data-lv="${L}" ${isPrize?`data-n="${qi}"`:''}`:(!isPrize&&reach)?`data-adv="buy" data-id="${E(v.id)}"`:'data-adv="locked"';
  return `<button class="adv-clip ${won?'won':'locked'} ${spotted?'stamped':''}" ${act}><span class="adv-clip-thumb" style="${won?`background-image:url('${thumb(v.id)}')`:''}">${won?I('play'):I('lock-keyhole')}</span><span class="adv-clip-tag">${tag} · ${E(v.kind)}</span><b>${won||reach?E(v.title):'Mystery clip'}</b><small>${state}</small></button>`;}).join('');
  return `<section class="adv-vault-row"><h3>${E(W[L]?.place||'')}</h3><div class="adv-clips">${cards}</div></section>`;}).join('');
 modal('Explorer TV Prize Vault','WIN SCIENCE AND NATURE CLIPS',`<div class="adv-vault-top"><span>${I('trophy')} Every key wins a prize clip.</span><span>${I('ticket')} <b>${c.tickets}</b> TV ${c.tickets===1?'ticket':'tickets'}</span><span>${I('stamp')} <b>${c.spotted}</b> Spotter ${c.spotted===1?'Stamp':'Stamps'}</span></div><p class="adv-fine">Earn TV tickets with Patience Bonuses, thank-you moments, and Spotter Stamps. Spend them on bonus clips.${tvOff?' Explorer TV is turned off for this profile; a grown-up can turn it on in For grown-ups.':' Clips load from YouTube only when tapped. A grown-up should preview them.'}</p>${rows}`,'adv-wide');}
function nest(){const c=counts();const eggs=D.eggs.map((e,i)=>{const h=c.hatched.includes(i);const ready=!h&&c.warmth>=e.need;const pct=Math.min(100,Math.round(c.warmth/e.need*100));
 return `<div class="adv-egg ${h?'hatched':ready?'ready':''}">${h?`<img src="assets/pokemon/${e.id}.webp" alt="${E(e.name)}"><b>${E(e.name)}</b><small>${E(e.move)} · ${E(e.type)}</small>`:`<button class="adv-egg-shell" data-adv="${ready?'hatch':'egg-locked'}" data-i="${i}" aria-label="${ready?'Hatch this egg':'Egg still warming'}"><span class="adv-egg-spots t${e.level}"></span></button><b>${ready?'Ready to hatch':'Mystery Egg'}</b><div class="adv-warm"><i style="width:${pct}%"></i></div><small>${ready?'Tap the egg three times':`Warmth ${Math.min(c.warmth,e.need)}/${e.need}`}</small>`}</div>`;}).join('');
 modal('Mystery Egg Nest','HATCH NEW POKÉMON FRIENDS',`<p>Eggs get warmer when you earn keys, collect Spotter Stamps (+2), win Patience Bonuses, share thank-yous, and collect Word Sparks (+1 for every 3).</p><div class="adv-nest">${eggs}</div><div class="g-actions"><button class="btn btn-plain" data-adv="vault">${I('tv')} Prize Vault</button><button class="btn btn-green" data-nav="pets">${I('paw-print')} My Pokémon</button></div>`);}
function sparkBook(){const x=g().sparks||{};const done=st().done||0;const rows=Object.entries(D.cards).map(([id,c])=>{const [l,n]=id.split('-').map(Number);if(l*3+n>done)return '';return c.sparks.map(s=>{const k=keyOf(s.word);const got=!!x[k];return `<button class="adv-spark ${got?'got':''}" data-adv="say" data-text="${E(s.word)}. ${E(s.mean)}"><b>${got?E(s.syl):'? ? ?'}</b><small>${got?E(s.mean):'Find this glowing word in a story'}</small></button>`}).join('')}).join('');
 modal('Word Sparks','GLOWING WORDS FROM YOUR STORIES',`<p>Tap the glowing words while you read. Each one shows its beats (syllables) and a quick meaning. Every 3 sparks warms your Mystery Eggs.</p><div class="adv-spark-grid">${rows||'<p>Start the first story to find glowing words.</p>'}</div>`);}
let tapCount=0;
function hatch(i,btn){const e=D.eggs[i];const c=counts();if(!e||c.hatched.includes(i)||c.warmth<e.need)return;tapCount++;btn.classList.remove('crack1','crack2');void btn.offsetWidth;S()?.sfx?.('collect',.5);if(tapCount<3){btn.classList.add('crack'+tapCount);return;}tapCount=0;const x=g();x.hatched=[...(x.hatched||[]),i];save();A().stats?.();S()?.celebrate?.(4);
 modal(`${e.name} hatched`,'MYSTERY EGG · NEW TEAMMATE',`<div class="adv-hatch"><img src="assets/pokemon/${e.id}.webp" alt="${E(e.name)}"><div><span class="adv-ribbon">${I('sparkles')} ${E(e.role)} · ${E(e.type)}</span><h3>${E(e.name)} joins your squad.</h3><p>Signature move: <b>${E(e.move)}</b>. Patience kept this egg warm.</p><div class="adv-fact">${I('microscope')}<p><b>Real-world egg fact:</b> ${E(e.fact)}</p><button class="adv-hear" data-adv="say" data-text="${E(e.fact)}" aria-label="Hear the egg fact">${I('volume-2')}</button></div></div></div><div class="g-actions"><button class="btn btn-primary" data-nav="pets">${I('paw-print')} Meet my team</button><button class="btn btn-plain" data-adv="nest">${I('egg')} Back to the nest</button><button class="btn btn-green" data-spar-ally="${24+i}">${I('swords')} Battle with ${E(e.name)}</button></div>`);
 setTimeout(()=>{const m=$('.adv-hatch');if(m&&window.GrowthAPI)try{document.dispatchEvent(new CustomEvent('advburst'))}catch{}},50);}

/* ---------- Word Spark bubble ---------- */
function sparkWord(k){const id=storyId();const c=id&&D.cards[id];return (c?.sparks.find(x=>keyOf(x.word)===k)||{}).word||k;}
function sparkBubble(el){$('.adv-bubble')?.remove();const id=storyId();const card=id&&D.cards[id];const s=card?.sparks.find(x=>keyOf(x.word)===el.dataset.spark);if(!s)return;const x=g();x.sparks=x.sparks||{};const fresh=!x.sparks[el.dataset.spark];if(fresh){x.sparks[el.dataset.spark]=Date.now();save();S()?.sfx?.('collect',.45);}
 el.insertAdjacentHTML('afterend',`<span class="adv-bubble" role="status"><b>${E(s.syl)}</b><span>${E(s.mean)}</span>${fresh?`<em>+1 Word Spark · ${Object.keys(x.sparks).length}/${totalSparks()}</em>`:''}</span>`);el.classList.add('got');setTimeout(()=>$('.adv-bubble')?.remove(),4200);
 const info=$('.adv-chip.info');if(info)info.innerHTML=`${I('sparkles')} Tap a glowing word for a Word Spark · ${Object.keys(x.sparks).length}/${totalSparks()}`;icons();}
const TAPS=window.ADVENTURE_TAPS||{};
function clipFor(text){const k=(text||'').trim();return TAPS[k]||TAPS[k.replace(/\.$/,'')]||null;}
function sayClip(text,key){const s=S();const id=clipFor(key||text);if(id&&s?.narrate&&s.narrate('tap/'+id,{error:()=>sayDevice(text,true)}))return;sayDevice(text,true);}
function sayDevice(text,raw){const s=S();if(!s?.speak){toast('A device voice is unavailable here. The words stay on screen.');return;}s.boot?.();s.speak(text,{rate:Math.min(.9,g().rate||.9),error:()=>{}});}
function talking(){try{return !!S()?.state?.().talking||!!along}catch{return !!along}}

/* ---------- Events ---------- */
document.addEventListener('click',e=>{const t=e.target;
 if(t.closest?.('.modal')&&!t.closest('[data-growth="next-page"]'))cancelTurn();
 const w=t.closest?.('.g-passage .w');if(w){if(w.dataset.spark){sparkBubble(w);if(!talking())sayClip(w.textContent.replace(/[^\p{L}'’-]/gu,''),'spark:'+sparkWord(w.dataset.spark));}else if(easyOn()&&!talking()){w.classList.add('tap');setTimeout(()=>w.classList.remove('tap'),600);sayDevice(w.textContent.replace(/[^\p{L}'’-]/gu,''));}return;}
 const opt=t.closest?.('.g-option');if(opt&&!opt.disabled&&st().voice!==false){const txt=$('span',opt)?.textContent;if(txt)setTimeout(()=>sayClip(txt),60);}
 const wait=t.closest?.('.adv-wait');if(wait){e.preventDefault();e.stopPropagation();const box=wait.closest('.modal')||document;$$('.g-option',box).forEach(o=>{o.classList.remove('adv-pulse');void o.offsetWidth;o.classList.add('adv-pulse')});toast(wait.dataset.growth==='commit-evidence'?'First tap the line that proves it. Then power the lock.':'First tap the answer you think is right. Then lock it in.');return;}
 const gb=t.closest?.('[data-growth="exp-tv"],[data-growth="exp-load"]');if(gb&&gb.dataset.id&&!canWatch(gb.dataset.id)){e.preventDefault();e.stopPropagation();toast('Win this clip in the Prize Vault first. Every key wins one.');return;}
 const b=t.closest?.('[data-adv]');if(!b)return;const a=b.dataset.adv;e.preventDefault();e.stopPropagation();
 if(a==='saveplace'){trackPlace(true);keepSafe();S()?.sfx?.('key',.45);toast('Place saved. Next time, tap Continue where I left off.');b.classList.add('saved');setTimeout(()=>b.classList.remove('saved'),1600);return;}
 if(a==='resume'){const st=$('[data-start="sound"]');if(st)st.click();setTimeout(resumePlace,450);return;}
 if(a==='resume-now'){resumePlace();return;}
 if(a==='yt-play'){const fr=$('#exp-player iframe');if(fr)ytPost(fr,{event:'command',func:'playVideo',args:[],id:'adv',channel:'widget'});b.closest('.adv-yt-pause').hidden=true;return;}
 if(a==='say'){sayClip(b.dataset.text||'');return;}
 if(a==='easy'){const x=g();x.easyRead=!easyOn();save();document.body.classList.toggle('easy-read',easyOn());$$('.adv-chips').forEach(c=>c.outerHTML=chips());icons();return;}
 if(a==='autoturn'){const x=g();x.autoTurn=!x.autoTurn;save();$$('.adv-chips').forEach(c=>c.outerHTML=chips());icons();return;}
 if(a==='vault'){vault();return;}
 if(a==='nest'){tapCount=0;nest();return;}
 if(a==='sparks'){sparkBook();return;}
 if(a==='locked'){toast('Keep exploring to win this clip. Every key unlocks a prize.');return;}
 if(a==='egg-locked'){toast('This egg needs more warmth. Earn keys, Spotter Stamps, and Patience Bonuses.');return;}
 if(a==='hatch'){hatch(+b.dataset.i,b);return;}
 if(a==='buy'){if(!SCIENCE.has(b.dataset.id))return;const x=g();const c=counts();if(c.tickets<1){toast('You need a TV ticket. Earn one with a Patience Bonus, a thank-you, or a Spotter Stamp.');return;}x.tvBought=[...(x.tvBought||[]),b.dataset.id];save();S()?.sfx?.('key',.6);toast('Bonus clip unlocked.');vault();return;}
 if(a==='watch'){const d={growth:'exp-tv',id:b.dataset.id,lv:b.dataset.lv};if(b.dataset.n!==undefined&&b.dataset.n!=='')d.n=b.dataset.n;X()?.click({dataset:d});return;}
 if(a==='spot'){const x=g();x.spotted=x.spotted||{};const id=b.dataset.id;if(!x.spotted[id]){x.spotted[id]=Date.now();x.berries=(x.berries||0)+1;save();A().stats?.();S()?.celebrate?.(2);toast('Spotter Stamp collected. +1 Kindness Berry, +1 TV ticket, and warmer eggs.');}const box=b.closest('.adv-spotter');if(box){box.classList.add('done');box.innerHTML=spotterInner(id,true);icons();}return;}
},true);

/* ---------- Keep the reader's place when a card redraws ---------- */
function scroller(){const m=document.querySelector('.modal');if(!m)return null;const c=m.querySelector('.g-story-copy');const can=e=>e&&e.scrollHeight>e.clientHeight+20&&/(auto|scroll)/.test(getComputedStyle(e).overflowY);if(can(c))return c;for(let e=c?.parentElement;e&&e!==document.body;e=e.parentElement)if(can(e))return e;const all=[m,...m.querySelectorAll('*')];return all.find(e=>e.scrollHeight>e.clientHeight+20&&/(auto|scroll)/.test(getComputedStyle(e).overflowY))||null;}
function viewKey(){try{const s=window.Growth.textState().growth;const st=s.story,b=s.battle;return [s.active,st&&st.id,st&&st.page,st&&st.stage,st&&st.variant,b&&b.stage,b&&b.round].join('|');}catch{return ''}}
let keep={el:null,top:0,key:'',node:null};
function contentNode(){const m=document.querySelector('.modal');return m?(m.querySelector('.g-story-copy')||m.querySelector('.g-body')||m.firstElementChild):null;}
function remember(){const el=scroller();if(el)keep={el,top:el.scrollTop,key:viewKey(),node:contentNode()};}
function restore(){const node=contentNode();if(!node||node===keep.node)return;const el=scroller();if(!el){keep={el:null,top:0,key:viewKey(),node};return;}const key=viewKey();const prev=keep;keep={el,top:el.scrollTop,key,node};
 if(prev.key&&key===prev.key&&prev.top>0){el.scrollTop=prev.top;keep.top=prev.top;const lock=el.querySelector('[data-growth="commit-answer"]:not(.adv-wait),[data-growth="commit-evidence"]:not(.adv-wait),[data-growth="battle-commit"]:not(.adv-wait)');if(lock){const r=lock.getBoundingClientRect(),c=el.getBoundingClientRect();const vb=Math.min(c.bottom,innerHeight);if(r.bottom>vb-8)el.scrollTop+=r.bottom-vb+24;}return;}
 const ps=prev.key.split('|'),ks=key.split('|');if(ps[1]&&ps[1]===ks[1]&&ps[3]!==ks[3]&&/check|evidence|review|guided/.test(ks[3]||'')){const target=el.querySelector('.g-task-title,.g-feedback,.adv-evhint,.g-options');if(target){const r=target.getBoundingClientRect(),c=el.getBoundingClientRect();el.scrollTop+=r.top-c.top-16;}}}
document.addEventListener('scroll',e=>{if(keep.el&&e.target===keep.el)keep.top=keep.el.scrollTop;},true);
document.addEventListener('pointerdown',remember,true);
/* ---------- Save my place ---------- */
function placeNow(){try{const s=window.Growth.textState().growth;const st=s.story;if(!st||!st.id)return null;const [level,n]=st.id.split('-').map(Number);return {id:st.id,level,n,page:st.page||0,stage:st.stage,title:(document.querySelector('.modal h2')?.textContent||'').trim(),at:Date.now()};}catch{return null}}
function trackPlace(force){const pl=placeNow();const x=g();if(!pl){if(force)save();return;}if(pl.stage==='done'){if(x.place&&x.place.id===pl.id){x.place=null;save();}return;}const o=x.place;if(force||!o||o.id!==pl.id||o.page!==pl.page||o.stage!==pl.stage){x.place=pl;save();}}
function placeLabel(pl){if(!pl)return '';const step=pl.stage==='read'?`story card ${pl.page+1}`:pl.stage==='lab'?'the field mission':pl.stage==='evidence'||pl.stage==='guided'?'the proof clue':'the clue question';return `${pl.title||'Your quest'} · ${step}`;}
let persisted=false;function keepSafe(){if(persisted)return;persisted=true;try{navigator.storage?.persist?.()}catch{}}
function saveChip(){return `<button class="adv-chip save" data-adv="saveplace">${I('bookmark-check')} Save my place</button>`;}
function decorateSave(){
 const tools=$('.modal .g-tools');if(tools&&!$('[data-adv="saveplace"]',tools)){tools.insertAdjacentHTML('beforeend',`<button class="btn btn-plain adv-savebtn" data-adv="saveplace">${I('bookmark-check')} Save my place</button>`);icons();}
 const modes=$('.start-modes');const pl=g().place;if(modes&&pl&&!$('.adv-resume')){modes.insertAdjacentHTML('beforebegin',`<div class="adv-resume"><span class="adv-resume-tag">${I('bookmark-check')} YOUR PLACE IS SAVED</span><b>${E(placeLabel(pl))}</b><button class="btn btn-primary btn-block" data-adv="resume">${I('play')} Continue where I left off</button></div>`);const h=$('#start-title');if(h&&!/Welcome back|right where you left/.test(h.textContent))h.textContent='Welcome back. Your place is saved.';const copy=h?.closest('.start-copy');const eb=copy?.querySelector('.eyebrow');if(eb)eb.textContent='WELCOME BACK';const para=h?.nextElementSibling;if(para&&para.tagName==='P')para.textContent='Your keys, friends, and discoveries are saved on this device.';const sb=$('[data-start="sound"]',modes);if(sb){sb.classList.remove('btn-primary');sb.classList.add('btn-plain');sb.innerHTML=sb.innerHTML.replace('Start with music and voice','Go to the map with music');}const rb=$('[data-adv="resume"]');if(rb)setTimeout(()=>rb.focus(),60);icons();}
 const main=$('#main'),hub=main&&$('.adv-hub',main);if(hub&&!$('.adv-savebar',main)){hub.insertAdjacentHTML('afterend',`<div class="adv-savebar">${I('bookmark-check')}<span>${pl?`Saved place: <b>${E(placeLabel(pl))}</b>`:'Your progress saves by itself on this device.'}</span>${pl?`<button class="btn btn-primary" data-adv="resume-now">${I('play')} Jump back in</button>`:''}</div>`);icons();}}
function resumePlace(){const pl=g().place;if(!pl)return;try{window.Growth.quest(pl.n,pl.level)}catch{}}
document.addEventListener('pointerdown',keepSafe,{capture:true,once:true});
/* ---------- Observe screens ---------- */
let pending=0;
function waitButtons(){$$('[data-growth="commit-answer"][disabled],[data-growth="commit-evidence"][disabled],[data-growth="battle-commit"][disabled]').forEach(b=>{b.disabled=false;b.classList.add('adv-wait');b.title='Pick an answer first';});
 const ev=$('.g-option[data-growth="select-evidence"],.g-option[data-growth="guided-evidence"]');if(ev){const box=ev.closest('.g-options');if(box&&!box.previousElementSibling?.classList?.contains('adv-evhint'))box.insertAdjacentHTML('beforebegin',`<div class="adv-look adv-evhint">${I('ear')}<span>Tap a line to hear it</span><small>Pick the one that matches your answer.</small></div>`),icons();
  if(box&&!box.dataset.advMatch){box.dataset.advMatch='1';const keyEl=[...document.querySelectorAll('.modal p, .modal .g-small')].find(x=>/Your key:/.test(x.textContent));const ans=(keyEl?.querySelector('strong,b')?.textContent||document.querySelector('.modal .g-evidence + p strong')?.textContent||'').toLowerCase();const stop=new Set(['the','and','with','that','this','from','into','they','them','what','when','where','there','their','your','have','been','some','very','just','then']);const keys=ans.split(/[^a-z’']+/).filter(w=>w.length>3&&!stop.has(w)).map(w=>w.replace(/s$/,''));if(keys.length)$$('.g-option span',box).forEach(sp=>{sp.innerHTML=sp.textContent.split(/(\s+)/).map(w=>{const k=w.toLowerCase().replace(/[^a-z’']/g,'').replace(/s$/,'');return k&&keys.includes(k)?`<mark class="adv-match">${E(w)}</mark>`:E(w)}).join('');});}}}
function scan(){pending=0;waitButtons();restore();trackPlace();decorateSave();document.body.classList.toggle('easy-read',easyOn());$$('.g-passage[data-page]').forEach(decoratePassage);decorateQuestion();decoratePrize();decoratePlayer();decorateMain();}
const mo=new MutationObserver(()=>{try{restore()}catch{}if(!pending)pending=requestAnimationFrame(scan);});
function boot(){wrapNarrate();mo.observe(document.body,{childList:true,subtree:true});scan();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,0));else setTimeout(boot,0);
return {counts,vault,nest,sparkBook,boot};
})();
