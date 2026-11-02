
const {TextEncoder,TextDecoder}=require('util');
function mkEnv(nWorlds,pokeTotal){
  const store={};
  global.window={WORLDS:Array.from({length:nWorlds},(_,i)=>({id:'w'+i})),POKE_TOTAL:pokeTotal,localStorage:{getItem:k=>store[k]??null,setItem:(k,v)=>{store[k]=v},__store:store},addEventListener(){} ,TextEncoder,TextDecoder,btoa:s=>Buffer.from(s,'binary').toString('base64'),atob:s=>Buffer.from(s,'base64').toString('binary')};
  global.document={addEventListener(){},dispatchEvent(){}};global.CustomEvent=class{constructor(t,o){this.type=t;this.detail=o?.detail}};
  global.TextEncoder=TextEncoder;global.TextDecoder=TextDecoder;global.btoa=window.btoa;global.atob=window.atob;
  delete require.cache[require.resolve('../progress.js')];require('../progress.js');return window.QuestProgress;
}
// 1. A realistic v3 save (6 worlds, 18 keys, buddy 5, badges all) loads under v4 with 6 worlds -> identical shapes
const v3={v:3,active:'aiden',roster:[],missions:[],profiles:[{id:'aiden',alias:'Aiden',avatar:0,state:{done:18,buddy:5,read:'short',xp:900,route:'trail',level:3,memoryWins:4,badges:[1,1,1,1,1,1],side:[0,1,0,0,0,0],dashPlayed:[1,1,1,1,1,1],dashBest:[10,20,30,40,50,60],hearts:Array(30).fill(2),audioV:8,g:{v:3,trailPoints:50,ledger:{'0-0':{page:2,tries:1,wrongs:0,variant:0,stage:'done',events:[]},'5-2':{page:2,tries:1,wrongs:0,variant:0,stage:'done',events:[]}},discoveries:{'0-0':true},labs:{'3-1':{value:50,steps:[1],found:[],done:true,chosen:-1,message:''}},wordRecords:{'12':{dates:['2026-10-01'],attempts:3,independent:2}},hatched:[0,1]}}}]};
let P=mkEnv(6,30);window.localStorage.setItem('aidens-world-quest-v3',JSON.stringify(v3));
let st=P.initial();console.log('A. 6 worlds: done',st.done,'buddy',st.buddy,'badges',st.badges.length,'hearts',st.hearts.length,'limits',JSON.stringify(P.limits()));
P.attach(st,()=>{});const saved=JSON.parse(window.localStorage.getItem('aidens-world-quest-v3'));console.log('   saved schema v',saved.v,'ledger keys',Object.keys(saved.profiles[0].state.g.ledger).join(','));
const code=P.encode();console.log('   encode prefix',code.slice(0,5));
// 2. Same save under 8 worlds -> arrays padded to 8, hearts to 40, done cap 24
P=mkEnv(8,40);window.localStorage.setItem('aidens-world-quest-v3',JSON.stringify(v3));st=P.initial();console.log('B. 8 worlds: badges',st.badges.length,'dashBest',JSON.stringify(st.dashBest),'hearts',st.hearts.length,'limits',JSON.stringify(P.limits()));
P.attach(st,()=>{});
// 3. New-world records and buddy 30+ gated by unlocked10
const v4=JSON.parse(JSON.stringify(v3));v4.v=4;const s4=v4.profiles[0].state;s4.done=24;s4.buddy=33;s4.badges=[1,1,1,1,1,1,1,1];s4.g.ledger['7-2']={page:2,tries:1,wrongs:0,variant:0,stage:'done',events:[]};s4.g.discoveries['6-1']=true;
let d=P.decode('AWQ4-'+btoa(JSON.stringify(v4)));let x=d.profiles[0].state;console.log('C. buddy 33 without unlock ->',x.buddy,'| done',x.done,'| ledger 7-2 kept',!!x.g.ledger['7-2'],'| disc 6-1 kept',x.g.discoveries['6-1']===true,'| badge 8',x.badges[7]);
s4.g.unlocked10=[33];d=P.decode('AWQ4-'+btoa(JSON.stringify(v4)));console.log('   buddy 33 with unlock ->',d.profiles[0].state.buddy);
// 4. AWQ3 code still imports; done > cap rejected; bad ledger id rejected
console.log('D. AWQ3 import ok:',!!P.decode('AWQ3-'+btoa(JSON.stringify(v3))));
try{const bad=JSON.parse(JSON.stringify(v4));bad.profiles[0].state.done=25;P.decode('AWQ4-'+btoa(JSON.stringify(bad)));console.log('   done 25 accepted (BAD)')}catch(e){console.log('   done 25 rejected:',e.message)}
try{const bad=JSON.parse(JSON.stringify(v4));bad.profiles[0].state.g.ledger['x-1']={};P.decode('AWQ4-'+btoa(JSON.stringify(bad)));console.log('   bad id accepted (BAD)')}catch(e){console.log('   bad id rejected:',e.message)}
// 5. Legacy AWQ2 still works; newProfile/reset use derived sizes; unlockPoke
P.legacy('AWQ2-'+btoa(JSON.stringify({v:2,d:6,b:1,r:'short',c:0,s:1,m:1,h:Array(30).fill(1),x:120,bd:[1,1,0,0,0,0],si:[],db:[],dp:[],mw:0,vo:1,mu:1,ar:1,mv:.2,vv:1,sv:.4,ca:0})));console.log('E. legacy done',P.live().done,'badges len',P.live().badges.length);
console.log('   unlockPoke(35)',P.unlockPoke(35),'unlockPoke(10)',P.unlockPoke(10),'unlocked',JSON.stringify(P.live().g.unlocked10));
P.newProfile('Lily');console.log('   new profile hearts',P.live().hearts.length,'badges',P.live().badges.length,'done',P.live().done);
// 6. skills10 passthrough without QuestSkills loaded, and with it
P.live().g.skills10={v:1,grit:5,per:{}};P.save();console.log('F. skills10 kept (no QuestSkills):',JSON.stringify(JSON.parse(window.localStorage.getItem('aidens-world-quest-v3')).profiles.find(p=>p.alias==='Lily').state.g.skills10));
