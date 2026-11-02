/* Phase 10a draft content: Honolulu and Paris, in the window.WORLDS shape from data.js.
   NOT loaded by index.html yet. Merging these into WORLDS needs the save-schema changes listed in phase10/README.md
   (done cap 18 -> 36, badges 6 -> 12, hearts 30 -> 60, buddy cap, ledger id pattern). */
window.WORLDS_10A=[
  {
    id:'honolulu', place:'Honolulu', country:'Hawaiʻi, USA', subtitle:'The island of fire and surf', color:'#e0744a', continent:'Oceania', npc:'Kai', role:'surf lifeguard', food:'Poke bowl', pet:'Popplio', petId:728, badge:'Water', skill:'magicE', region:'Alola',
    summary:'Ride a gentle wave, taste a rainbow bowl, and meet a sea lion who loves to sing.',
    source:{name:'Hawaiʻi Volcanoes National Park',url:'https://www.nps.gov/havo/index.htm'},
    quests:[
      {title:'A wave of welcome',kind:'WHERE',icon:'map-pin',stop:'Meet Kai',
       short:'Aiden lands in Honolulu, on the island of Oʻahu in Hawaiʻi. Warm waves roll onto the sand. Kai, a surf lifeguard, waves from a tall white chair. “Aloha!” he calls.',
       long:'Aiden steps off the plane in Honolulu, a city on the island of Oʻahu in Hawaiʻi. The air smells like flowers and salt. Warm waves roll up the sand and slide back again. Kai, a surf lifeguard, waves from a tall white chair. “Aloha! That word means hello and goodbye and love,” he says. Aiden says it back, and a wave tickles his toes.',
       question:'Where has Aiden landed?',options:['Honolulu in Hawaiʻi','Cairo in Egypt','Kyoto in Japan'],answer:0,clue:'Aiden lands in Honolulu, on the island of Oʻahu in Hawaiʻi.',why:'He has landed in Honolulu, in Hawaiʻi.',word:['tide','The slow rise and fall of the sea each day.']},
      {title:'A rainbow in a bowl',kind:'WHAT',icon:'utensils',stop:'Lunch on the beach',
       short:'Kai brings two poke bowls. Poke means cut into pieces. Aiden sees pink fish, rice, green seaweed and yellow mango. He tries a little of each.',
       long:'After the swim, Kai brings two poke bowls to a shady picnic table. Poke is a Hawaiian word that means cut into pieces. The bowl has pink fish, white rice, green seaweed and bright yellow mango. Aiden tries one thing at a time. The fish reminds him of salmon at home. “Every colour is a different taste,” Kai says.',
       question:'What is in Aiden’s poke bowl?',options:['Pizza and cheese','Fish, rice, seaweed and mango','Corn and butter'],answer:1,clue:'Aiden sees pink fish, rice, green seaweed and yellow mango.',why:'His poke bowl has fish, rice, seaweed and mango.',word:['mango','A sweet yellow fruit that grows on trees in warm places.']},
      {title:'A song from the rocks',kind:'WHO',icon:'paw-print',stop:'A singing friend',
       short:'A Popplio sits on the black rocks. Its nose balloon has popped. Kai shows Aiden how to blow a slow bubble. Popplio copies him and sings. A new friend!',
       long:'Aiden hears a sad little bark from the black lava rocks. A Popplio is sitting there. The balloon it makes with its nose has popped, and it cannot make a new one. Kai kneels down and shows Aiden how to blow a slow, gentle bubble with a wand. Aiden blows. Popplio watches, tries, and makes a huge shining balloon. It claps its flippers and sings. Then it flops along beside Aiden.',
       question:'Who shows Aiden how to blow a slow bubble?',options:['Maya','Kai','Luca'],answer:1,clue:'Kai shows Aiden how to blow a slow bubble.',why:'Kai helps Aiden teach Popplio a slow bubble.',word:['lava','Hot melted rock that comes out of a volcano and cools into black stone.']}
    ],
    lab:{title:'Lava flow',kind:'chain',mission:'Open the vents in the right order so the lava reaches the sea and makes new land.',model:'A simplified volcano model.'},
    spotters:[{id:278,name:'Wingull'},{id:771,name:'Pyukumuku'},{id:722,name:'Rowlet'}],
    game:'soundSurf',
    sound:{bed:'surf-soft',oneoff:['ukulele-note','gull']},
    words:['wave','ride','tide','cove','kite','shine','hope','wake']
  },
  {
    id:'paris', place:'Paris', country:'France', subtitle:'The city of keys and towers', color:'#7a86b8', continent:'Europe', npc:'Amélie', role:'baker', food:'Croissant', pet:'Fennekin', petId:653, badge:'Steel', skill:'vowelTeam', region:'Kalos',
    summary:'Climb a famous iron tower, taste a flaky crescent, and help a fox with a jingling friend.',
    source:{name:'Paris Je t’aime: Eiffel Tower',url:'https://parisjetaime.com/eng/culture/eiffel-tower-p1150'},
    quests:[
      {title:'A tower made of triangles',kind:'WHERE',icon:'map-pin',stop:'Meet Amélie',
       short:'Aiden arrives in Paris, a city in France. A tall iron tower stands over the river. Amélie, a baker, meets him with flour on her apron. “Bonjour!” she says.',
       long:'Aiden arrives in Paris, a city in France. A tall iron tower stands over the river, made of thousands of little triangles. It is the Eiffel Tower. Amélie, a baker, meets him at the bottom with flour still on her apron. “Bonjour! That means good day,” she says. Aiden looks up and up and up, and the tower does not seem to end.',
       question:'Where has Aiden arrived?',options:['Rome in Italy','Paris in France','Sydney in Australia'],answer:1,clue:'Aiden arrives in Paris, a city in France.',why:'He has arrived in Paris, in France.',word:['tower','A very tall, narrow building or structure.']},
      {title:'A flaky crescent moon',kind:'WHAT',icon:'utensils',stop:'At the bakery',
       short:'Amélie opens her oven. Out come croissants, curved like little moons. They are made of many thin layers. Aiden waits for his to cool, then takes a crunchy bite.',
       long:'Amélie’s bakery smells of warm butter. She opens the oven, and out slides a tray of croissants, curved like little moons. Each one is made of many thin layers of dough folded over and over. Aiden waits for his to cool. When he bites it, tiny flakes fall like snow. “Patience makes the layers,” Amélie says.',
       question:'What does Aiden eat at the bakery?',options:['A croissant','A lamington','Koshari'],answer:0,clue:'Out come croissants, curved like little moons.',why:'Aiden eats a croissant, a flaky pastry.',word:['layer','One thin sheet lying on top of another.']},
      {title:'The fox and the keys',kind:'WHO',icon:'paw-print',stop:'A jingling friend',
       short:'A Fennekin is chasing a jingling sound. It is a Klefki, a Pokémon that collects keys. Klefki has Amélie’s bakery key! Amélie helps Aiden trade a shiny button for it. Fennekin joins the team.',
       long:'A small orange Fennekin is trotting after a jingling sound. The sound comes from a Klefki, a Pokémon that collects keys on its ring. One of them is Amélie’s bakery key! Amélie shows Aiden a shiny button from her apron. Aiden holds it out calmly. Klefki trades the key for the button and floats off, jingling happily. Fennekin sits down beside Aiden, tail wagging. It wants to come along.',
       question:'Who helps Aiden trade a button for the key?',options:['Amélie','Kai','Hana'],answer:0,clue:'Amélie helps Aiden trade a shiny button for it.',why:'Amélie helps Aiden get the bakery key back from Klefki.',word:['trade','To give one thing and get another thing back.']}
    ],
    lab:{title:'Triangle tower',kind:'pattern',mission:'Stack the triangles so the tower stands up in the wind. Squares wobble, triangles hold.',model:'A simplified structure model.'},
    spotters:[{id:707,name:'Klefki'},{id:661,name:'Fletchling'}],
    game:'keyForge',
    sound:{bed:'cafe-low',oneoff:['bicycle-bell','pigeon']},
    words:['rain','tree','boat','bread','seat','coat','meal','train']
  }
];
/* Word banks for the four 10a mini-games. */
window.PLAY10A={
  soundSurf:{skill:'magicE',sounds:[
    {phoneme:'/ā/',hits:['wave','cake','gate','sail'],misses:['cat','map','hat','jam']},
    {phoneme:'/ī/',hits:['kite','ride','tide','bike'],misses:['fin','sit','lip','pin']},
    {phoneme:'/ō/',hits:['cove','rope','bone','hope'],misses:['dog','log','pot','hop']},
    {phoneme:'/sh/',hits:['ship','shell','fish','wish'],misses:['sip','sell','fit','win']}]},
  keyForge:{skill:'vowelTeam',words:[
    {word:'rain',missing:[1,2]},{word:'tree',missing:[2,3]},{word:'boat',missing:[1,2]},{word:'bread',missing:[2,3]},
    {word:'seat',missing:[1,2]},{word:'coat',missing:[1,2]},{word:'train',missing:[2,3]},{word:'meal',missing:[1,2]}]},
  lavaLetters:{skill:'letterForm',sets:[['c','o','a','d','g'],['l','t','i','h','k'],['b','p','q','j','y'],['s','e','n','m','r']]},
  magikarp:{skill:'review',evolveAt:100,lines:['Every splash counts.','Up we go. Again!','Even a small jump is a jump.','Trainers level up by losing a few battles first.']}
};
