# Aiden's World Quest: Session Handoff Wiki (November 2, 2026)

This is the single page to read first. It covers everything done today across Perplexity Search sessions, where it lives, what is tested, what is not, and exactly what to do next in a Computer session. It supersedes nothing: the Phase 9 handoff (aidens-world-quest-handoff.docx) still describes the live game.

## 1. Where everything lives

| What | Location | Who can use it |
|---|---|---|
| Live game (unchanged today) | https://indigenousfishersfirst-commits.github.io/aidens-world-quest/ (branch main, sw.js cache v13) | Anyone with the link |
| Perplexity site | https://aidens-world-quest.pplx.app (asset 5ec62beb-56fc-4993-805e-31e9a1992e5c, site a38cf76e-04ef-467b-b787-dbc3a36f13c2) | Organisation sign-in |
| Harvest Heroes (unchanged) | https://harvest-heroes.pplx.app (asset 902b1c34-8b83-40f8-8975-80e19553a0c1) | Organisation sign-in |
| Phase 10 work branch | https://github.com/indigenousfishersfirst-commits/aidens-world-quest/tree/phase10a | Repo collaborators |
| Master plan | PHASE10-PLAN.md (main has the first version; phase10a has the current one with the status map and decisions) | |
| Supercharge brief | PHASE10-SUPERCHARGE.md (phase10a only) | |
| Scaffold code and tests | phase10/ folder (phase10a only) | |
| Save validator v4 | progress.js (phase10a only; main still has v3) | |
| Build log | progress.md (phase10a has the Phase 10 section) | |
| Word versions of the briefs | Delivered in the Perplexity thread: Phase 10 design brief, Supercharge brief, this handoff | |

## 2. Today's commits (branch phase10a, newest first)

| Commit | What |
|---|---|
| 0adaf44 | PHASE10-PLAN section 10: four 10a decisions recorded; prompt told not to re-ask |
| 64c7990 | PHASE10-SUPERCHARGE.md added; plan, phase10/README and progress.md cross-linked to the branch and the 10a to 10d order |
| 0391c57 | progress.js schema v4 and phase10/test-progress.js |
| 8f43bfc | phase10/README.md, skills.js, stops-10a.js, test.js scaffold |
| 25e6994 (also on main) | PHASE10-PLAN.md first version |

main received only 25e6994 (a Markdown file). No game file on main changed, so installed copies and the public link behave exactly as before.

## 3. What was built and how far it is tested

| Piece | File | Tested how | Not tested |
|---|---|---|---|
| Hidden skills tracker: 12 skills mapped to badges and stops, adaptive level 1 to 5, mastery flag, Grit meter, Try-It tokens, Flexibility and Comeback stars, shiny odds, 1/3/7 day review list, support hints, sanitiser | phase10/skills.js (window.QuestSkills) | Node: levels step up after 10 first-try hits and down after 10 misses; Grit accrues; duplicate Try-It rejected; corrupted data clamped | Browser, integration with play.js |
| Honolulu and Paris content: 3 quests each in the data.js WORLDS shape, labs, spotters, place sounds, word lists; PLAY10A word banks for Sound Surf, Klefki's Key Forge, Lava Letters, Magikarp's Climb | phase10/stops-10a.js | Node: loads, 3 quests per stop, 4 game banks present | Narration, art, Field Lab engines, adventure cards 6-0 to 7-2 |
| Save validator v4: limits derived from WORLDS.length (6 to 12) and window.POKE_TOTAL (30 to 120); two-digit world ids; record cap 600; buddy 30+ gated by g.unlocked10; g.skills10 passthrough; AWQ4 codes; AWQ3, JSON and legacy AWQ1/2 imports kept; QuestProgress.limits() and unlockPoke() | progress.js | Node (phase10/test-progress.js): v3 save loads under 6 and 8 worlds; world-7 ids and done=24 accepted; buddy gating; AWQ3 import; over-cap and bad-id rejection; legacy AWQ2; new profiles sized; skills10 survives | Browser, real save in localStorage, growth.js backup UI wording (still says AWQ3) |
| Documents | PHASE10-PLAN.md, PHASE10-SUPERCHARGE.md, phase10/README.md, progress.md | Read-through | n/a |

