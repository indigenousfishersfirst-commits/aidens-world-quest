# Aiden's World Quest: Phase 10 Design Brief (Badge Quest)

Prepared November 2, 2026 for the next Computer build session. Builds on the Phase 9 handoff (Play Zone, Adventure Pass, Focus mode) and the current repository (main, sw.js cache v13; next bump is v14).

Goal: a bigger, more exciting world (12 stops instead of 6), a Pokemon badge system that secretly maps onto phonics and handwriting skills, eight new action mini-games for spelling, word sounds and letter formation, and mechanics that reward trying, adapting and bouncing back. Learning stays hidden inside play. No lessons, no quizzes.

This file is a plan only. Nothing in it has been built or tested yet.

## 1. Design pillars

- Fun first, always. Every new mechanic must be something Aiden would choose to do if there were no learning in it.
- Action over reading load. New games are 60 to 90 second rounds with big targets, motion, particles and sound. Reading is short and read aloud.
- One secret curriculum. Every badge, Pokemon type and mini-game is tied to one phonics or handwriting skill. Aiden sees Pokemon types; the hidden tracker sees skills.
- Mistakes are fuel. Wrong tries never cost points. Retrying grows a visible Grit meter and unlocks things first-try perfection cannot.
- Adaptable by design. Hidden tracker steps difficulty up at 80 percent first-try success and down (with more support) below 50 percent.
- Dyslexia, dysgraphia and ADHD supports stay on: read-aloud, syllable colours, roomy text, short rounds, Focus mode, large stroke targets, no punishing timers.
- Keep the quiet audio rules, local-first saves and the AWQ3 backup format. Bump sw.js to v14.
- Never include NIFI, NIFI-Tech or Cantek.

## 2. Six new world stops with Pokemon-region connections

The Pokemon games base their regions on real places: Unova on New York City, Kalos on northern France and Paris, Alola on Hawaii, Galar on Great Britain, Paldea on Spain and Portugal, Sinnoh on Hokkaido. Each new stop pairs a real city with the region it inspired so Aiden can spot the connection himself.

| Stop | Pokemon region link | NPC and role | Food to try | Partner Pokemon (Dex ID) | Spotter Pokemon | Field Lab | Place sound (very quiet) |
|---|---|---|---|---|---|---|---|
| Honolulu, Hawaii | Alola (name plays on aloha) | Kai, surf lifeguard | Poke bowl, shave ice | Popplio (728) | Wingull (278), Pyukumuku (771), Rowlet (722) | Volcano lab: build a lava flow and watch it cool into new land | Soft surf, ukulele note |
| Paris, France | Kalos (Prism Tower mirrors the Eiffel Tower) | Amelie, baker | Croissant, crepe | Fennekin (653) | Klefki (707, carries keys: ties to the 18 keys), Fletchling (661) | Tower lab: stack triangles to make a tower that stands in wind | Bicycle bell, cafe chatter |
| London and Edinburgh, UK | Galar (Crown Tundra is Scotland) | Theo, clock keeper | Fish and chips, shortbread | Sobble (816) | Wooloo (831), Yamper (835) | Gear lab: turn one gear to move the clock hands the right way | Clock chime, rain |
| Barcelona, Spain | Paldea (Iberian Peninsula) | Marta, mosaic artist | Pan con tomate, churros | Fuecoco (909) | Lechonk (915), Pawmi (921) | Mosaic lab: finish a repeating tile pattern | Guitar strum, fountain |
| New York City, USA | Unova (Manhattan) | Darius, ferry captain | Bagel, soft pretzel | Oshawott (501) | Pidove (519), Snivy (495), Tepig (498) | Elevator lab: counterweights lift a car up a skyscraper | Ferry horn, subway rumble |
| Sapporo, Hokkaido, Japan | Sinnoh (snow and salmon rivers like home) | Yuki, snow sculptor | Miso ramen, butter corn | Turtwig (387) | Snover (459), Buneary (427), Chimchar (390) | Snowflake lab: grow a six-sided crystal by matching arms | Crunching snow, wind |

