# Aiden's World Quest: Phase 10 Design Brief (Badge Quest)

Prepared November 2, 2026 for the next Computer build session. Builds on the Phase 9 handoff (Play Zone, Adventure Pass, Focus mode) and the current repository (main, sw.js cache v13; next bump is v14).

Goal: a bigger, more exciting world (12 stops instead of 6), a Pokemon badge system that secretly maps onto phonics and handwriting skills, eight new action mini-games for spelling, word sounds and letter formation, and mechanics that reward trying, adapting and bouncing back. Learning stays hidden inside play. No lessons, no quizzes.

## Status map (updated November 2, 2026)

Work happens on branch `phase10a`. main and the live GitHub Pages game are untouched until a pull request passes the QA checklist.

| Piece | Where | State |
|---|---|---|
| This master plan | PHASE10-PLAN.md (main and phase10a) | Done |
| Supercharge brief: story, narration cast, typography, dysgraphia, juice for 10b to 10d | PHASE10-SUPERCHARGE.md (phase10a) | Done |
| Hidden skills tracker, Grit, Try-It, review schedule | phase10/skills.js (+ phase10/test.js) | Coded and Node-tested, not wired into index.html |
| Honolulu and Paris draft content, 10a mini-game word banks | phase10/stops-10a.js | Drafted, not merged into WORLDS |
| Save validator that scales to 12 stops / 120 Pokemon (schema v4, AWQ4 codes, AWQ3 and legacy still import) | progress.js (+ phase10/test-progress.js) | Coded and Node-tested, not browser-tested |
| Wiring notes and remaining blockers | phase10/README.md | Done |
| Four 10a mini-games, badge case, globe map, art, narration, sw.js v14 | play.js, game.js, assets, sw.js | Not started (needs a Computer session) |
| Build log | progress.md, Phase 10 section | Done |
| Four 10a decisions (stop order, Eevee, home stop, Lily) | PHASE10-PLAN.md section 10 | Decided November 2, 2026 |

Read in this order: PHASE10-PLAN.md, PHASE10-SUPERCHARGE.md, phase10/README.md, then progress.md.

## 1. Design pillars

- Fun first, always. Every new mechanic must be something Aiden would choose to do if there were no learning in it.
- Action over reading load. New games are 60 to 90 second rounds with big targets, motion, particles and sound. Reading is short and read aloud.
- One secret curriculum. Every badge, Pokemon type and mini-game is tied to one phonics or handwriting skill. Aiden sees Pokemon types; the hidden tracker sees skills.
- Mistakes are fuel. Wrong tries never cost points. Retrying grows a visible Grit meter and unlocks things first-try perfection cannot.
- Adaptable by design. Hidden tracker steps difficulty up at 80 percent first-try success and down (with more support) below 50 percent.
- Dyslexia, dysgraphia and ADHD supports stay on: read-aloud, syllable colours, roomy text, short rounds, Focus mode, large stroke targets, no punishing timers. Typography and writing specifics live in PHASE10-SUPERCHARGE.md sections 3 and 4.
- Keep the quiet audio rules, local-first saves and the AWQ3/AWQ4 backup formats. Bump sw.js to v14.
- Never include NIFI, NIFI-Tech or Cantek.

## 2. Six new world stops with Pokemon-region connections

The Pokemon games base their regions on real places: Unova on New York City, Kalos on northern France and Paris, Alola on Hawaii, Galar on Great Britain, Paldea on Spain and Portugal, Sinnoh on Hokkaido. Each new stop pairs a real city with the region it inspired so Aiden can spot the connection himself.

