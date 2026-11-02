Original prompt: Build a game for Aiden where he explores the world, meets people, foods and Pokemon and reads to earn keys.

2026-10-16 Growth edition goals: richer inference + evidence questions, no reward for cycling answers, chosen routes with different discoveries and runner powers, local autosave + validated backups + legacy migration, cumulative word-building and printing practice, review schedule, parent dashboard, local friend aliases/profiles and family field missions. Maintain original art and audio, no online chat or data upload. Not a treatment or validated educational assessment.
QA inventory: first-pass quiz and evidence; wrong answer review/rapid penalty; resume cannot reset scoring; guided no-XP completion; route outcome/power; runner pickups/collisions/pause/end; word tiles/typing/model/ink; delayed review; parent custom mission and alias/profile; autosave reload/reopen, denied storage fallback; JSON/code import/export/legacy/malformed; controls and break flow; mobile/tablet/desktop layout; music/voice toggles and new narration. No real-device certification.


## Phase 5: Expedition Edition

- Flow: Explore, Experiment, Decode, Discover. Path chooser removed. Reward screen goes straight to the next scene.
- 18 Field Labs (dial, chain, hunt, pattern, sort engines) drawn as procedural SVG scenes with ghost outlines. Labels say they are simplified models.
- Stories and 36 questions rewritten as mysteries. Each question has a kind chip (WHERE, WHO, WHAT, WHICH, HOW) and a hint.
- Nature Dex with ranks and gear (1, 3, 6, 9, 12, 18 discoveries). Trail Dash power now comes from labs.
- Explorer TV: 40 oEmbed-verified YouTube clips via youtube-nocookie, tap to load, parent toggle, watch-together flags on 6 clips, never cached by the service worker.
- 144 new narration clips (stories, questions, lab missions, discoveries, watch clues). Service worker cache v6.
- Verified in headless Chromium: all 18 labs solved through real input with wrong-input messages, core loop, persistence after reload, Nature Dex, TV modal and library, parent toggle, battle with new questions, 375, 800 and 1024 widths. Not verified: playback of videos, listening by ear, an actual Android tablet.

## Audio mix update

- Place sounds default lowered from 0.5 to 0.18; existing saves are capped to 0.18 once (audio version 5). Sliders in Settings still let a grown-up raise it.
- While narration plays: place sound bed drops to 10 percent, one-off place sounds to 12 percent of their level, music to 18 percent.
- One-off place sounds are about 20 percent quieter overall and start slightly later on each story card.

## Audio mix update 2

- Place sounds default 0.08 (was 0.18); music default 0.2 (was 0.3). Existing saves are capped once (audio version 6). Sliders still raise them.
- During narration: place sound bed 5 percent, one-off place sounds 6 percent, music 12 percent.

## Audio mix update 3

- Place sounds default 0.04 (half of before). While narration plays the bed is 1.5 percent and one-off place sounds 2 percent of their level; music 10 percent.
- Volume changes now fade smoothly instead of jumping. Sliders use 0.01 steps for fine control. Existing saves are capped once (audio version 7).


## Phase 10 (branch phase10a, November 2, 2026): Badge Quest groundwork

- Plans: PHASE10-PLAN.md (master plan, status map, Computer-session prompt) and PHASE10-SUPERCHARGE.md (season story arc, narration cast with per-word timing, BDA-based typography defaults, dysgraphia trace engine and voice alternatives, stealth-learning and juice upgrades, 10a to 10d build order).
- Code: phase10/skills.js (hidden per-skill tracker, Grit, Try-It, review schedule; Node-tested), phase10/stops-10a.js (Honolulu and Paris drafts, 10a mini-game word banks), progress.js schema v4 (limits derived from WORLDS.length and window.POKE_TOTAL; AWQ4 codes; AWQ3, JSON and legacy imports kept; unlocked10 and skills10 fields; Node-tested with phase10/test-progress.js).
- Not yet: wiring into index.html, the four 10a mini-games, badge case, globe map, art, narration clips, sw.js v14, any browser or device testing. main and the live game are unchanged.

## Phase 10a (branch phase10a, November 2, 2026): Badge Quest built

- New: phase10/bq-data.js, phase10/badge.js, phase10/badge.css; skills.js and stops-10a.js now loaded. Barkley Sound (English only), Honolulu and Paris, 9 keys, Water and Steel badges, 10 new Pokemon (30-39), four mini-games plus Salmon Leap, two Field Labs, evolution cinematic, Eevee path, 12-slot badge case, Yuki postcard.
- Top bar now shows keys out of 27 and Pokemon out of 40. Backup wording says AWQ4 (AWQ3 still imports). Service worker cache v14.
Tested in headless Chromium on a local server (not on a tablet):
- Full playthrough of Barkley Sound, Honolulu and Paris through real clicks: 9 stories, 9 questions with one wrong answer each (clue shown, no cost, Grit message), all 7 hidden spotters, lava vents (wrong order gives a steam hint), triangle tower (a square slides off), Salmon Leap, Sound Surf and Key Forge bosses with wrong taps, Water and Steel badges, stamp, three partners, Yuki postcard.
- Lava Letters: one letter traced with real mouse strokes, a scribble that does not count, left-hand mode, then the rest through a test hook. Magikarp's Climb: wrong tap, then 100 jumps reached and the Gyarados cinematic. Popplio to Brionne evolution after the magic e skill reached level 3. Eevee path choice saved.
- Top bar shows keys out of 27 and Pokemon out of 40; pets page gets a Badge Quest friends section.
- Save, reload (state identical), AWQ4 export and import, tampered bq10 data sanitised. AWQ3 import covered by phase10/test-progress.js.
- Service worker v14 caches 800 files; offline reload opens Badge Quest with art and narration.
- 375, 800 and 1280 px layouts; original trail, Explorer TV vault, Play Zone, every nav page and the Save and backup screen open with no page errors.
Not tested: a real Android tablet or PC browser, touch tracing by finger, narration and music by ear, audio ducking, Eevee evolution end to end (needs 3 real days of cvc practice), the shiny roll odds.
