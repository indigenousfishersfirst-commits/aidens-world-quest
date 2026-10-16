window.WORLDS = [
  {
    id:'bc', place:'Vancouver Island', country:'Canada', subtitle:'The forest by the sea', color:'#3e8561', continent:'North America', npc:'Maya', role:'fisher', food:'Salmon', pet:'Eevee', petId:133,
    summary:'Follow a forest trail, share a seaside lunch, and listen for a little rustle.',
    source:{name:'Destination Greater Victoria',url:'https://www.destinationgreatervictoria.com/travel-media/story-ideas/culinary-story-starters'},
    quests:[
      {title:'A hello by the harbour',kind:'WHERE',icon:'map-pin',stop:'Meet Maya',
       short:'Aiden arrives on Vancouver Island in Canada. Tall trees grow beside the sea. Maya, a fisher, waves from the dock. “Welcome to the island!” she says.',
       long:'Aiden steps onto a wooden dock on Vancouver Island in Canada. The sea sparkles between tall trees. A red boat bobs on the water. Maya, a fisher, ties a rope to the dock. “Welcome to the island!” she says. Aiden smiles and follows her along the forest trail.',
       question:'Where has Aiden arrived?',options:['Vancouver Island','Rome','Sydney'],answer:0,clue:'Aiden arrives on Vancouver Island in Canada.',why:'He has arrived on Vancouver Island, in Canada.',word:['dock','A platform beside the water where boats can stop.']},
      {title:'Lunch beside the sea',kind:'WHAT',icon:'utensils',stop:'Taste something new',
       short:'Maya has a warm lunch for Aiden. He tries a piece of salmon with lemon. Salmon is a fish. Aiden takes a little bite and smiles.',
       long:'After the walk, Maya brings a warm lunch to a picnic table. Aiden can hear the waves. There is a piece of salmon on his plate, with a slice of lemon beside it. Salmon is a fish. He takes a little bite, then another. “Thank you for lunch,” Aiden says.',
       question:'What food does Aiden try?',options:['Pizza','Salmon','Corn'],answer:1,clue:'He tries a piece of salmon with lemon.',why:'Aiden tries salmon, a fish.',word:['picnic','A meal eaten outside.']},
      {title:'A rustle in the ferns',kind:'WHO',icon:'paw-print',stop:'Find a new friend',
       short:'A little Eevee peeks out from the ferns. It looks thirsty. Maya helps Aiden fill a bowl with water. Eevee drinks and sits beside Aiden. A new friend!',
       long:'Aiden hears a soft rustle by the trail. A little Eevee peeks out from the ferns. It looks thirsty after its adventure. Maya helps Aiden fill a small bowl with clean water. Eevee drinks, shakes its fluffy tail, and sits beside Aiden. Aiden waits quietly. Eevee chooses to follow him!',
       question:'Who helps Aiden fill the water bowl?',options:['Luca','Jess','Maya'],answer:2,clue:'Maya helps Aiden fill a bowl with water.',why:'Maya helps him get water for Eevee.',word:['ferns','Leafy green plants that often grow in shady places.']}
    ]
  },
  {
    id:'kyoto', place:'Kyoto', country:'Japan', subtitle:'The blossom bridge', color:'#b95d76',continent:'Asia',npc:'Hana',role:'garden keeper',food:'Onigiri',pet:'Pikachu',petId:25,
    summary:'Cross a red bridge, taste a rice ball, and help a small yellow friend.',
    source:{name:'Kyoto City Tourism',url:'https://kyoto.travel/en/travel-inspiration/lami/'},
    quests:[
      {title:'Across the red bridge',kind:'WHERE',icon:'map-pin',stop:'Meet Hana',
       short:'Aiden is in Kyoto, a city in Japan. Pink blossoms float past a red bridge. Hana, a garden keeper, says hello. She shows Aiden a quiet path beside the stream.',
       long:'Aiden arrives in Kyoto, a city in Japan. Pink blossoms float down onto a red bridge. A small stream flows beneath it. Hana, a garden keeper, smiles and says hello. She shows Aiden a quiet path beside the water. He stops to listen to the birds before crossing the bridge.',
       question:'Where is Aiden exploring?',options:['Cairo in Egypt','Kyoto in Japan','Rome in Italy'],answer:1,clue:'Aiden is in Kyoto, a city in Japan.',why:'He is exploring Kyoto, in Japan.',word:['blossom','A flower on a tree or bush.']},
      {title:'A little rice-ball picnic',kind:'WHAT',icon:'utensils',stop:'A garden picnic',
       short:'Hana opens a picnic box. Inside are onigiri, Japanese rice balls. Some have a strip of seaweed around them. Aiden tries an onigiri under a shady tree.',
       long:'It is time for a picnic. Hana opens a small box beneath a shady tree. Inside are onigiri, Japanese rice balls. Some are shaped like triangles, with a strip of seaweed around them. Aiden picks one up and takes a bite. A little breeze moves the blossoms above his head.',
       question:'What does Aiden try at the picnic?',options:['Onigiri rice balls','A lamington cake','Salmon'],answer:0,clue:'Inside are onigiri, Japanese rice balls.',why:'Aiden tries an onigiri rice ball.',word:['seaweed','A plant-like living thing that grows in the sea.']},
      {title:'A yellow friend in the garden',kind:'WHO',icon:'paw-print',stop:'A tiny yellow visitor',
       short:'Pikachu is looking for its red scarf. Aiden spots it beside the bridge. Hana helps him lift the scarf from a branch. Pikachu puts it on and joins the adventure.',
       long:'A little yellow Pikachu is looking behind a tree. It has lost its red scarf. Aiden spots something red beside the bridge. The scarf is caught on a low branch. Hana helps him lift it down gently. Pikachu puts the scarf on, gives a happy little hop, and joins Aiden on the path.',
       question:'Who helps Aiden lift down the scarf?',options:['Omar','Maya','Hana'],answer:2,clue:'Hana helps him lift the scarf from a branch.',why:'Hana helps Aiden return the scarf to Pikachu.',word:['branch','A part of a tree that grows out from its trunk.']}
    ]
  },
  {
    id:'rome', place:'Rome', country:'Italy',subtitle:'The fountain surprise',color:'#bd6d42',continent:'Europe',npc:'Luca',role:'pizza maker',food:'Pizza',pet:'Vulpix',petId:37,
    summary:'Visit a sunny square, meet a pizza maker, and solve a tiny fountain mystery.',
    source:{name:'Turismo Roma',url:'https://www.turismoroma.it/en/15042013-la-pizza'},
    quests:[
      {title:'A sunny city square',kind:'WHERE',icon:'map-pin',stop:'Meet Luca',
       short:'Aiden arrives in Rome, a city in Italy. Water splashes in a fountain. Luca, a pizza maker, waves from his shop. “Come and see our sunny square!” he says.',
       long:'Aiden arrives in Rome, a city in Italy. He walks into a sunny square with warm-coloured buildings. Water splashes in a stone fountain. Luca, a pizza maker, waves from the door of his shop. “Come and see our square!” he says. Aiden notices flowers in the windows and pigeons on the stones.',
       question:'Where has Aiden arrived?',options:['Rome in Italy','Kyoto in Japan','Cusco in Peru'],answer:0,clue:'Aiden arrives in Rome, a city in Italy.',why:'He has arrived in Rome, in Italy.',word:['square','An open space in a town or city, often with buildings around it.']},
      {title:'Fresh from the oven',kind:'WHAT',icon:'utensils',stop:'At the pizza shop',
       short:'Luca brings a pizza to the table. It has tomato, cheese, and green basil leaves. Aiden lets his slice cool. Then he tries a bite of pizza.',
       long:'A lovely smell drifts out of Luca’s shop. He brings a pizza to the table. It has red tomato sauce, melted cheese, and little green basil leaves. Aiden waits for his slice to cool before taking a bite. Luca tells him that food is even nicer when it is shared with friends.',
       question:'What food does Aiden taste?',options:['Rice balls','Corn','Pizza'],answer:2,clue:'Then he tries a bite of pizza.',why:'Aiden tastes pizza with tomato, cheese, and basil.',word:['basil','A green herb with leaves used to flavour food.']},
      {title:'Six tails by the fountain',kind:'WHO',icon:'paw-print',stop:'A fountain surprise',
       short:'A Vulpix sits beside the fountain. Its little blue ball has rolled under a bench. Luca helps Aiden reach the ball. Vulpix wags its tails and follows them back to the shop.',
       long:'By the fountain, Aiden finds a Vulpix watching a bench. Its little blue ball has rolled underneath. Aiden kneels down, but the ball is just out of reach. Luca helps him reach it with a long wooden spoon. Vulpix wags its tails when Aiden gives the ball back. It wants to come along!',
       question:'Who helps Aiden reach the blue ball?',options:['Hana','Luca','Jess'],answer:1,clue:'Luca helps Aiden reach the ball.',why:'Luca helps Aiden get Vulpix’s ball back.',word:['fountain','A structure where water flows or sprays into the air.']}
    ]
  },
  {
    id:'cairo',place:'Cairo',country:'Egypt',subtitle:'The river of golden light',color:'#a77933',continent:'Africa',npc:'Omar',role:'boat captain',food:'Koshari',pet:'Sandshrew',petId:27,
    summary:'Watch boats on the Nile, try a colourful bowl, and help a sandy little friend.',
    source:{name:'Cairo Tourism',url:'https://www.cairotourism.org/best-koshary-in-cairo-where-to-find-egypts-dish/'},
    quests:[
      {title:'A wave from the river',kind:'WHERE',icon:'map-pin',stop:'Meet Omar',
       short:'Aiden visits Cairo, a city in Egypt. He watches boats on the Nile River. Omar, a boat captain, waves from the riverbank. The water shines in the warm light.',
       long:'Aiden visits Cairo, a city in Egypt. He walks beside the Nile River with his grown-up. Boats move slowly across the shining water. Omar, a boat captain, waves from the riverbank. He points out a boat with a tall white sail. Aiden watches the sail fill with wind.',
       question:'Where is Aiden visiting?',options:['Sydney in Australia','Rome in Italy','Cairo in Egypt'],answer:2,clue:'Aiden visits Cairo, a city in Egypt.',why:'Aiden is visiting Cairo, in Egypt.',word:['riverbank','The land along the edge of a river.']},
      {title:'A bowl full of colours',kind:'WHAT',icon:'utensils',stop:'A riverside lunch',
       short:'Omar joins Aiden for lunch. Aiden tries koshari. The bowl has rice, lentils, pasta, and tomato sauce. Crispy onions sit on top. There is a lot to discover in one bowl!',
       long:'Omar joins Aiden at a little lunch table. Aiden tries koshari, a dish enjoyed in Egypt. The bowl has rice, lentils, pasta, and tomato sauce. Crispy onions sit on top. Aiden looks at all the different shapes before taking a spoonful. He finds that one bowl can hold lots of different tastes.',
       question:'What is the dish in Aiden’s bowl called?',options:['Koshari','Onigiri','Pizza'],answer:0,clue:'Aiden tries koshari.',why:'His bowl of rice, lentils, and pasta is called koshari.',word:['lentils','Small seeds that are cooked and eaten as food.']},
      {title:'Little footprints in the sand',kind:'WHO',icon:'paw-print',stop:'Follow the footprints',
       short:'A Sandshrew has dropped a shiny pebble beside a basket. Aiden spots it in the sand. Omar helps him move the empty basket. Sandshrew picks up its pebble and walks beside Aiden.',
       long:'Aiden notices tiny footprints in a sandy patch beside the path. A Sandshrew is searching near an empty basket. It has dropped its favourite shiny pebble. Aiden spots the pebble, and Omar helps him move the basket gently. Sandshrew picks up its treasure. Then it walks beside Aiden, ready for a new adventure.',
       question:'Who helps Aiden move the basket?',options:['Maya','Omar','Luca'],answer:1,clue:'Omar helps him move the empty basket.',why:'Omar helps Aiden make room for Sandshrew to find its pebble.',word:['pebble','A small, smooth stone.']}
    ]
  },
  {
    id:'cusco',place:'Cusco',country:'Peru',subtitle:'The mountain market',color:'#826b9c',continent:'South America',npc:'Lucía',role:'weaver',food:'Corn',pet:'Bulbasaur',petId:1,
    summary:'Explore a mountain city, taste golden corn, and make a green new friend.',
    source:{name:'Peru Sites: Cusco food guide',url:'https://perusites.com/cusco/gastronomy/'},
    quests:[
      {title:'Colours in the mountains',kind:'WHERE',icon:'map-pin',stop:'Meet Lucía',
       short:'Aiden arrives in Cusco, a city in Peru. Mountains rise above the rooftops. Lucía, a weaver, shows him colourful yarn at the market. Aiden sees red, blue, and gold.',
       long:'Aiden arrives in Cusco, a city in Peru. Mountains rise above the rooftops and market stalls. Lucía, a weaver, invites him to look at her colourful yarn. She is making a warm scarf. Aiden spots red, blue, and gold in the pattern. He watches as the threads become a piece of cloth.',
       question:'Where is Aiden exploring the market?',options:['Kyoto in Japan','Cusco in Peru','Cairo in Egypt'],answer:1,clue:'Aiden arrives in Cusco, a city in Peru.',why:'The mountain market is in Cusco, in Peru.',word:['weaver','A person who makes cloth by crossing threads together.']},
      {title:'Golden kernels',kind:'WHAT',icon:'utensils',stop:'A market snack',
       short:'Lucía takes Aiden to a food stall. He tries corn with a little cheese. The corn has big kernels. Aiden holds the cob carefully and takes a bite.',
       long:'All the walking has made Aiden hungry. Lucía takes him to a food stall, where he tries corn with a little cheese. The corn has big kernels lined up along the cob. Aiden holds it carefully and takes a bite. He thanks the cook before they go back to look at the market.',
       question:'What does Aiden try with cheese?',options:['Salmon','A cake','Corn'],answer:2,clue:'He tries corn with a little cheese.',why:'Aiden tries corn with cheese at the market.',word:['kernel','One of the little seeds on a cob of corn.']},
      {title:'A tiny garden helper',kind:'WHO',icon:'paw-print',stop:'A leafy little friend',
       short:'A Bulbasaur sits beside a dry plant pot. Lucía helps Aiden bring some water. Together they water the little plant. Bulbasaur gives a happy nod and joins Aiden’s team.',
       long:'Near the market, a Bulbasaur is watching a plant pot. The soil looks dry. Lucía helps Aiden bring a small jug of water. Aiden pours slowly so the water can soak into the soil. Bulbasaur gives a happy nod. It sits beside Aiden’s backpack, ready to travel with a kind new friend.',
       question:'Who helps Aiden bring water for the plant?',options:['Lucía','Hana','Omar'],answer:0,clue:'Lucía helps Aiden bring some water.',why:'Lucía helps Aiden care for the little plant.',word:['soil','The earth that plants grow in.']}
    ]
  },
  {
    id:'sydney',place:'Sydney',country:'Australia',subtitle:'The harbour homecoming',color:'#3b8b9d',continent:'Oceania',npc:'Jess',role:'harbour ranger',food:'Lamington',pet:'Squirtle',petId:7,
    summary:'Follow the harbour, find a coconut-covered treat, and meet your final friend.',
    source:{name:'Sydney Cakery',url:'https://www.sydneycakery.com.au/product/lamington-cake-2/'},
    quests:[
      {title:'Sails in the sunshine',kind:'WHERE',icon:'map-pin',stop:'Meet Jess',
       short:'Aiden visits Sydney, a city in Australia. Boats sail across the harbour. Jess, a harbour ranger, points to the Opera House. Its white roof looks a little like sails.',
       long:'Aiden visits Sydney, a city in Australia. Sunlight sparkles on the harbour, and boats sail past. Jess, a harbour ranger, points across the water to the Opera House. Its white roof looks a little like sails to Aiden. He walks along the wide path and listens to the seabirds overhead.',
       question:'Where is Aiden visiting the harbour?',options:['Sydney in Australia','Cusco in Peru','Rome in Italy'],answer:0,clue:'Aiden visits Sydney, a city in Australia.',why:'The harbour adventure is in Sydney, in Australia.',word:['harbour','A sheltered area of water where boats can stay.']},
      {title:'A coconut-covered surprise',kind:'WHAT',icon:'utensils',stop:'A sweet little stop',
       short:'Jess brings a small cake called a lamington. It has soft sponge inside, with chocolate and coconut outside. Aiden tries a little piece. A coconut flake lands on his nose!',
       long:'Jess brings a little treat for their picnic. It is a cake called a lamington. Soft sponge is covered with chocolate and coconut. Aiden tries a small piece and notices how soft it is inside. A coconut flake lands on his nose. They both laugh before Jess passes him a napkin.',
       question:'What is the little cake called?',options:['Onigiri','Koshari','Lamington'],answer:2,clue:'Jess brings a small cake called a lamington.',why:'Aiden tries a lamington, a coconut-covered cake.',word:['sponge cake','A soft, light kind of cake.']},
      {title:'One last act of kindness',kind:'WHO',icon:'paw-print',stop:'A friend by the water',
       short:'A Squirtle has found a bottle on the path. Jess helps Aiden put it in a recycling bin. The path is clean again. Squirtle smiles and joins Aiden. What a wonderful world of friends!',
       long:'A Squirtle is standing beside a plastic bottle on the harbour path. It looks from the bottle to the water. Jess helps Aiden put the bottle in a recycling bin so it cannot blow into the harbour. The path is clean again. Squirtle smiles and joins Aiden. His team of friends is ready to celebrate!',
       question:'Who helps Aiden recycle the bottle?',options:['Luca','Jess','Lucía'],answer:1,clue:'Jess helps Aiden put it in a recycling bin.',why:'Jess helps Aiden keep the harbour path clean.',word:['recycle','To collect materials so they can be made into something useful again.']}
    ]
  }
];