Home stop expansion (optional, with community guidance): a second Vancouver Island page at Barkley Sound or the Alberni Inlet, built around the salmon run and herring spawn. Partner Magikarp (129); spotters Lapras (131), Wailmer (320). Any Nuu-chah-nulth language or place names go in only with the permission and review of the community, credited the way they ask.

Map and travel upgrade: replace the flat six-pin map with a spinning globe or scrolling world strip. Travel plays a 3 second plane, boat or train hop with the partner Pokemon in the window. New stops unlock behind a badge from a previous stop.

Check new Pokemon IDs against the existing 24-Pokemon squad and 6 Mystery Eggs (Totodile, Chikorita, Cyndaquil, Mudkip, Pichu, Piplup) to avoid duplicates.

## 3. Badge system: Pokemon types as the hidden phonics map

Each stop has a Gym Leader (the NPC) who gives a type badge after a boss round. To Aiden it is a badge case. Underneath, each badge is one phonics or handwriting skill. The hidden tracker records attempts, first-try hits and retries per skill.

| Badge (type) | Stop | Hidden skill | Example words | Boss round |
|---|---|---|---|---|
| Grass | Vancouver Island | Short vowels in CVC words | dock, net, fin, log, mud | Bulbasaur's Vine Climb |
| Water | Honolulu | Long vowels and magic e | wave, ride, cove, tide, kite | Popplio's Bubble Ride |
| Fire | Rome | Digraphs sh, ch, th, wh | ship, chip, bath, when | Vulpix's Oven Rush |
| Electric | Kyoto | Consonant blends bl, st, tr, nd | bridge, stream, pond, blossom | Pikachu's Spark Chain |
| Steel | Paris | Vowel teams ai, ee, oa, ea | rain, tree, boat, bread | Klefki's Key Forge |
| Rock | Cairo | Silent letters and tricky words | knight, lamb, write, two | Sandshrew's Sand Dig |
| Ice | Sapporo | Syllable splitting and prefixes | snow-flake, un-pack, re-play | Snover's Snow Stack |
| Ground | Cusco | r-controlled vowels ar, or, er | market, corn, river, yarn | Tauros Trail |
| Fairy | Barcelona | Rhyme families and endings -ing, -ed | tile, pile, smile; jumping | Pawmi's Pattern Dance |
| Flying | New York | Multisyllable and compound words | sky-scraper, sub-way, ferry-boat | Pidove's Rooftop Run |
| Normal | London | Letter formation: tall, small, tail letters | b d p q, h t l, g j y | Yamper's Fetch Trace |
| Dragon | Sydney (finale) | Mixed review and fluency | any mastered words | Dragon Sparring Ring, long form |

Badges drive evolution. Each partner evolves once when its stop's skill reaches a hidden mastery mark (about 80 percent first-try over the last 20 tries, spread across at least three days). Eevee's evolution is Aiden's choice (Vaporeon, Jolteon or Flareon).

## 4. Eight new mini-games (Play Zone 2.0)

Short action rounds. Learning targets are for the build session only; none of this wording appears in the game.