Run the tests from the repo root: `node phase10/test.js` and `cd phase10 && node test-progress.js`.

## 4. Decisions already made (do not re-ask)

| Decision | Call |
|---|---|
| Stop order | Honolulu and Paris in 10a; Sapporo opens 10c; Paris ends with a Sapporo teaser postcard from Yuki |
| Eevee | Three silhouettes visible from day one, favourite stored in g.eeveeChoice; evolution at the Grass Badge when skill cvc is mastered; guardrail lowers the cvc threshold rather than moving the evolution |
| Home stop (Barkley Sound) | Build in English only now; no Nuu-chah-nulth words, names or audio until Andy has a clear yes from the community (Tseshaht language program first, NTC for multi-nation); language layer lands later as its own flagged commit |
| Lily co-op | Inside World Quest in 10c via Sound Surf and Bagel Stack; own profile; tracker records only the active profile |

Still open, needed for 10b not 10a: voice provider for the NPC cast, whether to ship Lexend and Atkinson Hyperlegible, voice features on or off by default, and whether the season villain trio stays Murkrow, Meowth and Ditto.

## 5. Next steps, in order

### 5.1 Finish 10a (Computer session)

Update: 10a was built as the Badge Quest module (see phase10/README.md, section Phase 10a build). Steps 3 and 4 below were replaced by the module approach; the rest are done except real-device testing, the merge and republishing, which wait for Andy.


1. Clone and check out phase10a. Run both Node tests. Open index.html in a browser and confirm the game still plays with progress.js v4 (start screen, one quest, a battle, Play Zone, Save & backup round trip, reload).
2. Wire the tracker: load phase10/skills.js after progress.js in index.html; call QuestSkills.attach(state) right after QuestProgress.attach in game.js.
3. Merge content: in data.js append window.WORLDS_10A to WORLDS behind window.FLAGS.phase10a; set window.POKE_TOTAL to the new roster size; add Field Lab engines (honolulu chain, paris pattern) in expedition-data.js; add adventure cards 6-0 to 7-2 in adventure-data.js.
4. Replace hard-coded limits: index.html top bar "/ 18" and "/ 30"; any 18, 30, 6-length arrays in game.js, growth.js, play.js; use QuestProgress.limits(). Update backup wording in growth.js to say AWQ4 (AWQ3 still imports).
5. Build the four 10a games in play.js using PLAY10A and QuestSkills.support(skill); call QuestSkills.record once per item. Sound Surf, Klefki's Key Forge, Lava Letters (first use of the shared trace engine), Magikarp's Climb.
6. Badge case screen and evolution cinematic (QuestSkills.badgeReady; Eevee choice per decision 10.2). Globe or scrolling world map with the 3 second travel hop.
7. Barkley Sound home page in English only (decision 10.3) with Magikarp's Climb.
8. Assets: 3 backgrounds (Honolulu, Paris, Barkley Sound), 3 NPC portraits (Kai, Amelie, local guide), foods, PokeAPI sprites 728, 653, 707, 661, 278, 771, 722, 129, 130, 131, 320 (normal and shiny), 3 very quiet place-sound loops.
9. Narration: generate and normalise to -16 LUFS; stories short and long, questions, lab missions, game instructions, badge lines, Magikarp lines, Sapporo teaser postcard. Add clips to the tap-to-hear map.
10. Bump sw.js cache to v14 and add every new file to the precache list.
11. QA in headless Chromium: full Honolulu and Paris playthrough; each new game with wrong inputs; badge and evolution; save, reload, AWQ4 export and import, AWQ3 import; offline reload after cache bump; 375, 800 and 1024 px; audio ducking under narration. Record what was and was not tested.
12. Open a pull request phase10a to main. Merge only after QA and Andy's go-ahead. Then redeploy the Perplexity app asset and republish the site when Andy approves, and rebuild the offline zip.
13. Update progress.md and this handoff with the outcome.