| Stop | Pokemon region link | NPC and role | Food to try | Partner Pokemon (Dex ID) | Spotter Pokemon | Field Lab | Place sound (very quiet) | Draft status |
|---|---|---|---|---|---|---|---|---|
| Honolulu, Hawaii | Alola (name plays on aloha) | Kai, surf lifeguard | Poke bowl, shave ice | Popplio (728) | Wingull (278), Pyukumuku (771), Rowlet (722) | Volcano lab: build a lava flow and watch it cool into new land | Soft surf, ukulele note | Drafted in phase10/stops-10a.js |
| Paris, France | Kalos (Prism Tower mirrors the Eiffel Tower) | Amelie, baker | Croissant, crepe | Fennekin (653) | Klefki (707, carries keys), Fletchling (661) | Tower lab: stack triangles to make a tower that stands in wind | Bicycle bell, cafe chatter | Drafted in phase10/stops-10a.js |
| London and Edinburgh, UK | Galar (Crown Tundra is Scotland) | Theo, clock keeper | Fish and chips, shortbread | Sobble (816) | Wooloo (831), Yamper (835) | Gear lab: turn one gear to move the clock hands the right way | Clock chime, rain | 10c |
| Barcelona, Spain | Paldea (Iberian Peninsula) | Marta, mosaic artist | Pan con tomate, churros | Fuecoco (909) | Lechonk (915), Pawmi (921) | Mosaic lab: finish a repeating tile pattern | Guitar strum, fountain | 10c |
| New York City, USA | Unova (Manhattan) | Darius, ferry captain | Bagel, soft pretzel | Oshawott (501) | Pidove (519), Snivy (495), Tepig (498) | Elevator lab: counterweights lift a car up a skyscraper | Ferry horn, subway rumble | 10c |
| Sapporo, Hokkaido, Japan | Sinnoh (snow and salmon rivers like home) | Yuki, snow sculptor | Miso ramen, butter corn | Turtwig (387) | Snover (459), Buneary (427), Chimchar (390) | Snowflake lab: grow a six-sided crystal by matching arms | Crunching snow, wind | 10c |

Home stop expansion (optional, with community guidance): a second Vancouver Island page at Barkley Sound or the Alberni Inlet, built around the salmon run and herring spawn. Partner Magikarp (129); spotters Lapras (131), Wailmer (320). Any Nuu-chah-nulth language or place names go in only with the permission and review of the community, credited the way they ask.

Map and travel upgrade: replace the flat six-pin map with a spinning globe or scrolling world strip. Travel plays a 3 second plane, boat or train hop with the partner Pokemon in the window. New stops unlock behind a badge from a previous stop.

Check new Pokemon IDs against the existing 24-Pokemon squad and 6 Mystery Eggs (Totodile, Chikorita, Cyndaquil, Mudkip, Pichu, Piplup) to avoid duplicates. Set `window.POKE_TOTAL` in data.js when the roster grows so progress.js sizes `hearts` correctly, and call `QuestProgress.unlockPoke(i)` when a Pokemon with index 30 or higher is discovered.

## 3. Badge system: Pokemon types as the hidden phonics map

Each stop has a Gym Leader (the NPC) who gives a type badge after a boss round. To Aiden it is a badge case. Underneath, each badge is one phonics or handwriting skill tracked by `phase10/skills.js` (skill ids in brackets).

| Badge (type) | Stop | Hidden skill (QuestSkills id) | Example words | Boss round |
|---|---|---|---|---|
| Grass | Vancouver Island | Short vowels in CVC words (cvc) | dock, net, fin, log, mud | Bulbasaur's Vine Climb |
| Water | Honolulu | Long vowels and magic e (magicE) | wave, ride, cove, tide, kite | Popplio's Bubble Ride |
| Fire | Rome | Digraphs sh, ch, th, wh (digraph) | ship, chip, bath, when | Vulpix's Oven Rush |
| Electric | Kyoto | Consonant blends (blend) | bridge, stream, pond, blossom | Pikachu's Spark Chain |
| Steel | Paris | Vowel teams ai, ee, oa, ea (vowelTeam) | rain, tree, boat, bread | Klefki's Key Forge |
| Rock | Cairo | Silent letters and tricky words (silent) | knight, lamb, write, two | Sandshrew's Sand Dig |
| Ice | Sapporo | Syllable splitting and prefixes (syllable) | snow-flake, un-pack, re-play | Snover's Snow Stack |
| Ground | Cusco | r-controlled vowels (rControl) | market, corn, river, yarn | Tauros Trail |
| Fairy | Barcelona | Rhyme families and endings (rhyme) | tile, pile, smile; jumping | Pawmi's Pattern Dance |
| Flying | New York | Multisyllable and compound words (multi) | sky-scraper, sub-way, ferry-boat | Pidove's Rooftop Run |
| Normal | London | Letter formation (letterForm) | b d p q, h t l, g j y | Yamper's Fetch Trace |
| Dragon | Sydney (finale) | Mixed review and fluency (review) | any mastered words | Dragon Sparring Ring, long form |