| Game | Stop | How it plays | Hidden target | Supports |
|---|---|---|---|---|
| Sound Surf | Honolulu | Grandma says a sound such as /sh/. Waves carry pictures and words; steer Popplio onto the wave with that sound. Combo meter, spray particles. | Phoneme isolation, first and last sounds | Sound replay, picture plus word, slow-motion wave after two misses |
| Blend Bridge | Kyoto | Letter planks float downstream. Tap in order to build the bridge; Pikachu dashes across and the word is spoken whole. | Blending CVC to CCVC | Each plank speaks its sound; syllable colours |
| Echo Drums | Cusco | Lucia taps a word; drum one beat per sound (hidden Elkonin boxes). Correct count makes the mountain echo. | Phoneme segmenting and counting | Three tries, then drums light up to show the count |
| Klefki's Key Forge | Paris | Drag letter keys into a lock to spell the croissant order. Lock turns, sparks fly, bonus room opens. | Spelling with vowel teams | Missing-letter mode first (c_ke), full spelling later; wrong key wiggles and plays its sound |
| Lava Letters | Honolulu | Trace a big glowing letter before the lava cools. Start dot, numbered arrows, wide path. Clean trace launches Popplio through a ring of fire. | Letter formation, stroke order, direction | Three sizes, generous tolerance, left-hand mode, slower lava in Focus mode |
| Sand Scribe | Cairo | Write letters and short words in sand; Sandshrew smooths the sand for the next try. Hidden hieroglyph appears under the sand. | Letter formation, muscle memory (sand tray) | Light vibration on touch devices, ghost letter fades over sessions |
| Silent Letter Spies | London | Yamper sniffs along a word; tap the letter that stays silent. Correct taps make it bark and chase Wooloo. | Silent letters, tricky words | Word read aloud twice, letter sounds on tap |
| Bagel Stack | New York | Syllable bagels drop; stack them in order to build long words. Wrong order topples with cartoon wobble, no points lost. | Syllable order, compound words | Syllable colours, say-each-bagel button, two-syllable words first |

Upgrades to existing Play Zone games: Syllable Smash gets combo chains and boss words; Mirror Monsters becomes Flip Fortress with b/d/p/q castles that flip on a timer; Rune Trace gets the Lava Letters stroke engine; Trail Dash adds Letter Gates (trace a letter in the air to open a gate, big arm motion on tablets).

## 5. Resilience, adaptability and openness mechanics

- Magikarp's Climb. Standing mini-game based on the old story of the carp that climbs a waterfall and becomes a dragon. Every jump, including every failed one, raises the river a little. After 100 cumulative jumps across any number of days, Magikarp evolves into Gyarados in a full-screen animation. Grandma: "Every splash counts."
- Grit meter. Every retry after a miss adds Grit. Grit unlocks things first-try wins cannot: shiny colour variants, rare Mystery Eggs, a Gyarados sticker.
- Change-Up cards. Once per session a Pokemon flips one rule mid-round (waves reverse, letters go upside down for five seconds, keys change colour). Finishing the round earns a Flexibility star.
- Try-It tokens. Each first food, Pokemon, place or game tried drops a token. Ten tokens open the Explorer's Lounge, a room Aiden decorates with his finds.
- Brave Button. On any new or hard screen a small Brave Button appears. Tapping it gives Grandma's 30 second pep talk and halves the round length once. Using it is rewarded, not penalised.
- Not-yet scenes. Quitting a round early keeps the progress bar where it was; the Pokemon says it will wait. Coming back the next day grants a Comeback star.
- Real-world field missions in the Adventure Pass: try one new food at home, teach a grown-up one word spark, say hello to someone new, photograph something that looks like a letter. A grown-up taps to confirm.
- Grandma's growth-mindset lines reworded as trainer talk: "Trainers level up by losing a few battles first." About 40 new clips, normalised to -16 LUFS.

## 6. Graphics and excitement upgrades

- Parallax scene layers (sky, far, mid, near) with time of day and light weather per stop. Pure CSS and canvas, no new libraries.
- Juice: 60 ms hit-stop on correct answers, small screen shake on boss hits, particle bursts in the stop colour, canvas-confetti already in vendor.
- Evolution cinematic: white-out, silhouette morph, name reveal with Grandma's voice. Reused for Eevee's choice screen.
- Badge case screen with click sound and shine as each badge drops in.
- Shiny variants: 1 in 20 on any discovery, 1 in 8 when Grit is high. PokeAPI sprites include shiny sprites.
- Globe travel animation and stamped passport pages for the new stops (original six atlas pages stay).
- Seasonal events: Salmon Run (October), Herring Spawn (March), Snow Festival (February). Each adds a week-long mission chain and a cosmetic reward.
- Explorer TV: one science-only prize clip per new stop (volcanoes, snowflakes, gears, tides, how croissants puff), oEmbed-verified like the current 40.