### 5.2 Then 10b, 10c, 10d

Follow PHASE10-SUPERCHARGE.md section 7 and PHASE10-PLAN.md section 8. 10b: voice cast, per-word timing, listening modes, Echo Reading, typography panel, decodable tiers. 10c: season arc, postcards, choice points, London, Barcelona, New York, Sapporo, remaining mini-games, trace engine, motor warm-ups, Lily co-op. 10d: Change-Up cards, Try-It tokens, Brave Button, Captain's Log, photo mode, weather, seasonal events, handwriting page.

### 5.3 Things only Andy can do

- Talk with the Tseshaht language program (and the Nuu-chah-nulth Tribal Council if more than one nation is involved) about whether and how Nuu-chah-nulth words, place names or greetings may appear, who reviews them, whether a community speaker records the audio, and how credit should appear.
- Decide the four 10b questions above.
- Test on Aiden's actual tablet after 10a merges: touch, install, sound by ear, video overlays.

## 6. Standing rules for every session

- Fun first; learning hidden inside play; no lessons or quizzes on screen.
- Wrong answers never cost points; retries earn Grit; rapid answer-cycling is not rewarded.
- Dyslexia, dysgraphia and ADHD supports stay on: read-aloud, syllable colours, roomy text, short rounds, Focus mode, large stroke targets.
- Place sounds very quiet and quieter under narration; music only during active play.
- Local-first: no uploads, no accounts, no analytics; voice features (when built) on device and parent-toggled.
- Always keep Aiden's place saved; bump the service worker cache on every shipped change.
- Work on phase10a; touch main only through a reviewed pull request; republish the Perplexity site only when Andy says so.
- Say plainly what was and was not tested.

## 7. Prompt to start the next Computer session

Continue Aiden's World Quest, Phase 10a, on branch phase10a of indigenousfishersfirst-commits/aidens-world-quest. Read HANDOFF-PHASE10.md, PHASE10-PLAN.md, PHASE10-SUPERCHARGE.md, phase10/README.md and progress.md first; the four 10a decisions in PHASE10-PLAN.md section 10 are made. Run node phase10/test.js and node phase10/test-progress.js. Then follow HANDOFF-PHASE10.md section 5.1 steps 1 to 13: wire skills.js, merge WORLDS_10A behind a flag, set window.POKE_TOTAL, replace hard-coded 18 and 30 with QuestProgress.limits(), build Sound Surf, Klefki's Key Forge, Lava Letters and Magikarp's Climb, the badge case, Eevee choice and evolution, globe map, Barkley Sound in English only, assets and narration at -16 LUFS, sw.js v14, QA in headless Chromium, then open a pull request to main and ask me before merging or republishing. Keep every standing rule in section 6. Tell me plainly what was and was not tested.

## 8. Quick reference: new APIs on the branch

| Call | Purpose |
|---|---|
| QuestSkills.attach(state) | Bind the tracker to the live save (call after QuestProgress.attach) |
| QuestSkills.record(skillId, {firstTry, retries, ms}) | Log one item; returns level, levelUp, levelDown, mastered, grit |
| QuestSkills.support(skillId) | Scaffold hints for a game: showFirstLetter, slowAudio, pictureCue, wordCount, roundSeconds |
| QuestSkills.badgeReady(skillId) | True when the skill is mastered |
| QuestSkills.tryIt(kind, key) / flexStar() / comeback() | Try-It token, Flexibility star, Comeback star |
| QuestSkills.gritAvailable() / spendGrit(n) / shinyChance() | Grit economy and shiny odds |
| QuestSkills.dueForReview() / summary() | Spaced review list; grown-ups view data |
| QuestProgress.limits() | {worlds, keys, pokemon, schema} derived from content |
| QuestProgress.unlockPoke(i) | Mark a Pokemon index 30+ as unlocked so saves validate |
| QuestProgress.encode() / decode(text) | AWQ4 out; AWQ3, AWQ4, JSON and legacy in |
| Skill ids | cvc, magicE, digraph, blend, vowelTeam, silent, syllable, rControl, rhyme, multi, letterForm, review |