Badges drive evolution. Each partner evolves once when its skill reports `mastered` (about 80 percent first-try over 20+ tries across 3+ days). Eevee's evolution is Aiden's choice (Vaporeon, Jolteon or Flareon).

## 4. Eight new mini-games (Play Zone 2.0)

Short action rounds. Learning targets are for the build session only; none of this wording appears in the game. Word banks for the 10a games are in `window.PLAY10A` (phase10/stops-10a.js). Each game reads `QuestSkills.support(skill)` for scaffolds and calls `QuestSkills.record` once per item.

| Game | Stop | How it plays | Hidden target | Supports | Phase |
|---|---|---|---|---|---|
| Sound Surf | Honolulu | Grandma says a sound such as /sh/. Waves carry pictures and words; steer Popplio onto the wave with that sound. Combo meter, spray particles. | Phoneme isolation | Sound replay, picture plus word, slow-motion wave after two misses | 10a |
| Klefki's Key Forge | Paris | Drag letter keys into a lock to spell the croissant order. Lock turns, sparks fly, bonus room opens. | Spelling with vowel teams | Missing-letter mode first, full spelling later; wrong key wiggles and plays its sound | 10a |
| Lava Letters | Honolulu | Trace a big glowing letter before the lava cools. Start dot, numbered arrows, wide path. | Letter formation | Three sizes, generous tolerance, left-hand mode, slower lava in Focus mode | 10a |
| Magikarp's Climb | Home | Every jump, including failed ones, raises the river. 100 cumulative jumps evolve Magikarp into Gyarados. | Persistence, mixed review | No fail state | 10a |
| Blend Bridge | Kyoto | Letter planks float downstream. Tap in order to build the bridge; Pikachu dashes across and the word is spoken whole. | Blending | Each plank speaks its sound; syllable colours | 10c |
| Echo Drums | Cusco | One drum beat per sound in a word (hidden Elkonin boxes). Correct count makes the mountain echo. | Segmenting | Three tries, then drums light up to show the count | 10c |
| Sand Scribe | Cairo | Write letters and short words in sand; Sandshrew smooths it for the next try. Hidden hieroglyph appears. | Letter formation | Haptics, ghost letter fades over sessions | 10c |
| Silent Letter Spies | London | Yamper sniffs along a word; tap the letter that stays silent. | Silent letters | Word read aloud twice, letter sounds on tap | 10c |
| Bagel Stack | New York | Syllable bagels drop; stack them in order to build long words. Wrong order topples with cartoon wobble. | Syllable order | Syllable colours, say-each-bagel button | 10c |

Upgrades to existing Play Zone games: Syllable Smash gets combo chains and boss words; Mirror Monsters becomes Flip Fortress with b/d/p/q castles; Rune Trace gets the shared trace engine; Trail Dash adds Letter Gates. The trace engine spec is in PHASE10-SUPERCHARGE.md section 4.

## 5. Resilience, adaptability and openness mechanics

- Magikarp's Climb (above). Grandma: "Every splash counts."
- Grit meter (QuestSkills.record adds Grit on retries; spendGrit, gritAvailable). Grit unlocks shiny variants, rare Mystery Eggs, a Gyarados sticker.
- Change-Up cards: once per session a Pokemon flips one rule mid-round. Finishing earns a Flexibility star (QuestSkills.flexStar).
- Try-It tokens (QuestSkills.tryIt): each first food, Pokemon, place or game. Ten tokens open the Explorer's Lounge.
- Brave Button: Grandma's 30 second pep talk and a half-length round, once. Rewarded, not penalised.
- Not-yet scenes and Comeback stars (QuestSkills.comeback).
- Real-world field missions in the Adventure Pass, confirmed by a grown-up tap.
- Grandma's growth-mindset lines as trainer talk, about 40 new clips at -16 LUFS.

## 6. Graphics and excitement upgrades

Parallax layers with weather and time of day; hit-stop, screen shake, particle bursts; evolution cinematic; badge case; shiny variants (QuestSkills.shinyChance); globe travel and passport stamps; seasonal events (Salmon Run, Herring Spawn, Snow Festival); one science-only Explorer TV clip per new stop. Photo mode and more detail in PHASE10-SUPERCHARGE.md section 6.

