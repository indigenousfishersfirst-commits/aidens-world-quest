/* Phase 10a: hidden skills tracker, Grit meter and Try-It tokens.
   Local only. No network. Stores under live.g.skills10 so it rides along in AWQ3 backups.
   Not wired into the game yet: load after progress.js and call QuestSkills.attach(state). */
window.QuestSkills=(()=>{
'use strict';
const SKILLS={
  cvc:{badge:'Grass',type:'GRASS',stop:'bc',label:'short vowel words'},
  magicE:{badge:'Water',type:'WATER',stop:'honolulu',label:'long vowel and magic e words'},
  digraph:{badge:'Fire',type:'FIRE',stop:'rome',label:'sh, ch, th and wh words'},
  blend:{badge:'Electric',type:'ELECTRIC',stop:'kyoto',label:'blend words'},
  vowelTeam:{badge:'Steel',type:'STEEL',stop:'paris',label:'vowel team words'},
  silent:{badge:'Rock',type:'ROCK',stop:'cairo',label:'silent letter words'},
  syllable:{badge:'Ice',type:'ICE',stop:'sapporo',label:'word beats'},
  rControl:{badge:'Ground',type:'GROUND',stop:'cusco',label:'ar, or and er words'},
  rhyme:{badge:'Fairy',type:'FAIRY',stop:'barcelona',label:'rhyming words and endings'},
  multi:{badge:'Flying',type:'FLYING',stop:'nyc',label:'long words'},
  letterForm:{badge:'Normal',type:'NORMAL',stop:'london',label:'letter shapes'},
  review:{badge:'Dragon',type:'DRAGON',stop:'sydney',label:'all words'}
};
const WINDOW=10,UP=.8,DOWN=.5,MASTER_TRIES=20,MASTER_DAYS=3,GRIT_PER_RETRY=1;
const num=(x,a,b,d=0)=>Number.isFinite(x)?Math.max(a,Math.min(b,x)):d;
let live=null;
function fresh(){return {v:1,grit:0,gritSpent:0,tryIt:[],flex:0,comeback:0,lastPlay:'',per:{}};}
function freshSkill(){return {level:1,attempts:0,first:0,retries:0,recent:[],days:[],ms:[],lastSeen:'',mastered:false};}
function sanitize(input){
  const s=Object.assign(fresh(),input&&typeof input==='object'&&!Array.isArray(input)?input:{});
  s.v=1;s.grit=Math.floor(num(s.grit,0,1e6));s.gritSpent=Math.floor(num(s.gritSpent,0,1e6));
  s.flex=Math.floor(num(s.flex,0,1e5));s.comeback=Math.floor(num(s.comeback,0,1e5));
  s.lastPlay=typeof s.lastPlay==='string'?s.lastPlay.slice(0,10):'';
  s.tryIt=Array.isArray(s.tryIt)?s.tryIt.filter(x=>typeof x==='string'&&/^[a-z]+:[a-z0-9_-]{1,40}$/i.test(x)).slice(0,400):[];
  const per={};
  for(const [k,r] of Object.entries(s.per&&typeof s.per==='object'?s.per:{})){
    if(!SKILLS[k]||!r||typeof r!=='object')continue;
    const o=Object.assign(freshSkill(),r);
    o.level=Math.floor(num(o.level,1,5,1));
    for(const f of ['attempts','first','retries'])o[f]=Math.floor(num(o[f],0,1e6));
    o.recent=Array.isArray(o.recent)?o.recent.slice(-WINDOW).map(x=>x?1:0):[];
    o.days=Array.isArray(o.days)?o.days.filter(x=>/^\d{4}-\d\d-\d\d$/.test(x)).slice(-60):[];
    o.ms=Array.isArray(o.ms)?o.ms.slice(-WINDOW).map(x=>Math.floor(num(x,0,120000))):[];
    o.lastSeen=typeof o.lastSeen==='string'?o.lastSeen.slice(0,10):'';
    o.mastered=o.mastered===true;per[k]=o;
  }
  s.per=per;return s;
}
const today=()=>new Date().toLocaleDateString('en-CA');
function store(){if(!live.g)live.g={};if(!live.g.skills10||live.g.skills10.v!==1)live.g.skills10=sanitize(live.g.skills10);return live.g.skills10;}
function attach(state){live=state;if(!live.g)live.g={};live.g.skills10=sanitize(live.g.skills10);return api;}
function skill(id){const s=store();if(!s.per[id])s.per[id]=freshSkill();return s.per[id];}
/* Record one round item. firstTry=true if correct on the first tap; retries = wrong taps before success. */
function record(id,{firstTry=false,retries=0,ms=0,done=true}={}){
  if(!SKILLS[id]||!live)return null;
  const s=store(),k=skill(id),d=today();
  k.attempts++;if(firstTry)k.first++;k.retries+=retries;
  k.recent.push(firstTry?1:0);k.recent=k.recent.slice(-WINDOW);
  k.ms.push(Math.floor(num(ms,0,120000)));k.ms=k.ms.slice(-WINDOW);
  if(!k.days.includes(d))k.days.push(d);k.days=k.days.slice(-60);k.lastSeen=d;s.lastPlay=d;
  if(retries>0&&done)s.grit+=GRIT_PER_RETRY*Math.min(retries,3);
  const before=k.level;adjust(k);
  const mastered=!k.mastered&&checkMastery(k);if(mastered)k.mastered=true;
  save();
  return {level:k.level,levelUp:k.level>before,levelDown:k.level<before,mastered,grit:s.grit};
}
function rate(k){return k.recent.length?k.recent.reduce((a,b)=>a+b,0)/k.recent.length:0;}
function adjust(k){
  if(k.recent.length<WINDOW)return;
  const r=rate(k);
  if(r>=UP&&k.level<5){k.level++;k.recent=[];}
  else if(r<DOWN&&k.level>1){k.level--;k.recent=[];}
}
function checkMastery(k){
  return k.attempts>=MASTER_TRIES&&k.days.length>=MASTER_DAYS&&k.first/k.attempts>=UP;
}
/* Support hints the games can read: more support at low levels. */
function support(id){const l=skill(id).level;return {showFirstLetter:l<=2,slowAudio:l<=1,pictureCue:l<=3,wordCount:Math.min(3+l,8),roundSeconds:l<=1?60:l<=3?75:90};}
function tryIt(kind,key){const s=store();const tag=`${kind}:${key}`;if(s.tryIt.includes(tag))return false;s.tryIt.push(tag);save();return true;}
function flexStar(){const s=store();s.flex++;save();return s.flex;}
function comeback(){const s=store(),d=today();if(s.lastPlay&&s.lastPlay!==d){s.comeback++;save();return true;}return false;}
function spendGrit(n){const s=store();if(s.grit-s.gritSpent<n)return false;s.gritSpent+=n;save();return true;}
function gritAvailable(){const s=store();return s.grit-s.gritSpent;}
function shinyChance(){return gritAvailable()>=25?1/8:1/20;}
function badgeReady(id){return !!SKILLS[id]&&skill(id).mastered;}
function dueForReview(){const s=store(),now=Date.now(),out=[];for(const [id,k] of Object.entries(s.per)){if(!k.lastSeen)continue;const age=Math.floor((now-new Date(k.lastSeen).getTime())/86400000);if([1,3,7].includes(age))out.push(id);}return out;}
function summary(){const s=store();return Object.entries(SKILLS).map(([id,m])=>{const k=s.per[id]||freshSkill();return {id,badge:m.badge,label:m.label,stop:m.stop,level:k.level,attempts:k.attempts,firstRate:k.attempts?Math.round(100*k.first/k.attempts):0,mastered:k.mastered,lastSeen:k.lastSeen};});}
function save(){try{window.QuestProgress?.save?.();}catch{}}
const api={SKILLS,attach,record,support,tryIt,flexStar,comeback,spendGrit,gritAvailable,shinyChance,badgeReady,dueForReview,summary,sanitize,fresh,_skill:skill};
return api;
})();