## 7. Adaptive engine (hidden)

- Track per skill: attempts, first-try hits, retries, average response time, last seen date. Store under a new skills key in the save; include in AWQ3 backups.
- Level up a skill after 80 percent first-try over the last 10 rounds; level down with added support below 50 percent. Never show levels; show Pokemon getting stronger.
- Spaced review disguised as play: a Pokemon asks to play that word again at 1, 3 and 7 days. Review rounds are the shortest rounds in the game.
- Grown-ups view: one extra page with badges, skills in plain language and words that need more play. No grades.

## 8. Build plan and file touchpoints

| Sub-phase | Scope | Files |
|---|---|---|
| 10a Core | Badge system, skills tracker, Grit meter, globe map, Honolulu and Paris, Sound Surf, Klefki's Key Forge, Lava Letters, Magikarp's Climb | data.js, content.js, game.js, play.js, play.css, progress.js, adventure-data.js, sw.js (v14) |
| 10b World | London, Barcelona, New York, Sapporo; Blend Bridge, Echo Drums, Silent Letter Spies, Bagel Stack, Sand Scribe, Flip Fortress, Letter Gates in Trail Dash | data.js, expedition-data.js, expedition-videos.js, runner-growth.js, play.js, assets |
| 10c Heart | Change-Up cards, Try-It tokens, Brave Button, Comeback stars, Explorer's Lounge, seasonal events, evolution cinematic, shiny variants, new Grandma clips, grown-ups skills page | adventure.js, growth.js, grandma.js, tips.js, challenges.js, sound.js |

Asset needs: 6 scene backgrounds, 6 NPC portraits, 6 food images, about 30 Pokemon sprites from PokeAPI (normal and shiny), 6 very quiet place-sound loops, roughly 220 narration clips. Target size increase under 15 MB.

QA checklist per sub-phase: start screen; one full new stop (Explore, Experiment, Decode, Discover); each new mini-game to completion with wrong inputs; badge award and evolution; Grit and Try-It counters surviving save, reload and AWQ3 restore; offline reload after cache bump; layouts at 375, 800 and 1024 px; audio ducking under narration. State plainly what was not tested on a real tablet.

## 9. Prompt for the next Computer session

Continue Aiden's World Quest with Phase 10 (Badge Quest). Source: GitHub repo indigenousfishersfirst-commits/aidens-world-quest (main, GitHub Pages). Perplexity app asset 5ec62beb-56fc-4993-805e-31e9a1992e5c, published site a38cf76e-04ef-467b-b787-dbc3a36f13c2. Read progress.md, the Phase 9 handoff and PHASE10-PLAN.md first. Build sub-phase 10a: the badge system with a hidden per-skill tracker, Grit meter, globe travel map, two new stops (Honolulu with Popplio and Paris with Fennekin and Klefki), and the mini-games Sound Surf, Klefki's Key Forge, Lava Letters and Magikarp's Climb. Keep it fun-first with hidden learning, dyslexia, dysgraphia and ADHD supports, quiet place sounds, music only in active play, and saved progress with AWQ3 backups. Generate and normalise new Grandma narration to -16 LUFS. Bump sw.js to v14, run the QA checklist in headless Chromium, commit and push to main, and ask me before republishing the Perplexity site. Never include NIFI, NIFI-Tech or Cantek. Tell me plainly what was and was not tested.

## 10. Open questions for Andy

- Order of new stops: Honolulu and Paris first (strongest Pokemon links), or Sapporo because snow and salmon connect back to home?
- Eevee's evolution choice: allow it early as a motivator, or hold it for the Grass Badge?
- Home stop expansion: who in the community should be asked before any Nuu-chah-nulth language or place names are added?
- Harvest Heroes: fold Lily in as a recurring co-op friend in the new stops (two-player Sound Surf and Bagel Stack are easy fits)?