## 7. Adaptive engine (hidden)

Implemented in phase10/skills.js: per-skill attempts, first-try hits, retries, response times, days seen; levels 1 to 5 (up at 80 percent over the last 10, down below 50 percent); mastery flag; `support()` hints; `dueForReview()` at 1, 3 and 7 days; `summary()` for the grown-ups view. Stored at `g.skills10`, sanitised on import by progress.js.

## 8. Build plan, file touchpoints and what is done

| Sub-phase | Scope | Files | Status |
|---|---|---|---|
| 10a Core | Badge system, skills tracker, Grit meter, globe map, Honolulu and Paris, Sound Surf, Key Forge, Lava Letters, Magikarp's Climb | phase10/skills.js, phase10/stops-10a.js, progress.js (v4), then data.js, content.js, game.js, play.js, play.css, adventure-data.js, expedition-data.js, index.html, sw.js (v14) | Tracker, content drafts and save schema done on phase10a; games, wiring, art, audio pending |
| 10b Narration and typography | Voice cast, per-word timing, listening modes, Echo Reading, typography panel, decodable tiers | content.js, growth.js, growth.css, style.css, sound.js, grandma.js, assets/audio, vendor fonts | Spec in PHASE10-SUPERCHARGE.md sections 2 and 3 |
| 10c Story and world | Season arc, postcards, choice points, London, Barcelona, New York, Sapporo, remaining mini-games, trace engine, motor warm-ups | data.js, content.js, adventure.js, adventure-data.js, expedition-data.js, expedition-videos.js, play.js, runner-growth.js | Spec in PHASE10-SUPERCHARGE.md sections 1 and 4 |
| 10d Heart and juice | Change-Up cards, Try-It tokens, Brave Button, Captain's Log, photo mode, weather, seasonal events, handwriting page | adventure.js, growth.js, tips.js, challenges.js, sound.js, game.js | Spec in PHASE10-SUPERCHARGE.md sections 5 and 6 |

Known follow-ups from the progress.js v4 change: index.html shows "/ 18" and "/ 30" as fixed labels and game.js may hold 18 or 30 constants; switch them to `QuestProgress.limits()`. Bump sw.js to v14 when phase10a merges.

Asset needs for 10a: 2 scene backgrounds, 2 NPC portraits, 2 foods, sprites 728, 653, 707, 661, 278, 771, 722, 129, 130 (normal and shiny) from PokeAPI sprites, 2 quiet place-sound loops, about 60 narration clips.

QA checklist per sub-phase: start screen; one full new stop (Explore, Experiment, Decode, Discover); each new mini-game to completion with wrong inputs; badge award and evolution; Grit and Try-It counters surviving save, reload and AWQ4 restore (and AWQ3 import); offline reload after cache bump; layouts at 375, 800 and 1024 px; audio ducking under narration. State plainly what was not tested on a real tablet.

## 9. Prompt for the next Computer session

Continue Aiden's World Quest with Phase 10 (Badge Quest). Source: GitHub repo indigenousfishersfirst-commits/aidens-world-quest. Work on branch phase10a (do not touch main until the QA checklist passes, then open a pull request). Perplexity app asset 5ec62beb-56fc-4993-805e-31e9a1992e5c, published site a38cf76e-04ef-467b-b787-dbc3a36f13c2. Read PHASE10-PLAN.md, PHASE10-SUPERCHARGE.md, phase10/README.md and progress.md first. Already on the branch: phase10/skills.js (hidden skills tracker), phase10/stops-10a.js (Honolulu and Paris drafts and 10a word banks), progress.js schema v4 (run node phase10/test-progress.js and node phase10/test.js). Finish sub-phase 10a: wire skills.js, merge WORLDS_10A behind a flag, set window.POKE_TOTAL, replace the hard-coded 18 and 30 with QuestProgress.limits(), build Sound Surf, Klefki's Key Forge, Lava Letters and Magikarp's Climb, the badge case and globe map, add art and sprites, generate and normalise Grandma narration to -16 LUFS, bump sw.js to v14, run the QA checklist in headless Chromium, commit to phase10a, and ask me before merging to main or republishing the Perplexity site. Keep it fun-first with hidden learning, dyslexia, dysgraphia and ADHD supports, quiet place sounds, music only in active play, and saved progress. Section 10 of PHASE10-PLAN.md holds four decisions already made (Honolulu and Paris first with a Sapporo teaser postcard; Eevee choice visible early and evolution at the Grass Badge; home stop in English only with no Nuu-chah-nulth content until approved; Lily co-op deferred to 10c): build to them and do not re-ask. Never include NIFI, NIFI-Tech or Cantek. Tell me plainly what was and was not tested.

