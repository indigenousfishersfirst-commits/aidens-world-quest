/* Phase 10a Badge Quest content. Loaded before progress.js so POKE_TOTAL is known when saves are checked.
   Honolulu and Paris come from stops-10a.js (WORLDS_10A). Barkley Sound is written here, in English only.
   No Nuu-chah-nulth words, names or audio are used: that needs the language consultation Andy is leading. */
window.POKE_TOTAL=40;
window.BQ_DATA=(()=>{
const W10=window.WORLDS_10A||[];
const byId=id=>W10.find(w=>w.id===id);
const barkley={
  id:'barkley',place:'Barkley Sound',country:'Vancouver Island, Canada',subtitle:'The sound of salmon and rain',color:'#3f7f86',continent:'North America',npc:'Sam',role:'stream keeper',food:'Clam chowder',pet:'Feebas',petId:349,badge:null,skill:'cvc',
  summary:'Ride a boat down a long inlet, count jumping salmon, and help a shy fish find deep water.',
  source:{name:'Parks Canada: Pacific Rim National Park Reserve',url:'https://parks.canada.ca/pn-np/bc/pacificrim'},
  quests:[
    {title:'Down the long inlet',kind:'WHERE',stop:'Meet Sam',
     short:'Aiden rides a boat down the Alberni Inlet. It is a long arm of the sea. At the end is Barkley Sound, full of green islands. Sam, a stream keeper, waves from the dock.',
     question:'Where does the boat take Aiden?',options:['Barkley Sound on Vancouver Island','Paris in France','Honolulu in Hawaiʻi'],answer:0,clue:'At the end is Barkley Sound, full of green islands.'},
    {title:'The salmon come home',kind:'WHAT',stop:'The jumping fish',
     short:'It is fall, and the salmon are coming home from the ocean. They jump up a waterfall to reach the stream where they hatched. Sam counts them. Sea lions and eagles watch for a snack.',
     question:'What do the salmon jump up?',options:['A tall tower','A waterfall','A volcano'],answer:1,clue:'They jump up a waterfall to reach the stream where they hatched.'},
    {title:'A shy fish in a small pool',kind:'WHO',stop:'A new friend',
     short:'A Feebas is stuck in a little pool by the rocks. Sam and Aiden scoop it into a bucket of sea water. They carry it slowly to the deep water. Sam shares hot clam chowder after. Feebas swims back to follow Aiden.',
     question:'Who helps Aiden carry Feebas?',options:['Kai','Amélie','Sam'],answer:2,clue:'Sam and Aiden scoop it into a bucket of sea water.'}
  ],
  spotters:[{id:320,name:'Wailmer'},{id:627,name:'Rufflet'}],
  fact:'In spring, herring lay so many tiny eggs in Barkley Sound that the water turns milky white.'
};
const honolulu=byId('honolulu'),paris=byId('paris');
const STOPS=[barkley,honolulu,paris].filter(Boolean);
/* Index 30-39 in QuestProgress.unlocked10. Evolution forms are shown but not counted. */
const ROSTER=[
  {index:30,id:728,name:'Popplio',stop:'honolulu',kind:'partner',evo:{id:729,name:'Brionne'}},
  {index:31,id:653,name:'Fennekin',stop:'paris',kind:'partner',evo:{id:654,name:'Braixen'}},
  {index:32,id:349,name:'Feebas',stop:'barkley',kind:'partner',evo:{id:350,name:'Milotic'}},
  {index:33,id:278,name:'Wingull',stop:'honolulu',kind:'spotter'},
  {index:34,id:771,name:'Pyukumuku',stop:'honolulu',kind:'spotter'},
  {index:35,id:722,name:'Rowlet',stop:'honolulu',kind:'spotter'},
  {index:36,id:707,name:'Klefki',stop:'paris',kind:'spotter'},
  {index:37,id:661,name:'Fletchling',stop:'paris',kind:'spotter'},
  {index:38,id:320,name:'Wailmer',stop:'barkley',kind:'spotter'},
  {index:39,id:627,name:'Rufflet',stop:'barkley',kind:'spotter'}
];
const EEVEE=[{key:'water',id:134,name:'Vaporeon'},{key:'electric',id:135,name:'Jolteon'},{key:'fire',id:136,name:'Flareon'}];
/* 12-slot badge case. src 'base' = original state.badges index; src 'bq' = Badge Quest stop. */
const BADGES=[
  {name:'Grass',color:'#5f9e4b',src:'base',i:0},{name:'Electric',color:'#e2b528',src:'base',i:1},{name:'Fire',color:'#e06a3b',src:'base',i:2},
  {name:'Rock',color:'#a08b5b',src:'base',i:3},{name:'Ground',color:'#c08a4a',src:'base',i:4},{name:'Dragon',color:'#6a5ac8',src:'base',i:5},
  {name:'Water',color:'#3a8fd0',src:'bq',stop:'honolulu'},{name:'Steel',color:'#8a97a8',src:'bq',stop:'paris'},
  {name:'Ice',color:'#7fc8d8',src:'soon'},{name:'Fairy',color:'#e48fb6',src:'soon'},{name:'Flying',color:'#8fa6e8',src:'soon'},{name:'Normal',color:'#a8a28a',src:'soon'}
];
/* Short-vowel rounds so the cvc skill (Grass, Eevee evolution) can be practised. */
const CVC_SURF={skill:'cvc',sounds:[
  {phoneme:'short a, like cat',hits:['cat','map','hat','jam','sad'],misses:['cake','gate','tape','late']},
  {phoneme:'short i, like fin',hits:['fin','sit','lip','pin','dig'],misses:['kite','ride','bike','time']},
  {phoneme:'short o, like dog',hits:['dog','log','pot','hop','mop'],misses:['rope','bone','hope','note']},
  {phoneme:'short u, like sun',hits:['sun','bug','cup','mud','tub'],misses:['tube','cute','mule','huge']},
  {phoneme:'short e, like net',hits:['net','bed','hen','pet','web'],misses:['feet','seat','team','bee']}
]};
const SURF_SAY={'/ā/':'long a, like wave','/ī/':'long i, like kite','/ō/':'long o, like rope','/sh/':'sh, like ship'};
const LABS={
  honolulu:{title:'Lava flow',mission:'Lava flows downhill. Open the vents from the top of the mountain to the bottom, and the lava will make new land in the sea.',done:'New black land, right at the edge of the sea. That is how the Hawaiian islands grew.'},
  paris:{title:'Triangle tower',mission:'Build the tower five pieces high. Pick a shape for each level, then let the wind blow.',done:'Triangles hold their shape when the wind pushes. The Eiffel Tower is full of them.'}
};
const TEASER={from:'Yuki',place:'Sapporo',text:'Hi Aiden. It is snowing in Sapporo, and the snow festival is coming. Bring warm mittens. Your next badge is made of ice. From your friend Yuki.'};
/* Narration clip ids (assets/audio/bq/<id>.mp3) and the exact text each one says. */
const CLIPS={};
STOPS.forEach(s=>s.quests.forEach((q,i)=>{CLIPS[`${s.id}-s${i}`]=q.short;CLIPS[`${s.id}-q${i}`]=q.question+' '+q.options.join('. ')+'.';}));
Object.assign(CLIPS,{
  'map':'Welcome to Badge Quest. Pick a place on the map, and we will fly there together.',
  'surf-intro':'Popplio wants to surf. Listen for the sound, then tap every wave that has it.',
  'salmon-intro':'Help the salmon jump home. Listen for the sound, then tap every wave that has it.',
  'forge-intro':'Klefki needs new keys. Pick the two letters that finish each word, and the key will fit.',
  'lava-intro':'Trace the glowing letter with your finger. Start at the green dot and follow the arrow.',
  'karp-intro':'This is Magikarp’s Climb. I say a word, you tap it, and Magikarp jumps up the waterfall.',
  'lab-honolulu':LABS.honolulu.mission,'lab-paris':LABS.paris.mission,
  'badge-water':'You earned the Water Badge. You kept trying, and the waves kept coming. That is how surfers learn.',
  'badge-steel':'You earned the Steel Badge. Strong like the tower, one piece at a time.',
  'stamp-barkley':'You finished Barkley Sound. Thank you for helping Feebas. Kind and patient, just like Sam.',
  'karp-0':'Every splash counts.','karp-1':'Up we go. Again.','karp-2':'Even a small jump is a jump.','karp-3':'Trainers level up by losing a few battles first.',
  'karp-evolve':'Look at that. One hundred jumps, and Magikarp has become Gyarados. Every splash counted.',
  'evolve':'Something is happening. Your friend is growing stronger, because you kept practising together.',
  'eevee':'Eevee can grow up in three different ways. Which one do you like best? You can change your mind any time.',
  'teaser':TEASER.text,
  'grit':'That took grit. Trying again is how brains grow.'
});
return {STOPS,ROSTER,EEVEE,BADGES,CVC_SURF,SURF_SAY,LABS,TEASER,CLIPS,barkley};
})();