## 10. Decisions for 10a (made by Andy, November 2, 2026)

These four questions are settled. The Computer session should build to them and not re-ask.

| Decision | Call | Phase |
|---|---|---|
| Stop order | Honolulu and Paris first; Sapporo opens the 10c batch | 10a / 10c |
| Eevee's evolution | Choice visible from day one; evolution happens at the Grass Badge | 10a |
| Home stop (Barkley Sound) | Build now in English only; Nuu-chah-nulth language layer only after community approval | 10a core, language later |
| Lily co-op | Yes, inside World Quest, in Sound Surf and Bagel Stack | 10c |

### 10.1 Stop order: Honolulu and Paris, then Sapporo

- Build Honolulu and Paris in 10a as drafted in phase10/stops-10a.js. They carry the next two phonics rungs after the home stop (magic e, vowel teams), and their Pokemon links (Alola and aloha, Prism Tower and the Eiffel Tower) are ones Aiden can spot himself.
- Sapporo is the first stop of 10c and anchors the February Snow Festival event.
- Plant it early: the Paris episode ends with a short teaser postcard from Yuki in Sapporo (snow, a salmon river like home). One narration clip, one picture.

### 10.2 Eevee: choose early, evolve at the Grass Badge

- From the first session, the badge case shows three silhouettes (Vaporeon, Jolteon, Flareon). Tapping one plays a short Grandma line about that friend. Aiden can mark a favourite at any time; the pick is stored (`g.eeveeChoice`, 0 to 2, or -1) but not applied.
- Earning the Grass Badge (skill `cvc` reports `mastered`) triggers the evolution cinematic using the stored choice. If no choice is stored, the cinematic pauses on the three silhouettes and asks.
- The choice can be changed until the badge is earned; after that it is final, like the real games.
- Guardrail: if the hidden tracker shows the Grass Badge taking more than about two weeks of normal play, lower the mastery threshold for `cvc` (for example 15 tries over 3 days at 75 percent) rather than moving the evolution earlier.

### 10.3 Home stop: English now, language layer only with permission

- Build the Barkley Sound / Alberni Inlet page in 10a with English text only: salmon run and herring spawn science, local scenery, Magikarp's Climb, spotters Lapras and Wailmer.
- No Nuu-chah-nulth words, place names, greetings or audio go into any build until Andy has spoken directly with the community and has a clear yes. Barkley Sound and the Alberni Inlet are Tseshaht (c̓išaaʔatḥ) territory; the Tseshaht language program is the first point of contact, with the Nuu-chah-nulth Tribal Council for anything spanning more than one nation. Andy makes that contact himself, not through a document.
- Questions to settle in that conversation: which words or names (if any) may be used; who reviews spelling and pronunciation; whether audio should be recorded by a community speaker rather than synthesised; how credit should appear in the game and in the grown-ups page.
- When approved, the language layer lands as its own commit behind a flag so it can be reviewed and, if asked, removed cleanly.

### 10.4 Lily: co-op inside World Quest in 10c

- Harvest Heroes stays as is. Two-player mode comes into World Quest in 10c through Sound Surf (two surfers, two lanes) and Bagel Stack (alternating bagels), reusing the Harvest Heroes control scheme (Aiden W A S D on the left, Lily arrows on the right; split touch zones on tablets).
- Lily keeps her own camp profile on the device (the six-profile limit already allows this). The skills tracker records only the active profile's taps, so co-op rounds do not change Aiden's mastery or badges.
- Lily's look carries over from Harvest Heroes unless her family asks for a change.
- Not in 10a: adding co-op before the badge system and schema v4 are browser-tested would double the testing surface of the first four games.

### 10.5 Still open (for 10b and later)

The four narration, font, voice-feature and villain-trio decisions in PHASE10-SUPERCHARGE.md section 8 remain open and are not needed to finish 10a.
